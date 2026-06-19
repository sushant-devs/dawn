// ─── Core Domain Types ────────────────────────────────────────────────────────

// Identifies an available campaign. Kept here (rather than in campaigns/) to
// avoid a circular import, since campaign data files import domain types.
export type CampaignId = 'brexiva' | 'zoflevrix' | 'oncoryva' | 'corvanta';

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
  | 'manualBriefPreview'
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
  type: 'Clinical Report' | 'Research Paper' | 'Journal' | 'CSR' | 'Publication' | 'Brand Standard' | 'Regulatory' | 'Safety Guideline';
  relevance?: number; // 0–100
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
  campaignId: string;
}

export interface ContentGenerationAsset {
  id: string;
  title: string;
  persona: string;
  language: string;
}

export interface ImageVariation {
  id: string;
  title: string;
  image: string;
  description: string;
  type: string;
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
  textAfterSummary?: string;
  recommendation?: string;
  table?: TableData;
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
  chart?: ChartData;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string | AgentResponseContent;
  timestamp: Date;
  stepIndex?: number;
  thinking?: string;
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
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  status: 'Passed' | 'Pending' | 'Flagged' | 'Rejected';
  content: string;
  flags: MLRFlag[];
  fairBalanceScore: number;
  isiComplete: boolean;
  pufferyItems: string[];
  substantiationCount: string;
  /** Detailed compliance findings shown in the MLR pre-screen. */
  complianceFindings?: MLRComplianceFinding[];
  /** AI insight bullets shown in the recommendations panel. */
  aiInsights?: string[];
  /** Campaign-cohesion scores (0–100) for the Total Review panel. */
  cohesion?: MLRCohesion;
}

export interface MLRFlag {
  phrase: string;
  type: 'substantiated' | 'fair-balance' | 'puffery';
  source?: string;
  suggestion?: string;
}

export interface MLRComplianceFinding {
  severity: 'HIGH' | 'MINOR';
  category: 'MEDICAL' | 'LEGAL' | 'REGULATORY';
  finding: string;
  suggestion: string;
  ref: string;
}

export interface MLRCohesion {
  messageConsistency: number;
  toneAlignment: number;
  visualCohesion: number;
  claimHarmony: number;
}

// ─── Brief Types ──────────────────────────────────────────────────────────────

export interface BriefData {
  campaignName: string;
  brand: string;
  therapeuticArea: string;
  markets: string[];
  primaryAudience: string[];
  keyMessages: string[];
  deliverables: string[];
  /** Required regulatory/safety inclusions shown in the brief review. */
  mandatoryInclusions: string[];
  /** Exact title + content the user submitted in manual mode, shown in the read-only manual brief preview. */
  manualBrief?: {
    title: string;
    content: string;
  };
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
  /** Which campaign's storyline + data is currently active. */
  campaignId: CampaignId;
  messages: ChatMessage[];
  currentStepIndex: number;
  currentStage: Stage;
  completedStages: Stage[];
  activeModal: ModalType | null;
  isAgentTyping: boolean;
  typingMessage: string;
  prePopulatedMessage: string;
  hasStarted: boolean;
  waitingForModalConfirm: boolean;
  briefMode: 'manual' | 'auto' | null;
  selectedTemplates: Record<string, string>;
}

export type DAWNAction =
  | { type: 'SELECT_CAMPAIGN'; payload: CampaignId }
  | { type: 'START_CONVERSATION' }
  | { type: 'SEND_USER_MESSAGE'; payload: string }
  | { type: 'ADD_AGENT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_TYPING_MESSAGE'; payload: string }
  | { type: 'OPEN_MODAL'; payload: ModalType }
  | { type: 'CLOSE_MODAL' }
  | { type: 'CONFIRM_MODAL' }
  | { type: 'ADVANCE_STEP' }
  | { type: 'AUTO_ADVANCE_STEP' }
  | { type: 'SET_BRIEF_MODE'; payload: 'manual' | 'auto' }
  | { type: 'SET_TEMPLATE'; payload: { assetType: string; templateId: string } }
  | { type: 'RESET_CONVERSATION' };

// ─── Storyline Types ──────────────────────────────────────────────────────────

export interface StorylineStep {
  id: string;
  stage: Stage;
  userMessage: string;
  agentResponse: AgentResponseContent;
  triggersModal?: ModalType;
  autoAdvance?: boolean;
  autoAdvanceAfterModal?: boolean;
  thinkingMessage?: string;
}

export interface Asset {
  id: string;
  title: string;
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

export interface TemplateResponse {
  id: string;
  name: string;
  type: 'email' | 'poster' | 'leaflet' | 'dda' | 'social';
  description: string;
  structure: string[];
  recommended: boolean;
  size?: string;
  html_code?: string;
  // Public URL of a static HTML template file (e.g. under
  // /data/<brand>/Templates/). When present, the modal fetches this file's
  // contents for the preview instead of using inline html_code or the API.
  templateFile?: string;
  // List of pre-rendered thumbnail image URLs (e.g. from S3) returned by the
  // backend. The first entry is used as the card thumbnail. When absent or
  // empty, the UI falls back to a generated mock thumbnail.
  template_image?: string[];
}

export interface TemplateGroupResponse {
  assetType: string;
  recommendedTemplates: TemplateResponse[];
}

// ─── Medical Prompt Library Types ─────────────────────────────────────────────

export interface MedicalPrompt {
  id: string;
  title: string;
  category:
    | 'Efficacy'
    | 'Safety'
    | 'MOA'
    | 'Dosing'
    | 'Patient Support'
    | 'Integrated Campaign'
    | 'Product Education'
    | 'Launch Campaign'
    | 'Congress Engagement'
    | 'Omnichannel Engagement';
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


export interface TableData {
  title?: string;
  headers: string[];
  rows: string[][];
  highlightRowIndex?: number;
  caption?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  benchmark?: number;
  color?: string;
}

export interface ChartData {
  type: 'bar' | 'donut';
  title?: string;
  data: ChartDataPoint[];
  valueUnit?: string;
  hideTotal?: boolean;
}