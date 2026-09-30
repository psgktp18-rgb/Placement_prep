import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import TypingIndicator from '../components/TypingIndicator';
import { MessageSquare, Send, Sparkles, Award, Play } from 'lucide-react';

export default function InterviewPracticePage() {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [turn, setTurn] = useState(1);
  const [report, setReport] = useState(null);

  const startSession = async () => {
    setIsTyping(true);
    setReport(null);
    try {
      const res = await api.startHrInterview();
      setSessionId(res.sessionId);
      setMessages([{ role: 'assistant', text: res.message }]);
      setTurn(1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    const msg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsTyping(true);

    try {
      const res = await api.sendHrMessage(sessionId, msg);
      setTurn(res.turn);
      setMessages(prev => [...prev, { role: 'assistant', text: res.replyMessage }]);

      if (res.isCompleted && res.finalScores) {
        setReport(res.finalScores);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase">
            Mock Interview Studio
          </span>
          <h1 className="text-xl font-extrabold text-slate-800 mt-1">Ongoing HR & Technical Mock Practice</h1>
          <p className="text-xs text-slate-500">Reuses stateful Gemini HR interview engine for unlimited practice sessions.</p>
        </div>

        <button
          onClick={startSession}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          <Play className="w-4 h-4" />
          <span>Start New Mock Drill</span>
        </button>
      </div>

      {messages.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-4 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="font-bold text-sm">Gemini AI Recruiter • Exchange {turn}/5</span>
            </div>
            {report && <span className="text-xs font-bold text-amber-400">Score: {report.overall_interview_readiness}%</span>}
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs ${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <TypingIndicator label="Gemini AI is responding..." />}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 rounded-b-2xl flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your response to the interviewer..."
              className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-brand-500 font-medium"
            />
            <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow">
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
          <MessageSquare className="w-12 h-12 text-brand-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">Launch a Practice Drill Session</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Simulate a full 5-turn placement HR round. Gemini AI will analyze your response depth, poise, and STAR structure.
          </p>
          <button onClick={startSession} className="px-6 py-3 bg-brand-600 text-white font-bold text-xs rounded-xl shadow">
            Start Mock Interview Now →
          </button>
        </div>
      )}
    </div>
  );
}
