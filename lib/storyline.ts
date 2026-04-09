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
      text: "Campaign workspace initialized. Here's your confirmed campaign configuration - all downstream modules will inherit these parameters. I recommend using HAVEN 1–4 clinical evidence as the foundational data set for efficacy, ABR reduction, and prophylaxis positioning. Once you confirm, I will proceed with evidence selection and brief building.",
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
      'Yes, proceed with the recommended HAVEN 1–4 evidence and show me the supporting documents.',
    agentResponse: {
      text: 'Confirmed. I have pulled the recommended HAVEN 1–4 evidence, including key clinical, brand, and regulatory documents. Select the documents you want to include, then confirm to build the campaign brief from those materials.',
      documentCards: HAVEN_DOCUMENTS,
    },
  },

  // ─── Step 2: Brief Builder ────────────────────────────────────────────────
  {
    id: 'step-2',
    stage: 'brief',
    userMessage: 'Build the brief now from the selected HAVEN 1–4 documents and highlight the strongest campaign claims.',
    agentResponse: {
      text: "Based on the selected evidence, I recommend building the brief around HAVEN 4 median ABR and HAVEN 1 inhibitor efficacy. The brief now includes those core claims, plus brand and regulatory callouts. Review the draft and confirm before I generate the campaign content.",
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
      'Okay, generate the master creative assets and show me how German regional content is being referenced.',
    agentResponse: {
      text: 'I recommend generating the master creative assets now so we can localize efficiently. Master English content will be the source, and German adaptation will reference German medical poster rules, regional HCP conventions, and Hemlibra brand standards. Review the draft assets and localization notes before editing.',
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
      'Please create the poster visuals with deep navy and teal, and make sure the 13 treatments/year benefit is highlighted.',
    agentResponse: {
      text: 'I recommend these three visual directions to support the poster narrative. Each uses the Hemlibra palette while highlighting the 13 treatments/year benefit, so the campaign visual language matches the clinical message.',
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
    userMessage: 'Run a pre-MLR scan and tell me which claims need revision before we send this to Veeva Promomat.',
    agentResponse: {
      text: 'I recommend this internal pre-MLR screen to catch issues before final approval. It identifies flagged claims, explains tier risk, and shows what needs revision. Final approval is handled by Veeva Promomat, and Sarah will receive a notification once the asset is approved.',
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
    userMessage: 'Yes, generate the plain language summary for the patient leaflet so it is easy to understand.',
    agentResponse: {
      text: 'I recommend generating the plain language summary now to ensure the patient leaflet is clear, accurate, and patient-friendly. The summary is scored across readability, coverage, and audience fit.',
      plsScores: PLS_SCORES,
      plsPreview: PLS_PREVIEW,
    },
  },

  // ─── Step 7: Distribution ─────────────────────────────────────────────────
  {
    id: 'step-7',
    stage: 'distribution',
    userMessage: 'Once Veeva Promomat approval is confirmed, prepare the distribution channel setup.',
    agentResponse: {
      text: 'I recommend preparing the distribution plan after approval. Veeva Vault integration is active and metadata-tagged, and I will help you select the most effective channels once the final approval notification arrives.',
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
    userMessage: 'Show me the campaign performance dashboard and recommend any next optimization actions.',
    agentResponse: {
      text: 'I recommend reviewing the key performance metrics to identify the highest-impact optimization opportunities. Here is the current performance summary across email, DDA, and patient channels.',
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
