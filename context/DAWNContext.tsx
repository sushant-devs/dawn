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
  selectedDocuments: ['haven1', 'haven2', 'haven3', 'haven4', 'brand', 'isi'],
  isAgentTyping: false,
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
      return {
        ...state,
        messages: [...state.messages, userMsg],
        isAgentTyping: true,
        prePopulatedMessage: '',
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

      return {
        ...state,
        messages: [...state.messages, action.payload],
        isAgentTyping: false,
        waitingForModalConfirm: hasModal,
        currentStage: newStage,
        completedStages,
        currentStepIndex: nextStepIndex,
        // Pre-populate next message immediately for non-modal steps
        prePopulatedMessage:
          !hasModal && nextStepIndex < STORYLINE.length
            ? STORYLINE[nextStepIndex].userMessage
            : state.prePopulatedMessage,
      };
    }

    case 'SET_TYPING':
      return { ...state, isAgentTyping: action.payload };

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

      const nextStep = STORYLINE[nextIndex];
      return {
        ...state,
        activeModal: null,
        waitingForModalConfirm: false,
        currentStepIndex: nextIndex,
        prePopulatedMessage: nextStep ? nextStep.userMessage : '',
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

    case 'TOGGLE_DOCUMENT': {
      const id = action.payload;
      const selected = state.selectedDocuments.includes(id)
        ? state.selectedDocuments.filter((d) => d !== id)
        : [...state.selectedDocuments, id];
      return { ...state, selectedDocuments: selected };
    }

    case 'SET_BRIEF_MODE': {
      // Determine which step to go to based on mode
      const nextIndex = action.payload === 'manual'
        ? state.currentStepIndex + 1  // Go to step-3a (manual brief)
        : state.currentStepIndex + 2;  // Go to step-3b (auto brief)
      const nextStep = STORYLINE[nextIndex];

      return {
        ...state,
        briefMode: action.payload,
        activeModal: null,
        waitingForModalConfirm: false,
        currentStepIndex: nextIndex,
        prePopulatedMessage: nextStep ? nextStep.userMessage : '',
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

  const sendMessage = useCallback(
    (text: string) => {
      dispatch({ type: 'SEND_USER_MESSAGE', payload: text });

      const currentStep = STORYLINE[state.currentStepIndex];
      if (!currentStep) return;

      // Simulate agent typing delay
      const delay = 1500 + Math.random() * 700;
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
    [state.currentStepIndex]
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
