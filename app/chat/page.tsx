'use client';

import { useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { useDAWN } from '@/context/DAWNContext';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import QuickChips from '@/components/chat/QuickChips';
import BriefBuilderModal from '@/components/modals/BriefBuilderModal';
import ContentEditorModal from '@/components/modals/ContentEditorModal';
import ImageGenModal from '@/components/modals/ImageGenModal';
import MLRCheckerModal from '@/components/modals/MLRCheckerModal';
import DistributionModal from '@/components/modals/DistributionModal';
import EffectivenessModal from '@/components/modals/EffectivenessModal';

export default function ChatPage() {
  const { state, dispatch, sendMessage, confirmModal, closeModal } = useDAWN();

  // Auto-start: show first pre-populated message after 1s
  useEffect(() => {
    if (!state.hasStarted) {
      const t = setTimeout(() => {
        dispatch({ type: 'START_CONVERSATION' });
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [state.hasStarted, dispatch]);

  const handleSend = (text: string) => {
    if (!text || state.isAgentTyping) return;
    sendMessage(text);
  };

  const showWelcomeScreen = state.messages.length === 0;

  return (
    <>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-dawn-border shrink-0">
        <div className="flex items-center gap-2">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-7 h-7 bg-dawn-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <span className="font-serif text-dawn-navy text-lg">DAWN</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <span className="font-medium text-dawn-navy">DAWN AI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-lg border border-dawn-border flex items-center justify-center text-gray-400 hover:text-dawn-navy hover:border-dawn-navy/30 transition-colors">
            <BarChart3 size={16} />
          </button>
          <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">SC</span>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showWelcomeScreen ? (
          /* Welcome screen */
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-2xl text-center">
              <h1 className="font-serif text-4xl text-dawn-navy mb-2">
                Hi Sarah, how can I help you today?
              </h1>
              <p className="text-gray-400 text-sm mb-10">
                DAWN — Your AI-powered content lifecycle agent
              </p>

              {/* Input area */}
              <div className="mb-6">
                <ChatInput
                  prePopulatedMessage={state.prePopulatedMessage}
                  onSend={handleSend}
                  disabled={state.isAgentTyping}
                />
              </div>

              <QuickChips />
            </div>
          </div>
        ) : (
          /* Active chat */
          <>
            <ChatContainer messages={state.messages} isTyping={state.isAgentTyping} />

            {/* Input bar */}
            <div className="px-6 py-4 bg-white border-t border-dawn-border">
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  prePopulatedMessage={state.prePopulatedMessage}
                  onSend={handleSend}
                  disabled={state.isAgentTyping || state.waitingForModalConfirm}
                />
                {state.waitingForModalConfirm && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Open the modal above to continue
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {state.activeModal === 'briefBuilder' && (
        <BriefBuilderModal onConfirm={confirmModal} onClose={closeModal} />
      )}
      {state.activeModal === 'contentEditor' && (
        <ContentEditorModal onConfirm={confirmModal} onClose={closeModal} />
      )}
      {state.activeModal === 'imageGen' && (
        <ImageGenModal onConfirm={confirmModal} onClose={closeModal} />
      )}
      {state.activeModal === 'mlrChecker' && (
        <MLRCheckerModal onConfirm={confirmModal} onClose={closeModal} />
      )}
      {state.activeModal === 'distribution' && (
        <DistributionModal onConfirm={confirmModal} onClose={closeModal} />
      )}
      {state.activeModal === 'effectiveness' && (
        <EffectivenessModal onConfirm={confirmModal} onClose={closeModal} />
      )}
    </>
  );
}
