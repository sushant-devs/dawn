'use client';

import { useMemo, useState } from 'react';
import {
  X, Check, ChevronLeft, ChevronRight,
  FileText, Zap, Sparkles, ShieldCheck,
} from 'lucide-react';
import type { MLRPreScreenAsset, MLRPreScreenPayload } from '@/lib/types';

export interface MLRApprovalResult {
  asset_id: string;
  content_type: string;
  message: string;
}

interface MLRPreScreenModalProps {
  payload: MLRPreScreenPayload;
  onClose: () => void;
  /** Retained for callers; no longer invoked (review is read-only now). */
  onApprovedAll?: (results: MLRApprovalResult[]) => void;
}

// ── helpers ────────────────────────────────────────────────────────────────────

function tierLabel(tier?: string | null) {
  return (tier || 'UNKNOWN').replace('TIER_', 'Tier ');
}

function tierColor(tier?: string | null) {
  switch ((tier || '').toUpperCase()) {
    case 'TIER_1': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'TIER_2': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'TIER_3': return 'bg-rose-50 text-rose-700 border-rose-200';
    default:       return 'bg-zinc-50 text-zinc-600 border-zinc-200';
  }
}

function statusColor(asset: MLRPreScreenAsset) {
  if (asset.approved) return 'bg-emerald-100 text-emerald-700';
  return 'bg-amber-100 text-amber-700';
}

function statusLabel(asset: MLRPreScreenAsset) {
  return asset.approved ? 'Passed' : 'Pending';
}


function cohesionPct(value: string | undefined): number {
  if (!value) return 0;
  const num = parseInt(String(value).replace('%', '').trim(), 10);
  return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 0;
}

function fairBalancePct(score?: string): number {
  if (!score) return 0;
  const num = parseInt(score.split('/')[0], 10);
  const den = parseInt(score.split('/')[1] ?? '100', 10);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return 0;
  return Math.round((num / den) * 100);
}

function pufferyColor(val?: string) {
  if (!val || val.toLowerCase() === 'none') return 'text-emerald-600';
  return 'text-rose-600';
}

// abbreviated content-type initials for sidebar avatar
function initials(ct: string) {
  const words = ct.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// ── component ──────────────────────────────────────────────────────────────────

export default function MLRPreScreenModal({
  payload,
  onClose,
}: MLRPreScreenModalProps) {
  const assets = useMemo(
    () => payload.asset_evaluations ?? [],
    [payload.asset_evaluations],
  );

  const [selectedId, setSelectedId] = useState<string>(assets[0]?.asset_id ?? '');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const selected: MLRPreScreenAsset | undefined = useMemo(
    () => assets.find((a) => a.asset_id === selectedId) ?? assets[0],
    [assets, selectedId],
  );

  const cohesionEntries = Object.entries(payload.campaign_cohesion ?? {});
  const veeva = payload.veeva_integration;

  const fbPct = fairBalancePct(selected?.fair_balance_score);

  const isiComplete =
    selected?.isi_completeness ??
    (selected?.final_risk_tier || '').toUpperCase() === 'TIER_1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.16)]">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8624FF] to-[#a855f7] shadow-lg">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-medium text-slate-900 text-left">MLR Pre-Screen</h2>
              <p className="text-xs text-slate-500 mt-0.5">Review AI pre-screen analysis and recommendations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 transition-colors hover:text-zinc-900 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden bg-[#f5f7fa]">

          {/* Sidebar */}
          <div className={`flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 shrink-0 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              {!sidebarCollapsed && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-900">Assets</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">Select to review</p>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed((v) => !v)}
                className="ml-auto cursor-pointer rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {sidebarCollapsed ? (
                <div className="space-y-2 p-2">
                  {assets.map((a, idx) => {
                    const active = a.asset_id === selected?.asset_id;
                    return (
                      <button
                        key={a.asset_id}
                        onClick={() => setSelectedId(a.asset_id)}
                        title={a.content_type}
                        className={`flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 text-xs font-medium transition-all ${
                          active ? 'border-[#8624FF] bg-[#8624FF] text-white' : 'border-zinc-200 bg-white text-zinc-500 hover:border-[#8624FF]/50'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  {assets.map((a) => {
                    const active = a.asset_id === selected?.asset_id;
                    return (
                      <div
                        key={a.asset_id}
                        onClick={() => setSelectedId(a.asset_id)}
                        className={`flex cursor-pointer items-center gap-3 border-b border-zinc-100 px-4 py-3 transition-colors ${
                          active ? 'border-l-2 border-l-[#8624FF] bg-violet-50' : 'hover:bg-zinc-50'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          <span className="text-[10px] font-medium text-slate-600">{initials(a.content_type)}</span>
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-zinc-900">{a.content_type}</p>
                          <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                            {/* Tier badge */}
                            <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${tierColor(a.final_risk_tier)}`}>
                              {tierLabel(a.final_risk_tier)}
                            </span>
                            {/* Status badge */}
                            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${statusColor(a)}`}>
                              ● {statusLabel(a)}
                            </span>
                          </div>
                        </div>
                        {/* Active check */}
                        {active && (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8624FF]">
                            <Check size={11} className="text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right pane */}
          <div className="flex-1 overflow-y-auto bg-white p-6 space-y-4">
            {!selected ? (
              <div className="py-12 text-center text-sm text-zinc-500">No asset evaluations available.</div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-sm font-semibold uppercase tracking-wide text-zinc-900">
                    {selected.content_type}
                  </h3>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Fair Balance
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Puffery
                    </span>
                  </div>
                </div>

                {/* Draft content */}
                {selected.content_text && (
                  <div className="rounded-xl border border-zinc-200 bg-white">
                    <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2">
                      <FileText size={13} className="text-zinc-500" />
                      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">Draft content</span>
                    </div>
                    <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap break-words p-4 font-sans text-[11px] leading-relaxed text-zinc-700 text-left">
                      {selected.content_text}
                    </pre>
                  </div>
                )}

                {/* ── AI Pre-Screen Report ──────────────────────────────────── */}
                <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4 text-left">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500">AI Pre-Screen Report</p>

                  {/* Fair Balance Score + ISI Completeness */}
                  <div className="space-y-1.5">
                    <p className="text-[12px] text-zinc-500">Fair Balance Score</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all"
                          style={{ width: `${fbPct}%` }}
                        />
                      </div>
                      <span className="text-[15px] font-bold text-zinc-800 shrink-0">
                        {selected.fair_balance_score != null ? `${selected.fair_balance_score}/100` : '—'}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[12px] text-zinc-500">ISI Completeness</span>
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full shrink-0 ${isiComplete ? 'bg-emerald-100' : 'bg-zinc-100'}`}>
                          <Check size={12} className={isiComplete ? 'text-emerald-600' : 'text-zinc-300'} strokeWidth={3} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Puffery Detected */}
                  <div>
                    <p className="text-[12px] text-zinc-500 mb-0.5">Puffery Detected</p>
                    <p className={`text-[14px] font-bold ${pufferyColor(selected.puffery_detected)}`}>
                      {selected.puffery_detected || 'None'}
                    </p>
                  </div>
                </div>

                {/* ── AI Insights & Recommendations ────────────────────────── */}
                {selected.ai_insights && selected.ai_insights.length > 0 && (
                  <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles size={13} className="text-[#8624FF]" />
                      <p className="text-[11px] font-medium text-zinc-800">AI Insights &amp; Recommendations</p>
                    </div>
                    <ul className="space-y-1.5">
                      {selected.ai_insights.map((ins, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[12px] text-zinc-700">
                          <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-[#8624FF]" />
                          <span>
                            <span className="font-medium text-zinc-900">{ins.label}:</span>{' '}
                            {ins.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── Total Review — Campaign Cohesion ──────────────────────── */}
                {cohesionEntries.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Zap size={13} className="text-[#8624FF]" />
                      <p className="text-[11px] font-medium text-zinc-800">Total Review — Campaign Cohesion</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {cohesionEntries.map(([label, value]) => {
                        const pct = cohesionPct(value);
                        return (
                          <div key={label}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[10px] text-zinc-500">{label}</p>
                              <span className="text-[10px] font-medium text-zinc-700">{value}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-[10px] text-zinc-400 italic">
                      All {assets.length} assets analysed as a cohesive campaign unit — no conflicting messages detected
                    </p>
                  </div>
                )}

                {/* ── Veeva PromoMats Integration ───────────────────────────── */}
                {veeva && (
                  <div className="rounded-xl border border-zinc-200 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <ShieldCheck size={13} className="text-zinc-600" />
                      <p className="text-[11px] font-medium text-zinc-800">{veeva.title}</p>
                    </div>
                    <p className="text-[11px] text-zinc-500 mb-3">{veeva.description}</p>
                    {veeva.indicators && veeva.indicators.length > 0 && (
                      <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Check size={11} className="text-emerald-600" />
                          <p className="text-[10px] font-medium text-zinc-600">Pre-check results will transfer to Veeva with visual indicators:</p>
                        </div>
                        <ul className="space-y-1 pl-4">
                          {veeva.indicators.map((ind, i) => (
                            <li key={i} className="text-[11px] text-zinc-600 list-disc">{ind}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
