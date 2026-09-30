const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbStorage = require('../db/storage');
const { JWT_SECRET } = require('../middleware/auth');

// POST /auth/signup
router.post('/signup', (req, res) => {
  const { name, email, password, branch, target_role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const userId = 'usr_' + Date.now().toString(36);
  const password_hash = bcrypt.hashSync(password, 8);

  const userProfile = {
    id: userId,
    name: name || email.split('@')[0],
    email,
    password_hash,
    branch: branch || 'Computer Science',
    target_role: target_role || 'Software Engineer',
    resume_url: null,
    resume_summary: '',
    leetcode_username: ''
  };

  dbStorage.setUserProfile(userId, userProfile);

  const token = jwt.sign({ id: userId, email, name: userProfile.name }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: userProfile });
});

// POST /auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Quick demo login preset check
  if (email === 'demo@cs.ai' || email === 'demo@finance.ai') {
    const isCs = email === 'demo@cs.ai';
    const userId = isCs ? 'demo_cs_user' : 'demo_finance_user';
    const demoUser = {
      id: userId,
      name: isCs ? 'Alex Chen (CS)' : 'Sophia Sharma (Finance)',
      email,
      branch: isCs ? 'Computer Science' : 'Commerce & Finance',
      target_role: isCs ? 'Software Engineer' : 'Financial Analyst',
      resume_summary: isCs ? 'Proficient in React, Node.js, DSA algorithms, and SQL.' : 'Proficient in Valuation, Financial Modeling, Excel, and Market Analysis.',
      leetcode_username: isCs ? 'alexchen_dev' : ''
    };
    dbStorage.setUserProfile(userId, demoUser);
    const token = jwt.sign({ id: userId, email, name: demoUser.name }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: demoUser });
  }

  const userId = 'usr_' + Buffer.from(email).toString('hex').slice(0, 10);
  let user = dbStorage.getUser(userId);
  if (!user) {
    // Create new profile on login if first time
    user = {
      id: userId,
      name: email.split('@')[0],
      email,
      branch: 'Computer Science',
      target_role: 'Software Engineer',
      resume_summary: '',
      leetcode_username: ''
    };
    dbStorage.setUserProfile(userId, user);
  }

  const token = jwt.sign({ id: userId, email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user });
});

module.exports = router;
