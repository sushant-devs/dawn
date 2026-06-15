import type { Campaign, CampaignData } from './types';
import type { StorylineStep, TemplateGroupResponse } from '../types';

// ════════════════════════════════════════════════════════════════════════════
// ZOFLEVRIX — Migraine Prevention | Neurologists | Global | Deliverable: Email
// ════════════════════════════════════════════════════════════════════════════

// Channel templates for the template-selector modal, read from the brand's
// Templates/<AssetType>/ folder. The subfolder is the asset type.
const TEMPLATE_DIR = '/data/zoflevrix/Templates/Email';
const emailFile = (name: string) => `${TEMPLATE_DIR}/${encodeURIComponent(name)}.html`;

const templates: TemplateGroupResponse[] = [
  {
    assetType: 'HCP Email',
    recommendedTemplates: [
      {
        id: 'clinical-focus-email',
        name: 'Clinical Focus Email',
        type: 'email',
        description: 'Clinical, data-led layout that leads with efficacy evidence for HCPs.',
        structure: ['Subject line', 'Greeting', 'Clinical data highlight', 'Key benefits', 'CTA', 'ISI footer'],
        recommended: true,
        templateFile: emailFile('Clinical Focus Email'),
      },
      {
        id: 'data-highlight-email',
        name: 'Data Highlight Email',
        type: 'email',
        description: 'Visual-forward layout that spotlights the headline efficacy statistics.',
        structure: ['Subject line', 'Data callout', 'Supporting evidence', 'CTA', 'ISI footer'],
        recommended: false,
        templateFile: emailFile('Data Highlight Email'),
      },
      {
        id: 'newsletter-email',
        name: 'Newsletter Email',
        type: 'email',
        description: 'Multi-section newsletter format for ongoing campaign engagement.',
        structure: ['Header', 'Lead story', 'Secondary items', 'CTA', 'ISI footer'],
        recommended: false,
        templateFile: emailFile('Newsletter Email'),
      },
      {
        id: 'product-update-email',
        name: 'Product Update Email',
        type: 'email',
        description: 'Announcement-style layout for new data, updates, or indications.',
        structure: ['Subject line', 'Announcement', 'What\'s new', 'Implications', 'CTA', 'ISI footer'],
        recommended: false,
        templateFile: emailFile('Product Update Email'),
      },
    ],
  },
];

// Rendered output template for the Content Editor's Visual Templates tab —
// the generated email under /data/zoflevrix/Generated Templates/.
const GENERATED_DIR = '/data/zoflevrix/Generated Templates';
const genFile = (path: string) => `${GENERATED_DIR}/${path.split('/').map(encodeURIComponent).join('/')}`;

const visualTemplates: CampaignData['visualTemplates'] = [
  {
    id: 'clinical-focus-email',
    title: 'Clinical Focus Email',
    type: 'Digital',
    file: genFile('Email/Clinical Focus Email.html'),
    description: 'Generated HCP email — clinical, data-led layout.',
  },
];

const data: CampaignData = {
  templates,
  visualTemplates,
  clinicalDocuments: [
    {
      id: 'zoflevrix-pro-research',
      title: 'ZOFLEVRIX_Patient-Reported Outcomes, Treatment Persistence, and Acute Medication Use With Zefranova in Adults With Chronic Migraine.pdf',
      type: 'Research Paper',
      relevance: 74,
      keyFinding: 'A 36-week observational study demonstrating improvements in headache impact, reduced acute medication use, and good adherence/persistence with once-daily Zefranova in chronic migraine patients.',
      filePath: '/data/zoflevrix/Research Papers/ZOFLEVRIX_Patient-Reported Outcomes, Treatment Persistence, and Acute Medication Use With Zefranova in Adults With Chronic Migraine.pdf',
      pageCount: 34,
    },
    {
      id: 'zoflevrix-efficacy',
      title: 'ZOFLEVRIX_Efficacy, Safety and Clinical Applicability of Zefranova for Chronic Migraine Prevention in Adults.pdf',
      type: 'Research Paper',
      relevance: 74,
      keyFinding: 'A simulated randomized controlled trial showing that once-daily Zefranova reduces monthly migraine days, improves quality-of-life measures, and has a generally tolerable safety profile compared with placebo.',
      filePath: '/data/zoflevrix/Research Papers/ZOFLEVRIX_Efficacy, Safety and Clinical Applicability of Zefranova for Chronic Migraine Prevention in Adults.pdf',
      pageCount: 146,
    },
    {
      id: 'zoflevrix-pro-journal',
      title: 'ZOFLEVRIX_Patient-Reported Outcomes.pdf',
      type: 'Journal',
      relevance: 74,
      keyFinding: 'A simulated observational study showing improvements in patient-reported outcomes, reduced acute medication use, and moderate persistence/adherence with once-daily Zefranova.',
      filePath: '/data/zoflevrix/Journals/ZOFLEVRIX_Patient-Reported Outcomes.pdf',
      pageCount: 37,
    },
    {
      id: 'zoflevrix-safety-journal',
      title: 'ZOFLEVRIX_Safety, Tolerability and Practical Monitoring Considerations for Once-Daily Oral Zefranova in Chronic Migraine Prevention.pdf',
      type: 'Journal',
      relevance: 73,
      keyFinding: 'Safety, tolerability and practical monitoring considerations for once-daily oral Zefranova, emphasizing proactive assessment and conservative interpretation of adverse events.',
      filePath: '/data/zoflevrix/Journals/ZOFLEVRIX_Safety, Tolerability and Practical Monitoring Considerations for Once-Daily Oral Zefranova in Chronic Migraine Prevention.pdf',
      pageCount: 48,
    },
    {
      id: 'zoflevrix-clinical-positioning',
      title: 'ZOFLEVRIX_Clinical Positioning of Once-Daily Oral Zefranova in Chronic Migraine Prevention.pdf',
      type: 'Journal',
      relevance: 70,
      keyFinding: 'Describes how Zefranova could be positioned in clinical practice, focusing on patient selection, treatment preferences, and individualized migraine prevention strategies.',
      filePath: '/data/zoflevrix/Journals/ZOFLEVRIX_Clinical Positioning of Once-Daily Oral Zefranova in Chronic Migraine Prevention.pdf',
      pageCount: 52,
    },
    {
      id: 'zoflevrix-dose-response',
      title: 'ZOFLEVRIX_Dose-Response.pdf',
      type: 'Research Paper',
      relevance: 69,
      keyFinding: 'Phase IIb trial highlighting dose-dependent efficacy (30 mg vs 60 mg), early onset of action, and improved responder rates with once-daily Zefranova.',
      filePath: '/data/zoflevrix/Research Papers/ZOFLEVRIX_Dose-Response.pdf',
      pageCount: 61,
    },
  ],
  complianceAssets: [
    // ── Compliance Reference Set ────────────────────────────────────────────
    {
      id: 'zoflevrix-mlr',
      title: 'ZOFLEVRIX_Mlr Compliance Report.pdf',
      type: 'Regulatory',
      keyFinding: 'A structured review confirming with clear indication, evidence governance, and safety alignment, while noting that final approval requires asset-level validation and sign-off.',
      selected: true,
      filePath: '/data/zoflevrix/MLR/ZOFLEVRIX_Mlr Compliance Report.pdf',
      pageCount: 28,
    },
    {
      id: 'zoflevrix-safety-guideline',
      title: 'ZOFLEVRIX_Safety Guideline Document',
      type: 'Safety Guideline',
      keyFinding: 'Safety guideline for neurology brand Zoflevrix, covering hypersensitivity, blood pressure monitoring, CNS effects, hepatic caution, pregnancy, and counseling.',
      selected: true,
      filePath: '/data/zoflevrix/Safety Guideline/ZOFLEVRIX_Safety Guideline Document.pdf',
      pageCount: 48,
    },
    {
      id: 'zoflevrix-market',
      title: 'ZOFLEVRIX_Market Insight Reference Report.pdf',
      type: 'Publication',
      keyFinding: 'A global strategy guide outlining how Zoflevrix should be positioned as a specialist neurology brand, with adaptable communication models across markets balancing web-led, document-led, and HCP-focused approaches.',
      selected: true,
      filePath: '/data/zoflevrix/Market Insight Reference Report/ZOFLEVRIX_Market Insight Reference Report.pdf',
      pageCount: 41,
    },
    // ── Approved Brand Assets ───────────────────────────────────────────────
    {
      id: 'zoflevrix-logo',
      title: 'zoflevrix_logo.png',
      type: 'Brand Standard',
      keyFinding: 'A modern neurology-inspired logo symbolizing precision, innovation, and advanced migraine care through a sleek neural-head design and calming blue-purple gradients. ',
      selected: true,
      filePath: '/data/zoflevrix/zoflevrix_logo.png',
      pageCount: 1,
    },
    {
      id: 'zoflevrix-approved-image-1',
      title: 'zoflevrix_approved_image1.jpg',
      type: 'Brand Standard',
      keyFinding: 'reflective healthcare visual featuring a person seated by a window in soft natural light, symbolizing hope, resilience, and the positive impact of effective migraine prevention on everyday life. ',
      selected: true,
      filePath: '/data/zoflevrix/Approved Images/zoflevrix_approved_image1.jpg',
      pageCount: 1,
    },
    {
      id: 'zoflevrix-approved-image-2',
      title: 'zoflevrix_approved_image2.jpg',
      type: 'Brand Standard',
      keyFinding: 'Approved Zoflevrix brand visual for use in campaign assets.',
      selected: true,
      filePath: '/data/zoflevrix/Approved Images/zoflevrix_approved_image2.jpg',
      pageCount: 1,
    },
    {
      id: 'zoflevrix-approved-image-3',
      title: 'zoflevrix_approved_image3.jpg',
      type: 'Brand Standard',
      keyFinding: 'patient-centric healthcare visual emphasizing compassionate care and improved quality of life, with soft tones and intimate interaction symbolizing trust, support, and renewed possibilities through migraine prevention. ',
      selected: true,
      filePath: '/data/zoflevrix/Approved Images/zoflevrix_approved_image3.jpg',
      pageCount: 1,
    },
    {
      id: 'zoflevrix-approved-image-4',
      title: 'zoflevrix_approved_image4.jpg',
      type: 'Brand Standard',
      keyFinding: 'highlighting consistent migraine prevention with warm natural tones and a reflective setting that conveys strength, resilience, and a hopeful path toward a healthier future. ',
      selected: true,
      filePath: '/data/zoflevrix/Approved Images/zoflevrix_approved_image4.jpg',
      pageCount: 1,
    },
    {
      id: 'zoflevrix-approved-image-5',
      title: 'zoflevrix_approved_image5.jpg',
      type: 'Brand Standard',
      keyFinding: 'lifestyle-focused healthcare visual highlighting the promise of fewer migraine days and improved quality of life, using warm natural lighting and calm scenery to convey hope, freedom, and lasting well-being. ',
      selected: true,
      filePath: '/data/zoflevrix/Approved Images/zoflevrix_approved_image5.jpg',
      pageCount: 1,
    },
  ],
  brief: {
    campaignName: 'Zoflevrix Migraine Prevention Campaign — Neurology',
    brand: 'Zoflevrix',
    therapeuticArea: 'Neurology',
    markets: ['Global'],
    primaryAudience: ['Neurologists'],
    keyMessages: [
      'Zoflevrix has been shown to significantly reduce monthly migraine days in patients. ',
      'Recent studies indicate that Zoflevrix is generally well-tolerated, with most adverse events being mild to moderate.',
      'Neurologists should consider Zoflevrix as a viable treatment option for patients suffering from chronic migraines.',
    ],
    deliverables: ['Email'],
    mandatoryInclusions: [
      'Patients should be counseled to seek medical attention if symptoms of hypersensitivity reactions occur, such as rash, pruritus, or dyspnea.',
      'Monitor blood pressure during treatment with Zoflevrix due to potential CNS effects.'
    ],
  },
  generatedAssets: [
    {
      id: 'email',
      title: 'Email - Neurologists',
      persona: 'Empathetic Specialist',
      language: 'EN (US)',
      status: 'Passed',
      content: `Zefranova 60 mg once daily has demonstrated significant efficacy in reducing monthly migraine days. In a simulated randomized controlled trial, Zefranova reduced monthly migraine days by an average of 5.9 days compared to a 3.4-day reduction with placebo, resulting in a simulated between-group difference of 2.5 days. Additionally, Zefranova reduced monthly headache days by an average of 6.8 days, while placebo resulted in a 4.1-day reduction, yielding a difference of 2.7 days. The treatment also led to a ≥50% migraine-day responder rate of 44.2%, compared to 27.7% for placebo, indicating a substantial improvement in patient outcomes.\n
Safety and tolerability data suggest that most adverse events associated with Zefranova are mild or moderate. In a study of 206 patients, 57.8% of those taking Zefranova experienced any treatment-emergent adverse event, with 36.9% reporting mild adverse events and 18.9% reporting moderate adverse events. The most common adverse events included nausea (11.7%), fatigue (10.7%), and dizziness (7.3%). Importantly, only 1.5% of patients experienced serious adverse events, and 5.3% discontinued treatment due to adverse events.\n
As a healthcare professional, you should monitor for treatment-emergent adverse events such as nausea, fatigue, and dizziness. Patients should be counseled to seek medical attention if symptoms of hypersensitivity occur. Zefranova represents a viable treatment option for chronic migraine prevention, with evidence supporting its efficacy and a favorable safety profile.
`,
    },
  ],
  mlrAssets: [
    {
      id: 'email',
      name: 'Email',
      tier: 'Tier 3',
      status: 'Pending',
      content: '',
      fairBalanceScore: 85,
      isiComplete: true,
      pufferyItems: [],
      substantiationCount: '8/8',
      flags: [
        { phrase: 'reduced monthly migraine days by an average of 5.9 days', type: 'fair-balance', suggestion: 'Add context that this data is from a simulated randomized controlled trial.' },
        { phrase: 'Zefranova', type: 'fair-balance', suggestion: "Include the trademark symbol (®) after the first mention of 'Zefranova'." },
      ],
      complianceFindings: [
        {
          severity: 'HIGH',
          category: 'MEDICAL',
          finding:
            "The draft states that Zefranova reduces monthly migraine days by an average of 5.9 days, which is correct, but it fails to mention that this is based on a simulated randomized controlled trial, which is misleading without proper context. The exact sentence is: 'Zefranova 60 mg once daily has demonstrated significant efficacy in reducing monthly migraine days by an average of 5.9 days compared to placebo.'",
          suggestion: 'Add context that this data is from a simulated randomized controlled trial.',
          ref: '[DOC_000491_p006_c0017_C1] Zefranova 60 mg once daily reduces monthly migraine days by an average of 5.9 days.',
        },
        {
          severity: 'MINOR',
          category: 'LEGAL',
          finding:
            "The brand name 'Zefranova' is not presented with the required trademark symbol (®) on its first mention in the draft. The exact sentence is: 'Zefranova 60 mg once daily has demonstrated significant efficacy in reducing monthly migraine days.'",
          suggestion: "Include the trademark symbol (®) after the first mention of 'Zefranova'.",
          ref: "[Asset Type - 2. Source Inventory] EXACT LINE: 'Zoflevrix is positioned as a specialist-facing neurology brand, with Zefranova identified as the drug name.'",
        },
        {
          severity: 'HIGH',
          category: 'REGULATORY',
          finding:
            "The draft does not include the phrase 'BOXED WARNING', which is a critical safety warning that must be present. The exact sentence is: 'As a healthcare professional, you should counsel patients to seek medical attention for hypersensitivity reactions such as rash or difficulty breathing.'",
          suggestion: "Add the phrase 'BOXED WARNING' to the safety section.",
          ref: "[Asset Type - 3. Warnings and Precautions] EXACT LINE: 'Zefranova may be associated with clinically important safety considerations requiring baseline assessment, patient-specific risk review, and ongoing monitoring.'",
        },
      ],
      aiInsights: [
        'Add Context for Efficacy Claims: Ensure to clarify that the efficacy data is derived from a simulated randomized controlled trial.',
        "Trademark Fix Needed: Include the trademark symbol (®) after the first mention of 'Zefranova'.",
        "Include Required Safety Warnings: Incorporate the phrase 'BOXED WARNING' in the safety section to comply with regulatory requirements.",
      ],
      cohesion: {
        messageConsistency: 89,
        toneAlignment: 84,
        visualCohesion: 87,
        claimHarmony: 25,
      },
    },
  ],
  distributionChannels: [
    { id: 'email', name: 'Approved Email', asset: 'Email', audience: 'Neurologists, Headache Specialists', deliveryDate: '2026-06-25', enabled: true, icon: 'Mail' },
    { id: 'rte', name: 'Rep-Triggered Email', asset: 'Follow-up Email', audience: 'Post-Visit HCPs', deliveryDate: '2026-07-02', enabled: false, icon: 'Share2' },
  ],
  marketMetrics: [
    { market: 'US', openRate: '36%', ctr: '13.1%', ddaTime: '—', posterDownloads: '—', openRateStatus: 'above', ctrStatus: 'above' },
    { market: 'Germany', openRate: '30%', ctr: '10.2%', ddaTime: '—', posterDownloads: '—', openRateStatus: 'near', ctrStatus: 'near' },
    { market: 'Global', openRate: '33%', ctr: '11.7%', ddaTime: '—', posterDownloads: '—', openRateStatus: 'above', ctrStatus: 'near' },
  ],
  personaEngagement: [
    { persona: 'Conservative', type: 'Factual content', score: 84, color: '#1E1B3D' },
    { persona: 'Empathetic', type: 'Patient narratives', score: 88, color: '#00A896' },
    { persona: 'Innovator', type: 'Mechanism focus', score: 79, color: '#7C3AED' },
    { persona: 'Leader', type: 'Executive summaries', score: 81, color: '#F59E0B' },
  ],
  optimizationRecs: [
    {
      finding: 'HCP email open rates strong but CTR plateaus mid-body',
      action: 'Move the ≥50% responder statistic above the fold in the email body',
      impact: 'Expected +3–5% CTR uplift',
    },
    {
      finding: 'Neurologists engage most with onset-of-effect messaging',
      action: 'A/B test subject line emphasizing first-month onset vs. monthly migraine day reduction',
      impact: 'Expected +4% open rate uplift',
    },
  ],
  plsScores: [
    { dimension: 'Readability', score: 86 },
    { dimension: 'Coverage', score: 90 },
    { dimension: 'PLS Alignment', score: 89 },
    { dimension: 'Structure', score: 93 },
    { dimension: 'Audience Fit', score: 88 },
  ],
  plsPreview: `Zoflevrix is a medicine that helps prevent migraine attacks. It is taken by mouth as a tablet, once a day. Zoflevrix works by blocking a protein called CGRP that plays a role in causing migraine pain. In clinical studies, people taking Zoflevrix had fewer migraine days each month. Like all medicines, Zoflevrix has possible side effects, and your doctor may check your liver with blood tests during treatment. Always tell your doctor and pharmacist about all the medicines you are taking.`,
};

// ─── Storyline ───────────────────────────────────────────────────────────────

const storyline: StorylineStep[] = [
  {
    id: 'step-0',
    stage: 'setup',
    userMessage:
      'Set up a new Zoflevrix campaign for migraine prevention targeting neurologists globally. Deliverable: Email only.',
    agentResponse: {
      text: 'I have captured the details and am setting up your campaign now.',
      campaignSummary: {
        brand: 'Zoflevrix',
        ta: 'Neurology',
        markets: ['Global'],
        audience: ['Neurologists'],
        campaignId: 'DAWN-NEU-2026-0091',
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
      text: "The evidence curation has highlighted key documents related to Zefranova's role in chronic migraine prevention.\n\n• ZOFLEVRIX_Clinical Positioning of Once-Daily Oral Zefranova in Chronic Migraine Prevention.pdf\n• ZOFLEVRIX_Patient-Reported Outcomes.pdf\n• ZOFLEVRIX_Safety, Tolerability and Practical Monitoring Considerations for Once-Daily Oral Zefranova in Chronic Migraine Prevention.pdf\n• ZOFLEVRIX_Dose-Response.pdf\n\nThis list represents a curated subset of the total evidence collected.",
      documentCards: data.clinicalDocuments,
    },
    autoAdvance: true,
    thinkingMessage: `Retrieving clinical evidence . . . . .
• Reading requirements — brand Zoflevrix, plus the user's campaign details.
• Decomposing the search into focused angles: clinical evidence, safety profile, MLR rules, and market context.
• Querying the asset library for every approved document for this brand.
• Re-ranking passages in the vector store to surface the most relevant clinical evidence.

Locating approved templates . . . . . .
• Looking up channel templates for: Congress Poster, Email, Patient Leaflet, Digital Detail Aid.
• Pulling the template family for Zoflevrix so the campaign can be rendered into compliant layouts.

Outcome — templates ready:
• Approved templates located for 4 channels: Congress Poster, Email, Patient Leaflet, Digital Detail Aid.
• Most-used template per channel marked as recommended.

Outcome — knowledge base assembled:
• 7 clinical, 1 MLR, 1 safety, 1 market-insight documents.
• Scored 7 clinical documents; kept 10 top-ranked passages for the brief.
• Indexed 12 compliance,12 safety, and 75 market-insight chunks for downstream citation. 
• Captured 4 pre-approved images and 1 brand logos for the visual layer. 
• Consolidated knowledge base saved for brief and design stages. 
`,
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
      text: 'The campaign focuses on promoting Zoflevrix for migraine prevention within the neurology therapeutic area, targeting neurologists globally. Key claims emphasize its efficacy in reducing monthly migraine days, its favorable safety profile, and its viability as a treatment option for chronic migraines. The primary deliverable is an email that will highlight these points while providing practical guidance for neurologists.',
      documentCards: data.complianceAssets,
    },
    autoAdvance: true,
    thinkingMessage: `Drafting the strategic brief . . . . . . .
• Captured filters — brand Zoflevrix, therapeutic area Neurology, audience neurologists, markets global.
• Loaded clinical, safety, and market context from the extracted knowledge base for grounding.
• Anchoring the brief on the stated objective: disease education and treatment awareness, with deliverables limited to the requested deliverables.
• Drafting the core strategic narrative — what the campaign must say, to whom, and why now.

Brief drafted. Opening line:"The campaign strategy for Zoflevrix will focus on delivering a targeted email to neurologists globally, emphasizing disease education and treatment awareness for migraine prevention…" 

Building the execution plan . . . . . . .
• Mapping the brief onto each deliverable channel: Email.
• Formulating a step-by-step execution plan for 1 channel.
• Distilling the campaign's core key messages and mandatory regulatory inclusions for every asset.

Plan locked . . . . .
• 1 execution step across 1 channel.
• 3 key message — leading with: "Zoflevrix has been shown to significantly reduce monthly migraine days in patients.". 
• 2 mandatory inclusion(s) — e.g. "Patients should be counseled to seek medical attention if symptoms of hypersensitivity reactions occur, such as rash, pruritus, or dyspnea.".`,
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
      ],
      imageVariations: [
        {
          id: 'email',
          title: 'HCP Email Template',
          image: '/templates/email.png',
          description: 'Professional HCP email format with data highlights',
          type: 'Digital',
        },
      ],
      actionButton: { label: 'Review & Edit Content + Visuals →', modal: 'contentEditor' },
    },
    triggersModal: 'contentEditor',
    autoAdvanceAfterModal: true,
    thinkingMessage: `
Orchestrator thinking . . . . . .
Orchestrator is reviewing the current source state to determine which specialist agent should be invoked next based on the task requirements and available context.
• Working set — 10 approved source chunks available; target channels: Email.
Source inventory — 10 chunks, previewing the first few:
• ZOFLEVRIX_Patient-Reported Outcomes, Treatment Persistence, and Acute Medication Use With Zefranova in Adults With Chronic Migraine.pdf · Safety and Tolerability · p.7 — "[Asset: ZOFLEVRIX_Patient-Reported Outcomes, Treatment Persistence, and Acute Medication Use With Zefranova in Adults With Chronic Migraine…"
• ZOFLEVRIX_Efficacy, Safety and Clinical Applicability of Zefranova for Chronic Migraine Prevention in Adults.pdf · Safety and Tolerability · p.7 — "[Asset: ZOFLEVRIX_Efficacy, Safety and Clinical Applicability of Zefranova for Chronic Migraine Prevention in Adults.pdf] [Description: A s…"
• ZOFLEVRIX_Patient-Reported Outcomes, Treatment Persistence, and Acute Medication-Use Patterns with Once-Daily Oral Zefranova in Chronic Migraine Prevention.pdf · References · p.7 — "[Asset: ZOFLEVRIX_Patient-Reported Outcomes, Treatment Persistence, and Acute Medication-Use Patterns with Once-Daily Oral Zefranova in Chr…"
• ZOFLEVRIX_Patient-Reported Outcomes, Treatment Persistence, and Acute Medication Use With Zefranova in Adults With Chronic Migraine.pdf · Conflicts of Interest · p.9 — "[Asset: ZOFLEVRIX_Patient-Reported Outcomes, Treatment Persistence, and Acute Medication Use With Zefranova in Adults With Chronic Migraine…"
• ZOFLEVRIX_Safety, Tolerability and Practical Monitoring Considerations for Once-Daily Oral Zefranova in Chronic Migraine Prevention.pdf · Safety, Tolerability and Practical Monitoring Considerations for Once-Daily Oral Zefranova in Chronic Migraine Prevention: A ClinicalManagement Journal Paper · p.1 — "[Asset: ZOFLEVRIX_Safety, Tolerability and Practical Monitoring Considerations for Once-Daily Oral Zefranova in Chronic Migraine Prevention…"
• …plus 5 more chunks queued for the Claim Agent.
• No claims captured yet — handing the work to the Claim Agent so it can mine the source material first.

Claim Agent thinking . . . . . .
Claim Agent is now active. Scanning approved source material to extract and structure a library of citable, single-sentence facts that will serve as the foundation for content generation

• Inbound source set has 10 chunks to scan for claims.
• Reading every approved chunk and pulling out distinct, verifiable factual claims about the drug.
• Each claim must be one self-contained sentence so downstream agents can cite it without paraphrasing.
Mined 76 verifiable claim(s) from 10 source chunk(s).

Top claim: "Treatment-emergent adverse events were reported by 266 participants.".

Content Agent thinking . . . . . .
Content Agent is now active. Binding the verified claim library to the selected template and composing the full asset copy, ensuring every statement is grounded in an approved claim.

• Will draft copy for Email.
• Assembling a knowledge record that binds the source chunks, the extracted claims, and the chosen template into a single structured payload.
Bound 76 claims and 15 source passages into a knowledge record covering 1 channels: EMAIL.

Captured template structure (sections, placeholders) so the draft will fit the chosen layout.

Drafting the actual asset copy from the knowledge record — every line must trace back to an approved claim.
• Drafted copy for 1 channels:

EMAIL — citing 8 approved claim(s).
• Opening line — "Zefranova 60 mg once daily has demonstrated significant efficacy in reducing monthly migraine days. In a simulated randomized controlled trial, Zefranova reduced monthly migraine days by an average of 5.9 days, compared to a reduction of 3.4 days with placebo, resulting in a simulated between-group difference of 2.5 days. This treatment also effectively decreased monthly headache days by an average of 6.8 days, with a between-group difference of 2.7 days compared to placebo. Additionally, Zefranova reduced monthly acute medication-use days by an average of 4.2 days, compared to 2.5 days with placebo, leading to a difference of 1.7 days."

Designer Agent thinking . . . . . .
Designer Agent is now active. Taking the drafted copy and rendering it into the chosen template layout, placing approved imagery and finalizing the visual asset for output.

• Design inputs — template family: Clinical Focus Email.
• Pouring the drafted copy into the selected template structure to produce a rendered HTML draft.
Rendered 1 HTML draft(s):

• EMAIL — laid into "Clinical Focus Email".
• Resolving image placeholders against the brand's pre-approved asset library and embedding them into the final HTML.
Resolved pre-approved images from the brand asset library.

Embedded imagery into 1 final assets:

• EMAIL — 3 images embedded.
Design pipeline complete — asset is ready for the compliance review.`,
  },
  {
    id: 'step-6',
    stage: 'mlr',
    userMessage: '',
    agentResponse: {
      text: 'Internal MLR screen completed. It identifies flagged claims, explains tier risk, and shows what needs revision. You will receive a notification once the assets are approved.',
      mlrTable: [
        { asset: 'Email', tier: 'Tier 3', aiPreScreen: '3 Flags', status: 'Flagged' },
      ],
      actionButton: { label: 'Open MLR Pre-Screen →', modal: 'mlrChecker' },
      notification: {
        type: 'warning',
        title: 'MLR Review — Action Required',
        message: 'The HCP Email was flagged with 3 compliance issues (2 high-severity, 1 minor) and is blocked pending human review.',
        timestamp: '2026-06-18 11:05:00',
        details: {
          approvedAssets: [
            { asset: 'Email', tier: 'Tier 3', aiPreScreen: '3 Flags', status: 'Flagged' },
          ],
          approver: 'Sarah Mitchell',
          approvalDate: '2026-06-18',
          comments: 'Resolve the flagged medical, legal, and regulatory findings before distribution.',
        },
      },
    },
    triggersModal: 'mlrChecker',
    autoAdvanceAfterModal: true,
    thinkingMessage: `Compliance review
• Loaded the draft asset alongside 76 approved claims.
• MEDICAL check — comparing every numeric or efficacy statement against approved claims.
• REGULATORY check — confirming the asset carries the required Boxed Warnings.
• LEGAL check — verifying trademark symbols and brand presentation.

Verdict — compliance issues found:

• 3 issues total — 2 high-severity, 1 minor.
• Distribution by domain: 2 medical, 1 legal.
• Top finding: "The reported percentage of patients experiencing treatment-emergent adverse events is incorrect. The draft states '57.8% of patients experienced treatment-emergent adverse events,' while the approved claim states '54.7% of the overall population experienced any treatment-emergent adverse event.'".

Risk tier: TIER_3 — high-risk issues, blocked pending human review.`,
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
      text: 'Campaign performance dashboard ready. Here is the current performance summary for the HCP email channel.',
      metrics: [
        { label: 'Email Open Rate', value: '36%', trend: '↑ 10%', trendUp: true, benchmark: 'vs. 26% benchmark' },
        { label: 'Email CTR', value: '13.1%', trend: '↑ 4.8%', trendUp: true, benchmark: 'vs. 8.3% benchmark' },
        { label: 'Unsubscribe Rate', value: '0.4%', trend: '↓ 0.2%', trendUp: true, benchmark: 'vs. 0.9% benchmark' },
        { label: 'Rx Starts', value: '184', trend: '+38 MoM', trendUp: true, benchmark: 'vs. 140 target' },
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

export const zoflevrixCampaign: Campaign = {
  id: 'zoflevrix',
  chipLabel: 'Zoflevrix migraine campaign',
  brand: 'Zoflevrix',
  storyline,
  data,
};
