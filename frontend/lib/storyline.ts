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
        brand: 'Hemlibra',
        ta: 'Hemophilia A',
        markets: ['Global'],
        audience: ['Hematologists', 'Rheumatologists'],
        budget: '$75,000',
        campaignId: 'DAWN-HEM-2026-0042',
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
      text: "I have pulled all available HAVEN clinical evidence from your data repository, including 10 documents covering the complete HAVEN clinical program.\n\n**Primary Evidence (Pre-selected):**\n• HAVEN 1 Clinical Study Report (156 pages)\n• HAVEN 3 Primary Analysis & Follow-up Studies (3 publications)\n• HAVEN 4 Clinical Study Report (18 pages)\n• HAVEN 7 Pediatric Study (54 pages)\n\n**Additional Research (Available):**\n• Clinical Experience & Real-world Evidence\n• Pharmacology & Mechanism Studies\n• Immunogenicity & Biomarker Analysis\n\nClick \"Preview Document\" on any card to view the full PDF. The most relevant documents are based on your campaign goals.",
      documentCards: HAVEN_DOCUMENTS,
    },
    autoAdvance: true,
    thinkingMessage: 'Searching for documents related to Hemlibra...',
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
      text: "Based on the selected evidence, the brief now includes core claims around HAVEN 4 median ABR and HAVEN 1 inhibitor efficacy, plus brand and regulatory callouts. Review the draft and confirm before I generate the campaign content.",
      actionButton: {
        label: 'Open Brief Builder →',
        modal: 'briefBuilder',
      },
      recommendation: '• Build the brief around HAVEN 4 median ABR and HAVEN 1 inhibitor efficacy as the foundational claims\n• Lead with patient-education brochure and promotional banner formats—these tend to perform better with HCPs than web-journey heavy approaches, especially when clinical data needs to be front and center',
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
      text: 'I have pulled all pre-approved compliance assets and MLR guidelines from your asset library. These documents ensure faster review cycles and regulatory compliance.\n\n**Pre-Approved Brand Assets:**\n• Hemlibra logo files and usage guidelines\n• Medical communication templates\n• MLR review checklists and protocols\n• Clinical report templates\n\nClick "Preview Document" on any asset to view the full file. All assets are pre-approved for use in pharmaceutical content creation.',
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
    autoAdvanceAfterModal: true,
    thinkingMessage: 'DAWN is integrating compliance guidelines and preparing template recommendations...',
  },

  // ─── Step 5: Content & Visual Creator (Merged) ────────────────────────────
  {
    id: 'step-5',
    stage: 'creator',
    userMessage: '',
    agentResponse: {
      text: 'Master creative assets and visual directions generated. Content includes copy for all 5 assets with persona-based tone, and visual variations for poster design. Review, edit content, and select your preferred visual direction.',
      contentAssets: [
        { id: 'poster', title: 'Poster - HAVEN 4 Data', persona: 'Clinical Researcher', language: 'EN (US)', wordCount: 420 },
        { id: 'email-us', title: 'HCP Email (US)', persona: 'Empathetic Specialist', language: 'EN (US)', wordCount: 285 },
        { id: 'email-de', title: 'HCP Email (DE)', persona: 'Conservative Specialist', language: 'DE', wordCount: 298 },
        { id: 'leaflet', title: 'Patient Leaflet', persona: 'Patient-Friendly', language: 'EN (US)', wordCount: 350 },
        { id: 'dda', title: 'Digital Detail Aid', persona: 'Innovator HCP', language: 'EN (US)', wordCount: 510 },
      ],
      imageVariations: [
        {
          id: 'poster',
          title: 'Congress Poster',
          image: '/templates/poster.png',
          description: 'Scientific poster layout with HAVEN 4 clinical data',
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
          id: 'dda',
          title: 'Digital Detail Aid',
          image: '/templates/dda.jpg',
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
Opening HEMLIBRA_clinical report.pdf (HAVEN 1 data, 156 pages)...
Reading HEMLIBRA_emicizumab-kxwh_research_ppr.pdf (HAVEN 4 study, 18 pages)...
Scanning HEMLIBRA_journal_ppr01.pdf (HAVEN 3 primary analysis, 158 pages)...
Reviewing hemlibra-medical-guid.pdf (medical communication standards, 24 pages)...
Checking HEMLIBRA-MLR.pdf (compliance protocols, 18 pages)...

Now applying your brand guidelines:
Loading hemlibra-logo.png and usage rules...
Setting color palette to deep navy #0D1B3E and teal #00A896...
Applying Hemlibra typography standards...
Following tone guidelines: professional, evidence-based, patient-centric...

Generating your 5 content assets:

Creating Congress Poster for Clinical Researchers...
Using scientific poster template with ICMJE format
Pulling HAVEN 4 data: median ABR 0.0, 56% zero bleeds
Structuring as: Background → Methods → Results → Conclusion
Adding ISI and references per medical communication standards
Target length: 420 words

Writing HCP Email for US market...
Using professional format proven to get 28% higher open rates
Emphasizing HAVEN 4 endpoints: median ABR 0.0
Highlighting treatment burden reduction (156 → 13 injections/year)
Tailoring tone for empathetic specialists
Target length: 285 words

Adapting content for German HCP Email...
Translating while maintaining the US structure
Adjusting tone for conservative specialist audience
Using formal "Sie" addressing per German standards
Including Fachinformation requirements for German market
Applying regional communication norms: measured, evidence-first
Target length: 298 words

Developing Patient Leaflet...
Writing in plain language at Grade 6-8 reading level
Explaining: What is Hemlibra? How does monthly dosing work?
Including patient outcomes: zero bleeds result from HAVEN 4
Making safety information accessible and clear
Target length: 350 words

Building Digital Detail Aid for field teams...
Creating modular slides: MOA → Efficacy → Safety → Dosing
Combining data from full HAVEN program (studies 1, 3, 4)
Adding interactive elements and data visualizations
Following field force presentation standards
Target length: 510 words

For the German content specifically:
I'm mirroring the English layout while adapting the clinical tone
Using Conservative Specialist persona to maintain credibility in German market
Ensuring formal address and clinical data emphasis throughout
Meeting Fachinformation and ISI requirements per German regulations
Following regional norms: measured tone, evidence-first approach

Running final checks:
Verifying all content follows MLR pre-approval protocols...
Confirming brand guidelines applied consistently across all 5 assets...
Generating visual variations using approved Hemlibra color palette...

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
        { asset: 'HCP Email (US)', tier: 'Tier 1', aiPreScreen: 'Clean', status: 'Passed' },
        { asset: 'HCP Email (DE)', tier: 'Tier 2', aiPreScreen: '1 flag', status: 'Pending' },
        { asset: 'Patient Leaflet', tier: 'Tier 1', aiPreScreen: 'Clean', status: 'Passed' },
        { asset: 'Digital Detail Aid', tier: 'Tier 2', aiPreScreen: '1 flag', status: 'Pending' },
      ],
      statusSummary: { total: 5, passed: 2, pending: 3, flagged: 3 },
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
    thinkingMessage: `Running MLR pre-screen on your content now...

Loading MLR review protocols:
Opening HEMLIBRA-MLR.pdf (18 pages of compliance protocols)...
Loading MLR review checklists and validation rules...
Initializing claim substantiation engine...

Analyzing your 5 campaign assets:

Scanning Congress Poster (420 words)...
Checking claim substantiation against HAVEN clinical data
Verifying all statistics have source references
Analyzing fair balance presentation
Checking ISI completeness and placement
Detecting promotional language patterns
Status: 2 items flagged for review

Scanning HCP Email - US (285 words)...
Cross-referencing claims with HAVEN 4 primary endpoints
Verifying treatment burden calculations (156 → 13)
Checking fair balance in benefit/risk presentation
Validating ISI footer compliance
Status: All claims validated ✓

Scanning HCP Email - Germany (298 words)...
Validating claims against German Fachinformation requirements
Checking formal address and clinical tone consistency
Verifying ISI format per German regulatory standards
Analyzing regional compliance requirements
Status: 1 item flagged - promotional language adjustment suggested

Scanning Patient Leaflet (350 words)...
Checking plain language readability (Grade 6-8 target)
Verifying patient safety information completeness
Validating outcome claims against HAVEN 4 data
Checking for medical jargon and complexity
Status: All content validated ✓

Scanning Digital Detail Aid (510 words)...
Validating HAVEN 1, 3, 4 comparative data presentation
Checking MOA description accuracy
Verifying dosing information completeness
Analyzing promotional claim substantiation
Status: 1 item flagged - claim language refinement needed

Running cross-asset checks:
Verifying messaging consistency across all 5 assets...
Checking claim harmony (no conflicting data)...
Validating tone consistency per persona guidelines...
Analyzing campaign-level cohesion...
Cross-check complete ✓

Fair balance analysis:
Calculating risk/benefit presentation ratios...
Poster: 78/100 (recommend adding adverse event context)
HCP Email (US): 91/100 (well balanced)
HCP Email (DE): 84/100 (good balance)
Patient Leaflet: 88/100 (well balanced)
DDA: 81/100 (consider safety emphasis)

Generating pre-screen report:
Total assets reviewed: 5
Passed initial scan: 2 (HCP Email US, Patient Leaflet)
Flagged for review: 3 (Poster, HCP Email DE, DDA)
Total claims validated: 39 of 42
ISI compliance: 5 of 5 complete

MLR pre-screen complete. Your detailed results are ready.`,
  },

  // ─── Step 7: Distribution ─────────────────────────────────────────────────
  {
    id: 'step-7',
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

  // ─── Step 8: Effectiveness ────────────────────────────────────────────────
  {
    id: 'step-8',
    stage: 'effectiveness',
    userMessage: 'Show me the campaign performance dashboard and recommend any next optimization actions.',
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
