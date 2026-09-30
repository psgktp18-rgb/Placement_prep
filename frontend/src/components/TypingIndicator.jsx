import React from 'react';

export default function TypingIndicator({ label = "Gemini AI HR is thinking..." }) {
  return (
    <div className="flex items-center gap-3 p-3.5 bg-slate-100 rounded-2xl rounded-tl-sm text-xs text-slate-600 w-fit max-w-xs animate-pulse">
      <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold">
        HR
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-medium">{label}</span>
        <div className="flex gap-1 items-center ml-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
}
