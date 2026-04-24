'use client';

import { Send } from 'lucide-react';
import { useEffect } from 'react';

interface ChatInputProps {
  prePopulatedMessage: string;
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ prePopulatedMessage, onSend, disabled }: ChatInputProps) {
  const canSend = prePopulatedMessage.length > 0 && !disabled;

  const handleSend = () => {
    if (canSend) {
      onSend(prePopulatedMessage);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && canSend) {
        e.preventDefault();
        handleSend();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canSend, prePopulatedMessage, onSend]);

  return (
    <div className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/45 bg-white/20 px-4 py-3 shadow-[0_8px_26px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl transition-all duration-200 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent focus-within:border-dawn-teal/40 focus-within:bg-white/28 focus-within:shadow-[0_10px_30px_rgba(0,168,150,0.18),inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="flex-1 min-w-0">
        {prePopulatedMessage ? (
          <p className="text-sm text-dawn-navy truncate pr-2 leading-relaxed">
            {prePopulatedMessage}
          </p>
        ) : (
          <p className="text-sm text-slate-500 leading-relaxed">
            {disabled ? 'DAWN is responding…' : 'Ask DAWN anything…'}
          </p>
        )}
      </div>

      <button
        onClick={handleSend}
        disabled={!canSend}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
          canSend
            ? 'cursor-pointer border border-white/55 bg-gradient-to-br from-dawn-teal to-cyan-600 shadow-[0_8px_18px_rgba(0,168,150,0.35)] hover:scale-105 hover:shadow-[0_12px_22px_rgba(0,168,150,0.45)]'
            : 'cursor-not-allowed border border-white/55 bg-white/40'
        }`}
      >
        <Send size={15} className={canSend ? 'text-white' : 'text-gray-400'} />
      </button>
    </div>
  );
}
