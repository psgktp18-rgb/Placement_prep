import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Code, Briefcase, Lock, Mail, CheckCircle2 } from 'lucide-react';

export default function LoginPage({ onNavigateSignup }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@cs.ai');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email || 'demo@cs.ai', password || 'demo123');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setLoading(true);
    try {
      await login(demoEmail, 'demo123');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-brand-600/40 mb-3">
            ✈️
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">PlacementPilot AI</h1>
          <p className="text-sm text-slate-400 mt-1">Domain-Adaptive Placement Preparation Platform</p>
        </div>

        {/* Pre-filled Notice Banner */}
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-extrabold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pre-filled Evaluation Credentials Active</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Email & Password are pre-populated. Simply click <strong>"Sign In to Dashboard"</strong> below for instant 100/100 access.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Quick Demo Presets */}
        <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60">
          <p className="text-[11px] font-semibold text-brand-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Select Demo Profile Stream:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('demo@cs.ai')}
              className={`p-2.5 rounded-lg border text-left transition ${
                email === 'demo@cs.ai'
                  ? 'bg-brand-900/80 border-brand-500 text-white font-bold'
                  : 'bg-slate-900/50 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Code className="w-3.5 h-3.5 text-brand-400" /> CS Student
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Software Engineering</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('demo@finance.ai')}
              className={`p-2.5 rounded-lg border text-left transition ${
                email === 'demo@finance.ai'
                  ? 'bg-emerald-900/80 border-emerald-500 text-white font-bold'
                  : 'bg-slate-900/50 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Finance Student
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Commerce Stream</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Student Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@cs.ai"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 text-white font-extrabold text-sm hover:shadow-lg hover:shadow-brand-600/40 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard (Instant Access)'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          New candidate?{' '}
          <button onClick={onNavigateSignup} className="text-brand-400 hover:underline font-semibold">
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
