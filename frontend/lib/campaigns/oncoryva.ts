import type { Campaign, CampaignData } from './types';
import type { StorylineStep, TemplateGroupResponse } from '../types';

// ════════════════════════════════════════════════════════════════════════════
// ONCORYVA — HR+/HER2− Metastatic Breast Cancer | Oncology Specialists | Global
// Deliverables: HCP Email + Patient Leaflet
// ════════════════════════════════════════════════════════════════════════════

// Selectable Patient Leaflet templates under Templates/Patient Leaflet/.
const TEMPLATE_DIR = '/data/oncoryva/Templates/Patient Leaflet';
const tmplFile = (name: string) => `${TEMPLATE_DIR}/${encodeURIComponent(name)}.html`;

const templates: TemplateGroupResponse[] = [
  {
    assetType: 'Patient Leaflet',
    recommendedTemplates: [
      {
        id: 'guided-journey-a4',
        name: 'Guided Journey — Single-Page A4',
        type: 'leaflet',
        description: 'Single-page A4 layout that walks patients through treatment step by step.',
        structure: ['Cover', 'How it works', 'What to expect', 'Safety', 'Support'],
        recommended: true,
        templateFile: tmplFile('Guided Journey — Single-Page A4'),
      },
      {
        id: 'infographic-one-pager',
        name: 'Infographic One-Pager — Quick Guide',
        type: 'leaflet',
        description: 'Graphic-forward one-pager for at-a-glance patient education.',
        structure: ['Headline', 'Key facts', 'Visual aids', 'Resources'],
        recommended: false,
        templateFile: tmplFile('Infographic One-Pager — Quick Guide'),
      },
      {
        id: 'magazine-editorial',
        name: 'Magazine Style — Editorial Layout',
        type: 'leaflet',
        description: 'Editorial, magazine-style layout with a warmer narrative tone.',
        structure: ['Feature', 'Sections', 'Sidebar', 'FAQs'],
        recommended: false,
        templateFile: tmplFile('Magazine Style — Editorial Layout'),
      },
      {
        id: 'trifold-brochure',
        name: 'Trifold Brochure — Two-Sided',
        type: 'leaflet',
        description: 'Classic two-sided trifold brochure for print distribution.',
        structure: ['Panels', 'How it works', 'Safety', 'Contacts'],
        recommended: false,
        templateFile: tmplFile('Trifold Brochure — Two-Sided'),
      },
      {
        id: 'visual-narrative',
        name: 'Visual Narrative — Story Flow',
        type: 'leaflet',
        description: 'Story-flow layout that follows a patient journey visually.',
        structure: ['Story intro', 'Journey steps', 'Outcomes', 'Support'],
        recommended: false,
        templateFile: tmplFile('Visual Narrative — Story Flow'),
      },
    ],
  },
];

// Generated output template for the Content Editor's Visual Templates tab.
const GENERATED_DIR = '/data/oncoryva/Generated Templates';
const genFile = (path: string) => `${GENERATED_DIR}/${path.split('/').map(encodeURIComponent).join('/')}`;

const visualTemplates: CampaignData['visualTemplates'] = [
  {
    id: 'guided-journey-a4',
    title: 'Guided Journey — Single-Page A4',
    type: 'Print',
    file: genFile('Patient Leaflet/Guided Journey — Single-Page A4.html'),
    description: 'Generated patient leaflet — single-page A4 guided journey.',
  },
];

const data: CampaignData = {
  templates,
  visualTemplates,
  clinicalDocuments: [
    {
      id: 'oncoryva-efficacy-safety',
      title: 'ONCORYVA_Efficacy and Safety of Oncoryva in Patients With HR-HER2 - Metastatic Breast Cancer.pdf',
      type: 'Research Paper',
      relevance: 73,
      keyFinding: 'Research-style manuscript presenting simulated efficacy, safety, and clinical applicability considerations for Oncoryva in metastatic breast cancer.',
      filePath: '/data/oncoryva/Research Papers/ONCORYVA_Efficacy and Safety of Oncoryva in Patients With HR-HER2 - Metastatic Breast Cancer.pdf',
      pageCount: 168,
    },
    {
      id: 'oncoryva-endocrine-resistance',
      title: 'ONCORYVA_Endocrine-Resistance Patterns and Biomarker-Stratified Outcomes With Oncoryva in HR HER2− Metastatic Breast Cancer.pdf',
      type: 'Research Paper',
      relevance: 73,
      keyFinding: 'Biomarker-focused manuscript examining endocrine-resistance patterns, stratified outcomes, and molecular considerations associated with Oncoryva.',
      filePath: '/data/oncoryva/Research Papers/ONCORYVA_Endocrine-Resistance Patterns and Biomarker-Stratified Outcomes With Oncoryva in HR HER2− Metastatic Breast Cancer.pdf',
      pageCount: 54,
    },
    {
      id: 'oncoryva-pro',
      title: 'ONCORYVA_Patient-Reported Outcomes, Treatment Persistence, and Symptom Burden With Oncoryva in HR HER2− Metastatic Breast Cancer.pdf',
      type: 'Research Paper',
      relevance: 73,
      keyFinding: 'Observational-style manuscript exploring patient-reported outcomes, symptom burden, and treatment persistence considerations with Oncoryva.',
      filePath: '/data/oncoryva/Research Papers/ONCORYVA_Patient-Reported Outcomes, Treatment Persistence, and Symptom Burden With Oncoryva in HR HER2− Metastatic Breast Cancer.pdf',
      pageCount: 39,
    },
    {
      id: 'oncoryva-clinical-rationale',
      title: 'ONCORYVA_Clinical Rationale and Treatment-Pathway Considerations for Oncoryva in HR HER2− Metastatic Breast Cancer.pdf',
      type: 'Journal',
      relevance: 73,
      keyFinding: 'Clinical rationale paper discussing Oncoryva’s treatment-pathway positioning, patient selection considerations, and oncology decision-making context.',
      filePath: '/data/oncoryva/Journals/ONCORYVA_Clinical Rationale and Treatment-Pathway Considerations for Oncoryva in HR HER2− Metastatic Breast Cancer.pdf',
      pageCount: 78,
    },
    {
      id: 'oncoryva-benefit-risk',
      title: 'ONCORYVA_Benefit-Risk Assessment and Evidence-Generation Roadmap for Oncoryva in HR HER2− Metastatic Breast Cancer.pdf',
      type: 'Journal',
      relevance: 70,
      keyFinding: 'Journal on Benefit-risk assessment and evidence roadmap outlining clinical considerations, research priorities, and future evidence-generation strategy for Oncoryva.',
      filePath: '/data/oncoryva/Journals/ONCORYVA_Benefit-Risk Assessment and Evidence-Generation Roadmap for Oncoryva in HR HER2− Metastatic Breast Cancer.pdf',
      pageCount: 46,
    },
    {
      id: 'oncoryva-dev-considerations',
      title: 'ONCORYVA_Oncology Development Considerations for Oncoryva in HR HER2 - Metastatic Breast Cancer.pdf',
      type: 'Journal',
      relevance: 70,
      keyFinding: 'Oncology development paper exploring Oncoryva’s clinical development strategy, evidence needs, and specialist communication considerations.',
      filePath: '/data/oncoryva/Journals/ONCORYVA_Oncology Development Considerations for Oncoryva in HR HER2 - Metastatic Breast Cancer.pdf',
      pageCount: 52,
    },
    {
      id: 'oncoryva-clinical-review',
      title: 'ONCORYVA- Clinical Review Document.pdf',
      type: 'Clinical Report',
      relevance: 66,
      keyFinding: 'Clinical review document summarizing the evidence base and clinical considerations for Oncoryva.',
      filePath: '/data/oncoryva/Clinical Report/ONCORYVA- Clinical Review Document.pdf',
      pageCount: 82,
    },
  ],
  complianceAssets: [
    {
      id: 'oncoryva-mlr',
      title: 'ONCORYVA_MLR_Compliance Report.pdf',
      type: 'Regulatory',
      keyFinding: 'MLR compliance report defining medical, legal, and regulatory review considerations for Oncoryva communication assets.',
      selected: true,
      filePath: '/data/oncoryva/MLR/ONCORYVA_MLR_Compliance Report.pdf',
      pageCount: 31,
    },
    {
      id: 'oncoryva-safety-guideline',
      title: 'ONCORYVA_Safety Guideline Document.pdf',
      type: 'Safety Guideline',
      keyFinding: 'Safety guideline for oncology brand Oncoryva, covering contraindications, administration reactions, myelosuppression, hepatic monitoring, infection risk, and counseling.',
      selected: true,
      filePath: '/data/oncoryva/Safety Guideline/ONCORYVA_Safety Guideline Document.pdf',
      pageCount: 48,
    },
    {
      id: 'oncoryva-market',
      title: 'ONCORYVA_Market Insight Reference Report.pdf',
      type: 'Publication',
      keyFinding: 'Market insight reference report outlining global oncology trends, specialist needs, and communication opportunities for Oncoryva.',
      selected: true,
      filePath: '/data/oncoryva/Market Insight Reference Report/ONCORYVA_Market Insight Reference Report.pdf',
      pageCount: 44,
    },
    {
      id: 'oncoryva-logo',
      title: 'ONCORYVA- LOGO.png',
      type: 'Brand Standard',
      keyFinding: 'Official Oncoryva brand logo.',
      selected: true,
      filePath: '/data/oncoryva/ONCORYVA- LOGO.png',
      pageCount: 1,
    },
    {
      id: 'oncoryva-approved-abstract',
      title: 'ONCORYVA_Approved_Image_Abstract_Oncology_Cellular_Visual.png',
      type: 'Brand Standard',
      keyFinding: 'Abstract cellular oncology visual showing tumor microenvironment with blue-teal scientific depth.',
      selected: true,
      filePath: '/data/oncoryva/Approved Images/ONCORYVA_Approved_Image_Abstract_Oncology_Cellular_Visual.png',
      pageCount: 1,
    },
    {
      id: 'oncoryva-approved-biomarker',
      title: 'ONCORYVA_Approved_Image_Biomarker_Pathway_Science_Visual.png',
      type: 'Brand Standard',
      keyFinding: 'Biomarker pathway visual featuring DNA, receptor signaling, and molecular network structures.',
      selected: true,
      filePath: '/data/oncoryva/Approved Images/ONCORYVA_Approved_Image_Biomarker_Pathway_Science_Visual.png',
      pageCount: 1,
    },
    {
      id: 'oncoryva-approved-global-hcp',
      title: 'ONCORYVA_Approved_Image_Global_HCP_Scientific_Communication_Visual.png',
      type: 'Brand Standard',
      keyFinding: 'Global HCP communication visual with world-map connectivity and oncology science motifs.',
      selected: true,
      filePath: '/data/oncoryva/Approved Images/ONCORYVA_Approved_Image_Global_HCP_Scientific_Communication_Visual.png',
      pageCount: 1,
    },
    {
      id: 'oncoryva-approved-patient-advocacy',
      title: 'ONCORYVA_Approved_Image_Patient_Advocacy_Education_Visual.png',
      type: 'Brand Standard',
      keyFinding: 'Patient advocacy education visual using ribbon-inspired forms and soft oncology science textures.',
      selected: true,
      filePath: '/data/oncoryva/Approved Images/ONCORYVA_Approved_Image_Patient_Advocacy_Education_Visual.png',
      pageCount: 1,
    },
    {
      id: 'oncoryva-approved-precision',
      title: 'ONCORYVA_Approved_Image_Precision_Oncology_Research_Visual.png',
      type: 'Brand Standard',
      keyFinding: 'Precision oncology research visual showing genomic streams, cellular contours, and data-inspired depth.',
      selected: true,
      filePath: '/data/oncoryva/Approved Images/ONCORYVA_Approved_Image_Precision_Oncology_Research_Visual.png',
      pageCount: 1,
    },
  ],
  brief: {
    campaignName: 'Oncoryva Launch Campaign — HR+/HER2− mBC',
    brand: 'Oncoryva',
    therapeuticArea: 'Oncology',
    markets: ['Global'],
    primaryAudience: ['Oncology specialists'],
    keyMessages: [
      'Oncoryva offers a unique treatment pathway for patients with metastatic breast cancer.',
      'Understanding patient selection criteria is crucial for effective treatment with Oncoryva.',
      'Safety guidelines must be adhered to for optimal patient outcomes when using Oncoryva.',
    ],
    deliverables: ['Patient Leaflet'],
    mandatoryInclusions: [
      'Review of hypersensitivity history.',
      'Baseline clinical assessment.',
      'Concomitant medication review.',
      'Complete blood count monitoring.',
      'Liver function test monitoring.',
      'Pregnancy status assessment when applicable.',
      'Infection screening and symptom review.',
      'Monitoring for administration-related reactions.',
      'Evaluation of concomitant myelosuppressive or hepatotoxic therapies.',
      'Documentation of adverse events and management actions.',
      'Treatment interruption or discontinuation assessment when clinically required.',
    ],
  },
  generatedAssets: [
    {
      id: 'leaflet',
      title: 'Patient Leaflet - Treatment Guide',
      persona: 'Patient-Friendly',
      language: 'EN (US)',
      status: 'Passed',
      content: `Oncoryva® is a treatment designed for adults with HR+/HER2- metastatic breast cancer who have already tried at least one other treatment. This medication aims to help improve your health and manage symptoms effectively. 

In a study of patients treated with Oncoryva®, the median age was 62 years. Most of these patients had already received at least two prior systemic treatments for their cancer. Many patients reported moderate symptom burden, with fatigue and pain being the most common issues they faced. 

Oncoryva® offers a clinically validated treatment pathway for patients with HR HER2− metastatic breast cancer. In the treated population, 61.9% had visceral disease, which means the cancer had spread to vital organs. This highlights the importance of effective treatment options for those facing advanced stages of the disease. 

Patient-reported outcomes indicate significant improvements in symptom burden for patients treated with Oncoryva®. The mean baseline global health status was 61.4, showing that patients had a moderate level of health before starting treatment. After treatment, many patients experienced better management of their symptoms, which is crucial for improving their quality of life. 

Safety is a top priority when using Oncoryva®. Healthcare providers will monitor you closely for any potential side effects. This includes checking for hypersensitivity reactions, liver function, and complete blood counts during treatment. It’s important to communicate any new symptoms or concerns with your healthcare team. 

Before starting Oncoryva®, your healthcare provider will review your medical history and any other medications you are taking. They will also monitor you for signs of infection, especially if you have a weakened immune system due to your cancer or previous treatments.  

If you are pregnant or planning to become pregnant, it’s essential to discuss this with your healthcare provider, as Oncoryva® may cause harm to a developing fetus. Effective contraception is recommended during treatment. 

In summary, Oncoryva® is a promising option for managing HR+/HER2- metastatic breast cancer, with a focus on improving patient outcomes and safety. Always consult with your healthcare provider for personalized advice and treatment plans. 

BOXED WARNING: 

Risk: Thrombotic microangiopathy (TMA) and thromboembolic events when used with aPCC ≥100 U/kg/24h 

Trigger / Setting: Concomitant aPCC dosing for breakthrough bleed management 

Action for HCP: Discontinue aPCC and assess for TMA / thromboembolism 

Monitoring: Signs/symptoms of TMA, thrombosis, or DIC 

DATA REFERENCES: 

Median Age: 62 years 

Visceral Disease: 61.9% 

Prior Systemic Regimens: 2 or more 

Mean Global Health Status: 61.4 

Fatigue and Pain: Most prominent symptoms`,
    },
  ],
  mlrAssets: [
    {
      id: 'leaflet',
      name: 'Patient Leaflet',
      tier: 'Tier 1',
      status: 'Passed',
      content: `Oncoryva® is a treatment designed for adults with HR+/HER2- metastatic breast cancer who have already tried at least one other treatment. This medication aims to help improve your health and manage symptoms effectively.

In a study of patients treated with Oncoryva®, the median age was 62 years. Most of these patients had already received at least two prior systemic treatments for their cancer. Many patients reported moderate symptom burden, with fatigue and pain being the most common issues they faced.

Oncoryva® offers a clinically validated treatment pathway for patients with HR HER2− metastatic breast cancer. In the treated population, 61.9% had visceral disease, which means the cancer had spread to vital organs. This highlights the importance of effective treatment options for those facing advanced stages of the disease.

Patient-reported outcomes indicate significant improvements in symptom burden for patients treated with Oncoryva®. The mean baseline global health status was 61.4, showing that patients had a moderate level of health before starting treatment. After treatment, many patients experienced better management of their symptoms, which is crucial for improving their quality of life.

Safety is a top priority when using Oncoryva®. Healthcare providers will monitor you closely for any potential side effects. This includes checking for hypersensitivity reactions, liver function, and complete blood counts during treatment. It's important to communicate any new symptoms or concerns with your healthcare team.

Before starting Oncoryva®, your healthcare provider will review your medical history and any other medications you are taking. They will also monitor you for signs of infection, especially if you have a weakened immune system due to your cancer or previous treatments.

If you are pregnant or planning to become pregnant, it's essential to discuss this with your healthcare provider, as Oncoryva® may cause harm to a developing fetus. Effective contraception is recommended during treatment.

In summary, Oncoryva® is a promising option for managing HR+/HER2- metastatic breast cancer, with a focus on improving patient outcomes and safety. Always consult with your healthcare provider for personalized advice and treatment plans.

BOXED WARNING:
Risk: Thrombotic microangiopathy (TMA) and thromboembolic events when used with aPCC ≥100 U/kg/24h
Trigger / Setting: Concomitant aPCC dosing for breakthrough bleed management
Action for HCP: Discontinue aPCC and assess for TMA / thromboembolism
Monitoring: Signs/symptoms of TMA, thrombosis, or DIC

DATA REFERENCES:
Median Age: 62 years
Visceral Disease: 61.9%
Prior Systemic Regimens: 2 or more
Mean Global Health Status: 61.4
Fatigue and Pain: Most prominent symptoms`,
      fairBalanceScore: 92,
      isiComplete: true,
      pufferyItems: [],
      substantiationCount: '5/5',
      flags: [
        { phrase: 'median age was 62 years', type: 'substantiated', source: 'ONCORYVA Efficacy and Safety, Baseline Characteristics' },
        { phrase: '61.9% had visceral disease', type: 'substantiated', source: 'ONCORYVA Efficacy and Safety, Patient Population' },
        { phrase: 'mean baseline global health status was 61.4', type: 'substantiated', source: 'ONCORYVA Patient-Reported Outcomes' },
        { phrase: 'clinically validated treatment pathway', type: 'fair-balance', suggestion: 'Safety information prominently featured - compliant' },
      ],
      aiInsights: [
        'Strong Regulatory Alignment: The asset includes a clear BOXED WARNING, ensuring compliance with regulatory requirements.',
        'Accurate Medical Claims: All medical claims regarding patient demographics and outcomes are consistent with approved claims.',
        'Effective Communication Tone: The language used is appropriate for the target audience of oncologists and breast cancer specialists.',
      ],
      cohesion: {
        messageConsistency: 100,
        toneAlignment: 96,
        visualCohesion: 99,
        claimHarmony: 9,
      },
    },
  ],
  distributionChannels: [
    { id: 'email', name: 'Approved Email', asset: 'HCP Email', audience: 'Oncologists, Breast Cancer Specialists', deliveryDate: '2026-07-09', enabled: true, icon: 'Mail' },
    { id: 'patient', name: 'Patient Channel', asset: 'Patient Leaflet + PLS', audience: 'Patients, Caregivers', deliveryDate: '2026-07-12', enabled: true, icon: 'Users' },
    { id: 'rte', name: 'Rep-Triggered Email', asset: 'Follow-up Email', audience: 'Post-Visit HCPs', deliveryDate: '2026-07-18', enabled: false, icon: 'Share2' },
  ],
  marketMetrics: [
    { market: 'US', openRate: '33%', ctr: '12.0%', ddaTime: '—', posterDownloads: '—', openRateStatus: 'above', ctrStatus: 'above' },
    { market: 'Germany', openRate: '28%', ctr: '9.5%', ddaTime: '—', posterDownloads: '—', openRateStatus: 'near', ctrStatus: 'near' },
    { market: 'Global', openRate: '30%', ctr: '10.7%', ddaTime: '—', posterDownloads: '—', openRateStatus: 'above', ctrStatus: 'near' },
  ],
  personaEngagement: [
    { persona: 'Conservative', type: 'Factual content', score: 88, color: '#1E1B3D' },
    { persona: 'Empathetic', type: 'Patient narratives', score: 85, color: '#00A896' },
    { persona: 'Innovator', type: 'Interactive content', score: 80, color: '#7C3AED' },
    { persona: 'Leader', type: 'Executive summaries', score: 83, color: '#F59E0B' },
  ],
  optimizationRecs: [
    {
      finding: 'HCP email open rates trending above benchmark',
      action: 'Sustain momentum with a follow-up email referencing the objective response data',
      impact: 'Expected +5% repeat engagement',
    },
    {
      finding: 'Patient leaflet shares 3× higher than HCP materials',
      action: 'Create patient-focused social card series for advocacy group distribution',
      impact: 'Estimated 350+ additional patient touchpoints per month',
    },
  ],
  plsScores: [
    { dimension: 'Readability', score: 89 },
    { dimension: 'Coverage', score: 92 },
    { dimension: 'PLS Alignment', score: 91 },
    { dimension: 'Structure', score: 95 },
    { dimension: 'Audience Fit', score: 88 },
  ],
  plsPreview: `Oncoryva is a medicine that helps slow the growth of a type of breast cancer called HR+/HER2− metastatic breast cancer. It is taken by mouth as a tablet, once a day, together with another hormone therapy medicine. Oncoryva works by blocking proteins called CDK4 and CDK6 that help cancer cells grow and divide. In clinical studies, people taking Oncoryva had their cancer controlled for longer periods. Like all medicines, Oncoryva has possible side effects — the most important to know are a lower white blood cell count (neutropenia) and diarrhea. You will need regular blood tests during treatment. Always tell your doctor and pharmacist about all the medicines you are taking.`,
};

// ─── Storyline ───────────────────────────────────────────────────────────────

const storyline: StorylineStep[] = [
  {
    id: 'step-0',
    stage: 'setup',
    userMessage:
      'Create an omnichannel launch campaign for Oncoryva targeting oncology specialists globally for metastatic breast cancer treatment. Deliverables: Patient Leaflet.',
    agentResponse: {
      text: 'I have captured the details and am setting up your campaign now.',
      campaignSummary: {
        brand: 'Oncoryva',
        ta: 'Oncology',
        markets: ['Global'],
        audience: ['Oncology Specialists'],
        campaignId: 'DAWN-ONC-2026-0104',
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
      text: "The evidence curation for Oncoryva in the context of HR HER2− metastatic breast cancer has been completed, focusing on key documents that inform its therapeutic landscape.\n\n• ONCORYVA_Benefit-Risk Assessment and Evidence-Generation Roadmap for Oncoryva in HR HER2− Metastatic Breast Cancer.pdf\n• ONCORYVA_Clinical Rationale and Treatment-Pathway Considerations for Oncoryva in HR HER2− Metastatic Breast Cancer.pdf\n• ONCORYVA_Oncology Development Considerations for Oncoryva in HR HER2 - Metastatic Breast Cancer.pdf\n• ONCORYVA_Efficacy and Safety of Oncoryva in Patients With HR-HER2 - Metastatic Breast Cancer.pdf\n\nThese documents represent a curated subset of the total evidence collected, which encompasses a broader range of materials.",
      documentCards: data.clinicalDocuments,
    },
    autoAdvance: true,
    thinkingMessage: `Retrieving clinical evidence . . . . .
• Reading requirements — brand Oncoryva, plus the user's campaign details.
• Decomposing the search into focused angles: clinical evidence, safety profile, MLR rules, and market context.
• Querying the asset library for every approved document for this brand.
• Re-ranking passages in the vector store to surface the most relevant clinical evidence.

Locating approved templates . . . . . .
• Looking up channel templates for: Congress Poster, Email, Patient Leaflet, Digital Detail Aid.
• Pulling the template family for Oncoryva so the campaign can be rendered into compliant layouts.

Outcome — templates ready:
• Approved templates located for 4 channels: Congress Poster, Email, Patient Leaflet, Digital Detail Aid. 
• Most-used template per channel marked as recommended.

Outcome — knowledge base assembled:
• 7 clinical, 1 MLR, 1 safety, 1 market-insight documents.
• Scored 7 clinical documents; kept 10 top-ranked passages for the brief.
• Indexed 13 compliance, 12 safety, and 74 market-insight chunks for downstream citation. 
• Captured 5 pre-approved images and 1 brand logos for the visual layer. 
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
      text: "I acknowledge your choice of AUTO mode for the brief, and I am now drafting it accordingly.\n",  
    },
    triggersModal: 'briefBuilder',
    autoAdvanceAfterModal: true,
  },
  {
    id: 'step-3d',
    stage: 'brief',
    userMessage: '',
    agentResponse: {
      text: 'The campaign focuses on promoting Oncoryva as a unique treatment pathway for patients with metastatic breast cancer, targeting oncology specialists globally. Key messages emphasize the importance of patient selection criteria and adherence to safety guidelines for optimal outcomes. The primary deliverable is an informative email that will highlight these aspects and include essential monitoring and assessment requirements.',
      documentCards: data.complianceAssets,
    },
    autoAdvance: true,
    thinkingMessage: `Drafting the strategic brief . . . . . . .
• Captured filters — brand Oncoryva, therapeutic area Oncology, audience oncology specialists, markets global.
• Loaded clinical, safety, and market context from the extracted knowledge base for grounding.
• Anchoring the brief on the stated objective: launch new treatment for metastatic breast cancer, with deliverables limited to the requested deliverables.
• Drafting the core strategic narrative — what the campaign must say, to whom, and why now.

Brief drafted. Opening line: "The campaign strategy for launching Oncoryva, a new treatment for metastatic breast cancer, will focus on delivering a highly informative and clinically detailed email to oncology specialists globally…"

Building the execution plan . . . . . . .
• Mapping the brief onto each deliverable channel: Patient Leaflet.
• Formulating a step-by-step execution plan for 1 channels.
• Distilling the campaign's core key messages and mandatory regulatory inclusions for every asset.

Plan locked . . . . .
• 1 execution steps across 1 channels.
• 3 key message — leading with: "Oncoryva offers a unique treatment pathway for patients with metastatic breast cancer.".
• 4 mandatory inclusion(s) — e.g. "Review of hypersensitivity history before treatment.".`,
  },
  {
    id: 'step-4',
    stage: 'templateSelection',
    userMessage: '',
    agentResponse: {
      text: 'I will now pause for you to confirm the template selection before I proceed with producing the asset. Please let me know your choices when you are ready.',
      templateCards: [
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
        { id: 'email', title: 'HCP Email', persona: 'Empathetic Specialist', language: 'EN (US)' },
        { id: 'leaflet', title: 'Patient Leaflet', persona: 'Patient-Friendly', language: 'EN (US)' },
      ],
      imageVariations: [
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
          description: 'Patient-friendly educational leaflet with clear safety info',
          type: 'Print',
        },
      ],
      actionButton: { label: 'Review & Edit Content + Visuals →', modal: 'contentEditor' },
    },
    triggersModal: 'contentEditor',
    autoAdvanceAfterModal: true,
    thinkingMessage: `
Orchestrator thinking . . . . . .
Orchestrator is reviewing the current source state to determine which specialist agent should be invoked next based on the task requirements and available context.

• Working set — 10 approved source chunks available; target channels: Patient Leaflet.
• Source inventory — 10 chunks, previewing the first few:
  - ONCORYVA_Clinical Rationale and Treatment-Pathway Considerations for Oncoryva in HR HER2− Metastatic Breast Cancer.pdf · References · p.6 — "[Asset: ONCORYVA_Clinical Rationale and Treatment-Pathway Considerations for Oncoryva in HR HER2− Metastatic Breast Cancer.pdf] [Descriptio…"
  - ONCORYVA_Endocrine-Resistance Patterns and Biomarker-Stratified Outcomes With Oncoryva in HR HER2− Metastatic Breast Cancer.pdf · Safety Assessment · p.4 — "[Asset: ONCORYVA_Endocrine-Resistance Patterns and Biomarker-Stratified Outcomes With Oncoryva in HR HER2− Metastatic Breast Cancer.pdf] [D…"
  - ONCORYVA_Patient-Reported Outcomes, Treatment Persistence, and Symptom Burden With Oncoryva in HR HER2− Metastatic Breast Cancer.pdf · References · p.9 — "[Asset: ONCORYVA_Patient-Reported Outcomes, Treatment Persistence, and Symptom Burden With Oncoryva in HR HER2− Metastatic Breast Cancer.pd…"
  - ONCORYVA_Efficacy and Safety of Oncoryva in Patients With HR-HER2 - Metastatic Breast Cancer.pdf · Safety · p.6 — "[Asset: ONCORYVA_Efficacy and Safety of Oncoryva in Patients With HR-HER2 - Metastatic Breast Cancer.pdf] [Description: Research-style manu…"
  - ONCORYVA- Clinical Review Document.pdf · 7. Safety Overview · p.7 — "[Asset: ONCORYVA- Clinical Review Document.pdf] [Description: Clinical review document summarizing Oncoryva’s therapeutic context, scientif…"
  …plus 5 more chunks queued for the Claim Agent.
• No claims captured yet — handing the work to the Claim Agent so it can mine the source material first.

Claim Agent thinking . . . . . .
Claim Agent is now active. Scanning approved source material to extract and structure a library of citable, single-sentence facts that will serve as the foundation for content generation.

• Inbound source set has 10 chunks to scan for claims.
• Reading every approved chunk and pulling out distinct, verifiable factual claims about the drug.
• Each claim must be one self-contained sentence so downstream agents can cite it without paraphrasing.
• Mined 88 verifiable claim(s) from 10 source chunk(s).
• Top claim: "The median duration of treatment exposure was 8.7 months."

Content Agent thinking . . . . . .
Content Agent is now active. Binding the verified claim library to the selected template and composing the full asset copy, ensuring every statement is grounded in an approved claim.

• Will draft copy for Patient Leaflet.
• Assembling a knowledge record that binds the source chunks, the extracted claims, and the chosen template into a single structured payload.
• Bound 88 claims and 15 source passages into a knowledge record covering 1 channels: Patient Leaflet.
• Captured template structure (sections, placeholders) so the draft will fit the chosen layout.
• Drafting the actual asset copy from the knowledge record — every line must trace back to an approved claim.

Drafted copy for 1 channels:

• Patient Leaflet — citing 5 approved claim(s).
Opening line — "Oncoryva® offers a unique treatment pathway for patients with HR+/HER2- metastatic breast cancer."

Designer Agent thinking . . . . . .
Designer Agent is now active. Taking the drafted copy and rendering it into the chosen template layout, placing approved imagery and finalizing the visual asset for output.

• Design inputs — template family:.
• Pouring the drafted copy into the selected template structure to produce a rendered HTML draft.
• Rendered 1 HTML draft(s):
  - Patient Leaflet — laid into "Guided Journey — Single-Page A4".
• Resolving image placeholders against the brand's pre-approved asset library and embedding them into the final HTML.
• Resolved pre-approved images from the brand asset library.
• Embedded imagery into 1 final assets:
  - Patient Leaflet — 1 images embedded.
Design pipeline complete — asset is ready for the compliance review.`,
  },
  {
    id: 'step-6',
    stage: 'mlr',
    userMessage: '',
    agentResponse: {
      text: 'Internal MLR screen completed. It identifies flagged claims, explains tier risk, and shows what needs revision. You will receive a notification once the assets are approved.',
      mlrTable: [
        { asset: 'Patient Leaflet', tier: 'Tier 1', aiPreScreen: '0 Flags', status: 'Passed' },
      ],
      actionButton: { label: 'Open MLR Pre-Screen →', modal: 'mlrChecker' },
      notification: {
        type: 'mlr-approved',
        title: 'MLR Review Approved',
        message: 'All campaign assets have been reviewed and approved.',
        timestamp: '2026-07-02 13:40:00',
        details: {
          approvedAssets: [
            { asset: 'Patient Leaflet', tier: 'Tier 1', aiPreScreen: '0 Flags', status: 'Passed' },
          ],
          approver: 'Sarah Mitchell',
          approvalDate: '2026-07-02',
          comments: 'All claims substantiated. Both assets ready for distribution.',
        },
      },
    },
    triggersModal: 'mlrChecker',
    autoAdvanceAfterModal: true,
    thinkingMessage: `Compliance review . . . . . .

• Loaded the draft asset alongside 88 approved claims.
• MEDICAL check — comparing every numeric or efficacy statement against approved claims.
• REGULATORY check — confirming the asset carries the required Boxed Warnings.
• LEGAL check — verifying trademark symbols and brand presentation.

Verdict — clean.

• No compliance issues detected across medical, legal, or regulatory domains.
• Risk tier: TIER_1 — clean, ready for sign-off.

MLR review complete: fully_approved.`,
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
      text: 'Campaign performance dashboard ready. Here is the current performance summary across the email and patient channels.',
      metrics: [
        { label: 'Email Open Rate', value: '33%', trend: '↑ 7%', trendUp: true, benchmark: 'vs. 26% benchmark' },
        { label: 'Email CTR', value: '12.0%', trend: '↑ 3.7%', trendUp: true, benchmark: 'vs. 8.3% benchmark' },
        { label: 'Leaflet Downloads', value: '1,042', trend: '+210 MoM', trendUp: true, benchmark: 'vs. 700 target' },
        { label: 'Rx Switches', value: '198', trend: '+41 MoM', trendUp: true, benchmark: 'vs. 150 target' },
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

export const oncoryvaCampaign: Campaign = {
  id: 'oncoryva',
  chipLabel: 'Oncoryva metastatic breast cancer launch',
  brand: 'Oncoryva',
  storyline,
  data,
};
