import type { MLRPreScreenPayload } from '@/lib/types';

export interface MlrAgentRequest {
  session_id: string;
  end_template_id: string;
  mlr_collection_id: string;
  chunks_id: string;
  claim_id: string;
  content_id: string;
  selected_content_types?: string[];
}

export interface MlrAgentResponse {
  session_id: string;
  status: string;
  mlr_details: Omit<MLRPreScreenPayload, 'mlr_response_id'>;
  mlr_output: string;
}

export async function runMlrAgent(
  body: MlrAgentRequest,
): Promise<MLRPreScreenPayload> {
  // Map content types to asset IDs
  const contentTypeToAssetMap: Record<string, string> = {
    'Email': 'brexiva-email-001',
    'Detail Digital Aid': 'brexiva-dda-001',
    'Congress Poster': 'brexiva-poster-001',
    'Patient Leaflet': 'brexiva-leaflet-001',
  };

  // All available assets
  const allAssets = [
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
    ];

  // Filter assets based on selected content types
  const selectedAssets = body.selected_content_types && body.selected_content_types.length > 0
    ? allAssets.filter((asset) => {
        const assetId = asset.asset_id;
        return body.selected_content_types?.some(
          (contentType) => contentTypeToAssetMap[contentType] === assetId
        );
      })
    : allAssets;

  await new Promise((resolve) => setTimeout(resolve, 2600));

  return {
    mlr_response_id: 'mlr-response-brexiva-001',

    session_id: body.session_id,
    end_template_id: body.end_template_id,

    global_pipeline_status: 'Approved with Recommendations',

    campaign_cohesion: {
      'Message Consistency': '100%',
      'Tone Alignment': '96%',
      'Visual Cohesion': '99%',
      'Claim Harmony': '100%',
    },

    asset_evaluations: selectedAssets,
  };
}
