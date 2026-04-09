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
      'I want to gather Hemlibra evidence. Should we include HAVEN 1–4 trial data as the reference set for efficacy and prophylaxis?',
    agentResponse: {
      text: 'I recommend including HAVEN 1–4 evidence, especially the ABR reduction and prophylaxis insights from HAVEN 4 and HAVEN 1. Found **6 highly relevant documents** across clinical data, brand standards, and regulatory materials. Select the documents to include, then confirm and I will fetch the evidence for your brief.',
      documentCards: HAVEN_DOCUMENTS,
    },
  },

  // ─── Step 2: Brief Builder ────────────────────────────────────────────────
  {
    id: 'step-2',
    stage: 'brief',
    userMessage: 'Yes, include HAVEN 1–4 trial data and build the campaign brief from those documents.',
    agentResponse: {
      text: "I've fetched the selected HAVEN 1–4 documents and extracted the recommended core claims. The brief now includes HAVEN 4 median ABR, HAVEN 1 inhibitor data, and brand/regulatory callouts. Review and confirm before content generation.",
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
      'Generate the master creative assets and adapt the German regional content from the approved brief, showing the source data used for localization.',
    agentResponse: {
      text: 'Generating all 5 campaign assets from the approved brief. Master English content is used as the primary source, with German local adaptation guided by German medical poster rules, regional HCP communication conventions, and Hemlibra brand standards. I recommend reviewing the German adaptations against local ISI and regulatory guidance.',
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
    userMessage: 'Run an internal pre-MLR review on the generated assets to identify any claims needing revision before final approval.',
    agentResponse: {
      text: 'I completed an internal pre-MLR scan. This tool identifies claims that may require revision and provides references for each flagged item. Tier 1 assets are lower-risk claims with clean substantiation, while Tier 2 assets require higher scrutiny and more documented support. Final approval is handled by Veeva Promomat, and Sarah will receive a notification once the asset is approved.',
      mlrTable: [
        { asset: 'Poster',   tier: 'Tier 2', aiPreScreen: '2 flags', status: 'Pending' },
        { asset: 'HCP Email (US)',     tier: 'Tier 1', aiPreScreen: 'Clean',   status: 'Passed'     },
        { asset: 'HCP Email (DE)',     tier: 'Tier 2', aiPreScreen: '1 flag',  status: 'Pending' },
        { asset: 'Patient Leaflet',    tier: 'Tier 1', aiPreScreen: 'Clean',   status: 'Passed'     },
        { asset: 'Digital Detail Aid', tier: 'Tier 2', aiPreScreen: '1 flag',  status: 'Pending' },
      ],
      statusSummary: { total: 5, passed: 2, pending: 3, flagged: 3 },
      actionButton: {
        label: 'Open MLR Pre-Screen →',
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
    userMessage: 'Distribute all approved assets once the Veeva Promomat approval notification is received.',
    agentResponse: {
      text: 'All 5 assets are confirmed **Passed** status in the pre-screen. Veeva Vault integration is active and metadata-tagged. Once Veeva Promomat approves, Sarah will get a notification and we can move forward with distribution planning.',
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
