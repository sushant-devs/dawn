import type { StorylineStep } from './types';
import { BLYVOR_DOCUMENTS, PLS_SCORES, PLS_PREVIEW } from './mockData';

export const STORYLINE: StorylineStep[] = [
  // ─── Step 0: Campaign Setup ────────────────────────────────────────────────
  {
    id: 'step-0',
    stage: 'setup',
    userMessage:
      'Set up a new Brexiva patient advocacy campaign for HR+/HER2− metastatic breast cancer under the Brevixa therapeutic area — the market will be global, targeting oncologists and breast cancer specialists, with a $90,000 budget.',
    agentResponse: {
      text: "Campaign workspace initialized. Here's your confirmed campaign configuration - all downstream modules will inherit these parameters.",
      campaignSummary: {
        brand: 'Brexiva',
        ta: 'Brevixa — HR+/HER2− Metastatic Breast Cancer',
        markets: ['Global', 'USA', 'EU', 'APAC'],
        audience: ['Oncologists', 'Breast Cancer Specialists', 'Oncology Nurse Practitioners'],
        budget: '$90,000',
        campaignId: 'DAWN-BRX-2026-0042',
      },
    },
    autoAdvance: true,
  },

  // ─── Step 1: Content Finder ────────────────────────────────────────────────
  {
    id: 'step-1',
    stage: 'finder',
    userMessage: '',
    agentResponse: {
      text: "I have pulled all available Brexiva clinical evidence from your data repository, including 7 documents covering the complete Brexiva clinical program.\n\n**Clinical Review:**\n• Brexiva Clinical Review Report\n\n**Journals:**\n• Brexiva in Metastatic Breast Cancer — Treatment Rationale & Evidence\n• Treatment Sequencing & Clinical Decision-Making\n• Safety Management & Practical Monitoring\n\n**Research Papers:**\n• Multicenter Phase II Study — Efficacy, Safety & Clinical Applicability\n• Patient-Reported Outcomes & Treatment Persistence\n• Biomarker Patterns & Endocrine-Resistance Features\n\nClick \"Preview Document\" on any card to view the full PDF. The most relevant documents are based on your campaign goals.",
      documentCards: BLYVOR_DOCUMENTS,
    },
    autoAdvance: true,
    thinkingMessage: 'Searching for documents related to Brexiva...',
  },

  // ─── Step 2: Brief Mode Selection ─────────────────────────────────────────
  {
    id: 'step-2',
    stage: 'briefMode',
    userMessage: '',
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
    userMessage: '',
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
    userMessage: '',
    agentResponse: {
      text: "Based on the selected evidence, the brief now includes core claims around BLYVOR-3 median PFS of 26.4 months and BLYVOR-1 confirmed objective response rates, plus brand and regulatory callouts. Review the draft and confirm before I generate the campaign content.",
      actionButton: {
        label: 'Open Brief Builder →',
        modal: 'briefBuilder',
      },
      recommendation: '• Build the brief around BLYVOR-3 median PFS (26.4 months vs 13.2 months) and 42% reduction in disease progression/death as the foundational claims\n• Lead with patient-education brochure and promotional banner formats—these tend to perform better with oncologists than web-journey heavy approaches, especially when clinical data needs to be front and center',
    },
    triggersModal: 'briefBuilder',
    autoAdvanceAfterModal: true,
    thinkingMessage: 'DAWN is pulling compliance documents and doing MLR checks...',
  },

  // ─── Step 3c: Brand Guidelines Integration ────────────────────────────────
  {
    id: 'step-3c',
    stage: 'brief',
    userMessage: 'Proceed with the brief and prepare for content generation.',
    agentResponse: {
      text: "Brief confirmed. I'm now integrating Brexiva Brand Guidelines v4 to ensure all generated content adheres to visual identity standards, approved tone of voice, and promotional claim guidelines. This includes logo usage rules, color palette, and messaging frameworks that will be automatically applied during content creation.",
      recommendation: '• Proceed with pre-MLR checks guidelines for accelerated review process\n• Utilize pre-approved images and logos from brand asset library\n• Apply automated compliance validation during content creation',
    },
  },

  // ─── Step 3d: Pre-MLR Compliance Assets ───────────────────────────────────
  {
    id: 'step-3d',
    stage: 'brief',
    userMessage: 'Yes, proceed with pre-MLR checks and show me the available compliance assets from the brand library.',
    agentResponse: {
      text: 'I have pulled all pre-approved compliance assets and MLR guidelines from your asset library. These documents ensure faster review cycles and regulatory compliance.\n\n**Pre-Approved Brand Assets:**\n• Brexiva logo files and usage guidelines\n• Brexiva Market Insight Reference Report\n• Brexiva MLR Compliance Report\n\nClick "Preview Document" on any asset to view the full file. All assets are pre-approved for use in pharmaceutical content creation.',
      documentCards: [
        {
          id: 'brexiva-logo',
          title: 'Brexiva Logo Package',
          type: 'Brand Standard',
          relevance: 95,
          keyFinding: 'Official brand logo files with usage guidelines',
          selected: true,
          filePath: '/data/brexiva-logo.png',
        },
        {
          id: 'market-insight',
          title: 'Brexiva Market Insight Reference Report',
          type: 'Market Insight',
          relevance: 92,
          keyFinding: 'Market analysis, competitive landscape, and commercial intelligence for Brexiva in HR+/HER2− mBC',
          selected: true,
          filePath: '/data/Market Insight Report/Brexiva Market Insight Reference Report.pdf',
        },
        {
          id: 'mlr-protocols',
          title: 'Brexiva MLR Compliance Report',
          type: 'Regulatory',
          relevance: 90,
          keyFinding: 'Standardized MLR review checklists and approval workflows',
          selected: true,
          filePath: '/data/MLR/Brexiva Mlr Compliance Report.pdf',
        },
      ],
    },
    autoAdvance: true,
    thinkingMessage: 'DAWN is integrating compliance guidelines and preparing template recommendations...',
  },

  // ─── Step 4: Template Selection ───────────────────────────────────────────
  {
    id: 'step-4',
    stage: 'templateSelection',
    userMessage: '',
    agentResponse: {
      text: 'Based on your campaign brief and target audience, here are the recommended content templates. Select the ones you want to use for your campaign.',
      templateCards: [
        {
          id: 'congress-poster',
          title: 'Congress Poster',
          description: 'Scientific format for BLYVOR data presentation',
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
    autoAdvanceAfterModal: true,
    thinkingMessage: 'DAWN is integrating compliance guidelines and preparing template recommendations...',
  },

  // ─── Step 5: Content & Visual Creator (Merged) ────────────────────────────
  {
    id: 'step-5',
    stage: 'creator',
    userMessage: '',
    agentResponse: {
      text: 'Master creative assets and visual directions generated. Content includes copy for all assets with persona-based tone, and visual variations for poster design. Review, edit content, and select your preferred visual direction.',
      contentAssets: [
        { id: 'poster', title: 'Congress Poster', persona: 'Clinical Researcher', language: 'EN (US)' },
        { id: 'email', title: 'HCP Email', persona: 'Empathetic Specialist', language: 'EN (US)' },
        { id: 'leaflet', title: 'Patient Leaflet', persona: 'Patient-Friendly', language: 'EN (US)' },
        { id: 'dda', title: 'Digital Detail Aid', persona: 'Innovator HCP', language: 'EN (US)' },
      ],
      imageVariations: [
        {
          id: 'poster',
          title: 'Congress Poster',
          image: '/templates/poster.png',
          description: 'Scientific poster layout with BLYVOR-3 clinical data',
          type: 'Scientific',
        },
        {
          id: 'email',
          title: 'HCP Email Template',
          image: '/templates/email.png',
          description: 'Professional HCP email format with data highlights',
          type: 'Digital',
        },
        {
          id: 'leaflet',
          title: 'Patient Leaflet',
          image: '/templates/patient-leaflet.png',
          description: 'Patient-friendly treatment guide for Brexiva',
          type: 'Print',
        },
        {
          id: 'dda',
          title: 'Digital Detail Aid',
          image: '/templates/dda.png',
          description: 'Interactive modular presentation for field teams',
          type: 'Interactive',
        },
      ],
      actionButton: {
        label: 'Review & Edit Content + Visuals →',
        modal: 'contentEditor',
      },
    },
    triggersModal: 'contentEditor',
    autoAdvanceAfterModal: true,
    thinkingMessage: `I'm creating your campaign content now. Let me walk you through what I'm doing...

First, I'm reading through your source documents:
Opening BREXIVA_clinical_report.pdf (BLYVOR-1 data)...
Reading BREXIVA_CDK46_inhibitor_research_ppr.pdf (BLYVOR-3 study)...
Scanning BREXIVA_journal_ppr01.pdf (BLYVOR-2 primary analysis)...
Reviewing brexiva-medical-guid.pdf (medical communication standards)...
Checking BREXIVA-MLR.pdf (compliance protocols)...

Now applying your brand guidelines:
Loading brexiva-logo.png and usage rules...
Setting color palette to deep navy #0D1B3E and coral #E85D75...
Applying Brexiva typography standards...
Following tone guidelines: professional, evidence-based, patient-centric...

Generating your content assets:

Creating Congress Poster for Clinical Researchers...
Using scientific poster template with ICMJE format
Pulling BLYVOR-3 data: median PFS 26.4 months, 42% reduction in progression/death
Structuring as: Background → Methods → Results → Conclusion
Adding ISI and references per medical communication standards

Writing HCP Email...
Using professional format proven to get higher open rates
Emphasizing BLYVOR-3 endpoints: median PFS 26.4 months vs 13.2 months
Highlighting 58% confirmed objective response rate
Tailoring tone for empathetic specialists

Developing Patient Leaflet...
Writing in plain language at Grade 6-8 reading level
Explaining: What is Brexiva? How does once-daily oral dosing work?
Including patient outcomes: PFS benefit from BLYVOR-3
Making safety information accessible and clear (Boxed Warning: Neutropenia, Hepatotoxicity)

Building Digital Detail Aid for field teams...
Creating modular slides: MOA → Efficacy → Safety → Dosing
Combining data from full BLYVOR program (studies 1, 2, 3)
Adding interactive elements and data visualizations
Following field force presentation standards

Running final checks:
Verifying all content follows MLR pre-approval protocols...
Confirming brand guidelines applied consistently across all assets...
Generating visual variations using approved Brexiva color palette...

Done! Your content is ready for review.`,
  },

  // ─── Step 6: MLR Review ───────────────────────────────────────────────────
  {
    id: 'step-6',
    stage: 'mlr',
    userMessage: '',
    agentResponse: {
      text: 'Internal MLR screen completed. It identifies flagged claims, explains tier risk, and shows what needs revision. Final approval is handled by Veeva Promomat, and you will receive a notification once the assets are approved.',
      mlrTable: [
        { asset: 'Poster', tier: 'Tier 2', aiPreScreen: '2 flags', status: 'Pending' },
        { asset: 'HCP Email', tier: 'Tier 1', aiPreScreen: 'Clean', status: 'Passed' },
        { asset: 'Patient Leaflet', tier: 'Tier 1', aiPreScreen: 'Clean', status: 'Passed' },
        { asset: 'Digital Detail Aid', tier: 'Tier 2', aiPreScreen: '1 flag', status: 'Pending' },
      ],
      statusSummary: { total: 4, passed: 2, pending: 2, flagged: 2 },
      actionButton: {
        label: 'Open MLR Pre-Screen →',
        modal: 'mlrChecker',
      },
      notification: {
        type: 'mlr-approved',
        title: 'MLR Review Approved',
        message: 'All campaign assets have been reviewed and approved by Veeva Promomat.',
        timestamp: '2026-04-10 14:23:00',
        details: {
          approvedAssets: [
            { asset: 'Poster', tier: 'Tier 2', aiPreScreen: 'Clean', status: 'Passed' },
            { asset: 'HCP Email', tier: 'Tier 1', aiPreScreen: 'Clean', status: 'Passed' },
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
    autoAdvanceAfterModal: true,
    thinkingMessage: `Running MLR pre-screen on your content now...

Loading MLR review protocols:
Opening BREXIVA-MLR.pdf...
Loading MLR review checklists and validation rules...
Initializing claim substantiation engine...

Analyzing your campaign assets:

Scanning Congress Poster...
Checking claim substantiation against BLYVOR clinical data
Verifying all statistics have source references
Analyzing fair balance presentation
Checking ISI completeness and placement
Detecting promotional language patterns
Status: Items flagged for review

Scanning HCP Email...
Cross-referencing claims with BLYVOR-3 primary endpoints
Verifying PFS improvement calculations (26.4 vs 13.2 months)
Checking fair balance in benefit/risk presentation
Validating ISI footer compliance
Status: All claims validated ✓

Scanning Patient Leaflet...
Checking plain language readability (Grade 6-8 target)
Verifying patient safety information completeness
Validating outcome claims against BLYVOR-3 data
Checking for medical jargon and complexity
Status: All content validated ✓

Scanning Digital Detail Aid...
Validating BLYVOR-1, 2, 3 comparative data presentation
Checking MOA description accuracy
Verifying dosing information completeness (150mg once daily oral)
Analyzing promotional claim substantiation
Status: Flagged - claim language refinement needed

Running cross-asset checks:
Verifying messaging consistency across all assets...
Checking claim harmony (no conflicting data)...
Validating tone consistency per persona guidelines...
Analyzing campaign-level cohesion...
Cross-check complete ✓

Fair balance analysis:
Calculating risk/benefit presentation ratios...
Poster: Recommend adding adverse event context
HCP Email: Well balanced
Patient Leaflet: Well balanced
DDA: Consider safety emphasis

Generating pre-screen report...
All claims cross-referenced against source documents
ISI compliance verified across all assets

MLR pre-screen complete. Your detailed results are ready.`,
  },

  // ─── Step 7: Distribution ─────────────────────────────────────────────────
  {
    id: 'step-7',
    stage: 'distribution',
    userMessage: '',
    agentResponse: {
      text: 'All campaign assets have been reviewed.You can now proceed to distribution.',
      statusSummary: { total: 4, passed: 4, pending: 0, flagged: 0 },
      actionButton: {
        label: 'Open Distribution Hub →',
        modal: 'distribution',
      },
      // recommendation: '• Prepare the distribution plan now to ensure optimal channel selection and timing for maximum reach',
    },
    triggersModal: 'distribution',
    autoAdvanceAfterModal: true,
  },

  // ─── Step 8: Effectiveness ────────────────────────────────────────────────
  {
    id: 'step-8',
    stage: 'effectiveness',
    userMessage: '',
    agentResponse: {
      text: 'Campaign performance dashboard ready. Here is the current performance summary across email, DDA, and patient channels.',
      metrics: [
        { label: 'Email Open Rate', value: '34%', trend: '↑ 8%', trendUp: true, benchmark: 'vs. 26% benchmark' },
        { label: 'Email CTR', value: '12.4%', trend: '↑ 4.1%', trendUp: true, benchmark: 'vs. 8.3% benchmark' },
        { label: 'DDA Engagement', value: '4.2 min', trend: '↑ 1.1 min', trendUp: true, benchmark: 'vs. 3.1 min avg' },
        { label: 'Rx Switches', value: '223', trend: '+47 MoM', trendUp: true, benchmark: 'vs. 160 target' },
      ],
      actionButton: {
        label: 'Open Full Dashboard →',
        modal: 'effectiveness',
      },
      // recommendation: '• Review the key performance metrics to identify the highest-impact optimization opportunities and adjust channel strategy accordingly',
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
