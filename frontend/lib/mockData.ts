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
  ContentTemplate,
  TemplateRecommendation,
  MedicalPrompt,
} from './types';

// ─── Clinical Document Cards ─────────────────────────────────────────────────────

export const CLINICAL_DOCUMENTS: DocumentCard[] = [
  {
    id: 'brexiva-mbc-review',
    title: 'BREXIVA_Brexiva in Metastatic Breast Cancer- A Clinical Review of Treatment Rationale, Patient Selection, and Evidence Considerations.pdf',
    type: 'Journal',
    relevance: 72,
    keyFinding: 'Clinical review paper discussing Brexiva treatment rationale, patient selection factors, and evidence considerations in metastatic breast cancer.',
    filePath: '/data/brexiva/Journals/BREXIVA_Brexiva in Metastatic Breast Cancer- A Clinical Review of Treatment Rationale, Patient Selection, and Evidence Considerations.pdf',
    pageCount: 82,
  },
  {
    id: 'patient-reported-outcomes',
    title: 'BREXIVA_Patient-Reported Outcomes.pdf',
    type: 'Research Paper',
    relevance: 72,
    keyFinding: 'Observational research manuscript exploring patient-reported outcomes, treatment persistence, and global oncology care considerations.',
    filePath: '/data/brexiva/Research Papers/BREXIVA_Patient-Reported Outcomes.pdf',
    pageCount: 37,
  },
  {
    id: 'biomarker-patterns',
    title: 'BREXIVA_Biomarker Patterns and Endocrine-Resistance Features Associated with Brexiva-Based Therapy in HR+HER2- Metastatic Breast Cancer.pdf',
    type: 'Research Paper',
    relevance: 70,
    keyFinding: 'Biomarker-focused manuscript examining endocrine-resistance features and molecular patterns associated with Brexiva-based therapy.',
    filePath: '/data/brexiva/Research Papers/BREXIVA_Biomarker Patterns and Endocrine-Resistance Features Associated with Brexiva-Based Therapy in HR+HER2- Metastatic Breast Cancer.pdf',
    pageCount: 54,
  },
  {
    id: 'phase-ii-study',
    title: 'BREXIVA_A Simulated Multicenter Phase II Study Evaluating Efficacy, Safety, and Clinical Applicability in a Global Oncology Population.pdf',
    type: 'Research Paper',
    relevance: 69,
    keyFinding: 'Simulated Phase II manuscript evaluating Brexiva’s clinical applicability, safety considerations, and oncology population relevance.',
    filePath: '/data/brexiva/Research Papers/BREXIVA_A Simulated Multicenter Phase II Study Evaluating Efficacy, Safety, and Clinical Applicability in a Global Oncology Population.pdf',
    pageCount: 158,
  },
  {
    id: 'treatment-sequencing',
    title: 'BREXIVA_Treatment Sequencing and Clinical Decision-Making for Brexiva-Based Therapy.pdf',
    type: 'Journal',
    relevance: 67,
    keyFinding: 'Research-style paper exploring treatment sequencing, clinical decision-making, and specialist considerations for Brexiva-based therapy.',
    filePath: '/data/brexiva/Journals/BREXIVA_Treatment Sequencing and Clinical Decision-Making for Brexiva-Based Therapy.pdf',
    pageCount: 68,
  },
  {
    id: 'safety-monitoring',
    title: 'BREXIVA_Safety Management and Practical Monitoring Considerations for Brexiva-Based Therapy.pdf',
    type: 'Journal',
    relevance: 67,
    keyFinding: 'Safety-focused paper covering monitoring considerations, risk-management themes, and practical guidance for Brexiva-based therapy discussions.',
    filePath: '/data/brexiva/Journals/BREXIVA_Safety Management and Practical Monitoring Considerations for Brexiva-Based Therapy.pdf',
    pageCount: 48,
  },
  {
    id: 'safety-guideline',
    title: 'BREXIVA_Safety Guideline Document',
    type: 'Safety Guideline',
    relevance: 67,
    keyFinding: 'Safety guideline for oncology brand Brexiva, covering contraindications, hematologic toxicity, hepatic monitoring, infections, pregnancy risk, and counseling. ',
    filePath: '/data/brexiva/Safety Guideline/BREXIVA_Safety Guideline Document.pdf',
    pageCount: 48,
  }
];

// ─── Compliance & MLR Asset Cards (Content Finder exclusions) ────────────────

export const COMPLIANCE_ASSETS: DocumentCard[] = [
  // ── Compliance Reference Set ──────────────────────────────────────────────
  {
    id: 'mlr-compliance',
    title: 'BREXIVA_Mlr Compliance Report.pdf',
    type: 'Regulatory',
    keyFinding: 'MLR compliance report defining promotional review considerations, risk controls, and medically appropriate communication boundaries.',
    selected: true,
    filePath: '/data/brexiva/MLR/BREXIVA_Mlr Compliance Report.pdf',
    pageCount: 32,
  },
  {
    id: 'safety-guideline',
    title: 'BREXIVA_Safety Guideline Document',
    type: 'Safety Guideline',
    keyFinding: 'Safety guideline for oncology brand Brexiva, covering contraindications, hematologic toxicity, hepatic monitoring, infections, pregnancy risk, and counseling.',
    selected: true,
    filePath: '/data/brexiva/Safety Guideline/BREXIVA_Safety Guideline Document.pdf',
    pageCount: 48,
  },
  {
    id: 'market-insight',
    title: 'BREXIVA_Market Insight Reference Report.pdf',
    type: 'Publication',
    keyFinding: 'Market insight reference report outlining global oncology landscape, audience needs, and strategic communication opportunities.',
    selected: true,
    filePath: '/data/brexiva/Market Insight Report/BREXIVA_Market Insight Reference Report.pdf',
    pageCount: 45,
  },
  // ── Approved Brand Assets ─────────────────────────────────────────────────
  {
    id: 'brexiva-logo',
    title: 'BREXIVA_LOGO.png',
    type: 'Brand Standard',
    keyFinding: 'Official Brexiva brand logo.',
    selected: true,
    filePath: '/data/brexiva/BREXIVA_LOGO.png',
    pageCount: 1,
  },
  {
    id: 'approved-abstract-oncology',
    title: 'BREXIVA_Approved_Image_Abstract_Oncology_Cellular_Visual.png',
    type: 'Brand Standard',
    keyFinding: 'Abstract cellular oncology visual with tumor-inspired structures, molecular elements, and Brexiva-style magenta-purple tones.',
    selected: true,
    filePath: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Abstract_Oncology_Cellular_Visual.png',
    pageCount: 1,
  },
  {
    id: 'approved-patient-advocacy-ribbon',
    title: 'BREXIVA_Approved_Image_Patient_Advocacy_Ribbon_Visual.png',
    type: 'Brand Standard',
    keyFinding: 'Premium advocacy-inspired ribbon visual with soft gradients and breast cancer communication styling.',
    selected: true,
    filePath: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Patient_Advocacy_Ribbon_Visual.png',
    pageCount: 1,
  },
  {
    id: 'approved-precision-oncology-dna',
    title: 'BREXIVA_Approved_Image_Precision_Oncology_DNA_Visual.png',
    type: 'Brand Standard',
    keyFinding: 'Precision oncology visual featuring DNA strands, biomarker nodes, and molecular research aesthetics.',
    selected: true,
    filePath: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Precision_Oncology_DNA_Visual.png',
    pageCount: 1,
  },
  {
    id: 'approved-breast-cancer-pathway',
    title: 'BREXIVA_Approved_Image_Breast_Cancer_Pathway_Network.png',
    type: 'Brand Standard',
    keyFinding: 'Scientific pathway visual with molecular signaling networks and clinical oncology design language.',
    selected: true,
    filePath: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Breast_Cancer_Pathway_Network.png',
    pageCount: 1,
  },
  {
    id: 'approved-global-oncology-network',
    title: 'BREXIVA_Approved_Image_Global_Oncology_Network.png',
    type: 'Brand Standard',
    keyFinding: 'Global oncology communication visual with world map grid and scientific molecular accents.',
    selected: true,
    filePath: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Global_Oncology_Network.png',
    pageCount: 1,
  },
];

// ─── Pre-filled Brief ─────────────────────────────────────────────────────────

export const MOCK_BRIEF: BriefData = {
  campaignName: 'Brexiva Omnichannel Campaign — HR+/HER2− mBC',
  brand: 'Brexiva',
  therapeuticArea: 'Oncology',
  markets: ['Global'],
  primaryAudience: ['Oncology specialists'],
  keyMessages: [
    'Understanding patient-reported outcomes is crucial for improving treatment strategies.',
    'Brexiva has demonstrated significant treatment persistence in patients with metastatic breast cancer.',
    'Effective communication of treatment options can enhance clinical decision-making.',
    'Patient experiences should be at the forefront of oncology care.',
  ],
  deliverables: ['Email', 'Patient Leaflet', 'Digital Detail Aid', 'Congress Poster'],
  mandatoryInclusions: [
    'Brenova may be associated with hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.',
    'Complete blood count assessment should be considered before treatment initiation and periodically during therapy.',
    'Patients with significant baseline cytopenias or prior intensive anticancer therapy should be monitored closely.',
  ],
};

// ─── Generated Assets ─────────────────────────────────────────────────────────

export const GENERATED_ASSETS: Asset[] = [
  {
    id: 'poster',
    title: 'Congress Poster - PFS Efficacy Data',
    persona: 'Clinical Researcher',
    language: 'EN (US)',
    status: 'Pending',
    content: `Poster Title: Patient-Reported Outcomes and Treatment Persistence with Brenova-Based Therapy Under the Brexiva Brand in HR+/HER2- Metastatic Breast Cancer: A Global Observational Research Manuscript\n
Background: The treatment landscape for HR+/HER2- metastatic breast cancer continues to evolve, necessitating a comprehensive understanding of therapeutic options and patient management strategies. Brenova, an investigational therapeutic concept associated with the Brexiva brand, is designed to address the complexities of this disease.\n
Objectives: This study aims to evaluate patient-reported outcomes and treatment persistence among adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment.\n
Methods: The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments. Patients with rapidly progressive disease requiring immediate cytotoxic chemotherapy were not included in the primary simulated cohort. Patients with stable treated central nervous system disease were permitted if symptoms were controlled and functional assessment could be completed reliably.\n
Results: In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, while 27.6% were in the fourth or later metastatic setting. Additionally, 52.8% of patients had endocrine-sensitive disease, and 47.2% had endocrine-resistant disease. The median age of patients in the cohort is 58 years, with a range of 31 to 81 years. Notably, 99.0% of patients are female, and 31.8% are aged 65 years or older. Safety considerations, including monitoring for hematologic toxicity, are vital in treatment planning. Complete blood count assessment should be considered before treatment initiation and periodically during therapy.\n
Key Result Highlight: Understanding the latest evidence and treatment rationale is crucial for effective patient management. Patient selection criteria are essential for optimizing treatment outcomes with Brexiva.\n
BOXED WARNING:
•	Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
•	Trigger / Setting: Before and during Brenova treatment.
•	Action for HCP: Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
•	Monitoring: Signs/symptoms of hematologic toxicity or complications such as febrile neutropenia or bleeding risk.\n
DATA REFERENCES:
•	Indication: HR+/HER2- Metastatic Breast Cancer.
•	Patient Population: Adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment.
•	Median Age: 58 years.
•	Percentage of Female Patients: 99.0%.
•	Percentage of Patients in Third-Line Metastatic Setting: 34.3%.
•	Percentage of Patients in Fourth or Later Metastatic Setting: 27.6%.
•	Percentage of Patients with Endocrine-Sensitive Disease: 52.8%.
•	Percentage of Patients with Endocrine-Resistant Disease: 47.2%.
•	Percentage of Patients Aged 65 Years or Older: 31.8%.
`,
  },
  {
    id: 'email',
    title: 'Email',
    persona: 'Oncology Specialist',
    language: 'EN (US)',
    status: 'Pending',
    content: `Brexiva: A Novel Treatment for HR+/HER2- Metastatic Breast Cancer\n
Brexiva offers a novel treatment option for HR+/HER2- metastatic breast cancer. Understanding the scientific rationale behind Brexiva is crucial for optimizing patient care.\n
The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments. In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, while 27.6% were in the fourth or later metastatic setting. Additionally, 52.8% of patients had endocrine-sensitive disease, and 47.2% had endocrine-resistant disease.\n
Patient selection criteria are essential for effective treatment outcomes. The median age of patients in the Brenova-Based Therapy Cohort is 58 years, with a range of 31 to 81 years. Notably, 99.0% of patients are female, and 31.8% are aged 65 years or older. The cohort also includes patients with various ECOG performance statuses, with 44.1% having an ECOG performance status of 0 and 46.2% having a status of 1. Recent advancements in treatment options should be considered in clinical practice, particularly in managing patients with metastatic breast cancer.\n
BOXED WARNING:
•	Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
•	Trigger / Setting: Before and during Brenova treatment.
•	Action for HCP: Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
•	Monitoring: Signs/symptoms of hematologic toxicity.\n
DATA REFERENCES:
•	Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
•	Trigger / Setting: Before and during Brenova treatment.
•	Action for HCP: Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
`,
  },
  {
    id: 'leaflet',
    title: 'Patient Leaflet',
    persona: 'Patient-Friendly',
    language: 'EN (US)',
    status: 'Pending',
    content: `Brexiva®: Your Partner in Managing HR+/HER2- Metastatic Breast Cancer\n
Welcome to this patient information leaflet about Brexiva®. Here, you will find important information about your treatment, including what Brexiva® is, how it works, and what to expect during your therapy. Our goal is to help you understand your treatment options and support you on your journey.\n
Brexiva® is indicated for the treatment of HR+/HER2- metastatic breast cancer. This means it is specifically designed to help manage a type of breast cancer that is hormone receptor-positive and does not have excess HER2 protein. Understanding patient selection criteria is crucial for effective treatment management, as it ensures that the right patients receive the right therapy.\n
In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, and 27.6% were in the fourth or later metastatic setting. This shows that Brexiva® can be an option for patients who have already tried other treatments. Additionally, 52.8% of patients had endocrine-sensitive disease, while 47.2% had endocrine-resistant disease, highlighting the diverse patient population that Brexiva® can support.\n
As you begin your treatment with Brexiva®, it's important to follow safety guidelines. Monitoring for hematologic toxicity is essential, as Brenova may be associated with blood count abnormalities. Complete blood count assessment should be considered before treatment initiation and periodically during therapy. This helps ensure your safety and the effectiveness of your treatment.\n
Oncology specialists play a vital role in educating patients about their treatment options. They will discuss the goals of therapy, expected monitoring, possible adverse events, and reasons for treatment modification. It's important to communicate openly with your healthcare team about any concerns or questions you may have.\n
BOXED WARNING:
•	Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
•	Trigger / Setting: Before and during Brenova treatment.
•	Action for HCP: Complete blood count assessment should be considered.
•	Monitoring: Watch for signs of hematologic toxicity.\n
DATA REFERENCES:
•	Annual Bleeding Rate Reduction: 34.3%.
•	Median Age: 58 years.
•	Patient Population (n): 286.
•	Endocrine-Sensitive Disease: 52.8%.
•	Endocrine-Resistant Disease: 47.2%.
`,
  },
  {
    id: 'dda',
    title: 'Digital Detail Aid',
    persona: 'Innovator HCP',
    language: 'EN (US)',
    status: 'Pending',
    content: `Brexiva®: A New Era in HR+/HER2- Metastatic Breast Cancer Treatment\n
Brexiva® offers a targeted approach for HR+/HER2- metastatic breast cancer patients.\n
Brexiva® is indicated for HR+/HER2- metastatic breast cancer, providing therapeutic benefits in this patient population.\n
Clinical data supports the efficacy of Brexiva® in improving patient-reported outcomes and treatment persistence.\n
In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting.
In the Brenova-Based Therapy Cohort, 27.6% of patients were in the fourth or later metastatic setting.
In the Brenova-Based Therapy Cohort, 52.8% of patients had endocrine-sensitive disease.
In the Brenova-Based Therapy Cohort, 47.2% of patients had endocrine-resistant disease.\n
Monitoring for hematologic toxicity is essential, including regular complete blood count assessments before and during treatment.\n
Patients with significant baseline cytopenias or prior intensive anticancer therapy may require closer monitoring.\n
Hepatic function abnormalities may occur during treatment with Brenova. Liver function tests should be assessed at baseline and monitored periodically during treatment.\n
Patients should understand the goals of therapy, expected monitoring, possible adverse events, and reasons for treatment modification.\n
BOXED WARNING:
•	Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
•	Trigger / Setting: Before and during Brenova® treatment.
•	Action for HCP: Complete blood count assessment before treatment initiation and periodically during therapy.
•	Monitoring: Signs/symptoms of hematologic toxicity or complications such as febrile neutropenia.\n
DATA REFERENCES:
•	Indication: HR+/HER2- metastatic breast cancer.
•	Third-line metastatic setting: 34.3%.
•	Fourth or later metastatic setting: 27.6%.
•	Endocrine-sensitive disease: 52.8%.
•	Endocrine-resistant disease: 47.2%.
`,
  },
];

// ─── MLR Asset Details ────────────────────────────────────────────────────────

export const MLR_ASSETS: MLRAssetDetail[] = [
  {
    id: 'poster',
    name: 'Congress Poster',
    tier: 'Tier 1',
    status: 'Pending',
    content: GENERATED_ASSETS[0].content,
    fairBalanceScore: 92,
    isiComplete: true,
    pufferyItems: [],
    substantiationCount: '42/42',
    flags: [],
    complianceFindings: [],
    aiInsights: [
      'Strong Regulatory Alignment: The asset includes a BOXED WARNING, ensuring compliance with safety regulations.',
      'Clear Medical Claims: All medical claims regarding patient demographics and treatment settings are accurately represented.',
      'Effective Communication Structure: The document maintains a clear and professional tone suitable for the intended audience of oncologists and breast cancer specialists.',
    ],
    cohesion: {
      messageConsistency: 98,
      toneAlignment: 94,
      visualCohesion: 97,
      claimHarmony: 66,
    },
  },
  {
    id: 'dda',
    name: 'Digital Detail Aid',
    tier: 'Tier 2',
    status: 'Pending',
    content: GENERATED_ASSETS[3].content,
    fairBalanceScore: 85,
    isiComplete: true,
    pufferyItems: [],
    substantiationCount: '42/42',
    flags: [],
    complianceFindings: [
      {
        severity: 'MINOR',
        category: 'LEGAL',
        finding:
          'The trademark symbol (®) is missing from the first mention of the brand name Brexiva in the cover slide.',
        suggestion: 'Add the trademark symbol (®) after the first mention of Brexiva.',
        ref: '[Asset Type - Cover Slide] EXACT LINE: Brexiva: A New Era in HR+/HER2- Metastatic Breast Cancer Treatment',
      },
    ],
    aiInsights: [
      'Trademark Fix Needed: Ensure the trademark symbol (®) is included after the first mention of Brexiva in the cover slide.',
      'Strong Safety Information Presence: The asset includes essential safety information, which is well integrated into the content.',
      'Efficacy Data Alignment: All efficacy data presented aligns with the approved claims, maintaining compliance.',
    ],
    cohesion: {
      messageConsistency: 98,
      toneAlignment: 94,
      visualCohesion: 97,
      claimHarmony: 66,
    },
  },
  {
    id: 'email',
    name: 'Email',
    tier: 'Tier 1',
    status: 'Pending',
    content: GENERATED_ASSETS[1].content,
    fairBalanceScore: 85,
    isiComplete: true,
    pufferyItems: [],
    substantiationCount: '42/42',
    flags: [],
    complianceFindings: [],
    aiInsights: [
      'Strong Regulatory Alignment: The asset includes a BOXED WARNING, ensuring compliance with safety regulations.',
      'Efficacy and Safety Balance: Consider enhancing the safety information to improve the fair balance score.',
      'Clear Patient Selection Criteria: The patient selection criteria are well-defined and align with the approved claims.',
    ],
    cohesion: {
      messageConsistency: 98,
      toneAlignment: 94,
      visualCohesion: 97,
      claimHarmony: 66,
    },
  },
  {
    id: 'leaflet',
    name: 'Patient Leaflet',
    tier: 'Tier 2',
    status: 'Pending',
    content: GENERATED_ASSETS[2].content,
    fairBalanceScore: 85,
    isiComplete: true,
    pufferyItems: [],
    substantiationCount: '42/42',
    flags: [],
    complianceFindings: [
      {
        severity: 'MINOR',
        category: 'LEGAL',
        finding:
          'The trademark symbol (®) is missing from the first mention of the brand name Brexiva in the header title.',
        suggestion: 'Add the trademark symbol (®) after the brand name Brexiva in the header title.',
        ref: '[Asset Type - Heading 1] EXACT LINE: Brexiva: Your Partner in Managing HR+/HER2- Metastatic Breast Cancer',
      },
    ],
    aiInsights: [
      'Trademark Fix Needed: Add the trademark symbol (®) after the brand name Brexiva in the header title.',
      'Strong Regulatory Alignment: The document includes a BOXED WARNING, ensuring compliance with safety regulations.',
      'Clear Patient Information: The patient information section effectively communicates treatment options and safety guidelines.',
    ],
    cohesion: {
      messageConsistency: 98,
      toneAlignment: 94,
      visualCohesion: 97,
      claimHarmony: 66,
    },
  },
];

// ─── Distribution Channels ────────────────────────────────────────────────────

export const DISTRIBUTION_CHANNELS: DistributionChannel[] = [
  { id: 'email', name: 'Approved Email', asset: 'HCP Email', audience: 'Oncologists, Breast Cancer Specialists', deliveryDate: '2026-04-14', enabled: true, icon: 'Mail' },
  { id: 'dda', name: 'eDetail / DDA', asset: 'Digital Detail Aid', audience: 'MSL Field Use', deliveryDate: '2026-04-17', enabled: true, icon: 'Tablet' },
  { id: 'congress', name: 'Congress Portal', asset: 'Congress Poster', audience: 'Congress Attendees', deliveryDate: '2026-04-21', enabled: true, icon: 'Building' },
  { id: 'patient', name: 'Patient Channel', asset: 'Patient Leaflet + PLS', audience: 'Patients, Caregivers', deliveryDate: '2026-04-18', enabled: true, icon: 'Users' },
  { id: 'rte', name: 'Rep-Triggered Email', asset: 'Follow-up Email', audience: 'Post-Visit HCPs', deliveryDate: '2026-04-24', enabled: false, icon: 'Share2' },
];

// ─── Effectiveness Data ───────────────────────────────────────────────────────

export const MARKET_METRICS: MarketMetrics[] = [
  { market: 'US', openRate: '34%', ctr: '12.4%', ddaTime: '4.2 min', posterDownloads: '847', openRateStatus: 'above', ctrStatus: 'above' },
  { market: 'Germany', openRate: '29%', ctr: '9.8%', ddaTime: '3.8 min', posterDownloads: '312', openRateStatus: 'near', ctrStatus: 'near' },
  { market: 'Global', openRate: '31%', ctr: '11.1%', ddaTime: '4.0 min', posterDownloads: '1,159', openRateStatus: 'above', ctrStatus: 'near' },
];

export const PERSONA_ENGAGEMENT: PersonaEngagement[] = [
  { persona: 'Conservative', type: 'Factual content', score: 89, color: '#1E1B3D' },
  { persona: 'Empathetic', type: 'Patient narratives', score: 76, color: '#00A896' },
  { persona: 'Innovator', type: 'Interactive DDA', score: 94, color: '#7C3AED' },
  { persona: 'Leader', type: 'Executive summaries', score: 82, color: '#F59E0B' },
];

export const OPTIMIZATION_RECS: OptimizationRec[] = [
  {
    finding: 'HCP email open rates trending below benchmark',
    action: 'A/B test subject line with localized clinical data reference (Brexiva PFS data)',
    impact: 'Expected +6–9% open rate uplift',
  },
  {
    finding: 'DDA engagement drops after Module 3 (MOA animation)',
    action: 'Shorten MOA section, add interactive quiz element to increase dwell time',
    impact: 'Expected +1.2 min average session length',
  },
  {
    finding: 'Patient leaflet shares 3× higher than HCP materials',
    action: 'Create patient-focused social card series for advocacy group distribution',
    impact: 'Estimated 400+ additional patient touchpoints per month',
  },
];

export const PLS_SCORES: PLSQualityScore[] = [
  { dimension: 'Readability', score: 88 },
  { dimension: 'Coverage', score: 92 },
  { dimension: 'PLS Alignment', score: 91 },
  { dimension: 'Structure', score: 96 },
  { dimension: 'Audience Fit', score: 87 },
];

export const PLS_PREVIEW = `Brexiva is a medicine that helps slow the growth of a type of breast cancer called HR+/HER2− metastatic breast cancer. It is taken by mouth as a tablet, once a day, together with another hormone therapy medicine. Brexiva works by blocking proteins called CDK4 and CDK6 that help cancer cells grow and divide. In clinical studies, people taking Brexiva had their cancer controlled for longer periods. Like all medicines, Brexiva has possible side effects. The most important things to know are that Brexiva can lower your white blood cell count (neutropenia) and may affect your liver (hepatotoxicity). You will need regular blood tests and liver function tests before starting and during treatment. Your doctor will help you decide if the benefits of taking Brexiva are right for you. Always tell your doctor and pharmacist about all the medicines you are taking.`;

// ─── Content Templates ────────────────────────────────────────────────────────

export const CONTENT_TEMPLATES: Record<string, ContentTemplate[]> = {
  email: [
    {
      id: 'email-professional',
      name: 'Professional HCP Email',
      type: 'email',
      description: 'Clean, data-driven format with clear CTAs. Proven 28% higher open rates.',
      structure: ['Subject line', 'Personalized greeting', 'Clinical data highlight', 'Key benefits (3-4 bullets)', 'CTA', 'ISI footer'],
      recommended: true,
      preview: 'Subject: [Clinical Data] → Greeting → Data Highlight → Benefits → CTA → ISI',
    },
    {
      id: 'email-narrative',
      name: 'Patient-Centric Narrative',
      type: 'email',
      description: 'Story-driven approach with patient outcomes. Higher engagement for advocacy campaigns.',
      structure: ['Subject line', 'Patient scenario', 'Clinical evidence', 'Impact statement', 'CTA', 'ISI footer'],
      recommended: false,
      preview: 'Subject: [Patient Impact] → Scenario → Evidence → Impact → CTA → ISI',
    },
    {
      id: 'email-announcement',
      name: 'News/Announcement Style',
      type: 'email',
      description: 'Breaking news format for new data, approvals, or updates.',
      structure: ['Subject line', 'Announcement headline', 'What\'s new', 'Clinical implications', 'Next steps', 'ISI footer'],
      recommended: false,
      preview: 'Subject: [Breaking News] → Headline → What\'s New → Implications → Next Steps → ISI',
    },
  ],
  poster: [
    {
      id: 'poster-scientific',
      name: 'Scientific Congress Poster',
      type: 'poster',
      description: 'Standard academic format following ICMJE guidelines. Optimal for medical conferences.',
      structure: ['Title & Authors', 'Background', 'Methods', 'Results (charts/tables)', 'Conclusion', 'References', 'Disclosures'],
      recommended: true,
      preview: 'Title → Background → Methods → Results → Conclusion → References',
    },
    {
      id: 'poster-visual',
      name: 'Visual Data Story',
      type: 'poster',
      description: 'Infographic-style with minimal text, maximum visual impact. Best for high-traffic areas.',
      structure: ['Bold headline', 'Key visual', 'Data callouts', 'Supporting graphics', 'Takeaway', 'QR code'],
      recommended: false,
      preview: 'Headline → Key Visual → Data Callouts → Graphics → Takeaway',
    },
    {
      id: 'poster-clinical-data',
      name: 'Clinical Data Showcase',
      type: 'poster',
      description: 'Evidence-focused layout emphasizing trial results and statistical significance.',
      structure: ['Study title', 'Objectives', 'Patient demographics', 'Primary endpoints', 'Results & graphs', 'Safety data', 'Conclusions'],
      recommended: false,
      preview: 'Title → Objectives → Demographics → Endpoints → Results → Safety → Conclusions',
    },
  ],
  leaflet: [
    {
      id: 'leaflet-standard',
      name: 'Patient Education Standard',
      type: 'leaflet',
      description: 'Plain language with visual hierarchy. Optimized for Grade 6-8 readability.',
      structure: ['Cover (What is it?)', 'How it works', 'What to expect', 'Important safety', 'FAQs', 'Resources'],
      recommended: true,
      preview: 'Cover → How It Works → What to Expect → Safety → FAQs → Resources',
    },
    {
      id: 'leaflet-quickstart',
      name: 'Quick Start Guide',
      type: 'leaflet',
      description: 'Step-by-step format for treatment initiation. Ideal for onboarding.',
      structure: ['Getting started', 'Step-by-step instructions', 'Dos and Don\'ts', 'When to call doctor', 'Support contacts'],
      recommended: false,
      preview: 'Getting Started → Instructions → Dos/Don\'ts → Call Doctor → Support',
    },
  ],
  dda: [
    {
      id: 'dda-modular',
      name: 'Modular Interactive DDA',
      type: 'dda',
      description: 'Slide-based presentation with branching navigation. Field force standard.',
      structure: ['Title slide', 'MOA module', 'Efficacy module', 'Safety module', 'Dosing module', 'Patient support', 'ISI'],
      recommended: true,
      preview: 'Title → MOA → Efficacy → Safety → Dosing → Support → ISI',
    },
    {
      id: 'dda-linear',
      name: 'Linear Story DDA',
      type: 'dda',
      description: 'Single narrative flow from problem to solution. Best for new HCPs.',
      structure: ['Disease burden', 'Unmet need', 'MOA introduction', 'Clinical evidence', 'Real-world data', 'Prescribing info'],
      recommended: false,
      preview: 'Burden → Need → MOA → Evidence → Real-World → Prescribing',
    },
  ],
};

export const TEMPLATE_RECOMMENDATIONS: TemplateRecommendation[] = [
  {
    assetType: 'HCP Email',
    recommendedTemplates: CONTENT_TEMPLATES.email,
  },
  {
    assetType: 'Congress Poster',
    recommendedTemplates: CONTENT_TEMPLATES.poster,
  },
  {
    assetType: 'Patient Leaflet',
    recommendedTemplates: CONTENT_TEMPLATES.leaflet,
  },
  {
    assetType: 'Digital Detail Aid',
    recommendedTemplates: CONTENT_TEMPLATES.dda,
  },
];

// ─── Medical Prompt Library ───────────────────────────────────────────────────

export const MEDICAL_PROMPTS: MedicalPrompt[] = [
  {
    id: 'multi_deliverable_campaign_content_brief',
    title: 'Multi-Deliverable Campaign-Content Brief',
    category: 'Integrated Campaign',
    prompt:
      'Create a multi-deliverable campaign-content brief for {CAMPAIGN_NAME} for {BRAND} ({DRUG_NAME}) in {THERAPEUTIC_AREA}, targeting {MARKETS}. The primary audience is {PRIMARY_AUDIENCE} and the secondary audience is {SECONDARY_AUDIENCE}. The campaign objective is {CAMPAIGN_OBJECTIVE}. Develop the brief around the key message theme: {KEY_MESSAGE_THEME}. Include the following deliverables: {DELIVERABLES}. Adapt the brief for these channels: {CHANNELS}. Include these mandatory inclusions: {MANDATORY_INCLUSIONS}. Use a {TONE} tone.',
    variables: [
      'CAMPAIGN_NAME',
      'BRAND',
      'DRUG_NAME',
      'THERAPEUTIC_AREA',
      'MARKETS',
      'PRIMARY_AUDIENCE',
      'SECONDARY_AUDIENCE',
      'CAMPAIGN_OBJECTIVE',
      'KEY_MESSAGE_THEME',
      'DELIVERABLES',
      'CHANNELS',
      'MANDATORY_INCLUSIONS',
      'TONE',
    ],
    description:
      'Creates a multi-deliverable campaign-content brief for DAWN Brief Builder Manual Mode.',
    isFavorite: true,
    usageCount: 11,
    lastUsed: '2026-06-12',
    tags: ['integrated-campaign', 'multi-deliverable'],
  },
  {
    id: 'product_education_campaign_content_brief',
    title: 'Product Education Campaign-Content Brief',
    category: 'Product Education',
    prompt:
      'Create a product education campaign-content brief for {CAMPAIGN_NAME} for {BRAND} ({DRUG_NAME}) in {THERAPEUTIC_AREA}, targeting {MARKETS}. The primary audience is {PRIMARY_AUDIENCE}. The education goal is {EDUCATION_GOAL}. Develop the brief around the product message theme: {PRODUCT_MESSAGE_THEME}. Include the following deliverables: {DELIVERABLES}. Adapt the brief for these channels: {CHANNELS}. Include these mandatory inclusions: {MANDATORY_INCLUSIONS}. Use a {TONE} tone.',
    variables: [
      'CAMPAIGN_NAME',
      'BRAND',
      'DRUG_NAME',
      'THERAPEUTIC_AREA',
      'MARKETS',
      'PRIMARY_AUDIENCE',
      'EDUCATION_GOAL',
      'PRODUCT_MESSAGE_THEME',
      'DELIVERABLES',
      'CHANNELS',
      'MANDATORY_INCLUSIONS',
      'TONE',
    ],
    description:
      'Creates a product education campaign-content brief for DAWN Brief Builder Manual Mode.',
    isFavorite: false,
    usageCount: 16,
    lastUsed: '2026-06-12',
    tags: ['product-education', 'education-goal'],
  },
  {
    id: 'product_launch_campaign_content_brief',
    title: 'Product Launch Campaign-Content Brief',
    category: 'Launch Campaign',
    prompt:
      'Create a product launch campaign-content brief for {CAMPAIGN_NAME} for {BRAND} ({DRUG_NAME}) in {THERAPEUTIC_AREA}, targeting {MARKETS}. The primary audience is {PRIMARY_AUDIENCE}. The launch objective is {LAUNCH_OBJECTIVE}. Position the campaign around {POSITIONING_THEME} and develop the key message theme: {KEY_MESSAGE_THEME}. Include the following deliverables: {DELIVERABLES}. Adapt the brief for these channels: {CHANNELS}. Include these mandatory inclusions: {MANDATORY_INCLUSIONS}.',
    variables: [
      'CAMPAIGN_NAME',
      'BRAND',
      'DRUG_NAME',
      'THERAPEUTIC_AREA',
      'MARKETS',
      'PRIMARY_AUDIENCE',
      'LAUNCH_OBJECTIVE',
      'POSITIONING_THEME',
      'KEY_MESSAGE_THEME',
      'DELIVERABLES',
      'CHANNELS',
      'MANDATORY_INCLUSIONS',
    ],
    description:
      'Creates a product launch campaign-content brief for DAWN Brief Builder Manual Mode.',
    isFavorite: true,
    usageCount: 19,
    lastUsed: '2026-06-12',
    tags: ['launch-campaign', 'positioning'],
  },
  {
    id: 'patient_education_and_support_campaign_brief',
    title: 'Patient Education and Support Campaign Brief',
    category: 'Patient Support',
    prompt:
      'Create a patient education and support campaign brief for {CAMPAIGN_NAME} for {BRAND} ({DRUG_NAME}) in {THERAPEUTIC_AREA}, targeting {MARKETS}. The patient audience is {PATIENT_AUDIENCE}. Address the patient need: {PATIENT_NEED}. The education goal is {EDUCATION_GOAL}. Include the support resource: {SUPPORT_RESOURCE}. Include the following deliverables: {DELIVERABLES}. Adapt the brief for these channels: {CHANNELS}. Use a {TONE} tone.',
    variables: [
      'CAMPAIGN_NAME',
      'BRAND',
      'DRUG_NAME',
      'THERAPEUTIC_AREA',
      'MARKETS',
      'PATIENT_AUDIENCE',
      'PATIENT_NEED',
      'EDUCATION_GOAL',
      'SUPPORT_RESOURCE',
      'DELIVERABLES',
      'CHANNELS',
      'TONE',
    ],
    description:
      'Creates a patient education and support campaign brief for DAWN Brief Builder Manual Mode.',
    isFavorite: false,
    usageCount: 10,
    lastUsed: '2026-06-12',
    tags: ['patient-support', 'patient-education'],
  },
  {
    id: 'congress_engagement_campaign_content_brief',
    title: 'Congress Engagement Campaign-Content Brief',
    category: 'Congress Engagement',
    prompt:
      'Create a congress engagement campaign-content brief for {CAMPAIGN_NAME} for {BRAND} ({DRUG_NAME}) in {THERAPEUTIC_AREA}, targeting {MARKETS}. The congress is {CONGRESS_NAME}. The primary audience is {PRIMARY_AUDIENCE}. The engagement goal is {ENGAGEMENT_GOAL}. Focus the scientific narrative on {SCIENTIFIC_FOCUS} and the key message theme: {KEY_MESSAGE_THEME}. Include the following deliverables: {DELIVERABLES}. Adapt the brief for these channels: {CHANNELS}. Include the evidence requirements: {EVIDENCE_REQUIREMENTS}. Include these mandatory inclusions: {MANDATORY_INCLUSIONS}.',
    variables: [
      'CAMPAIGN_NAME',
      'BRAND',
      'DRUG_NAME',
      'THERAPEUTIC_AREA',
      'MARKETS',
      'CONGRESS_NAME',
      'PRIMARY_AUDIENCE',
      'ENGAGEMENT_GOAL',
      'SCIENTIFIC_FOCUS',
      'KEY_MESSAGE_THEME',
      'DELIVERABLES',
      'CHANNELS',
      'EVIDENCE_REQUIREMENTS',
      'MANDATORY_INCLUSIONS',
    ],
    description:
      'Creates a congress engagement campaign-content brief for DAWN Brief Builder Manual Mode.',
    isFavorite: true,
    usageCount: 17,
    lastUsed: '2026-06-12',
    tags: ['congress-engagement', 'scientific-narrative'],
  },
  {
    id: 'omnichannel_campaign_content_brief',
    title: 'Omnichannel Campaign-Content Brief',
    category: 'Omnichannel Engagement',
    prompt:
      'Create an omnichannel campaign-content brief for {CAMPAIGN_NAME} for {BRAND} ({DRUG_NAME}) in {THERAPEUTIC_AREA}, targeting {MARKETS}. The primary audience is {PRIMARY_AUDIENCE}. The campaign objective is {CAMPAIGN_OBJECTIVE}. Plan the content around these touchpoints: {CONTENT_TOUCHPOINTS}. Include the following deliverables: {DELIVERABLES}. Adapt the brief for these channels: {CHANNELS}. Develop the key message theme: {KEY_MESSAGE_THEME}. Include these mandatory inclusions: {MANDATORY_INCLUSIONS}.',
    variables: [
      'CAMPAIGN_NAME',
      'BRAND',
      'DRUG_NAME',
      'THERAPEUTIC_AREA',
      'MARKETS',
      'PRIMARY_AUDIENCE',
      'CAMPAIGN_OBJECTIVE',
      'CONTENT_TOUCHPOINTS',
      'DELIVERABLES',
      'CHANNELS',
      'KEY_MESSAGE_THEME',
      'MANDATORY_INCLUSIONS',
    ],
    description:
      'Creates an omnichannel campaign-content brief for DAWN Brief Builder Manual Mode.',
    isFavorite: false,
    usageCount: 11,
    lastUsed: '2026-06-12',
    tags: ['omnichannel', 'content-touchpoints'],
  },
];
