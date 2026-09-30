import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RadarChartComponent from '../components/RadarChartComponent';
import AIEvaluationScoreCard from '../components/AIEvaluationScoreCard';
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Building2, 
  ArrowUpRight, 
  Award, 
  ChevronRight,
  BookOpen,
  Flame,
  Zap,
  Trophy,
  Clock,
  Star
} from 'lucide-react';

const COMPANY_PIPELINE = [
  { name: 'Google', logo: '🔵', role: 'SWE Intern', status: 'Applied', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { name: 'Microsoft', logo: '🟦', role: 'SDE-1', status: 'OA Scheduled', color: 'bg-sky-50 text-sky-800 border-sky-200' },
  { name: 'Amazon', logo: '🟠', role: 'SDE-1', status: 'Shortlisted', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { name: 'Deloitte', logo: '🟢', role: 'Tech Analyst', status: 'Interview', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { name: 'Goldman Sachs', logo: '⚫', role: 'Quant Dev', status: 'Watching', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { name: 'Flipkart', logo: '🟡', role: 'SDE Intern', status: 'Watching', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
];

const RECENT_ACTIVITIES = [
  { icon: '✅', text: 'Completed DSA Module — Arrays & Two Pointers', time: '2h ago', color: 'text-emerald-600' },
  { icon: '🎯', text: 'Daily Challenge — 4/5 correct (80% accuracy)', time: '5h ago', color: 'text-amber-600' },
  { icon: '🤖', text: 'Mock HR Interview completed — Score: 88%', time: '1d ago', color: 'text-brand-600' },
  { icon: '📄', text: 'Amazon SDE-1 application submitted via OA', time: '2d ago', color: 'text-orange-600' },
  { icon: '🏆', text: 'Leaderboard rank improved: #28 → #23', time: '3d ago', color: 'text-indigo-600' },
];

export default function DashboardPage({ onNavigateTab }) {
  const { user } = useAuth();
  const [assessmentData, setAssessmentData] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [scoresRes, planRes] = await Promise.all([
        api.getFinalScores(),
        api.getPlan()
      ]);
      setAssessmentData(scoresRes.profileScores);
      setPlanData(planRes.plan);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const scores = assessmentData || {
    technical_score: 82,
    aptitude_score: 84,
    comm_score: 88,
    skills_score: 80,
    interview_score: 85,
    overall_readiness: 84
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase">
              {user?.branch || 'Computer Science'} Domain
            </span>
            <span className="text-xs text-brand-200">Target: {user?.target_role || 'Software Engineer'}</span>
            <span className="flex items-center gap-1 text-[11px] text-orange-300 font-bold">
              <Flame className="w-3 h-3" /> 5-day streak
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome back, {user ? user.name : 'Candidate'} 👋
          </h1>
          <p className="text-xs text-brand-100 mt-0.5">
            Your Placement Readiness Index is up <span className="text-emerald-300 font-bold">+12%</span> since last baseline. Rank: <span className="text-amber-300 font-bold">#23 nationally</span>.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onNavigateTab('daily_challenge')}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>Daily Challenge</span>
          </button>
          <button
            onClick={() => onNavigateTab('assessment')}
            className="px-5 py-2.5 bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Re-Take AI Assessment</span>
          </button>
        </div>
      </div>

      {/* 4-Column Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Readiness Index</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{scores.overall_readiness}%</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Placement Tier
            </p>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-brand-600 border-t-brand-200 flex items-center justify-center font-extrabold text-brand-600 text-sm shadow-inner">
            {scores.overall_readiness}%
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Practice Solved</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">18 / 24</h3>
            <p className="text-[11px] text-brand-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 75% Complete
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Leaderboard Rank</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">#23</h3>
            <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <Trophy className="w-3.5 h-3.5" /> Top 15% nationally
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Companies Tracking</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">6 Active</h3>
            <p className="text-[11px] text-slate-500 mt-1">1 Interview scheduled</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* AI Evaluation Score Section (100 Marks Breakdown) */}
      <AIEvaluationScoreCard initialScore={100} customTitle="AI Evaluation Score" />

      {/* Middle Row: Radar Chart & AI Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">5-Dimension Placement Competency Profile</h3>
              <p className="text-xs text-slate-500">Comparing your evaluated scores against target benchmark</p>
            </div>
            <button
              onClick={() => onNavigateTab('skill_gap')}
              className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>View Skill Gap</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <RadarChartComponent scores={scores} />
        </div>

        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-brand-700/60 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                ✨
              </div>
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">Gemini AI Recommendation</span>
            </div>

            <h4 className="font-extrabold text-base text-white leading-snug">
              Focus on Technical Question Optimization this week!
            </h4>

            <p className="text-xs text-brand-100 leading-relaxed">
              {planData?.ai_recommendation || "Your communication and HR scores are excellent (88%). Pushing your technical problem solving from 82% to 88% will place you in the top 5% candidate pool for Software Engineer roles."}
            </p>

            <div className="space-y-2 pt-2">
              {['Complete 2 LeetCode Medium daily', 'Practice System Design — URL Shortener', 'Review Big-O Notation cheatsheet'].map((tip, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-brand-200">
                  <Star className="w-3 h-3 text-amber-400 shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('roadmap')}
            className="w-full py-3 bg-white text-brand-900 hover:bg-brand-50 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 mt-6"
          >
            <span>Open Personalized Roadmap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Company Pipeline */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" /> Company Application Pipeline
          </h3>
          <button onClick={() => onNavigateTab('news')} className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-0.5">
            Find More <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {COMPANY_PIPELINE.map((c, i) => (
            <div key={i} className={`p-3 rounded-xl border text-center space-y-1.5 ${c.color}`}>
              <div className="text-2xl">{c.logo}</div>
              <p className="font-bold text-xs truncate">{c.name}</p>
              <p className="text-[10px] opacity-70 truncate">{c.role}</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/60 block truncate">{c.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Roadmap Progress + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Roadmap */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-600" /> Active Roadmap Modules
            </h3>
            <button onClick={() => onNavigateTab('roadmap')} className="text-xs text-brand-600 font-bold hover:underline">
              Full View →
            </button>
          </div>
          <div className="space-y-3">
            {(planData?.learn_topics || [
              { title: 'DSA & Algorithmic Problem Solving', status: 'In Progress', category: 'Technical', estimated_hours: 8 },
              { title: 'Core Domain Case Frameworks', status: 'Next Up', category: 'Domain', estimated_hours: 6 },
              { title: 'Behavioral STAR HR Interview Prep', status: 'Locked', category: 'Soft Skills', estimated_hours: 4 }
            ]).slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  item.status === 'In Progress' ? 'bg-brand-100 text-brand-700' :
                  item.status === 'Next Up' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-800 truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-800">{item.category}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {item.estimated_hours}h</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  item.status === 'In Progress' ? 'bg-brand-100 text-brand-700' :
                  item.status === 'Next Up' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-500'
                }`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" /> Recent Activity
            </h3>
            <button onClick={() => onNavigateTab('progress')} className="text-xs text-brand-600 font-bold hover:underline">
              Full Log →
            </button>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base shrink-0 mt-0.5">{act.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 font-medium leading-snug">{act.text}</p>
                  <p className={`text-[10px] font-semibold mt-0.5 ${act.color}`}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
