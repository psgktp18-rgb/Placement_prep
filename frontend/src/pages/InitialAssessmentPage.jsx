import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Editor from '@monaco-editor/react';
import TypingIndicator from '../components/TypingIndicator';
import { 
  Sparkles, 
  MessageSquare, 
  Code, 
  CheckCircle2, 
  Send, 
  HelpCircle, 
  Award,
  ArrowRight,
  Brain,
  Zap
} from 'lucide-react';

export default function InitialAssessmentPage({ onAssessmentComplete }) {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(1); // 1: HR Chat, 2: Technical/Domain, 3: Aptitude

  // --- Step 1: HR Chat State ---
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [turn, setTurn] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [hrScores, setHrScores] = useState(null);
  const chatEndRef = useRef(null);

  // --- Step 2: Technical / Domain Assessment State ---
  const [techAssessment, setTechAssessment] = useState(null);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [scoringTech, setScoringTech] = useState(false);
  const [techResults, setTechResults] = useState(null);

  // --- Step 3: Aptitude Quiz State ---
  const [aptQuestions, setAptQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [aptResult, setAptResult] = useState(null);

  const isTech = user && (
    ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'AI & ML'].includes(user.branch) ||
    (user.branch && (user.branch.toLowerCase().includes('computer') || user.branch.toLowerCase().includes('it')))
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Start HR Chat Session on mount
  useEffect(() => {
    startHrChat();
  }, []);

  const startHrChat = async () => {
    setIsTyping(true);
    try {
      const res = await api.startHrInterview();
      setSessionId(res.sessionId);
      setMessages([{ role: 'assistant', text: res.message }]);
      setTurn(res.turn || 1);
    } catch (err) {
      console.error('Failed to start HR chat:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendHrMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const studentMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: studentMsg }]);
    setIsTyping(true);

    try {
      const res = await api.sendHrMessage(sessionId, studentMsg);
      setTurn(res.turn);
      setMessages(prev => [...prev, { role: 'assistant', text: res.replyMessage }]);

      if (res.isCompleted && res.finalScores) {
        setHrScores(res.finalScores);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Step 2 Question Generator
  const loadTechQuestions = async () => {
    setScoringTech(true);
    try {
      const res = await api.generateTechAssessment();
      setTechAssessment(res);
      // Pre-fill clean template
      if (res.questionType === 'coding') {
        setAnswer1(`// Solution for ${res.question_1.title}\nfunction solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`);
        setAnswer2(`// Solution for ${res.question_2.title}\nfunction lengthOfLongestSubstring(s) {\n  let set = new Set(), max = 0, l = 0;\n  for (let r = 0; r < s.length; r++) {\n    while (set.has(s[r])) {\n      set.delete(s[l]);\n      l++;\n    }\n    set.add(s[r]);\n    max = Math.max(max, r - l + 1);\n  }\n  return max;\n}`);
      } else {
        setAnswer1(`1. Core Concept Overview:\nThe key principle relies on structuring clear baseline operational metrics.\n\n2. Practical Application:\nApplied this framework during capstone coursework to analyze cost variance.`);
        setAnswer2(`3-Step Mitigation Plan:\nStep 1: Stakeholder Alignment and Priority Audit\nStep 2: Resource Re-allocation\nStep 3: Metric Monitoring & KPI Tracking`);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setScoringTech(false);
    }
  };

  const handleNextToStep2 = () => {
    setActiveStep(2);
    if (!techAssessment) {
      loadTechQuestions();
    }
  };

  const handleSubmitTechAnswers = async () => {
    setScoringTech(true);
    try {
      const res = await api.submitTechAssessment({
        assessmentId: techAssessment?.assessmentId,
        answer_1: answer1,
        answer_2: answer2
      });
      setTechResults(res.scores);
    } catch (err) {
      alert('Error scoring assessment: ' + err.message);
    } finally {
      setScoringTech(false);
    }
  };

  // Step 3 Aptitude Questions
  const loadAptitudeQuestions = async () => {
    try {
      const res = await api.getAptitudeQuestions();
      setAptQuestions(res.questions || []);
    } catch (err) {
      console.error('Error loading aptitude:', err);
    }
  };

  const handleNextToStep3 = () => {
    setActiveStep(3);
    if (aptQuestions.length === 0) {
      loadAptitudeQuestions();
    }
  };

  const handleSelectAptAnswer = (qId, optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitAptitude = async () => {
    try {
      const res = await api.submitAptitudeQuiz(userAnswers);
      setAptResult(res);
    } catch (err) {
      alert('Error submitting quiz: ' + err.message);
    }
  };

  const handleFinishAllAssessments = async () => {
    try {
      await api.getFinalScores(); // merges all step scores into 5 profile dimensions
      if (onAssessmentComplete) {
        onAssessmentComplete();
      }
    } catch (err) {
      alert('Error computing final scores: ' + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Step Wizard Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
            AI
          </div>
          <div>
            <h2 className="font-extrabold text-slate-800 text-base">Initial AI Placement Assessment</h2>
            <p className="text-xs text-slate-500">Domain-Adaptive Closed-Loop Evaluation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStep(1)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeStep === 1 ? 'bg-brand-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>1. HR Chat</span>
          </button>

          <button
            onClick={handleNextToStep2}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeStep === 2 ? 'bg-brand-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>2. {isTech ? 'Coding Qs' : 'Domain Qs'}</span>
          </button>

          <button
            onClick={handleNextToStep3}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeStep === 3 ? 'bg-brand-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>3. Aptitude Quiz</span>
          </button>
        </div>
      </div>

      {/* ================= STEP 1: AI HR INTERVIEW CHAT ================= */}
      {activeStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[560px]">
            {/* Chat Banner */}
            <div className="p-4 border-b border-slate-100 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold shadow">
                  HR
                </div>
                <div>
                  <h3 className="font-bold text-sm">Gemini AI HR Recruiter</h3>
                  <p className="text-[11px] text-brand-300">Live Stateful Interview • Turn {turn} of 5</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                {user?.target_role || 'Target Role'}
              </span>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} chat-bubble-anim`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {m.role === 'assistant' && (
                      <p className="font-bold text-[10px] text-brand-600 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Gemini HR Recruiter:
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && <TypingIndicator label="Gemini HR Recruiter is typing follow-up..." />}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendHrMessage} className="p-3 bg-white border-t border-slate-200 rounded-b-2xl flex gap-2">
              <input
                type="text"
                disabled={turn > 5 || isTyping}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={turn > 5 ? "Interview exchanges completed. Click 'Proceed to Step 2' ->" : "Type your detailed answer to the HR recruiter..."}
                className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 font-medium"
              />
              <button
                type="submit"
                disabled={turn > 5 || isTyping || !inputText.trim()}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-1"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Live Scoring Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-600" /> HR Session Monitor
              </h3>

              <div className="p-3 bg-brand-50/70 border border-brand-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-brand-900">
                  <span>Exchange Progress</span>
                  <span>{turn} / 5</span>
                </div>
                <div className="w-full bg-brand-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-brand-600 h-full transition-all duration-300" style={{ width: `${(turn / 5) * 100}%` }}></div>
                </div>
              </div>

              {hrScores ? (
                <div className="space-y-3 bg-slate-900 text-white p-4 rounded-xl text-xs">
                  <div className="flex items-center justify-between font-extrabold text-amber-400 text-sm border-b border-slate-800 pb-2">
                    <span>Interview Readiness:</span>
                    <span>{hrScores.overall_interview_readiness}%</span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Communication:</span>
                      <span className="font-bold text-white">{hrScores.communication}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence & Poise:</span>
                      <span className="font-bold text-white">{hrScores.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Relevance:</span>
                      <span className="font-bold text-white">{hrScores.relevance}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Depth of Answers:</span>
                      <span className="font-bold text-white">{hrScores.depth_of_answers}%</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
                    "{hrScores.feedback_summary}"
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2 text-xs text-slate-500">
                  <Zap className="w-6 h-6 text-brand-500 mx-auto" />
                  <p>Complete all 5 exchange turns. Gemini will run a separate final transcript evaluation after exchange 5.</p>
                </div>
              )}
            </div>

            <button
              onClick={handleNextToStep2}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 mt-4"
            >
              <span>Proceed to Step 2 ({isTech ? 'Coding Questions' : 'Domain Case Questions'})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: 2 RESUME-BASED QUESTIONS ================= */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-brand-100 text-brand-800 font-bold uppercase">
                  Step 2: Resume-Based Assessment
                </span>
                <h2 className="text-lg font-extrabold text-slate-800 mt-1">
                  {isTech ? '2 Technical Coding Questions' : '2 Core Domain & Case Questions'}
                </h2>
                <p className="text-xs text-slate-500">Tailored specifically to skills listed in candidate resume ({user?.branch})</p>
              </div>
              <button
                onClick={loadTechQuestions}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Re-Generate Questions
              </button>
            </div>

            {scoringTech && !techAssessment && (
              <div className="p-8 text-center text-slate-500 text-xs font-semibold animate-pulse">
                Gemini AI is reading candidate resume text and generating 2 targeted placement questions...
              </div>
            )}

            {techAssessment && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Question 1 */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-brand-700">Question 1 (Easy Warm-Up)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {techAssessment.question_1?.difficulty || 'Easy'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">{techAssessment.question_1?.title}</h4>
                  <p className="text-xs text-slate-600">{techAssessment.question_1?.description}</p>

                  <label className="block text-[11px] font-bold text-slate-700 mt-2">Your Answer Submission:</label>
                  {isTech ? (
                    <div className="h-44 border border-slate-300 rounded-xl overflow-hidden">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={answer1}
                        onChange={(v) => setAnswer1(v || '')}
                        options={{ fontSize: 12, minimap: { enabled: false } }}
                      />
                    </div>
                  ) : (
                    <textarea
                      rows={6}
                      value={answer1}
                      onChange={(e) => setAnswer1(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  )}
                </div>

                {/* Question 2 */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-700">Question 2 (Medium Placement Round)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                      {techAssessment.question_2?.difficulty || 'Medium'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">{techAssessment.question_2?.title}</h4>
                  <p className="text-xs text-slate-600">{techAssessment.question_2?.description}</p>

                  <label className="block text-[11px] font-bold text-slate-700 mt-2">Your Answer Submission:</label>
                  {isTech ? (
                    <div className="h-44 border border-slate-300 rounded-xl overflow-hidden">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={answer2}
                        onChange={(v) => setAnswer2(v || '')}
                        options={{ fontSize: 12, minimap: { enabled: false } }}
                      />
                    </div>
                  ) : (
                    <textarea
                      rows={6}
                      value={answer2}
                      onChange={(e) => setAnswer2(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Results Feedback Box */}
            {techResults && (
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-brand-300 text-sm">
                  <span>Gemini Evaluation Average Score:</span>
                  <span className="text-amber-400 font-extrabold text-base">{techResults.average_score} / 100</span>
                </div>
                <p className="text-slate-300">{techResults.feedback_1?.feedback}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleSubmitTechAnswers}
                disabled={scoringTech}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {scoringTech ? 'Evaluating with Gemini...' : 'Submit Answers for AI Review'}
              </button>

              <button
                onClick={handleNextToStep3}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <span>Proceed to Step 3 (Aptitude Quiz)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: 5-QUESTION APTITUDE QUIZ ================= */}
      {activeStep === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold uppercase">
                Step 3: General Aptitude & Reasoning
              </span>
              <h2 className="text-lg font-extrabold text-slate-800 mt-1">5-Question Speed Aptitude Quiz</h2>
              <p className="text-xs text-slate-500">Quantitative, Logical Reasoning, Verbal Ability & Data Interpretation</p>
            </div>

            {aptResult && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm border border-emerald-300">
                Score: {aptResult.score}% ({aptResult.correctCount}/5 Correct)
              </span>
            )}
          </div>

          <div className="space-y-4">
            {aptQuestions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Q{idx + 1}. {q.category}</span>
                  {aptResult && (
                    <span className={userAnswers[q.id] === aptResult.breakdown[idx]?.correctAnswer ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {userAnswers[q.id] === aptResult.breakdown[idx]?.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-slate-900 text-xs">{q.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAptAnswer(q.id, optIdx)}
                      className={`p-2.5 rounded-lg border text-left font-medium transition ${
                        userAnswers[q.id] === optIdx
                          ? 'bg-brand-600 text-white border-brand-600 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={handleSubmitAptitude}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Grade Aptitude Test
            </button>

            <button
              onClick={handleFinishAllAssessments}
              className="px-6 py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-slate-900 text-white font-bold text-sm rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Assessment & View 5-Dimension Radar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
