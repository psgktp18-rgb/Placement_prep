import React, { useState } from 'react';
import { Newspaper, ExternalLink, Clock, TrendingUp, Building2, Bookmark, BookmarkCheck, Tag, Flame } from 'lucide-react';

const NEWS_DATA = [
  {
    id: 1,
    title: 'Google Opens 2026 STEP Intern Applications for Engineering Undergrads',
    summary: 'Google has launched applications for its Student Training in Engineering Program (STEP) 2026 batch, offering stipends up to ₹1.5L/month. Focus areas include SWE, ML, and Data Analytics roles.',
    source: 'Google Careers Blog',
    time: '2 hours ago',
    category: 'Internship',
    hot: true,
    tags: ['Google', 'Internship', 'SWE'],
    link: '#',
  },
  {
    id: 2,
    title: 'TCS NQT 2026 Registration: 3.5 LPA Package, Deadline October 15',
    summary: 'TCS National Qualifier Test 2026 registrations are open. The exam pattern includes Cognitive Skills, Programming Logic, and Hands-On Coding with a CTC of ₹3.5 LPA for freshers.',
    source: 'TCS iON',
    time: '5 hours ago',
    category: 'Campus Placement',
    hot: true,
    tags: ['TCS', 'NQT', 'Mass Hiring'],
    link: '#',
  },
  {
    id: 3,
    title: 'Infosys Hiring 50,000 Freshers in FY2026 — Campus Drive Announced',
    summary: 'Infosys targets 50,000 fresh graduate hires across its SE and DT (Digital Transformation) roles. Shortlisting based on HackWithInfy performance and InfyTQ certification.',
    source: 'Infosys HR Portal',
    time: '8 hours ago',
    category: 'Mass Hiring',
    hot: false,
    tags: ['Infosys', 'Fresher', 'HackWithInfy'],
    link: '#',
  },
  {
    id: 4,
    title: 'Microsoft MARS Program — Résumé Drop for Final Year Students Now Live',
    summary: 'Microsoft\'s MARS (Microsoft for Accelerating Recruits & Students) résumé drop is open for Final Year B.Tech students. Roles include SDE-1, PM, and Data & AI tracks.',
    source: 'Microsoft Careers',
    time: '1 day ago',
    category: 'Tech Hiring',
    hot: false,
    tags: ['Microsoft', 'SDE-1', 'PM'],
    link: '#',
  },
  {
    id: 5,
    title: 'Amazon SDE-1 Off-Campus Drive — DSA & System Design Rounds',
    summary: 'Amazon is running a targeted off-campus hiring campaign. Candidates must clear two OA rounds (DSA + LLD) and LP (Leadership Principles) interview. Package: ₹24–32 LPA.',
    source: 'Amazon Jobs India',
    time: '1 day ago',
    category: 'Off-Campus',
    hot: true,
    tags: ['Amazon', 'SDE-1', 'Off-Campus'],
    link: '#',
  },
  {
    id: 6,
    title: 'Deloitte USI 2026 Analyst Batch — Consulting & Technology Tracks Open',
    summary: 'Deloitte USI has opened applications for its 2026 Analyst batch. Non-tech students can apply for the Consulting/Strategy track; CS/IT students for the Technology track (SAP, Cloud, Cyber).',
    source: 'Deloitte Careers',
    time: '2 days ago',
    category: 'Consulting',
    hot: false,
    tags: ['Deloitte', 'Analyst', 'Consulting'],
    link: '#',
  },
  {
    id: 7,
    title: 'Flipkart GRiD 5.0 — Engineering Challenge Season 5 Begins',
    summary: 'Flipkart\'s flagship student engineering competition GRiD is back. Shortlisted participants get PPO opportunities. Focus: Robotics, ML, and Software Development tracks.',
    source: 'Flipkart GRiD',
    time: '3 days ago',
    category: 'Hackathon',
    hot: false,
    tags: ['Flipkart', 'GRiD', 'PPO'],
    link: '#',
  },
  {
    id: 8,
    title: 'Goldman Sachs Engineering Campus Hiring — Quant & SWE Roles',
    summary: 'Goldman Sachs has announced campus hiring for IITs, NITs, and top private universities. Quant roles require strong probability and statistics background; SWE roles need DSA proficiency.',
    source: 'Goldman Sachs Talent',
    time: '3 days ago',
    category: 'Finance-Tech',
    hot: false,
    tags: ['Goldman Sachs', 'Quant', 'Finance'],
    link: '#',
  },
];

const CATEGORY_COLORS = {
  Internship: 'bg-blue-100 text-blue-800',
  'Campus Placement': 'bg-purple-100 text-purple-800',
  'Mass Hiring': 'bg-amber-100 text-amber-800',
  'Tech Hiring': 'bg-cyan-100 text-cyan-800',
  'Off-Campus': 'bg-indigo-100 text-indigo-800',
  Consulting: 'bg-rose-100 text-rose-800',
  Hackathon: 'bg-emerald-100 text-emerald-800',
  'Finance-Tech': 'bg-yellow-100 text-yellow-800',
};

export default function PlacementNewsPage() {
  const [bookmarks, setBookmarks] = useState(new Set([2]));
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Internship', 'Campus Placement', 'Off-Campus', 'Hackathon', 'Consulting'];
  const filtered = activeFilter === 'All' ? NEWS_DATA : NEWS_DATA.filter(n => n.category === activeFilter);

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Newspaper className="w-5 h-5 text-blue-300" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Live Feed</span>
        </div>
        <h1 className="text-2xl font-extrabold">Placement News & Opportunities</h1>
        <p className="text-xs text-slate-300 mt-0.5">Real-time job openings, internships, and campus drives — curated for you.</p>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-black">8</p>
            <p className="text-[10px] text-blue-200">Active Drives</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-black">3</p>
            <p className="text-[10px] text-blue-200">Deadlines This Week</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-black">{bookmarks.size}</p>
            <p className="text-[10px] text-blue-200">Bookmarked</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`text-xs px-4 py-2 rounded-full font-bold border transition ${activeFilter === cat ? 'bg-brand-600 text-white border-brand-600 shadow' : 'border-slate-200 text-slate-600 hover:border-brand-300 bg-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(news => (
          <div key={news.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition group flex flex-col ${news.hot ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-200'}`}>
            <div className="p-5 flex-1">
              {/* Top Row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {news.hot && (
                    <span className="flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200">
                      <Flame className="w-3 h-3" /> HOT
                    </span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${CATEGORY_COLORS[news.category] || 'bg-slate-100 text-slate-600'}`}>
                    {news.category}
                  </span>
                </div>
                <button onClick={() => toggleBookmark(news.id)} className="text-slate-400 hover:text-brand-600 transition shrink-0">
                  {bookmarks.has(news.id) ? <BookmarkCheck className="w-4 h-4 text-brand-600" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>

              <h3 className="font-extrabold text-slate-800 text-sm leading-snug mb-2 group-hover:text-brand-700 transition">{news.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{news.summary}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {news.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold text-slate-500">{news.source}</span>
                <span className="text-slate-300">•</span>
                <Clock className="w-3 h-3" />
                <span className="text-[11px]">{news.time}</span>
              </div>
              <button className="text-[11px] text-brand-600 font-bold hover:underline flex items-center gap-1">
                Read More <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
