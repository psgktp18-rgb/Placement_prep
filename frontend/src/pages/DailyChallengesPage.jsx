import React, { useState } from 'react';
import { Zap, CheckCircle2, XCircle, Clock, Trophy, RotateCcw, ChevronRight, Star, Flame, BookOpen } from 'lucide-react';

const DAILY_CHALLENGES = {
  '2026-09-30': {
    date: 'Sep 30, 2026',
    xp: 150,
    questions: [
      {
        id: 1,
        type: 'mcq',
        domain: 'Data Structures',
        difficulty: 'Medium',
        question: 'What is the time complexity of finding the k-th largest element in an unsorted array using a min-heap?',
        options: ['O(n)', 'O(n log k)', 'O(n log n)', 'O(k log n)'],
        answer: 1,
        explanation: 'Using a min-heap of size k, we insert each element and pop if heap size exceeds k. Each insertion/deletion is O(log k), and we do this n times → O(n log k).',
      },
      {
        id: 2,
        type: 'mcq',
        domain: 'Aptitude',
        difficulty: 'Easy',
        question: 'A train 150 meters long passes a telegraph post in 6 seconds. What is the speed of the train (in km/h)?',
        options: ['75 km/h', '85 km/h', '90 km/h', '100 km/h'],
        answer: 2,
        explanation: 'Speed = 150/6 = 25 m/s. Convert: 25 × (18/5) = 90 km/h.',
      },
      {
        id: 3,
        type: 'mcq',
        domain: 'HR / Behavioral',
        difficulty: 'Easy',
        question: 'In a STAR behavioral interview, what does the "R" in STAR stand for?',
        options: ['Reasoning', 'Result', 'Responsibility', 'Response'],
        answer: 1,
        explanation: 'STAR = Situation, Task, Action, Result. The "Result" describes the measurable outcome of your actions with quantifiable impact.',
      },
      {
        id: 4,
        type: 'mcq',
        domain: 'System Design',
        difficulty: 'Hard',
        question: 'Which consistency model does Amazon DynamoDB use by default for reads?',
        options: ['Strong consistency', 'Linearizability', 'Eventual consistency', 'Sequential consistency'],
        answer: 2,
        explanation: 'DynamoDB uses eventual consistency for reads by default. You can opt for strongly consistent reads, but they cost twice as many read capacity units.',
      },
      {
        id: 5,
        type: 'mcq',
        domain: 'Domain Knowledge',
        difficulty: 'Medium',
        question: 'In Porter\'s Five Forces, which force directly analyzes the ease with which new competitors can enter a market?',
        options: ['Bargaining power of buyers', 'Threat of substitutes', 'Threat of new entrants', 'Competitive rivalry'],
        answer: 2,
        explanation: 'The "Threat of New Entrants" force examines barriers to entry — capital requirements, economies of scale, switching costs, and regulatory hurdles.',
      },
    ]
  }
};

const DIFF_COLORS = { Easy: 'bg-emerald-100 text-emerald-700', Medium: 'bg-amber-100 text-amber-700', Hard: 'bg-red-100 text-red-700' };

export default function DailyChallengesPage() {
  const challenge = DAILY_CHALLENGES['2026-09-30'];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const q = challenge.questions[current];
  const isAnswered = q.id in answers;
  const correct = Object.values(answers).filter((a, i) => a === challenge.questions[i]?.answer).length;
  const xpEarned = Math.round((correct / challenge.questions.length) * challenge.xp);

  const handleSubmit = () => {
    if (selected === null) return;
    setAnswers(prev => ({ ...prev, [q.id]: selected }));
    setSubmitted(true);
  };

  const handleNext = () => {
    if (current < challenge.questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrent(0); setSelected(null); setAnswers({}); setSubmitted(false); setCompleted(false);
  };

  if (completed) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-brand-700 to-indigo-700 rounded-2xl p-10 text-white text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-extrabold mb-2">Daily Challenge Complete!</h1>
          <p className="text-brand-200 text-sm mb-6">You answered {correct}/{challenge.questions.length} questions correctly</p>
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white/20 rounded-2xl p-4">
              <p className="text-3xl font-black text-amber-300">+{xpEarned}</p>
              <p className="text-xs text-white/80">XP Earned</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4">
              <p className="text-3xl font-black">{Math.round((correct / challenge.questions.length) * 100)}%</p>
              <p className="text-xs text-white/80">Accuracy</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4">
              <p className="text-3xl font-black">6🔥</p>
              <p className="text-xs text-white/80">Day Streak</p>
            </div>
          </div>
          <button onClick={handleReset} className="flex items-center gap-2 bg-white text-brand-700 font-bold px-6 py-3 rounded-xl mx-auto hover:bg-brand-50 transition">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-600" /> Answer Review</h3>
          {challenge.questions.map((q, i) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.answer;
            return (
              <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2">
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-1">Q{i + 1}: {q.question}</p>
                    <p className="text-[11px] text-slate-600"><span className="font-bold">Correct:</span> {q.options[q.answer]}</p>
                    <p className="text-[11px] text-slate-500 mt-1 italic">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-yellow-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-100">Today's Challenge</span>
            </div>
            <h1 className="text-2xl font-extrabold">Daily Quiz</h1>
            <p className="text-xs text-orange-100 mt-0.5">{challenge.date} • 5 Questions across all domains</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-black">+{challenge.xp}</p>
            <p className="text-[10px] text-yellow-200">Max XP</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-orange-100 mb-1.5">
            <span>Question {current + 1} of {challenge.questions.length}</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${(Object.keys(answers).length / challenge.questions.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">{q.domain}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${DIFF_COLORS[q.difficulty]}`}>{q.difficulty}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">Daily</span>
          </div>
        </div>

        <h2 className="text-base font-extrabold text-slate-800 leading-snug">{q.question}</h2>

        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.answer;
            let style = 'border-slate-200 bg-white hover:border-brand-300 cursor-pointer';
            if (submitted) {
              if (isCorrect) style = 'border-emerald-400 bg-emerald-50 text-emerald-800';
              else if (isSelected && !isCorrect) style = 'border-red-400 bg-red-50 text-red-700';
              else style = 'border-slate-100 bg-slate-50 text-slate-400';
            } else if (isSelected) {
              style = 'border-brand-500 bg-brand-50 text-brand-800';
            }

            return (
              <button
                key={i}
                disabled={submitted || isAnswered}
                onClick={() => setSelected(i)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left text-sm font-medium transition ${style}`}
              >
                <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold ${isSelected && !submitted ? 'border-brand-600 bg-brand-600 text-white' : 'border-current'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />}
                {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {submitted && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${answers[q.id] === q.answer ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <span className="font-bold">💡 Explanation: </span>{q.explanation}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>{correct} correct so far</span>
          </div>
          {!submitted && !isAnswered ? (
            <button onClick={handleSubmit} disabled={selected === null} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${selected !== null ? 'bg-brand-600 hover:bg-brand-700 text-white shadow' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
              Submit Answer
            </button>
          ) : (
            <button onClick={handleNext} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition">
              {current < challenge.questions.length - 1 ? 'Next Question' : 'See Results'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Streak Banner */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <Flame className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">5-Day Streak! 🔥</p>
          <p className="text-xs text-slate-500">Complete today's challenge to keep your streak alive and earn bonus XP.</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          {[1,2,3,4,5,6,7].map(d => (
            <div key={d} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${d <= 5 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {d <= 5 ? '✓' : d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
