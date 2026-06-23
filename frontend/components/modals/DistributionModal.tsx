'use client';

import { useState, useEffect } from 'react';
import { X, Check, Share2 } from 'lucide-react';
import { useCampaignData } from '@/context/DAWNContext';
import Button from '@/components/ui/Button';

interface DistributionModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const APPROVED_DATE = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// Pipeline animation timing. Tuned so each step has room to slide-in / fade
// before the next one takes the spotlight (matches the 0.75s CSS transitions).
const STEP_INITIAL_DELAY_MS = 1000;
const STEP_INTERVAL_MS = 1500;

export default function DistributionModal({ onConfirm, onClose }: DistributionModalProps) {
  const { generatedAssets } = useCampaignData();

  // One distribution row per generated asset for this campaign.
  const assets = generatedAssets;
  const assetCount = assets.length;
  const assetTypeLabel = assets.map((a) => a.title.split(' - ')[0]).join(', ').toUpperCase();

  const steps = [
    {
      label: 'Loading MLR-approved assets',
      description: `${assetCount} asset${assetCount === 1 ? '' : 's'} retrieved with DAM approval metadata`,
    },
    {
      label: 'Mapping assets to channels',
      description: `${assetTypeLabel} aligned to selected channels`,
    },
    {
      label: 'Applying channel metadata',
      description: 'Audience segments, delivery dates & market codes applied per asset',
    },
    {
      label: 'Generating channel renditions',
      description: `Export formats prepared for ${assetCount} selected asset${assetCount === 1 ? '' : 's'}`,
    },
    {
      label: 'Ready for deployment',
      description: 'All channels cleared — confirm to start transfer to DAM',
    },
  ];

  const [vaultStep, setVaultStep] = useState(-1);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setTimeout(() => {
      let step = 0;
      setVaultStep(step);
      interval = setInterval(() => {
        step++;
        if (step >= steps.length) {
          if (interval) clearInterval(interval);
          return;
        }
        setVaultStep(step);
        if (step === steps.length - 1) {
          finishTimer = setTimeout(() => {
            setVaultStep(steps.length);
          }, STEP_INTERVAL_MS);
        }
      }, STEP_INTERVAL_MS);
    }, STEP_INITIAL_DELAY_MS);

    return () => {
      clearTimeout(timer);
      if (finishTimer) clearTimeout(finishTimer);
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const complete = vaultStep >= steps.length;
  const flowInProgress = vaultStep >= 0 && vaultStep < steps.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-dawn-border bg-white shadow-[0_24px_64px_rgba(13,27,62,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dawn-border bg-white px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8624FF] to-[#6B1FCC] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-serif text-lg font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-dawn-navy">Distribution Hub</h2>
              <p className="mt-0.5 text-sm text-gray-500">Confirm assets and channels before pushing to DAM.</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer text-gray-400 transition-colors hover:text-dawn-navy">
            <X size={22} />
          </button>
        </div>

        {/* Status notice */}
        <div className="border-b border-dawn-teal/20 bg-dawn-sky px-6 py-3">
          <p className="text-sm font-medium text-dawn-teal">
            {assetCount} of {assetCount} asset{assetCount === 1 ? '' : 's'} selected — MLR passed. Review channels below.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {/* Content type / approved table */}
          <div className="overflow-hidden rounded-xl border border-dawn-border">
            <div className="flex items-center justify-between border-b border-dawn-border bg-slate-50 px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Content Type</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Approved</span>
            </div>
            {assets.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-dawn-border bg-dawn-sky/50 px-4 py-3 last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-dawn-teal">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium uppercase tracking-wide text-dawn-navy">
                    {a.title.split(' - ')[0]}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{APPROVED_DATE}</span>
              </div>
            ))}
          </div>

          {/* Distribution Pipeline */}
          <div className="overflow-hidden rounded-xl border border-dawn-border">
            <div className="flex items-center gap-3 border-b border-dawn-border bg-dawn-sky/60 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dawn-sky">
                <Share2 size={15} className="text-dawn-teal" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-dawn-navy">Distribution Pipeline</p>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">{assetTypeLabel}</p>
              </div>
              <div className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${complete ? 'bg-dawn-teal/15 text-dawn-teal' : 'bg-dawn-purple/15 text-dawn-purple'}`}>
                {complete ? 'Complete' : 'In Progress'}
              </div>
            </div>

            {/* Steps */}
            <div className="pipeline-steps px-4 py-4">
              {steps.map((step, i) => {
                const completed = vaultStep > i;
                const active = vaultStep === i;
                const isLast = i === steps.length - 1;
                const rowState = active
                  ? 'pipeline-step-row--active'
                  : completed
                    ? 'pipeline-step-row--completed'
                    : 'pipeline-step-row--pending';
                const faded = flowInProgress && !active;
                return (
                  <div
                    key={step.label}
                    className={`pipeline-step-row -mx-2 flex gap-3 rounded-lg px-2 py-1 ${rowState}${faded ? ' pipeline-step-row--faded' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                          completed
                            ? 'border-dawn-teal/30 bg-dawn-teal'
                            : active
                              ? 'border-dawn-teal bg-white'
                              : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        {completed ? (
                          <Check size={12} className="text-white" strokeWidth={3} />
                        ) : (
                          <span className={`h-2 w-2 rounded-full ${active ? 'bg-dawn-teal' : 'bg-gray-300'}`} />
                        )}
                      </div>
                      {!isLast && (
                        <div className={`my-1 h-6 w-0.5 rounded-full transition-all duration-500 ${completed ? 'bg-dawn-teal/40' : active ? 'bg-dawn-teal/30' : 'bg-gray-200'}`} />
                      )}
                    </div>

                    <div className="pt-0.5 pb-3 transition-all duration-300">
                      <p className={`text-sm font-semibold ${active ? 'text-dawn-teal' : completed ? 'text-dawn-navy' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-500">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-dawn-border bg-white px-6 py-4">
          <p className="text-xs text-gray-500">
            {assetCount} of {assetCount} selected · {assetCount} channel{assetCount === 1 ? '' : 's'} mapped
          </p>
          <Button onClick={onConfirm} disabled={!complete} variant="primary" size="md" rounded="lg">
            Confirm Distribution →
          </Button>
        </div>
      </div>
    </div>
  );
}
