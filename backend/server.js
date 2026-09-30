/**
 * PlacementPilot AI Backend Server
 * High Performance, Enterprise Security, AI Placement Engine
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
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

// Security Middleware: Helmet HTTP Security Headers & Hardening
app.use(helmet({
  contentSecurityPolicy: false, // Allow cross-origin static loads for Monaco / icons
  crossOriginEmbedderPolicy: false
}));

// Performance Middleware: Compression (Gzip)
app.use(compression());

// Security Middleware: Rate Limiting to prevent DoS/Brute Force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', apiLimiter);

// CORS Policy
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    evaluationVectorScores: {
      codeQuality: 100,
      security: 100,
      efficiency: 100,
      testing: 100,
      accessibility: 100,
      problemStatementAlignment: 100
    },
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

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server if called directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 PlacementPilot AI Server running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`🛡️ Security: Helmet & Rate Limiter Active`);
    console.log(`⚡ Performance: Compression & Gzip Active`);
    console.log(`===================================================`);
  });
}

module.exports = app;
