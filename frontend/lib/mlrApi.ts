import type { MLRPreScreenPayload } from '@/lib/types';
import {
  BREXIVA_MLR_ASSETS,
  DEFAULT_ASSET_ID_BY_CONTENT_TYPE,
  getAssetById,
  getAssetForTemplate,
  type MlrAssetEvaluation,
} from '@/lib/mlrAssets';

export interface MlrAgentRequest {
  session_id: string;
  end_template_id: string;
  mlr_collection_id: string;
  chunks_id: string;
  claim_id: string;
  content_id: string;
  selected_content_types?: string[];
  selected_template_names?: string[];
}

export interface MlrAgentResponse {
  session_id: string;
  status: string;
  mlr_details: Omit<MLRPreScreenPayload, 'mlr_response_id'>;
  mlr_output: string;
}

const CAMPAIGN_COHESION = {
  'Message Consistency': '100%',
  'Tone Alignment': '96%',
  'Visual Cohesion': '99%',
  'Claim Harmony': '100%',
} as const;

function buildPayload(
  body: MlrAgentRequest,
  assets: MlrAssetEvaluation[],
): MLRPreScreenPayload {
  return {
    mlr_response_id: 'mlr-response-brexiva-001',

    session_id: body.session_id,
    end_template_id: body.end_template_id,

    global_pipeline_status: 'Approved with Recommendations',

    campaign_cohesion: { ...CAMPAIGN_COHESION },

    asset_evaluations: assets,
  };
}

export async function runMlrAgent(
  body: MlrAgentRequest,
): Promise<MLRPreScreenPayload> {
  const baseAssetIds = new Set(Object.values(DEFAULT_ASSET_ID_BY_CONTENT_TYPE));
  const baseAssets = BREXIVA_MLR_ASSETS.filter((a) => baseAssetIds.has(a.asset_id));

  const selectedAssets =
    body.selected_content_types && body.selected_content_types.length > 0
      ? baseAssets.filter((asset) =>
          body.selected_content_types?.some(
            (contentType) =>
              DEFAULT_ASSET_ID_BY_CONTENT_TYPE[contentType] === asset.asset_id,
          ),
        )
      : baseAssets;

  await new Promise((resolve) => setTimeout(resolve, 2600));

  return buildPayload(body, selectedAssets);
}

export async function runGenerationMlr(
  body: MlrAgentRequest,
): Promise<MLRPreScreenPayload> {
  const names = body.selected_template_names ?? [];
  const contentTypes = body.selected_content_types ?? [];

  const assets: MlrAssetEvaluation[] = [];

  if (names.length > 0) {
    const seen = new Set<string>();
    names.forEach((name, i) => {
      const contentType = contentTypes[i] ?? contentTypes[0];
      const asset = getAssetForTemplate(name, contentType);
      if (asset && !seen.has(asset.asset_id)) {
        seen.add(asset.asset_id);
        assets.push(asset);
      }
    });
  }

  if (assets.length === 0) {
    const ids =
      contentTypes.length > 0
        ? contentTypes
            .map((ct) => DEFAULT_ASSET_ID_BY_CONTENT_TYPE[ct])
            .filter(Boolean)
        : Object.values(DEFAULT_ASSET_ID_BY_CONTENT_TYPE);
    const seen = new Set<string>();
    ids.forEach((id) => {
      const asset = getAssetById(id);
      if (asset && !seen.has(id)) {
        seen.add(id);
        assets.push(asset);
      }
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 2600));

  return buildPayload(body, assets);
}
