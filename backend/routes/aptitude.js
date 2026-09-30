const express = require('express');
const router = express.Router();
const dbStorage = require('../db/storage');
const { authenticateToken } = require('../middleware/auth');

const APTITUDE_QUESTION_BANK = [
  {
    id: 'apt_1',
    category: 'Quantitative Aptitude',
    question: 'A train 150 meters long passes a telegraph post in 10 seconds. What is the speed of the train in km/h?',
    options: ['36 km/h', '54 km/h', '60 km/h', '72 km/h'],
    correctAnswer: 1 // 54 km/h (15 m/s * 18/5 = 54)
  },
  {
    id: 'apt_2',
    category: 'Logical Reasoning',
    question: 'If ALL CATS ARE DOGS and SOME DOGS ARE BIRDS, which of the following is logically guaranteed?',
    options: ['All cats are birds', 'Some dogs are cats', 'No birds are dogs', 'All birds are cats'],
    correctAnswer: 1 // Some dogs are cats
  },
  {
    id: 'apt_3',
    category: 'Verbal Ability',
    question: 'Choose the word that is most nearly OPPOSITE in meaning to "CANDID":',
    options: ['Frank', 'Deceitful', 'Outspoken', 'Sincere'],
    correctAnswer: 1 // Deceitful
  },
  {
    id: 'apt_4',
    category: 'Data Interpretation',
    question: 'A company revenue grew from $2.0M to $2.5M in Year 1, and $3.0M in Year 2. What is the overall percentage growth from Start to Year 2?',
    options: ['25%', '40%', '50%', '60%'],
    correctAnswer: 2 // 50%
  },
  {
    id: 'apt_5',
    category: 'Analytical Thinking',
    question: 'Complete the pattern sequence: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '48'],
    correctAnswer: 2 // 42 (+4, +6, +8, +10, +12)
  }
];

// GET /aptitude/questions
router.get('/questions', authenticateToken, (req, res) => {
  const sanitizeQuestions = APTITUDE_QUESTION_BANK.map(q => ({
    id: q.id,
    category: q.category,
    question: q.question,
    options: q.options
  }));
  return res.json({ questions: sanitizeQuestions });
});

// POST /aptitude/submit
router.post('/submit', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { userAnswers } = req.body; // map of question ID to chosen option index

  let correctCount = 0;
  const totalQuestions = APTITUDE_QUESTION_BANK.length;
  const breakdown = [];

  APTITUDE_QUESTION_BANK.forEach(q => {
    const selected = userAnswers ? userAnswers[q.id] : null;
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correctCount++;
    breakdown.push({
      id: q.id,
      category: q.category,
      selected,
      correctAnswer: q.correctAnswer,
      isCorrect
    });
  });

  const score = Math.round((correctCount / totalQuestions) * 100);
  const quizId = 'apt_quiz_' + Date.now().toString(36);

  const quizDoc = dbStorage.setDocInSubcollection(userId, 'aptitude_quizzes', quizId, {
    quizId,
    user_id: userId,
    score,
    correctCount,
    totalQuestions,
    userAnswers,
    breakdown,
    submitted_at: new Date().toISOString()
  });

  return res.json({
    success: true,
    quizId,
    score,
    correctCount,
    totalQuestions,
    breakdown,
    quiz: quizDoc
  });
});

module.exports = router;
