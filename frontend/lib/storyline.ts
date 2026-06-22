import type { StorylineStep } from './types';
import { CLINICAL_DOCUMENTS, COMPLIANCE_ASSETS } from './mockData';

export const STORYLINE: StorylineStep[] = [
  // ─── Step 0: Campaign Setup ────────────────────────────────────────────────
  {
    id: 'step-0',
    stage: 'setup',
    userMessage:
      ' I need to generate Brexiva campaign content targeting oncology specialists in the global market for metastatic breast cancer including Email, Patient Leaflet, Digital Detail Aid and Congress Poster. ',
    agentResponse: {
      text: "I have captured the details and am setting up your campaign now.",
      campaignSummary: {
        brand: 'Brexiva',
        ta: 'Oncology',
        markets: ['Global'],
        audience: ['Oncology Specialists'],
        campaignId: 'DAWN-ONC-2026-0078',
      },
      textAfterSummary:
        'I have completed the intake of campaign requirements. I am now moving on to retrieve the relevant clinical evidence and base documents for this campaign.',
    },
    autoAdvance: true,
  },

  // ─── Step 1: Content Finder ────────────────────────────────────────────────
  {
    id: 'step-1',
    stage: 'finder',
    userMessage: '',
    agentResponse: {
      text: "The evidence curation has highlighted key documents related to Brexiva, focusing on its clinical application in oncology.\n\n• BREXIVA_Clinical Review Report.pdf\n• BREXIVA_Brexiva in Metastatic Breast Cancer- A Clinical Review of Treatment Rationale, Patient Selection, and Evidence Considerations.pdf\n• BREXIVA_Safety Management and Practical Monitoring Considerations for Brexiva-Based Therapy.pdf\n• BREXIVA_Treatment Sequencing and Clinical Decision-Making for Brexiva-Based Therapy.pdf\n• BREXIVA_A Simulated Multicenter Phase II Study Evaluating Efficacy, Safety, and Clinical Applicability in a Global Oncology Population.pdf\n\nThese documents represent a curated subset of the total evidence collected.",
      documentCards: CLINICAL_DOCUMENTS,
    },
    autoAdvance: true,
    thinkingMessage: `Retrieving clinical evidence . . . . .
• Reading requirements — brand Brexiva, plus the user's campaign details.
• Decomposing the search into focused angles: clinical evidence, safety profile, MLR rules, and market context.
• Querying the asset library for every approved document for this brand.
• Re-ranking passages in the vector store to surface the most relevant clinical evidence.

Locating approved templates . . . . . .
• Looking up channel templates for: Congress Poster, Email, Patient Leaflet, Digital Detail Aid.
• Pulling the template family for Brexiva so the campaign can be rendered into compliant layouts.

Outcome — templates ready:
• Approved templates located for 4 channels: Congress Poster, Email, Patient Leaflet, Digital Detail Aid.
• Most-used template per channel marked as recommended.

Outcome — knowledge base assembled:
• 7 clinical, 1 MLR, 1 safety, 1 market-insight documents.
• Scored 7 clinical documents; kept 10 top-ranked passages for the brief.
• Indexed 9 compliance, 12 safety, and 75 market-insight chunks for downstream citation.
• Captured 5 pre-approved images and 1 brand logos for the visual layer.
• Consolidated knowledge base saved for brief and design stages.`,
  },

  // ─── Step 2: Brief Mode Selection ─────────────────────────────────────────
  {
    id: 'step-2',
    stage: 'briefMode',
    userMessage: '',
    agentResponse: {
      text: "Documents retrieved. How would you like to create the campaign brief?",
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
      text: "I acknowledge your choice of MANUAL mode for the brief, and I am now drafting it accordingly.\n",
    },
    triggersModal: 'manualBriefInput',
    autoAdvanceAfterModal: true,
  },

  // ─── Step 3b: Auto Brief Builder ─────────────────────────────────────────
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

  // ─── Step 3d: Pre-MLR Compliance Assets ───────────────────────────────────
  {
    id: 'step-3d',
    stage: 'brief',
    userMessage: '',
    agentResponse: {
      text: 'The campaign focuses on promoting Brexiva within the oncology therapeutic area, targeting oncology specialists globally. Key messages emphasize the importance of understanding patient-reported outcomes and the treatment persistence of Brexiva in metastatic breast cancer, while also addressing safety considerations. Deliverables include an email, patient leaflet, digital detail aid, and a congress poster, all designed to effectively communicate these messages.',
      documentCards: COMPLIANCE_ASSETS,
    },
    autoAdvance: true,
    thinkingMessage: `Drafting the strategic brief . . . . . . .
• Captured filters — brand Brexiva, therapeutic area Oncology, audience oncology specialists, markets global.
• Loaded clinical, safety, and market context from the extracted knowledge base for grounding.
• Anchoring the brief on the stated objective: disease education and treatment awareness, with deliverables limited to the requested deliverables.
• Drafting the core strategic narrative — what the campaign must say, to whom, and why now.

Brief drafted. Opening line: "The campaign for Brexiva will focus on disease education and treatment awareness for metastatic breast cancer, specifically targeting oncology specialists in the global market…"

Building the execution plan . . . . . . .
• Mapping the brief onto each deliverable channel: Email, Patient Leaflet, Digital Detail Aid, Congress Poster.
• Formulating a step-by-step execution plan for 4 channels.
• Distilling the campaign's core key messages and mandatory regulatory inclusions for every asset.

Plan locked . . . . .
• 4 execution steps across 4 channels.
• 4 key message — leading with: "Understanding patient-reported outcomes is crucial for improving treatment strategies.".
• 3 mandatory inclusion(s) — e.g. "Brenova may be associated with hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.".`,
  },

  // ─── Step 4: Template Selection ───────────────────────────────────────────
  {
    id: 'step-4',
    stage: 'templateSelection',
    userMessage: '',
    agentResponse: {
      text: 'I will now pause for you to confirm the template selection before I proceed with producing the asset. Please let me know your choices when you are ready.',
      templateCards: [
        {
          id: 'congress-poster',
          title: 'Congress Poster',
          description: 'Scientific format for clinical data presentation',
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
  },

  // ─── Step 5: Content & Visual Creator (Merged) ────────────────────────────
  {
    id: 'step-5',
    stage: 'creator',
    userMessage: '',
    agentResponse: {
      text: 'I acknowledge the selection of the template for each channel, and I am now producing the asset based on that template.',
      contentAssets: [
        { id: 'poster', title: 'Congress Poster ', persona: 'Clinical Researcher', language: 'EN (US)'},
        { id: 'email', title: 'HCP Email', persona: 'Empathetic Specialist', language: 'EN (US)' },
        { id: 'leaflet', title: 'Patient Leaflet', persona: 'Patient-Friendly', language: 'EN (US)' },
        { id: 'dda', title: 'Digital Detail Aid', persona: 'Innovator HCP', language: 'EN (US)' },
      ],
      imageVariations: [
        {
          id: 'poster',
          title: 'Congress Poster',
          image: '/templates/poster.png',
          description: 'Scientific poster layout with clinical efficacy data',
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
          description: 'Patient-friendly educational leaflet with clear safety info',
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
    thinkingMessage: `
Orchestrator thinking . . . . . .
Orchestrator is reviewing the current source state to determine which specialist agent should be invoked next based on the task requirements and available context.

• Working set — 10 approved source chunks available; target channels: Email, Patient Leaflet, Digital Detail Aid, Congress Poster.
• Source inventory — 10 chunks, previewing the first few:

• BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational Research Manuscript.pdf · Patient Population · p.2 — "[Asset: BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational R…"
• BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational Research Manuscript.pdf · Baseline Characteristics · p.5 — "[Asset: BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational R…"
• BREXIVA_Brexiva in Metastatic Breast Cancer- A Clinical Review of Treatment Rationale, Patient Selection, and Evidence Considerations.pdf · References · p.8 — "[Asset: BREXIVA_Brexiva in Metastatic Breast Cancer- A Clinical Review of Treatment Rationale, Patient Selection, and Evidence Consideratio…"
• BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational Research Manuscript.pdf · Baseline Characteristics · p.4 — "[Asset: BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational R…"
• BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational Research Manuscript.pdf · References · p.10 — "[Asset: BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational R…"
…plus 5 more chunks queued for the Claim Agent.
No claims captured yet — handing the work to the Claim Agent so it can mine the source material first.

Claim Agent thinking . . . . . .
Claim Agent is now active. Scanning approved source material to extract and structure a library of citable, single-sentence facts that will serve as the foundation for content generation

• Inbound source set has 10 chunks to scan for claims.
• Reading every approved chunk and pulling out distinct, verifiable factual claims about the drug.
• Each claim must be one self-contained sentence so downstream agents can cite it without paraphrasing.
Mined 42 verifiable claim(s) from 10 source chunk(s).

Top claim: "The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-base…".

Content Agent thinking . . . . . .
Content Agent is now active. Binding the verified claim library to the selected template and composing the full asset copy, ensuring every statement is grounded in an approved claim.

• Will draft copy for Email, Patient Leaflet, Digital Detail Aid, Congress Poster.
• Assembling a knowledge record that binds the source chunks, the extracted claims, and the chosen template into a single structured payload.
Bound 168 claims and 60 source passages into a knowledge record covering 4 channels: EMAIL, PATIENT LEAFLET, DIGITAL DETAIL AID, CONGRESS POSTER.

Captured template structure (sections, placeholders) so the draft will fit the chosen layout.

• Drafting the actual asset copy from the knowledge record — every line must trace back to an approved claim.
Drafted copy for 4 channels:

• EMAIL — citing 5 approved claim(s).
• PATIENT LEAFLET — citing 6 approved claim(s).
• DIGITAL DETAIL AID — citing 21 approved claim(s).
• CONGRESS POSTER — citing 26 approved claim(s).
Opening line — "Brenova: A New Approach in HR+/HER2- Metastatic Breast Cancer"

Designer Agent thinking . . . . . .
Designer Agent is now active. Taking the drafted copy and rendering it into the chosen template layout, placing approved imagery and finalizing the visual asset for output.

• Design inputs — template family: Classic Scientific Poster.
• Pouring the drafted copy into the selected template structure to produce a rendered HTML draft.
Rendered 4 HTML draft(s):

• EMAIL — laid into "Clinical Focus Email".
• PATIENT LEAFLET — laid into "Friendly Patient Guide".
• DIGITAL DETAIL AID — laid into "Interactive Slides DDA".
• CONGRESS POSTER — laid into "Classic Scientific Poster".
• Resolving image placeholders against the brand's pre-approved asset library and embedding them into the final HTML.
Final asset rendered with approved imagery embedded.

Design pipeline complete — asset is ready for the compliance review.`,
  },

  // ─── Step 6: MLR Review ───────────────────────────────────────────────────
  {
    id: 'step-6',
    stage: 'mlr',
    userMessage: '',
    agentResponse: {
      text: 'Internal MLR screen completed. It identifies flagged claims, explains tier risk, and shows what needs revision. You will receive a notification once the assets are approved.',
      mlrTable: [
        { content_type: 'Congress Poster', final_risk_tier: 'Tier 1', flags_count: 0, status: 'Passed' },
        { content_type: 'Digital Detail Aid', final_risk_tier: 'Tier 2', flags_count: 1, status: 'Pending' },
        { content_type: 'Email', final_risk_tier: 'Tier 1', flags_count: 0, status: 'Passed' },
        { content_type: 'Patient Leaflet', final_risk_tier: 'Tier 2', flags_count: 1, status: 'Pending' },
      ],
      actionButton: {
        label: 'Open MLR Pre-Screen →',
        modal: 'mlrChecker',
      },
      notification: {
        type: 'mlr-approved',
        title: 'MLR Review Approved',
        message: 'All campaign assets have been reviewed and approved.',
        timestamp: '2026-04-10 14:23:00',
        details: {
          approvedAssets: [
            { content_type: 'Congress Poster', final_risk_tier: 'Tier 1', flags_count: 0, status: 'Passed' },
            { content_type: 'Digital Detail Aid', final_risk_tier: 'Tier 2', flags_count: 1, status: 'Flagged' },
            { content_type: 'Email', final_risk_tier: 'Tier 1', flags_count: 0, status: 'Passed' },
            { content_type: 'Patient Leaflet', final_risk_tier: 'Tier 2', flags_count: 1, status: 'Flagged' },
          ],
          approver: 'Sarah Mitchell',
          approvalDate: '2026-04-10',
          comments: 'All claims substantiated. Minor edits applied to poster and DDA for fair balance. All 4 assets ready for distribution.',
        },
      },
    },
    triggersModal: 'mlrChecker',
    autoAdvanceAfterModal: true,
    thinkingMessage: `Compliance review — CONGRESS POSTER
Loaded the CONGRESS POSTER draft asset alongside 42 approved claims.
• MEDICAL check — comparing every numeric, efficacy, population, treatment-setting, demographic, and safety statement against approved claims.
• REGULATORY check — confirming the poster carries the required Boxed Warning and data reference language.
• LEGAL check — verifying trademark symbols, brand presentation, and correct Brexiva / Brenova usage.

Verdict — no compliance issues found:

• 0 issues total — 0 high-severity, 0 minor.
• Distribution by domain: 0 medical, 0 legal, 0 regulatory.
• Top finding: "No medical, regulatory, or legal compliance issues were identified in the Congress Poster asset."
• Risk tier: TIER_1 — asset is compliant and ready for release.

Compliance review — DIGITAL DETAIL AID
Loaded the DIGITAL DETAIL AID draft asset alongside 42 approved claims.
• MEDICAL check — comparing every numeric, efficacy, population, treatment-setting, and safety statement against approved claims.
• REGULATORY check — confirming the asset carries the required Boxed Warning, hematologic toxicity language, and monitoring statements.
• LEGAL check — verifying trademark symbols, brand presentation, and first-use brand formatting on the cover slide.

Verdict — compliance issues found:

• 1 issue total — 0 high-severity, 1 minor.
• Distribution by domain: 0 medical, 1 legal, 0 regulatory.
• Top finding: "The trademark symbol (®) is missing from the first mention of the brand name Brexiva in the cover slide. The affected line is: 'Brexiva: A New Era in HR+/HER2- Metastatic Breast Cancer Treatment.'"
• Risk tier: TIER_2 — minor legal formatting fix required before release.

Compliance review — EMAIL
Loaded the EMAIL draft asset alongside 42 approved claims.
• MEDICAL check — comparing every numeric, efficacy, population, treatment-setting, and safety statement against approved claims.
• REGULATORY check — confirming the asset carries the required Boxed Warning and CBC monitoring language.
• LEGAL check — verifying trademark symbols, brand presentation, and correct Brexiva / Brenova usage.

Verdict — no compliance issues found:

• 0 issues total — 0 high-severity, 0 minor.
• Distribution by domain: 0 medical, 0 legal, 0 regulatory.
• Top finding: "No medical, regulatory, or legal compliance issues were identified in the Email asset."
• Risk tier: TIER_1 — asset is compliant and ready for release.

Compliance review — PATIENT LEAFLET
Loaded the PATIENT LEAFLET draft asset alongside 42 approved claims.
• MEDICAL check — comparing every numeric, efficacy, population, treatment-setting, and safety statement against approved claims.
• REGULATORY check — confirming the asset carries the required Boxed Warning and patient-facing safety language.
• LEGAL check — verifying trademark symbols, brand presentation, and first-use brand formatting.

Verdict — compliance issues found:

• 1 issue total — 0 high-severity, 1 minor.
• Distribution by domain: 0 medical, 1 legal, 0 regulatory.
• Top finding: "The trademark symbol (®) is missing from the first mention of the brand name Brexiva in the header title. The affected line is: 'Brexiva: Your Partner in Managing HR+/HER2- Metastatic Breast Cancer.'"
• Risk tier: TIER_2 — minor legal formatting fix required before release.`,
  },

  // ─── Step 7: Distribution ─────────────────────────────────────────────────
  {
    id: 'step-7',
    stage: 'distribution',
    userMessage: '',
    agentResponse: {
      text: 'All campaign assets have been reviewed. You can now proceed for distribution.',
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
    autoAdvanceAfterModal: true,
  },

  // ─── Step 9: Session Complete ─────────────────────────────────────────────
  {
    id: 'step-9',
    stage: 'effectiveness',
    userMessage: '',
    agentResponse: {
      text: 'Your campaign session is complete. All assets approved, distributed to the DAM platform, and performance metrics captured. Thanks for collaborating with DAWN.',
    },
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
