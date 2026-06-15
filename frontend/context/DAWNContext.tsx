'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { DAWNState, DAWNAction, ChatMessage, ModalType, Stage, CampaignId } from '@/lib/types';
import { getCampaign, DEFAULT_CAMPAIGN_ID } from '@/lib/campaigns';

// Resolve the storyline for whichever campaign is currently active.
const storylineFor = (campaignId: CampaignId) => getCampaign(campaignId).storyline;

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: DAWNState = {
  campaignId: DEFAULT_CAMPAIGN_ID,
  messages: [],
  currentStepIndex: 0,
  currentStage: 'setup',
  completedStages: [],
  activeModal: null,
  isAgentTyping: false,
  typingMessage: 'DAWN is thinking…',
  prePopulatedMessage: '',
  hasStarted: false,
  waitingForModalConfirm: false,
  briefMode: null,
  selectedTemplates: {},
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function dawnReducer(state: DAWNState, action: DAWNAction): DAWNState {
  const STORYLINE = storylineFor(state.campaignId);
  switch (action.type) {
    case 'SELECT_CAMPAIGN': {
      // Switching campaigns starts that campaign fresh from step 0.
      return {
        ...initialState,
        campaignId: action.payload,
      };
    }

    case 'START_CONVERSATION': {
      const firstStep = STORYLINE[0];
      return {
        ...state,
        hasStarted: true,
        prePopulatedMessage: firstStep.userMessage,
      };
    }

    case 'SEND_USER_MESSAGE': {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: 'user',
        content: action.payload,
        timestamp: new Date(),
        stepIndex: state.currentStepIndex,
      };

      // Get the current step's thinking message if available
      const currentStep = STORYLINE[state.currentStepIndex];
      const thinkingMsg = currentStep?.thinkingMessage || 'DAWN is thinking…';

      return {
        ...state,
        messages: [...state.messages, userMsg],
        isAgentTyping: true,
        prePopulatedMessage: '',
        typingMessage: thinkingMsg,
      };
    }

    case 'ADD_AGENT_MESSAGE': {
      const currentStep = STORYLINE[state.currentStepIndex];
      const hasModal = !!currentStep?.triggersModal;

      // Determine stage tracking
      const newStage = (currentStep?.stage ?? state.currentStage) as Stage;
      const completedStages = state.completedStages.includes(newStage)
        ? state.completedStages
        : [...state.completedStages, newStage];

      // For non-modal steps, advance the index now so the next sendMessage call uses the right step
      let nextStepIndex = !hasModal ? state.currentStepIndex + 1 : state.currentStepIndex;

      // In manual mode, skip step-3b (auto brief builder) since it's not relevant
      if (state.briefMode === 'manual' && STORYLINE[nextStepIndex]?.id === 'step-3b') {
        nextStepIndex++;
      }

      const nextStep = STORYLINE[nextStepIndex];

      // Check if current step (the one we just added) has autoAdvance flag
      // This means after showing this step, we should automatically advance to the next
      const shouldAutoAdvance = !hasModal && currentStep?.autoAdvance;

      return {
        ...state,
        messages: [...state.messages, action.payload],
        isAgentTyping: shouldAutoAdvance ? true : false,
        waitingForModalConfirm: hasModal,
        currentStage: newStage,
        completedStages,
        currentStepIndex: nextStepIndex,
        typingMessage: shouldAutoAdvance && nextStep?.thinkingMessage ? nextStep.thinkingMessage : 'DAWN is thinking…',
        // Pre-populate next message immediately for non-modal, non-auto-advance steps
        prePopulatedMessage:
          !hasModal && !shouldAutoAdvance && nextStepIndex < STORYLINE.length
            ? STORYLINE[nextStepIndex].userMessage
            : '',
      };
    }

    case 'AUTO_ADVANCE_STEP': {
      // For auto-advance steps, skip showing user message and trigger agent response
      return {
        ...state,
        isAgentTyping: true,
      };
    }

    case 'SET_TYPING':
      return { ...state, isAgentTyping: action.payload };

    case 'SET_TYPING_MESSAGE':
      return { ...state, typingMessage: action.payload };

    case 'OPEN_MODAL':
      return { ...state, activeModal: action.payload };

    case 'CLOSE_MODAL':
      return { ...state, activeModal: null };

    case 'CONFIRM_MODAL': {
      const currentStep = STORYLINE[state.currentStepIndex];
      let nextIndex = state.currentStepIndex + 1;

      console.log('CONFIRM_MODAL: Current step:', currentStep?.id, 'nextIndex:', nextIndex);

      // In manual mode, skip step-3b (auto brief builder) and go directly to step-3d
      if (currentStep?.id === 'step-3a') {
        nextIndex = STORYLINE.findIndex(s => s.id === 'step-3d');
      }

      const nextStep = STORYLINE[nextIndex];
      const shouldAutoAdvance = currentStep?.autoAdvanceAfterModal && nextStep;

      console.log('CONFIRM_MODAL: Next step:', nextStep?.id, 'shouldAutoAdvance:', shouldAutoAdvance);

      return {
        ...state,
        activeModal: null,
        waitingForModalConfirm: false,
        currentStepIndex: nextIndex,
        isAgentTyping: shouldAutoAdvance ? true : false,
        typingMessage: shouldAutoAdvance && nextStep?.thinkingMessage ? nextStep.thinkingMessage : 'DAWN is thinking…',
        prePopulatedMessage: !shouldAutoAdvance && nextStep ? nextStep.userMessage : '',
      };
    }

    case 'ADVANCE_STEP': {
      const nextIndex = state.currentStepIndex + 1;
      const nextStep = STORYLINE[nextIndex];
      return {
        ...state,
        currentStepIndex: nextIndex,
        prePopulatedMessage: nextStep ? nextStep.userMessage : '',
      };
    }

    case 'SET_BRIEF_MODE': {
      // Find the correct step index based on mode
      let nextIndex;
      if (action.payload === 'manual') {
        // Go to step-3a (manual brief)
        nextIndex = STORYLINE.findIndex(s => s.id === 'step-3a');
      } else {
        // Go to step-3b (auto brief)
        nextIndex = STORYLINE.findIndex(s => s.id === 'step-3b');
      }

      const nextStep = STORYLINE[nextIndex];

      // Show the step's agent message first (like step-0) instead of opening the
      // modal immediately. The agent bubble (e.g. "I acknowledge your choice of
      // AUTO mode...") streams in; its action button then opens the builder.
      return {
        ...state,
        briefMode: action.payload,
        activeModal: null,
        waitingForModalConfirm: false,
        isAgentTyping: true,
        currentStepIndex: nextIndex,
        typingMessage: nextStep?.thinkingMessage ?? 'DAWN is thinking…',
        prePopulatedMessage: '', // Don't show user message
      };
    }

    case 'SET_TEMPLATE': {
      return {
        ...state,
        selectedTemplates: {
          ...state.selectedTemplates,
          [action.payload.assetType]: action.payload.templateId,
        },
      };
    }

    case 'RESET_CONVERSATION': {
      // Preserve the active campaign across a reset (e.g. switching chats).
      return { ...initialState, campaignId: state.campaignId };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface DAWNContextType {
  state: DAWNState;
  dispatch: React.Dispatch<DAWNAction>;
  sendMessage: (text: string) => void;
  openModal: (modal: ModalType) => void;
  confirmModal: () => void;
  closeModal: () => void;
  setBriefMode: (mode: 'manual' | 'auto') => void;
  selectCampaign: (id: CampaignId) => void;
}

const DAWNContext = createContext<DAWNContextType | null>(null);

export function DAWNProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dawnReducer, initialState);

  const getAgentTypingDelay = useCallback((thinkingMessage?: string) => {
    if (!thinkingMessage) return 500 + Math.random() * 300;

    const isDetailedThinking = thinkingMessage.includes('\n');
    if (!isDetailedThinking) return 500 + Math.random() * 300;

    const chars = thinkingMessage.length;
    const lines = thinkingMessage.split('\n').length;

    // Keep delay very close to stream duration to avoid post-stream idle time.
    const estimatedStreamMs = (chars * 3) + (lines * 15) + 100;
    return Math.max(estimatedStreamMs, 400);
  }, []);

  // Handle auto-advance steps (steps that should proceed without user input)
  React.useEffect(() => {
    const STORYLINE = storylineFor(state.campaignId);
    const currentStep = STORYLINE[state.currentStepIndex];
    const prevStepIndex = state.currentStepIndex - 1;
    const twoPrevStepIndex = state.currentStepIndex - 2;
    const prevStep = prevStepIndex >= 0 ? STORYLINE[prevStepIndex] : null;
    const twoPrevStep = twoPrevStepIndex >= 0 ? STORYLINE[twoPrevStepIndex] : null;
    const lastMessage = state.messages[state.messages.length - 1];
    const lastMessageIsAgent = lastMessage?.role === 'agent';
    const lastMessageStepIndex = lastMessage?.stepIndex;

    // Only auto-trigger when the last agent message belongs to the step that
    // actually completed — prevents duplicate bubbles when SET_BRIEF_MODE jumps
    // directly to step-3b (skipping step-3a) while step-3a still has
    // autoAdvanceAfterModal on the immediate predecessor slot.
    const shouldAutoTrigger =
      state.isAgentTyping &&
      lastMessageIsAgent &&
      currentStep &&
      ((prevStep?.autoAdvance && lastMessageStepIndex === prevStepIndex) ||
        (prevStep?.autoAdvanceAfterModal && lastMessageStepIndex === prevStepIndex) ||
        (twoPrevStep?.autoAdvanceAfterModal && lastMessageStepIndex === twoPrevStepIndex));

    if (shouldAutoTrigger && currentStep) {
      const delay = getAgentTypingDelay(currentStep.thinkingMessage);

      const timer = setTimeout(() => {
        const agentMsg: ChatMessage = {
          id: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role: 'agent',
          content: currentStep.agentResponse,
          timestamp: new Date(),
          stepIndex: state.currentStepIndex,
        };
        dispatch({ type: 'ADD_AGENT_MESSAGE', payload: agentMsg });
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [state.isAgentTyping, state.currentStepIndex, state.messages, state.campaignId, getAgentTypingDelay]);

  const sendMessage = useCallback(
    (text: string) => {
      dispatch({ type: 'SEND_USER_MESSAGE', payload: text });

      const currentStep = storylineFor(state.campaignId)[state.currentStepIndex];
      if (!currentStep) return;

      // Don't stream user message - show it instantly and only use agent typing delay
      const delay = getAgentTypingDelay(currentStep.thinkingMessage);

      setTimeout(() => {
        const agentMsg: ChatMessage = {
          id: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role: 'agent',
          content: currentStep.agentResponse,
          timestamp: new Date(),
          stepIndex: state.currentStepIndex,
        };
        dispatch({ type: 'ADD_AGENT_MESSAGE', payload: agentMsg });
      }, delay);
    },
    [state.currentStepIndex, state.campaignId, getAgentTypingDelay]
  );

  const openModal = useCallback((modal: ModalType) => {
    dispatch({ type: 'OPEN_MODAL', payload: modal });
  }, []);

  const confirmModal = useCallback(() => {
    dispatch({ type: 'CONFIRM_MODAL' });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const setBriefMode = useCallback((mode: 'manual' | 'auto') => {
    dispatch({ type: 'SET_BRIEF_MODE', payload: mode });

    // Show the brief-mode step's acknowledgment as a chat bubble (like step-0).
    // AUTO mode (step-3b) is a plain auto-advancing message that continues to
    // the next step; MANUAL mode (step-3a) auto-opens its input modal.
    const STORYLINE = storylineFor(state.campaignId);
    const stepId = mode === 'manual' ? 'step-3a' : 'step-3b';
    const step = STORYLINE.find((s) => s.id === stepId);
    if (!step) return;

    const delay = getAgentTypingDelay(step.thinkingMessage);
    const stepIndex = STORYLINE.findIndex((s) => s.id === stepId);
    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: 'agent',
        content: step.agentResponse,
        timestamp: new Date(),
        stepIndex,
      };
      dispatch({ type: 'ADD_AGENT_MESSAGE', payload: agentMsg });
      if (step.triggersModal) {
        const modal = step.triggersModal;
        setTimeout(() => dispatch({ type: 'OPEN_MODAL', payload: modal }), 600);
      }
    }, delay);
  }, [state.campaignId, getAgentTypingDelay]);

  const selectCampaign = useCallback((id: CampaignId) => {
    dispatch({ type: 'SELECT_CAMPAIGN', payload: id });
  }, []);

  return (
    <DAWNContext.Provider value={{ state, dispatch, sendMessage, openModal, confirmModal, closeModal, setBriefMode, selectCampaign }}>
      {children}
    </DAWNContext.Provider>
  );
}

export function useDAWN() {
  const ctx = useContext(DAWNContext);
  if (!ctx) throw new Error('useDAWN must be used inside DAWNProvider');
  return ctx;
}

// Convenience hook: returns the active campaign's data bundle. Modals use this
// so their content follows whichever campaign the user selected.
export function useCampaignData() {
  const { state } = useDAWN();
  return getCampaign(state.campaignId).data;
}
