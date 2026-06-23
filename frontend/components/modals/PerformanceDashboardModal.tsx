'use client';

/**
 * PerformanceDashboardModal
 * ─────────────────────────
 * Opened from the chat after distribution finishes. Fetches
 * /performance/evaluation/{session_id} on mount and renders all
 * campaign performance sections: KPIs, market comparison, HCP persona
 * performance, audience auto-tagging, and optimization recommendations.
 */

import { useEffect, useState } from 'react';
import {
  X,
  BarChart3,
  Loader2,
  TrendingUp,
  TrendingDown,
  Globe2,
  Users,
  Tags,
  Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import {
  getPerformanceEvaluation,
  type PerformanceData,
  type HcpPersona,
} from '@/lib/performanceApi';

interface PerformanceDashboardModalProps {
  sessionId: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmed?: boolean;
}

// ── helpers ───────────────────────────────────────────────────────────────────

const parsePercent = (val: string) => parseFloat(val.replace('%', '')) || 0;

function personaColor(p: HcpPersona) {
  const n = p.persona.toLowerCase();
  if (n === 'conservative') {
    return {
      bar: 'bg-dawn-navy',
      text: 'text-dawn-navy',
      tint: 'bg-dawn-navy/5 border-dawn-navy/10',
    };
  }
  if (n === 'empathetic') {
    return {
      bar: 'bg-dawn-teal',
      text: 'text-dawn-teal',
      tint: 'bg-dawn-teal/5 border-dawn-teal/15',
    };
  }
  if (n === 'innovator') {
    return {
      bar: 'bg-dawn-purple',
      text: 'text-dawn-purple',
      tint: 'bg-dawn-purple/5 border-dawn-purple/15',
    };
  }
  if (n === 'leader') {
    return {
      bar: 'bg-dawn-amber',
      text: 'text-dawn-amber',
      tint: 'bg-dawn-amber/8 border-dawn-amber/20',
    };
  }
  return {
    bar: 'bg-zinc-500',
    text: 'text-zinc-600',
    tint: 'bg-zinc-50 border-zinc-200',
  };
}

function marketPill(val: string, colIndex: number) {
  if (colIndex > 2) return null;
  const n = parsePercent(val);
  if (n >= 30) return 'bg-dawn-green/10 text-emerald-700 ring-1 ring-dawn-green/25';
  if (n >= 20) return 'bg-dawn-amber/10 text-amber-700 ring-1 ring-dawn-amber/25';
  return 'bg-dawn-red/10 text-rose-700 ring-1 ring-dawn-red/20';
}

const SEGMENT_COLORS = ['bg-dawn-navy', 'bg-dawn-teal', 'bg-dawn-purple/40'];

function SectionHeader({
  title,
}: {
  icon: typeof BarChart3;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="min-w-0 flex-1 pb-1">
        <p className="text-xs font-medium uppercase tracking-wider text-dawn-navy">{title}</p>
      </div>
    </div>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export default function PerformanceDashboardModal({
  sessionId,
  onClose,
  onConfirm,
  confirmed = false,
}: PerformanceDashboardModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PerformanceData | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setHasError(false);
      try {
        const res = await getPerformanceEvaluation(sessionId);
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) {
          setHasError(true);
          toast.error(err instanceof Error ? err.message : 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const kpis = data ? Object.values(data.campaign_kpis) : [];
  const markets = data?.market_comparison ?? [];
  const personas = data?.hcp_persona_performance ?? [];
  const audience = data?.audience_auto_tagging ?? null;
  const recommendations = data?.optimization_recommendations ?? [];

  const positiveKpis = kpis.filter((k) => k.is_positive !== false).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl animate-modal-card font-body">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-teal to-[#a855f7] shadow-lg">
              <BarChart3 size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-dawn-navy">
                {data?.header.title ?? 'Content Effectiveness'}
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                {data?.header.description ??
                  'Analyze campaign performance and engagement metrics'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-zinc-400 transition-colors hover:text-zinc-900"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-dawn-surface/60 px-6 py-6">

          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dawn-teal/10">
                <Loader2 size={22} className="animate-spin text-dawn-teal" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-dawn-navy">Loading performance data</p>
                <p className="mt-1 text-xs text-zinc-500">Aggregating campaign metrics…</p>
              </div>
            </div>
          )}

          {hasError && !loading && (
            <div className="rounded-xl border border-dawn-red/20 bg-dawn-red/5 px-4 py-3 text-sm text-rose-700">
              We couldn&apos;t load the dashboard. Please try again.
            </div>
          )}

          {!loading && !hasError && data && (
            <div className="space-y-8">

              {/* Campaign KPIs */}
              <section>
                <SectionHeader
                  icon={BarChart3}
                  title="Campaign KPIs"
                  subtitle={
                    positiveKpis > 0
                      ? `${positiveKpis} of ${kpis.length} metrics trending positively`
                      : undefined
                  }
                />
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {kpis.map((kpi, i) => (
                    <div
                      key={kpi.label}
                      className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-dawn-teal/80 to-dawn-purple/60 opacity-0 transition-opacity group-hover:opacity-100" />
                      <p className="text-[10px] font-normal uppercase tracking-wide text-zinc-500">
                        {kpi.label}
                      </p>
                      <p className="mt-2 text-2xl font-medium tabular-nums tracking-tight text-dawn-navy lg:text-3xl">
                        {kpi.value}
                      </p>
                      {kpi.trend && (
                        <div className="mt-2 flex items-center gap-1">
                          {kpi.is_positive !== false ? (
                            <TrendingUp size={12} className="text-dawn-green" />
                          ) : (
                            <TrendingDown size={12} className="text-dawn-red" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              kpi.is_positive !== false ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {kpi.trend}
                          </span>
                        </div>
                      )}
                      {kpi.benchmark && (
                        <p className="mt-1.5 text-[10px] leading-snug text-zinc-400">
                          {kpi.benchmark}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Market Comparison */}
              {markets.length > 0 && (
                <section>
                  <SectionHeader
                    icon={Globe2}
                    title="Market Comparison"
                    subtitle="Open rate and CTR performance by region"
                  />
                  <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                    <div className="grid grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))] border-b border-zinc-100 bg-zinc-50/80 px-4 py-3 text-[10px] font-normal uppercase tracking-wide text-zinc-500">
                      <span>Market</span>
                      <span>Open Rate</span>
                      <span>CTR</span>
                      <span>DDA Time</span>
                      <span>Poster Downloads</span>
                    </div>
                    <div className="divide-y divide-zinc-100">
                      {markets.map((m, rowIdx) => {
                        const cols = [m.open_rate, m.ctr, m.dda_time, m.poster_downloads];
                        return (
                          <div
                            key={m.market}
                            className={`grid grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))] items-center px-4 py-3.5 text-sm transition-colors hover:bg-dawn-teal/[0.03] ${
                              rowIdx % 2 === 1 ? 'bg-zinc-50/40' : 'bg-white'
                            }`}
                          >
                            <span className="font-medium text-dawn-navy">{m.market}</span>
                            {cols.map((val, i) => {
                              const pill = marketPill(val, i + 1);
                              return pill ? (
                                <span key={i}>
                                  <span
                                    className={`inline-flex min-w-[3rem] items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tabular-nums ${pill}`}
                                  >
                                    {val}
                                  </span>
                                </span>
                              ) : (
                                <span key={i} className="tabular-nums text-zinc-600">
                                  {val}
                                </span>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* HCP Persona Performance */}
              {personas.length > 0 && (
                <section>
                  <SectionHeader
                    icon={Users}
                    title="HCP Persona Performance"
                    subtitle="Engagement scores by physician archetype"
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {personas.map((p) => {
                      const { bar, text, tint } = personaColor(p);
                      const pct = parsePercent(p.score);
                      return (
                        <div
                          key={p.persona}
                          className={`rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md ${tint}`}
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-dawn-navy">{p.persona}</p>
                              <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">
                                {p.description}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 text-xl font-medium tabular-nums leading-none ${text}`}
                            >
                              {p.score}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white/80 ring-1 ring-zinc-200/80">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${bar}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Audience Auto-Tagging */}
              {audience && (
                <section>
                  <SectionHeader
                    icon={Tags}
                    title="Audience Auto-Tagging"
                    subtitle={audience.title}
                  />
                  <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex h-6 w-full overflow-hidden rounded-full ring-1 ring-zinc-200/80">
                      {audience.segments.map((seg, i) => (
                        <div
                          key={seg.name}
                          className={`${SEGMENT_COLORS[i] ?? 'bg-zinc-300'} h-full transition-all`}
                          style={{ width: `${parsePercent(seg.percentage)}%` }}
                          title={`${seg.name}: ${seg.percentage}`}
                        />
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {audience.segments.map((seg, i) => (
                        <div
                          key={seg.name}
                          className="flex items-center gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50/60 px-3 py-2"
                        >
                          <span
                            className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${SEGMENT_COLORS[i] ?? 'bg-zinc-300'}`}
                          />
                          <span className="min-w-0 flex-1 truncate text-xs text-zinc-600">
                            {seg.name}
                          </span>
                          <span className="shrink-0 text-xs font-medium tabular-nums text-dawn-navy">
                            {seg.percentage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Optimization Recommendations */}
              {recommendations.length > 0 && (
                <section>
                  <SectionHeader
                    icon={Lightbulb}
                    title="Optimization Recommendations"
                    subtitle="Actionable insights to improve next-wave performance"
                  />
                  <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                      <div
                        key={rec.finding_id}
                        className="relative overflow-hidden rounded-xl border border-dawn-amber/20 bg-gradient-to-br from-amber-50/80 to-white p-4 pl-5 shadow-sm"
                      >
                        <div className="absolute inset-y-0 left-0 w-1 bg-dawn-amber" />
                        <div className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dawn-amber/15 text-[11px] font-medium text-dawn-amber">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-dawn-navy">{rec.finding_id}</p>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                              {rec.description}
                            </p>
                            <p className="mt-2.5 flex items-start gap-2 text-xs text-zinc-700">
                              <span className="mt-0.5 shrink-0 font-medium text-dawn-teal">Action</span>
                              <span>{rec.action}</span>
                            </p>
                            <span className="mt-3 inline-flex items-center rounded-full bg-dawn-green/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-dawn-green/20">
                              {rec.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!confirmed && (
          <div className="flex shrink-0 justify-end border-t border-zinc-200 bg-white px-6 py-4">
            <Button
              onClick={onConfirm}
              variant="primary"
              size="md"
              rounded="lg"
              disabled={loading || hasError}
            >
              Confirm &amp; Continue →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
