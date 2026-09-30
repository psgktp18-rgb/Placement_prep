import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, User, Mail, Lock, GraduationCap, Target } from 'lucide-react';

export default function SignupPage({ onNavigateLogin }) {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'Computer Science',
    target_role: 'Software Engineer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const branches = [
    'Computer Science',
    'Information Technology',
    'Mechanical Engineering',
    'Electrical & Electronics',
    'Civil Engineering',
    'Commerce & Finance',
    'MBA / Management',
    'Humanities & Social Sciences'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(formData);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 mx-auto flex items-center justify-center text-2xl shadow-lg shadow-brand-600/40 mb-2">
            ✈️
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Candidate Registration</h1>
          <p className="text-xs text-slate-400 mt-1">Domain-Adaptive AI Placement Preparation</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Candidate Name"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@university.edu"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Branch (Domain Adaptability Key)</label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                {branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Placement Role</label>
            <div className="relative">
              <Target className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.target_role}
                onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                placeholder="e.g. Software Engineer, Financial Analyst, Design Engineer"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-brand-600/30 transition duration-200 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">
          Already registered?{' '}
          <button onClick={onNavigateLogin} className="text-brand-400 hover:underline font-semibold">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
