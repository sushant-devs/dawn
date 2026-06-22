import { request } from '@/lib/apiClient';

export interface PerformanceKPI {
  label: string;
  value: string;
  trend?: string;
  benchmark?: string;
  is_positive?: boolean;
}

export interface PerformanceMarketRow {
  market: string;
  open_rate: string;
  ctr: string;
  dda_time: string;
  poster_downloads: string;
}

export interface HcpPersona {
  persona: string;
  description: string;
  score: string;
}

export interface AudienceSegment {
  name: string;
  percentage: string;
}

export interface AudienceAutoTagging {
  title: string;
  segments: AudienceSegment[];
}

export interface OptimizationRecommendation {
  finding_id: string;
  description: string;
  action: string;
  impact: string;
}

export interface PerformanceData {
  session_id: string;
  header: { title: string; description: string };
  campaign_kpis: Record<string, PerformanceKPI>;
  market_comparison: PerformanceMarketRow[];
  hcp_persona_performance?: HcpPersona[];
  audience_auto_tagging?: AudienceAutoTagging;
  optimization_recommendations?: OptimizationRecommendation[];
  created_at: string;
}

export interface PerformanceResponse {
  status: string;
  data: PerformanceData;
}

export function getPerformanceEvaluation(sessionId: string): Promise<PerformanceResponse> {
  return request<PerformanceResponse>(
    `/performance/evaluation/${encodeURIComponent(sessionId)}`,
  );
}
