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

// ─── HAVEN Document Cards ─────────────────────────────────────────────────────

export const HAVEN_DOCUMENTS: DocumentCard[] = [
  {
    id: 'haven1',
    title: 'HAVEN 1 Clinical Study Report',
    type: 'CSR',
    relevance: 97,
    keyFinding: '87% reduction in ABR vs. on-demand bypassing agents in patients with inhibitors (12+ years)',
    selected: true,
    filePath: '/data/HEMLIBRA_clinical report.pdf',
    pageCount: 156,
  },
  {
    id: 'haven3-pub1',
    title: 'HAVEN 3 Journal Publication - Primary Analysis',
    type: 'Publication',
    relevance: 96,
    keyFinding: '96% ABR reduction vs. no prophylaxis in patients without inhibitors (p<0.0001)',
    selected: true,
    filePath: '/data/HEMLIBRA_journal_ppr01.pdf',
    pageCount: 158,
  },
  {
    id: 'haven3-pub2',
    title: 'HAVEN 3 Journal Publication - Extended Follow-up',
    type: 'Publication',
    relevance: 92,
    keyFinding: 'Sustained efficacy and safety with extended follow-up in HAVEN 3 trial',
    selected: true,
    filePath: '/data/HEMLIBRA_journal_ppr02.pdf',
    pageCount: 82,
  },
  {
    id: 'haven3-pub3',
    title: 'HAVEN 3 Journal Publication - Long-term Safety',
    type: 'Publication',
    relevance: 90,
    keyFinding: 'Long-term safety profile consistent with primary analysis across all patient populations',
    selected: true,
    filePath: '/data/HEMLIBRA_journal_ppr03.pdf',
    pageCount: 284,
  },
  {
    id: 'haven4',
    title: 'HAVEN 4 Clinical Study Report',
    type: 'Publication',
    relevance: 95,
    keyFinding: 'Median ABR 0.0 on Q4W dosing; 56% of patients achieved zero treated bleeds',
    selected: true,
    filePath: '/data/HEMLIBRA_emicizumab-kxwh_research_ppr.pdf',
    pageCount: 18,
  },
  {
    id: 'haven7',
    title: 'HAVEN 7 - Pediatric Prophylaxis Study',
    type: 'Publication',
    relevance: 89,
    keyFinding: 'Emicizumab prophylaxis in infants with hemophilia A demonstrates safety and efficacy',
    selected: true,
    filePath: '/data/HEMLIBRA_Emicizumab prophylaxis in infants with hemophilia A (HAVEN 7).pdf',
    pageCount: 54,
  },
  {
    id: 'journal-04',
    title: 'Hemlibra Journal Publication - Clinical Experience',
    type: 'Publication',
    relevance: 88,
    keyFinding: 'Real-world clinical experience and outcomes with emicizumab therapy',
    selected: false,
    filePath: '/data/HEMLIBRA_journal_04.pdf',
    pageCount: 37,
  },
  {
    id: 'research-01',
    title: 'Hemlibra Research Paper - Pharmacology',
    type: 'Publication',
    relevance: 85,
    keyFinding: 'Pharmacological properties and mechanism of action of emicizumab',
    selected: false,
    filePath: '/data/HEMLIBRA_research_ppr.pdf',
    pageCount: 68,
  },
  {
    id: 'research-02',
    title: 'Hemlibra Research Paper - Immunogenicity',
    type: 'Publication',
    relevance: 83,
    keyFinding: 'Immunogenicity assessment and antibody formation in clinical trials',
    selected: false,
    filePath: '/data/HEMLIBRA_research_ppr02.pdf',
    pageCount: 132,
  },
  {
    id: 'research-03',
    title: 'Hemlibra Research Paper - Biomarker Analysis',
    type: 'Publication',
    relevance: 81,
    keyFinding: 'Biomarker analysis and predictive factors for treatment response',
    selected: false,
    filePath: '/data/HEMLIBRA_research_ppr03.pdf',
    pageCount: 145,
  },
];

// ─── Pre-filled Brief ─────────────────────────────────────────────────────────

export const MOCK_BRIEF: BriefData = {
  campaignName: 'Hemlibra Prophylaxis Advocacy 2026',
  brand: 'Hemlibra (emicizumab-kxwh)',
  therapeuticArea: 'Hematology - Hemophilia A',
  markets: ['US', 'EMEA', 'Germany'],
  primaryAudience: ['Hematologists', 'Rheumatologists'],
  secondaryAudience: ['Nurse Practitioners', 'Patients', 'Advocacy Groups'],
  keyMessages: [
    'Superior bleed prevention across all HAVEN trials (HAVEN 1–4)',
    'Monthly SC dosing convenience - 13 treatments per year vs. 156',
    'Broad patient population coverage - with and without inhibitors',
  ],
  deliverables: ['Congress Poster', 'HCP Email (US)', 'HCP Email (DE)', 'Patient Leaflet', 'Digital Detail Aid'],
  deadline: '4 weeks from today',
  budget: '$75,000 / $75,000',
};

// ─── Generated Assets ─────────────────────────────────────────────────────────

export const GENERATED_ASSETS: Asset[] = [
  {
    id: 'poster',
    title: 'Congress Poster - HAVEN 4 Data Presentation',
    wordCount: 420,
    persona: 'Clinical Researcher',
    language: 'EN (US)',
    status: 'Pending',
    content: `HEMLIBRA® (EMICIZUMAB-KXWH) ACHIEVES ZERO MEDIAN ABR WITH MONTHLY DOSING

BACKGROUND
Hemophilia A with or without inhibitors requires effective prophylaxis to prevent joint damage and bleeding episodes. Hemlibra, a bispecific antibody mimicking factor VIII, demonstrated sustained efficacy in the HAVEN clinical program.

METHODS
HAVEN 4 enrolled adults and adolescents with hemophilia A (with or without FVIII inhibitors). Patients received emicizumab 3 mg/kg Q4W subcutaneously. The primary endpoint was annualized bleed rate (ABR).

RESULTS
• Median treated ABR: 0.0 (IQR 0.0–1.69)
• 56% of patients achieved zero treated bleeds
• 57.1% achieved zero total bleeds
• Consistent efficacy regardless of inhibitor status

CONCLUSION
Monthly subcutaneous Hemlibra prophylaxis provides sustained, near-elimination of bleeds, reducing treatment burden from up to 156 annual IV infusions to just 13 subcutaneous injections per year.

IMPORTANT SAFETY INFORMATION
WARNING: THROMBOTIC MICROANGIOPATHY (TMA) AND THROMBOEMBOLISM. Cases of TMA were reported when aPCC (>100 U/kg/24h cumulative) was administered to patients receiving Hemlibra.`,
  },
  {
    id: 'email-us',
    title: 'HCP Email - US Hematologists',
    wordCount: 285,
    persona: 'Empathetic Specialist',
    language: 'EN (US)',
    status: 'Passed',
    content: `Subject: Your Patients Can Now Achieve Zero Bleeds with Monthly Hemlibra Prophylaxis

Dear Dr. [Lastname],

For your patients living with hemophilia A, the burden of frequent infusions can be as challenging as the disease itself. Hemlibra® (emicizumab-kxwh) changes that equation.

In the HAVEN 4 trial, patients receiving Hemlibra once monthly achieved a median annualized bleed rate (ABR) of 0.0. More than half - 56% - experienced zero treated bleeds throughout the study period.

What this means for your practice:
• From 156 annual IV infusions to just 13 subcutaneous injections
• Consistent protection regardless of inhibitor status
• Proven safety profile across the HAVEN clinical program

Please see the Important Safety Information and full Prescribing Information, including Boxed Warning, for Hemlibra.

To learn more about incorporating Hemlibra into your prophylaxis protocols, visit hemlibra.com or contact your Roche Medical Science Liaison.`,
  },
  {
    id: 'email-de',
    title: 'HCP Email - German Hematologists',
    wordCount: 298,
    persona: 'Conservative Specialist',
    language: 'DE',
    status: 'Pending',
    content: `Betreff: Monatliche Hemlibra-Prophylaxe - Mediane ABR von 0,0 in HAVEN 4

Sehr geehrte Frau Dr. [Nachname], sehr geehrter Herr Dr. [Nachname],

Für Patienten mit Hämophilie A bedeutet die Umstellung auf Hemlibra® (Emicizumab) eine grundlegende Veränderung ihres Behandlungsalltags.

In der HAVEN-4-Studie erreichten Patienten unter monatlicher subkutaner Hemlibra-Gabe eine mediane jährliche Blutungsrate (ABR) von 0,0. 56 % der Patienten verzeichneten keinerlei behandlungsbedürftige Blutungen.

Klinische Vorteile:
• Reduktion von bis zu 156 IV-Infusionen auf nur 13 subkutane Injektionen pro Jahr
• Wirksamkeit unabhängig vom Hemmkörperstatus
• Bewährtes Sicherheitsprofil aus dem gesamten HAVEN-Programm

Weitere Informationen entnehmen Sie bitte der aktuellen Fachinformation zu Hemlibra.`,
  },
  {
    id: 'leaflet',
    title: 'Patient Leaflet - Prophylaxis Transition Guide',
    wordCount: 350,
    persona: 'Patient-Friendly',
    language: 'EN (US)',
    status: 'Passed',
    content: `LIVING WITH HEMOPHILIA A - YOUR GUIDE TO HEMLIBRA PROPHYLAXIS

What is Hemlibra?
Hemlibra is a medicine that helps prevent bleeding in people with hemophilia A. It works by acting like the clotting factor your body is missing.

How is it given?
Hemlibra is given as a shot under the skin (subcutaneous injection). Once you've completed the starting doses, you'll only need one injection per month - that's just 13 injections a year.

What can I expect?
In clinical studies, many people taking Hemlibra once a month had no treated bleeds at all during the study. This means fewer emergency room visits and more freedom in daily life.

Important things to know:
• Tell your doctor if you use aPCC (FEIBA) - this combination requires careful monitoring
• Keep all your regular hematologist appointments
• Always carry your patient identification card

Questions? Talk to your healthcare provider or call the Hemlibra Patient Support Line.`,
  },
  {
    id: 'dda',
    title: 'Digital Detail Aid - Interactive HCP Presentation',
    wordCount: 510,
    persona: 'Innovator HCP',
    language: 'EN (US)',
    status: 'Pending',
    content: `HEMLIBRA INTERACTIVE DETAIL AID - FIELD FORCE GUIDE

MODULE 1: THE TREATMENT BURDEN PROBLEM
• Patients with severe hemophilia A require up to 156 annual IV infusions with factor VIII products
• IV access complications, vein damage, and infusion anxiety are common barriers to adherence
• SLIDE: Infusion burden timeline visualization

MODULE 2: HEMLIBRA'S MECHANISM OF ACTION
• Bispecific antibody bridging FIXa and FX, mimicking the function of activated FVIII
• Subcutaneous administration eliminates IV access concerns
• SLIDE: MOA animation placeholder

MODULE 3: HAVEN EFFICACY DATA
• HAVEN 1: 87% ABR reduction vs. bypassing agents (inhibitor patients)
• HAVEN 3: 96% ABR reduction vs. no prophylaxis
• HAVEN 4: Median ABR 0.0 with Q4W monthly dosing
• SLIDE: Comparative ABR bar chart

MODULE 4: DOSING SIMPLICITY
• Loading: 3 mg/kg SC weekly × 4 weeks
• Maintenance options: 1.5 mg/kg weekly, 3 mg/kg bi-weekly, or 6 mg/kg monthly
• SLIDE: Dosing schedule comparison

IMPORTANT SAFETY INFORMATION
Please refer to the full Prescribing Information including Boxed Warning.`,
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
    fairBalanceScore: 78,
    isiComplete: true,
    pufferyItems: ['"superior" (line 4)'],
    substantiationCount: '11/12',
    flags: [
      { phrase: 'Median ABR 0.0', type: 'substantiated', source: 'HAVEN 4, Table 2, p.14' },
      { phrase: '56% of patients achieved zero treated bleeds', type: 'substantiated', source: 'HAVEN 4, Primary Endpoint, p.12' },
      { phrase: 'near-elimination of bleeds', type: 'puffery', suggestion: 'Consider: "significant reduction in bleed rate"' },
      { phrase: 'reducing treatment burden', type: 'fair-balance', suggestion: 'Ensure adverse event context is in proximity' },
    ],
  },
  {
    id: 'email-us',
    name: 'HCP Email (US)',
    tier: 'Tier 1',
    status: 'Passed',
    content: GENERATED_ASSETS[1].content,
    fairBalanceScore: 91,
    isiComplete: true,
    pufferyItems: [],
    substantiationCount: '8/8',
    flags: [
      { phrase: 'zero bleeds', type: 'substantiated', source: 'HAVEN 4, Primary Endpoint' },
      { phrase: '56% experienced zero treated bleeds', type: 'substantiated', source: 'HAVEN 4, Table 3' },
    ],
  },
  {
    id: 'email-de',
    name: 'HCP Email (DE)',
    tier: 'Tier 2',
    status: 'Pending',
    content: GENERATED_ASSETS[2].content,
    fairBalanceScore: 84,
    isiComplete: true,
    pufferyItems: [],
    substantiationCount: '6/7',
    flags: [
      { phrase: 'grundlegende Veränderung', type: 'puffery', suggestion: 'Consider more measured language for regulatory' },
    ],
  },
  {
    id: 'leaflet',
    name: 'Patient Leaflet',
    tier: 'Tier 1',
    status: 'Passed',
    content: GENERATED_ASSETS[3].content,
    fairBalanceScore: 88,
    isiComplete: true,
    pufferyItems: [],
    substantiationCount: '5/5',
    flags: [
      { phrase: 'many people taking Hemlibra', type: 'fair-balance', suggestion: 'Specify: "In the HAVEN 4 clinical study"' },
      { phrase: 'more freedom in daily life', type: 'fair-balance', suggestion: 'Qualify with individual results may vary' },
    ],
  },
  {
    id: 'dda',
    name: 'Digital Detail Aid',
    tier: 'Tier 2',
    status: 'Pending',
    content: GENERATED_ASSETS[4].content,
    fairBalanceScore: 81,
    isiComplete: true,
    pufferyItems: ['"eliminates IV access concerns"'],
    substantiationCount: '9/10',
    flags: [
      { phrase: '87% ABR reduction', type: 'substantiated', source: 'HAVEN 1, Primary Endpoint' },
      { phrase: 'eliminates IV access concerns', type: 'puffery', suggestion: 'Consider: "reduces IV access requirements"' },
      { phrase: 'up to 156 annual IV infusions', type: 'substantiated', source: 'Standard of Care data' },
    ],
  },
];

// ─── Distribution Channels ────────────────────────────────────────────────────

export const DISTRIBUTION_CHANNELS: DistributionChannel[] = [
  { id: 'email-us', name: 'Approved Email (US)', asset: 'HCP Email (US)', audience: 'Hematologists, Rheumatologists', deliveryDate: '2026-04-14', enabled: true, icon: 'Mail' },
  { id: 'email-de', name: 'Approved Email (DE)', asset: 'HCP Email (DE)', audience: 'German Hematologists', deliveryDate: '2026-04-14', enabled: true, icon: 'Mail' },
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
  { persona: 'Conservative', type: 'Factual content', score: 89, color: '#0D1B3E' },
  { persona: 'Empathetic', type: 'Patient narratives', score: 76, color: '#00A896' },
  { persona: 'Innovator', type: 'Interactive DDA', score: 94, color: '#7C3AED' },
  { persona: 'Leader', type: 'Executive summaries', score: 82, color: '#F59E0B' },
];

export const OPTIMIZATION_RECS: OptimizationRec[] = [
  {
    finding: 'German HCP email open rates 15% below US benchmark',
    action: 'A/B test subject line with localized clinical data reference (HAVEN 4 Germany sub-analysis)',
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

export const PLS_PREVIEW = `Hemlibra is a medicine that helps stop bleeding in people with hemophilia A - a condition where the blood does not clot properly. It is given as an injection under the skin once a month. In a large clinical study called HAVEN 4, more than half of patients who took Hemlibra once a month had no bleeds at all during the study period. This means fewer hospital visits and less disruption to everyday life. Like all medicines, Hemlibra has possible side effects. The most important thing to know is that using another clotting medicine called aPCC at the same time as Hemlibra may cause serious blood clotting problems. Always tell your doctor and pharmacist about all the medicines you are taking.`;

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
    assetType: 'HCP Email (US)',
    recommendedTemplates: CONTENT_TEMPLATES.email,
  },
  {
    assetType: 'HCP Email (DE)',
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
