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
import type { AgentResponseContent, ChatMessage, ChartData, NotificationData } from '@/lib/types';

interface QAStep {
  userMessage: string;
  agentResponse: string;
  chart?: ChartData;
}

const QA_STORYLINE: QAStep[] = [
  {
    userMessage: "What's the current status of my Brexiva campaign assets?",
    agentResponse: "Your Brexiva HR+/HER2- campaign has 4 assets in the MLR pipeline. 2 have passed (HCP Email & Patient Leaflet — both Tier 1, clean). 2 are pending review (Congress Poster — Tier 2, 2 flags; Digital Detail Aid — Tier 2, 1 flag).\n\nFinal approval is routed through DAM Platform and you'll receive a notification once cleared.",
    chart: {
      type: 'donut',
      title: 'MLR Pipeline Status',
      data: [
        { name: 'Passed', value: 2, color: '#00a896' },
        { name: 'Pending Review', value: 2, color: '#f59e0b' },
      ],
    },
  },
  {
    userMessage: "Can you summarise what the Brexiva Clinical Review Report says about patient selection?",
    agentResponse: "Based on the Brexiva Clinical Review Report (97% match, CSR) in your asset library: the report recommends selecting HR+/HER2- metastatic breast cancer patients who have progressed on at least one prior endocrine therapy.\n\nKey biomarker criteria include confirmed HER2-negativity and HR-positivity by local testing. The report highlights caution in patients with visceral crisis, where faster-acting chemotherapy may be preferred.",
  },
  {
    userMessage: "We ran a Brexiva campaign last quarter — what were the open rate and DDA engagement results?",
    agentResponse: "Here's the performance summary for the Brexiva Q1 oncology campaign:\n\n**Email open rate:** 34% (↑8% vs 28% benchmark)\n**Email CTR:** 12.4% (↑4.1% vs 8.3% benchmark)\n**DDA engagement:** 4.2 min avg (↑1.1 min vs 3.1 min avg)\n**Rx switches:** 223 (↑47 MoM vs 180 target)",
    chart: {
      type: 'bar',
      title: 'Q1 Campaign Performance vs Benchmark',
      data: [
        { name: 'Open Rate', value: 34, benchmark: 28, color: '#00a896' },
        { name: 'CTR', value: 12.4, benchmark: 8.3, color: '#0891b2' },
        { name: 'DDA (min)', value: 4.2, benchmark: 3.1, color: '#6366f1' },
        { name: 'Rx Switches', value: 223, benchmark: 180, color: '#f59e0b' },
      ],
    },
  },
  {
    userMessage: "What compliance assets do we have pre-approved for Brexiva in the oncology therapeutic area?",
    agentResponse: "I've pulled all pre-approved compliance assets from your library for the Brexiva / Brenova therapeutic area. Here's what's cleared for use:\n\n• Brexiva Logo Package — brand logo files & usage guidelines (95% match, Brand Standard)\n• Brexiva Clinical Review Report — treatment rationale & evidence considerations (92% match, Regulatory)\n• Safety Management & Monitoring Considerations — practical Brexiva monitoring guide (90% match, Regulatory)\n• Medical Communication Templates — MLR-reviewed communication templates\n\nAll assets are cleared for pharmaceutical content creation.",
  },
  {
    userMessage: "I want to set up a new patient advocacy campaign — where do I start?",
    agentResponse: "I can initialise a new campaign workspace in two steps. First, confirm your campaign configuration — brand, therapeutic area, target audience (e.g. oncologists, breast cancer specialists), markets (global or regional), and budget.\n\nOnce confirmed, I'll automatically pull all relevant clinical evidence from your data repository, retrieve pre-approved brand compliance assets, and offer you two brief modes:\n\n• **Auto mode** — I analyse your documents and generate a comprehensive brief\n• **Manual mode** — you provide briefs directly and I create content from your input",
  },
  {
    userMessage: "Why does the Congress Poster have 2 MLR flags and what needs to be fixed?",
    agentResponse: "The Congress Poster is a Tier 2 asset and the AI pre-screen identified 2 flagged claims. These typically fall into two risk categories:\n\n• **Comparative efficacy language** — any claim implying superiority over standard of care without direct trial citation\n• **Unsubstantiated survival data** — OS/PFS figures cited without the qualifying study reference\n\nYou can review the exact flag details and suggested revisions in the MLR Pre-Screen panel. Final approval remains with DAM Platform — revising and resubmitting the flagged claims should move the poster from Pending to Passed.",
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
      if (currentStep.chart) {
        agentContent.chart = currentStep.chart;
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
