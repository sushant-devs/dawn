export interface ApprovedTemplateItem {
  approved_content_id: string;
  source_asset_id?: string | null;
  approved?: boolean | null;
  channel: string;
  content_text?: string | null;
  session_id?: string | null;
  distributed_at?: string | null;
  end_template_id: string;
  template_name: string;
}

export interface GetTemplatesResponse {
  count: number;
  total?: number;
  skip?: number;
  limit?: number;
  has_more?: boolean;
  brands: Record<string, ApprovedTemplateItem[]>;
}

// Module-level caches (parallel to MLR side).
const _listCache = new Map<string, GetTemplatesResponse>();
const _listInflight = new Map<string, Promise<GetTemplatesResponse>>();
const _previewCache = new Map<string, string>();
const _previewInflight = new Map<string, Promise<string>>();

export function invalidatePersonalizationCache(): void {
  _listCache.clear();
  _listInflight.clear();
  _previewCache.clear();
  _previewInflight.clear();
}

export async function getApprovedTemplates(
  limit = 5,
  skip = 0,
): Promise<GetTemplatesResponse> {
  const channels = ['Email', 'Detail Digital Aid', 'Congress Poster', 'Patient Leaflet'];
  const templateNames = [
    'Clinical Focus Email  ',
    'Interactive Slides DDA  ',
    'Classic Scientific Poster  ',
    'Friendly Patient Guide  ',
  ];

  const brexivaTemplates: ApprovedTemplateItem[] = channels.map((channel, index) => ({
    approved_content_id: `approved-brexiva-${String(index + 1).padStart(3, '0')}`,
    source_asset_id: `asset-brexiva-${String(index + 1).padStart(3, '0')}`,
    approved: true,
    channel,
    content_text: `Brexiva ${channel} - Personalized template for healthcare professionals.`,
    session_id: `session-${String(index + 1).padStart(3, '0')}`,
    distributed_at: new Date().toISOString(),
    end_template_id: `brexiva-template-${String(index + 1).padStart(3, '0')}`,
    template_name: templateNames[index],
  }));

  return Promise.resolve({
    count: brexivaTemplates.length,
    total: brexivaTemplates.length,
    skip,
    limit,
    has_more: false,
    brands: {
      zoflevrix: [],
      corvanta: [],
      oncorava: [],
      brexiva: brexivaTemplates,
    },
  });
}

export async function getApprovedTemplatesCount(): Promise<number> {
  return Promise.resolve(4);
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

// Reuse the existing /end-templates/{id} endpoint — already implemented and
// covered by the same in-process backend cache as the MLR list path.
export async function getTemplatePreview(
  endTemplateId: string,
): Promise<string> {
  const cacheKey = endTemplateId;

  // Check cache first
  const cached = _previewCache.get(cacheKey);
  if (cached) return cached;

  // Check if already in-flight
  const inflight = _previewInflight.get(cacheKey);
  if (inflight) return inflight;

  // Default to first personalized template
  const templatePath = '/personalized/Clinical Focus Email (3).html';

  // Fetch and cache
  const promise = fetchHtmlContent(templatePath).then((html) => {
    _previewCache.set(cacheKey, html);
    _previewInflight.delete(cacheKey);
    return html || '<div style="padding:24px;"><p>Failed to load template preview.</p></div>';
  });

  _previewInflight.set(cacheKey, promise);
  return promise;
}
export interface PersonalizeRequest {
  end_template_id: string;
  channel: string;
  template_name: string;
  personalization_text: string;
  max_variation: number;
}

export interface PersonalizedVersion {
  version: number;
  personalization_text: string;
  html: string;
}

export interface PersonalizeResponse {
  end_template_id: string;
  channel: string;
  template_name: string;
  personalized_versions: PersonalizedVersion[];
}
export async function personalizeTemplateAgent(
  body: PersonalizeRequest,
): Promise<PersonalizeResponse> {
  // Map channels to personalized template files from /ouput directory
  // Note: /ouput is the correct directory name (not a typo)
  const channelTemplateMap: Record<string, string[]> = {
    'Email': [
      '/ouput/Clinical_Focus_Email_v2 (1).html',
      '/ouput/Clinical_Focus_Email_v3 (1).html',
    ],
    'Detail Digital Aid': [
      '/personalized/Interactive Slides DDA (1).html',
      '/personalized/Interactive Slides DDA (1).html', // Fallback to same file for v2
    ],
    'Congress Poster': [
      '/ouput/Classic_Scientific_Poster_v2.html',
      '/ouput/Classic_Scientific_Poster_v3.html',
    ],
    'Patient Leaflet': [
      '/ouput/Friendly_Patient_Guide_v2.html',
      '/ouput/Friendly_Patient_Guide_v3.html',
    ],
  };

  const templatePaths = channelTemplateMap[body.channel] || channelTemplateMap['Email'];

  // Generate variations based on max_variation count
  // Each variation loads from a different file (v2, v3, etc.)
  const personalized_versions: PersonalizedVersion[] = [];
  for (let i = 1; i <= body.max_variation; i++) {
    // Map version 1 -> v2 file, version 2 -> v3 file
    const templatePath = templatePaths[i - 1] || templatePaths[0];
    const html = await fetchHtmlContent(templatePath);

    personalized_versions.push({
      version: i,
      personalization_text: body.personalization_text,
      html: html || `<div style="padding:24px;"><p>Failed to load personalized template version ${i}.</p></div>`,
    });
  }

  return {
    end_template_id: body.end_template_id,
    channel: body.channel,
    template_name: body.template_name,
    personalized_versions,
  };
}