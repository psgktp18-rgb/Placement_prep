const express = require('express');
const router = express.Router();
const dbStorage = require('../db/storage');
const { authenticateToken } = require('../middleware/auth');

// GET /progress
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const user = dbStorage.getUser(userId) || { branch: 'Computer Science', target_role: 'Software Engineer' };

  const snapshots = dbStorage.getSubcollection(userId, 'progress_snapshots');
  const assessments = dbStorage.getSubcollection(userId, 'assessments');

  // Build timeline data points if snapshots are empty
  let timeline = [];
  if (assessments.length > 0) {
    timeline = assessments.map((a, idx) => ({
      session: `Attempt ${idx + 1}`,
      date: new Date(a.created_at).toLocaleDateString(),
      technical: a.technical_score || 75,
      aptitude: a.aptitude_score || 80,
      communication: a.comm_score || 82,
      domain: a.skills_score || 78,
      readiness: a.overall_readiness || 80
    }));
  } else {
    // Demo progression data
    timeline = [
      { session: 'Initial Baseline', date: 'Week 1', technical: 65, aptitude: 70, communication: 72, domain: 68, readiness: 69 },
      { session: 'Post HR Drill', date: 'Week 2', technical: 72, aptitude: 75, communication: 82, domain: 74, readiness: 76 },
      { session: 'Current State', date: 'Week 3', technical: 82, aptitude: 84, communication: 88, domain: 81, readiness: 84 }
    ];
  }

  return res.json({
    user,
    totalAssessments: assessments.length,
    timeline,
    snapshots
  });
});

module.exports = router;
