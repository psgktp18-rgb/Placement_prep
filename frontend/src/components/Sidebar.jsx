import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Code, 
  MessageSquare, 
  Users, 
  LineChart, 
  Target, 
  UserCheck, 
  Sparkles,
  Award,
  Trophy,
  Timer,
  Newspaper,
  Zap,
  Flame
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user }) {
  const isTech = user && (
    ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'AI & ML'].includes(user.branch) ||
    (user.branch && (user.branch.toLowerCase().includes('computer') || user.branch.toLowerCase().includes('it')))
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assessment', label: 'Initial AI Assessment', icon: Sparkles, highlight: true },
    { id: 'roadmap', label: 'My Roadmap', icon: Map },
    { id: 'practice', label: 'Practice Arena', icon: Code, badge: isTech ? 'LeetCode' : 'Case Studies' },
    { id: 'interview', label: 'Interview Practice', icon: MessageSquare },
    { id: 'gd_simulation', label: 'GD Simulation', icon: Users },
    { id: 'progress', label: 'Progress Center', icon: LineChart },
    { id: 'skill_gap', label: 'Skill Gap Analysis', icon: Target },
  ];

  const extraItems = [
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: '#23', badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'daily_challenge', label: 'Daily Challenge', icon: Zap, badge: 'NEW', badgeColor: 'bg-orange-500/20 text-orange-300', pulse: true },
    { id: 'news', label: 'Placement News', icon: Newspaper, badge: '8', badgeColor: 'bg-blue-500/20 text-blue-300' },
    { id: 'study_timer', label: 'Study Timer', icon: Timer },
    { id: 'profile', label: 'Profile Setup', icon: UserCheck },
  ];

  const renderNavBtn = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/25 font-semibold'
            : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-brand-400' : 'text-slate-400'}`} />
          <span>{item.label}</span>
          {item.pulse && !isActive && (
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          )}
        </div>
        {item.badge && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl select-none z-20">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-600/30">
          ✈️
        </div>
        <div>
          <h1 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1.5">
            PlacementPilot <span className="text-xs px-2 py-0.5 rounded-full bg-brand-600/30 text-brand-300 font-semibold border border-brand-500/40">AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Domain-Adaptive Prep</p>
        </div>
      </div>

      {/* User Domain Badge */}
      <div className="px-4 py-3 bg-slate-800/60 mx-3 my-3 rounded-xl border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">{user ? user.name : 'Student Candidate'}</p>
            <p className="text-[11px] text-brand-400 font-medium truncate">{user ? user.branch : 'General'}</p>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-brand-900/60 text-brand-300 font-mono text-[10px] uppercase border border-brand-700/50">
            {isTech ? 'TECH' : 'NON-TECH'}
          </span>
        </div>
        {/* XP / Streak mini bar */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-[62%] bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full" />
          </div>
          <span className="text-[10px] text-slate-400 font-mono shrink-0">620 XP</span>
          <span className="flex items-center gap-0.5 text-[10px] text-orange-400 font-bold">
            <Flame className="w-3 h-3" /> 5
          </span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3.5 pb-1 pt-2">Prep Modules</p>
        {navItems.map(renderNavBtn)}

        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3.5 pb-1 pt-4">Discover</p>
        {extraItems.map(renderNavBtn)}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Closed-Loop Engine</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400">v2.0 Gemini</span>
      </div>
    </aside>
  );
}
