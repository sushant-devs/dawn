import type {
  DocumentCard,
  BriefData,
  Asset,
  MLRAssetDetail,
  DistributionChannel,
  MarketMetrics,
  PersonaEngagement,
  OptimizationRec,
  PLSQualityScore,
  StorylineStep,
  CampaignId,
  TemplateGroupResponse,
} from '../types';

// ─── Per-campaign data bundle ────────────────────────────────────────────────
// Everything the UI needs to render one campaign end-to-end. Each campaign
// (Brexiva, Zoflevrix, Oncoryva, Corvanta) provides its own bundle; the active
// campaign is selected via the welcome-screen chips.

/**
 * A rendered visual template shown in the Content & Visual Editor's
 * "Visual Templates" tab. `file` points at a static asset under
 * /data/<brand>/... — either a PDF or an HTML document. The editor renders
 * HTML files directly in an iframe and PDFs via the PDF viewer.
 */
export interface VisualTemplate {
  id: string;
  title: string;
  type: string;
  file: string;
  description?: string;
}

export interface CampaignData {
  clinicalDocuments: DocumentCard[];
  complianceAssets: DocumentCard[];
  /**
   * Channel templates for this brand, grouped by asset type. Each template
   * references a static HTML file under /data/<brand>/Templates/ via
   * `templateFile`. The template-selector modal reads these instead of the API.
   */
  templates: TemplateGroupResponse[];
  /**
   * Rendered output templates shown in the Content Editor's Visual Templates
   * tab (e.g. files under /data/<brand>/Generated Templates/). PDF or HTML.
   */
  visualTemplates: VisualTemplate[];
  brief: BriefData;
  generatedAssets: Asset[];
  mlrAssets: MLRAssetDetail[];
  distributionChannels: DistributionChannel[];
  marketMetrics: MarketMetrics[];
  personaEngagement: PersonaEngagement[];
  optimizationRecs: OptimizationRec[];
  plsScores: PLSQualityScore[];
  plsPreview: string;
}

export interface Campaign {
  id: CampaignId;
  /** Short label shown on the welcome-screen chip. */
  chipLabel: string;
  /** Brand name, e.g. "Zoflevrix". */
  brand: string;
  storyline: StorylineStep[];
  data: CampaignData;
}
