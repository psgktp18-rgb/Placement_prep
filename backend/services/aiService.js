const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Read prompt files
function loadPrompt(filename) {
  const filePath = path.join(__dirname, '../prompts', filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return '';
}

// In-memory store for active Gemini chat sessions (for multi-turn HR interview)
const activeChatSessions = new Map();

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  }

  getGenerativeModel(options = {}) {
    if (!this.genAI) return null;
    try {
      return this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: options.generationConfig || {}
      });
    } catch (e) {
      console.warn('Gemini model init warning, falling back to gemini-3.8-flash:', e.message);
      return this.genAI.getGenerativeModel({
        model: 'gemini-3.8-flash',
        generationConfig: options.generationConfig || {}
      });
    }
  }

  async retryGeminiCall(operationName, requestFn, fallbackValue, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await requestFn();
      } catch (err) {
        const retryable = /429|500|503|timeout|temporar|high demand|resource_exhausted|overloaded|rate limit/i.test(err.message || '');
        if (!retryable || attempt >= maxAttempts) {
          console.error(`${operationName} error, fallback activated:`, err.message);
          return fallbackValue;
        }

        const delayMs = 800 * attempt;
        console.warn(`${operationName} retry ${attempt}/${maxAttempts} in ${delayMs}ms:`, err.message);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return fallbackValue;
  }

  async generateJsonWithRetry(operationName, prompt, fallbackValue) {
    return this.retryGeminiCall(
      operationName,
      async () => {
        const model = this.getGenerativeModel({
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });

        if (!model) {
          return fallbackValue;
        }

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
      },
      fallbackValue,
      3
    );
  }

  // --- Step 1: Stateful HR Interview Chat ---
  async startHrChatSession(sessionId, candidateInfo) {
    const rawSystemPrompt = loadPrompt('hrPersonaSystemPrompt.txt');
    const resumeContext = candidateInfo.resume_text || candidateInfo.resume_summary || 'Final year student with strong core fundamentals';
    const systemPrompt = rawSystemPrompt
      .replace('{target_role}', candidateInfo.target_role || 'Software Engineer')
      .replace('{resume_summary}', resumeContext)
      .replace('{conversation_history}', '');

    if (this.genAI) {
      try {
        const model = this.getGenerativeModel({
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 350
          }
        });

        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: `System Context & HR Interview Instructions:\n${systemPrompt}\n\nPlease begin the interview by introducing yourself briefly as the HR interviewer and asking your first resume-specific question.` }]
            }
          ]
        });

        activeChatSessions.set(sessionId, chat);

        const result = await this.retryGeminiCall(
          'Gemini chat session',
          async () => await chat.sendMessage('Begin interview.'),
          null,
          3
        );

        if (result && result.response && typeof result.response.text === 'function') {
          return result.response.text().trim();
        }
      } catch (err) {
        console.error('Gemini chat error, falling back:', err.message);
      }
    }

    // Deterministic Fallback
    const firstQuestion = `Hello ${candidateInfo.name || 'candidate'}! Welcome to your HR round for ${candidateInfo.target_role || 'Placement'}. I noticed your background in ${candidateInfo.branch || 'Engineering'}. Could you walk me through your most impactful project listed on your resume and your specific role in it?`;
    
    // Store simple state for fallback
    activeChatSessions.set(sessionId, {
      fallback: true,
      turn: 1,
      candidateInfo
    });
    return firstQuestion;
  }

  async sendHrChatMessage(sessionId, studentMessage, turnCount, candidateInfo) {
    if (this.genAI && activeChatSessions.has(sessionId)) {
      const chat = activeChatSessions.get(sessionId);
      if (chat && typeof chat.sendMessage === 'function') {
        try {
          let promptSuffix = studentMessage;
          if (turnCount >= 5) {
            promptSuffix += "\n[System: This is exchange 5. End the interview naturally with a closing remark. Do NOT ask another question.]";
          }
          const result = await chat.sendMessage(promptSuffix);
          return result.response.text().trim();
        } catch (err) {
          console.error('Error sending Gemini HR message:', err.message);
        }
      }
    }

    // Fallback turns if API key missing or chat fails
    const fallbackQuestions = {
      2: "That sounds impressive! What was the single biggest technical or domain challenge you encountered during that project, and how did you resolve it?",
      3: "Great problem-solving approach. How do you handle tight deadlines or conflicting priorities when working in a team environment?",
      4: "Thank you for sharing. Where do you see yourself professionally in the next 2-3 years within this target role?",
      5: "Excellent responses today. Thank you so much for taking the time for this interview — that's all I needed. Best of luck with your placement results!"
    };

    return fallbackQuestions[turnCount] || "Thank you for your response! Good luck with your upcoming placement rounds.";
  }

  // --- Final HR Interview Transcript Scoring ---
  async scoreHrInterview(transcript, candidateInfo) {
    const rawPrompt = loadPrompt('hrFinalScoring.txt');
    const resumeContext = candidateInfo.resume_text || candidateInfo.resume_summary || 'N/A';
    const prompt = rawPrompt
      .replace('{target_role}', candidateInfo.target_role || 'Target Role')
      .replace('{branch}', candidateInfo.branch || 'General')
      .replace('{resume_summary}', resumeContext)
      .replace('{transcript}', JSON.stringify(transcript, null, 2));

    if (this.genAI) {
      const scoredResult = await this.generateJsonWithRetry('Gemini HR scoring', prompt, null);
      if (scoredResult) {
        return scoredResult;
      }
    }

    // Fallback deterministic scores
    return {
      communication: 82,
      confidence: 85,
      relevance: 88,
      depth_of_answers: 79,
      overall_interview_readiness: 84,
      feedback_summary: "Strong articulate communication and domain clarity. Work on quantifying achievements with STAR metrics.",
      strengths: [
        "Articulate response delivery",
        "Clear project role description"
      ],
      improvements: [
        "Include more concrete performance metrics",
        "Structure behavioral scenario answers"
      ]
    };
  }

  // --- Step 2: Question Generation (2 Resume-Based Questions) ---
  async generateTechnicalQuestions(resumeText, branch, targetRole) {
    const normalizedBranch = branch || 'General';
    const isTech = ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'AI & ML'].includes(normalizedBranch) || normalizedBranch.toLowerCase().includes('computer') || normalizedBranch.toLowerCase().includes('it');
    const questionType = isTech ? 'coding' : 'domain/case';

    const rawPrompt = loadPrompt('questionGen.txt');
    const prompt = rawPrompt
      .replace('{resume_text}', resumeText || 'Standard placement candidate resume')
      .replace('{branch}', branch || 'General')
      .replace('{target_role}', targetRole || 'Graduate Trainee')
      .replace('{question_type}', questionType);

    if (this.genAI) {
      const generated = await this.generateJsonWithRetry('Gemini question gen', prompt, null);
      if (generated) {
        return generated;
      }
    }

    // Fallback questions based on tech vs non-tech
    if (isTech) {
      return {
        question_1: {
          id: 'q1',
          title: 'Array Two-Sum Target Index Lookup',
          description: 'Given an array of integers `nums` and an integer `target`, write an efficient function to return indices of the two numbers such that they add up to `target`.',
          difficulty: 'Easy',
          category: 'Data Structures & Algorithms',
          sample_input_or_context: 'Input: nums = [2,7,11,15], target = 9 -> Output: [0,1]'
        },
        question_2: {
          id: 'q2',
          title: 'Longest Substring Without Repeating Characters',
          description: 'Given a string `s`, find the length of the longest substring without repeating characters. Describe your approach and time complexity.',
          difficulty: 'Medium',
          category: 'Strings & Sliding Window',
          sample_input_or_context: 'Input: s = "abcabcbb" -> Output: 3 ("abc")'
        }
      };
    } else {
      return {
        question_1: {
          id: 'q1',
          title: 'Core Domain Fundamentals & Application',
          description: `Explain a key core principle in ${branch || 'your domain'} and how you applied it in your recent project or academic coursework to achieve a practical outcome.`,
          difficulty: 'Easy',
          category: 'Domain Core Concepts',
          sample_input_or_context: 'Provide a structured answer detailing context, methodology, and results.'
        },
        question_2: {
          id: 'q2',
          title: 'Domain Case Study & Problem Resolution',
          description: `Analyze a scenario where a ${targetRole || 'professional'} faces a 15% budget reduction or supply chain delay. Outline your 3-step action plan to mitigate risk while maintaining efficiency.`,
          difficulty: 'Medium',
          category: 'Case Framework & Strategic Problem Solving',
          sample_input_or_context: 'Focus on trade-off analysis, stakeholder communication, and metric tracking.'
        }
      };
    }
  }

  // --- Step 2: Score Technical/Domain Answer ---
  async scoreTechnicalAnswer(question, studentAnswer, branch, targetRole) {
    const rawPrompt = loadPrompt('technicalScoring.txt');
    const prompt = rawPrompt
      .replace('{question_title}', question.title || '')
      .replace('{question_description}', question.description || '')
      .replace('{question_type}', question.type || 'technical')
      .replace('{target_role}', targetRole || 'Target Role')
      .replace('{branch}', branch || 'General')
      .replace('{student_answer}', studentAnswer || '');

    if (this.genAI) {
      const scoredAnswer = await this.generateJsonWithRetry('Gemini tech scoring', prompt, null);
      if (scoredAnswer) {
        return scoredAnswer;
      }
    }

    // Fallback score
    const len = (studentAnswer || '').trim().length;
    const baseScore = Math.min(92, Math.max(65, 70 + Math.floor(len / 15)));
    return {
      score: baseScore,
      accuracy_score: baseScore + 2,
      clarity_score: baseScore - 2,
      feedback: "Good structured response demonstrating practical domain understanding and logical flow.",
      strengths: ["Clear problem breakdown", "Logical step sequencing"],
      improvements: ["Add concrete metrics or complexity bounds"]
    };
  }

  // --- Resume PDF Text Extraction ---
  async extractResumeDetails(rawText, branch, targetRole) {
    const rawPrompt = loadPrompt('resumeExtraction.txt');
    const prompt = rawPrompt
      .replace('{raw_resume_text}', rawText.slice(0, 3000))
      .replace('{branch}', branch || 'General')
      .replace('{target_role}', targetRole || 'Target Role');

    if (this.genAI) {
      const extracted = await this.generateJsonWithRetry('Gemini resume extraction', prompt, null);
      if (extracted) {
        return extracted;
      }
    }

    // Fallback extraction
    return {
      summary: `Enthusiastic candidate in ${branch || 'Engineering/Management'} aiming for ${targetRole || 'Target Role'}. Possesses strong fundamental academic training and project execution experience.`,
      key_skills: branch.toLowerCase().includes('computer') ? ["Data Structures", "JavaScript", "React", "SQL", "Problem Solving"] : ["Project Planning", "Financial Modeling", "Data Analysis", "Communication", "Domain Research"],
      highlighted_projects: ["Academic Major Capstone Project", "Domain Placement Internship"],
      experience_level: "Fresher"
    };
  }

  // --- Plan Generation ---
  async generatePersonalizedPlan(branch, targetRole, scores) {
    const rawPrompt = loadPrompt('planGeneration.txt');
    const prompt = rawPrompt
      .replace('{branch}', branch)
      .replace('{target_role}', targetRole)
      .replace('{technical_score}', scores.technical_score)
      .replace('{aptitude_score}', scores.aptitude_score)
      .replace('{comm_score}', scores.comm_score)
      .replace('{skills_score}', scores.skills_score)
      .replace('{interview_score}', scores.interview_score);

    if (this.genAI) {
      const plan = await this.generateJsonWithRetry('Gemini plan gen', prompt, null);
      if (plan) {
        return plan;
      }
    }

    // Fallback personalized plan
    const isTech = branch.toLowerCase().includes('computer') || branch.toLowerCase().includes('it');
    return {
      learn_topics: isTech ? [
        { id: 'l1', title: 'Data Structures & Algorithms Core', category: 'Technical', description: 'Arrays, HashMaps, Two Pointers, and Binary Search mastery.', estimated_hours: 8, status: 'In Progress' },
        { id: 'l2', title: 'System Design & Web Architecture', category: 'Technical', description: 'REST APIs, Database indexing, and frontend state management.', estimated_hours: 6, status: 'Next Up' },
        { id: 'l3', title: 'HR Behavioral STAR Method', category: 'Soft Skills', description: 'Structuring project conflict & achievement stories.', estimated_hours: 4, status: 'Locked' }
      ] : [
        { id: 'l1', title: 'Domain Core Case Frameworks', category: 'Domain', description: 'Profitability, Market Entry, and Operational Optimization frameworks.', estimated_hours: 8, status: 'In Progress' },
        { id: 'l2', title: 'Quantitative Data Interpretation', category: 'Aptitude', description: 'Pie charts, financial ratios, and business stats breakdown.', estimated_hours: 6, status: 'Next Up' },
        { id: 'l3', title: 'Group Discussion & Leadership Poise', category: 'Soft Skills', description: 'Assertive point delivery and consensus building.', estimated_hours: 4, status: 'Locked' }
      ],
      practice_topics: isTech ? [
        { id: 'p1', title: 'LeetCode Top 50 Interview Array Problems', type: 'coding', difficulty: 'Easy-Medium', description: 'Focus on sliding window and array mutation patterns.' },
        { id: 'p2', title: 'SQL Query & Schema Design Drills', type: 'coding', difficulty: 'Medium', description: 'JOINs, GROUP BY aggregations, and subqueries.' }
      ] : [
        { id: 'p1', title: 'Financial Valuation & Statement Analysis Case', type: 'case_study', difficulty: 'Medium', description: 'Evaluate cash flow statements for a growth enterprise.' },
        { id: 'p2', title: 'Aptitude Speed Math & Logical Syllogisms', type: 'case_study', difficulty: 'Easy', description: 'Time-bounded speed calculation techniques.' }
      ],
      interview_focus: [
        `Master STAR technique for ${targetRole} behavioral rounds`,
        `Practice deep-dive explanations of listed resume projects`
      ],
      ai_recommendation: `Focus on improving your Technical & Aptitude performance this week to push your overall placement readiness above 85%!`
    };
  }

  // --- Group Discussion (GD) Simulation ---
  async simulateGdTurn(gdTopic, history, candidateMessage, branch, targetRole) {
    const rawPrompt = loadPrompt('gdSimulation.txt');
    const prompt = rawPrompt
      .replace('{gd_topic}', gdTopic)
      .replace('{branch}', branch)
      .replace('{target_role}', targetRole)
      .replace('{gd_history}', JSON.stringify(history))
      .replace('{candidate_message}', candidateMessage);

    if (this.genAI) {
      const gdResponse = await this.generateJsonWithRetry('Gemini GD sim', prompt, null);
      if (gdResponse) {
        return gdResponse;
      }
    }

    // Fallback GD responses
    return {
      aarav_response: "I agree with your structural point. Looking at the data, companies adopting this strategy saw a 20% improvement in efficiency.",
      priya_response: "That's a valid angle, but what about the upfront implementation costs? Small enterprises might struggle with that transition.",
      next_prompt: "How would you respond to Priya's point regarding implementation cost barriers?",
      candidate_quick_feedback: "Strong initial contribution! Be sure to address financial feasibility in your next turn."
    };
  }
}

module.exports = new AIService();
