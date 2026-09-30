import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { LineChart as LineChartIcon, TrendingUp, Calendar, Award, CheckCircle2, Flame, Code, MessageSquare } from 'lucide-react';
import AIEvaluationScoreCard from '../components/AIEvaluationScoreCard';

const MOCK_SESSIONS = [
  { date: 'Sep 1', activity: 'Initial Assessment', score: 69, type: 'assessment' },
  { date: 'Sep 5', activity: 'DSA Practice — Arrays', score: 75, type: 'practice' },
  { date: 'Sep 8', activity: 'Mock HR Interview', score: 80, type: 'interview' },
  { date: 'Sep 12', activity: 'Aptitude Quiz', score: 82, type: 'quiz' },
  { date: 'Sep 15', activity: 'GD Simulation', score: 78, type: 'gd' },
  { date: 'Sep 18', activity: 'Technical Assessment', score: 82, type: 'tech' },
  { date: 'Sep 22', activity: 'Mock HR Interview 2', score: 85, type: 'interview' },
  { date: 'Sep 25', activity: 'System Design Practice', score: 80, type: 'practice' },
  { date: 'Sep 28', activity: 'Full Mock Assessment', score: 84, type: 'assessment' },
  { date: 'Sep 30', activity: 'Daily Challenge', score: 88, type: 'quiz' },
];

const SESSION_TYPE_ICONS = {
  assessment: { icon: '🎯', color: 'bg-brand-100 text-brand-800' },
  practice: { icon: '💻', color: 'bg-slate-100 text-slate-700' },
  interview: { icon: '🤖', color: 'bg-indigo-100 text-indigo-800' },
  quiz: { icon: '⚡', color: 'bg-amber-100 text-amber-800' },
  gd: { icon: '🗣️', color: 'bg-emerald-100 text-emerald-800' },
  tech: { icon: '🔧', color: 'bg-rose-100 text-rose-800' },
};

export default function ProgressCenterPage() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const res = await api.getProgress();
      setProgressData(res);
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const timeline = progressData?.timeline || [
    { session: 'Baseline', date: 'Week 1', technical: 65, aptitude: 70, communication: 72, domain: 68, readiness: 69 },
    { session: 'Week 2', date: 'Week 2', technical: 70, aptitude: 74, communication: 76, domain: 72, readiness: 74 },
    { session: 'Mid-Review', date: 'Week 3', technical: 75, aptitude: 78, communication: 82, domain: 76, readiness: 78 },
    { session: 'Week 4', date: 'Week 4', technical: 79, aptitude: 81, communication: 85, domain: 78, readiness: 81 },
    { session: 'Current', date: 'Week 5', technical: 82, aptitude: 84, communication: 88, domain: 81, readiness: 84 },
  ];

  const stats = [
    { label: 'Total Sessions', value: '10', icon: Calendar, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Practice Problems', value: '42', icon: Code, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Mock Interviews', value: '4', icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Current Streak', value: '5 days 🔥', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase">
            Timeline Analytics
          </span>
          <h1 className="text-xl font-extrabold text-slate-800 mt-1">Progress Center & Score Trajectory</h1>
          <p className="text-xs text-slate-500">Tracking score snapshots across all 5 profile dimensions over time.</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Net Improvement</p>
            <p className="text-sm font-extrabold text-emerald-700">+15% Score Gain</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                <p className="font-extrabold text-slate-800 text-sm">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Evaluation Score Widget (100 Marks Breakdown) */}
      <AIEvaluationScoreCard initialScore={100} customTitle="AI Evaluation Score & Vectors" />

      {/* Area Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <LineChartIcon className="w-4 h-4 text-brand-600" /> 5-Dimension Performance Trend
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="techGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="session" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="technical" stroke="#7C3AED" strokeWidth={2.5} fill="url(#techGrad)" name="Technical Skill" />
              <Line type="monotone" dataKey="aptitude" stroke="#3B82F6" strokeWidth={2} name="Aptitude" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="communication" stroke="#10B981" strokeWidth={2} name="Communication" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="domain" stroke="#F59E0B" strokeWidth={2} name="Domain Knowledge" dot={{ r: 3 }} />
              <Area type="monotone" dataKey="readiness" stroke="#6366F1" strokeWidth={3} fill="url(#readGrad)" strokeDasharray="5 5" name="Overall Readiness" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Session Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-600" /> Session Activity Log
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {MOCK_SESSIONS.slice().reverse().map((session, i) => {
            const typeInfo = SESSION_TYPE_ICONS[session.type] || SESSION_TYPE_ICONS.practice;
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition">
                <span className={`text-sm px-2.5 py-1.5 rounded-xl font-medium ${typeInfo.color} shrink-0`}>
                  {typeInfo.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{session.activity}</p>
                  <p className="text-xs text-slate-500">{session.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full" style={{ width: `${session.score}%` }} />
                  </div>
                  <span className="text-sm font-extrabold text-slate-700 w-10 text-right">{session.score}%</span>
                  {session.score >= 80 && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
