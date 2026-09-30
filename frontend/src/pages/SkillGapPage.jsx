import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Target, Sparkles, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export default function SkillGapPage({ onNavigateTab }) {
  const { user } = useAuth();
  const [scoresData, setScoresData] = useState(null);

  useEffect(() => {
    api.getFinalScores().then(res => setScoresData(res.profileScores)).catch(console.error);
  }, []);

  const data = [
    { dimension: 'Technical', current: scoresData?.technical_score || 78, benchmark: 85 },
    { dimension: 'Aptitude', current: scoresData?.aptitude_score || 80, benchmark: 80 },
    { dimension: 'Communication', current: scoresData?.comm_score || 84, benchmark: 85 },
    { dimension: 'Domain Knowledge', current: scoresData?.skills_score || 82, benchmark: 82 },
    { dimension: 'Interview Readiness', current: scoresData?.interview_score || 80, benchmark: 88 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase">
            Benchmark Rubric
          </span>
          <h1 className="text-xl font-extrabold text-slate-800 mt-1">Skill Gap Analysis & Benchmark Comparison</h1>
          <p className="text-xs text-slate-500">Target Role Benchmark: {user?.target_role || 'Software Engineer'}</p>
        </div>

        <button
          onClick={() => onNavigateTab('roadmap')}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          <span>Bridge Skill Gap via Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bar Chart Comparison */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-600" /> Current Competency vs. Target Role Benchmark
        </h3>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="dimension" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="current" name="Candidate Current Score" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              <Bar dataKey="benchmark" name="Target Role Benchmark" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3 Gemini Actionable Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-xs">
            <Sparkles className="w-4 h-4" /> Recommendation 1
          </div>
          <h4 className="font-bold text-sm text-slate-800">Optimize Time Complexity Explanations</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your technical approach is sound, but explicitly stating Big-O space/time complexity bounds upfront will elevate your technical score by +7 points.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-xs">
            <Sparkles className="w-4 h-4" /> Recommendation 2
          </div>
          <h4 className="font-bold text-sm text-slate-800">Structure Behavioral STAR Framework</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            When answering HR behavioral questions, clearly delineate the Situation, Task, Action, and Result with quantifiable metrics.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-xs">
            <Sparkles className="w-4 h-4" /> Recommendation 3
          </div>
          <h4 className="font-bold text-sm text-slate-800">Aptitude Speed Drills</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Practice 10-minute speed calculation drills for Quantitative & Data Interpretation to hit 90%+ accuracy in online screening rounds.
          </p>
        </div>
      </div>
    </div>
  );
}
