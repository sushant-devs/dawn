'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { DAWNState, DAWNAction, ChatMessage, ModalType, Stage } from '@/lib/types';
import { STORYLINE } from '@/lib/storyline';

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: DAWNState = {
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
  switch (action.type) {
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
        id: `user-${Date.now()}`,
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
      const nextStepIndex = !hasModal ? state.currentStepIndex + 1 : state.currentStepIndex;
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

      // If we just completed manual brief input (step-3a), skip to template selection (step-4)
      if (currentStep?.id === 'step-3a') {
        // Skip step-3b (auto brief) and go to step-4 (template selection)
        nextIndex = state.currentStepIndex + 2;
      }

      // If current step has autoAdvanceAfterModal, skip step-3c, go to step-3d
      if (currentStep?.autoAdvanceAfterModal && currentStep?.id === 'step-3b') {
        nextIndex = state.currentStepIndex + 2; // Skip step-3c only for step-3b
      }

      const nextStep = STORYLINE[nextIndex];
      const shouldAutoAdvance = currentStep?.autoAdvanceAfterModal && nextStep;

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
      // Determine which step to go to based on mode
      const nextIndex = action.payload === 'manual'
        ? state.currentStepIndex + 1  // Go to step-3a (manual brief)
        : state.currentStepIndex + 2;  // Go to step-3b (auto brief)
      const nextStep = STORYLINE[nextIndex];

      // Determine which modal to open based on mode
      const nextModal = action.payload === 'manual'
        ? 'manualBriefInput'
        : 'briefBuilder';

      return {
        ...state,
        briefMode: action.payload,
        activeModal: nextModal,
        waitingForModalConfirm: true,
        currentStepIndex: nextIndex,
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
}

const DAWNContext = createContext<DAWNContextType | null>(null);

export function DAWNProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dawnReducer, initialState);

  const getAgentTypingDelay = useCallback((thinkingMessage?: string) => {
    if (!thinkingMessage) return 1500 + Math.random() * 700;

    const isDetailedThinking = thinkingMessage.includes('\n');
    if (!isDetailedThinking) return 1500 + Math.random() * 700;

    const chars = thinkingMessage.length;
    const lines = thinkingMessage.split('\n').length;

    // Keep delay very close to stream duration to avoid post-stream idle time.
    const estimatedStreamMs = (chars * 6) + (lines * 30) + 200;
    return Math.max(estimatedStreamMs, 1200);
  }, []);

  // Handle auto-advance steps (steps that should proceed without user input)
  React.useEffect(() => {
    const currentStep = STORYLINE[state.currentStepIndex];
    const prevStep = state.currentStepIndex > 0 ? STORYLINE[state.currentStepIndex - 1] : null;
    const twoPrevStep = state.currentStepIndex > 1 ? STORYLINE[state.currentStepIndex - 2] : null;
    const lastMessage = state.messages[state.messages.length - 1];
    const lastMessageIsAgent = lastMessage?.role === 'agent';

    // If agent is typing and either:
    // 1. Previous step had autoAdvance flag (meaning we should now show current step), OR
    // 2. Previous step had autoAdvanceAfterModal (meaning we auto-jumped here after modal), OR
    // 3. Two steps back had autoAdvanceAfterModal (when we skip a step)
    const shouldAutoTrigger = state.isAgentTyping &&
      lastMessageIsAgent &&
      (prevStep?.autoAdvance || prevStep?.autoAdvanceAfterModal || twoPrevStep?.autoAdvanceAfterModal);

    if (shouldAutoTrigger && currentStep) {
      const delay = getAgentTypingDelay(currentStep.thinkingMessage);

      const timer = setTimeout(() => {
        const agentMsg: ChatMessage = {
          id: `agent-${Date.now()}`,
          role: 'agent',
          content: currentStep.agentResponse,
          timestamp: new Date(),
          stepIndex: state.currentStepIndex,
        };
        dispatch({ type: 'ADD_AGENT_MESSAGE', payload: agentMsg });
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [state.isAgentTyping, state.currentStepIndex, state.messages, getAgentTypingDelay]);

  const sendMessage = useCallback(
    (text: string) => {
      dispatch({ type: 'SEND_USER_MESSAGE', payload: text });

      const currentStep = STORYLINE[state.currentStepIndex];
      if (!currentStep) return;

      // Don't stream user message - show it instantly and only use agent typing delay
      const delay = getAgentTypingDelay(currentStep.thinkingMessage);

      setTimeout(() => {
        const agentMsg: ChatMessage = {
          id: `agent-${Date.now()}`,
          role: 'agent',
          content: currentStep.agentResponse,
          timestamp: new Date(),
          stepIndex: state.currentStepIndex,
        };
        dispatch({ type: 'ADD_AGENT_MESSAGE', payload: agentMsg });
      }, delay);
    },
    [state.currentStepIndex, getAgentTypingDelay]
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
  }, []);

  return (
    <DAWNContext.Provider value={{ state, dispatch, sendMessage, openModal, confirmModal, closeModal, setBriefMode }}>
      {children}
    </DAWNContext.Provider>
  );
}

export function useDAWN() {
  const ctx = useContext(DAWNContext);
  if (!ctx) throw new Error('useDAWN must be used inside DAWNProvider');
  return ctx;
}
