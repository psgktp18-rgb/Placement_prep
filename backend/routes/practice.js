const express = require('express');
const router = express.Router();
const dbStorage = require('../db/storage');
const { authenticateToken } = require('../middleware/auth');

const TECH_PRACTICE_TOPICS = [
  {
    id: 'tech_1',
    category: 'Arrays & Two Pointers',
    title: 'Sliding Window & Array Optimization',
    leetcode_slug: 'two-sum',
    url: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    solvedCount: 3,
    totalCount: 5
  },
  {
    id: 'tech_2',
    category: 'Data Structures',
    title: 'Trees & Graph Traversal (DFS/BFS)',
    leetcode_slug: 'binary-tree-inorder-traversal',
    url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
    difficulty: 'Medium',
    solvedCount: 2,
    totalCount: 4
  },
  {
    id: 'tech_3',
    category: 'Dynamic Programming',
    title: 'Subsequence & Knapsack Optimization',
    leetcode_slug: 'coin-change',
    url: 'https://leetcode.com/problems/coin-change/',
    difficulty: 'Medium-Hard',
    solvedCount: 1,
    totalCount: 4
  }
];

const NON_TECH_PRACTICE_TOPICS = [
  {
    id: 'non_tech_1',
    category: 'Finance & Accounting Case',
    title: 'Discounted Cash Flow (DCF) Valuation',
    url: '#',
    difficulty: 'Medium',
    solvedCount: 2,
    totalCount: 3,
    brief: 'Calculate the Net Present Value (NPV) and IRR for a renewable energy startup expansion plan.'
  },
  {
    id: 'non_tech_2',
    category: 'Mechanical / Core Engineering',
    title: 'Thermodynamics & Heat Transfer Optimization',
    url: '#',
    difficulty: 'Medium',
    solvedCount: 1,
    totalCount: 3,
    brief: 'Analyze thermal stress distribution in turbine blade cooling channels.'
  },
  {
    id: 'non_tech_3',
    category: 'MBA / Product Management',
    title: 'Product GTM & Market Entry Case Study',
    url: '#',
    difficulty: 'Hard',
    solvedCount: 1,
    totalCount: 2,
    brief: 'Formulate a 90-day launch strategy for an AI enterprise workflow assistant in Southeast Asia.'
  }
];

// GET /practice/topics
router.get('/topics', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const user = dbStorage.getUser(userId) || { branch: 'Computer Science' };

  const isTech = ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'AI & ML'].includes(user.branch) || user.branch.toLowerCase().includes('computer') || user.branch.toLowerCase().includes('it');

  const attempts = dbStorage.getSubcollection(userId, 'attempts');
  const solvedMap = {};
  attempts.forEach(a => {
    solvedMap[a.topicId] = true;
  });

  const topicsList = isTech ? TECH_PRACTICE_TOPICS : NON_TECH_PRACTICE_TOPICS;
  const enrichedTopics = topicsList.map(t => ({
    ...t,
    isSolved: !!solvedMap[t.id]
  }));

  return res.json({
    branch: user.branch,
    isTech,
    topics: enrichedTopics
  });
});

// POST /practice/mark-complete
router.post('/mark-complete', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { topicId, track, score, feedback } = req.body;

  const attemptId = 'att_' + Date.now().toString(36);
  const attemptDoc = dbStorage.setDocInSubcollection(userId, 'attempts', attemptId, {
    attemptId,
    userId,
    topicId,
    track: track || 'practice',
    score: score || 100,
    feedback: feedback || 'Completed problem successfully',
    timestamp: new Date().toISOString()
  });

  return res.json({ success: true, attempt: attemptDoc });
});

module.exports = router;
