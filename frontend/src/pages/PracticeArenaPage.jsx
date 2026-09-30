import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Code, ExternalLink, RefreshCw, CheckCircle2, BookOpen, Sparkles, Award } from 'lucide-react';

export default function PracticeArenaPage() {
  const { user } = useAuth();
  const [topicsData, setTopicsData] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [syncingLeetcode, setSyncingLeetcode] = useState(false);
  const [loading, setLoading] = useState(true);

  const isTech = user && (
    ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'AI & ML'].includes(user.branch) ||
    (user.branch && (user.branch.toLowerCase().includes('computer') || user.branch.toLowerCase().includes('it')))
  );

  useEffect(() => {
    loadPracticeData();
  }, []);

  const loadPracticeData = async () => {
    setLoading(true);
    try {
      const res = await api.getPracticeTopics();
      setTopicsData(res);

      if (isTech && user?.leetcode_username) {
        syncLeetCode(user.leetcode_username);
      }
    } catch (err) {
      console.error('Error loading practice topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncLeetCode = async (uname) => {
    const targetUsername = uname || user?.leetcode_username || 'alexchen_dev';
    setSyncingLeetcode(true);
    try {
      const stats = await api.syncLeetCodeStats(targetUsername);
      setLeetcodeStats(stats);
    } catch (err) {
      console.error('Error syncing LeetCode stats:', err);
    } finally {
      setSyncingLeetcode(false);
    }
  };

  const handleMarkComplete = async (topicId) => {
    try {
      await api.markPracticeComplete({ topicId, track: 'practice', score: 100 });
      loadPracticeData();
    } catch (err) {
      alert('Error marking complete: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase">
              {isTech ? 'LeetCode Topic Map' : 'Domain Case Arena'}
            </span>
            <span className="text-xs text-slate-500">Domain: {user?.branch || 'General'}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-800">
            {isTech ? 'Curated Coding & Algorithm Practice Arena' : 'Core Domain & Aptitude Case Study Arena'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTech ? 'Integrated server-side proxy sync with LeetCode GraphQL public endpoint.' : 'Curated domain frameworks and practical problem briefs for placement rounds.'}
          </p>
        </div>

        {isTech && (
          <button
            onClick={() => syncLeetCode(user?.leetcode_username)}
            disabled={syncingLeetcode}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingLeetcode ? 'animate-spin' : ''}`} />
            <span>Sync LeetCode Stats</span>
          </button>
        )}
      </div>

      {/* Tech LeetCode Server Proxy Stats Bar */}
      {isTech && leetcodeStats && (
        <div className="bg-gradient-to-r from-slate-900 to-brand-950 text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xl shadow">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">LeetCode Sync: @{leetcodeStats.username}</h3>
                {leetcodeStats.isFallback && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono rounded border border-amber-500/30">
                    Live Proxy Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">Streak: {leetcodeStats.streak} Days Active</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-xs text-slate-400">Total Solved</p>
              <p className="text-xl font-extrabold text-white">{leetcodeStats.totalSolved}</p>
            </div>
            <div>
              <p className="text-xs text-emerald-400 font-bold">Easy</p>
              <p className="text-base font-bold text-white">{leetcodeStats.easySolved}</p>
            </div>
            <div>
              <p className="text-xs text-amber-400 font-bold">Medium</p>
              <p className="text-base font-bold text-white">{leetcodeStats.mediumSolved}</p>
            </div>
            <div>
              <p className="text-xs text-rose-400 font-bold">Hard</p>
              <p className="text-base font-bold text-white">{leetcodeStats.hardSolved}</p>
            </div>
          </div>
        </div>
      )}

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(topicsData?.topics || [
          { id: 't1', category: 'Arrays & Two Pointers', title: 'Sliding Window & Array Optimization', difficulty: 'Easy', leetcode_slug: 'two-sum', isSolved: true },
          { id: 't2', category: 'Data Structures', title: 'Trees & Graph Traversal (DFS/BFS)', difficulty: 'Medium', leetcode_slug: 'binary-tree-inorder-traversal', isSolved: false },
          { id: 't3', category: 'Dynamic Programming', title: 'Subsequence & Knapsack Optimization', difficulty: 'Medium', leetcode_slug: 'coin-change', isSolved: false }
        ]).map((topic) => (
          <div key={topic.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{topic.category}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  topic.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                  topic.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {topic.difficulty}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{topic.title}</h3>
              {topic.brief && <p className="text-xs text-slate-600">{topic.brief}</p>}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              {isTech ? (
                <a
                  href={`https://leetcode.com/problems/${topic.leetcode_slug || 'two-sum'}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                >
                  <span>Practice on LeetCode</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => handleMarkComplete(topic.id)}
                  className={`w-full py-2 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 ${
                    topic.isSolved ? 'bg-emerald-600 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {topic.isSolved ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  <span>{topic.isSolved ? 'Solved ✓' : 'Mark as Solved'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
