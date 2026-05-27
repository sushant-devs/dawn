'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Mail, Tablet, Monitor, Users, Building, Share2, Check, Shield, Tag, FileImage, Rocket } from 'lucide-react';
import { DISTRIBUTION_CHANNELS } from '@/lib/mockData';

interface DistributionModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Mail, Tablet, Monitor, Users, Building, Share2,
};

const STEP_INITIAL_DELAY_MS = 1000;
const STEP_INTERVAL_MS = 1500;

const DISTRIBUTION_STEPS = [
  { label: 'Loading MLR-approved assets', description: '4 Brexiva assets retrieved with DAM approval metadata', icon: Shield },
  { label: 'Mapping assets to channels', description: 'Poster, email, leaflet & DDA aligned to selected channels', icon: Share2 },
  { label: 'Applying channel metadata', description: 'Audience segments, delivery dates & market codes', icon: Tag },
  { label: 'Generating channel renditions', description: 'PDF, HTML, DDA & print-ready formats per channel', icon: FileImage },
  { label: 'Ready for deployment', description: 'All channels cleared — confirm to start transfer', icon: Rocket },
];

export default function DistributionModal({ onConfirm, onClose }: DistributionModalProps) {
  const [channels, setChannels] = useState(DISTRIBUTION_CHANNELS);
  const [vaultStep, setVaultStep] = useState(-1);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (vaultStep < 0) return;

    const stepIndex = Math.min(vaultStep, DISTRIBUTION_STEPS.length - 1);
    const scrollEl = bodyScrollRef.current;
    const stepEl = stepRefs.current[stepIndex];
    if (!scrollEl || !stepEl) return;

    const timer = setTimeout(() => {
      const scrollRect = scrollEl.getBoundingClientRect();
      const stepRect = stepEl.getBoundingClientRect();
      const relativeTop = stepRect.top - scrollRect.top + scrollEl.scrollTop;
      const target = relativeTop - scrollEl.clientHeight / 2 + stepRect.height / 2;

      scrollEl.scrollTo({
        top: Math.max(0, target),
        behavior: 'smooth',
      });
    }, 80);

    return () => clearTimeout(timer);
  }, [vaultStep]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setTimeout(() => {
      let step = 0;
      setVaultStep(step);
      interval = setInterval(() => {
        step++;
        if (step >= DISTRIBUTION_STEPS.length) {
          if (interval) clearInterval(interval);
          return;
        }
        setVaultStep(step);
        if (step === DISTRIBUTION_STEPS.length - 1) {
          finishTimer = setTimeout(() => {
            setVaultStep(DISTRIBUTION_STEPS.length);
          }, STEP_INTERVAL_MS);
        }
      }, STEP_INTERVAL_MS);
    }, STEP_INITIAL_DELAY_MS);

    return () => {
      clearTimeout(timer);
      if (finishTimer) clearTimeout(finishTimer);
      if (interval) clearInterval(interval);
    };
  }, []);

  const toggleChannel = (id: string) => {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const enabledCount = channels.filter((c) => c.enabled).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-dawn-border bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Distribution Hub</h2>
              <p className="text-xs text-gray-400">Stage 7 — Multichannel Distribution</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy cursor-pointer"><X size={20} /></button>
        </div>

        {/* Status header */}
        <div className="px-6 py-3 bg-dawn-green/5 border-b border-dawn-green/20">
          <p className="text-sm font-medium text-dawn-green">
            4 Assets — Passed Status Confirmed. Select distribution channels.
          </p>
        </div>

        {/* Body */}
        <div ref={bodyScrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth">
          {/* Channel grid */}
          <div className="grid grid-cols-2 gap-3">
            {channels.map((channel) => {
              const Icon = ICON_MAP[channel.icon] ?? Mail;
              return (
                <div
                  key={channel.id}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    channel.enabled ? 'border-dawn-teal/30 bg-dawn-sky' : 'border-dawn-border bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${channel.enabled ? 'bg-dawn-teal/20' : 'bg-gray-200'}`}>
                        <Icon size={16} className={channel.enabled ? 'text-dawn-teal' : 'text-gray-400'} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-dawn-navy">{channel.name}</p>
                        <p className="text-[10px] text-gray-400">{channel.audience}</p>
                      </div>
                    </div>
                    <div
                      onClick={() => toggleChannel(channel.id)}
                      className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${channel.enabled ? 'bg-dawn-teal' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${channel.enabled ? 'left-4' : 'left-0.5'}`} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500">Asset: <span className="text-dawn-navy font-medium">{channel.asset}</span></p>
                    <div className="flex items-center gap-1">
                      <p className="text-[10px] text-gray-500">Delivery:</p>
                      <input
                        type="date"
                        defaultValue={channel.deliveryDate}
                        className="text-[10px] text-dawn-navy bg-transparent border-0 outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Distribution pipeline */}
          <div className="rounded-xl border border-dawn-navy/10 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-dawn-navy/8 to-dawn-navy/3 border-b border-dawn-navy/10">
              <div className="w-7 h-7 rounded-lg bg-dawn-navy/10 flex items-center justify-center">
                <Share2 size={14} className="text-dawn-navy" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-dawn-navy">Distribution Pipeline</p>
                <p className="text-[10px] text-gray-500">Brexiva HR+/HER2− Campaign — Channel preparation</p>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${vaultStep >= DISTRIBUTION_STEPS.length ? 'bg-dawn-green/15 text-dawn-green' : 'bg-dawn-amber/15 text-dawn-amber'}`}>
                {vaultStep >= DISTRIBUTION_STEPS.length ? 'Complete' : 'In Progress'}
              </div>
            </div>

            <div className="pipeline-steps px-4 py-4 space-y-0">
              {DISTRIBUTION_STEPS.map((step, i) => {
                const completed = vaultStep > i;
                const active = vaultStep === i;
                const flowInProgress = vaultStep >= 0 && vaultStep < DISTRIBUTION_STEPS.length;
                const isLast = i === DISTRIBUTION_STEPS.length - 1;
                const StepIcon = step.icon;
                const rowState = active ? 'pipeline-step-row--active' : completed ? 'pipeline-step-row--completed' : 'pipeline-step-row--pending';
                const faded = flowInProgress && !active;
                return (
                  <div
                    key={step.label}
                    ref={(el) => { stepRefs.current[i] = el; }}
                    className={`pipeline-step-row flex gap-3 rounded-lg px-2 py-1 -mx-2 ${rowState}${faded ? ' pipeline-step-row--faded' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-700 ease-out ${
                        completed
                          ? 'bg-dawn-green border-dawn-green/30 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                          : active
                            ? 'bg-white border-dawn-teal shadow-[0_0_12px_rgba(0,168,150,0.35)]'
                            : 'bg-gray-50 border-gray-200'
                      }`}>
                        {completed ? (
                          <Check size={12} className="text-white" />
                        ) : (
                          <StepIcon size={12} className={active ? 'text-dawn-teal' : 'text-gray-400'} />
                        )}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-6 my-1 rounded-full transition-all duration-700 ease-out ${
                          completed ? 'bg-dawn-green/40' : active ? 'bg-dawn-teal/30' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>

                    <div className="pt-1 pb-3 transition-all duration-700 ease-out">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-medium transition-colors duration-700 ${
                          active ? 'text-dawn-teal' : completed ? 'text-dawn-navy' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                        {active && (
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-dawn-teal animate-pulse" />
                            <span className="w-1.5 h-1.5 rounded-full bg-dawn-teal animate-pulse [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-dawn-teal animate-pulse [animation-delay:300ms]" />
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] mt-0.5 transition-colors duration-700 ${
                        active ? 'text-gray-600' : 'text-gray-500'
                      }`}>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex items-center justify-between">
          <p className="text-xs text-gray-500">{enabledCount} of {channels.length} channels enabled</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button onClick={onConfirm} className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm cursor-pointer">
              Confirm Distribution →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
