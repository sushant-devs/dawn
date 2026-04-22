// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Stage =
  | 'setup'
  | 'finder'
  | 'briefMode'
  | 'manualBrief'
  | 'brief'
  | 'templateSelection'
  | 'creator'
  | 'imagegen'
  | 'mlr'
  | 'distribution'
  | 'effectiveness';

export type ModalType =
  | 'briefModeSelector'
  | 'manualBriefInput'
  | 'briefBuilder'
  | 'templateSelector'
  | 'contentEditor'
  | 'imageGen'
  | 'mlrChecker'
  | 'distribution'
  | 'effectiveness'
  | 'notifications'
  | 'plsGenerator';

export type MessageRole = 'user' | 'agent';

// ─── Chat Types ───────────────────────────────────────────────────────────────

export interface DocumentCard {
  id: string;
  title: string;
  type: 'CSR' | 'Publication' | 'Brand Standard' | 'Regulatory';
  relevance: number; // 0–100
  keyFinding: string;
  selected?: boolean;
  filePath?: string;
  pageCount?: number;
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

export interface TemplateCard {
  id: string;
  title: string;
  description: string;
  preview: string;
  category: string;
  features: string[];
  recommended: boolean;
}

export interface PLSQualityScore {
  dimension: string;
  score: number;
}

export interface NotificationData {
  type: 'mlr-approved' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  details?: MLRApprovalDetails;
}

export interface MLRApprovalDetails {
  approvedAssets: MLRTableRow[];
  approver: string;
  approvalDate: string;
  comments?: string;
}

export interface AgentResponseContent {
  text: string;
  recommendation?: string;
  campaignSummary?: CampaignSummaryCard;
  documentCards?: DocumentCard[];
  templateCards?: TemplateCard[];
  contentAssets?: ContentGenerationAsset[];
  imageVariations?: ImageVariation[];
  mlrTable?: MLRTableRow[];
  plsScores?: PLSQualityScore[];
  plsPreview?: string;
  metrics?: MetricBlock[];
  statusSummary?: StatusSummary;
  actionButton?: ActionButton;
  notification?: NotificationData;
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
  briefMode: 'manual' | 'auto' | null;
  selectedTemplates: Record<string, string>;
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
  | { type: 'TOGGLE_DOCUMENT'; payload: string }
  | { type: 'SET_BRIEF_MODE'; payload: 'manual' | 'auto' }
  | { type: 'SET_TEMPLATE'; payload: { assetType: string; templateId: string } };

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

// ─── Template Types ───────────────────────────────────────────────────────────

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'email' | 'poster' | 'leaflet' | 'dda' | 'social';
  description: string;
  structure: string[];
  recommended: boolean;
  preview: string;
}

export interface TemplateRecommendation {
  assetType: string;
  recommendedTemplates: ContentTemplate[];
}

// ─── Medical Prompt Library Types ─────────────────────────────────────────────

export interface MedicalPrompt {
  id: string;
  title: string;
  category: 'Efficacy' | 'Safety' | 'MOA' | 'Dosing' | 'Patient Support' | 'Custom';
  prompt: string;
  variables: string[];
  description: string;
  isFavorite?: boolean;
  usageCount?: number;
  lastUsed?: string;
  tags?: string[];
}

export interface PromptFeedback {
  promptId: string;
  rating: number;
  comment: string;
  timestamp: string;
}
