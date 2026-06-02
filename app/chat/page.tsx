'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDAWN } from '@/context/DAWNContext';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import type { ChatMode } from '@/components/chat/ChatInput';
import ChatNavbar from '@/components/chat/ChatNavbar';
import QuickChips from '@/components/chat/QuickChips';
import BriefModeSelectorModal from '@/components/modals/BriefModeSelectorModal';
import ManualBriefInputModal from '@/components/modals/ManualBriefInputModal';
import BriefBuilderModal from '@/components/modals/BriefBuilderModal';
import TemplateSelectorModal from '@/components/modals/TemplateSelectorModal';
import ContentEditorModal from '@/components/modals/ContentEditorModal';
import ImageGenModal from '@/components/modals/ImageGenModal';
import MLRCheckerModal from '@/components/modals/MLRCheckerModal';
import DistributionModal from '@/components/modals/DistributionModal';
import FileTransferModal from '@/components/modals/FileTransferModal';
import EffectivenessModal from '@/components/modals/EffectivenessModal';
import NotificationModal from '@/components/modals/NotificationModal';
import PLSGeneratorModal from '@/components/modals/PLSGeneratorModal';
import type { AgentResponseContent, ChatMessage, ChartData, NotificationData, TableData } from '@/lib/types';

interface QAStep {
  userMessage: string;
  agentResponse: string;
  recommendation?: string;
  table?: TableData;
  chart?: ChartData;
}

const QA_STORYLINE: QAStep[] = [
  // ── Q1 ──────────────────────────────────────────────────────────────────────
  {
    userMessage: "Which audience segments should be targeted for BREXIVA (Brenova)?",
    agentResponse:
      "Here's the audience segment analysis for BREXIVA based on engagement and prescription growth performance.\n\nMedical Oncologists generated the highest engagement (48%) and contributed the strongest prescription growth (+22%) for BREXIVA — clearly the highest-value segment.",
    table: {
      title: 'DAWN Analysis — Audience Segment Performance',
      headers: ['Audience Segment', 'Engagement Rate', 'Prescription Growth'],
      rows: [
        ['Medical Oncologists', '48%', '+22%'],
        ['Hemato-Oncologists', '44%', '+18%'],
        ['Oncology KOLs', '41%', '+16%'],
        ['General Physicians', '19%', '+4%'],
      ],
      highlightRowIndex: 0,
    },
    recommendation:
      "Focus future campaigns on Medical Oncologists and Oncology KOLs. Allocate approximately 65% of campaign resources to these high-value segments to maximize engagement and conversion.",
  },

  // ── Q2 ──────────────────────────────────────────────────────────────────────
  {
    userMessage: "Which content formats generate the highest engagement for BREXIVA?",
    agentResponse:
      "Here's the content format performance analysis for BREXIVA across all active channels.\n\nPersonalized Emails generated 72% more engagement than Congress Posters and consistently delivered the highest physician interaction rates.",
    chart: {
      type: 'donut',
      title: 'Engagement Share by Content Format',
      valueUnit: '%',
      data: [
        { name: 'Personalized Email', value: 43, color: '#00a896' },
        { name: 'Digital Detail Aid', value: 40, color: '#0891b2' },
        { name: 'Leaflet', value: 25, color: '#6366f1' },
        { name: 'Congress Poster', value: 17, color: '#f59e0b' },
      ],
    },
  },

  // ── Q3 ──────────────────────────────────────────────────────────────────────
  {
    userMessage: "Which promotional channels deliver the best ROI for BREXIVA?",
    agentResponse:
      "Here's the channel-level ROI analysis for BREXIVA based on last-cycle promotional spend and downstream prescription value.\n\nEmail Campaigns delivered the highest ROI while reaching 32% more target physicians compared to field-force-only activities.",
    table: {
      title: 'DAWN Analysis — Promotional Channel ROI',
      headers: ['Channel', 'ROI'],
      rows: [
        ['Email Campaigns', '5.2x'],
        ['Digital Detailing Platforms', '4.8x'],
        ['Medical Congress Activities', '4.1x'],
        ['Representative Visits', '3.6x'],
      ],
      highlightRowIndex: 0,
    },
    recommendation:
      "Increase investment in Email Campaigns and Digital Detailing Platforms by 25% in upcoming campaign cycles to maximize return on marketing spend.",
  },

  // ── Q4 ──────────────────────────────────────────────────────────────────────
  {
    userMessage: "How do marketing activities influence sales performance for BREXIVA?",
    agentResponse:
      "Analysis of campaign and prescription data indicates a strong relationship between marketing engagement and sales growth for BREXIVA.\n\n**Key Findings:**\n• Physicians exposed to at least three marketing touchpoints showed a 24% increase in prescription volume.\n• Email-engaged physicians generated 18% higher brand adoption compared to non-engaged physicians.\n• Multi-channel campaigns achieved 31% higher sales uplift than single-channel initiatives.",
    table: {
      title: 'DAWN Analysis — Marketing Exposure vs Prescription Growth',
      headers: ['Marketing Exposure', 'Average Prescription Growth'],
      rows: [
        ['Single Touchpoint', '+5%'],
        ['Two Touchpoints', '+11%'],
        ['Three or More Touchpoints', '+24%'],
      ],
      highlightRowIndex: 2,
    },
  },

  // ── Q5 ──────────────────────────────────────────────────────────────────────
  {
    userMessage: "How does BREXIVA's performance compare with competitors?",
    agentResponse:
      "Here's the head-to-head benchmarking of BREXIVA against the competitor average across the four most commercially relevant KPIs.\n\nBREXIVA is outperforming competitor brands across all major engagement and conversion metrics.",
    chart: {
      type: 'bar',
      title: 'BREXIVA vs Competitor Average (%)',
      data: [
        { name: 'Engagement', value: 43, benchmark: 34, color: '#00a896' },
        { name: 'Open Rate', value: 49, benchmark: 37, color: '#0891b2' },
        { name: 'Conversion', value: 18, benchmark: 13, color: '#6366f1' },
        { name: 'Mkt Share Δ', value: 9, benchmark: 5, color: '#f59e0b' },
      ],
    },
  },

  // ── Q6 ──────────────────────────────────────────────────────────────────────
  {
    userMessage: "What type of content should be created for future BREXIVA campaigns?",
    agentResponse:
      "Based on historical performance, physician engagement patterns, and campaign outcomes, here is DAWN's predictive recommendation for the next campaign cycle.\n\n**Expected Impact:**\n• +18% increase in physician engagement\n• +12% increase in campaign conversions\n• +9% increase in prescription growth\n\nThe data indicates that Personalized Emails and Digital Detail Aids consistently deliver the highest engagement, conversion, and ROI. A campaign strategy centred around these formats is projected to generate the strongest commercial outcomes for BREXIVA in upcoming campaign cycles.",
    table: {
      title: 'DAWN Predictive Recommendation — Predicted Engagement by Content Type',
      headers: ['Content Type', 'Predicted Engagement'],
      rows: [
        ['Personalized Email', '46%'],
        ['Digital Detail Aid', '42%'],
        ['Leaflet', '30%'],
        ['Congress Poster', '21%'],
      ],
      highlightRowIndex: 0,
      caption: 'Forecast based on prior-cycle engagement, channel-mix data, and DAWN ML model v2.4',
    },
    recommendation:
      "Future BREXIVA campaigns should prioritize Personalized Emails and Digital Detail Aids as primary content assets. Leaflets and Congress Posters should be used as supporting materials to reinforce brand messaging and increase visibility during congress and field-force activities.",
  },
];

export default function ChatPage() {
  const { state, dispatch, sendMessage, confirmModal, closeModal, setBriefMode } = useDAWN();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPLSModal, setShowPLSModal] = useState(false);
  const [showFileTransfer, setShowFileTransfer] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('normal');
  const [questionMessages, setQuestionMessages] = useState<ChatMessage[]>([]);
  const [qaStepIndex, setQaStepIndex] = useState(0);
  const [qaPrePopulated, setQaPrePopulated] = useState(QA_STORYLINE[0]?.userMessage ?? '');
  const [qaIsTyping, setQaIsTyping] = useState(false);

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

  const handleQuestionSend = (text: string) => {
    if (!text || qaIsTyping) return;

    const currentStep = QA_STORYLINE[qaStepIndex];
    if (!currentStep) return;

    const userMsg: ChatMessage = {
      id: `q-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setQuestionMessages((prev) => [...prev, userMsg]);
    setQaPrePopulated('');
    setQaIsTyping(true);

    setTimeout(() => {
      const agentContent: AgentResponseContent = { text: currentStep.agentResponse };
      if (currentStep.table) {
        agentContent.table = currentStep.table;
      }
      if (currentStep.chart) {
        agentContent.chart = currentStep.chart;
      }
      if (currentStep.recommendation) {
        agentContent.recommendation = currentStep.recommendation;
      }
      const agentMsg: ChatMessage = {
        id: `q-agent-${Date.now()}`,
        role: 'agent',
        content: agentContent,
        timestamp: new Date(),
      };
      setQuestionMessages((prev) => [...prev, agentMsg]);
      setQaIsTyping(false);

      const nextIndex = qaStepIndex + 1;
      setQaStepIndex(nextIndex);

      // Delay next question until after the agent response has finished streaming
      const responseLength = currentStep.agentResponse.length;
      const lines = currentStep.agentResponse.split('\n').length;
      const streamDuration = (responseLength * 4) + (lines * 20) + 800;

      setTimeout(() => {
        if (nextIndex < QA_STORYLINE.length) {
          setQaPrePopulated(QA_STORYLINE[nextIndex].userMessage);
        } else {
          setQaPrePopulated('');
        }
      }, streamDuration);
    }, 1200 + Math.random() * 600);
  };

  const showWelcomeScreen = state.messages.length === 0 && questionMessages.length === 0;

  return (
    <>
      <ChatNavbar
        hasNotifications={hasNotifications}
        onShowPLSModal={() => setShowPLSModal(true)}
        onShowNotifications={() => setShowNotifications(true)}
      />

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {showWelcomeScreen ? (
          /* Welcome screen */
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-3xl rounded-3xl p-8 text-center border border-gray-200">
              <h1 className="font-serif text-4xl text-dawn-navy mb-2">
                Hi Sarah, how can I help you today?
              </h1>
              <p className="text-gray-400 text-sm mb-10">
                DAWN — Your AI-powered content lifecycle agent
              </p>

              {/* Input area */}
              <div className="mb-6 text-left">
                <ChatInput
                  prePopulatedMessage={state.prePopulatedMessage}
                  questionPrePopulated={qaPrePopulated}
                  onSend={handleSend}
                  onQuestionSend={handleQuestionSend}
                  disabled={state.isAgentTyping}
                  questionDisabled={qaIsTyping}
                  mode={chatMode}
                  onModeChange={setChatMode}
                />
              </div>

              <QuickChips />
            </div>
          </div>
        ) : (
          /* Active chat */
          <>
            {chatMode === 'question' ? (
              <ChatContainer
                messages={questionMessages}
                isTyping={qaIsTyping}
                typingMessage="DAWN is thinking…"
              />
            ) : (
              <ChatContainer messages={state.messages} isTyping={state.isAgentTyping} typingMessage={state.typingMessage} />
            )}

            {/* Input bar */}
            <div className=" px-6 py-4 ">
              <div className="mx-auto max-w-4xl">
                <ChatInput
                  prePopulatedMessage={state.prePopulatedMessage}
                  questionPrePopulated={qaPrePopulated}
                  onSend={handleSend}
                  onQuestionSend={handleQuestionSend}
                  disabled={state.isAgentTyping || state.waitingForModalConfirm}
                  questionDisabled={qaIsTyping}
                  mode={chatMode}
                  onModeChange={setChatMode}
                />
              </div>
            </div>
          </>
        )}
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
        <DistributionModal onConfirm={() => { closeModal(); setShowFileTransfer(true); }} onClose={closeModal} />
      )}
      {showFileTransfer && (
        <FileTransferModal onComplete={() => { setShowFileTransfer(false); confirmModal(); }} />
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
    </>
  );
}
