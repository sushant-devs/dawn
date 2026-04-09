// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Stage =
  | 'setup'
  | 'finder'
  | 'brief'
  | 'creator'
  | 'imagegen'
  | 'mlr'
  | 'laylens'
  | 'distribution'
  | 'effectiveness';

export type ModalType =
  | 'briefBuilder'
  | 'contentEditor'
  | 'imageGen'
  | 'mlrChecker'
  | 'distribution'
  | 'effectiveness';

export type MessageRole = 'user' | 'agent';

// ─── Chat Types ───────────────────────────────────────────────────────────────

export interface DocumentCard {
  id: string;
  title: string;
  type: 'CSR' | 'Publication' | 'Brand Standard' | 'Regulatory';
  relevance: number; // 0–100
  keyFinding: string;
  selected?: boolean;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface MetricBlock {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  benchmark?: string;
}

export interface StatusSummary {
  total: number;
  passed: number;
  pending: number;
  flagged: number;
}

export interface ActionButton {
  label: string;
  modal?: ModalType;
  triggerNextStep?: boolean;
}

export interface CampaignSummaryCard {
  brand: string;
  ta: string;
  markets: string[];
  audience: string[];
  budget: string;
  campaignId: string;
}

export interface ContentGenerationAsset {
  id: string;
  title: string;
  persona: string;
  language: string;
  wordCount: number;
}

export interface ImageVariation {
  id: string;
  title: string;
  gradient: string;
  headline: string;
  subline: string;
}

export interface PLSQualityScore {
  dimension: string;
  score: number;
}

export interface AgentResponseContent {
  text: string;
  campaignSummary?: CampaignSummaryCard;
  documentCards?: DocumentCard[];
  contentAssets?: ContentGenerationAsset[];
  imageVariations?: ImageVariation[];
  mlrTable?: MLRTableRow[];
  plsScores?: PLSQualityScore[];
  plsPreview?: string;
  metrics?: MetricBlock[];
  statusSummary?: StatusSummary;
  actionButton?: ActionButton;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string | AgentResponseContent;
  timestamp: Date;
  stepIndex?: number;
}

// ─── MLR Types ────────────────────────────────────────────────────────────────

export interface MLRTableRow {
  asset: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  aiPreScreen: string;
  status: 'Passed' | 'Pending' | 'Flagged' | 'Rejected';
}

export interface MLRAssetDetail {
  id: string;
  name: string;
  tier: 'Tier 1' | 'Tier 2';
  status: 'Passed' | 'Pending' | 'Flagged' | 'Rejected';
  content: string;
  flags: MLRFlag[];
  fairBalanceScore: number;
  isiComplete: boolean;
  pufferyItems: string[];
  substantiationCount: string;
}

export interface MLRFlag {
  phrase: string;
  type: 'substantiated' | 'fair-balance' | 'puffery';
  source?: string;
  suggestion?: string;
}

// ─── Brief Types ──────────────────────────────────────────────────────────────

export interface BriefData {
  campaignName: string;
  brand: string;
  therapeuticArea: string;
  markets: string[];
  primaryAudience: string[];
  secondaryAudience: string[];
  keyMessages: string[];
  deliverables: string[];
  deadline: string;
  budget: string;
}

// ─── Distribution Types ───────────────────────────────────────────────────────

export interface DistributionChannel {
  id: string;
  name: string;
  asset: string;
  audience: string;
  deliveryDate: string;
  enabled: boolean;
  icon: string;
}

// ─── Effectiveness Types ──────────────────────────────────────────────────────

export interface MarketMetrics {
  market: string;
  openRate: string;
  ctr: string;
  ddaTime: string;
  posterDownloads: string;
  openRateStatus: 'above' | 'near' | 'below';
  ctrStatus: 'above' | 'near' | 'below';
}

export interface PersonaEngagement {
  persona: string;
  type: string;
  score: number;
  color: string;
}

export interface OptimizationRec {
  finding: string;
  action: string;
  impact: string;
}

// ─── Application State ────────────────────────────────────────────────────────

export interface DAWNState {
  messages: ChatMessage[];
  currentStepIndex: number;
  currentStage: Stage;
  completedStages: Stage[];
  activeModal: ModalType | null;
  selectedDocuments: string[];
  isAgentTyping: boolean;
  prePopulatedMessage: string;
  hasStarted: boolean;
  waitingForModalConfirm: boolean;
}

export type DAWNAction =
  | { type: 'START_CONVERSATION' }
  | { type: 'SEND_USER_MESSAGE'; payload: string }
  | { type: 'ADD_AGENT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'OPEN_MODAL'; payload: ModalType }
  | { type: 'CLOSE_MODAL' }
  | { type: 'CONFIRM_MODAL' }
  | { type: 'ADVANCE_STEP' }
  | { type: 'TOGGLE_DOCUMENT'; payload: string };

// ─── Storyline Types ──────────────────────────────────────────────────────────

export interface StorylineStep {
  id: string;
  stage: Stage;
  userMessage: string;
  agentResponse: AgentResponseContent;
  triggersModal?: ModalType;
}

export interface Asset {
  id: string;
  title: string;
  wordCount: number;
  persona: string;
  language: string;
  content: string;
  status: 'Passed' | 'Pending' | 'Flagged';
}
