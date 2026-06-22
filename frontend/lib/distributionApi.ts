import { request } from '@/lib/apiClient';

export interface DistributeRequest {
  mlr_response_id: string;
  asset_ids: string[];
}

export interface DistributeResponse {
  status: string;
  message: string;
  distributed_count: number;
  skipped_asset_ids: string[];
}

export function distributeAssets(payload: DistributeRequest): Promise<DistributeResponse> {
  return request<DistributeResponse>('/distribution/distribute', {
    method: 'POST',
    body: payload,
  });
}
