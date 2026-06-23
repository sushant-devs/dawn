/**
 * lib/selectionApi.ts
 * Client for the selection + generation-agent endpoints used by the
 * AgentDropdown / SelectionFlowModal flow.
 *
 *   GET  /api/v1/selection/options?brand=HEMLIBRA
 *   POST /api/v1/selection/confirm
 *   POST /process_generation_api_v1/generation_agent/process
 *
 * The first two go through the standard /api proxy (which rewrites /api → /api/v1).
 * The third has a non-standard prefix so it bypasses the proxy and hits the
 * backend directly (see next.config rewrites for /process_generation_api_v1).
 */

export interface TemplateOption {
  template_name: string;
  description?: string;
  recommended?: boolean;
  template_image?: string | string[];
  html_code?: string;
  size?: string;
  template_id?: string;
}

export interface ChannelOptions {
  channel: string;
  templates: TemplateOption[];
}

export interface DocOption {
  asset_id: string;
  asset_name: string;
  asset_type?: string;
  description?: string;
  file_url?: string;
}

export interface ApprovedAssetOption {
  asset_id: string;
  asset_name: string;
  asset_type?: string;
  description?: string;
  file_url?: string;
}

export interface SelectionOptionsResponse {
  brand: string;
  drug_name?: string;
  parent_template_doc_id?: string;
  templates: ChannelOptions[];
  documents: DocOption[];
  approved_assets: ApprovedAssetOption[];
}

export interface SelectionConfirmPayload {
  parent_template_doc_id: string;
  template_selections: Record<string, string>;
  doc_ids: string[];
  approved_asset_ids: string[];
}

export interface SelectionConfirmResponse {
  template_id: string;
  approved_asset_id: string;
  doc_ids: string[];
  selected_templates_count: number;
  [key: string]: unknown;
}

export interface GenerationAgentRequest {
  content_type: string[];
  template_id: string;
  approved_asset_id?: string;
  key_messages?: string[];
  mandatory_inclusions?: string[];
  doc_ids?: string[];
  query?: string;
  document_id?: string | null;
  audience?: string[];
  thread_id?: string | null;
}

export interface GenerationAgentResponse {
  status?: string;
  session_id?: string;
  content_id?: string;
  end_template_id?: string;
  // IDs the MLR agent (/mlr-agent/process) consumes.
  mlr_collection_id?: string;
  chunks_id?: string;
  claim_id?: string;
  outputs?: Array<{
    content_type?: string;
    processed_html?: string;
    text?: string;
  }>;
  [key: string]: unknown;
}

async function fetchHtmlContent(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`Failed to fetch HTML from ${path}`);
      return '';
    }
    return await response.text();
  } catch (error) {
    console.warn(`Error fetching HTML from ${path}:`, error);
    return '';
  }
}

export async function getSelectionOptions(
  brand: string,
): Promise<SelectionOptionsResponse> {
  const baseData = {
    brand,
    drug_name: 'Brexiva',
    parent_template_doc_id: 'parent-template-brexiva-001',

    templates: [
      {
        channel: 'Email',
        templates: [
          {
            template_id: 'email-template-001',
            template_name: 'Clinical Focus Email',
            description: 'Clean clinical-focused email with hero overlay, key message box, and strong visual hierarchy for HCP engagement.',
            recommended: true,
            size: '600x800',
            template_image:
              '/data/brexiva/Templates/Email/Clinical Focus Email.html',
          },
          {
            template_id: 'email-template-002',
            template_name: 'Data Highlight Email',
            description: 'Statistics-driven email layout with prominent data metrics, chart placeholder, and evidence-focused design.',
            recommended: true,
            size: '600x800',
            template_image:
              '/data/brexiva/Templates/Email/Data Highlight Email.html',
          },
          {
            template_id: 'email-template-003',
            template_name: 'Newsletter Email',
            description: 'Multi-article newsletter format with featured article, article grid, quick links, and social navigation.',
            size: '600x800',
            template_image:
              '/data/brexiva/Templates/Email/Newsletter Email.html',
          },
          {
            template_id: 'email-template-004',
            template_name: 'Product Update Email',
            description: 'Product announcement template with feature highlights, icon-driven layout, and info box CTA.',
            size: '600x800',
            template_image:
              '/data/brexiva/Templates/Email/Product Update Email.html',
          },
        ],
      },

      {
        channel: 'Detail Digital Aid',
        templates: [
          {
            template_id: 'wa-template-001',
            template_name: 'Interactive Slides DDA',
            description: 'Slide-deck presentation with dot navigation, stat cards, split layouts, and keyboard-enabled transitions.',
            recommended: true,
            template_image:
              '/data/brexiva/Templates/Digital Detail Aid/Interactive Slides DDA.html',
          },
          {
            template_id: 'wa-template-002',
            template_name: 'Tabbed Sidebar DDA',
            description: 'Sidebar-navigated panel layout with breadcrumb bar, animated panel transitions, and modular content blocks.',
            recommended: false,
            template_image:
              '/data/brexiva/Templates/Digital Detail Aid/Tabbed Sidebar DDA.html',
          },
          {
            template_id: 'wa-template-003',
            template_name: 'Storytelling Flow DDA',
            description: 'Narrative-driven slide format with chapter markers, progress bar, full-bleed and split layouts.',
            recommended: false,
            template_image:
              '/data/brexiva/Templates/Digital Detail Aid/Storytelling Flow DDA.html',
          },
          {
            template_id: 'wa-template-004',
            template_name: 'Card Carousel DDA',
            description: 'Swipeable card-based carousel with featured card styling, dot pagination, and hover interactions.',
            recommended: false,
            template_image:
              '/data/brexiva/Templates/Digital Detail Aid/Card Carousel DDA.html',
          },
        ],
      },

      {
        channel: 'Congress Poster',
        templates: [
          {
            template_id: 'poster-template-001',
            template_name: 'Classic Scientific Poster',
            description: 'Traditional two-column scientific poster with structured IMRAD sections and dark header branding.',
            recommended: true,
            size: '800x600',
            template_image:
              '/data/brexiva/Templates/Congress Poster/Classic Scientific Poster.html',
          },
          {
            template_id: 'poster-template-002',
            template_name: 'Visual Impact Poster',
            recommended: true,
            description: 'Modern visual-first poster with hero graphic, card-based content modules, and key finding banner.',
            size: '800x600',
            template_image:
              '/data/brexiva/Templates/Congress Poster/Visual Impact Poster.html',
          },
          {
            template_id: 'poster-template-003',
            template_name: 'Infographic Style Poster',
            description: 'Data-driven infographic poster with statistics strip, numbered flow steps, and visual panels.',
            size: '800x600',
            template_image:
              '/data/brexiva/Templates/Congress Poster/Infographic Style Poster.html',
          },
          {
            template_id: 'poster-template-004',
            template_name: 'Modular Grid Poster',
            description: 'Flexible grid-based poster with interchangeable content cells for maximum layout customization.',
            size: '800x600',
            template_image:
              '/data/brexiva/Templates/Congress Poster/Modular Grid Poster.html',
          },
        ],
      },
      {
        channel: 'Patient Leaflet',
        templates: [
          {
            template_id: 'patient-leaflet-001',
            template_name: 'Friendly Patient Guide',
            description: 'Warm, accessible patient information leaflet with info cards, callout boxes, and supportive tone.',
            recommended: true,
            size: '600x800',
            template_image:
              '/data/brexiva/Templates/Patient Leaflet/Friendly Patient Guide.html',
          },
          {
            template_id: 'patient-leaflet-002',
            template_name: 'Step-by-Step Guide',
            description: 'Numbered step-by-step patient guide with progress indicators, tip boxes, and FAQ section.',
            recommended: true,
            size: '600x800',
            template_image:
              '/data/brexiva/Templates/Patient Leaflet/Step-by-Step Guide.html',
          },
          {
            template_id: 'patient-leaflet-003',
            template_name: 'Foldable Brochure',
            description: 'Panel-based brochure layout simulating a foldable leaflet with distinct topic sections.',
            size: '600x800',
            template_image:
              '/data/brexiva/Templates/Patient Leaflet/Foldable Brochure.html',
          },
          {
            template_id: 'patient-leaflet-004',
            template_name: 'Condition Awareness Leaflet',
            description: 'Disease awareness leaflet with statistics bar, two-column symptom/risk layout, and treatment journey infographic.',
            size: '600x800',
            template_image:
              '/data/brexiva/Templates/Patient Leaflet/Condition Awareness Leaflet.html',
          },
        ],
      },
    ],

    documents: [
      {
        asset_id: 'doc-001',
        asset_name: 'BREXIVA_Brexiva in Metastatic Breast Cancer- A Clinical Review of Treatment Rationale, Patient Selection, and Evidence Considerations.pdf',
        asset_type: 'Journal',
        description: 'Clinical review paper discussing Brexiva treatment rationale, patient selection factors, and evidence considerations in metastatic breast cancer.',
        file_url: '/data/brexiva/Journals/BREXIVA_Brexiva in Metastatic Breast Cancer- A Clinical Review of Treatment Rationale, Patient Selection, and Evidence Considerations.pdf',
      },
      {
        asset_id: 'doc-002',
        asset_name: 'BREXIVA_Safety Management and Practical Monitoring Considerations for Brexiva-Based Therapy.pdf',
        asset_type: 'Journal',
        description: 'Safety-focused paper covering monitoring considerations, risk-management themes, and practical guidance for Brexiva-based therapy discussions.',
        file_url: '/data/brexiva/Journals/BREXIVA_Safety Management and Practical Monitoring Considerations for Brexiva-Based Therapy.pdf',
      },
      {
        asset_id: 'doc-003',
        asset_name: 'BREXIVA_Treatment Sequencing and Clinical Decision-Making for Brexiva-Based Therapy.pdf',
        asset_type: 'Journal',
        description: 'Research-style paper exploring treatment sequencing, clinical decision-making, and specialist considerations for Brexiva-based therapy.',
        file_url: '/data/brexiva/Journals/BREXIVA_Treatment Sequencing and Clinical Decision-Making for Brexiva-Based Therapy.pdf',
      },
      {
        asset_id: 'doc-004',
        asset_name: 'BREXIVA_A Simulated Multicenter Phase II Study Evaluating Efficacy, Safety, and Clinical Applicability in a Global Oncology Population.pdf',
        asset_type: 'Research Paper',
        description: 'Simulated Phase II manuscript evaluating Brexiva’s clinical applicability, safety considerations, and oncology population relevance.',
        file_url: '/data/brexiva/Research Papers/BREXIVA_A Simulated Multicenter Phase II Study Evaluating Efficacy, Safety, and Clinical Applicability in a Global Oncology Population.pdf',
      },
      {
        asset_id: 'doc-005',
        asset_name: 'BREXIVA_Biomarker Patterns and Endocrine-Resistance Features Associated with Brexiva-Based Therapy in HR+HER2- Metastatic Breast Cancer.pdf',
        asset_type: 'Research Paper',
        description: 'Biomarker-focused manuscript examining endocrine-resistance features and molecular patterns associated with Brexiva-based therapy.',
        file_url: '/data/brexiva/Research Papers/BREXIVA_Biomarker Patterns and Endocrine-Resistance Features Associated with Brexiva-Based Therapy in HR+HER2- Metastatic Breast Cancer.pdf',
      },
      {
        asset_id: 'doc-006',
        asset_name: 'BREXIVA_Patient-Reported Outcomes and Treatment Persistence with Brexiva Metastatic Breast Cancer- Simulated Global Observational.pdf',
        asset_type: 'Research Paper',
        description: 'Observational research manuscript exploring patient-reported outcomes, treatment persistence, and global oncology care considerations.',
        file_url: '/data/brexiva/Research Papers/BREXIVA_Patient-Reported Outcomes.pdf',
      },
      {
        asset_id: 'doc-007',
        asset_name: 'BREXIVA_Safety Guideline Document',
        asset_type: 'Safety Guideline',
        description: 'Safety guideline for oncology brand Brexiva, covering contraindications, hematologic toxicity, hepatic monitoring, infections, pregnancy risk, and counseling.',
        file_url: '/data/brexiva/Safety Guideline/BREXIVA_Safety Guideline Document.pdf',
      },
      {
        asset_id: 'doc-008',
        asset_name: 'BREXIVA_Clinical Review Report.pdf',
        asset_type: 'Clinical-Report',
        description: 'Clinical review report summarizing Brexiva’s scientific rationale, therapeutic context, and oncology communication considerations.',
        file_url: '/data/brexiva/Clinical Review/BREXIVA_Clinical Review Report.pdf',
      },
      {
        asset_id: 'doc-009',
        asset_name: 'BREXIVA_Market Insight Reference Report.pdf',
        asset_type: 'Market Insight Reference File',
        description: 'Market insight reference report outlining global oncology landscape, audience needs, and strategic communication opportunities.',
        file_url: '/data/brexiva/Market Insight Report/BREXIVA_Market Insight Reference Report.pdf',
      },
      {
        asset_id: 'doc-010',
        asset_name: 'BREXIVA_Mlr Compliance Report.pdf',
        asset_type: 'MLR',
        description: 'MLR compliance report defining promotional review considerations, risk controls, and medically appropriate communication boundaries.',
        file_url: '/data/brexiva/MLR/BREXIVA_Mlr Compliance Report.pdf',
      },
    ],

    approved_assets: [
      {
        asset_id: 'approved-001',
        asset_name: 'BREXIVA_Approved_Image_Abstract_Oncology_Cellular_Visual.png',
        asset_type: 'APPROVED-IMG',
        description: 'Abstract cellular visualization for oncology content',
        file_url: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Abstract_Oncology_Cellular_Visual.png',
      },
      {
        asset_id: 'approved-002',
        asset_name: 'BREXIVA_Approved_Image_Patient_Advocacy_Ribbon_Visual.png',
        asset_type: 'APPROVED-IMG',
        description: 'Patient advocacy and awareness ribbon graphic',
        file_url: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Patient_Advocacy_Ribbon_Visual.png',
      },
      {
        asset_id: 'approved-003',
        asset_name: 'BREXIVA_Approved_Image_Precision_Oncology_DNA_Visual.png',
        asset_type: 'APPROVED-IMG',
        description: 'DNA helix visualization for precision oncology messaging',
        file_url: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Precision_Oncology_DNA_Visual.png',
      },
      {
        asset_id: 'approved-004',
        asset_name: 'BREXIVA_Approved_Image_Breast_Cancer_Pathway_Network.png',
        asset_type: 'APPROVED-IMG',
        description: 'Scientific pathway illustration for breast cancer treatment',
        file_url: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Breast_Cancer_Pathway_Network.png',
      },
      {
        asset_id: 'approved-005',
        asset_name: 'BREXIVA_Approved_Image_Global_Oncology_Network.png',
        asset_type: 'APPROVED-IMG',
        description: 'Global network visualization for oncology research',
        file_url: '/data/brexiva/Approved Images/BREXIVA_Approved_Image_Global_Oncology_Network.png',
      },
      {
        asset_id: 'approved-logo',
        asset_name: 'BREXIVA_LOGO.png',
        asset_type: 'LOGO',
        description: 'Official Brexiva brand logo',
        file_url: '/data/brexiva/BREXIVA_LOGO.png',
      },
    ],
  };

  // Fetch HTML content for all templates
  const fetchPromises = baseData.templates.flatMap((channel) =>
    channel.templates.map(async (template) => {
      if (template.template_image && typeof template.template_image === 'string') {
        (template as TemplateOption).html_code = await fetchHtmlContent(template.template_image);
      }
    })
  );

  await Promise.all(fetchPromises);

  return baseData;
}

export async function confirmSelection(
  payload: SelectionConfirmPayload,
): Promise<SelectionConfirmResponse> {
  return Promise.resolve({
    template_id:
      Object.values(payload.template_selections)[0] ??
      'email-template-001',

    approved_asset_id:
      payload.approved_asset_ids[0] ?? 'approved-001',

    doc_ids: payload.doc_ids,

    selected_templates_count: Object.keys(
      payload.template_selections,
    ).length,

    parent_template_doc_id: payload.parent_template_doc_id,

    success: true,
  });
}


export async function runGenerationAgent(
  payload: GenerationAgentRequest,
): Promise<GenerationAgentResponse> {
  // Map template names to generated HTML files
  const templateFileMap: Record<string, string> = {
    'Clinical Focus Email': '/generated/Clinical Focus Email.html',
    'Data Highlight Email': '/generated/Clinical Focus Email.html', // fallback
    'Newsletter Email': '/generated/Clinical Focus Email.html', // fallback
    'Product Update Email': '/generated/Clinical Focus Email.html', // fallback
    'Interactive Slides DDA': '/generated/Interactive Slides DDA.html',
    'Tabbed Sidebar DDA': '/generated/Interactive Slides DDA.html', // fallback
    'Storytelling Flow DDA': '/generated/Interactive Slides DDA.html', // fallback
    'Card Carousel DDA': '/generated/Interactive Slides DDA.html', // fallback
    'Classic Scientific Poster': '/generated/Classic Scientific Poster.html',
    'Visual Impact Poster': '/generated/Classic Scientific Poster.html', // fallback
    'Infographic Style Poster': '/generated/Classic Scientific Poster.html', // fallback
    'Modular Grid Poster': '/generated/Classic Scientific Poster.html', // fallback
    'Friendly Patient Guide': '/generated/Friendly Patient Guide.html',
    'Step-by-Step Guide': '/generated/Friendly Patient Guide.html', // fallback
    'Foldable Brochure': '/generated/Friendly Patient Guide.html', // fallback
    'Condition Awareness Leaflet': '/generated/Friendly Patient Guide.html', // fallback
  };

  // Get template name from template_id (we'll need to extract from the payload)
  // For now, map content_type to the primary template for each channel
  const channelToTemplate: Record<string, string> = {
    'Email': 'Clinical Focus Email',
    'Detail Digital Aid': 'Interactive Slides DDA',
    'Congress Poster': 'Classic Scientific Poster',
    'Patient Leaflet': 'Friendly Patient Guide',
  };

  // Fetch HTML content for all selected content types
  const outputs = await Promise.all(
    payload.content_type.map(async (contentType) => {
      const templateName = channelToTemplate[contentType];
      const templatePath = templateName ? templateFileMap[templateName] : null;
      let processedHtml = '';

      if (templatePath) {
        try {
          processedHtml = await fetchHtmlContent(templatePath);
        } catch (error) {
          console.warn(`Failed to fetch template for ${contentType}:`, error);
          processedHtml = `<div style="padding:24px;"><h2>Generated ${contentType}</h2><p>Template content will appear here.</p></div>`;
        }
      }

      return {
        content_type: contentType,
        processed_html: processedHtml,
        text: `Generated ${contentType} content for Brexiva®`,
      };
    })
  );

  return {
    status: 'success',
    session_id: 'session-brexiva-001',
    content_id: 'content-brexiva-001',
    end_template_id: 'end-template-brexiva-001',
    mlr_collection_id: 'mlr-brexiva-001',
    chunks_id: 'chunk-brexiva-001',
    claim_id: 'claim-brexiva-001',
    outputs,
  };
}