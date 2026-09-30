const express = require('express');
const router = express.Router();
const dbStorage = require('../db/storage');
const aiService = require('../services/aiService');
const { authenticateToken } = require('../middleware/auth');

// GET /plan
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const user = dbStorage.getUser(userId) || { branch: 'Computer Science', target_role: 'Software Engineer' };

  const existingPlans = dbStorage.getSubcollection(userId, 'plans');
  if (existingPlans.length > 0) {
    return res.json({ plan: existingPlans[existingPlans.length - 1] });
  }

  // Generate initial plan if none exists
  return generateAndSavePlan(userId, user, res);
});

// POST /plan/generate
router.post('/generate', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const user = dbStorage.getUser(userId) || { branch: 'Computer Science', target_role: 'Software Engineer' };
  return generateAndSavePlan(userId, user, res);
});

async function generateAndSavePlan(userId, user, res) {
  const assessments = dbStorage.getSubcollection(userId, 'assessments');
  const latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : {
    technical_score: 78,
    aptitude_score: 80,
    comm_score: 84,
    skills_score: 82,
    interview_score: 80
  };

  try {
    const planObj = await aiService.generatePersonalizedPlan(
      user.branch || 'Computer Science',
      user.target_role || 'Software Engineer',
      latestAssessment
    );

    const planId = 'plan_' + Date.now().toString(36);
    const planDoc = dbStorage.setDocInSubcollection(userId, 'plans', planId, {
      planId,
      user_id: userId,
      branch: user.branch,
      target_role: user.target_role,
      learn_topics: planObj.learn_topics || [],
      practice_topics: planObj.practice_topics || [],
      interview_focus: planObj.interview_focus || [],
      ai_recommendation: planObj.ai_recommendation || 'Focus on strengthening weak assessment areas.',
      generated_at: new Date().toISOString()
    });

    return res.json({ plan: planDoc });
  } catch (err) {
    console.error('Error generating placement plan:', err);
    return res.status(500).json({ error: 'Failed to generate plan' });
  }
}

module.exports = router;
