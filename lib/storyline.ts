import type { StorylineStep } from './types';
import { HAVEN_DOCUMENTS, PLS_SCORES, PLS_PREVIEW } from './mockData';

export const STORYLINE: StorylineStep[] = [
  // ─── Step 0: Campaign Setup ────────────────────────────────────────────────
  {
    id: 'step-0',
    stage: 'setup',
    userMessage:
      'Set up a new Hemlibra patient advocacy campaign for hemophilia A - the market will be global, targeting hematologists and rheumatologists, with a $75,000 budget.',
    agentResponse: {
      text: "Campaign workspace initialized. Here's your confirmed campaign configuration - all downstream modules will inherit these parameters.",
      campaignSummary: {
        brand: 'Hemlibra (emicizumab-kxwh)',
        ta: 'Hematology - Hemophilia A',
        markets: ['US', 'EMEA', 'Germany'],
        audience: ['Hematologists', 'Rheumatologists', 'Nurse Practitioners'],
        budget: '$75,000',
        campaignId: 'DAWN-HEM-2026-0042',
      },
    },
  },

  // ─── Step 1: Content Finder ────────────────────────────────────────────────
  {
    id: 'step-1',
    stage: 'finder',
    userMessage:
      'Search for clinical evidence on Hemlibra HAVEN trials - efficacy, ABR reduction, and prophylaxis.',
    agentResponse: {
      text: 'Searched across the evidence vault using semantic understanding. Found **6 highly relevant documents** across HAVEN 1–4 clinical data, brand standards, and regulatory materials. Select the documents to include, then send the next message to build your brief.',
      documentCards: HAVEN_DOCUMENTS,
    },
  },

  // ─── Step 2: Brief Builder ────────────────────────────────────────────────
  {
    id: 'step-2',
    stage: 'brief',
    userMessage: 'Create the campaign brief using the selected HAVEN documents.',
    agentResponse: {
      text: "I've pre-populated your campaign brief from the selected evidence. All key messages, mandatory safety inclusions, and deliverable specifications have been extracted and structured. Review and confirm before we begin content generation.",
      actionButton: {
        label: 'Open Brief Builder →',
        modal: 'briefBuilder',
      },
    },
    triggersModal: 'briefBuilder',
  },

  // ─── Step 3: Content Creator ──────────────────────────────────────────────
  {
    id: 'step-3',
    stage: 'creator',
    userMessage:
      'Generate the poster, HCP email, digital detail aid, and patient leaflet content using the approved brief.',
    agentResponse: {
      text: 'Generating all 5 campaign assets from the approved brief. Each asset is personalized for its target audience and pre-loaded with HAVEN clinical data and mandatory safety information.',
      contentAssets: [
        { id: 'poster',   title: 'Poster - HAVEN 4 Data', persona: 'Clinical Researcher', language: 'EN (US)', wordCount: 420 },
        { id: 'email-us', title: 'HCP Email (US)',                  persona: 'Empathetic Specialist', language: 'EN (US)', wordCount: 285 },
        { id: 'email-de', title: 'HCP Email (DE)',                  persona: 'Conservative Specialist', language: 'DE', wordCount: 298 },
        { id: 'leaflet',  title: 'Patient Leaflet',                 persona: 'Patient-Friendly', language: 'EN (US)', wordCount: 350 },
        { id: 'dda',      title: 'Digital Detail Aid',              persona: 'Innovator HCP', language: 'EN (US)', wordCount: 510 },
      ],
      actionButton: {
        label: 'Review & Edit Content →',
        modal: 'contentEditor',
      },
    },
    triggersModal: 'contentEditor',
  },

  // ─── Step 4: Image Generator ──────────────────────────────────────────────
  {
    id: 'step-4',
    stage: 'imagegen',
    userMessage:
      'Generate visual assets for the poster - deep navy and teal, highlight the 13 treatments per year benefit.',
    agentResponse: {
      text: 'Generated **3 design variations** for the poster. Each variation uses the Hemlibra brand palette with deep navy and teal accents, prominently featuring the 13 treatments/year benefit statement.',
      imageVariations: [
        {
          id: 'var-1',
          title: 'Variation 1 - Data-Led',
          gradient: 'linear-gradient(135deg, #0D1B3E 0%, #00A896 100%)',
          headline: '0.0 Median ABR',
          subline: '13 injections vs. 156 - HAVEN 4',
        },
        {
          id: 'var-2',
          title: 'Variation 2 - Patient-Centric',
          gradient: 'linear-gradient(135deg, #1a2f5e 0%, #008575 100%)',
          headline: '56% Zero Bleeds',
          subline: 'Monthly prophylaxis. Real freedom.',
        },
        {
          id: 'var-3',
          title: 'Variation 3 - Bold Minimal',
          gradient: 'linear-gradient(135deg, #0D1B3E 0%, #7C3AED 60%, #00A896 100%)',
          headline: '13 × / year',
          subline: 'Hemlibra Q4W - HAVEN 4 data',
        },
      ],
      actionButton: {
        label: 'Open Image Editor →',
        modal: 'imageGen',
      },
    },
    triggersModal: 'imageGen',
  },

  // ─── Step 5: MLR Review ───────────────────────────────────────────────────
  {
    id: 'step-5',
    stage: 'mlr',
    userMessage: 'Submit all assets for MLR compliance review.',
    agentResponse: {
      text: 'All assets submitted to the MLR Review Engine. AI pre-screening complete. 2 assets passed Tier 1 auto-approval; 3 require medical/legal reviewer attention.',
      mlrTable: [
        { asset: 'Poster',   tier: 'Tier 2', aiPreScreen: '2 flags', status: 'Pending' },
        { asset: 'HCP Email (US)',     tier: 'Tier 1', aiPreScreen: 'Clean',   status: 'Passed'     },
        { asset: 'HCP Email (DE)',     tier: 'Tier 2', aiPreScreen: '1 flag',  status: 'Pending' },
        { asset: 'Patient Leaflet',    tier: 'Tier 1', aiPreScreen: 'Clean',   status: 'Passed'     },
        { asset: 'Digital Detail Aid', tier: 'Tier 2', aiPreScreen: '1 flag',  status: 'Pending' },
      ],
      statusSummary: { total: 5, passed: 2, pending: 3, flagged: 3 },
      actionButton: {
        label: 'Open MLR Checker →',
        modal: 'mlrChecker',
      },
    },
    triggersModal: 'mlrChecker',
  },

  // ─── Step 6: Laylens PLS ──────────────────────────────────────────────────
  {
    id: 'step-6',
    stage: 'laylens',
    userMessage: 'Generate a plain language summary for the patient leaflet.',
    agentResponse: {
      text: 'Plain language summary generated Quality scoring across 5 dimensions:',
      plsScores: PLS_SCORES,
      plsPreview: PLS_PREVIEW,
    },
  },

  // ─── Step 7: Distribution ─────────────────────────────────────────────────
  {
    id: 'step-7',
    stage: 'distribution',
    userMessage: 'Distribute all approved assets across email, CRM, and other channels.',
    agentResponse: {
      text: 'All 5 assets are confirmed **Passed** status. Distribution channels configured and ready for review. Veeva Vault integration active - assets packaged and metadata-tagged.',
      statusSummary: { total: 5, passed: 5, pending: 0, flagged: 0 },
      actionButton: {
        label: 'Open Distribution Hub →',
        modal: 'distribution',
      },
    },
    triggersModal: 'distribution',
  },

  // ─── Step 8: Effectiveness ────────────────────────────────────────────────
  {
    id: 'step-8',
    stage: 'effectiveness',
    userMessage: 'Show me the campaign performance dashboard for the Hemlibra campaign.',
    agentResponse: {
      text: 'Campaign performance data loaded. **3 markets reporting.** Email, DDA, and otherchannels all above benchmark.',
      metrics: [
        { label: 'Email Open Rate', value: '34%',     trend: '↑ 8%',  trendUp: true,  benchmark: 'vs. 26% benchmark' },
        { label: 'Email CTR',       value: '12.4%',   trend: '↑ 4.1%', trendUp: true, benchmark: 'vs. 8.3% benchmark' },
        { label: 'DDA Engagement',  value: '4.2 min', trend: '↑ 1.1 min', trendUp: true, benchmark: 'vs. 3.1 min avg' },
        { label: 'Rx Switches',     value: '223',     trend: '+47 MoM', trendUp: true,  benchmark: 'vs. 160 target' },
      ],
      actionButton: {
        label: 'Open Full Dashboard →',
        modal: 'effectiveness',
      },
    },
    triggersModal: 'effectiveness',
  },
];

export const STAGE_LABELS: Record<string, string> = {
  setup: 'Campaign Setup',
  finder: 'Content Finder',
  brief: 'Brief Builder',
  creator: 'Content Creator',
  imagegen: 'Image Generator',
  mlr: 'MLR Review',
  laylens: 'Laylens PLS',
  distribution: 'Distribution',
  effectiveness: 'Effectiveness',
};
