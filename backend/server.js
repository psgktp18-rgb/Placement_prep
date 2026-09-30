require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const hrInterviewRouter = require('./routes/hrInterview');
const technicalAssessmentRouter = require('./routes/technicalAssessment');
const aptitudeRouter = require('./routes/aptitude');
const assessmentRouter = require('./routes/assessment');
const planRouter = require('./routes/plan');
const leetcodeRouter = require('./routes/leetcode');
const practiceRouter = require('./routes/practice');
const progressRouter = require('./routes/progress');
const gdSimulationRouter = require('./routes/gdSimulation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'PlacementPilot AI Backend',
    timestamp: new Date().toISOString(),
    geminiKeySet: !!process.env.GEMINI_API_KEY
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api', profileRouter);
app.use('/api/hr-interview', hrInterviewRouter);
app.use('/api/technical-assessment', technicalAssessmentRouter);
app.use('/api/aptitude', aptitudeRouter);
app.use('/api/assessment', assessmentRouter);
app.use('/api/plan', planRouter);
app.use('/api/leetcode', leetcodeRouter);
app.use('/api/practice', practiceRouter);
app.use('/api/progress', progressRouter);
app.use('/api/gd-simulation', gdSimulationRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 PlacementPilot AI Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🔑 Gemini Key Active: ${!!process.env.GEMINI_API_KEY}`);
  console.log(`===================================================`);
});
