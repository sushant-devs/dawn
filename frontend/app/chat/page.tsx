'use client';

import { Suspense, useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDAWN } from '@/context/DAWNContext';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import WorkspaceSidebar, { type ChatSession } from '@/components/chat/Sidebar';
import BriefModeSelectorModal from '@/components/modals/BriefModeSelectorModal';
import ManualBriefInputModal from '@/components/modals/ManualBriefInputModal';
import ManualBriefPreviewModal from '@/components/modals/ManualBriefPreviewModal';
import BriefBuilderModal from '@/components/modals/BriefBuilderModal';
import TemplateSelectorModal from '@/components/modals/TemplateSelectorModal';
import ContentEditorModal from '@/components/modals/ContentEditorModal';
import ImageGenModal from '@/components/modals/ImageGenModal';
import MLRCheckerModal from '@/components/modals/MLRCheckerModal';
import DistributionModal from '@/components/modals/DistributionModal';
import FileTransferModal from '@/components/modals/FileTransferModal';
import EffectivenessModal from '@/components/modals/EffectivenessModal';
import { Zap, BarChart3 } from 'lucide-react';
import type { AgentResponseContent, ChatMessage } from '@/lib/types';
import type { UserProfile } from '@/lib/authApi';
import type { InputMode } from '@/components/chat/ChatInput';
import { CHAT_QUESTIONS } from '@/lib/chatQuestions';
import { CAMPAIGN_LIST, getCampaign, type CampaignId } from '@/lib/campaigns';

const CHAT_STORAGE_KEY = 'dawn_chat_sessions';

function loadSessions(): ChatSession[] {
  const stored = localStorage.getItem(CHAT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
}

export default function ChatPageWrapper() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
      <ChatPage />
    </Suspense>
  );
}

function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch, sendMessage, confirmModal, closeModal, setBriefMode, selectCampaign } = useDAWN();
  const workspaceName = searchParams.get('workspace')?.trim() ?? '';
  const activeChatId = searchParams.get('chatId')?.trim();
  const [userName, setUserName] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const prevChatIdRef = useRef<string | undefined>(undefined);

  const isEffectivenessReopen = useMemo(() => {
    const storyline = getCampaign(state.campaignId).storyline;
    const effStepIndex = storyline.findIndex((s) => s.triggersModal === 'effectiveness');
    return effStepIndex !== -1 && state.currentStepIndex > effStepIndex;
  }, [state.campaignId, state.currentStepIndex]);

  const isBriefReopen = useMemo(() => {
    if (state.activeModal !== 'briefBuilder' && state.activeModal !== 'manualBriefInput') {
      return false;
    }
    const storyline = getCampaign(state.campaignId).storyline;
    const stepIndex = storyline.findIndex((s) => s.triggersModal === state.activeModal);
    return stepIndex !== -1 && state.currentStepIndex > stepIndex;
  }, [state.campaignId, state.currentStepIndex, state.activeModal]);

  const isTemplateReopen = useMemo(() => {
    const storyline = getCampaign(state.campaignId).storyline;
    const stepIndex = storyline.findIndex((s) => s.triggersModal === 'templateSelector');
    return stepIndex !== -1 && state.currentStepIndex > stepIndex;
  }, [state.campaignId, state.currentStepIndex]);

  const isContentEditorReopen = useMemo(() => {
    const storyline = getCampaign(state.campaignId).storyline;
    const stepIndex = storyline.findIndex((s) => s.triggersModal === 'contentEditor');
    return stepIndex !== -1 && state.currentStepIndex > stepIndex;
  }, [state.campaignId, state.currentStepIndex]);

  useEffect(() => {
    const stored = localStorage.getItem('dawn_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed.full_name?.trim()) {
          const firstName = parsed.full_name.trim().split(' ')[0];
          setUserName(firstName);
          return;
        }
      } catch {}
    }
    setUserName('User');
  }, []);

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    setChatSessions(loadSessions());
  }, []);

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

  // Reset conversation when chatId changes and reload sessions
  useEffect(() => {
    if (prevChatIdRef.current !== activeChatId) {
      const isInitialMount = prevChatIdRef.current === undefined;
      prevChatIdRef.current = activeChatId;

      // Reload sessions from localStorage to stay in sync
      setChatSessions(loadSessions());

      // Only reset if not the first mount
      if (!isInitialMount) {
        dispatch({ type: 'RESET_CONVERSATION' });
      }
    }
  }, [activeChatId, dispatch]);

  // Auto-start: show first pre-populated message after 1s
  useEffect(() => {
    if (!state.hasStarted) {
      const t = setTimeout(() => {
        dispatch({ type: 'START_CONVERSATION' });
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [state.hasStarted, dispatch]);

  const addSession = useCallback((chatId: string, title: string) => {
    const existing = loadSessions();
    const alreadyExists = existing.some((s) => s.id === chatId);
    if (alreadyExists) return;

    const displayTitle = title.length > 35 ? title.slice(0, 35) + '…' : title;
    const newSession: ChatSession = {
      id: chatId,
      title: displayTitle,
      createdAt: new Date().toISOString(),
    };
    const updated = [newSession, ...existing];
    saveSessions(updated);
    setChatSessions(updated);
  }, []);

  const handleSend = (text: string) => {
    if (!text) return;

    if (inputMode === 'chat') {
      if (isChatTyping) return;
      const qa = CHAT_QUESTIONS[chatQAIndex];
      if (!qa) return;

      const userMsg: ChatMessage = {
        id: `chat-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: 'user',
        content: qa.question,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, userMsg]);
      setIsChatTyping(true);

      setTimeout(() => {
        const agentMsg: ChatMessage = {
          id: `chat-agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role: 'agent',
          // 👇 Added table: qa.table here so the UI can render it
          content: { 
            text: qa.answer, 
            chart: qa.chart, 
            table: qa.table,
            recommendation: qa.recommendation
          } as AgentResponseContent,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, agentMsg]);
        setIsChatTyping(false);
        setChatQAIndex((prev) => prev + 1);
      }, 800 + Math.random() * 600);
      return;
    }

    if (state.isAgentTyping) return;

    if (!activeChatId) {
      const newChatId = `chat-${Date.now()}`;
      addSession(newChatId, text);
      sendMessage(text);
      router.push(`/chat?chatId=${newChatId}`);
      return;
    }

    addSession(activeChatId, text);
    sendMessage(text);
  };

  const handleNewChat = useCallback(() => {
    const newChatId = `chat-${Date.now()}`;
    router.push(`/chat?chatId=${newChatId}`);
  }, [router]);

  const handleClearHistory = useCallback(() => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setChatSessions([]);
    setChatMessages([]);
    setChatQAIndex(0);
    dispatch({ type: 'RESET_CONVERSATION' });
    router.push('/chat');
  }, [dispatch, router]);

  const handleDeleteChat = useCallback((chatId: string) => {
    const updated = loadSessions().filter((s) => s.id !== chatId);
    saveSessions(updated);
    setChatSessions(updated);

    if (activeChatId !== chatId) return;

    dispatch({ type: 'RESET_CONVERSATION' });
    setChatMessages([]);
    setChatQAIndex(0);

    if (updated.length > 0) {
      router.push(`/chat?chatId=${updated[0].id}`);
    } else {
      router.push('/chat');
    }
  }, [activeChatId, dispatch, router]);

  // Selecting a campaign chip switches the active campaign and pre-populates
  // that campaign's opening message in the input (the user still presses send).
  const handleSelectCampaign = useCallback((id: CampaignId) => {
    selectCampaign(id);
    dispatch({ type: 'START_CONVERSATION' });
  }, [selectCampaign, dispatch]);

  const handleSelectChat = useCallback((chatId: string) => {
    if (chatId === activeChatId) return;
    router.push(`/chat?chatId=${chatId}`);
  }, [activeChatId, router]);

  const [showFileTransfer, setShowFileTransfer] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('campaign');
  const [chatQAIndex, setChatQAIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatTyping, setIsChatTyping] = useState(false);

  const chatPrePopulatedMessage = inputMode === 'chat'
    ? (CHAT_QUESTIONS[chatQAIndex]?.question ?? '')
    : state.prePopulatedMessage;

  const activeMessages = inputMode === 'chat' ? chatMessages : state.messages;
  const isTyping = inputMode === 'chat' ? isChatTyping : state.isAgentTyping;
  const typingMsg = inputMode === 'chat' ? 'DAWN is thinking…' : state.typingMessage;

  const showWelcomeScreen = activeMessages.length === 0;

  const welcomeContent = inputMode === 'chat'
    ? {
        icon: BarChart3,
        highlight: 'explore your data',
        subtitle: 'Ask questions about your campaign data — territories, market share, revenue trends, and more.',
      }
    : {
        icon: Zap,
        highlight: "what's on your mind?",
        subtitle: "Tell me about your campaign and I'll take it from brief to delivery — strategy, content, compliance, all in one place.",
      };
  const WelcomeIcon = welcomeContent.icon;

  return (
    <div className="flex h-full min-h-0 p-2">
      <WorkspaceSidebar
        activeWorkspace={workspaceName}
        activeChatId={activeChatId}
        chatSessions={chatSessions}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onClearHistory={handleClearHistory}
        onDeleteChat={handleDeleteChat}
      />

      {/* Padding wrapper: floating chat panel separated from sidebar on all sides */}
      <div className="flex-1 min-w-0 p-3">
        <div className="flex h-full min-h-0 flex-col rounded-2xl border border-dawn-border bg-white shadow-[0_8px_28px_rgba(15,23,42,0.06)] overflow-hidden">
          {/* Top divider header */}
          <div className="h-10 border-b border-dawn-border shrink-0" />

          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {showWelcomeScreen ? (
            /* Welcome screen */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
              <div className="w-full max-w-2xl flex flex-col items-center text-center">
                {/* Mode icon block */}
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 shadow-sm">
                  <WelcomeIcon size={24} className="text-purple-600" strokeWidth={2.2} />
                </div>

                {/* Headline */}
                <h1 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-3">
                  <span className="text-dawn-navy">
                    {userName ? `Hello, ${userName} — ` : 'Hello — '}
                  </span>
                  <span className="text-purple-600">{welcomeContent.highlight}</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
                  {welcomeContent.subtitle}
                </p>

                {/* Input + tabs */}
                <div className="w-full max-w-xl">
                  <ChatInput
                    prePopulatedMessage={chatPrePopulatedMessage}
                    onSend={handleSend}
                    disabled={isTyping}
                    mode={inputMode}
                    onModeChange={setInputMode}
                  />
                </div>

                {/* Campaign starter chips */}
                {inputMode === 'campaign' && (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {CAMPAIGN_LIST.map((campaign) => {
                      const isActive = state.campaignId === campaign.id;
                      return (
                        <button
                          key={campaign.id}
                          onClick={() => handleSelectCampaign(campaign.id)}
                          className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                            isActive
                              ? 'border-purple-300 bg-purple-50 text-purple-600 shadow-sm'
                              : 'border-dawn-border bg-white text-slate-600 hover:border-purple-200 hover:text-purple-600 hover:bg-purple-50/50'
                          }`}
                        >
                          {campaign.chipLabel}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Active chat */
            <>
              <ChatContainer messages={activeMessages} isTyping={isTyping} typingMessage={typingMsg} />

              {/* Input bar */}
              <div className="px-6 py-4  bg-white">
                <div className="mx-auto max-w-3xl">
                  <ChatInput
                    prePopulatedMessage={chatPrePopulatedMessage}
                    onSend={handleSend}
                    disabled={isTyping || (inputMode === 'campaign' && state.waitingForModalConfirm)}
                    mode={inputMode}
                    onModeChange={setInputMode}
                  />
                </div>
              </div>
            </>
          )}
        </div>
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
        <ManualBriefInputModal onConfirm={confirmModal} onClose={closeModal} readOnly={isBriefReopen} />
      )}
      {state.activeModal === 'manualBriefPreview' && (
        <ManualBriefPreviewModal onClose={closeModal} />
      )}
      {state.activeModal === 'briefBuilder' && (
        <BriefBuilderModal onConfirm={confirmModal} onClose={closeModal} readOnly={isBriefReopen} />
      )}
      {state.activeModal === 'templateSelector' && (
        <TemplateSelectorModal onConfirm={confirmModal} onClose={closeModal} readOnly={isTemplateReopen} />
      )}
      {state.activeModal === 'contentEditor' && (
        <ContentEditorModal onConfirm={confirmModal} onClose={closeModal} readOnly={isContentEditorReopen} />
      )}
      {state.activeModal === 'imageGen' && (
        <ImageGenModal onConfirm={confirmModal} onClose={closeModal} />
      )}
      {state.activeModal === 'mlrChecker' && (
        <MLRCheckerModal onConfirm={confirmModal} onClose={closeModal} />
      )}
      {state.activeModal === 'distribution' && (
        <DistributionModal onConfirm={() => { closeModal(); setShowFileTransfer(true); }} onClose={closeModal} />
      )}
      {showFileTransfer && (
        <FileTransferModal onComplete={() => { setShowFileTransfer(false); confirmModal(); }} />
      )}
      {state.activeModal === 'effectiveness' && (
        <EffectivenessModal onConfirm={confirmModal} onClose={closeModal} readOnly={isEffectivenessReopen} />
      )}

      {/* Notification and PLS modals are intentionally hidden on /chat route */}
    </div>
  );
}
