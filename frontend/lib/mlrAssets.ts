export interface MlrAiInsight {
  label: string;
  text: string;
}

export interface MlrCompositeFeedback {
  domain: string;
  severity: string;
  description: string;
  suggested_fix: string;
  reference_document: string;
}

export interface MlrAssetEvaluation {
  asset_id: string;
  approved: boolean;
  content_type: string;
  status: string;
  final_risk_tier: string;
  flags_count: number;
  substantiation: string;
  content_text: string;
  fair_balance_score: string;
  isi_completeness: boolean;
  puffery_detected: string;
  ai_insights: MlrAiInsight[];
  composite_feedback: MlrCompositeFeedback[];
}

export const BREXIVA_MLR_ASSETS: MlrAssetEvaluation[] = [
  {
    asset_id: 'brexiva-email-001',
    approved: true,
    content_type: 'Email',
    status: 'Passed',
    final_risk_tier: 'Tier 1',
    flags_count: 0,
    substantiation:
      'Indication for HR+/HER2- metastatic breast cancer is correctly stated. Clinical evidence and patient population data align with prescribing information.',
    content_text: `
Brexiva: A New Approach in Oncology
Brenova is an investigational therapeutic concept associated with the Brexiva brand for HR+/HER2- metastatic breast cancer. Brexiva is indicated for HR+/HER2- metastatic breast cancer. Clinical evidence supports the efficacy of Brexiva in this patient population. Understanding treatment rationale and patient selection is crucial for optimal outcomes. Oncology specialists should consider Brexiva as a treatment option in their practice.
The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments. In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, while 27.6% were in the fourth or later metastatic setting. Notably, 52.8% of patients had endocrine-sensitive disease, and 47.2% had endocrine-resistant disease.
Brenova may be associated with hematologic toxicity, including neutropenia, anemia, thrombocytopenia, or other blood-count abnormalities. Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, thrombocytopenia.
- Trigger / Setting: During treatment with Brenova.
- Action for HCP: Consider complete blood count assessment before and during therapy.
- Monitoring: Monitor for signs of hematologic toxicity.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Patient Population: Adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
- Endocrine-sensitive disease: 52.8%.
- Endocrine-resistant disease: 47.2%.
    `,
    fair_balance_score: '88',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Strong Regulatory Alignment',
        text: 'The asset includes a BOXED WARNING, ensuring compliance with safety regulations.',
      },
      {
        label: 'Efficacy and Safety Balance',
        text: 'Consider enhancing the safety section to improve the fair balance score.',
      },
      {
        label: 'Clear Target Audience',
        text: 'The content effectively addresses the intended audience of oncologists and breast cancer specialists.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'The draft states patient cohort percentages without providing the total cohort size context.',
        suggested_fix: 'Include the total number of patients in the Brenova-Based Therapy Cohort for better context.',
        reference_document: 'Clinical Review Report',
      },
    ],
  },
  {
    asset_id: 'brexiva-dda-001',
    approved: true,
    content_type: 'Digital Detail Aid',
    status: 'Pending',
    final_risk_tier: 'Tier 1',
    flags_count: 0,
    substantiation:
      'Patient selection criteria and demographic data are accurately presented. Safety monitoring recommendations align with prescribing information.',
    content_text: `
Brexiva®: A Targeted Treatment for HR+/HER2- Metastatic Breast Cancer
Brexiva® offers a targeted treatment option for HR+/HER2- metastatic breast cancer.
Understanding patient selection criteria is crucial for optimizing treatment outcomes with Brexiva®.
34.3% of patients in the Brenova-Based Therapy Cohort were in the third-line metastatic setting.
52.8% of patients had endocrine-sensitive disease, enhancing treatment efficacy.
Regular monitoring for hematologic toxicity is essential during treatment with Brexiva®.
The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments. Patients with rapidly progressive disease requiring immediate cytotoxic chemotherapy were not included in the primary simulated cohort. Patients with stable treated central nervous system disease were permitted if symptoms were controlled and functional assessment could be completed reliably.
In the Brenova-Based Therapy Cohort, 99.0% of patients are female, with a median age of 58 years. 31.8% of patients are aged 65 years or older. 69.6% of patients have prior exposure to a CDK4/6 inhibitor, indicating a complex treatment history.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: During treatment with Brenova.
- Action for HCP: Complete blood count assessment before and periodically during therapy.
- Monitoring: Signs/symptoms of hematologic toxicity.
DATA REFERENCES:
- Third-line metastatic setting: 34.3%
- Endocrine-sensitive disease: 52.8%
- Median age: 58 years
- Age ≥65 years: 31.8%
- Female: 99.0%
- Prior CDK4/6 inhibitor exposure: 69.6%
    `,
    fair_balance_score: '82',
    isi_completeness: false,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Missing ISI Content',
        text: 'Ensure that the Important Safety Information (ISI) section is completed with relevant safety findings.',
      },
      {
        label: 'Data Presentation Improvement',
        text: 'Consider providing clearer context for the statistics presented in the Data References section.',
      },
      {
        label: 'Clarify Key Messages',
        text: 'Enhance the clarity of the Key Message section to ensure it effectively communicates the treatment\'s benefits.',
      },
    ],
    composite_feedback: [
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: 'The Important Safety Information (ISI) section is incomplete and requires additional safety information.',
        suggested_fix: 'Complete the ISI section with all relevant safety warnings and precautions.',
        reference_document: 'Prescribing Information',
      },
    ],
  },
  {
    asset_id: 'brexiva-poster-001',
    approved: true,
    content_type: 'Congress Poster',
    status: 'Pending',
    final_risk_tier: 'Tier 1',
    flags_count: 0,
    substantiation:
      'Patient-reported outcomes study with clear objectives and patient cohort demographics. Safety monitoring recommendations appropriately referenced.',
    content_text: `
Poster Title: Patient-Reported Outcomes and Treatment Persistence with Brenova-Based Therapy Under the Brexiva Brand in HR+/HER2- Metastatic Breast Cancer
Background: HR+/HER2- metastatic breast cancer represents a significant clinical challenge, necessitating effective treatment strategies that consider patient-specific factors. Understanding the latest evidence and treatment rationale is crucial for effective management.
Objectives: The primary objective of this study is to evaluate patient-reported outcomes and treatment persistence associated with Brenova-based therapy in a global cohort of patients with HR+/HER2- metastatic breast cancer. Secondary objectives include assessing the impact of treatment on quality of life and identifying factors influencing treatment adherence.
Methods: This observational study utilized a simulated cohort of adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments. Patients with rapidly progressive disease requiring immediate cytotoxic chemotherapy were excluded from the primary cohort.
Results: In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, while 27.6% were in the fourth or later metastatic setting. Additionally, 52.8% of patients had endocrine-sensitive disease, and 47.2% had endocrine-resistant disease. The median age of patients in this cohort is 58 years, with 31.8% aged 65 years or older. Notably, 99.0% of patients are female, and 55.2% have visceral metastases. Safety guidelines must be adhered to, including monitoring for hematologic toxicity, as Brenova may be associated with adverse reactions such as neutropenia and anemia.
Key Result Highlight: Brenova is indicated for the treatment of HR+/HER2- metastatic breast cancer, emphasizing the importance of patient selection criteria for optimizing treatment outcomes.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: During treatment with Brenova.
- Action for HCP: Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
- Monitoring: Signs/symptoms of hematologic toxicity or complications such as febrile neutropenia.
DATA REFERENCES:
- Indication: HR+/HER2- Metastatic Breast Cancer
- Patient Population: Adults with HR+/HER2- metastatic breast cancer
- Median Age: 58 years
- Age ≥65 years: 31.8%
- Female: 99.0%
- Third-line Metastatic Setting: 34.3%
- Fourth or Later Metastatic Setting: 27.6%
- Endocrine-sensitive Disease: 52.8%
- Endocrine-resistant Disease: 47.2%
    `,
    fair_balance_score: '85',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Strong Regulatory Alignment',
        text: 'The draft includes appropriate safety information regarding hematologic toxicity associated with Brenova.',
      },
      {
        label: 'Clear Objectives Section',
        text: 'The objectives are well-defined and align with the approved claims regarding patient-reported outcomes.',
      },
      {
        label: 'Effective Use of Data',
        text: 'The results section accurately reflects the approved claims data for the Brenova-Based Therapy Cohort.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'The poster presents demographic percentages without context of total cohort size.',
        suggested_fix: 'Include the total number of patients in the cohort (324) for better context.',
        reference_document: 'Clinical Study Report',
      },
    ],
  },
  {
    asset_id: 'brexiva-leaflet-001',
    approved: true,
    content_type: 'Patient Leaflet',
    status: 'Pending',
    final_risk_tier: 'Tier 1',
    flags_count: 3,
    substantiation:
      'Patient-friendly language appropriately communicates indication and safety information. BOXED WARNING included for regulatory compliance.',
    content_text: `
Patient Leaflet Title Placeholder
Brexiva: A Targeted Treatment for HR+/HER2- Metastatic Breast Cancer
Welcome to this patient information leaflet about Brexiva. This document is designed to help you understand what Brexiva is, how it works, and what to expect during your treatment. We want to provide you with clear and helpful information so you can feel confident in your care.
Brexiva is indicated for HR+/HER2- metastatic breast cancer, providing a targeted treatment option. This type of breast cancer is often managed with a combination of therapies, and understanding the treatment rationale and patient selection criteria is crucial for effective therapy. Many patients achieve disease control with endocrine therapy combinations, but resistance can develop over time. This means that the same treatment may not work for everyone, and doctors often consider various factors when deciding on the best approach for each patient.
In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, and 27.6% were in the fourth or later metastatic setting. Additionally, 52.8% of patients had endocrine-sensitive disease, while 47.2% had endocrine-resistant disease. This information helps doctors tailor treatment plans to individual needs.
It's important to monitor your health during treatment. Safety monitoring, including complete blood count assessments, is essential due to potential hematologic toxicity. This means that your doctor will check your blood regularly to ensure your body is responding well to the treatment and to catch any issues early. If you experience any unusual symptoms, be sure to communicate with your healthcare team.
We hope this leaflet has provided you with valuable information about Brexiva and what to expect during your treatment journey. Remember, your healthcare team is here to support you every step of the way.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: During treatment with Brenova.
- Action for HCP: Monitor complete blood count and consider treatment interruption for significant toxicity.
- Monitoring: Watch for signs of hematologic toxicity and complications.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
- Endocrine-sensitive disease: 52.8%.
- Endocrine-resistant disease: 47.2%.
    `,
    fair_balance_score: '78',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Trademark Fix Needed',
        text: 'Add the trademark symbol (®) after the first mention of \'Brexiva\'.',
      },
      {
        label: 'Missing Context (Patient Data)',
        text: 'Include the total number of patients in the Brenova-Based Therapy Cohort (324) to provide context for the percentages.',
      },
      {
        label: 'Safety Warning Inclusion',
        text: 'Include the phrase \'BOXED WARNING\' in the Important Safety Information section.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'The draft mentions that 34.3% of patients were in the third-line metastatic setting, which is correct, but it does not provide the context of the total number of patients in the Brenova-Based Therapy Cohort, which is 324. This could lead to misinterpretation of the data without the total cohort size being mentioned.',
        suggested_fix: 'Include the total number of patients in the Brenova-Based Therapy Cohort (324) to provide context for the percentages.',
        reference_document: '[DOC_000447_p005_c0012_C1] In the Brenova-Based Therapy Cohort of 324 patients, 151 patients (46.6%) had a moderate circulating tumor DNA-style signal.',
      },
      {
        domain: 'LEGAL',
        severity: 'MINOR',
        description: 'The brand name \'Brexiva\' is presented without the required trademark symbol (®) on its first mention in the document. According to the legal context, the trademark symbol is necessary for brand presentation.',
        suggested_fix: 'Add the trademark symbol (®) after the first mention of \'Brexiva\'.',
        reference_document: '[Asset Type - C. Regulatory Analysis] EXACT LINE: The regulatory structure is centered on global campaign governance.',
      },
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: 'The draft does not explicitly mention the phrase \'BOXED WARNING\', which is a critical safety warning that should be included in the Important Safety Information section.',
        suggested_fix: 'Include the phrase \'BOXED WARNING\' in the Important Safety Information section.',
        reference_document: '[Asset Type - 5. Hematologic Toxicity] EXACT LINE: Brenova may be associated with hematologic toxicity, including neutropenia, anemia, thrombocytopenia, or other blood-count abnormalities.',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Template 01 – Friendly Patient Guide
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-leaflet-template-01',
    approved: true,
    content_type: 'Patient Leaflet',
    status: 'Pending',
    final_risk_tier: 'Tier 2',
    flags_count: 2,
    substantiation:
      'Patient-friendly language appropriately communicates indication and safety information. Cohort statistics are correctly referenced. BOXED WARNING included for regulatory compliance.',
    content_text: `
Brexiva®: Your Partner in Managing HR+/HER2- Metastatic Breast Cancer
Welcome to this patient information leaflet about Brexiva®. Here, you will find important information about this treatment option for HR+/HER2- metastatic breast cancer. Our goal is to help you understand how Brexiva® works and what to expect during your treatment journey.
Understanding Brexiva®
Brexiva® is indicated for the treatment of HR+/HER2- metastatic breast cancer, providing a targeted therapeutic option. This means that Brexiva® is designed to specifically target the cancer cells in your body, which can help improve your treatment outcomes.
Patient Selection and Treatment
Understanding the nuances of patient selection is critical for optimizing treatment outcomes in HR+/HER2- metastatic breast cancer. Your healthcare team will consider various factors about your health and cancer to determine if Brexiva® is the right choice for you.
In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, and 27.6% were in the fourth or later metastatic setting. This shows that Brexiva® can be used at different stages of treatment, depending on your specific situation.
Communication with Your Healthcare Team
As you begin your treatment with Brexiva®, it's important to communicate openly with your healthcare team. They will help you understand the goals of therapy, what to expect, and how to manage any side effects you may experience. Remember, you are not alone in this journey, and your healthcare team is here to support you every step of the way.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: During treatment with Brexiva®.
- Action for HCP: Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
- Monitoring: Regular monitoring for hematologic toxicity is essential.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
    `,
    fair_balance_score: '76',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Missing Cohort Size Context',
        text: 'The percentage statistics (34.3%, 27.6%) are presented without stating the total cohort size of 324 patients, which may lead to misinterpretation.',
      },
      {
        label: 'Trademark Consistency',
        text: 'Ensure \'Brexiva®\' consistently carries the registered trademark symbol on all prominent mentions throughout the leaflet.',
      },
      {
        label: 'Patient-Friendly Tone',
        text: 'The language is appropriately accessible for a patient audience and aligns well with the intended communication goals.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'Cohort percentages (34.3% third-line, 27.6% fourth-line or later) are cited without mentioning the total Brenova-Based Therapy Cohort size of 324 patients, which is necessary for proper context.',
        suggested_fix: 'Add the total cohort size: "In the Brenova-Based Therapy Cohort (N=324), 34.3% of patients were in the third-line metastatic setting..."',
        reference_document: 'Clinical Study Report',
      },
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: 'The Important Safety Information section does not include the explicit heading "BOXED WARNING", which is required to highlight critical safety risks.',
        suggested_fix: 'Add "BOXED WARNING:" as a clearly visible heading within the ISI section.',
        reference_document: 'Prescribing Information',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Template 02 – Step-by-Step Guide
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-leaflet-template-02',
    approved: true,
    content_type: 'Patient Leaflet',
    status: 'Pending',
    final_risk_tier: 'Tier 2',
    flags_count: 2,
    substantiation:
      'Step-by-step format is patient-friendly and logically structured. Safety monitoring and blood count requirements are correctly communicated. Indication is accurately stated.',
    content_text: `
Step-by-Step Guide to Using Brexiva®
This guide helps you understand how to use Brexiva® for treating HR+/HER2- metastatic breast cancer effectively.
Step 1: Understand Your Condition
Before starting treatment, it's important to know that Brexiva® is indicated for HR+/HER2- metastatic breast cancer. This means it's designed to help manage a specific type of breast cancer that has spread beyond the breast.
Step 2: Discuss Patient Selection Criteria
Talk with your oncologist about the patient selection criteria. Understanding these criteria is crucial for optimal treatment outcomes. This includes knowing if you have documented metastatic disease and an ECOG performance status of 0 to 2. Make sure to ask your doctor any questions you have about your eligibility for Brexiva®.
Step 3: Follow Safety Guidelines
Adhere to safety guidelines, including monitoring for hematologic toxicity. This means your doctor will check your blood counts regularly to ensure your body is handling the treatment well. Possible side effects may include fatigue, nausea, and changes in blood counts.
Step 4: Communicate with Your Healthcare Team
Effective communication between you and your oncologist is essential for informed decision-making. Discuss any side effects you experience and any concerns you have about your treatment.
After following these steps, you should feel more prepared to start your treatment with Brexiva®. Remember to keep in touch with your healthcare team throughout your journey.
Frequently Asked Questions
- What should I do if I experience side effects? Contact your healthcare provider immediately. They can help manage any issues that arise.
- How often will I need to have my blood checked? Your doctor will determine the frequency based on your treatment plan and any side effects you experience.
- Can I take other medications while on Brexiva®? Always inform your healthcare provider about any other medications you are taking, as some may interact with Brexiva®.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: Before and during treatment with Brexiva®.
- Action for HCP: Monitor complete blood counts regularly.
- Monitoring: Watch for signs of hematologic toxicity and complications.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Eligibility criteria: Documented metastatic disease, ECOG performance status 0–2.
    `,
    fair_balance_score: '80',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Clear Step Structure',
        text: 'The four-step format effectively guides patients through the treatment process in an accessible, logical sequence.',
      },
      {
        label: 'FAQ Section Adds Value',
        text: 'The FAQ section addresses common patient concerns and supports informed decision-making, but clinical accuracy of answers should be verified against prescribing information.',
      },
      {
        label: 'Safety Monitoring Well Communicated',
        text: 'Step 3 accurately conveys the need for regular complete blood count monitoring in plain language appropriate for patients.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'Step 3 mentions "fatigue, nausea, and changes in blood counts" as possible side effects; however, fatigue and nausea are not explicitly listed in the approved BOXED WARNING or substantiated in the provided clinical data.',
        suggested_fix: 'Restrict listed side effects to those in the prescribing information: neutropenia, anemia, and thrombocytopenia.',
        reference_document: 'Prescribing Information',
      },
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: 'The FAQ answer implies drug-drug interactions ("some may interact with Brexiva®") without substantiation in the provided reference documents.',
        suggested_fix: 'Reword to: "Always inform your healthcare provider about any other medications you are taking so they can advise you appropriately." Remove the unsubstantiated interaction claim.',
        reference_document: 'Prescribing Information',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Template 03 – Foldable Brochure
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-leaflet-template-03',
    approved: true,
    content_type: 'Patient Leaflet',
    status: 'Pending',
    final_risk_tier: 'Tier 1',
    flags_count: 1,
    substantiation:
      'Foldable brochure format is appropriate for patient-facing distribution. Indication, mechanism, safety monitoring, and support information are accurately represented. ISI section present.',
    content_text: `
Brexiva® Patient Information Leaflet
Welcome to this patient information brochure about Brexiva®. Here, you will find important details about your treatment for HR+/HER2- metastatic breast cancer.
About This Treatment
Brexiva® is a targeted treatment option specifically designed for patients with HR+/HER2- metastatic breast cancer. It aims to help manage your condition effectively, especially if you have already undergone prior endocrine-based treatment.
How It Works
Brexiva® works by targeting specific pathways involved in the growth of cancer cells. This helps to slow down or stop the progression of the disease, allowing for better management of your health.
- Targeting specific pathways involved in cancer cell growth.
- Slowing down or stopping disease progression.
- Allowing for better management of health.
What to Expect
During your treatment with Brexiva®, you can expect regular monitoring to ensure the therapy is working effectively. Your healthcare provider will discuss the goals of therapy with you, including how to manage any side effects that may arise. It's important to communicate openly about your symptoms and any concerns you may have.
- Regular monitoring of therapy effectiveness.
- Discussion of therapy goals with your healthcare provider.
- Management of potential side effects.
- Open communication about symptoms and concerns.
Important Information
As with any treatment, there are important safety guidelines to follow. Brexiva® may be associated with hematologic toxicity, which includes conditions like neutropenia and anemia. Your healthcare provider will recommend complete blood count assessments before starting treatment and periodically during therapy to monitor your health.
- Hematologic toxicity, including neutropenia and anemia.
- Complete blood count assessments before and during treatment.
- Monitoring for signs of hematologic toxicity.
Your Questions Answered
If you have questions about your treatment, it's essential to talk to your healthcare provider. They can provide you with personalized information and support based on your specific situation.
Support & Resources
There are various resources available to support you during your treatment journey. Your healthcare team can guide you to helpful materials and support groups that can provide additional information and encouragement.
- Helpful materials provided by your healthcare team.
- Support groups for additional information.
- Encouragement throughout your treatment journey.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia and anemia.
- Trigger / Setting: During treatment with Brexiva®.
- Action for HCP: Monitor complete blood counts before and during treatment.
- Monitoring: Watch for signs of hematologic toxicity.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Prior treatment context: Prior endocrine-based treatment.
    `,
    fair_balance_score: '83',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Incomplete BOXED WARNING',
        text: 'The BOXED WARNING omits thrombocytopenia from the list of hematologic toxicities, which is included in the approved prescribing information.',
      },
      {
        label: 'Well-Structured Patient Sections',
        text: 'The six-section layout (About, How It Works, What to Expect, Important Information, Q&A, Support) provides a comprehensive and logical patient journey.',
      },
      {
        label: 'Mechanism Description Requires Review',
        text: 'The "How It Works" section describes targeting "specific pathways involved in cancer cell growth" — this should be verified against the approved mechanism-of-action language.',
      },
    ],
    composite_feedback: [
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: 'The BOXED WARNING lists only "neutropenia and anemia" but omits thrombocytopenia, which is explicitly required per the prescribing information and included in all other asset versions.',
        suggested_fix: 'Update the BOXED WARNING to read: "Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia."',
        reference_document: 'Prescribing Information',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Template 05 – Treatment Diary
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-leaflet-template-05',
    approved: true,
    content_type: 'Patient Leaflet',
    status: 'Pending',
    final_risk_tier: 'Tier 2',
    flags_count: 2,
    substantiation:
      'Treatment diary format supports patient engagement and self-monitoring. Safety information is appropriately included. The investigational nature of Brenova under the Brexiva® brand is correctly disclosed.',
    content_text: `
Treatment Diary — Brexiva® / Brenova
Subtitle encouraging patients to track their treatment journey.
How to Use This Diary
This diary is designed to help you keep track of your treatment journey with Brenova, a medication used for HR+/HER2- metastatic breast cancer. It's important to note that Brenova is an investigational therapeutic concept associated with the Brexiva® brand. This means it is still being studied to understand its full benefits and how it works best for patients like you.
1. Record Your Experiences
As you go through your treatment, use this diary to record your experiences, any side effects you notice, and how you feel overall. This information can be very helpful for you and your healthcare team to make the best decisions about your care.
2. Monitor for Hematologic Toxicity
Regular monitoring for hematologic toxicity is essential during treatment with Brexiva®. Brenova may be associated with hematologic toxicity, including neutropenia, anemia, and thrombocytopenia. Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
3. Understand Treatment Rationale
Understanding treatment rationale and patient selection is crucial for optimizing outcomes in metastatic breast cancer management. This means that knowing why a certain treatment is chosen and who it is best for can help improve your results.
4. Stay Connected with Your Healthcare Team
As you fill out this diary, remember that you are not alone in this journey. Your healthcare team is here to support you, and they want to hear about your experiences. Keeping track of your treatment can help them provide the best care possible.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: During treatment with Brenova.
- Action for HCP: Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
- Monitoring: Watch for signs of hematologic toxicity.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Brand association: Brenova is an investigational therapeutic concept associated with the Brexiva® brand.
    `,
    fair_balance_score: '79',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Investigational Status Disclosure',
        text: 'The diary correctly discloses that Brenova is an investigational therapeutic concept associated with the Brexiva® brand, which is important for patient transparency.',
      },
      {
        label: 'Diary Subtitle Placeholder Not Resolved',
        text: '"Subtitle encouraging patients to track their treatment journey." remains as unresolved placeholder text and must be replaced with final copy before publication.',
      },
      {
        label: 'Safety Section is Complete',
        text: 'The BOXED WARNING and monitoring instructions for hematologic toxicity are fully and accurately included.',
      },
    ],
    composite_feedback: [
      {
        domain: 'REGULATORY',
        severity: 'MAJOR',
        description: 'The subtitle field reads "Subtitle encouraging patients to track their treatment journey." — this is unresolved placeholder copy that must not appear in the published asset.',
        suggested_fix: 'Replace the placeholder subtitle with approved final copy, e.g., "Track your symptoms, monitor your health, and stay connected with your care team."',
        reference_document: 'Content Review Checklist',
      },
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'Section 3 ("Understand Treatment Rationale") states the importance of treatment rationale but does not reference any specific clinical data or criteria, which may leave patients without actionable context.',
        suggested_fix: 'Consider adding specific patient selection criteria (e.g., documented metastatic disease, ECOG performance status 0–2) to make this section more informative.',
        reference_document: 'Prescribing Information',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // DDA Template 02 – Tabbed Sidebar DDA
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-dda-template-02',
    approved: true,
    content_type: 'Digital Detail Aid',
    status: 'Pending',
    final_risk_tier: 'Tier 1',
    flags_count: 1,
    substantiation:
      'Tabbed navigation covers Overview, Mechanism, Safety, and Summary. Indication, cohort statistics, and safety monitoring requirements are accurately represented. ISI section present.',
    content_text: `
BREXIVA — Digital Detail Aid (Tabbed Sidebar)
Overview
Brexiva® is indicated for HR+/HER2- metastatic breast cancer, providing a targeted treatment option.
- 34.3% of patients were in the third-line metastatic setting.
- 27.6% of patients were in the fourth or later metastatic setting.
- 52.8% of patients had endocrine-sensitive disease.
Understanding the therapeutic rationale and patient selection criteria is crucial for effective treatment planning.
Mechanism of Action
Brenova works by targeting specific pathways involved in cancer cell growth and survival.
- Target Pathway: Brenova inhibits pathways that promote tumor proliferation in HR+/HER2- breast cancer.
- Downstream Effect: This inhibition leads to reduced tumor growth and improved patient outcomes.
Key takeaway: Brenova offers a targeted approach to managing HR+/HER2- metastatic breast cancer.
Important Safety Information (ISI)
Regular monitoring for hematologic toxicity is essential during treatment with Brexiva.
Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: During treatment with Brenova.
- Action for HCP: Complete blood count assessment before and during therapy.
- Monitoring: Signs/symptoms of hematologic toxicity.
Summary
Brenova is a promising option for patients with HR+/HER2- metastatic breast cancer.
- Key Point 1: Effective patient selection and monitoring are critical for optimal outcomes.
- Key Point 2: Understanding the treatment rationale enhances clinical decision-making.
- Key Point 3: Addressing potential adverse reactions is vital for patient safety.
- Key Point 4: Continuous evaluation of treatment efficacy is necessary for long-term management.
Final Key Message: Brexiva provides a targeted treatment option for HR+/HER2- metastatic breast cancer, emphasizing the importance of monitoring and patient selection.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
- Endocrine-sensitive disease: 52.8%.
    `,
    fair_balance_score: '84',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Mechanism Claims Need Substantiation',
        text: 'The MOA tab describes Brenova as inhibiting "pathways that promote tumor proliferation" — this should be verified against the approved mechanism-of-action language in the prescribing information.',
      },
      {
        label: 'Strong Multi-Tab Structure',
        text: 'The four-tab layout (Overview, Mechanism, Safety, Summary) provides a logical flow for HCP-facing detail aid content.',
      },
      {
        label: 'Cohort Size Context Missing',
        text: 'Statistics in the Overview tab are presented without the total cohort size (N=324), which is required for proper data context.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'Cohort statistics (34.3%, 27.6%, 52.8%) in the Overview tab are presented without the total Brenova-Based Therapy Cohort size of 324 patients.',
        suggested_fix: 'Add "(N=324)" after the first reference to the Brenova-Based Therapy Cohort in the Overview tab.',
        reference_document: 'Clinical Study Report',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // DDA Template 04 – Card Carousel DDA
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-dda-template-04',
    approved: true,
    content_type: 'Digital Detail Aid',
    status: 'Pending',
    final_risk_tier: 'Tier 2',
    flags_count: 2,
    substantiation:
      'Card carousel format presents Overview, MOA, Efficacy, and ISI across four navigable cards. Indication and cohort statistics are correctly stated. Safety information aligned with prescribing information.',
    content_text: `
BREXIVA — Digital Detail Aid (Card Carousel)
Card 1 — Overview
Brexiva is indicated for the treatment of HR+/HER2- metastatic breast cancer.
Card 2 — MOA
Brenova is an investigational therapeutic concept associated with the Brexiva brand. Brenova-based therapy is designed for adults with HR+/HER2- metastatic breast cancer who have undergone prior endocrine-based treatment. Oncology specialists should consider Brexiva as a viable option in their treatment protocols. Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
Card 3 — Efficacy
Clinical data supports Brexiva's efficacy and safety profile in the target patient population.
- 34.3% of patients in the Brenova-Based Therapy Cohort were in the third-line metastatic setting.
- 27.6% of patients were in the fourth or later metastatic setting.
- Patient-reported outcomes indicate positive treatment persistence with Brexiva.
- 52.8% of patients had endocrine-sensitive disease.
- 47.2% of patients had endocrine-resistant disease.
Card 4 — ISI (Important Safety Information)
Brenova may be associated with hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: Before and during Brenova treatment.
- Action for HCP: Consider complete blood count assessment.
- Monitoring: Monitor for signs of hematologic toxicity.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
- Endocrine-sensitive disease: 52.8%.
- Endocrine-resistant disease: 47.2%.
    `,
    fair_balance_score: '81',
    isi_completeness: true,
    puffery_detected: 'Minor',
    ai_insights: [
      {
        label: 'Puffery Risk in Efficacy Card',
        text: '"Patient-reported outcomes indicate positive treatment persistence" lacks a specific data point and reads as a promotional claim. A concrete statistic should be added or the statement removed.',
      },
      {
        label: 'Cohort Size Missing',
        text: 'The Efficacy card presents multiple percentages without providing the total cohort size of 324 patients for context.',
      },
      {
        label: 'ISI Card Placement',
        text: 'Placing the ISI as the final card in a carousel risks reduced visibility. Ensure it is accessible and not buried behind interaction.',
      },
    ],
    composite_feedback: [
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: '"Patient-reported outcomes indicate positive treatment persistence with Brexiva" is an unsubstantiated promotional claim with no specific data point or reference.',
        suggested_fix: 'Replace with a specific substantiated statistic, or remove the claim entirely.',
        reference_document: 'Clinical Study Report',
      },
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'Efficacy card percentages are presented without the total Brenova-Based Therapy Cohort size (N=324).',
        suggested_fix: 'Add cohort size context: "In the Brenova-Based Therapy Cohort (N=324), 34.3% of patients..."',
        reference_document: 'Clinical Study Report',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // DDA Template 05 – Fullscreen Immersive DDA
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-dda-template-05',
    approved: true,
    content_type: 'Digital Detail Aid',
    status: 'Pending',
    final_risk_tier: 'Tier 2',
    flags_count: 2,
    substantiation:
      'Fullscreen immersive format covers unmet need, solution, clinical evidence, and ISI across five sections. Cohort size (N=324) is explicitly stated. Safety profile and monitoring requirements are comprehensively included.',
    content_text: `
BREXIVA — Digital Detail Aid (Fullscreen Immersive)
Brexiva in HR+/HER2- Metastatic Breast Cancer
Brexiva offers a targeted treatment option for HR+/HER2- metastatic breast cancer. Brexiva is indicated for HR+/HER2- metastatic breast cancer, providing oncologists with a targeted treatment option.
Section 1 — The Unmet Need
Current treatment options for HR+/HER2- metastatic breast cancer often fall short, leaving patients with limited choices. Patients face challenges with treatment persistence and managing adverse effects, impacting their quality of life. 34.3% of patients were in the third-line metastatic setting, highlighting the need for effective therapies in later lines. The treatment landscape for metastatic breast cancer is evolving, yet many patients still experience disease progression after initial therapies.
Section 2 — The Solution: Brexiva's Role in Treatment
Brexiva addresses the unmet need by providing a targeted approach for patients with HR+/HER2- metastatic breast cancer.
- Benefit: Brexiva enhances treatment options for oncologists managing complex cases.
- Benefit 1: Clinical data supports Brexiva's efficacy and safety profile, essential for informed treatment decisions.
- Benefit 2: Patient-reported outcomes indicate high treatment persistence with Brexiva, enhancing patient management strategies.
Section 3 — Clinical Evidence
The Brenova-Based Therapy Cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment.
- In the Brenova-Based Therapy Cohort of 324 patients, 151 patients (46.6%) had a moderate circulating tumor DNA-style signal.
- 27.6% of patients were in the fourth or later metastatic setting.
- 52.8% of patients had endocrine-sensitive disease.
The global oncology population represented in the study underscores the broad applicability of Brexiva.
Section 4 — Important Safety Information (ISI) Profile
Complete blood count assessment should be considered before treatment initiation and periodically during therapy. Brenova may be associated with hematologic toxicity, including neutropenia, anemia, and thrombocytopenia. Consider in patients with significant baseline cytopenias or prior intensive anticancer therapy. Treatment delay, interruption, or discontinuation may be considered for clinically meaningful hematologic toxicity. Patients with uncontrolled infection, clinically significant cardiac instability, or unresolved severe toxicity from prior therapy are excluded.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Total cohort: N=324.
- Moderate ctDNA-style signal: 151 patients (46.6%).
- Fourth or later metastatic setting: 27.6%.
- Endocrine-sensitive disease: 52.8%.
- Third-line metastatic setting: 34.3%.
    `,
    fair_balance_score: '86',
    isi_completeness: true,
    puffery_detected: 'Minor',
    ai_insights: [
      {
        label: 'Puffery Risk in Solution Section',
        text: '"Patient-reported outcomes indicate high treatment persistence with Brexiva" is a promotional claim without a specific substantiated data point.',
      },
      {
        label: 'Cohort Size Correctly Cited',
        text: 'This template is the only DDA to explicitly state the total cohort size (N=324), which is best practice and should be replicated in other assets.',
      },
      {
        label: 'Comprehensive ISI Profile',
        text: 'The ISI section goes beyond the boxed warning to include exclusion criteria and management guidance, providing strong regulatory balance.',
      },
    ],
    composite_feedback: [
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: '"Patient-reported outcomes indicate high treatment persistence with Brexiva" is an unsubstantiated promotional claim. No specific data point is provided to support "high treatment persistence".',
        suggested_fix: 'Replace with a specific substantiated statistic from the approved data references, or remove the claim.',
        reference_document: 'Clinical Study Report',
      },
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: 'The BOXED WARNING heading is absent from this asset\'s ISI section, though the safety content is present.',
        suggested_fix: 'Add an explicit "BOXED WARNING:" heading to the ISI section to meet regulatory visibility requirements.',
        reference_document: 'Prescribing Information',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // DDA Template – Interactive Slides DDA
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-dda-interactive-slides',
    approved: true,
    content_type: 'Digital Detail Aid',
    status: 'Pending',
    final_risk_tier: 'Tier 1',
    flags_count: 1,
    substantiation:
      'Six-slide interactive format covers indication, patient selection, pre/during treatment checklist, BOXED WARNING, and ISI demographics. All cohort statistics and eligibility criteria align with prescribing information.',
    content_text: `
BREXIVA — Interactive Slides DDA
Slide 01
Brexiva®: Transforming Treatment for HR+/HER2- Metastatic Breast Cancer
Brexiva® is indicated for the treatment of HR+/HER2- metastatic breast cancer. Understanding the scientific rationale behind Brexiva's use is crucial for effective patient management.
Patient Selection Statistics:
- 34.3% — Third-line metastatic setting.
- 27.6% — Fourth or later metastatic setting.
- 52.8% — Endocrine-sensitive disease.
Monitoring for hematologic toxicity is necessary during treatment with Brexiva.
Key Message: Proper patient selection is essential for optimizing treatment outcomes with Brexiva.
Cohort Details:
The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments.
Before and During Brenova® Treatment — HCP Checklist:
- Review of hypersensitivity history.
- Baseline clinical assessment and medication review.
- Complete blood count monitoring.
- Liver function test monitoring.
- Pregnancy status assessment when applicable.
- Infection screening and symptom review.
- Evaluation of concomitant myelosuppressive or hepatotoxic therapies.
- Documentation of adverse events and management actions.
- Treatment interruption or discontinuation assessment when clinically required.
BOXED WARNING:
1. Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
2. Trigger / Setting: During treatment with Brenova.
3. Action for HCP: Monitor complete blood count before and during therapy.
4. Monitoring: Signs/symptoms of hematologic toxicity.
Important Safety Information (ISI) — Demographics:
- Median age: 58 years (range 31–81).
- Age ≥65 years: 31.8%.
- Female: 99.0%.
- ECOG PS 0: 44.1%; ECOG PS 1: 46.2%.
- Visceral metastases: 55.2%.
- Bone metastases: 71.0%.
- Endocrine-resistant disease: 47.2%.
- Endocrine-sensitive disease: 52.8%.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Median age: 58 years.
- Age ≥65 years: 31.8%.
- Female: 99.0%.
- ECOG PS 0: 44.1%; ECOG PS 1: 46.2%.
- Visceral metastases: 55.2%.
- Bone metastases: 71.0%.
    `,
    fair_balance_score: '89',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Most Comprehensive DDA Asset',
        text: 'This is the most data-rich DDA, including a full HCP checklist, demographic ISI data, and a clearly structured BOXED WARNING — strong regulatory alignment.',
      },
      {
        label: 'Cohort Size Missing from Patient Selection Slide',
        text: 'The patient selection statistics (34.3%, 27.6%, 52.8%) are presented without the total cohort size (N=324). This should be added for proper context.',
      },
      {
        label: 'Liver Function Monitoring Added',
        text: 'The HCP checklist includes liver function test monitoring, which is not referenced in the provided BOXED WARNING. Verify this is substantiated in the full prescribing information.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'Patient selection statistics on Slide 01 do not reference the total cohort size (N=324), which is needed for proper interpretation of the percentages.',
        suggested_fix: 'Add "In the Brenova-Based Therapy Cohort (N=324):" before the statistics bullet points.',
        reference_document: 'Clinical Study Report',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // HCP Email Template 02 – Data Highlight Email
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-email-template-02',
    approved: true,
    content_type: 'Email',
    status: 'Pending',
    final_risk_tier: 'Tier 2',
    flags_count: 2,
    substantiation:
      'Data highlight format presents key efficacy statistics prominently. Indication is correctly stated. BOXED WARNING and ISI present. Additional monitoring guidance (liver function tests) included.',
    content_text: `
Brenova: A New Approach in HR+/HER2- Metastatic Breast Cancer
Clinical Review of Brexiva's Efficacy and Safety
Brexiva is indicated for the treatment of HR+/HER2- metastatic breast cancer.
Data Highlights:
- 34.3% — Third-line Metastatic Setting
- 98 — Sample Size
- 34.3% — Endocrine-sensitive Disease
Key Takeaway: Understanding patient selection criteria is crucial for effective treatment.
Important Safety Information (ISI)
Monitoring for hematologic toxicity is essential during treatment with Brexiva. Adverse reactions may include neutropenia, anemia, and thrombocytopenia, necessitating complete blood count assessments before and periodically during therapy. Additionally, liver function tests should be monitored, especially in patients with pre-existing hepatic impairment. Stay informed about the latest evidence and best practices in managing metastatic breast cancer. Effective communication with patients regarding treatment goals, expected monitoring, and potential adverse events is vital for optimizing care.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: During treatment with Brenova.
- Action for HCP: Consider complete blood count assessment before and periodically during therapy.
- Monitoring: Signs/symptoms of hematologic toxicity.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Third-line metastatic setting: 34.3%.
- Endocrine-sensitive disease: 34.3% (verify — may be data entry error; approved figure is 52.8%).
- Sample size cited: 98 (verify — approved total cohort is 324).
    `,
    fair_balance_score: '75',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Potential Data Errors in Highlights',
        text: 'The data highlight shows "34.3%" for both third-line metastatic setting AND endocrine-sensitive disease. The approved figure for endocrine-sensitive disease is 52.8% — this appears to be a copy/paste error.',
      },
      {
        label: 'Incorrect Sample Size',
        text: 'The "Sample Size" highlight shows 98, which does not match the total Brenova-Based Therapy Cohort size of 324 patients. This must be verified and corrected.',
      },
      {
        label: 'Liver Function Monitoring Not in Boxed Warning',
        text: 'The ISI mentions liver function test monitoring, which goes beyond the provided BOXED WARNING content. Confirm this is substantiated in the full prescribing information.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MAJOR',
        description: 'The data highlight block displays "34.3%" for "Endocrine-sensitive Disease", which is incorrect. The substantiated figure is 52.8%. This is a significant data accuracy error that could mislead HCPs.',
        suggested_fix: 'Correct the endocrine-sensitive disease figure to 52.8% as per the approved clinical data references.',
        reference_document: 'Clinical Study Report',
      },
      {
        domain: 'MEDICAL',
        severity: 'MAJOR',
        description: 'The "Sample Size" data highlight shows 98, which conflicts with the total Brenova-Based Therapy Cohort of 324 patients referenced across all other assets.',
        suggested_fix: 'Update the sample size to 324 or provide a reference explaining what the "98" figure represents.',
        reference_document: 'Clinical Study Report',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // HCP Email Template – Newsletter Email
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-email-newsletter',
    approved: true,
    content_type: 'Email',
    status: 'Pending',
    final_risk_tier: 'Tier 1',
    flags_count: 1,
    substantiation:
      'Newsletter format provides a clinical overview, article reference, and full ISI including BOXED WARNING. Indication and safety monitoring are accurately stated. Patient population and monitoring guidance align with prescribing information.',
    content_text: `
Brexiva: A Targeted Approach for HR+/HER2- Metastatic Breast Cancer
Brexiva offers a targeted approach for HR+/HER2- metastatic breast cancer. Understanding patient selection criteria is crucial for effective treatment. The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Recent clinical reviews support the efficacy and safety profile of Brexiva, emphasizing the importance of individualized treatment strategies. Monitoring for hematologic toxicity is essential during treatment with Brexiva. Complete blood count assessment should be considered before treatment initiation and periodically during therapy. Patients with significant baseline cytopenias or prior intensive anticancer therapy may require closer monitoring.
Articles
Patient-Reported Outcomes and Treatment Persistence with Brenova-Based Therapy
This observational research manuscript explores patient-reported outcomes, treatment persistence, and global oncology care considerations for patients receiving Brenova-based therapy under the Brexiva brand in HR+/HER2- metastatic breast cancer.
Important Safety Information (ISI)
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, thrombocytopenia, or other blood-count abnormalities.
- Trigger / Setting: Before and during Brenova treatment.
- Action for HCP: Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
- Monitoring: Signs/symptoms of hematologic toxicity or complications such as febrile neutropenia or bleeding risk.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Patient population: Adults with HR+/HER2- MBC after prior endocrine-based treatment.
- Monitoring: CBC before and periodically during therapy.
    `,
    fair_balance_score: '87',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Most Complete Email ISI',
        text: 'This newsletter includes the most comprehensive BOXED WARNING of any email asset, adding "febrile neutropenia or bleeding risk" to the monitoring guidance.',
      },
      {
        label: 'No Specific Efficacy Data',
        text: 'Unlike other email assets, this newsletter does not include any specific cohort statistics (e.g., 34.3%, 52.8%). Consider adding key data points to support the efficacy claims.',
      },
      {
        label: 'Trademark Symbol Missing',
        text: 'The email body refers to "Brexiva" without the registered trademark symbol (®) on the first mention. This should be corrected for legal compliance.',
      },
    ],
    composite_feedback: [
      {
        domain: 'LEGAL',
        severity: 'MINOR',
        description: 'The email body uses "Brexiva" without the registered trademark symbol (®) on its first mention. The subject line and header also omit the trademark symbol.',
        suggested_fix: 'Add the ® symbol after the first mention of "Brexiva" in the email body: "Brexiva®".',
        reference_document: 'Brand and Legal Guidelines',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // HCP Email Template 05 – Product Update Email
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-email-template-05',
    approved: true,
    content_type: 'Email',
    status: 'Pending',
    final_risk_tier: 'Tier 2',
    flags_count: 2,
    substantiation:
      'Product update format introduces Brenova as an investigational concept under the Brexiva® brand. Indication, patient population eligibility, and safety monitoring requirements are accurately stated.',
    content_text: `
Brenova: A New Option for HR+/HER2- Metastatic Breast Cancer
What's New
Brenova is an investigational therapeutic concept associated with the Brexiva® brand for HR+/HER2- metastatic breast cancer. Brenova offers a significant option in the treatment landscape for metastatic breast cancer. Clinical efficacy and safety profile of Brexiva® are supported by recent clinical reviews. Understanding patient selection criteria is crucial for effective treatment with Brexiva®.
Patient Demographics and Treatment Considerations
The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments.
Important Safety Information (ISI)
Hematologic toxicity warnings including neutropenia, anemia, and thrombocytopenia are critical considerations. Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Patient population: Adults with HR+/HER2- MBC after prior endocrine-based treatment.
- Eligibility: Documented metastatic disease, ECOG PS 0–2.
    `,
    fair_balance_score: '74',
    isi_completeness: false,
    puffery_detected: 'Minor',
    ai_insights: [
      {
        label: 'Incomplete ISI — BOXED WARNING Missing',
        text: 'The ISI section does not include the explicit "BOXED WARNING" heading or the structured four-part format (Risk, Trigger, Action, Monitoring) required for compliance.',
      },
      {
        label: 'Unresolved Section Heading Placeholder',
        text: '"What\'s New Section Heading" appears to be an unresolved placeholder that must be replaced with final approved copy before publication.',
      },
      {
        label: 'No Efficacy Data Included',
        text: 'Unlike other assets, this email contains no cohort statistics. Adding key data points (e.g., 34.3% third-line, 52.8% endocrine-sensitive) would strengthen the HCP communication.',
      },
    ],
    composite_feedback: [
      {
        domain: 'REGULATORY',
        severity: 'MAJOR',
        description: 'The ISI section is incomplete — it lacks the explicit "BOXED WARNING" heading and the structured four-part format (Risk, Trigger/Setting, Action for HCP, Monitoring) required across all Brexiva assets.',
        suggested_fix: 'Add the full structured BOXED WARNING to the ISI section matching the format used in other approved Brexiva assets.',
        reference_document: 'Prescribing Information',
      },
      {
        domain: 'REGULATORY',
        severity: 'MAJOR',
        description: '"What\'s New Section Heading" is unresolved placeholder text present in the published draft.',
        suggested_fix: 'Replace the placeholder with approved final copy describing the product update content.',
        reference_document: 'Content Review Checklist',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Congress Poster – Modular Grid Poster
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-poster-modular-grid',
    approved: true,
    content_type: 'Congress Poster',
    status: 'Pending',
    final_risk_tier: 'Tier 1',
    flags_count: 1,
    substantiation:
      'Modular grid layout covers Background, Objectives, Methods, Results, and ISI. Indication, cohort statistics, eligibility criteria, and safety monitoring requirements are accurately represented and align with prescribing information.',
    content_text: `
Brexiva in HR+/HER2- Metastatic Breast Cancer: A Clinical Review
Background
Brexiva is indicated for HR+/HER2- metastatic breast cancer, providing a targeted treatment option. The complexity of metastatic breast cancer necessitates a thorough understanding of patient selection criteria to optimize treatment outcomes. The global oncology population affected by this condition requires effective therapeutic strategies that address both disease control and patient-reported outcomes.
Objectives
The primary objective of this clinical review is to evaluate the efficacy and safety of Brenova-based therapy in patients with HR+/HER2- metastatic breast cancer. Secondary objectives include assessing treatment persistence and the impact of patient-reported outcomes on overall care.
Methods
The study design involved a simulated cohort of adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments. Patients with rapidly progressive disease requiring immediate cytotoxic chemotherapy were excluded from the primary simulated cohort.
Results
In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, while 27.6% were in the fourth or later metastatic setting. Additionally, 52.8% of patients had endocrine-sensitive disease, and 47.2% had endocrine-resistant disease. The median age of patients in this cohort is 58 years, with 31.8% aged 65 years or older. Notably, 99.0% of patients are female, and 55.2% have visceral metastases. Safety monitoring, including complete blood count assessments, is essential during therapy, as Brenova may be associated with hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
Key Finding: Brenova-based therapy demonstrates significant potential for managing HR+/HER2- metastatic breast cancer, with a focus on patient selection and safety monitoring.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: During treatment with Brenova.
- Action for HCP: Consider complete blood count assessment before treatment initiation and periodically during therapy.
- Monitoring: Signs/symptoms of hematologic toxicity.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
- Endocrine-sensitive disease: 52.8%.
- Endocrine-resistant disease: 47.2%.
- Median age: 58 years.
- Age ≥65 years: 31.8%.
- Female: 99.0%.
- Visceral metastases: 55.2%.
    `,
    fair_balance_score: '85',
    isi_completeness: true,
    puffery_detected: 'Minor',
    ai_insights: [
      {
        label: 'Cohort Size Missing from Results',
        text: 'All result statistics are presented without the total cohort size (N=324). This should be stated at the first mention of the Brenova-Based Therapy Cohort in the Results section.',
      },
      {
        label: 'Puffery Risk in Key Finding',
        text: '"Demonstrates significant potential" is a promotional phrase without a specific efficacy endpoint to support it. Consider replacing with a concrete substantiated outcome.',
      },
      {
        label: 'Well-Structured Scientific Format',
        text: 'The Background–Objectives–Methods–Results–ISI structure follows standard congress poster conventions and is appropriate for an HCP audience.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'The Results section presents cohort statistics without stating the total cohort size of 324 patients, which is required for proper data context.',
        suggested_fix: 'Add "(N=324)" at first mention: "In the Brenova-Based Therapy Cohort (N=324), 34.3% of patients..."',
        reference_document: 'Clinical Study Report',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Congress Poster Template 02 – Visual Impact Poster
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-poster-visual-impact',
    approved: true,
    content_type: 'Congress Poster',
    status: 'Pending',
    final_risk_tier: 'Tier 1',
    flags_count: 1,
    substantiation:
      'Visual impact format covers Introduction, Methods, Key Results, Subgroup Analysis, Conclusions, and ISI. Absolute patient counts (91 patients, 283 patients) are provided alongside percentages, enhancing data transparency. Full BOXED WARNING present.',
    content_text: `
Brexiva in HR+/HER2- Metastatic Breast Cancer: Clinical Insights and Evidence
Introduction
Brexiva is indicated for the treatment of HR+/HER2- metastatic breast cancer. Understanding the treatment rationale and patient selection criteria is crucial for effective management. This document provides a clinical review of Brenova-based therapy, focusing on patient-reported outcomes, treatment persistence, and safety monitoring.
Methods
The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments. Patients with rapidly progressive disease requiring immediate cytotoxic chemotherapy were not included in the primary simulated cohort.
Key Results
In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, while 27.6% were in the fourth or later metastatic setting. Additionally, 52.8% of patients had endocrine-sensitive disease, and 47.2% had endocrine-resistant disease. The median age of patients in this cohort is 58 years, with a range of 31 to 81 years. Notably, 91 patients (31.8%) are aged 65 years or older, and 283 patients (99.0%) are female.
Subgroup Analysis
The cohort also revealed that 55.2% of patients have visceral metastases, with 32.9% having liver involvement and 71.0% having bone metastases. Prior exposure to CDK4/6 inhibitors was noted in 69.6% of patients, and 25.5% had prior chemotherapy for metastatic disease. These characteristics underscore the complexity of managing HR+/HER2- metastatic breast cancer and the need for individualized treatment approaches.
Conclusions
The findings from the Brenova-Based Therapy Cohort highlight the diverse patient population and the importance of tailored treatment strategies in HR+/HER2- metastatic breast cancer. Safety monitoring, including complete blood count assessments, is essential during therapy to manage potential adverse reactions effectively.
Key Takeaways:
- Brexiva is indicated for the treatment of HR+/HER2- metastatic breast cancer.
- Understanding the treatment rationale and patient selection criteria is crucial for effective management.
- Safety monitoring, including complete blood count assessments, is essential during therapy.
BOXED WARNING:
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: Before and during Brenova treatment.
- Action for HCP: Consider complete blood count assessment before treatment initiation and periodically during therapy.
- Monitoring: Signs/symptoms of hematologic toxicity or complications such as febrile neutropenia.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
- Endocrine-sensitive disease: 52.8%.
- Endocrine-resistant disease: 47.2%.
- Median age: 58 years (range 31–81).
- Age ≥65 years: 91 patients (31.8%).
- Female: 283 patients (99.0%).
- Visceral metastases: 55.2%; liver involvement: 32.9%; bone metastases: 71.0%.
- Prior CDK4/6 inhibitor exposure: 69.6%.
- Prior chemotherapy for metastatic disease: 25.5%.
    `,
    fair_balance_score: '88',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Best-in-Class Data Transparency',
        text: 'This poster provides both absolute counts and percentages (e.g., 91 patients / 31.8%) for key demographics — a best practice that should be replicated across other poster assets.',
      },
      {
        label: 'Cohort Size Not Explicitly Stated',
        text: 'Although absolute counts (91, 283) imply a total of ~288–324 patients, the total cohort size (N=324) is never explicitly stated. Adding it would improve clarity.',
      },
      {
        label: 'Most Comprehensive Subgroup Data',
        text: 'The subgroup analysis includes CDK4/6 inhibitor exposure (69.6%), liver involvement (32.9%), and prior chemotherapy (25.5%) — the most detailed dataset across all poster assets.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'The total cohort size (N=324) is never explicitly stated, even though absolute patient counts are provided. Readers should not have to infer the denominator.',
        suggested_fix: 'Add "In the Brenova-Based Therapy Cohort (N=324)..." at first mention in the Key Results section.',
        reference_document: 'Clinical Study Report',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Congress Poster Template 01 – Classic Scientific Poster
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-poster-classic-scientific',
    approved: true,
    content_type: 'Congress Poster',
    status: 'Pending',
    final_risk_tier: 'Tier 2',
    flags_count: 2,
    substantiation:
      'Classic scientific format covers Background, Objectives, Methods, Results, and ISI. Absolute patient counts are provided for key demographics. Investigational nature of Brenova is correctly disclosed. ISI present but BOXED WARNING heading absent.',
    content_text: `
Patient-Reported Outcomes and Treatment Persistence with Brenova-Based Therapy Under the Brexiva Brand in HR+/HER2- Metastatic Breast Cancer
Background
The management of HR+/HER2- metastatic breast cancer presents significant challenges, particularly in the context of treatment resistance and the need for individualized therapy. Brenova, associated with the Brexiva brand, is an investigational therapeutic concept aimed at addressing these challenges.
Objectives
This study aims to evaluate the patient-reported outcomes and treatment persistence associated with Brenova-based therapy in a global cohort of patients with HR+/HER2- metastatic breast cancer.
Methods
The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment. Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments. Patients with rapidly progressive disease requiring immediate cytotoxic chemotherapy were not included in the primary simulated cohort. Patients with stable treated central nervous system disease were permitted if symptoms were controlled and functional assessment could be completed reliably.
Results
In the Brenova-Based Therapy Cohort, 34.3% of patients were in the third-line metastatic setting, while 27.6% were in the fourth or later metastatic setting. Additionally, 52.8% of patients had endocrine-sensitive disease, and 47.2% had endocrine-resistant disease. The median age of patients in the Brenova-Based Therapy Cohort is 58 years, with a range of 31 to 81 years. Notably, 91 patients (31.8%) in the cohort are aged 65 years or older, and 283 patients (99.0%) are female. The cohort also includes 199 patients (69.6%) with prior CDK4/6 inhibitor exposure.
Brenova is indicated for HR+/HER2- metastatic breast cancer, providing a targeted treatment option. Understanding patient selection criteria is crucial for optimizing treatment outcomes. Evidence-based considerations support the use of Brexiva in clinical practice. Safety guidelines must be adhered to, including monitoring for hematologic toxicity.
Important Safety Information (ISI)
- Risk: Hematologic toxicity, including neutropenia, anemia, and thrombocytopenia.
- Trigger / Setting: Before and during Brenova treatment.
- Action for HCP: Complete blood count assessment should be considered before treatment initiation and periodically during therapy.
- Monitoring: Signs/symptoms of hematologic toxicity or complications such as febrile neutropenia or bleeding risk.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
- Endocrine-sensitive disease: 52.8%.
- Endocrine-resistant disease: 47.2%.
- Median age: 58 years (range 31–81).
- Age ≥65 years: 91 patients (31.8%).
- Female: 283 patients (99.0%).
- Prior CDK4/6 inhibitor exposure: 199 patients (69.6%).
    `,
    fair_balance_score: '82',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'BOXED WARNING Heading Missing',
        text: 'The ISI section contains the correct safety content but does not carry the explicit "BOXED WARNING:" heading, which is required for regulatory compliance.',
      },
      {
        label: 'Cohort Size Not Stated',
        text: 'Despite providing absolute counts (91, 283, 199 patients), the total cohort size (N=324) is never explicitly stated in the Results section.',
      },
      {
        label: 'Strong CDK4/6 Inhibitor Data',
        text: 'This poster is one of the few assets to include prior CDK4/6 inhibitor exposure as an absolute count (199 patients / 69.6%), which strengthens the characterization of the patient population.',
      },
    ],
    composite_feedback: [
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: 'The ISI section presents the BOXED WARNING content without the required "BOXED WARNING:" heading label, reducing its regulatory visibility.',
        suggested_fix: 'Add "BOXED WARNING:" as an explicit heading before the risk/trigger/action/monitoring content in the ISI section.',
        reference_document: 'Prescribing Information',
      },
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'The total cohort size (N=324) is never stated in the Results section despite absolute patient counts being provided for individual subgroups.',
        suggested_fix: 'Add "(N=324)" at first mention: "In the Brenova-Based Therapy Cohort (N=324), 34.3% of patients..."',
        reference_document: 'Clinical Study Report',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Congress Poster Template 03 – Infographic Style Poster
  // ─────────────────────────────────────────────────────────────────────────
  {
    asset_id: 'brexiva-poster-infographic',
    approved: true,
    content_type: 'Congress Poster',
    status: 'Pending',
    final_risk_tier: 'Tier 2',
    flags_count: 3,
    substantiation:
      'Infographic style presents key statistics prominently via data callouts and a three-phase study flow. Indication and patient population are correctly stated. ISI present but BOXED WARNING heading absent and unsubstantiated adverse events listed.',
    content_text: `
Patient-Reported Outcomes and Treatment Persistence with Brenova-Based Therapy Under the Brexiva Brand in HR+/HER2- Metastatic Breast Cancer
Data Callouts:
- 34.3% — Third-line metastatic setting
- 27.6% — Fourth or later metastatic setting
- 52.8% — Endocrine-sensitive disease
- 47.2% — Endocrine-resistant disease
Study Phase 1
Brenova is an investigational therapeutic concept associated with the Brexiva brand for HR+/HER2- metastatic breast cancer. The simulated cohort included adults with HR+/HER2- metastatic breast cancer who initiated Brenova-based therapy after prior endocrine-based treatment.
Study Phase 2
Patients represented a global oncology population across North America, Europe, Asia-Pacific, Latin America, and other participating regions. Eligible patients were required to have documented metastatic disease, an ECOG performance status of 0 to 2, and baseline completion of patient-reported outcome instruments.
Study Phase 3
Patients with rapidly progressive disease requiring immediate cytotoxic chemotherapy were not included in the primary simulated cohort. Patients with stable treated central nervous system disease were permitted if symptoms were controlled and functional assessment could be completed reliably.
Results Panel 1
In the Brenova-Based Therapy Cohort, the median age of patients is 58 years, with a range of 31 to 81 years. Notably, 99.0% of patients are female, and 31.8% are aged 65 years or older. The cohort also includes 55.2% of patients with visceral metastases and 71.0% with bone metastases.
Results Panel 2
Safety guidelines must be adhered to, including monitoring for hematologic toxicity during treatment. Possible adverse reactions associated with Brenova may include fatigue, nausea, decreased appetite, diarrhea, rash or pruritus, and laboratory abnormalities such as neutropenia, anemia, and thrombocytopenia.
Conclusions
Understanding patient selection criteria is crucial for optimizing treatment outcomes with Brexiva. Evidence-based considerations highlight the importance of informed decision-making in oncology, ensuring that treatment strategies are tailored to individual patient needs.
Important Safety Information (ISI)
Safety guidelines must be adhered to, including monitoring for hematologic toxicity during treatment. Complete blood count assessment should be considered before treatment initiation and periodically during therapy. Patients with significant baseline cytopenias or prior intensive anticancer therapy may require closer monitoring.
DATA REFERENCES:
- Indication: HR+/HER2- metastatic breast cancer.
- Third-line metastatic setting: 34.3%.
- Fourth or later metastatic setting: 27.6%.
- Endocrine-sensitive disease: 52.8%.
- Endocrine-resistant disease: 47.2%.
- Median age: 58 years (range 31–81).
- Female: 99.0%.
- Age ≥65 years: 31.8%.
- Visceral metastases: 55.2%.
- Bone metastases: 71.0%.
    `,
    fair_balance_score: '73',
    isi_completeness: true,
    puffery_detected: 'None',
    ai_insights: [
      {
        label: 'Unsubstantiated Adverse Events Listed',
        text: 'Results Panel 2 lists fatigue, nausea, decreased appetite, diarrhea, and rash/pruritus as possible adverse reactions. These are not included in the approved BOXED WARNING and are not substantiated in the provided reference documents.',
      },
      {
        label: 'BOXED WARNING Heading Absent from ISI',
        text: 'The ISI section does not include the explicit "BOXED WARNING:" heading, and the structured four-part format (Risk, Trigger, Action, Monitoring) is missing entirely.',
      },
      {
        label: 'Cohort Size Missing from Data Callouts',
        text: 'The four prominent data callouts (34.3%, 27.6%, 52.8%, 47.2%) are displayed without the total cohort size (N=324), which is required for proper interpretation.',
      },
    ],
    composite_feedback: [
      {
        domain: 'MEDICAL',
        severity: 'MAJOR',
        description: 'Results Panel 2 lists fatigue, nausea, decreased appetite, diarrhea, and rash/pruritus as possible adverse reactions for Brenova. These are not substantiated in the approved BOXED WARNING or any provided reference document.',
        suggested_fix: 'Remove unsubstantiated adverse events. Restrict the adverse reaction list to those explicitly listed in the prescribing information: neutropenia, anemia, and thrombocytopenia.',
        reference_document: 'Prescribing Information',
      },
      {
        domain: 'REGULATORY',
        severity: 'MINOR',
        description: 'The ISI section lacks the explicit "BOXED WARNING:" heading and the required four-part structured format (Risk, Trigger/Setting, Action for HCP, Monitoring).',
        suggested_fix: 'Restructure the ISI section to include the full BOXED WARNING in the standard four-part format used across all other Brexiva assets.',
        reference_document: 'Prescribing Information',
      },
      {
        domain: 'MEDICAL',
        severity: 'MINOR',
        description: 'The four data callouts at the top of the poster do not reference the total cohort size (N=324), leaving the statistics without denominator context.',
        suggested_fix: 'Add a footnote or subheading to the data callouts stating "Brenova-Based Therapy Cohort (N=324)".',
        reference_document: 'Clinical Study Report',
      },
    ],
  },
];

// Maps the exact template name a user selects in the Generation Agent's Select
// step to its dedicated MLR evaluation. Templates without a bespoke entry fall
// back to the base asset for their content type (see DEFAULT_ASSET_BY_CONTENT_TYPE).
export const ASSET_ID_BY_TEMPLATE_NAME: Record<string, string> = {
  // Email
  'Clinical Focus Email': 'brexiva-email-001',
  'Data Highlight Email': 'brexiva-email-template-02',
  'Newsletter Email': 'brexiva-email-newsletter',
  'Product Update Email': 'brexiva-email-template-05',
  // Digital Detail Aid
  'Interactive Slides DDA': 'brexiva-dda-interactive-slides',
  'Tabbed Sidebar DDA': 'brexiva-dda-template-02',
  'Card Carousel DDA': 'brexiva-dda-template-04',
  'Fullscreen Immersive DDA': 'brexiva-dda-template-05',
  // (Storytelling Flow DDA has no bespoke entry -> falls back to base DDA)
  // Congress Poster
  'Classic Scientific Poster': 'brexiva-poster-classic-scientific',
  'Visual Impact Poster': 'brexiva-poster-visual-impact',
  'Infographic Style Poster': 'brexiva-poster-infographic',
  'Modular Grid Poster': 'brexiva-poster-modular-grid',
  // (Landscape Widescreen Poster has no bespoke entry -> falls back to base poster)
  // Patient Leaflet
  'Friendly Patient Guide': 'brexiva-leaflet-template-01',
  'Step-by-Step Guide': 'brexiva-leaflet-template-02',
  'Foldable Brochure': 'brexiva-leaflet-template-03',
  'Treatment Diary': 'brexiva-leaflet-template-05',
  // (Condition Awareness Leaflet has no bespoke entry -> falls back to base leaflet)
};

// Fallback base asset per content type (channel) for templates without a
// dedicated MLR evaluation, and for the standalone MLR agent.
export const DEFAULT_ASSET_ID_BY_CONTENT_TYPE: Record<string, string> = {
  'Email': 'brexiva-email-001',
  'Digital Detail Aid': 'brexiva-dda-001',
  'Detail Digital Aid': 'brexiva-dda-001',
  'Congress Poster': 'brexiva-poster-001',
  'Patient Leaflet': 'brexiva-leaflet-001',
};

const _byId: Record<string, MlrAssetEvaluation> = Object.fromEntries(
  BREXIVA_MLR_ASSETS.map((a) => [a.asset_id, a]),
);

export function getAssetById(assetId: string): MlrAssetEvaluation | undefined {
  return _byId[assetId];
}

// Resolve a selected template name to its MLR evaluation, falling back to the
// content type's base asset when the template has no dedicated entry.
export function getAssetForTemplate(
  templateName: string,
  contentType?: string,
): MlrAssetEvaluation | undefined {
  const direct = ASSET_ID_BY_TEMPLATE_NAME[templateName];
  if (direct && _byId[direct]) return _byId[direct];
  if (contentType) {
    const fallback = DEFAULT_ASSET_ID_BY_CONTENT_TYPE[contentType];
    if (fallback && _byId[fallback]) return _byId[fallback];
  }
  return undefined;
}
