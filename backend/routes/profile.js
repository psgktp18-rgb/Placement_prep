const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const dbStorage = require('../db/storage');
const aiService = require('../services/aiService');
const { authenticateToken } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });
const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// POST /profile (Update user profile & optional PDF parse)
router.post('/profile', authenticateToken, upload.single('resume_file'), async (req, res) => {
  const userId = req.user.id;
  let user = dbStorage.getUser(userId) || {};

  const { name, branch, target_role, leetcode_username, resume_text } = req.body;

  let extractedSummary = user.resume_summary || '';
  let parsedText = resume_text || user.resume_text || '';
  let savedResumeUrl = user.resume_url || '';
  let savedResumeName = user.resume_file_name || '';

  if (req.file && req.file.mimetype === 'application/pdf') {
    const safeFileName = `resume_${userId}_${Date.now()}.pdf`;
    const filePath = path.join(uploadsDir, safeFileName);
    fs.writeFileSync(filePath, req.file.buffer);
    savedResumeUrl = `/uploads/${safeFileName}`;
    savedResumeName = req.file.originalname || safeFileName;

    try {
      const pdfData = await pdfParse(req.file.buffer);
      parsedText = pdfData.text || parsedText;
    } catch (err) {
      console.warn('PDF parsing warning:', err.message);
    }
  }

  if (parsedText && parsedText.trim().length > 10) {
    try {
      const extracted = await aiService.extractResumeDetails(parsedText, branch || user.branch, target_role || user.target_role);
      extractedSummary = extracted.summary || parsedText.slice(0, 300);
    } catch (e) {
      extractedSummary = parsedText.slice(0, 300);
    }
  } else if (!extractedSummary) {
    extractedSummary = `Student in ${branch || 'General Engineering'} targeting ${target_role || 'Target Role'}.`;
  }

  const updatedProfile = dbStorage.setUserProfile(userId, {
    ...user,
    name: name || user.name,
    branch: branch || user.branch || 'Computer Science',
    target_role: target_role || user.target_role || 'Software Engineer',
    leetcode_username: leetcode_username !== undefined ? leetcode_username : (user.leetcode_username || ''),
    resume_text: parsedText,
    resume_summary: extractedSummary,
    resume_url: savedResumeUrl,
    resume_file_name: savedResumeName
  });

  return res.json({ success: true, profile: updatedProfile });
});

// GET /profile/me
router.get('/profile/me', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const user = dbStorage.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  return res.json({ profile: user });
});

module.exports = router;
