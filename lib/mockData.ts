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

// ─── BLYVOR Document Cards ──────────────────────────────────────────────────

export const BLYVOR_DOCUMENTS: DocumentCard[] = [
  {
    id: 'blyvor1',
    title: 'Brexiva Clinical Review Report',
    type: 'Clinical Review',
    relevance: 97,
    keyFinding: '42% reduction in risk of disease progression or death vs. endocrine therapy alone in HR+/HER2− mBC patients with prior systemic therapy',
    selected: true,
    filePath: '/data/Clinical Review/BREXIVA_Clinical Review Report.pdf',
  },
  {
    id: 'blyvor2-pub1',
    title: 'Brexiva in Metastatic Breast Cancer — Treatment Rationale & Evidence',
    type: 'Journal',
    relevance: 96,
    keyFinding: '31.6 month median PFS vs. 13.2 months with endocrine therapy alone in HR+/HER2− mBC (p<0.0001)',
    selected: true,
    filePath: '/data/Journals/BREXIVA_Brexiva in Metastatic Breast Cancer- A Clinical Review of Treatment Rationale, Patient Selection, and Evidence Considerations.pdf',
  },
  {
    id: 'blyvor2-pub2',
    title: 'Treatment Sequencing & Clinical Decision-Making for Brexiva-Based Therapy',
    type: 'Journal',
    relevance: 92,
    keyFinding: 'Sustained progression-free survival benefit maintained across extended follow-up',
    selected: true,
    filePath: '/data/Journals/BREXIVA_Treatment Sequencing and Clinical Decision-Making for Brexiva-Based Therapy.pdf',
  },
  {
    id: 'blyvor2-pub3',
    title: 'Safety Management & Practical Monitoring for Brexiva-Based Therapy',
    type: 'Journal',
    relevance: 90,
    keyFinding: 'Long-term safety profile consistent with primary analysis across all patient populations including neutropenia and hepatotoxicity management',
    selected: true,
    filePath: '/data/Journals/BREXIVA_Safety Management and Practical Monitoring Considerations for Brexiva-Based Therapy.pdf',
  },
  {
    id: 'blyvor3',
    title: 'Multicenter Phase II Study — Efficacy, Safety & Clinical Applicability',
    type: 'Research Paper',
    relevance: 95,
    keyFinding: 'Median PFS 26.4 months on Brexiva + endocrine therapy; 58% of patients achieved confirmed objective response',
    selected: true,
    filePath: '/data/Research Papers/BREXIVA_A Simulated Multicenter Phase II Study Evaluating Efficacy, Safety, and Clinical Applicability in a Global Oncology Population.pdf',
  },
  {
    id: 'brevixa-rwe',
    title: 'Patient-Reported Outcomes & Treatment Persistence with Brexiva',
    type: 'Research Paper',
    relevance: 88,
    keyFinding: 'Real-world clinical outcomes and treatment patterns with Brexiva therapy across global oncology centers',
    selected: true,
    filePath: '/data/Research Papers/BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational Research Manuscript.pdf',
  },
  {
    id: 'blyvor-bio',
    title: 'Biomarker Patterns & Endocrine-Resistance Features in Brexiva Therapy',
    type: 'Research Paper',
    relevance: 83,
    keyFinding: 'Predictive biomarkers and genomic factors associated with Brexiva treatment response in HR+/HER2− mBC',
    selected: true,
    filePath: '/data/Research Papers/BREXIVA_Biomarker Patterns and Endocrine-Resistance Features Associated with Brexiva-Based Therapy in HR+HER2- Metastatic Breast Cancer.pdf',
  },
];

// ─── Pre-filled Brief ─────────────────────────────────────────────────────────

export const MOCK_BRIEF: BriefData = {
  campaignName: 'Brexiva Global Advocacy Campaign — HR+/HER2− mBC',
  brand: 'Brexiva',
  therapeuticArea: 'Brevixa — HR+/HER2− Metastatic Breast Cancer',
  markets: ['Global', 'USA', 'EU', 'APAC'],
  primaryAudience: ['Oncologists', 'Breast Cancer Specialists'],
  secondaryAudience: ['Oncology Nurse Practitioners', 'Patients', 'Patient Advocacy Groups'],
  keyMessages: [
    'Sustained progression-free survival benefit across all BLYVOR trials (BLYVOR-1, BLYVOR-2, BLYVOR-3)',
    'Once-daily oral dosing — simplified treatment regimen vs. IV alternatives',
    'Broad patient population coverage — first-line and prior-treated HR+/HER2− mBC',
    'Clinically meaningful response rates with 58% of patients achieving confirmed objective response',
  ],
  deliverables: ['Congress Poster', 'HCP Email', 'Patient Leaflet', 'Digital Detail Aid'],
  deadline: '4 weeks from today',
  budget: '$90,000 / $90,000',
};

// ─── Generated Assets ─────────────────────────────────────────────────────────

export const GENERATED_ASSETS: Asset[] = [
  {
    id: 'poster',
    title: 'Congress Poster',
    persona: 'Clinical Researcher',
    language: 'EN (US)',
    status: 'Pending',
    content: `BREXIVA® (SELECTIVE CDK4/6 INHIBITOR) ACHIEVES 26.4-MONTH MEDIAN PFS IN HR+/HER2− METASTATIC BREAST CANCER

BACKGROUND
HR+/HER2− metastatic breast cancer remains the most common subtype of advanced breast cancer, requiring effective therapies that extend progression-free survival. Brexiva, a selective CDK4/6 inhibitor targeting the cyclin D1-CDK4/6-INK4-Rb pathway, demonstrated sustained efficacy across the BLYVOR clinical program.

METHODS
BLYVOR-3 enrolled postmenopausal women with HR+/HER2− metastatic breast cancer. Patients received Brexiva 150 mg once daily orally in combination with endocrine therapy. The primary endpoint was progression-free survival (PFS).

RESULTS
• Median PFS: 26.4 months vs. 13.2 months with endocrine therapy alone
• 58% of patients achieved confirmed objective response
• 42% reduction in risk of disease progression or death
• Consistent efficacy across prior therapy subgroups

CONCLUSION
Once-daily oral Brexiva in combination with endocrine therapy provides sustained progression-free survival benefit in HR+/HER2− metastatic breast cancer, with clinically meaningful response rates across the BLYVOR clinical program.

IMPORTANT SAFETY INFORMATION
BOXED WARNING: NEUTROPENIA AND HEPATOTOXICITY. Severe neutropenia and hepatotoxicity have been reported in patients receiving Brexiva. Monitor complete blood counts and liver function tests prior to and during treatment.`,
  },
  {
    id: 'email',
    title: 'HCP Email',
    persona: 'Empathetic Specialist',
    language: 'EN (US)',
    status: 'Passed',
    content: `Subject: Sustained PFS Benefit with Once-Daily Brexiva in HR+/HER2− mBC

Dear Dr. [Lastname],

For your patients living with HR+/HER2− metastatic breast cancer, balancing efficacy with quality of life is a constant consideration. Brexiva® offers a once-daily oral option that changes the treatment landscape.

In the BLYVOR-3 trial, patients receiving Brexiva plus endocrine therapy achieved a median progression-free survival of 26.4 months — double that of endocrine therapy alone. 58% of patients achieved a confirmed objective response.

What this means for your practice:
• Once-daily oral dosing — simplified regimen for your patients
• 42% reduction in risk of disease progression or death
• Proven efficacy across first-line and prior-treated populations
• Manageable safety profile with established monitoring protocols

Please see the Important Safety Information and full Prescribing Information, including Boxed Warning regarding Neutropenia and Hepatotoxicity, for Brexiva.

To learn more about incorporating Brexiva into your treatment protocols, visit brexiva.com or contact your Medical Science Liaison.`,
  },
  {
    id: 'leaflet',
    title: 'Patient Leaflet',
    persona: 'Patient-Friendly',
    language: 'EN (US)',
    status: 'Passed',
    content: `LIVING WITH HR+/HER2− METASTATIC BREAST CANCER — YOUR GUIDE TO BREXIVA

What is Brexiva?
Brexiva is a medicine that helps slow or stop the growth of breast cancer cells. It works by blocking proteins called CDK4 and CDK6 that cancer cells need to divide and grow.

How is it taken?
Brexiva is taken as one tablet by mouth once a day, together with your hormone therapy. This means a simple daily routine — no infusions or injections needed.

What can I expect?
In clinical studies, patients taking Brexiva with hormone therapy went significantly longer without their cancer growing compared to hormone therapy alone. Many patients also saw their tumors shrink during treatment.

Important things to know:
• Tell your doctor if you develop signs of infection (fever, chills) — Brexiva can lower your white blood cell count
• Regular blood tests will be needed to check your blood counts and liver function
• Take Brexiva at approximately the same time each day

Questions? Talk to your healthcare provider or call the Brexiva Patient Support Line.`,
  },
  {
    id: 'dda',
    title: 'Digital Detail Aid',
    persona: 'Innovator HCP',
    language: 'EN (US)',
    status: 'Pending',
    content: `BREXIVA INTERACTIVE DETAIL AID — FIELD FORCE GUIDE

MODULE 1: MECHANISM OF ACTION
• Selective CDK4/6 inhibitor targeting the cyclin D1-CDK4/6-INK4-Rb pathway
• Blocks cell cycle progression from G1 to S phase in hormone receptor-positive breast cancer cells
• Restores cell cycle control disrupted by aberrant cyclin D-CDK4/6 signaling
• SLIDE: CDK4/6 pathway inhibition animation

MODULE 2: EFFICACY DATA
• BLYVOR-1: 42% reduction in risk of disease progression or death vs. endocrine therapy alone
• BLYVOR-2: 31.6 month median PFS vs. 13.2 months (p<0.0001)
• BLYVOR-3: Median PFS 26.4 months; 58% confirmed objective response
• SLIDE: Kaplan-Meier PFS curves comparison

MODULE 3: SAFETY PROFILE
• Boxed Warning: Neutropenia and Hepatotoxicity
• Most common adverse reactions: neutropenia, fatigue, nausea, alopecia
• Dose modification guidelines for neutropenia management
• SLIDE: Safety monitoring algorithm

MODULE 4: DOSING SIMPLICITY
• 150 mg once daily oral tablet with endocrine therapy
• No IV infusions required — simplified patient experience
• Dose adjustments available for management of adverse reactions
• SLIDE: Treatment initiation and monitoring schedule

IMPORTANT SAFETY INFORMATION
Please refer to the full Prescribing Information including Boxed Warning regarding Neutropenia and Hepatotoxicity.`,
  },
];

// ─── MLR Asset Details ────────────────────────────────────────────────────────

export const MLR_ASSETS: MLRAssetDetail[] = [
  {
    id: 'poster',
    name: 'Congress Poster',
    tier: 'Tier 2',
    status: 'Pending',
    content: GENERATED_ASSETS[0].content,
    fairBalanceScore: 78,
    isiComplete: true,
    pufferyItems: ['"sustained" (line 4)'],
    substantiationCount: '11/12',
    flags: [
      { phrase: 'Median PFS 26.4 months', type: 'substantiated', source: 'BLYVOR-3, Table 2, p.14' },
      { phrase: '58% of patients achieved confirmed objective response', type: 'substantiated', source: 'BLYVOR-3, Primary Endpoint, p.12' },
      { phrase: 'sustained progression-free survival benefit', type: 'puffery', suggestion: 'Consider: "statistically significant improvement in PFS"' },
      { phrase: 'clinically meaningful response rates', type: 'fair-balance', suggestion: 'Ensure adverse event context is in proximity' },
    ],
  },
  {
    id: 'email',
    name: 'HCP Email',
    tier: 'Tier 1',
    status: 'Passed',
    content: GENERATED_ASSETS[1].content,
    fairBalanceScore: 91,
    isiComplete: true,
    pufferyItems: [],
    substantiationCount: '8/8',
    flags: [
      { phrase: '26.4 months median PFS', type: 'substantiated', source: 'BLYVOR-3, Primary Endpoint' },
      { phrase: '58% achieved confirmed objective response', type: 'substantiated', source: 'BLYVOR-3, Table 3' },
    ],
  },
  {
    id: 'leaflet',
    name: 'Patient Leaflet',
    tier: 'Tier 1',
    status: 'Passed',
    content: GENERATED_ASSETS[2].content,
    fairBalanceScore: 88,
    isiComplete: true,
    pufferyItems: [],
    substantiationCount: '5/5',
    flags: [
      { phrase: 'patients taking Brexiva', type: 'fair-balance', suggestion: 'Specify: "In the BLYVOR-3 clinical study"' },
      { phrase: 'Many patients also saw their tumors shrink', type: 'fair-balance', suggestion: 'Qualify with individual results may vary' },
    ],
  },
  {
    id: 'dda',
    name: 'Digital Detail Aid',
    tier: 'Tier 2',
    status: 'Pending',
    content: GENERATED_ASSETS[3].content,
    fairBalanceScore: 81,
    isiComplete: true,
    pufferyItems: ['"simplified patient experience"'],
    substantiationCount: '9/10',
    flags: [
      { phrase: '42% reduction in risk of disease progression', type: 'substantiated', source: 'BLYVOR-1, Primary Endpoint' },
      { phrase: 'simplified patient experience', type: 'puffery', suggestion: 'Consider: "reduced treatment complexity"' },
      { phrase: 'Restores cell cycle control', type: 'substantiated', source: 'Preclinical MOA data' },
    ],
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
  { market: 'USA', openRate: '34%', ctr: '12.4%', ddaTime: '4.2 min', posterDownloads: '847', openRateStatus: 'above', ctrStatus: 'above' },
  { market: 'EU', openRate: '29%', ctr: '9.8%', ddaTime: '3.8 min', posterDownloads: '312', openRateStatus: 'near', ctrStatus: 'near' },
  { market: 'Global', openRate: '31%', ctr: '11.1%', ddaTime: '4.0 min', posterDownloads: '1,159', openRateStatus: 'above', ctrStatus: 'near' },
];

export const PERSONA_ENGAGEMENT: PersonaEngagement[] = [
  { persona: 'Conservative', type: 'Factual content', score: 89, color: '#0D1B3E' },
  { persona: 'Empathetic', type: 'Patient narratives', score: 76, color: '#00A896' },
  { persona: 'Innovator', type: 'Interactive DDA', score: 94, color: '#7C3AED' },
  { persona: 'Leader', type: 'Executive summaries', score: 82, color: '#F59E0B' },
];

export const OPTIMIZATION_RECS: OptimizationRec[] = [
  {
    finding: 'EU HCP email open rates 15% below US benchmark',
    action: 'A/B test subject line with localized clinical data reference (BLYVOR-3 EU sub-analysis)',
    impact: 'Expected +6–9% open rate uplift',
  },
  {
    finding: 'DDA engagement drops after Module 2 (Efficacy data)',
    action: 'Shorten efficacy section, add interactive quiz element to increase dwell time',
    impact: 'Expected +1.2 min average session length',
  },
  {
    finding: 'Patient leaflet shares 3x higher than HCP materials',
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

export const PLS_PREVIEW = `Brexiva is a medicine that helps slow or stop the growth of breast cancer in people with a type called HR+/HER2− metastatic breast cancer. It is taken as one tablet by mouth once a day along with hormone therapy. In a large clinical study called BLYVOR-3, patients who took Brexiva went more than twice as long without their cancer growing compared to hormone therapy alone — 26.4 months versus 13.2 months. This means fewer treatment changes and more stability in everyday life. Like all medicines, Brexiva has possible side effects. The most important things to know are that Brexiva can lower your white blood cell count (neutropenia) and may affect your liver (hepatotoxicity). Regular blood tests are required during treatment. Always tell your doctor and pharmacist about all the medicines you are taking.`;

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
    id: 'efficacy-1',
    title: 'Primary Efficacy Endpoint',
    category: 'Efficacy',
    prompt: 'Generate a brief for {CAMPAIGN_NAME} targeting {MARKETS} markets with primary audience of {AUDIENCE}. Create content for the following deliverables: {DELIVERABLES}. Emphasize clinical significance from {STUDY_NAME}.',
    variables: ['CAMPAIGN_NAME', 'MARKETS', 'AUDIENCE', 'DELIVERABLES', 'STUDY_NAME'],
    description: 'Creates content focused on primary efficacy outcomes from clinical trials',
    isFavorite: true,
    usageCount: 24,
    lastUsed: '2026-04-14',
    tags: ['clinical-trial', 'efficacy', 'endpoints'],
  },
  {
    id: 'efficacy-2',
    title: 'Comparative Efficacy',
    category: 'Efficacy',
    prompt: 'Write a comparison brief showing {DRUG_NAME} achieved {METRIC} of {VALUE} versus {COMPARATOR} at {COMPARATOR_VALUE} in the {STUDY_NAME} trial. Include statistical significance and clinical implications.',
    variables: ['DRUG_NAME', 'METRIC', 'VALUE', 'COMPARATOR', 'COMPARATOR_VALUE', 'STUDY_NAME'],
    description: 'Compares efficacy results between treatment arms or competitors',
    usageCount: 18,
    lastUsed: '2026-04-12',
    tags: ['comparison', 'efficacy', 'statistical'],
  },
  {
    id: 'efficacy-3',
    title: 'Subgroup Analysis',
    category: 'Efficacy',
    prompt: 'Create a brief summarizing efficacy results in the {SUBGROUP_NAME} subgroup from {STUDY_NAME}, showing {METRIC} of {VALUE}. Highlight consistency with overall population results.',
    variables: ['SUBGROUP_NAME', 'STUDY_NAME', 'METRIC', 'VALUE'],
    description: 'Focuses on efficacy in specific patient subgroups',
    isFavorite: true,
    usageCount: 15,
    lastUsed: '2026-04-10',
    tags: ['subgroup', 'analysis', 'efficacy'],
  },
  {
    id: 'safety-1',
    title: 'Safety Profile Overview',
    category: 'Safety',
    prompt: 'Generate a safety profile summary for {DRUG_NAME} based on {STUDY_NAME} with {PATIENT_EXPOSURE} patient-years of exposure. Include most common adverse events ({AE_LIST}) and any serious adverse events. Maintain balanced tone.',
    variables: ['DRUG_NAME', 'STUDY_NAME', 'PATIENT_EXPOSURE', 'AE_LIST'],
    description: 'Comprehensive safety profile with AE frequencies',
    isFavorite: true,
    usageCount: 31,
    lastUsed: '2026-04-15',
    tags: ['safety', 'adverse-events', 'tolerability'],
  },
  {
    id: 'safety-2',
    title: 'Boxed Warning Communication',
    category: 'Safety',
    prompt: 'Write a clear, balanced communication about the boxed warning for {DRUG_NAME} regarding {WARNING_TOPIC}. Include risk mitigation strategies and monitoring requirements. Ensure regulatory compliance.',
    variables: ['DRUG_NAME', 'WARNING_TOPIC'],
    description: 'Communicates boxed warnings with proper context and risk mitigation',
    usageCount: 12,
    lastUsed: '2026-04-08',
    tags: ['boxed-warning', 'safety', 'regulatory'],
  },
  {
    id: 'moa-1',
    title: 'Mechanism of Action',
    category: 'MOA',
    prompt: 'Explain the mechanism of action for {DRUG_NAME}, a {DRUG_CLASS} that works by {MOA_DESCRIPTION}. Tailor the explanation for {AUDIENCE} using appropriate scientific depth.',
    variables: ['DRUG_NAME', 'DRUG_CLASS', 'MOA_DESCRIPTION', 'AUDIENCE'],
    description: 'Explains drug mechanism tailored to audience expertise level',
    isFavorite: true,
    usageCount: 22,
    lastUsed: '2026-04-13',
    tags: ['moa', 'pharmacology', 'education'],
  },
  {
    id: 'moa-2',
    title: 'MOA vs Standard of Care',
    category: 'MOA',
    prompt: 'Create a comparison of {DRUG_NAME} mechanism of action versus standard of care {SOC_NAME}. Highlight the key mechanistic differences that contribute to {CLINICAL_BENEFIT}.',
    variables: ['DRUG_NAME', 'SOC_NAME', 'CLINICAL_BENEFIT'],
    description: 'Contrasts novel mechanism with existing treatments',
    usageCount: 9,
    lastUsed: '2026-04-11',
    tags: ['moa', 'comparison', 'differentiation'],
  },
  {
    id: 'dosing-1',
    title: 'Dosing & Administration',
    category: 'Dosing',
    prompt: 'Write dosing instructions for {DRUG_NAME}: {DOSING_REGIMEN}. Include {ROUTE}, frequency, and any special administration considerations. Mention dose adjustments for {SPECIAL_POPULATIONS}.',
    variables: ['DRUG_NAME', 'DOSING_REGIMEN', 'ROUTE', 'SPECIAL_POPULATIONS'],
    description: 'Clear dosing and administration guidance',
    usageCount: 28,
    lastUsed: '2026-04-14',
    tags: ['dosing', 'administration', 'practical'],
  },
  {
    id: 'dosing-2',
    title: 'Treatment Burden Comparison',
    category: 'Dosing',
    prompt: 'Compare the treatment burden of {DRUG_NAME} ({NEW_REGIMEN}) versus current standard of care ({OLD_REGIMEN}). Quantify the reduction in {BURDEN_METRIC} and potential impact on patient adherence.',
    variables: ['DRUG_NAME', 'NEW_REGIMEN', 'OLD_REGIMEN', 'BURDEN_METRIC'],
    description: 'Highlights convenience and reduced treatment burden',
    isFavorite: true,
    usageCount: 19,
    lastUsed: '2026-04-13',
    tags: ['dosing', 'convenience', 'adherence'],
  },
  {
    id: 'patient-1',
    title: 'Patient Education',
    category: 'Patient Support',
    prompt: 'Create patient-friendly content explaining {CONDITION} and how {DRUG_NAME} helps. Use plain language (Grade 6-8 reading level), avoid medical jargon, and include what patients can expect from treatment.',
    variables: ['CONDITION', 'DRUG_NAME'],
    description: 'Patient-facing educational content in plain language',
    usageCount: 16,
    lastUsed: '2026-04-12',
    tags: ['patient', 'education', 'plain-language'],
  },
  {
    id: 'patient-2',
    title: 'Patient Support Resources',
    category: 'Patient Support',
    prompt: 'Write about available patient support resources for {DRUG_NAME} including {PROGRAM_NAME}. Highlight services such as {SERVICES_LIST} and how to access them.',
    variables: ['DRUG_NAME', 'PROGRAM_NAME', 'SERVICES_LIST'],
    description: 'Information about patient support programs and resources',
    usageCount: 11,
    lastUsed: '2026-04-09',
    tags: ['patient', 'support', 'resources'],
  },
];
