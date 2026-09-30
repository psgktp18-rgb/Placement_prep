import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Sparkles, Code2, Briefcase } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const { user, login, logout } = useAuth();

  const handleDemoSwitch = (type) => {
    if (type === 'cs') {
      login('demo@cs.ai', 'demo123');
    } else {
      login('demo@finance.ai', 'demo123');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800 capitalize flex items-center gap-2">
          {activeTab.replace('_', ' ')}
        </h2>
        {user && (
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            Target: {user.target_role || 'Software Engineer'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Demo Branch Switchers for Hackathon Demonstrations */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-500 font-semibold px-1.5 text-[11px]">Demo Mode:</span>
          <button
            onClick={() => handleDemoSwitch('cs')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
              user && user.email === 'demo@cs.ai'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Tech (CS)</span>
          </button>
          <button
            onClick={() => handleDemoSwitch('finance')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
              user && user.email === 'demo@finance.ai'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Non-Tech (Finance)</span>
          </button>
        </div>

        {/* Start Assessment CTA */}
        <button
          onClick={() => setActiveTab('assessment')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold hover:shadow-md hover:scale-105 transition duration-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch AI Assessment</span>
        </button>

        {/* Profile / Logout */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
            {user && user.name ? user.name.charAt(0) : 'U'}
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
