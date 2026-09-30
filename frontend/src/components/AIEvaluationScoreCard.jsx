import React, { useState } from 'react';
import { Flag, CheckCircle2, ShieldCheck, Zap, Award, Sparkles, Sliders } from 'lucide-react';

export default function AIEvaluationScoreCard({ initialScore = 100, customTitle = "AI Evaluation Score" }) {
  const [score, setScore] = useState(initialScore);
  const [breakdown, setBreakdown] = useState({
    codeQuality: 100,
    security: 100,
    efficiency: 100,
    testing: 100,
    accessibility: 100,
    alignment: 100,
  });

  const isPerfect = score === 100;

  const setTo100 = () => {
    setScore(100);
    setBreakdown({
      codeQuality: 100,
      security: 100,
      efficiency: 100,
      testing: 100,
      accessibility: 100,
      alignment: 100,
    });
  };

  const setSample64 = () => {
    setScore(64.67);
    setBreakdown({
      codeQuality: 71,
      security: 78,
      efficiency: 60,
      testing: 55,
      accessibility: 45,
      alignment: 88,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6 transition-all duration-300">
      {/* Header & Main Score */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">{customTitle}</h2>
            {isPerfect && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1 border border-emerald-300 animate-pulse">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                100 Marks Perfect
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Automated AI Code Quality & Performance Breakdown</p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={setTo100}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isPerfect 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Set 100 Marks</span>
          </button>

          <button
            onClick={setSample64}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              !isPerfect ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Reset (64.67)
          </button>
        </div>
      </div>

      {/* Main Score Banner */}
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            {typeof score === 'number' ? score.toFixed(2).replace('.00', '') : score}
          </span>
          <span className="text-slate-400 font-semibold text-lg">/100</span>
        </div>

        {/* Main Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              score >= 90
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400'
                : score >= 70
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-orange-500 to-red-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      </div>

      {/* Detailed Score Breakdown */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <span>Detailed Score Breakdown</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            6 Evaluation Vectors
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Code Quality */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-slate-700">
                <Flag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Code Quality</span>
              </div>
              <span className="font-extrabold text-slate-900">{breakdown.codeQuality}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.codeQuality}%` }}
              />
            </div>
          </div>

          {/* 2. Security */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-slate-700">
                <Flag className="w-3.5 h-3.5 text-indigo-500" />
                <span>Security</span>
              </div>
              <span className="font-extrabold text-slate-900">{breakdown.security}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.security}%` }}
              />
            </div>
          </div>

          {/* 3. Efficiency */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-slate-700">
                <Flag className="w-3.5 h-3.5 text-blue-500" />
                <span>Efficiency</span>
              </div>
              <span className="font-extrabold text-slate-900">{breakdown.efficiency}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.efficiency}%` }}
              />
            </div>
          </div>

          {/* 4. Testing */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-slate-700">
                <Flag className="w-3.5 h-3.5 text-purple-500" />
                <span>Testing</span>
              </div>
              <span className="font-extrabold text-slate-900">{breakdown.testing}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.testing}%` }}
              />
            </div>
          </div>

          {/* 5. Accessibility */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-slate-700">
                <Flag className="w-3.5 h-3.5 text-teal-500" />
                <span>Accessibility</span>
              </div>
              <span className="font-extrabold text-slate-900">{breakdown.accessibility}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.accessibility}%` }}
              />
            </div>
          </div>

          {/* 6. Problem Statement Alignment */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-slate-700">
                <Flag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Problem Statement Alignment</span>
              </div>
              <span className="font-extrabold text-slate-900">{breakdown.alignment}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.alignment}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
