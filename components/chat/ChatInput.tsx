'use client';

import { Send, MessageSquare, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ChatMode = 'normal' | 'question';

interface ChatInputProps {
  prePopulatedMessage: string;
  questionPrePopulated?: string;
  onSend: (message: string) => void;
  onQuestionSend?: (message: string) => void;
  disabled: boolean;
  questionDisabled?: boolean;
  mode?: ChatMode;
  onModeChange?: (mode: ChatMode) => void;
}

export default function ChatInput({ prePopulatedMessage, questionPrePopulated = '', onSend, onQuestionSend, disabled, questionDisabled = false, mode: controlledMode, onModeChange }: ChatInputProps) {
  const [internalMode, setInternalMode] = useState<ChatMode>('normal');

  const mode = controlledMode ?? internalMode;

  const setMode = (newMode: ChatMode) => {
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  const canSendNormal = prePopulatedMessage.length > 0 && !disabled;
  const canSendQuestion = questionPrePopulated.length > 0 && !questionDisabled;
  const canSend = mode === 'normal' ? canSendNormal : canSendQuestion;

  const handleSend = () => {
    if (mode === 'normal' && canSendNormal) {
      onSend(prePopulatedMessage);
    } else if (mode === 'question' && canSendQuestion) {
      if (onQuestionSend) {
        onQuestionSend(questionPrePopulated);
      } else {
        onSend(questionPrePopulated);
      }
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
  }, [canSend, prePopulatedMessage, questionPrePopulated, onSend, onQuestionSend, mode]);

  return (
    <div className="space-y-0">
      {/* Mode selector pills */}
      <div className="flex items-center gap-1.5 mb-2">
        <button
          onClick={() => setMode('normal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            mode === 'normal'
              ? 'bg-dawn-teal/15 text-dawn-teal border border-dawn-teal/30 shadow-sm'
              : 'bg-white/40 text-gray-500 border border-white/50 hover:bg-white/60 hover:text-gray-700'
          }`}
        >
          <MessageSquare size={12} />
          Campaign Engine
        </button>
        <button
          onClick={() => setMode('question')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            mode === 'question'
              ? 'bg-dawn-teal/15 text-dawn-teal border border-dawn-teal/30 shadow-sm'
              : 'bg-white/40 text-gray-500 border border-white/50 hover:bg-white/60 hover:text-gray-700'
          }`}
        >
          <MessageCircle size={12} />
          Chat
        </button>
      </div>

      {/* Input area */}
      <div className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/45 bg-white/20 px-4 py-3 shadow-[0_8px_26px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl transition-all duration-200 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent focus-within:border-dawn-teal/40 focus-within:bg-white/28 focus-within:shadow-[0_10px_30px_rgba(0,168,150,0.18),inset_0_1px_0_rgba(255,255,255,0.6)]">
        <div className="flex-1 min-w-0">
          {mode === 'normal' ? (
            prePopulatedMessage ? (
              <p className="text-sm text-dawn-navy truncate pr-2 leading-relaxed">
                {prePopulatedMessage}
              </p>
            ) : (
              <p className="text-sm text-slate-500 leading-relaxed">
                {disabled ? 'DAWN is responding…' : 'Ask DAWN anything…'}
              </p>
            )
          ) : (
            questionPrePopulated ? (
              <p className="text-sm text-dawn-navy pr-2 leading-relaxed text-left">
                {questionPrePopulated}
              </p>
            ) : (
              <p className="text-sm text-slate-500 leading-relaxed text-left">
                {questionDisabled ? 'DAWN is responding…' : 'All questions answered'}
              </p>
            )
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
    </div>
  );
}
