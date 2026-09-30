import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Coffee, Brain, Target, CheckCircle2, Plus, Trash2, Bell } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'from-brand-600 to-indigo-600', emoji: '🎯' },
  short: { label: 'Short Break', duration: 5 * 60, color: 'from-emerald-500 to-teal-500', emoji: '☕' },
  long: { label: 'Long Break', duration: 15 * 60, color: 'from-sky-500 to-blue-600', emoji: '🌊' },
};

const TASK_SUGGESTIONS = [
  'DSA Problem Set — Arrays & Hashing',
  'Mock HR Interview Practice',
  'LeetCode Medium — 2 problems',
  'System Design Reading',
  'Aptitude Speed Drills',
  'Company Research — Goldman Sachs',
  'Behavioral STAR Story Prep',
];

const SESSION_STATS = [
  { label: 'Sessions Today', value: 3, icon: Brain, color: 'text-brand-600' },
  { label: 'Focus Time', value: '75 min', icon: Timer, color: 'text-indigo-600' },
  { label: 'Tasks Done', value: 2, icon: CheckCircle2, color: 'text-emerald-600' },
  { label: 'Streak', value: '5 days 🔥', icon: Target, color: 'text-orange-500' },
];

export default function StudyTimerPage() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete DSA module — Sliding Window', done: false },
    { id: 2, text: 'Practice 3 HR behavioral questions', done: true },
    { id: 3, text: 'Review System Design notes', done: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(MODES[mode].duration);
    setRunning(false);
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') setSessions(s => s + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const progress = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100;
  const circumference = 2 * Math.PI * 90;

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: newTask.trim(), done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));
  const deleteTask = (id) => setTasks(t => t.filter(task => task.id !== id));

  const reset = () => { setRunning(false); setTimeLeft(MODES[mode].duration); };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-1">
          <Timer className="w-5 h-5 text-brand-300" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Pomodoro Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold">Study Timer</h1>
        <p className="text-xs text-slate-300 mt-0.5">Stay in the zone. Beat the placement game.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SESSION_STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <Icon className={`w-5 h-5 ${s.color}`} />
              <div>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                <p className="font-extrabold text-slate-800 text-sm">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Timer Circle */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-xl">
            {Object.entries(MODES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${mode === key ? `bg-gradient-to-r ${val.color} text-white shadow` : 'text-slate-500 hover:text-slate-700'}`}
              >
                {val.emoji} {val.label}
              </button>
            ))}
          </div>

          {/* SVG Ring Timer */}
          <div className="relative flex items-center justify-center mb-8">
            <svg width="220" height="220" className="-rotate-90">
              <circle cx="110" cy="110" r="90" fill="none" stroke="#F1F5F9" strokeWidth="12" />
              <circle
                cx="110" cy="110" r="90" fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center">
              <span className="text-5xl font-black text-slate-800 tracking-tight font-mono">{fmt(timeLeft)}</span>
              <p className="text-xs text-slate-500 mt-1 font-semibold">{MODES[mode].label} • Session #{sessions + 1}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button onClick={reset} className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRunning(r => !r)}
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${MODES[mode].color} text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all`}
            >
              {running ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            <button onClick={() => setSessions(s => s + 1)} className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition">
              <Bell className="w-4 h-4" />
            </button>
          </div>

          {/* Pomodoro dots */}
          <div className="flex gap-2 mt-6">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full transition ${i < sessions % 4 ? 'bg-brand-600' : 'bg-slate-200'}`} />
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">{4 - (sessions % 4)} sessions until long break</p>
        </div>

        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-600" /> Session Tasks
            </h3>

            {/* Add task */}
            <div className="flex gap-2 mb-4">
              <input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="Add a task..."
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-slate-50"
              />
              <button onClick={addTask} className="w-9 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-xl flex items-center justify-center transition">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {tasks.map(task => (
                <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl border transition group ${task.done ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:border-brand-200'}`}>
                  <button onClick={() => toggleTask(task.id)} className={`w-4.5 h-4.5 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-brand-400'}`}>
                    {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`flex-1 text-xs leading-relaxed ${task.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>{task.text}</span>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add Suggestions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-500" /> Quick Add Goals
            </h4>
            <div className="space-y-1.5">
              {TASK_SUGGESTIONS.slice(0, 4).map((t, i) => (
                <button key={i} onClick={() => { setTasks(prev => [...prev, { id: Date.now() + i, text: t, done: false }]); }} className="w-full text-left text-[11px] px-3 py-2 rounded-lg bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-slate-600 border border-slate-100 hover:border-brand-200 transition">
                  + {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
