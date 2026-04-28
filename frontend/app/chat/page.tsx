'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDAWN } from '@/context/DAWNContext';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import ChatNavbar from '@/components/chat/ChatNavbar';
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
import type { AgentResponseContent, NotificationData } from '@/lib/types';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const { state, dispatch, sendMessage, confirmModal, closeModal, setBriefMode } = useDAWN();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPLSModal, setShowPLSModal] = useState(false);
  const workspaceName = searchParams.get('workspace')?.trim() ?? '';

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

  const hasNotifications = !!latestNotification;

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
    <div className="flex h-full min-h-0">
      <WorkspaceSidebar activeWorkspace={workspaceName} />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatNavbar
          hasNotifications={hasNotifications}
          onShowPLSModal={() => setShowPLSModal(true)}
          onShowNotifications={() => setShowNotifications(true)}
          workspaceName={workspaceName}
        />

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
          {showWelcomeScreen ? (
            /* Welcome screen */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
              <div className="w-full max-w-3xl text-center mb-8">
                <h1 className="font-display text-4xl text-dawn-navy mb-2">
                  Hi Sarah, how can I help you today?
                </h1>
                <p className="text-gray-500 text-sm">
                  DAWN — Your AI-powered content lifecycle agent
                </p>
              </div>

              <div className="w-full max-w-3xl">
                {/* Input area */}
                <div>
                  <ChatInput
                    prePopulatedMessage={state.prePopulatedMessage}
                    onSend={handleSend}
                    disabled={state.isAgentTyping}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Active chat */
            <>
              <ChatContainer messages={state.messages} isTyping={state.isAgentTyping} typingMessage={state.typingMessage} />

              {/* Input bar */}
              <div className=" px-6 py-2 ">
                <div className="mx-auto max-w-4xl">
                  <ChatInput
                    prePopulatedMessage={state.prePopulatedMessage}
                    onSend={handleSend}
                    disabled={state.isAgentTyping || state.waitingForModalConfirm}
                  />
                  {/* {state.waitingForModalConfirm && (
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Open the modal above to continue
                    </p>
                  )} */}
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

      {/* Notification Modal */}
      {showNotifications && latestNotification && (
        <NotificationModal
          notification={latestNotification}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* PLS Generator Modal */}
      {showPLSModal && (
        <PLSGeneratorModal onClose={() => setShowPLSModal(false)} />
      )}
    </div>
  );
}
