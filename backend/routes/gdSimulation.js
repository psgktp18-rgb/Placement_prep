const express = require('express');
const router = express.Router();
const dbStorage = require('../db/storage');
const aiService = require('../services/aiService');
const { authenticateToken } = require('../middleware/auth');

const DEFAULT_GD_TOPICS = [
  "Will Generative AI Replace Entry-Level Software Engineers & Analysts?",
  "Centralized Online Campus Placements vs. Direct Off-Campus Hiring",
  "Is Work-From-Home (WFH) Sustainable for Long-Term Career Growth in Core Industries?"
];

// POST /gd-simulation/start
router.post('/start', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const user = dbStorage.getUser(userId) || { branch: 'Computer Science', target_role: 'Software Engineer' };

  const topic = req.body.topic || DEFAULT_GD_TOPICS[0];
  const gdId = 'gd_' + Date.now().toString(36);

  const initialHistory = [
    {
      speaker: 'Moderator',
      avatar: '🎙️',
      role: 'Moderator',
      message: `Welcome to the Placement GD Round. Topic: "${topic}". Remember to contribute clear data-backed arguments, listen attentively, and build consensus. Aarav, please open.`
    },
    {
      speaker: 'Aarav',
      avatar: '👨‍💼',
      role: 'Analytical Participant',
      message: `Thank you. From a data perspective, AI tools reduce initial screening cycles by 60%, enabling companies to focus human interview capacity on final culture fit.`
    },
    {
      speaker: 'Priya',
      avatar: '👩‍💼',
      role: 'Critical Participant',
      message: `While efficiency improves, automated screening risks bias and overlooks non-traditional candidates with high growth potential. What is your perspective on this, ${user.name || 'candidate'}?`
    }
  ];

  const gdSession = dbStorage.setDocInSubcollection(userId, 'gd_sessions', gdId, {
    gdId,
    user_id: userId,
    topic,
    history: initialHistory,
    created_at: new Date().toISOString()
  });

  return res.json({
    gdId,
    topic,
    history: initialHistory,
    session: gdSession
  });
});

// POST /gd-simulation/message
router.post('/message', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { gdId, candidateMessage } = req.body;

  const user = dbStorage.getUser(userId) || { branch: 'Computer Science', target_role: 'Software Engineer' };
  let session = dbStorage.getDocInSubcollection(userId, 'gd_sessions', gdId || 'latest');

  const history = session ? (session.history || []) : [];
  const topic = session ? session.topic : DEFAULT_GD_TOPICS[0];

  history.push({
    speaker: user.name || 'You',
    avatar: '🎓',
    role: 'Candidate',
    message: candidateMessage,
    timestamp: new Date().toISOString()
  });

  try {
    const gdTurn = await aiService.simulateGdTurn(
      topic,
      history,
      candidateMessage,
      user.branch,
      user.target_role
    );

    history.push({
      speaker: 'Aarav',
      avatar: '👨‍💼',
      role: 'Analytical Participant',
      message: gdTurn.aarav_response,
      timestamp: new Date().toISOString()
    });

    history.push({
      speaker: 'Priya',
      avatar: '👩‍💼',
      role: 'Critical Participant',
      message: gdTurn.priya_response,
      timestamp: new Date().toISOString()
    });

    const updatedSession = dbStorage.setDocInSubcollection(userId, 'gd_sessions', gdId || 'gd_latest', {
      gdId: gdId || 'gd_latest',
      user_id: userId,
      topic,
      history,
      last_feedback: gdTurn.candidate_quick_feedback
    });

    return res.json({
      success: true,
      history,
      nextPrompt: gdTurn.next_prompt,
      quickFeedback: gdTurn.candidate_quick_feedback,
      session: updatedSession
    });
  } catch (err) {
    console.error('Error in GD simulation turn:', err);
    return res.status(500).json({ error: 'Failed to simulate GD turn' });
  }
});

module.exports = router;
