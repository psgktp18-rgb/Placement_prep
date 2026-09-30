import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Map, CheckCircle2, Clock, PlayCircle, Sparkles, RefreshCw, Lock } from 'lucide-react';

export default function RoadmapPage({ onNavigateTab }) {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true);
    try {
      const res = await api.getPlan();
      setPlan(res.plan);
    } catch (err) {
      console.error('Error loading roadmap plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generatePlan();
      setPlan(res.plan);
    } catch (err) {
      alert('Error regenerating plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const topics = plan?.learn_topics || [
    { id: '1', title: 'Data Structures & Algorithmic Foundations', category: 'Technical', description: 'Arrays, HashMaps, Two Pointers, and Binary Search mastery.', estimated_hours: 8, status: 'In Progress' },
    { id: '2', title: 'Domain Core Case Frameworks & Applications', category: 'Domain', description: 'Profitability, Market Entry, and Operational Optimization frameworks.', estimated_hours: 6, status: 'Next Up' },
    { id: '3', title: 'Behavioral STAR HR Interview Preparation', category: 'Soft Skills', description: 'Structuring project conflict & achievement stories.', estimated_hours: 4, status: 'Locked' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase">
              {user?.branch || 'Computer Science'} Roadmap
            </span>
            <span className="text-xs text-slate-500">Target Role: {user?.target_role || 'Software Engineer'}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-800">Personalized Placement Preparation Stepper</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gemini AI generated path focusing on strengthening your evaluated weak dimensions.</p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-Generate AI Plan</span>
        </button>
      </div>

      {/* Vertical Stepper */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-8">
        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {topics.map((item, idx) => {
            const isCompleted = item.status === 'Completed';
            const isInProgress = item.status === 'In Progress';
            const isNextUp = item.status === 'Next Up';

            return (
              <div key={item.id || idx} className="relative flex items-start gap-4 group">
                {/* Node Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs absolute -left-9 top-0 z-10 transition ${
                  isCompleted ? 'bg-emerald-500 text-white shadow-md' :
                  isInProgress ? 'bg-brand-600 text-white shadow-lg ring-4 ring-brand-100' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isInProgress ? (
                    <Sparkles className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-slate-50 hover:bg-brand-50/40 p-5 rounded-2xl border border-slate-200 transition duration-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                      Module {idx + 1} • {item.category || 'General'}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' :
                      isInProgress ? 'bg-brand-100 text-brand-800' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {item.status || 'Active'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Est. {item.estimated_hours || 4} hours</span>
                    </div>

                    <button
                      onClick={() => onNavigateTab('practice')}
                      className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Start Practice Module</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
