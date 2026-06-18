'use client';

import { X, FileText } from 'lucide-react';
import { useCampaignData } from '@/context/DAWNContext';

interface ManualBriefPreviewModalProps {
  onClose: () => void;
}

export default function ManualBriefPreviewModal({ onClose }: ManualBriefPreviewModalProps) {
  const { brief } = useCampaignData();

  // Prefer the exact title + content the user submitted in manual mode. Fall back
  // to a composed paragraph from the brief fields for campaigns that don't define one.
  const briefText = brief.manualBrief
    ? `${brief.manualBrief.title}: ${brief.manualBrief.content}`
    : [
        `${brief.campaignName}-Content Brief: Create a multi-deliverable campaign-content brief for ${brief.brand} in ${brief.therapeuticArea}, targeting ${brief.markets.join(', ')}.`,
        `The primary audience is ${brief.primaryAudience.join(' and ')}.`,
        brief.keyMessages.length > 0 && `Develop the brief around the key message theme: ${brief.keyMessages.join(' ')}`,
        brief.deliverables.length > 0 && `Include the following deliverables: ${brief.deliverables.join(', ')}.`,
        brief.mandatoryInclusions.length > 0 && `Include these mandatory inclusions: ${brief.mandatoryInclusions.join(', ')}.`,
      ]
        .filter(Boolean)
        .join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dawn-border bg-white px-6 py-5">
          <div>
            <h2 className="font-serif text-xl font-semibold text-dawn-navy">Brief Builder</h2>
          </div>
          <button onClick={onClose} className="cursor-pointer text-gray-400 transition-colors hover:text-dawn-navy">
            <X size={22} />
          </button>
        </div>

        {/* Read-only notice */}
        <div className="flex items-center gap-2 border-b border-dawn-border bg-slate-50 px-6 py-2.5">
          <FileText size={14} className="text-gray-500" />
          <p className="text-xs text-gray-600">Manual brief — read-only preview</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <section className="overflow-hidden rounded-xl border border-dawn-border">
            <div className="border-b border-dawn-border bg-slate-50 px-4 py-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-dawn-navy/55">Brief submitted by you</h3>
            </div>
            <div className="px-4 py-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-dawn-navy">{briefText}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
