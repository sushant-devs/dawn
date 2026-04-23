'use client';

import { Send } from 'lucide-react';

interface ChatInputProps {
  prePopulatedMessage: string;
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ prePopulatedMessage, onSend, disabled }: ChatInputProps) {
  const canSend = prePopulatedMessage.length > 0 && !disabled;

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-dawn-border bg-white px-4 py-3 shadow-sm transition-all duration-200 focus-within:border-dawn-teal/40 focus-within:shadow-[0_10px_30px_rgba(0,168,150,0.18)]">
      <div className="flex-1 min-w-0">
        {prePopulatedMessage ? (
          <p className="text-sm text-dawn-navy truncate pr-2 leading-relaxed">
            {prePopulatedMessage}
          </p>
        ) : (
          <p className="text-sm text-gray-400 leading-relaxed">
            {disabled ? 'DAWN is responding…' : 'Ask DAWN anything…'}
          </p>
        )}
      </div>

      <button
        onClick={() => canSend && onSend(prePopulatedMessage)}
        disabled={!canSend}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
          canSend
            ? 'bg-dawn-teal hover:bg-dawn-teal/90 shadow-sm hover:shadow-md cursor-pointer group-hover:scale-105'
            : 'bg-gray-200 cursor-not-allowed'
        }`}
      >
        <Send size={15} className={canSend ? 'text-white' : 'text-gray-400'} />
      </button>
    </div>
  );
}
