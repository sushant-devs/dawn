'use client';

/**
 * DistributionConfirmModal
 * ────────────────────────
 * Opened after the user finishes the MLR pre-screen and the chat surfaces
 * the "Open Distribution" button. Lists every approved asset (content_type)
 * with a checkbox per row, shows channel mapping + animated distribution
 * pipeline, then calls the distribute API and FileTransferModal on confirm.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { distributeAssets } from '@/lib/distributionApi';
import FileTransferModal from '@/components/modals/FileTransferModal';
import { buildPipelineSteps, STEP_INITIAL_DELAY_MS, STEP_INTERVAL_MS } from '@/constants/pipelineSteps';

export interface DistributionAssetRow {
  mlr_response_id: string;
  asset_id: string;
  content_type: string;
}

function defaultDeliveryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

function summarizeContentTypes(types: string[], max = 3): string {
  if (types.length === 0) return 'No assets selected';
  if (types.length <= max) return types.join(', ');
  return `${types.slice(0, max).join(', ')} & ${types.length - max} more`;
}

interface DistributionConfirmModalProps {
  assets: DistributionAssetRow[];
  onClose: () => void;
  onDistributed: (message: string, distributedAssetIds: string[]) => void;
}

export default function DistributionConfirmModal({
  assets,
  onClose,
  onDistributed,
}: DistributionConfirmModalProps) {
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    [],
  );

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(assets.map((a) => a.asset_id)),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deliveryDates, setDeliveryDates] = useState<Record<string, string>>(() =>
    Object.fromEntries(assets.map((a) => [a.asset_id, defaultDeliveryDate()])),
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [distributionResult, setDistributionResult] = useState<{ message: string; ids: string[] } | null>(null);
  const [vaultStep, setVaultStep] = useState(-1);

  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const selectedAssets = useMemo(
    () => assets.filter((a) => selected.has(a.asset_id)),
    [assets, selected],
  );
  const pipelineSteps = useMemo(
    () => buildPipelineSteps(selectedAssets),
    [selectedAssets],
  );
  const allSelected = selected.size === assets.length && assets.length > 0;
  const pipelineComplete = vaultStep >= pipelineSteps.length;

  useEffect(() => {
    setSelected((prev) => {
      const valid = new Set(assets.map((a) => a.asset_id));
      const next = new Set([...prev].filter((id) => valid.has(id)));
      if (next.size === 0 && assets.length > 0) {
        assets.forEach((a) => next.add(a.asset_id));
      }
      return next;
    });
    setDeliveryDates((prev) => {
      const next = { ...prev };
      for (const a of assets) {
        if (!next[a.asset_id]) next[a.asset_id] = defaultDeliveryDate();
      }
      return next;
    });
  }, [assets]);

  useEffect(() => {
    if (vaultStep < 0) return;

    const stepIndex = Math.min(vaultStep, pipelineSteps.length - 1);
    const scrollEl = bodyScrollRef.current;
    const stepEl = stepRefs.current[stepIndex];
    if (!scrollEl || !stepEl) return;

    const timer = window.setTimeout(() => {
      const scrollRect = scrollEl.getBoundingClientRect();
      const stepRect = stepEl.getBoundingClientRect();
      const relativeTop = stepRect.top - scrollRect.top + scrollEl.scrollTop;
      const target = relativeTop - scrollEl.clientHeight / 2 + stepRect.height / 2;
      scrollEl.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [vaultStep, pipelineSteps.length]);

  useEffect(() => {
    if (assets.length === 0) return;

    let interval: number | undefined;
    let finishTimer: number | undefined;

    const timer = window.setTimeout(() => {
      let step = 0;
      setVaultStep(step);
      interval = window.setInterval(() => {
        step++;
        if (step >= pipelineSteps.length) {
          if (interval) window.clearInterval(interval);
          return;
        }
        setVaultStep(step);
        if (step === pipelineSteps.length - 1) {
          finishTimer = window.setTimeout(() => {
            setVaultStep(pipelineSteps.length);
          }, STEP_INTERVAL_MS);
        }
      }, STEP_INTERVAL_MS);
    }, STEP_INITIAL_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      if (finishTimer) window.clearTimeout(finishTimer);
      if (interval) window.clearInterval(interval);
    };
  }, [assets.length, pipelineSteps.length]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === assets.length ? new Set() : new Set(assets.map((a) => a.asset_id)),
    );
  };

  const handleConfirm = async () => {
    if (submitting || confirmed) return;
    const ids = Array.from(selected);
    if (ids.length === 0) {
      toast.warning('Select at least one asset to distribute.');
      return;
    }
    setSubmitting(true);
    try {
      const idsByMlr = new Map<string, string[]>();
      for (const asset of assets) {
        if (!selected.has(asset.asset_id)) continue;
        const group = idsByMlr.get(asset.mlr_response_id) ?? [];
        group.push(asset.asset_id);
        idsByMlr.set(asset.mlr_response_id, group);
      }

      let distributedCount = 0;
      for (const [mlrId, groupIds] of idsByMlr) {
        const res = await distributeAssets({
          mlr_response_id: mlrId,
          asset_ids: groupIds,
        });
        distributedCount += res.distributed_count;
      }

      const message = `Successfully distributed ${distributedCount} asset${distributedCount === 1 ? '' : 's'} to DAM platform.`;
      setDistributionResult({ message, ids });
      setConfirmed(true);
      setShowTransfer(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Distribution failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransferComplete = useCallback(() => {
    if (distributionResult) {
      onDistributed(distributionResult.message, distributionResult.ids);
    }
    onClose();
  }, [distributionResult, onDistributed, onClose]);

  if (showTransfer) {
    return <FileTransferModal  onComplete={handleTransferComplete} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in font-body">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-teal to-[#a855f7] shadow-lg">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-dawn-navy">
                Distribution Hub
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Confirm assets and channels before pushing to DAM.
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

        {/* Status banner */}
        <div className="shrink-0 border-b border-dawn-teal/20 bg-dawn-teal/5 px-6 py-3">
          <p className="text-sm font-medium text-dawn-teal">
            {assets.length === 0
              ? 'No approved assets available for distribution.'
              : `${selected.size} of ${assets.length} asset${assets.length === 1 ? '' : 's'} selected — MLR passed. Review channels below.`}
          </p>
        </div>

        {/* Body */}
        <div
          ref={bodyScrollRef}
          className="flex-1 min-h-0 overflow-y-auto bg-[#fafafa] px-6 py-5 space-y-5 scroll-smooth"
        >
          {assets.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No approved assets available for distribution.
            </div>
          ) : (
            <>
              {/* Asset selection table */}
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="grid grid-cols-[40px_minmax(0,1fr)_140px] items-center border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                  <button
                    type="button"
                    onClick={toggleAll}
                    className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border transition-colors ${
                      allSelected
                        ? 'border-dawn-teal bg-dawn-teal text-white'
                        : 'border-zinc-300 bg-white hover:border-dawn-teal'
                    }`}
                    title={allSelected ? 'Unselect all' : 'Select all'}
                  >
                    {allSelected && <Check size={12} />}
                  </button>
                  <span>Content Type</span>
                  <span>Approved</span>
                </div>
                <div className="divide-y divide-zinc-100">
                  {assets.map((a) => {
                    const checked = selected.has(a.asset_id);
                    return (
                      <div
                        key={a.asset_id}
                        className={`grid grid-cols-[40px_minmax(0,1fr)_140px] items-center px-4 py-3 transition-colors ${
                          checked ? 'bg-dawn-teal/5' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggle(a.asset_id)}
                          className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border transition-colors ${
                            checked
                              ? 'border-dawn-teal bg-dawn-teal text-white'
                              : 'border-zinc-300 bg-white hover:border-dawn-teal'
                          }`}
                        >
                          {checked && <Check size={12} />}
                        </button>
                        <span className="truncate text-xs font-medium text-zinc-900">
                          {a.content_type}
                        </span>
                        <span className="text-xs text-zinc-600">{todayLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Distribution pipeline */}
              <div className="overflow-hidden rounded-xl border border-dawn-teal/15">
                <div className="flex items-center gap-3 border-b border-dawn-teal/10 bg-gradient-to-r from-dawn-teal/8 to-dawn-teal/3 px-4 py-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-dawn-teal/10">
                    <Share2 size={14} className="text-dawn-teal" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-dawn-navy">Distribution Pipeline</p>
                    <p className="truncate text-[10px] text-zinc-500">
                      {selectedAssets.length > 0
                        ? summarizeContentTypes(selectedAssets.map((a) => a.content_type))
                        : 'Awaiting asset selection'}
                    </p>
                  </div>
                  <div
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      pipelineComplete
                        ? 'bg-dawn-teal/15 text-dawn-teal'
                        : 'bg-dawn-amber/15 text-dawn-amber'
                    }`}
                  >
                    {pipelineComplete ? 'Complete' : 'In Progress'}
                  </div>
                </div>

                <div className="pipeline-steps space-y-0 px-4 py-4">
                  {pipelineSteps.map((step, i) => {
                    const completed = vaultStep > i;
                    const active = vaultStep === i;
                    const flowInProgress = vaultStep >= 0 && vaultStep < pipelineSteps.length;
                    const isLast = i === pipelineSteps.length - 1;
                    const StepIcon = step.icon;
                    const rowState = active
                      ? 'pipeline-step-row--active'
                      : completed
                        ? 'pipeline-step-row--completed'
                        : 'pipeline-step-row--pending';
                    const faded = flowInProgress && !active && !completed;

                    return (
                      <div
                        key={step.label}
                        ref={(el) => {
                          stepRefs.current[i] = el;
                        }}
                        className={`pipeline-step-row flex gap-3 rounded-lg px-2 py-1 ${rowState}${faded ? ' pipeline-step-row--faded' : ''}`}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-700 ease-out ${
                              completed
                                ? 'border-dawn-teal/30 bg-dawn-teal text-white shadow-[0_0_8px_rgba(134,36,255,0.25)]'
                                : active
                                  ? 'border-dawn-teal bg-white shadow-[0_0_12px_rgba(134,36,255,0.35)] pipeline-step-icon--active'
                                  : 'border-zinc-200 bg-zinc-50'
                            }`}
                          >
                            {completed ? (
                              <Check size={12} className="text-white" />
                            ) : (
                              <StepIcon
                                size={12}
                                className={active ? 'text-dawn-teal' : 'text-zinc-400'}
                              />
                            )}
                          </div>
                          {!isLast && (
                            <div
                              className={`my-1 h-6 w-0.5 rounded-full transition-all duration-700 ease-out ${
                                completed
                                  ? 'bg-dawn-teal/40'
                                  : active
                                    ? 'bg-dawn-teal/30'
                                    : 'bg-zinc-200'
                              }`}
                            />
                          )}
                        </div>

                        <div className="pb-3 pt-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-xs font-medium transition-colors duration-700 ${
                                active
                                  ? 'text-dawn-teal'
                                  : completed
                                    ? 'text-dawn-navy'
                                    : 'text-zinc-500'
                              }`}
                            >
                              {step.label}
                            </p>
                            {active && (
                              <span className="flex items-center gap-1">
                                <span className="stream-dot h-1.5 w-1.5 rounded-full bg-dawn-teal" />
                                <span className="stream-dot h-1.5 w-1.5 rounded-full bg-dawn-teal [animation-delay:150ms]" />
                                <span className="stream-dot h-1.5 w-1.5 rounded-full bg-dawn-teal [animation-delay:300ms]" />
                              </span>
                            )}
                          </div>
                          <p
                            className={`mt-0.5 text-[10px] transition-colors duration-700 ${
                              active ? 'text-zinc-600' : 'text-zinc-500'
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-200 bg-white px-6 py-4">
          <p className="text-xs text-zinc-500">
            {selected.size} of {assets.length} selected
            {selectedAssets.length > 0 ? ` · ${selectedAssets.length} channel${selectedAssets.length === 1 ? '' : 's'} mapped` : ''}
          </p>
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="md"
            rounded="lg"
            disabled={submitting || confirmed || selected.size === 0 || !pipelineComplete}
          >
            {submitting ? 'Distributing…' : confirmed ? 'Distributed' : 'Confirm Distribution →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
