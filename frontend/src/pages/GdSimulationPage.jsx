import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import TypingIndicator from '../components/TypingIndicator';
import { Users, Send, Sparkles, MessageSquare, ShieldCheck, Flame } from 'lucide-react';

export default function GdSimulationPage() {
  const { user } = useAuth();
  const [gdId, setGdId] = useState('');
  const [topic, setTopic] = useState("Will Generative AI Replace Entry-Level Engineers & Analysts?");
  const [history, setHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    startGdSession();
  }, []);

  const startGdSession = async () => {
    setIsSimulating(true);
    try {
      const res = await api.startGdSimulation(topic);
      setGdId(res.gdId);
      setHistory(res.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSendCandidateMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSimulating) return;
    const msg = inputText.trim();
    setInputText('');
    setIsSimulating(true);

    try {
      const res = await api.sendGdMessage(gdId, msg);
      setHistory(res.history || []);
      setFeedback(res.quickFeedback || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase border border-brand-500/30">
            Multi-Persona GD Arena
          </span>
          <h1 className="text-xl font-extrabold mt-1">Group Discussion Simulation</h1>
          <p className="text-xs text-slate-300 mt-0.5">Topic: "{topic}"</p>
        </div>

        <button
          onClick={startGdSession}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow transition"
        >
          Reset Discussion
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-900 flex items-center gap-2 text-xs font-semibold">
          <Flame className="w-5 h-5 text-amber-500 shrink-0" />
          <span>Quick Feedback: {feedback}</span>
        </div>
      )}

      {/* GD Thread */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[540px]">
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-brand-600" /> Active Participants: Aarav (Analytical), Priya (Critical), You ({user?.name || 'Candidate'})</span>
          <span className="text-[10px] text-slate-500">Live Gemini Debaters</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {history.map((h, idx) => (
            <div key={idx} className={`flex ${h.role === 'Candidate' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 text-xs shadow-sm space-y-1 ${
                h.role === 'Candidate' ? 'bg-brand-600 text-white rounded-br-none' :
                h.speaker === 'Aarav' ? 'bg-indigo-900 text-indigo-100 rounded-bl-none' :
                h.speaker === 'Priya' ? 'bg-slate-900 text-slate-100 rounded-bl-none' :
                'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                <div className="flex items-center justify-between text-[10px] opacity-80 font-bold">
                  <span>{h.avatar || '👤'} {h.speaker} ({h.role})</span>
                </div>
                <p className="leading-relaxed">{h.message}</p>
              </div>
            </div>
          ))}
          {isSimulating && <TypingIndicator label="Aarav and Priya are formulating counter-arguments..." />}
        </div>

        <form onSubmit={handleSendCandidateMessage} className="p-3 bg-white border-t border-slate-200 rounded-b-2xl flex gap-2">
          <input
            type="text"
            disabled={isSimulating}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Deliver your structured argument or counter-point in the discussion..."
            className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 font-medium"
          />
          <button
            type="submit"
            disabled={isSimulating || !inputText.trim()}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1"
          >
            <span>Speak</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
