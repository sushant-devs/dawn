'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDAWN } from '@/context/DAWNContext';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import WorkspaceSidebar from '@/components/chat/WorkspaceSidebar';
import BriefModeSelectorModal from '@/components/modals/BriefModeSelectorModal';
import ManualBriefInputModal from '@/components/modals/ManualBriefInputModal';
import BriefBuilderModal from '@/components/modals/BriefBuilderModal';
import TemplateSelectorModal from '@/components/modals/TemplateSelectorModal';
import ContentEditorModal from '@/components/modals/ContentEditorModal';
import ImageGenModal from '@/components/modals/ImageGenModal';
import MLRCheckerModal from '@/components/modals/MLRCheckerModal';
import DistributionModal from '@/components/modals/DistributionModal';
import EffectivenessModal from '@/components/modals/EffectivenessModal';
import NotificationModal from '@/components/modals/NotificationModal';
import PLSGeneratorModal from '@/components/modals/PLSGeneratorModal';
import type { AgentResponseContent } from '@/lib/types';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const { state, dispatch, sendMessage, confirmModal, closeModal, setBriefMode } = useDAWN();
  const workspaceName = searchParams.get('workspace')?.trim() ?? '';
  const activeChatId = searchParams.get('chatId')?.trim();

  // Find the latest notification from messages
  const latestNotification = useMemo(() => {
    for (let i = state.messages.length - 1; i >= 0; i--) {
      const msg = state.messages[i];
      if (msg.role === 'agent') {
        const content = msg.content as AgentResponseContent;
        if (content.notification) {
          return content.notification;
        }
      }
    }
    return null;
  }, [state.messages]);

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
    <div className="flex h-full min-h-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <WorkspaceSidebar activeWorkspace={workspaceName} activeChatId={activeChatId} />

      <div className="flex min-w-0 flex-1 flex-col relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-100/30 to-teal-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-gradient-to-tr from-purple-100/20 to-pink-100/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-transparent relative z-10">
          {showWelcomeScreen ? (
            /* Enhanced Welcome screen */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
              {/* Floating particles animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-dawn-teal/30 rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce delay-700"></div>
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce delay-1000"></div>
              </div>

              <div className="w-full max-w-4xl text-center mb-12 relative">
                {/* Agent status indicator */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm border border-dawn-teal/20 rounded-full shadow-lg">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-600">DAWN Agent Online</span>
                  </div>
                </div>

                <div className="mb-10">
                  <h1 className="font-display text-4xl md:text-5xl bg-gradient-to-r from-dawn-navy via-dawn-teal to-blue-600 bg-clip-text text-transparent mb-6 font-bold leading-tight">
                    Hi Sarah, how can I help you today?
                  </h1>
                  <p className="text-slate-600 text-lg font-medium mb-3">
                    DAWN — Your AI-powered content lifecycle agent
                  </p>
                  <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
                    Ready to assist with content creation, strategy, compliance, and distribution across your entire workflow
                  </p>
                </div>

                {/* Capability cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Content Creation</h3>
                    <p className="text-xs text-slate-600">Generate, edit, and optimize content</p>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Compliance Check</h3>
                    <p className="text-xs text-slate-600">MLR review and approval</p>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Distribution</h3>
                    <p className="text-xs text-slate-600">Multi-channel publishing</p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-4xl">
                {/* Enhanced Input area */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-dawn-teal/5 to-blue-500/5 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-1 shadow-xl">
                    <ChatInput
                      prePopulatedMessage={state.prePopulatedMessage}
                      onSend={handleSend}
                      disabled={state.isAgentTyping}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Enhanced Active chat */
            <>
              {/* Chat header with status */}
              <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm px-6 py-4">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="font-medium text-slate-800">DAWN Agent</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Active in {workspaceName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <span>Real-time responses</span>
                  </div>
                </div>
              </div>

              <ChatContainer messages={state.messages} isTyping={state.isAgentTyping} typingMessage={state.typingMessage} />

              {/* Enhanced Input bar */}
              <div className="border-t border-slate-200/80 bg-white/60 backdrop-blur-sm px-6 py-4">
                <div className="mx-auto max-w-4xl">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-dawn-teal/5 to-blue-500/5 rounded-xl blur-sm"></div>
                    <div className="relative">
                      <ChatInput
                        prePopulatedMessage={state.prePopulatedMessage}
                        onSend={handleSend}
                        disabled={state.isAgentTyping || state.waitingForModalConfirm}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {state.activeModal === 'briefModeSelector' && (
        <BriefModeSelectorModal
          onConfirm={(mode) => setBriefMode(mode)}
          onClose={closeModal}
        />
      )}
      {state.activeModal === 'manualBriefInput' && (
        <ManualBriefInputModal onConfirm={confirmModal} onClose={closeModal} />
      )}
      {state.activeModal === 'briefBuilder' && (
        <BriefBuilderModal onConfirm={confirmModal} onClose={closeModal} />
      )}
      {state.activeModal === 'templateSelector' && (
        <TemplateSelectorModal onConfirm={confirmModal} onClose={closeModal} />
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

      {/* Notification and PLS modals are intentionally hidden on /chat route */}
    </div>
  );
}
