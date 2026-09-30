const express = require('express');
const router = express.Router();
const dbStorage = require('../db/storage');
const aiService = require('../services/aiService');
const { authenticateToken } = require('../middleware/auth');

// POST /hr-interview/start
router.post('/start', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const user = dbStorage.getUser(userId) || {
    name: 'Candidate',
    branch: 'Computer Science',
    target_role: 'Software Engineer',
    resume_summary: 'Targeting graduate placement position with strong academic foundations.'
  };

  const sessionId = 'hr_sess_' + Date.now().toString(36);

  try {
    const firstQuestion = await aiService.startHrChatSession(sessionId, user);

    const initialHistory = [
      { role: 'assistant', message: firstQuestion, timestamp: new Date().toISOString() }
    ];

    const sessionDoc = dbStorage.setDocInSubcollection(userId, 'hr_interview_sessions', sessionId, {
      sessionId,
      user_id: userId,
      conversation_history: initialHistory,
      status: 'in_progress',
      current_turn: 1,
      total_turns: 5,
      final_scores: null,
      created_at: new Date().toISOString()
    });

    return res.json({
      sessionId,
      message: firstQuestion,
      turn: 1,
      totalTurns: 5,
      session: sessionDoc
    });
  } catch (err) {
    console.error('Error starting HR interview session:', err);
    return res.status(500).json({ error: 'Failed to start HR interview session' });
  }
});

// POST /hr-interview/message
router.post('/message', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { sessionId, studentMessage } = req.body;

  if (!sessionId || !studentMessage) {
    return res.status(400).json({ error: 'sessionId and studentMessage are required' });
  }

  let sessionDoc = dbStorage.getDocInSubcollection(userId, 'hr_interview_sessions', sessionId);
  if (!sessionDoc) {
    // If session doc missing, initialize a fresh session doc
    sessionDoc = {
      sessionId,
      user_id: userId,
      conversation_history: [],
      status: 'in_progress',
      current_turn: 1,
      total_turns: 5
    };
  }

  const user = dbStorage.getUser(userId) || {
    branch: 'Computer Science',
    target_role: 'Software Engineer'
  };

  const history = sessionDoc.conversation_history || [];
  const currentTurn = (sessionDoc.current_turn || history.length) + 1;

  // Append user message
  history.push({
    role: 'user',
    message: studentMessage,
    timestamp: new Date().toISOString()
  });

  try {
    const aiResponseText = await aiService.sendHrChatMessage(
      sessionId,
      studentMessage,
      currentTurn,
      user
    );

    history.push({
      role: 'assistant',
      message: aiResponseText,
      timestamp: new Date().toISOString()
    });

    const isCompleted = currentTurn >= 5;
    let finalScores = null;

    if (isCompleted) {
      // Trigger SEPARATE final scoring call after exchange 5 finishes
      finalScores = await aiService.scoreHrInterview(history, user);
    }

    const updatedSession = dbStorage.setDocInSubcollection(userId, 'hr_interview_sessions', sessionId, {
      ...sessionDoc,
      conversation_history: history,
      current_turn: currentTurn,
      status: isCompleted ? 'completed' : 'in_progress',
      final_scores: finalScores,
      completed_at: isCompleted ? new Date().toISOString() : null
    });

    return res.json({
      sessionId,
      replyMessage: aiResponseText,
      turn: currentTurn,
      totalTurns: 5,
      isCompleted,
      finalScores,
      session: updatedSession
    });
  } catch (err) {
    console.error('Error processing HR interview message:', err);
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// GET /hr-interview/session/:sessionId
router.get('/session/:sessionId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;
  const sessionDoc = dbStorage.getDocInSubcollection(userId, 'hr_interview_sessions', sessionId);
  if (!sessionDoc) {
    return res.status(404).json({ error: 'Session not found' });
  }
  return res.json({ session: sessionDoc });
});

module.exports = router;
