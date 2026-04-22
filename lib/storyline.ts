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
      recommendation: '• Use HAVEN 1–4 clinical evidence as the foundational data set for efficacy, ABR reduction, and prophylaxis positioning\n• Once you confirm, I will proceed with evidence selection and brief building',
    },
  },

  // ─── Step 1: Content Finder ────────────────────────────────────────────────
  {
    id: 'step-1',
    stage: 'finder',
    userMessage:
      'Yes, proceed with the recommended HAVEN 1–4 evidence and show me the supporting documents.',
    agentResponse: {
      text: 'Confirmed. I have pulled all available HAVEN clinical evidence from your data repository, including 10 documents covering the complete HAVEN clinical program.\n\n**Primary Evidence (Pre-selected):**\n• HAVEN 1 Clinical Study Report (156 pages)\n• HAVEN 3 Primary Analysis & Follow-up Studies (3 publications)\n• HAVEN 4 Clinical Study Report (18 pages)\n• HAVEN 7 Pediatric Study (54 pages)\n\n**Additional Research (Available):**\n• Clinical Experience & Real-world Evidence\n• Pharmacology & Mechanism Studies\n• Immunogenicity & Biomarker Analysis\n\nClick "Preview Document" on any card to view the full PDF. The most relevant documents are pre-selected based on your campaign goals. Review and adjust selections as needed, then proceed to build your campaign brief.',
      documentCards: HAVEN_DOCUMENTS,
    },
  },

  // ─── Step 2: Brief Mode Selection ─────────────────────────────────────────
  {
    id: 'step-2',
    stage: 'briefMode',
    userMessage: 'Now proceed with building the campaign brief.',
    agentResponse: {
      text: "I can help you build the campaign brief in two ways. Choose the approach that works best for your workflow.\n• Manual mode: You provide the briefs directly and I create content based on your input\n• Auto mode: I analyze the selected documents and generate a comprehensive brief automatically",
      actionButton: {
        label: 'Select Brief Mode →',
        modal: 'briefModeSelector',
      },
    },
    triggersModal: 'briefModeSelector',
  },

  // ─── Step 3a: Manual Brief Input ──────────────────────────────────────────
  {
    id: 'step-3a',
    stage: 'manualBrief',
    userMessage: 'I want to manually add the campaign briefs.',
    agentResponse: {
      text: "Great! Please provide your campaign briefs, key messages, and objectives. I'll use these to create targeted content for your campaign.",
      actionButton: {
        label: 'Add Manual Briefs →',
        modal: 'manualBriefInput',
      },
      recommendation: '• Include your core claims, target audience, and key messages\n• Specify any mandatory inclusions or regulatory requirements',
    },
    triggersModal: 'manualBriefInput',
  },

  // ─── Step 3b: Auto Brief Builder ─────────────────────────────────────────
  {
    id: 'step-3b',
    stage: 'brief',
    userMessage: 'Build the brief automatically from the selected HAVEN 1–4 documents and highlight the strongest campaign claims.',
    agentResponse: {
      text: "Based on the selected evidence, the brief now includes core claims around HAVEN 4 median ABR and HAVEN 1 inhibitor efficacy, plus brand and regulatory callouts. Review the draft and confirm before I generate the campaign content.",
      actionButton: {
        label: 'Open Brief Builder →',
        modal: 'briefBuilder',
      },
      recommendation: '• Build the brief around HAVEN 4 median ABR and HAVEN 1 inhibitor efficacy as the foundational claims\n• Lead with patient-education brochure and promotional banner formats—these tend to perform better with HCPs than web-journey heavy approaches, especially when clinical data needs to be front and center',
    },
    triggersModal: 'briefBuilder',
  },

  // ─── Step 3c: Brand Guidelines Integration ────────────────────────────────
  {
    id: 'step-3c',
    stage: 'brief',
    userMessage: 'Proceed with the brief and prepare for content generation.',
    agentResponse: {
      text: "Brief confirmed. I'm now integrating Hemlibra Brand Guidelines v4 to ensure all generated content adheres to visual identity standards, approved tone of voice, and promotional claim guidelines. This includes logo usage rules, color palette, and messaging frameworks that will be automatically applied during content creation.",
      recommendation: '• Proceed with pre-MLR checks guidelines for accelerated review process\n• Utilize pre-approved images and logos from brand asset library\n• Apply automated compliance validation during content creation',
    },
  },

  // ─── Step 3d: Pre-MLR Compliance Assets ───────────────────────────────────
  {
    id: 'step-3d',
    stage: 'brief',
    userMessage: 'Yes, proceed with pre-MLR checks and show me the available compliance assets from the brand library.',
    agentResponse: {
      text: 'Confirmed. I have pulled all pre-approved compliance assets and MLR guidelines from your asset library. These documents ensure faster review cycles and regulatory compliance.\n\n**Pre-Approved Brand Assets:**\n• Hemlibra logo files and usage guidelines\n• Medical communication templates\n• MLR review checklists and protocols\n• Clinical report templates\n\nClick "Preview Document" on any asset to view the full file. All assets are pre-approved for use in pharmaceutical content creation. Review selections and proceed to template selection.',
      documentCards: [
        {
          id: 'hemlibra-logo',
          title: 'Hemlibra Logo Package',
          type: 'Brand Standard',
          relevance: 95,
          keyFinding: 'Official brand logo files with usage guidelines',
          selected: true,
          filePath: '/data/hemlibra-logo.png',
          pageCount: 1,
        },
        {
          id: 'medical-guide',
          title: 'Medical Communication Guidelines',
          type: 'Regulatory',
          relevance: 92,
          keyFinding: 'Pre-approved medical writing standards and claim language',
          selected: true,
          filePath: '/data/hemlibra-medical-guid.pdf',
          pageCount: 24,
        },
        {
          id: 'mlr-protocols',
          title: 'MLR Review Protocols',
          type: 'Regulatory',
          relevance: 90,
          keyFinding: 'Standardized MLR review checklists and approval workflows',
          selected: true,
          filePath: '/data/HEMLIBRA-MLR.pdf',
          pageCount: 18,
        },
        {
          id: 'market-insight',
          title: 'Market Insight Reference',
          type: 'Publication',
          relevance: 88,
          keyFinding: 'Market analysis and competitive intelligence data',
          selected: true,
          filePath: '/data/HEMLIBRA_Market_Insight_Reference.pdf',
          pageCount: 45,
        },
      ],
    },
  },

  // ─── Step 4: Template Selection ───────────────────────────────────────────
  {
    id: 'step-4',
    stage: 'templateSelection',
    userMessage: 'Show me the recommended content templates for this campaign.',
    agentResponse: {
      text: 'Based on your campaign brief and target audience, here are the recommended content templates. Select the ones you want to use for your campaign.',
      templateCards: [
        {
          id: 'congress-poster',
          title: 'Congress Poster',
          description: 'Scientific format for HAVEN data presentation',
          preview: '/templates/poster-preview.svg',
          category: 'Scientific',
          features: ['Data visualization', 'Clinical evidence layout', 'References section'],
          recommended: true,
        },
        {
          id: 'hcp-email',
          title: 'HCP Email',
          description: 'Professional tone with clinical data emphasis',
          preview: '/templates/email-preview.svg',
          category: 'Digital',
          features: ['28% higher open rates', 'Mobile-optimized', 'CTA tracking'],
          recommended: true,
        },
        {
          id: 'patient-leaflet',
          title: 'Patient Leaflet',
          description: 'Plain language optimized for Grade 6-8 readability',
          preview: '/templates/leaflet-preview.svg',
          category: 'Print',
          features: ['Patient-friendly language', 'Visual aids', 'FAQ section'],
          recommended: true,
        },
        {
          id: 'digital-detail-aid',
          title: 'Digital Detail Aid',
          description: 'Modular interactive format for field force',
          preview: '/templates/dda-preview.svg',
          category: 'Interactive',
          features: ['Swipeable modules', 'Video integration', 'Offline mode'],
          recommended: true,
        },
      ],
      actionButton: {
        label: 'Select Templates →',
        modal: 'templateSelector',
      },
    },
    triggersModal: 'templateSelector',
  },

  // ─── Step 5: Content Creator ──────────────────────────────────────────────
  {
    id: 'step-5',
    stage: 'creator',
    userMessage:
      'Okay, generate the master creative assets using the selected templates and show me how German regional content is being referenced.',
    agentResponse: {
      text: 'Master creative assets generated using your selected templates. Master English content will be the source, and German adaptation will reference German medical poster rules, regional HCP conventions, and Hemlibra brand standards. Review the draft assets and localization notes before editing.',
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
      recommendation: '• Use a translation-in-template approach for the German HCP email—this mirrors the English layout while adapting the tone to match what German HCPs expect\n• The "Conservative Specialist" persona maintains clinical credibility and aligns with regional communication norms',
    },
    triggersModal: 'contentEditor',
  },

  // ─── Step 6: Image Generator ──────────────────────────────────────────────
  {
    id: 'step-6',
    stage: 'imagegen',
    userMessage:
      'Please create the poster visuals with deep navy and teal, and make sure the 13 treatments/year benefit is highlighted.',
    agentResponse: {
      text: 'Three visual directions created to support the poster narrative. Each uses the Hemlibra palette while highlighting the 13 treatments/year benefit, so the campaign visual language matches the clinical message.',
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
      recommendation: '• Maintain the global brand palette—orange and red-orange as primary colors, with white backgrounds and dark text for readability\n• Use deep navy and teal as data accent colors rather than primary elements—this keeps visuals consistent with Hemlibra brand guidelines while letting clinical data stand out',
    },
    triggersModal: 'imageGen',
  },

  // ─── Step 7: MLR Review ───────────────────────────────────────────────────
  {
    id: 'step-7',
    stage: 'mlr',
    userMessage: 'Run an MLR scan and tell me which claims need revision before we send this to Veeva Promomat.',
    agentResponse: {
      text: 'Internal MLR screen completed. It identifies flagged claims, explains tier risk, and shows what needs revision. Final approval is handled by Veeva Promomat, and you will receive a notification once the assets are approved.',
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
      recommendation: '• Run this internal MLR screen to catch issues before final approval and reduce review cycles',
      notification: {
        type: 'mlr-approved',
        title: 'MLR Review Approved',
        message: 'All campaign assets have been reviewed and approved by Veeva Promomat.',
        timestamp: '2026-04-10 14:23:00',
        details: {
          approvedAssets: [
            { asset: 'Poster', tier: 'Tier 2', aiPreScreen: 'Clean', status: 'Passed' },
            { asset: 'HCP Email (US)', tier: 'Tier 1', aiPreScreen: 'Clean', status: 'Passed' },
            { asset: 'HCP Email (DE)', tier: 'Tier 2', aiPreScreen: 'Clean', status: 'Passed' },
            { asset: 'Patient Leaflet', tier: 'Tier 1', aiPreScreen: 'Clean', status: 'Passed' },
            { asset: 'Digital Detail Aid', tier: 'Tier 2', aiPreScreen: 'Clean', status: 'Passed' },
          ],
          approver: 'Sarah Mitchell (Veeva Promomat)',
          approvalDate: '2026-04-10',
          comments: 'All claims substantiated. Minor edits applied to poster and DDA for fair balance. Ready for distribution.',
        },
      },
    },
    triggersModal: 'mlrChecker',
  },

  // ─── Step 8: Distribution ─────────────────────────────────────────────────
  {
    id: 'step-8',
    stage: 'distribution',
    userMessage: 'Once Veeva Promomat approval is confirmed, prepare the distribution channel setup.',
    agentResponse: {
      text: 'Distribution plan ready. Veeva Vault integration is active and metadata-tagged. You can now select the most effective channels for your approved campaign assets.',
      statusSummary: { total: 5, passed: 5, pending: 0, flagged: 0 },
      actionButton: {
        label: 'Open Distribution Hub →',
        modal: 'distribution',
      },
      recommendation: '• Prepare the distribution plan now to ensure optimal channel selection and timing for maximum reach',
    },
    triggersModal: 'distribution',
  },

  // ─── Step 9: Effectiveness ────────────────────────────────────────────────
  {
    id: 'step-9',
    stage: 'effectiveness',
    userMessage: 'Show me the campaign performance dashboard and recommend any next optimization actions.',
    agentResponse: {
      text: 'Campaign performance dashboard ready. Here is the current performance summary across email, DDA, and patient channels.',
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
      recommendation: '• Review the key performance metrics to identify the highest-impact optimization opportunities and adjust channel strategy accordingly',
    },
    triggersModal: 'effectiveness',
  },
];

export const STAGE_LABELS: Record<string, string> = {
  setup: 'Campaign Setup',
  finder: 'Content Finder',
  briefMode: 'Brief Mode',
  manualBrief: 'Manual Brief',
  brief: 'Brief Builder',
  templateSelection: 'Template Selection',
  creator: 'Content Creator',
  imagegen: 'Image Generator',
  mlr: 'MLR Review',
  distribution: 'Distribution',
  effectiveness: 'Effectiveness',
};
