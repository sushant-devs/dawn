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
): Promise<EndTemplateItem[]> {
  // Map content types to personalized HTML files and template names
  const contentTypeMap: Record<string, { file: string; name: string }> = {
    'Email': {
      file: '/personalized/Clinical Focus Email (3).html',
      name: 'Clinical Focus Email'
    },
    'Detail Digital Aid': {
      file: '/personalized/Interactive Slides DDA (1).html',
      name: 'Interactive Slides DDA'
    },
    'Congress Poster': {
      file: '/personalized/Classic Scientific Poster (2) 1.html',
      name: 'Classic Scientific Poster'
    },
    'Patient Leaflet': {
      file: '/personalized/Friendly Patient Guide (1).html',
      name: 'Friendly Patient Guide'
    },
  };

  // Determine which content types to fetch
  const contentTypesToFetch = selectedContentTypes && selectedContentTypes.length > 0
    ? selectedContentTypes
    : Object.keys(contentTypeMap);

  // Fetch HTML for each selected content type
  const items = await Promise.all(
    contentTypesToFetch.map(async (contentType) => {
      const mapping = contentTypeMap[contentType];
      if (!mapping) {
        return {
          content_type: contentType,
          template_name: contentType,
          processed_html: `<div style="padding:24px;"><h2>${contentType}</h2><p>Template not found.</p></div>`,
          status: 'error',
          error: 'Template mapping not found',
        };
      }

      const html = await fetchHtmlContent(mapping.file);

      return {
        content_type: contentType,
        template_name: mapping.name,
        processed_html: html || `<div style="padding:24px;"><h2>${contentType}</h2><p>Failed to load template.</p></div>`,
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
  // IDs the MLR agent (/mlr-agent/process) consumes.
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

// Module-level cache for paginated list responses. Keyed by (limit, skip).
// Backend already caches in-process; this short-circuits the network round-trip
// entirely on revisits. In-flight dedupe avoids parallel duplicate calls.
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
  // Map personalized template files
  const personalizedTemplates = [
    {
      file: '/personalized/Clinical Focus Email (3).html',
      content_type: 'Email',
      template_name: 'Clinical Focus Email  ',
    },
    {
      file: '/personalized/Interactive Slides DDA (1).html',
      content_type: 'Detail Digital Aid',
      template_name: 'Interactive Slides DDA  ',
    },
    {
      file: '/personalized/Classic Scientific Poster (2) 1.html',
      content_type: 'Congress Poster',
      template_name: 'Classic Scientific Poster  ',
    },
    {
      file: '/personalized/Friendly Patient Guide (1).html',
      content_type: 'Patient Leaflet',
      template_name: 'Friendly Patient Guide  ',
    },
  ];

  // Fetch HTML content for all personalized templates and create separate items
  const items = await Promise.all(
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

  return Promise.resolve({
    count: items.length,
    total: items.length,
    skip,
    limit,
    has_more: false,
    items,
  });
}

// Module-level cache so paging back/forward (or reopening the modal in the
// same session) does not refetch HTML blobs we already have.
const _outputHtmlCache = new Map<string, string>();
const _outputHtmlInflight = new Map<string, Promise<string>>();

export async function fetchEndTemplateOutputHtml(
  endTemplateId: string,
  index: number,
): Promise<string> {
  const cacheKey = `${endTemplateId}:${index}`;

  // Check cache first
  const cached = _outputHtmlCache.get(cacheKey);
  if (cached) return cached;

  // Check if already in-flight
  const inflight = _outputHtmlInflight.get(cacheKey);
  if (inflight) return inflight;

  // Map index to personalized template files
  const personalizedTemplates = [
    '/personalized/Clinical Focus Email (3).html',
    '/personalized/Interactive Slides DDA (1).html',
    '/personalized/Classic Scientific Poster (2) 1.html',
    '/personalized/Friendly Patient Guide (1).html',
  ];

  const templatePath = personalizedTemplates[index] || personalizedTemplates[0];

  // Fetch and cache
  const promise = fetchHtmlContent(templatePath).then((html) => {
    _outputHtmlCache.set(cacheKey, html);
    _outputHtmlInflight.delete(cacheKey);
    return html;
  });

  _outputHtmlInflight.set(cacheKey, promise);
  return promise;
}
