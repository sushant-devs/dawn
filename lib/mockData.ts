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
  },
  {
    id: 'haven2',
    title: 'HAVEN 2 Clinical Study Report',
    type: 'CSR',
    relevance: 95,
    keyFinding: '99% reduction in treated bleeds (pediatric patients with inhibitors)',
    selected: true,
  },
  {
    id: 'haven3',
    title: 'HAVEN 3 Journal Publication',
    type: 'Publication',
    relevance: 94,
    keyFinding: '96% ABR reduction vs. no prophylaxis in patients without inhibitors (p<0.0001)',
    selected: true,
  },
  {
    id: 'haven4',
    title: 'HAVEN 4 Clinical Study Report',
    type: 'CSR',
    relevance: 93,
    keyFinding: 'Median ABR 0.0 on Q4W dosing; 56% of patients achieved zero treated bleeds',
    selected: true,
  },
  {
    id: 'brand',
    title: 'Hemlibra Brand Guidelines v4',
    type: 'Brand Standard',
    relevance: 100,
    keyFinding: 'Visual identity, tone of voice, approved promotional claims, logo usage rules',
    selected: true,
  },
  {
    id: 'isi',
    title: 'Hemlibra ISI / Prescribing Information',
    type: 'Regulatory',
    relevance: 100,
    keyFinding: 'Boxed Warning: TMA/Thromboembolism with aPCC. Full safety profile and contraindications.',
    selected: true,
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
