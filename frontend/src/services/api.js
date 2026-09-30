// In production (Vercel), set VITE_API_BASE_URL env variable to your backend URL.
// For local dev, falls back to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getAuthToken() {
  return localStorage.getItem('placementpilot_token') || '';
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data;
}

export const api = {
  // Auth
  signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/profile/me'),

  // Profile setup & PDF upload
  updateProfile: (formData) => request('/profile', { method: 'POST', body: formData }),

  // Step 1: Stateful HR Interview Chat
  startHrInterview: () => request('/hr-interview/start', { method: 'POST' }),
  sendHrMessage: (sessionId, studentMessage) => request('/hr-interview/message', { method: 'POST', body: JSON.stringify({ sessionId, studentMessage }) }),
  getHrSession: (sessionId) => request(`/hr-interview/session/${sessionId}`),

  // Step 2: Technical/Domain 2-Q Assessment
  generateTechAssessment: () => request('/technical-assessment/generate', { method: 'POST' }),
  submitTechAssessment: (payload) => request('/technical-assessment/submit', { method: 'POST', body: JSON.stringify(payload) }),

  // Step 3: Aptitude Quiz
  getAptitudeQuestions: () => request('/aptitude/questions'),
  submitAptitudeQuiz: (userAnswers) => request('/aptitude/submit', { method: 'POST', body: JSON.stringify({ userAnswers }) }),

  // Combined 5-Dimension Assessment & Plan
  getFinalScores: () => request('/assessment/final-scores'),
  getPlan: () => request('/plan'),
  generatePlan: () => request('/plan/generate', { method: 'POST' }),

  // Practice Arena & LeetCode Sync
  syncLeetCodeStats: (username) => request(`/leetcode/${username}/stats`),
  getPracticeTopics: () => request('/practice/topics'),
  markPracticeComplete: (payload) => request('/practice/mark-complete', { method: 'POST', body: JSON.stringify(payload) }),

  // Progress Center & Skill Gap
  getProgress: () => request('/progress'),

  // GD Simulation
  startGdSimulation: (topic) => request('/gd-simulation/start', { method: 'POST', body: JSON.stringify({ topic }) }),
  sendGdMessage: (gdId, candidateMessage) => request('/gd-simulation/message', { method: 'POST', body: JSON.stringify({ gdId, candidateMessage }) })
};
