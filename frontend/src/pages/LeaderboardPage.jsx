import React, { useState } from 'react';
import { Trophy, Medal, TrendingUp, Star, Users, Crown, Flame, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const leaderboardData = [
  { rank: 1, name: 'Priya Sharma', college: 'IIT Bombay', score: 97, badge: 'Elite', branch: 'Computer Science', streak: 42, change: 0 },
  { rank: 2, name: 'Arjun Mehta', college: 'NIT Trichy', score: 95, badge: 'Elite', branch: 'Information Technology', streak: 38, change: 1 },
  { rank: 3, name: 'Sneha Reddy', college: 'BITS Pilani', score: 93, badge: 'Expert', branch: 'Data Science', streak: 30, change: -1 },
  { rank: 4, name: 'Rohit Verma', college: 'VIT Vellore', score: 91, badge: 'Expert', branch: 'CS & AI', streak: 27, change: 2 },
  { rank: 5, name: 'Anjali Nair', college: 'IIIT Hyderabad', score: 90, badge: 'Expert', branch: 'Software Engineering', streak: 24, change: 0 },
  { rank: 6, name: 'Vikram Singh', college: 'DTU Delhi', score: 88, badge: 'Advanced', branch: 'Computer Science', streak: 20, change: 3 },
  { rank: 7, name: 'Kavya Iyer', college: 'SRM University', score: 86, badge: 'Advanced', branch: 'Information Technology', streak: 18, change: -2 },
  { rank: 8, name: 'Aditya Patel', college: 'Manipal University', score: 84, badge: 'Advanced', branch: 'Data Science', streak: 15, change: 1 },
  { rank: 9, name: 'Divya Kulkarni', college: 'Pune University', score: 82, badge: 'Rising', branch: 'Computer Science', streak: 12, change: 4 },
  { rank: 10, name: 'Rahul Ghosh', college: 'Jadavpur University', score: 80, badge: 'Rising', branch: 'Electronics & CS', streak: 10, change: 0 },
  { rank: 11, name: 'Meera Krishnan', college: 'Anna University', score: 79, badge: 'Rising', branch: 'Information Technology', streak: 9, change: -1 },
  { rank: 12, name: 'Suresh Babu', college: 'Amrita University', score: 77, badge: 'Rising', branch: 'CS & AI', streak: 7, change: 2 },
];

const badgeColors = {
  Elite: 'bg-amber-100 text-amber-800 border-amber-300',
  Expert: 'bg-purple-100 text-purple-800 border-purple-300',
  Advanced: 'bg-blue-100 text-blue-800 border-blue-300',
  Rising: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

const rankIcons = {
  1: <Crown className="w-5 h-5 text-amber-500" />,
  2: <Medal className="w-5 h-5 text-slate-400" />,
  3: <Medal className="w-5 h-5 text-amber-700" />,
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  // Current user entry - set to #1 100 marks
  const currentUserRank = { rank: 1, name: user?.name || 'You', college: user?.college || 'Your College', score: 100, badge: 'Elite', branch: user?.branch || 'Computer Science', streak: 45, change: 1, isYou: true };

  const topThree = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100">National Rankings</span>
            </div>
            <h1 className="text-2xl font-extrabold">PlacementPilot Leaderboard</h1>
            <p className="text-xs text-orange-100 mt-0.5">Top candidates across India — ranked by Placement Readiness Index</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-xs text-amber-100 font-semibold">Your Rank</p>
            <p className="text-3xl font-black">#1</p>
            <p className="text-xs text-amber-200">100 / 100 Marks</p>
          </div>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-6 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" /> Top 3 Champions
        </h3>
        <div className="flex items-end justify-center gap-4">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {topThree[1].name.charAt(0)}
            </div>
            <div className="bg-slate-100 rounded-2xl p-3 w-32 border border-slate-200">
              <div className="flex justify-center mb-1">{rankIcons[2]}</div>
              <p className="font-bold text-xs text-slate-800 truncate">{topThree[1].name}</p>
              <p className="text-[10px] text-slate-500 truncate">{topThree[1].college}</p>
              <p className="text-lg font-extrabold text-slate-700 mt-1">{topThree[1].score}%</p>
            </div>
            <div className="bg-slate-400 h-16 w-full rounded-t-lg flex items-center justify-center text-white font-black text-2xl">2</div>
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center gap-2 text-center -mt-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-4 ring-amber-200">
              {topThree[0].name.charAt(0)}
            </div>
            <div className="bg-amber-50 rounded-2xl p-3 w-36 border-2 border-amber-300 shadow-md">
              <div className="flex justify-center mb-1">{rankIcons[1]}</div>
              <p className="font-bold text-xs text-slate-800 truncate">{topThree[0].name}</p>
              <p className="text-[10px] text-slate-500 truncate">{topThree[0].college}</p>
              <p className="text-xl font-extrabold text-amber-600 mt-1">{topThree[0].score}%</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-[10px] text-orange-600 font-bold">{topThree[0].streak}d streak</span>
              </div>
            </div>
            <div className="bg-amber-500 h-24 w-full rounded-t-lg flex items-center justify-center text-white font-black text-3xl">1</div>
          </div>
          {/* 3rd */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-800 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {topThree[2].name.charAt(0)}
            </div>
            <div className="bg-amber-50/60 rounded-2xl p-3 w-32 border border-amber-200">
              <div className="flex justify-center mb-1">{rankIcons[3]}</div>
              <p className="font-bold text-xs text-slate-800 truncate">{topThree[2].name}</p>
              <p className="text-[10px] text-slate-500 truncate">{topThree[2].college}</p>
              <p className="text-lg font-extrabold text-amber-700 mt-1">{topThree[2].score}%</p>
            </div>
            <div className="bg-amber-700 h-10 w-full rounded-t-lg flex items-center justify-center text-white font-black text-2xl">3</div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" /> Full Rankings
          </h3>
          <div className="flex gap-2">
            {['all', 'tech', 'non-tech'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`text-[11px] px-3 py-1 rounded-full font-bold border transition ${filter === f ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-500 hover:border-brand-300'}`}>
                {f === 'all' ? 'All' : f === 'tech' ? 'Tech' : 'Non-Tech'}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {restOfList.map((entry) => (
            <div key={entry.rank} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition">
              <div className="w-8 text-center font-bold text-slate-500 text-sm">#{entry.rank}</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {entry.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">{entry.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{entry.college} • {entry.branch}</p>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs text-slate-500">{entry.streak}d</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badgeColors[entry.badge]}`}>{entry.badge}</span>
              <div className="w-16 text-right">
                <span className="font-extrabold text-slate-800 text-sm">{entry.score}%</span>
                <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${entry.change > 0 ? 'text-emerald-600' : entry.change < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                  {entry.change > 0 ? <ChevronUp className="w-3 h-3" /> : entry.change < 0 ? <ChevronUp className="w-3 h-3 rotate-180" /> : null}
                  {entry.change !== 0 ? `${Math.abs(entry.change)}` : '—'}
                </div>
              </div>
            </div>
          ))}

          {/* Current User Row */}
          <div className="flex items-center gap-4 px-5 py-3 bg-brand-50 border-t-2 border-brand-200">
            <div className="w-8 text-center font-bold text-brand-600 text-sm">#{currentUserRank.rank}</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-brand-400">
              {(user?.name || 'Y').charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-brand-800 truncate">{user?.name || 'You'} <span className="text-[10px] bg-brand-600 text-white px-1.5 py-0.5 rounded-full ml-1">YOU</span></p>
              <p className="text-[11px] text-brand-600 truncate">{currentUserRank.college} • {currentUserRank.branch}</p>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-slate-500">{currentUserRank.streak}d</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold bg-emerald-100 text-emerald-800 border-emerald-300">Rising</span>
            <div className="w-16 text-right">
              <span className="font-extrabold text-brand-700 text-sm">{currentUserRank.score}%</span>
              <div className="flex items-center justify-end gap-0.5 text-[10px] font-bold text-emerald-600">
                <ChevronUp className="w-3 h-3" />{currentUserRank.change}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
