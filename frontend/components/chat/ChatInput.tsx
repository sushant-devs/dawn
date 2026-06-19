'use client';

import { MessageSquare, Send, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import AgentDropdown, { type AgentKey } from './AgentDropdown';
import SelectionFlowModal from '@/components/modals/SelectionFlowModal';
import MLRAgentSelectionModal from '@/components/modals/MLRAgentSelectionModal';
import PersonalizationAgentModal from '@/components/modals/PersonalizationAgentModal';

export type InputMode = 'campaign' | 'chat';

interface ChatInputProps {
  prePopulatedMessage: string;
  onSend: (message: string) => void;
  disabled: boolean;
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  brand?: string;
  sessionId?: string;
}

export default function ChatInput({
  prePopulatedMessage,
  onSend,
  disabled,
  mode,
  onModeChange,
  brand,
  sessionId,
}: ChatInputProps) {
  const canSend = prePopulatedMessage.length > 0 && !disabled;
  const [activeAgent, setActiveAgent] = useState<AgentKey | null>(null);

  const handleAgentPick = (key: AgentKey) => {
    setActiveAgent(key);
  };


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
    <div className="flex flex-col gap-2">
      {/* Mode selector pills (above input, left-aligned) */}
      <div className="flex items-center justify-start gap-2 pl-1">
        <button
          onClick={() => onModeChange('campaign')}
          className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            mode === 'campaign'
              ? 'bg-purple-50 text-purple-600 border border-purple-200'
              : 'bg-transparent text-gray-500 border border-transparent hover:bg-gray-50'
          }`}
        >
          <Zap size={13} strokeWidth={2.2} />
          Campaign Engine
        </button>
        <button
          onClick={() => onModeChange('chat')}
          className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            mode === 'chat'
              ? 'bg-purple-50 text-purple-600 border border-purple-200'
              : 'bg-transparent text-gray-500 border border-transparent hover:bg-gray-50'
          }`}
        >
          <MessageSquare size={13} strokeWidth={2.2} />
          Chat
        </button>
      </div>

      {/* Input box */}
      <div className="group relative flex items-start gap-3 rounded-2xl border border-dawn-border bg-white px-5 py-3 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition-all duration-200 focus-within:border-purple-300 focus-within:shadow-[0_6px_18px_rgba(134,36,255,0.12)] min-h-[52px]">
        <AgentDropdown onPick={handleAgentPick} disabled={disabled} />
        <div className="flex-1 min-w-0 self-center text-left">
          {prePopulatedMessage ? (
            <p className="text-sm text-dawn-navy whitespace-pre-wrap break-words pr-2 leading-relaxed text-left">
              {prePopulatedMessage}
            </p>
          ) : (
            <p className="text-sm text-gray-400 leading-relaxed text-left">
              {disabled ? 'DAWN is responding…' : 'How can I help you today?'}
            </p>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-all duration-200 ${
            canSend
              ? 'cursor-pointer bg-purple-600 hover:bg-purple-700 shadow-sm'
              : 'cursor-not-allowed bg-gray-100'
          }`}
        >
          <Send size={14} className={canSend ? 'text-white' : 'text-gray-400'} />
        </button>
      </div>
      {activeAgent === 'generation' && (
        <SelectionFlowModal
          brand={brand}
          sessionId={sessionId}
          onClose={() => setActiveAgent(null)}
        />
      )}
      {activeAgent === 'mlr_agent' && (
        <MLRAgentSelectionModal
          sessionId={sessionId}
          onClose={() => setActiveAgent(null)}
        />
      )}
      {activeAgent === 'personalization' && (
        <PersonalizationAgentModal onClose={() => setActiveAgent(null)} />
      )}
    </div>
  );
}
