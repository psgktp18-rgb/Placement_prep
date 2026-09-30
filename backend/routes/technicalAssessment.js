const express = require('express');
const router = express.Router();
const dbStorage = require('../db/storage');
const aiService = require('../services/aiService');
const { authenticateToken } = require('../middleware/auth');

// POST /technical-assessment/generate
router.post('/generate', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const user = dbStorage.getUser(userId) || {
    branch: 'Computer Science',
    target_role: 'Software Engineer',
    resume_text: 'Proficient in data structures, algorithms, and web development.'
  };

  try {
    const questionsObj = await aiService.generateTechnicalQuestions(
      user.resume_text || user.resume_summary || '',
      user.branch || 'Computer Science',
      user.target_role || 'Software Engineer'
    );

    const isTech = ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'AI & ML'].includes(user.branch) || user.branch.toLowerCase().includes('computer') || user.branch.toLowerCase().includes('it');

    const assessmentId = 'tech_ass_' + Date.now().toString(36);
    const docData = dbStorage.setDocInSubcollection(userId, 'technical_assessments', assessmentId, {
      assessmentId,
      user_id: userId,
      branch: user.branch,
      target_role: user.target_role,
      question_type: isTech ? 'coding' : 'domain/case',
      question_1: questionsObj.question_1,
      question_2: questionsObj.question_2,
      answer_1: '',
      answer_2: '',
      score_1: null,
      score_2: null,
      feedback: null,
      created_at: new Date().toISOString()
    });

    return res.json({
      assessmentId,
      branch: user.branch,
      targetRole: user.target_role,
      questionType: isTech ? 'coding' : 'domain/case',
      question_1: questionsObj.question_1,
      question_2: questionsObj.question_2,
      assessment: docData
    });
  } catch (err) {
    console.error('Error generating technical assessment:', err);
    return res.status(500).json({ error: 'Failed to generate technical questions' });
  }
});

// POST /technical-assessment/submit
router.post('/submit', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { assessmentId, answer_1, answer_2 } = req.body;

  const user = dbStorage.getUser(userId) || { branch: 'Computer Science', target_role: 'Software Engineer' };

  let existing = dbStorage.getDocInSubcollection(userId, 'technical_assessments', assessmentId || 'default');
  if (!existing) {
    existing = {
      assessmentId: assessmentId || 'tech_ass_latest',
      user_id: userId,
      question_1: { title: 'Question 1', description: 'Core domain/coding concept' },
      question_2: { title: 'Question 2', description: 'Case problem / algorithmic optimization' }
    };
  }

  try {
    const res1 = await aiService.scoreTechnicalAnswer(
      existing.question_1 || { title: 'Q1', description: '' },
      answer_1 || '',
      user.branch,
      user.target_role
    );

    const res2 = await aiService.scoreTechnicalAnswer(
      existing.question_2 || { title: 'Q2', description: '' },
      answer_2 || '',
      user.branch,
      user.target_role
    );

    const mergedScores = {
      assessmentId: existing.assessmentId,
      user_id: userId,
      question_1: existing.question_1,
      question_2: existing.question_2,
      answer_1,
      answer_2,
      score_1: res1.score,
      score_2: res2.score,
      average_score: Math.round((res1.score + res2.score) / 2),
      feedback_1: res1,
      feedback_2: res2,
      submitted_at: new Date().toISOString()
    };

    dbStorage.setDocInSubcollection(userId, 'technical_assessments', existing.assessmentId, mergedScores);

    return res.json({
      success: true,
      assessmentId: existing.assessmentId,
      scores: mergedScores
    });
  } catch (err) {
    console.error('Error scoring technical assessment:', err);
    return res.status(500).json({ error: 'Failed to evaluate technical answers' });
  }
});

module.exports = router;
