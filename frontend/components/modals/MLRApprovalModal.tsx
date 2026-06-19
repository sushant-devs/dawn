'use client';

/**
 * MLRApprovalModal
 * ────────────────
 * Shown when the orchestrator pauses on the ``human_mlr_review`` HITL after
 * the MLR agent flags Tier 2 / Tier 3 issues on one or more generated
 * assets. The modal renders one card per flagged asset with its risk tier,
 * a flat list of the composite_feedback issues, and approve / reject
 * controls. On confirm it emits a structured decisions array that
 * orchestrator_runner translates into the form the orchestrator expects.
 *
 * Approve and reject must be set for every flagged asset — the Continue
 * button stays disabled until they are.
 */

import { useMemo, useState } from 'react';
import { X, AlertTriangle, ShieldCheck, ShieldX } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface MLRReviewIssue {
  domain?: string;
  severity?: string;
  description?: string;
  phrase?: string;
  source?: string;
  suggestion?: string;
}

export interface MLRReviewAsset {
  content_type: string;
  final_risk_tier?: string | null;
  flags_count?: number;
  status?: string;
  composite_feedback?: MLRReviewIssue[];
}

export interface MLRDecision {
  content_type: string;
  action: 'approve' | 'reject';
  comment?: string;
}

interface MLRApprovalModalProps {
  assets: MLRReviewAsset[];
  onConfirm: (decisions: MLRDecision[]) => void;
  onClose: () => void;
}

function tierColor(tier?: string | null): string {
  switch ((tier || '').toUpperCase()) {
    case 'TIER_3':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'TIER_2':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'TIER_1':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-zinc-50 text-zinc-600 border-zinc-200';
  }
}

function severityColor(severity?: string): string {
  switch ((severity || '').toUpperCase()) {
    case 'HIGH':
      return 'bg-rose-100 text-rose-700';
    case 'MEDIUM':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-zinc-100 text-zinc-700';
  }
}

export default function MLRApprovalModal({
  assets,
  onConfirm,
  onClose,
}: MLRApprovalModalProps) {
  const [decisions, setDecisions] = useState<Record<string, MLRDecision>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const totalAssets = assets.length;
  const decidedCount = useMemo(
    () => assets.filter((a) => decisions[a.content_type]).length,
    [assets, decisions],
  );
  const canConfirm = decidedCount === totalAssets;

  const handleSetAction = (asset: MLRReviewAsset, action: 'approve' | 'reject') => {
    setDecisions((prev) => ({
      ...prev,
      [asset.content_type]: {
        content_type: asset.content_type,
        action,
        comment: comments[asset.content_type] ?? '',
      },
    }));
  };

  const handleSetComment = (asset: MLRReviewAsset, value: string) => {
    setComments((prev) => ({ ...prev, [asset.content_type]: value }));
    setDecisions((prev) => {
      const existing = prev[asset.content_type];
      if (!existing) return prev;
      return {
        ...prev,
        [asset.content_type]: { ...existing, comment: value },
      };
    });
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(Object.values(decisions));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dawn-border bg-white px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 shadow-lg">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-dawn-navy font-medium">
                MLR review needs your decision
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {totalAssets} asset{totalAssets === 1 ? '' : 's'} flagged Tier 2 / Tier 3.
                Approve or reject each before the run can finish.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#fafafa]">
          {totalAssets === 0 ? (
            <div className="text-center py-12 text-sm text-zinc-500">
              No assets need review. You can dismiss this dialog.
            </div>
          ) : (
            <div className="space-y-4">
              {assets.map((asset) => {
                const decision = decisions[asset.content_type];
                const isApproved = decision?.action === 'approve';
                const isRejected = decision?.action === 'reject';

                return (
                  <div
                    key={asset.content_type}
                    className={`rounded-xl border bg-white p-5 transition-shadow shadow-sm ${
                      decision ? 'border-zinc-300 shadow-md' : 'border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-zinc-900 truncate">
                          {asset.content_type}
                        </h3>
                        <p className="text-[11px] text-zinc-500">
                          {asset.flags_count ?? 0} compliance issue
                          {(asset.flags_count ?? 0) === 1 ? '' : 's'}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tierColor(asset.final_risk_tier)}`}
                      >
                        {(asset.final_risk_tier || 'UNKNOWN').replace('_', ' ')}
                      </span>
                    </div>

                    {asset.composite_feedback && asset.composite_feedback.length > 0 && (
                      <ul className="mb-4 space-y-2 max-h-48 overflow-y-auto">
                        {asset.composite_feedback.map((issue, i) => (
                          <li
                            key={`${asset.content_type}-${i}`}
                            className="flex items-start gap-2 rounded-md border border-zinc-100 bg-white px-3 py-2"
                          >
                            <span
                              className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${severityColor(issue.severity)}`}
                            >
                              {issue.severity || 'INFO'}
                            </span>
                            <div className="min-w-0 text-[12px] text-zinc-700">
                              {issue.domain && (
                                <span className="font-medium text-zinc-900">
                                  {issue.domain}:{' '}
                                </span>
                              )}
                              {issue.description ||
                                issue.suggestion ||
                                issue.phrase ||
                                'Issue flagged'}
                              {issue.source && (
                                <span className="block text-[11px] text-zinc-500 mt-0.5">
                                  Source: {issue.source}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <textarea
                      value={comments[asset.content_type] ?? ''}
                      onChange={(e) => handleSetComment(asset, e.target.value)}
                      placeholder="Optional comment (e.g. why you're approving despite the flag, or what to fix)"
                      className="mb-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 placeholder:text-zinc-400 focus:border-[#8624FF] focus:outline-none focus:ring-1 focus:ring-[#8624FF]/30"
                      rows={2}
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetAction(asset, 'approve')}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                          isApproved
                            ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                            : 'border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        <ShieldCheck size={14} />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetAction(asset, 'reject')}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                          isRejected
                            ? 'border-rose-500 bg-rose-500 text-white shadow-sm'
                            : 'border-rose-200 bg-white text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        <ShieldX size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 rounded-b-2xl border-t border-[#e6eafb] bg-gradient-to-r from-[#f7f9ff] to-[#f3f6ff] px-6 py-4">
          <p className="text-xs text-zinc-600">
            {decidedCount} of {totalAssets} decided
          </p>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary" size="md" rounded="lg">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!canConfirm}
              variant="primary"
              size="md"
              rounded="lg"
            >
              Submit decisions →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
