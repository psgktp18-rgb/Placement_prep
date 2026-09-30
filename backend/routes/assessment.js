const express = require('express');
const router = express.Router();
const dbStorage = require('../db/storage');
const { mergeAssessmentScores } = require('../services/assessmentEngine');
const { authenticateToken } = require('../middleware/auth');

// GET /assessment/final-scores
router.get('/final-scores', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const user = dbStorage.getUser(userId) || { branch: 'Computer Science', target_role: 'Software Engineer' };

  // Fetch latest HR interview session
  const hrSessions = dbStorage.getSubcollection(userId, 'hr_interview_sessions');
  const latestHr = hrSessions.length > 0 ? hrSessions[hrSessions.length - 1] : null;
  const hrScores = (latestHr && latestHr.final_scores) ? latestHr.final_scores : {
    communication: 82,
    confidence: 85,
    relevance: 88,
    depth_of_answers: 79,
    overall_interview_readiness: 84
  };

  // Fetch latest Technical/Domain assessment
  const techAssessments = dbStorage.getSubcollection(userId, 'technical_assessments');
  const latestTech = techAssessments.length > 0 ? techAssessments[techAssessments.length - 1] : null;

  // Fetch latest Aptitude quiz
  const aptQuizzes = dbStorage.getSubcollection(userId, 'aptitude_quizzes');
  const latestApt = aptQuizzes.length > 0 ? aptQuizzes[aptQuizzes.length - 1] : null;
  const aptitudeScore = latestApt ? latestApt.score : 80;

  const merged = mergeAssessmentScores({
    hrScores,
    techScores: latestTech,
    aptitudeScore,
    branch: user.branch,
    targetRole: user.target_role
  });

  const assessmentId = 'ass_' + Date.now().toString(36);
  const assessmentDoc = dbStorage.setDocInSubcollection(userId, 'assessments', assessmentId, {
    assessmentId,
    user_id: userId,
    ...merged,
    hrScores,
    latestTech,
    aptitudeScore,
    created_at: new Date().toISOString()
  });

  // Save timeline progress snapshots for line chart visualization
  const dimensions = ['technical_score', 'aptitude_score', 'comm_score', 'skills_score', 'interview_score'];
  dimensions.forEach(dim => {
    const snapshotId = `snap_${dim}_${Date.now().toString(36)}`;
    dbStorage.setDocInSubcollection(userId, 'progress_snapshots', snapshotId, {
      userId,
      dimension: dim,
      score: merged[dim],
      timestamp: new Date().toISOString()
    });
  });

  return res.json({
    assessmentId,
    profileScores: merged,
    hrScores,
    latestTech,
    aptitudeScore,
    user,
    assessment: assessmentDoc
  });
});

module.exports = router;
