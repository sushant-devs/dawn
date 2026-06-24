import { request } from '@/lib/apiClient';

export interface EditTextRequest {
  document_id: string;
  content_types: string[];
  tone?: string;
  structure?: string;
  free_text?: string;
  source_text?: string;
  template_document_id: string;
  approved_asset_id: string;
}

export interface EditTextResponse {
  success: boolean;
  message: string;
  source_document_id: string;
  content_types_edited: string[];
  edited_content_id: string;
  template_content_id: string;
  end_template_id: string;
}

export async function editTextTemplate(body: EditTextRequest): Promise<EditTextResponse> {
  return request<EditTextResponse>('/Edit-text-template/edit-text-template', {
    method: 'POST',
    body,
  });
}

export interface PersonalizePreferences {
  color_scheme?: string;
  font_style?: string;
  border_style?: string;
  spacing?: string;
  text_section?: string;
}

export type AppliedStylePreferences = Record<string, PersonalizePreferences>;

export const EMPTY_PREFERENCES: PersonalizePreferences = {
  color_scheme: '',
  font_style: '',
  border_style: '',
  spacing: '',
  text_section: '',
};

export function normalizePreferences(
  source?: Partial<PersonalizePreferences>,
): PersonalizePreferences {
  return {
    color_scheme: source?.color_scheme ?? '',
    font_style: source?.font_style ?? '',
    border_style: source?.border_style ?? '',
    spacing: source?.spacing ?? '',
    text_section: source?.text_section ?? '',
  };
}

export function preferencesForApi(prefs: PersonalizePreferences): PersonalizePreferences {
  const out: PersonalizePreferences = {};
  if (prefs.color_scheme) out.color_scheme = prefs.color_scheme;
  if (prefs.font_style) out.font_style = prefs.font_style;
  if (prefs.border_style) out.border_style = prefs.border_style;
  if (prefs.spacing) out.spacing = prefs.spacing;
  if (prefs.text_section) out.text_section = prefs.text_section;
  return out;
}

export interface PersonalizeTemplateRequest {
  document_id: string;
  content_type: string;
  preferences: PersonalizePreferences;
}

export interface PersonalizeTemplateResponse {
  success: boolean;
  message: string;
  source_document_id: string;
  edited_document_id: string;
  content_type: string;
  document: Record<string, unknown>;
}

export async function personalizeTemplate(
  body: PersonalizeTemplateRequest,
): Promise<PersonalizeTemplateResponse> {
  return request<PersonalizeTemplateResponse>('/Edit-template/personalize-template', {
    method: 'POST',
    body,
  });
}

export interface EndTemplateItem {
  content_type: string;
  template_name: string;
  processed_html: string;
  status?: string;
  error?: string | null;
}

const DEFAULT_TEMPLATE_BY_CONTENT_TYPE: Record<string, string> = {
  'Email': 'Clinical Focus Email',
  'Detail Digital Aid': 'Interactive Slides DDA',
  'Congress Poster': 'Classic Scientific Poster',
  'Patient Leaflet': 'Friendly Patient Guide',
};

const GENERATED_ROOT = '/data/brexiva/Generated Template';
const genFile = (subdir: string, name: string) =>
  `${GENERATED_ROOT}/${encodeURIComponent(subdir)}/${encodeURIComponent(name)}.html`;

const TEMPLATE_FILE_BY_NAME: Record<string, { file: string; contentType: string }> = {
  // Email
  'Clinical Focus Email': { file: genFile('Email', 'Clinical Focus Email'), contentType: 'Email' },
  'Data Highlight Email': { file: genFile('Email', 'Data Highlight Email'), contentType: 'Email' },
  'Newsletter Email': { file: genFile('Email', 'Newsletter Email'), contentType: 'Email' },
  'Product Update Email': { file: genFile('Email', 'Product Update Email'), contentType: 'Email' },
  // Digital Detail Aid
  'Interactive Slides DDA': { file: genFile('Digital Detail Aid', 'Interactive Slides DDA'), contentType: 'Detail Digital Aid' },
  'Tabbed Sidebar DDA': { file: genFile('Digital Detail Aid', 'Tabbed Sidebar DDA'), contentType: 'Detail Digital Aid' },
  'Storytelling Flow DDA': { file: genFile('Digital Detail Aid', 'Storytelling Flow DDA'), contentType: 'Detail Digital Aid' },
  'Card Carousel DDA': { file: genFile('Digital Detail Aid', 'Card Carousel DDA'), contentType: 'Detail Digital Aid' },
  'Fullscreen Immersive DDA': { file: genFile('Digital Detail Aid', 'Fullscreen Immersive DDA'), contentType: 'Detail Digital Aid' },
  // Congress Poster
  'Classic Scientific Poster': { file: genFile('Congress Poster', 'Classic Scientific Poster'), contentType: 'Congress Poster' },
  'Visual Impact Poster': { file: genFile('Congress Poster', 'Visual Impact Poster'), contentType: 'Congress Poster' },
  'Infographic Style Poster': { file: genFile('Congress Poster', 'Infographic Style Poster'), contentType: 'Congress Poster' },
  'Modular Grid Poster': { file: genFile('Congress Poster', 'Modular Grid Poster'), contentType: 'Congress Poster' },
  'Landscape Widescreen Poster': { file: genFile('Congress Poster', 'Landscape Widescreen Poster'), contentType: 'Congress Poster' },
  // Patient Leaflet
  'Friendly Patient Guide': { file: genFile('Patient Leaflet', 'Friendly Patient Guide'), contentType: 'Patient Leaflet' },
  'Step-by-Step Guide': { file: genFile('Patient Leaflet', 'Step-by-Step Guide'), contentType: 'Patient Leaflet' },
  'Foldable Brochure': { file: genFile('Patient Leaflet', 'Foldable Brochure'), contentType: 'Patient Leaflet' },
  'Condition Awareness Leaflet': { file: genFile('Patient Leaflet', 'Condition Awareness Leaflet'), contentType: 'Patient Leaflet' },
  'Treatment Diary': { file: genFile('Patient Leaflet', 'Treatment Diary'), contentType: 'Patient Leaflet' },
};

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

export async function fetchEndTemplate(
  endTemplateId: string,
  selectedContentTypes?: string[],
  selectedTemplateNames?: string[],
): Promise<EndTemplateItem[]> {
  const namesToFetch = selectedTemplateNames && selectedTemplateNames.length > 0
    ? selectedTemplateNames
    : (selectedContentTypes && selectedContentTypes.length > 0
        ? selectedContentTypes
        : Object.keys(DEFAULT_TEMPLATE_BY_CONTENT_TYPE)
      ).map((ct) => DEFAULT_TEMPLATE_BY_CONTENT_TYPE[ct]).filter(Boolean);

  const items = await Promise.all(
    namesToFetch.map(async (templateName) => {
      const mapping = TEMPLATE_FILE_BY_NAME[templateName];
      if (!mapping) {
        return {
          content_type: templateName,
          template_name: templateName,
          processed_html: `<div style="padding:24px;"><h2>${templateName}</h2><p>Template not found.</p></div>`,
          status: 'error',
          error: 'Template mapping not found',
        };
      }

      const html = await fetchHtmlContent(mapping.file);

      return {
        content_type: mapping.contentType,
        template_name: templateName,
        processed_html: html || `<div style="padding:24px;"><h2>${templateName}</h2><p>Failed to load template.</p></div>`,
        status: html ? 'completed' : 'error',
        error: html ? null : 'Failed to fetch HTML content',
      };
    })
  );

  return items;
}

export interface EndTemplateListEntry {
  end_template_id: string;
  source_template_id?: string | null;
  approved_asset_id?: string | null;
  content_document_id?: string | null;
  template_document_id?: string | null;
  mlr_collection_id?: string | null;
  chunk_id?: string | null;
  claim_id?: string | null;
  content_id?: string | null;
  outputs?: EndTemplateItem[];
}

export interface EndTemplateListResponse {
  count: number;
  total?: number;
  skip?: number;
  limit?: number;
  has_more?: boolean;
  items: EndTemplateListEntry[];
}

export async function countEndTemplates(): Promise<number> {
  const resp = await request<{ total: number }>('/end-templates/count', {
    method: 'GET',
  });
  return resp?.total ?? 0;
}

const _listCache = new Map<string, EndTemplateListResponse>();
const _listInflight = new Map<string, Promise<EndTemplateListResponse>>();

export function invalidateEndTemplatesListCache(): void {
  _listCache.clear();
  _listInflight.clear();
}

export async function listEndTemplates(
  limit = 20,
  skip = 0,
): Promise<EndTemplateListResponse> {
  const personalizedTemplates = [
    {
      file: '/personalized/Clinical Focus Email (3).html',
      content_type: 'Email',
      template_name: 'Clinical Focus Email',
    },
    {
      file: '/personalized/Interactive Slides DDA (1).html',
      content_type: 'Detail Digital Aid',
      template_name: 'Interactive Slides DDA',
    },
    {
      file: '/personalized/Classic Scientific Poster (2) 1.html',
      content_type: 'Congress Poster',
      template_name: 'Classic Scientific Poster',
    },
    {
      file: '/personalized/Friendly Patient Guide (1).html',
      content_type: 'Patient Leaflet',
      template_name: 'Friendly Patient Guide',
    },
  ];

  const allItems = await Promise.all(
    personalizedTemplates.map(async (template, index) => {
      try {
        const html = await fetchHtmlContent(template.file);
        const output: EndTemplateItem = {
          content_type: template.content_type,
          template_name: template.template_name,
          processed_html: html || `<div style="padding:24px;"><h2>${template.template_name}</h2><p>Failed to load personalized template.</p></div>`,
          status: html ? 'completed' : 'error',
          error: html ? null : 'Failed to fetch HTML content',
        };

        return {
          end_template_id: `brexiva-personalized-${String(index + 1).padStart(3, '0')}`,
          source_template_id: `source-template-${String(index + 1).padStart(3, '0')}`,
          approved_asset_id: `approved-asset-${String(index + 1).padStart(3, '0')}`,
          content_document_id: `content-doc-${String(index + 1).padStart(3, '0')}`,
          template_document_id: `template-doc-${String(index + 1).padStart(3, '0')}`,
          mlr_collection_id: `mlr-brexiva-${String(index + 1).padStart(3, '0')}`,
          chunk_id: `chunk-brexiva-${String(index + 1).padStart(3, '0')}`,
          claim_id: `claim-brexiva-${String(index + 1).padStart(3, '0')}`,
          content_id: `content-brexiva-${String(index + 1).padStart(3, '0')}`,
          outputs: [output],
        };
      } catch (error) {
        const output: EndTemplateItem = {
          content_type: template.content_type,
          template_name: template.template_name,
          processed_html: `<div style="padding:24px;"><h2>${template.template_name}</h2><p>Error loading template.</p></div>`,
          status: 'error',
          error: (error as Error).message,
        };

        return {
          end_template_id: `brexiva-personalized-${String(index + 1).padStart(3, '0')}`,
          source_template_id: `source-template-${String(index + 1).padStart(3, '0')}`,
          approved_asset_id: `approved-asset-${String(index + 1).padStart(3, '0')}`,
          content_document_id: `content-doc-${String(index + 1).padStart(3, '0')}`,
          template_document_id: `template-doc-${String(index + 1).padStart(3, '0')}`,
          mlr_collection_id: `mlr-brexiva-${String(index + 1).padStart(3, '0')}`,
          chunk_id: `chunk-brexiva-${String(index + 1).padStart(3, '0')}`,
          claim_id: `claim-brexiva-${String(index + 1).padStart(3, '0')}`,
          content_id: `content-brexiva-${String(index + 1).padStart(3, '0')}`,
          outputs: [output],
        };
      }
    })
  );

  // Apply actual mathematical slicing rules for the pagination simulation
  const paginatedItems = allItems.slice(skip, skip + limit);

  return Promise.resolve({
    count: paginatedItems.length,
    total: allItems.length,
    skip,
    limit,
    has_more: skip + limit < allItems.length,
    items: paginatedItems,
  });
}

const _outputHtmlCache = new Map<string, string>();
const _outputHtmlInflight = new Map<string, Promise<string>>();

export async function fetchEndTemplateOutputHtml(
  endTemplateId: string,
  index: number,
): Promise<string> {
  const cacheKey = `${endTemplateId}:${index}`;

  const cached = _outputHtmlCache.get(cacheKey);
  if (cached) return cached;

  const inflight = _outputHtmlInflight.get(cacheKey);
  if (inflight) return inflight;

  // Extract the ID number from "brexiva-personalized-00X" safely
  const numericId = parseInt(endTemplateId.split('-').pop() || '1', 10);

  // Tie the lookup directly to its assigned data file index, not the layout grid index
  const resolvedDataIndex = isNaN(numericId) ? 0 : numericId - 1;

  const personalizedTemplates = [
    '/personalized/Clinical Focus Email (3).html',
    '/personalized/Interactive Slides DDA (1).html',
    '/personalized/Classic Scientific Poster (2) 1.html',
    '/personalized/Friendly Patient Guide (1).html',
  ];

  const templatePath = personalizedTemplates[resolvedDataIndex] || personalizedTemplates[0];

  const promise = fetchHtmlContent(templatePath).then((html) => {
    _outputHtmlCache.set(cacheKey, html);
    _outputHtmlInflight.delete(cacheKey);
    return html;
  });

  _outputHtmlInflight.set(cacheKey, promise);
  return promise;
}
