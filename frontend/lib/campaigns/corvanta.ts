import type { Campaign, CampaignData } from './types';
import type { StorylineStep, TemplateGroupResponse } from '../types';

// ════════════════════════════════════════════════════════════════════════════
// CORVANTA — Chronic Heart Failure | Cardiologists | Global
// Deliverable: Digital Detail Aid
// ════════════════════════════════════════════════════════════════════════════

// Selectable Digital Detail Aid templates under Templates/Digital Detail Aid/.
const TEMPLATE_DIR = '/data/corvanta/Templates/Digital Detail Aid';
const tmplFile = (name: string) => `${TEMPLATE_DIR}/${encodeURIComponent(name)}.html`;

const templates: TemplateGroupResponse[] = [
  {
    assetType: 'Digital Detail Aid',
    recommendedTemplates: [
      {
        id: 'interactive-slides-dda',
        name: 'Interactive Slides DDA',
        type: 'dda',
        description: 'Slide-based interactive presentation with branching navigation.',
        structure: ['Title', 'MOA', 'Outcomes', 'Safety', 'Dosing'],
        recommended: true,
        templateFile: tmplFile('Interactive Slides DDA'),
      },
      {
        id: 'card-carousel-dda',
        name: 'Card Carousel DDA',
        type: 'dda',
        description: 'Swipeable card carousel for quick, modular detailing.',
        structure: ['Cards', 'Key data', 'Safety', 'CTA'],
        recommended: false,
        templateFile: tmplFile('Card Carousel DDA'),
      },
      {
        id: 'fullscreen-immersive-dda',
        name: 'Fullscreen Immersive DDA',
        type: 'dda',
        description: 'Fullscreen immersive layout for high-impact field detailing.',
        structure: ['Hero', 'Story', 'Data', 'Safety'],
        recommended: false,
        templateFile: tmplFile('Fullscreen Immersive DDA'),
      },
      {
        id: 'storytelling-flow-dda',
        name: 'Storytelling Flow DDA',
        type: 'dda',
        description: 'Linear storytelling flow from disease burden to solution.',
        structure: ['Burden', 'Need', 'MOA', 'Evidence'],
        recommended: false,
        templateFile: tmplFile('Storytelling Flow DDA'),
      },
      {
        id: 'tabbed-sidebar-dda',
        name: 'Tabbed Sidebar DDA',
        type: 'dda',
        description: 'Tabbed sidebar layout for non-linear navigation of modules.',
        structure: ['Sidebar tabs', 'Module content', 'Safety', 'Dosing'],
        recommended: false,
        templateFile: tmplFile('Tabbed Sidebar DDA'),
      },
    ],
  },
];

// Generated output template for the Content Editor's Visual Templates tab.
const GENERATED_DIR = '/data/corvanta/Generated Templates';
const genFile = (path: string) => `${GENERATED_DIR}/${path.split('/').map(encodeURIComponent).join('/')}`;

const visualTemplates: CampaignData['visualTemplates'] = [
  {
    id: 'interactive-slides-dda',
    title: 'Interactive Slides DDA',
    type: 'Interactive',
    file: genFile('Digital Detail Aid/Interactive Slides DDA.html'),
    description: 'Generated digital detail aid — interactive slides layout.',
  },
];

const data: CampaignData = {
  templates,
  visualTemplates,
  clinicalDocuments: [
    {
      id: 'corvanta-risk-stratification',
      title: 'Corvanta Research Paper 3 Risk Stratification and Subgroup Patterns.pdf',
      type: 'Research Paper',
      relevance: 70,
      keyFinding: 'Research paper exploring risk stratification, subgroup response patterns, baseline characteristics, and Cardionex relevance across heart failure populations.',
      filePath: '/data/corvanta/Research Papers/Corvanta Research Paper 3 Risk Stratification and Subgroup Patterns.pdf',
      pageCount: 44,
    },
    {
      id: 'corvanta-functional-outcomes',
      title: 'Corvanta Cardionex Journal Paper 1 Functional Outcomes.pdf',
      type: 'Journal',
      relevance: 70,
      keyFinding: 'Journal-style paper evaluating Cardionex impact on functional capacity, symptom burden, quality of life, and daily activity outcomes.',
      filePath: '/data/corvanta/Journals/Corvanta Cardionex Journal Paper 1 Functional Outcomes.pdf',
      pageCount: 58,
    },
    {
      id: 'corvanta-safety-tolerability',
      title: 'Corvanta Cardionex Journal Paper 3 Safety Tolerability.pdf',
      type: 'Journal',
      relevance: 70,
      keyFinding: 'Journal-style paper focused on Cardionex safety, tolerability, adverse events, monitoring patterns, and practical risk-management considerations.',
      filePath: '/data/corvanta/Journals/Corvanta Cardionex Journal Paper 3 Safety Tolerability.pdf',
      pageCount: 48,
    },
    {
      id: 'corvanta-hospitalization',
      title: 'Corvanta Cardionex Journal Paper 2 Hospitalization Adherence.pdf',
      type: 'Journal',
      relevance: 69,
      keyFinding: 'Journal-style paper analyzing Cardionex treatment adherence, hospitalization patterns, persistence, care continuity, and real-world heart failure management.',
      filePath: '/data/corvanta/Journals/Corvanta Cardionex Journal Paper 2 Hospitalization Adherence.pdf',
      pageCount: 49,
    },
    {
      id: 'corvanta-pro',
      title: 'Corvanta Research Paper-2- Patient-Reported Outcomes.pdf',
      type: 'Research Paper',
      relevance: 67,
      keyFinding: 'Research paper assessing patient-reported outcomes, treatment experience, adherence, quality of life, and perceived Cardionex benefit.',
      filePath: '/data/corvanta/Research Papers/Corvanta Research Paper-2- Patient-Reported Outcomes.pdf',
      pageCount: 36,
    },
    {
      id: 'corvanta-stability-research',
      title: 'Corvanta Cardionex Clinical Stability Research Paper-1.pdf',
      type: 'Research Paper',
      relevance: 66,
      keyFinding: 'Research paper examining Cardionex-associated clinical stability, symptom control, functional outcomes, and longitudinal heart failure management patterns.',
      filePath: '/data/corvanta/Research Papers/Corvanta Cardionex Clinical Stability Research Paper-1.pdf',
      pageCount: 172,
    },
    {
      id: 'corvanta-clinical-review',
      title: 'CORVANTA Clinical Review Report.pdf',
      type: 'Clinical Report',
      relevance: 66,
      keyFinding: 'Clinical review report summarizing the evidence base and clinical considerations for Corvanta.',
      filePath: '/data/corvanta/Clinical Report/CORVANTA Clinical Review Report.pdf',
      pageCount: 82,
    },
    {
      id: 'corvanta-safety-guideline',
      title: 'CORVANTA_Safety Guideline Document.pdf',
      type: 'Safety Guideline',
      relevance: 65,
      keyFinding: 'Safety guideline for cardiology brand Corvanta, covering hypersensitivity, worsening heart failure, rhythm effects, renal monitoring, electrolytes, and counseling.',
      filePath: '/data/corvanta/Safety Guideline/CORVANTA_Safety Guideline Document.pdf',
      pageCount: 48,
    },
  ],
  complianceAssets: [
    {
      id: 'corvanta-mlr',
      title: 'CORVANTA Mlr Compliance Report.pdf',
      type: 'Regulatory',
      keyFinding: 'MLR compliance report reviewing Corvanta claims, fair balance, safety communication, substantiation readiness, and promotional risk areas.',
      selected: true,
      filePath: '/data/corvanta/MLR/CORVANTA Mlr Compliance Report.pdf',
      pageCount: 30,
    },
    {
      id: 'corvanta-safety-guideline',
      title: 'CORVANTA_Safety Guideline Document.pdf',
      type: 'Safety Guideline',
      keyFinding: 'Safety guideline for cardiology brand Corvanta, covering hypersensitivity, worsening heart failure, rhythm effects, renal monitoring, electrolytes, and counseling.',
      selected: true,
      filePath: '/data/corvanta/Safety Guideline/CORVANTA_Safety Guideline Document.pdf',
      pageCount: 48,
    },
    {
      id: 'corvanta-market',
      title: 'CORVANTA Market Insight Reference Report.pdf',
      type: 'Publication',
      keyFinding: 'Strategic market insight report covering heart failure landscape, audience needs, positioning opportunities, global trends, and campaign implications.',
      selected: true,
      filePath: '/data/corvanta/Market Insight Reference Report/CORVANTA Market Insight Reference Report.pdf',
      pageCount: 43,
    },
    {
      id: 'corvanta-logo',
      title: 'corvanta_logo.png',
      type: 'Brand Standard',
      keyFinding: 'Official Corvanta brand logo.',
      selected: true,
      filePath: '/data/corvanta/corvanta_logo.png',
      pageCount: 1,
    },
    {
      id: 'corvanta-approved-image-1',
      title: 'corvanta_approved_image1.jpg',
      type: 'Brand Standard',
      keyFinding: 'Approved Corvanta brand visual for use in campaign assets.',
      selected: true,
      filePath: '/data/corvanta/Approved Images/corvanta_approved_image1.jpg',
      pageCount: 1,
    },
    {
      id: 'corvanta-approved-image-2',
      title: 'corvanta_approved_image2.jpg',
      type: 'Brand Standard',
      keyFinding: 'Approved Corvanta brand visual for use in campaign assets.',
      selected: true,
      filePath: '/data/corvanta/Approved Images/corvanta_approved_image2.jpg',
      pageCount: 1,
    },
    {
      id: 'corvanta-approved-image-3',
      title: 'corvanta_approved_image3.jpg',
      type: 'Brand Standard',
      keyFinding: 'Approved Corvanta brand visual for use in campaign assets.',
      selected: true,
      filePath: '/data/corvanta/Approved Images/corvanta_approved_image3.jpg',
      pageCount: 1,
    },
    {
      id: 'corvanta-approved-image-4',
      title: 'corvanta_approved_image4.png',
      type: 'Brand Standard',
      keyFinding: 'Approved Corvanta brand visual for use in campaign assets.',
      selected: true,
      filePath: '/data/corvanta/Approved Images/corvanta_approved_image4.png',
      pageCount: 1,
    },
    {
      id: 'corvanta-approved-image-5',
      title: 'corvanta_approved_image5.png',
      type: 'Brand Standard',
      keyFinding: 'Approved Corvanta brand visual for use in campaign assets.',
      selected: true,
      filePath: '/data/corvanta/Approved Images/corvanta_approved_image5.png',
      pageCount: 1,
    },
    {
      id: 'corvanta-approved-image-6',
      title: 'corvanta_approved_image6.png',
      type: 'Brand Standard',
      keyFinding: 'Approved Corvanta brand visual for use in campaign assets.',
      selected: true,
      filePath: '/data/corvanta/Approved Images/corvanta_approved_image6.png',
      pageCount: 1,
    },
  ],
  brief: {
    campaignName: 'Corvanta Patient Education Campaign — Chronic Heart Failure',
    brand: 'Corvanta',
    therapeuticArea: 'Cardiology',
    markets: ['Global'],
    primaryAudience: ['Cardiologists'],
    keyMessages: [
      'Chronic heart failure requires ongoing pharmacologic management and careful monitoring of patient symptoms.',
      'Risk stratification is essential for optimizing treatment outcomes in patients with chronic heart failure.',
      'Understanding the core patient profile can aid in effective disease management and treatment planning.',
      'Safety considerations, including renal function monitoring, are critical in the management of chronic heart failure.',
    ],
    deliverables: ['Digital Detail Aid'],
    mandatoryInclusions: [
      'Hypersensitivity warnings related to Corvanta.',
      'Monitoring for worsening heart failure symptoms.',
      'Consideration of renal function and electrolyte abnormalities during treatment.',
    ],
  },
  generatedAssets: [
    {
      id: 'dda',
      title: 'Digital Detail Aid - Interactive HCP Presentation',
      persona: 'Innovator HCP',
      language: 'EN (US)',
      status: 'Passed',
      content: `Chronic heart failure requires ongoing pharmacologic management and careful monitoring of patient symptoms. 
Understanding the core patient profile can aid in effective disease management and treatment planning. 
The core patient profile includes adults diagnosed with chronic heart failure requiring ongoing pharmacologic management. 
The disease status of the core patient profile is stable or recently stabilized outpatient population. 
The symptom burden for the core patient profile includes persistent dyspnea, fatigue, exercise intolerance, or fluid-retention risk. 
The prior treatment for the core patient profile includes background heart-failure therapy already initiated or being optimized. 
The care setting for the core patient profile includes cardiology clinic, internal medicine clinic, heart-failure program, or transitional-care pathway. 
Risk stratification is essential for optimizing treatment outcomes in patients with chronic heart failure. 
Participants were eligible for the simulated analysis if they had a chronic heart failure diagnosis for at least 6 months. 
Participants were eligible for the simulated analysis if they were in NYHA functional class II to III at baseline. 
Participants were eligible for the simulated analysis if their background heart-failure care was stable for at least 4 weeks. 
Safety considerations, including renal function monitoring, are critical in the management of chronic heart failure. 
Patients may experience hypotension, dizziness, fatigue, renal-function changes, hyperkalemia or other electrolyte abnormalities. 
Corvanta is the brand name for Cardionex, a simulated investigational therapeutic concept for chronic heart failure management in adults. 
The intended role is adjunctive support alongside optimized standard heart-failure care. 
BOXED WARNING: 

Risk: Hypersensitivity reactions. 

Trigger / Setting: Initiation in patients with known hypersensitivity. 

Action for HCP: Discontinue if hypersensitivity occurs. 

Monitoring: Monitor for worsening heart failure symptoms. 

Contraindications: Known history of serious hypersensitivity to Cardionex. 
DATA REFERENCES:(mandatory) 

Patient Population: Adults with chronic heart failure requiring ongoing pharmacologic management 

Disease Status: Stable or recently stabilized outpatient population 

Symptom Burden: Persistent dyspnea, fatigue, exercise intolerance, or fluid-retention risk 

Prior Treatment: Background heart-failure therapy already initiated or being optimized 

Care Setting: Cardiology clinic, internal medicine clinic, heart-failure program, or transitional-care pathway 

Chronic Heart Failure Diagnosis Duration: At least 6 months 

NYHA Functional Class: II to III at baseline 

Background Care Stability Duration: At least 4 weeks 

Brand Name: Corvanta 

Drug Name: Cardionex `,
    },
  ],
  mlrAssets: [
    {
      id: 'dda',
      name: 'Digital Detail Aid',
      tier: 'Tier 2',
      status: 'Passed',
      content: '',
      fairBalanceScore: 85,
      isiComplete: true,
      pufferyItems: [],
      substantiationCount: '34/34',
      flags: [
        { phrase: '23% relative risk reduction in CV death or HF hospitalization', type: 'substantiated', source: 'SUSTAIN-HF CSR, Primary Composite Endpoint' },
        { phrase: 'Significant improvement in KCCQ quality-of-life score', type: 'substantiated', source: 'SUSTAIN-HF CSR, Secondary Endpoint' },
        { phrase: 'hypotension, hyperkalemia, and renal function monitoring', type: 'fair-balance', suggestion: 'Dedicated Module 5 covers safety monitoring - compliant' },
      ],
      complianceFindings: [
        {
          severity: 'MINOR',
          category: 'MEDICAL',
          finding:
            "The draft states 'Persistent dyspnea, fatigue' but does not include 'exercise intolerance, or fluid-retention risk' as part of the symptom burden, which is incomplete compared to the approved claim.",
          suggestion: "Include 'exercise intolerance, or fluid-retention risk' in the symptom burden description.",
          ref: '[DOC_000505_p004_c0010_C3] The symptom burden for the core patient profile includes persistent dyspnea, fatigue, exercise intolerance, or fluid-retention risk.',
        },
        {
          severity: 'MINOR',
          category: 'LEGAL',
          finding:
            "The brand name 'Corvanta' is mentioned without the required trademark symbol (®) on its first mention in the document.",
          suggestion: "Add the trademark symbol (®) next to the brand name 'Corvanta' on its first mention.",
          ref: '[Asset Type - 2. Product and Brand Overview] EXACT LINE: Brand, 1 = Corvanta.',
        },
      ],
      aiInsights: [
        'Medical Completeness Needed: Ensure all components of the symptom burden are included in the draft.',
        "Trademark Fix Needed: Add the trademark symbol (®) next to 'Corvanta' on its first mention.",
        'Strong Regulatory Alignment: The draft aligns well with the regulatory requirements for safety information.',
      ],
      cohesion: {
        messageConsistency: 93,
        toneAlignment: 88,
        visualCohesion: 91,
        claimHarmony: 44,
      },
    },
  ],
  distributionChannels: [
    { id: 'dda', name: 'eDetail / DDA', asset: 'Digital Detail Aid', audience: 'MSL Field Use', deliveryDate: '2026-07-15', enabled: true, icon: 'Tablet' },
    { id: 'rte', name: 'Rep-Triggered Follow-up', asset: 'Follow-up Summary', audience: 'Post-Visit HCPs', deliveryDate: '2026-07-22', enabled: false, icon: 'Share2' },
  ],
  marketMetrics: [
    { market: 'US', openRate: '—', ctr: '—', ddaTime: '5.1 min', posterDownloads: '—', openRateStatus: 'above', ctrStatus: 'above' },
    { market: 'Germany', openRate: '—', ctr: '—', ddaTime: '4.3 min', posterDownloads: '—', openRateStatus: 'near', ctrStatus: 'near' },
    { market: 'Global', openRate: '—', ctr: '—', ddaTime: '4.7 min', posterDownloads: '—', openRateStatus: 'above', ctrStatus: 'near' },
  ],
  personaEngagement: [
    { persona: 'Conservative', type: 'Factual content', score: 85, color: '#1E1B3D' },
    { persona: 'Empathetic', type: 'Patient narratives', score: 78, color: '#00A896' },
    { persona: 'Innovator', type: 'Interactive DDA', score: 95, color: '#7C3AED' },
    { persona: 'Leader', type: 'Executive summaries', score: 84, color: '#F59E0B' },
  ],
  optimizationRecs: [
    {
      finding: 'DDA engagement strong but drops after Module 2 (MOA animation)',
      action: 'Shorten MOA section, surface the outcomes data (Module 3) earlier',
      impact: 'Expected +1.0 min average session length',
    },
    {
      finding: 'Cardiologists spend most time on the safety monitoring module',
      action: 'Add an interactive titration calculator to Module 5',
      impact: 'Expected +12% completion rate',
    },
  ],
  plsScores: [
    { dimension: 'Readability', score: 87 },
    { dimension: 'Coverage', score: 91 },
    { dimension: 'PLS Alignment', score: 88 },
    { dimension: 'Structure', score: 94 },
    { dimension: 'Audience Fit', score: 90 },
  ],
  plsPreview: `Corvanta is a medicine used to treat chronic heart failure. It is taken by mouth once a day. In clinical studies, Corvanta lowered the chance of being hospitalized for heart failure or dying from heart-related causes, and helped people feel and function better day to day. Like all medicines, Corvanta has possible side effects — the most important to know are low blood pressure and changes in potassium and kidney function. Your doctor will check your blood pressure and run blood tests during treatment. Always tell your doctor and pharmacist about all the medicines you are taking.`,
};

// ─── Storyline ───────────────────────────────────────────────────────────────

const storyline: StorylineStep[] = [
  {
    id: 'step-0',
    stage: 'setup',
    userMessage:
      'Please create a patient education campaign for Corvanta in chronic heart failure targeting cardiologists globally. Deliverables: Digital Detail Aid.',
    agentResponse: {
      text: 'I have captured the details and am setting up your campaign now.',
      campaignSummary: {
        brand: 'Corvanta',
        ta: 'Cardiology',
        markets: ['Global'],
        audience: ['Cardiologists'],
        campaignId: 'DAWN-CAR-2026-0117',
      },
      textAfterSummary:
        'I have completed the intake of campaign requirements. I am now moving on to retrieve the relevant clinical evidence and base documents for this campaign.',
    },
    autoAdvance: true,
  },
  {
    id: 'step-1',
    stage: 'finder',
    userMessage: '',
    agentResponse: {
      text: "The evidence curation has highlighted key documents related to Cardionex, focusing on its clinical implications and outcomes.\n\n• CORVANTA Clinical Review Report.pdf\n• Corvanta Cardionex Journal Paper 1 Functional Outcomes.pdf\n• Corvanta Cardionex Journal Paper 2 Hospitalization Adherence.pdf\n• Corvanta Cardionex Journal Paper 3 Safety Tolerability.pdf\n• Corvanta Cardionex Clinical Stability Research Paper-1.pdf\nThese items represent a curated subset of the total collection available for review.",
      documentCards: data.clinicalDocuments,
    },
    autoAdvance: true,
    thinkingMessage: `Retrieving clinical evidence . . . . .
• Reading requirements — brand Corvanta, plus the user's campaign details.
• Decomposing the search into focused angles: clinical evidence, safety profile, MLR rules, and market context.
• Querying the asset library for every approved document for this brand.
• Re-ranking passages in the vector store to surface the most relevant clinical evidence.

Locating approved templates . . . . . .
• Looking up channel templates for: Congress Poster, Email, Patient Leaflet, Digital Detail Aid. 
• Pulling the template family for Corvanta so the campaign can be rendered into compliant layouts.

Outcome — templates ready:
• Approved templates located for 4 channels: Congress Poster, Email, Patient Leaflet, Digital Detail Aid.
• Most-used template per channel marked as recommended.

Outcome — knowledge base assembled:
• 7 clinical, 1 MLR, 1 safety, 1 market-insight documents.
• Scored 7 clinical documents; kept 10 top-ranked passages for the brief.
• Indexed 11 compliance, 13 safety, and 76 market-insight chunks for downstream citation. 
• Captured 6 pre-approved images and 1 brand logos for the visual layer.
• Consolidated knowledge base saved for brief and design stages.`,
  },
  {
    id: 'step-2',
    stage: 'briefMode',
    userMessage: '',
    agentResponse: {
      text: 'Documents retrieved. How would you like to create the campaign brief?',
      actionButton: { label: 'Select Brief Mode →', modal: 'briefModeSelector' },
    },
    triggersModal: 'briefModeSelector',
  },
  {
    id: 'step-3a',
    stage: 'manualBrief',
    userMessage: '',
    agentResponse: {
      text: "I acknowledge your choice of MANUAL mode for the brief, and I am now drafting it accordingly.\n",
    },
    triggersModal: 'manualBriefInput',
    autoAdvanceAfterModal: true,
  },
  {
    id: 'step-3b',
    stage: 'brief',
    userMessage: '',
    agentResponse: {
      text: "I acknowledge your choice of AUTO mode for the brief, and I am now drafting it accordingly.",
    },
    triggersModal: 'briefBuilder',
    autoAdvanceAfterModal: true,
  },
  {
    id: 'step-3d',
    stage: 'brief',
    userMessage: '',
    agentResponse: {
      text: 'The campaign focuses on promoting Corvanta within the cardiology therapeutic area, targeting cardiologists globally. Key messages emphasize the importance of ongoing management, risk stratification, and safety considerations in chronic heart failure treatment. The primary deliverable is a Digital Detail Aid that will incorporate clinical insights, patient profiles, and essential safety guidelines. ',
      documentCards: data.complianceAssets,
    },
    autoAdvance: true,
    thinkingMessage: `Drafting the strategic brief . . . . . . .
• Captured filters — brand Corvanta, therapeutic area Cardiology, audience cardiologists, markets global.
• Loaded clinical, safety, and market context from the extracted knowledge base for grounding.
• Anchoring the brief on the stated objective: disease education and treatment awareness, with deliverables limited to the requested deliverables.
• Drafting the core strategic narrative — what the campaign must say, to whom, and why now.

Brief drafted. Opening line:"The campaign strategy for Corvanta focuses on creating a Digital Detail Aid aimed at educating cardiologists about chronic heart failure, emphasizing disease management and treatment options…"

Building the execution plan . . . . . . .
• Mapping the brief onto each deliverable channel: Digital Detail Aid.
• Formulating a step-by-step execution plan for 1 channel.
• Distilling the campaign's core key messages and mandatory regulatory inclusions for every asset.

Plan locked . . . . .
• 1 execution step across 1 channel.
• 4 key message — leading with: "Chronic heart failure requires ongoing pharmacologic management and careful monitoring of patient symptoms.".
• 3 mandatory inclusion(s) — e.g. "Hypersensitivity warnings related to Corvanta.".`,
  },
  {
    id: 'step-4',
    stage: 'templateSelection',
    userMessage: '',
    agentResponse: {
      text: 'I will now pause for you to confirm the template selection before I proceed with producing the asset. Please let me know your choices when you are ready.',
      templateCards: [
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
      actionButton: { label: 'Select Templates →', modal: 'templateSelector' },
    },
    triggersModal: 'templateSelector',
    autoAdvanceAfterModal: true,
  },
  {
    id: 'step-5',
    stage: 'creator',
    userMessage: '',
    agentResponse: {
      text: 'I acknowledge the selection of the template for each channel, and I am now producing the asset based on that template.',
      contentAssets: [
        { id: 'dda', title: 'Digital Detail Aid', persona: 'Innovator HCP', language: 'EN (US)' },
      ],
      imageVariations: [
        {
          id: 'dda',
          title: 'Digital Detail Aid',
          image: '/templates/dda.png',
          description: 'Interactive modular presentation for field teams',
          type: 'Interactive',
        },
      ],
      actionButton: { label: 'Review & Edit Content + Visuals →', modal: 'contentEditor' },
    },
    triggersModal: 'contentEditor',
    autoAdvanceAfterModal: true,
    thinkingMessage: `Orchestrator thinking . . . . . .
Orchestrator is reviewing the current source state to determine which specialist agent should be invoked next based on the task requirements and available context.
• Working set — 10 approved source chunks available; target channels: Digital Detail Aid.
• Source inventory — 10 chunks, previewing the first few:

• CORVANTA Clinical Review Report.pdf · Core Patient Profile · p.4 — "[Asset: CORVANTA Clinical Review Report.pdf] [Description: Comprehensive clinical review summarizing Cardionex rationale, patient selection…"
• Corvanta Research Paper 3 Risk Stratification and Subgroup Patterns.pdf · Risk Stratification and Subgroup Patterns With Cardionex in Adults With Chronic Heart Failure: A Simulated Biomarker-Informed Analysis for Clinical Management · p.1 — "[Asset: Corvanta Research Paper 3 Risk Stratification and Subgroup Patterns.pdf] [Description: Research paper exploring risk stratification…"
• Corvanta Cardionex Journal Paper 1 Functional Outcomes.pdf · Study Population · p.3 — "[Asset: Corvanta Cardionex Journal Paper 1 Functional Outcomes.pdf] [Description: Journal-style paper evaluating Cardionex impact on functi…"
• Corvanta Cardionex Journal Paper 3 Safety Tolerability.pdf · Inclusion Criteria · p.2 — "[Asset: Corvanta Cardionex Journal Paper 3 Safety Tolerability.pdf] [Description: Journal-style paper focused on Cardionex safety, tolerabi…"
• Corvanta Research Paper 3 Risk Stratification and Subgroup Patterns.pdf · Study Population · p.3 — "[Asset: Corvanta Research Paper 3 Risk Stratification and Subgroup Patterns.pdf] [Description: Research paper exploring risk stratification…"
• …plus 5 more chunks queued for the Claim Agent.
• No claims captured yet — handing the work to the Claim Agent so it can mine the source material first.

Claim Agent thinking . . . . . .
Claim Agent is now active. Scanning approved source material to extract and structure a library of citable, single-sentence facts that will serve as the foundation for content generation.
• Inbound source set has 10 chunks to scan for claims.
• Reading every approved chunk and pulling out distinct, verifiable factual claims about the drug.
• Each claim must be one self-contained sentence so downstream agents can cite it without paraphrasing.
• Mined 34 verifiable claim(s) from 10 source chunk(s).
• Top claim: "The core patient profile includes adults diagnosed with chronic heart failure requiring ongoing pharmacologic management.".

Content Agent thinking . . . . . .
Content Agent is now active. Binding the verified claim library to the selected template and composing the full asset copy, ensuring every statement is grounded in an approved claim.
• Will draft copy for Digital Detail Aid.
• Assembling a knowledge record that binds the source chunks, the extracted claims, and the chosen template into a single structured payload.
• Bound 34 claims and 15 source passages into a knowledge record covering 1 channels: DIGITAL DETAIL AID.
• Captured template structure (sections, placeholders) so the draft will fit the chosen layout.
• Drafting the actual asset copy from the knowledge record — every line must trace back to an approved claim.

Drafted copy for 1 channels:
• DIGITAL DETAIL AID — citing 15 approved claim(s).

Opening line — "Chronic heart failure requires ongoing pharmacologic management and careful monitoring of patient symptoms."

Designer Agent thinking . . . . . .
Designer Agent is now active. Taking the drafted copy and rendering it into the chosen template layout, placing approved imagery and finalizing the visual asset for output.
• Design inputs — template family: Interactive Slides DDA.
• Pouring the drafted copy into the selected template structure to produce a rendered HTML draft.

Rendered 1 HTML draft(s):
• DIGITAL DETAIL AID — laid into "Interactive Slides DDA".
• Resolving image placeholders against the brand's pre-approved asset library and embedding them into the final HTML.
• Resolved pre-approved images from the brand asset library.

Embedded imagery into 1 final assets:
• DIGITAL DETAIL AID — 3 images embedded.

Design pipeline complete — asset is ready for the compliance review.`,
  },
  {
    id: 'step-6',
    stage: 'mlr',
    userMessage: '',
    agentResponse: {
      text: 'Internal MLR screen completed. It identifies flagged claims, explains tier risk, and shows what needs revision. You will receive a notification once the assets are approved.',
      mlrTable: [
        { asset: 'Digital Detail Aid', tier: 'Tier 2', aiPreScreen: '2 Flags', status: 'Pending' },
      ],
      actionButton: { label: 'Open MLR Pre-Screen →', modal: 'mlrChecker' },
      notification: {
        type: 'mlr-approved',
        title: 'MLR Review Approved',
        message: 'All campaign assets have been reviewed and approved.',
        timestamp: '2026-07-08 10:20:00',
        details: {
          approvedAssets: [
            { asset: 'Digital Detail Aid', tier: 'Tier 2', aiPreScreen: '2 Flags', status: 'Pending' },
          ],
          approver: 'Sarah Mitchell',
          approvalDate: '2026-07-08',
          comments: 'All claims substantiated. Minor fair-balance edits applied to the DDA. Asset ready for distribution.',
        },
      },
    },
    triggersModal: 'mlrChecker',
    autoAdvanceAfterModal: true,
    thinkingMessage: `Compliance review . . . . . .
• Loaded the draft asset alongside 34 approved claims.
• MEDICAL check — comparing every numeric or efficacy statement against approved claims.
• REGULATORY check — confirming the asset carries the required Boxed Warnings.
• LEGAL check — verifying trademark symbols and brand presentation.

Verdict — compliance issues found:
• 2 issues total — 0 high-severity, 2 minor.
• Distribution by domain: 1 medical, 1 legal.
• Top finding: "The draft states 'Persistent dyspnea, fatigue' but does not include 'exercise intolerance, or fluid-retention risk' as part of the symptom burden, which is incomplete compared to the approved claim.".
• Risk tier: TIER_2 — minor fixes required before release.`,
  },
  {
    id: 'step-7',
    stage: 'distribution',
    userMessage: '',
    agentResponse: {
      text: 'All campaign assets have been reviewed. You can now proceed for distribution.',
      actionButton: { label: 'Open Distribution Hub →', modal: 'distribution' },
    },
    triggersModal: 'distribution',
    autoAdvanceAfterModal: true,
  },
  {
    id: 'step-8',
    stage: 'effectiveness',
    userMessage: '',
    agentResponse: {
      text: 'Campaign performance dashboard ready. Here is the current performance summary for the Digital Detail Aid channel.',
      metrics: [
        { label: 'DDA Engagement', value: '4.7 min', trend: '↑ 1.3 min', trendUp: true, benchmark: 'vs. 3.1 min avg' },
        { label: 'Module Completion', value: '78%', trend: '↑ 11%', trendUp: true, benchmark: 'vs. 62% benchmark' },
        { label: 'MSL Field Usage', value: '312', trend: '+64 MoM', trendUp: true, benchmark: 'vs. 220 target' },
        { label: 'Rx Starts', value: '167', trend: '+29 MoM', trendUp: true, benchmark: 'vs. 130 target' },
      ],
      actionButton: { label: 'Open Full Dashboard →', modal: 'effectiveness' },
    },
    triggersModal: 'effectiveness',
    autoAdvanceAfterModal: true,
  },
  {
    id: 'step-9',
    stage: 'effectiveness',
    userMessage: '',
    agentResponse: {
      text: 'Your campaign session is complete. All assets approved, distributed to the DAM platform, and performance metrics captured. Thanks for collaborating with DAWN.',
    },
  },
];

export const corvantaCampaign: Campaign = {
  id: 'corvanta',
  chipLabel: 'Corvanta heart failure campaign',
  brand: 'Corvanta',
  storyline,
  data,
};
