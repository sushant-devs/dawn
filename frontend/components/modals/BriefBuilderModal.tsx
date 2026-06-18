'use client';

import { X, CheckCircle2 } from 'lucide-react';
import { useCampaignData } from '@/context/DAWNContext';
import Button from '@/components/ui/Button';

interface BriefBuilderModalProps {
  onConfirm: () => void;
  onClose: () => void;
  readOnly?: boolean;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-dawn-border/60 px-4 py-2.5 last:border-0">
      <span className="w-36 shrink-0 text-xs font-medium text-dawn-teal">{label}</span>
      <span className="text-sm font-medium text-dawn-navy">{value}</span>
    </div>
  );
}

export default function BriefBuilderModal({ onConfirm, onClose, readOnly = false }: BriefBuilderModalProps) {
  const { brief } = useCampaignData();

  const audience = brief.primaryAudience.join(', ');
  const markets = brief.markets.join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dawn-border bg-white px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#8624FF] to-[#6B1FCC] shadow-lg">
              <span className="font-serif text-lg font-bold text-white">D</span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-dawn-navy">Brief Builder</h2>
              <p className="mt-0.5 text-sm text-gray-500">Review and confirm your campaign brief</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer text-gray-400 transition-colors hover:text-dawn-navy">
            <X size={22} />
          </button>
        </div>

        {/* AI-generated notice */}
        <div className="flex items-center gap-2 border-b border-dawn-teal/20 bg-dawn-teal/5 px-6 py-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-dawn-teal" />
          <p className="text-xs text-dawn-teal">AI-generated brief — review and confirm your deliverables.</p>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Campaign Summary */}
          <section className="overflow-hidden rounded-xl border border-dawn-border">
            <div className="border-b border-dawn-border bg-slate-50 px-4 py-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-dawn-navy/55">Campaign Summary</h3>
            </div>
            <div>
              <SummaryRow label="Brand" value={brief.brand} />
              <SummaryRow label="Therapeutic Area" value={brief.therapeuticArea} />
              <SummaryRow label="Markets" value={markets} />
              <SummaryRow label="Audience" value={audience} />
            </div>
          </section>

          {/* Deliverables */}
          <section className="overflow-hidden rounded-xl border border-dawn-border">
            <div className="flex items-center justify-between border-b border-dawn-border bg-slate-50 px-4 py-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-dawn-navy/55">Deliverables</h3>
              <span className="text-[11px] text-gray-400">{brief.deliverables.length} item{brief.deliverables.length === 1 ? '' : 's'}</span>
            </div>
            <div className="space-y-1 px-4 py-3">
              {brief.deliverables.map((d) => (
                <div key={d} className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="shrink-0 text-dawn-teal" />
                  <span className="text-sm text-dawn-navy">{d}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Key Messages */}
          <section className="overflow-hidden rounded-xl border border-dawn-border">
            <div className="border-b border-dawn-border bg-slate-50 px-4 py-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-dawn-navy/55">Key Messages</h3>
            </div>
            <ul className="space-y-2.5 px-4 py-3">
              {brief.keyMessages.map((msg, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dawn-teal" />
                  <span className="text-sm leading-relaxed text-dawn-navy">{msg}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Mandatory Inclusions */}
          {brief.mandatoryInclusions.length > 0 && (
            <section className="overflow-hidden rounded-xl border border-dawn-amber/30 bg-dawn-amber/5">
              <div className="flex items-center justify-between border-b border-dawn-amber/20 bg-dawn-amber/10 px-4 py-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-dawn-amber">Mandatory Inclusions</h3>
                <span className="text-[11px] font-medium text-dawn-amber/70">{brief.mandatoryInclusions.length} item{brief.mandatoryInclusions.length === 1 ? '' : 's'}</span>
              </div>
              <ul className="space-y-2.5 px-4 py-3">
                {brief.mandatoryInclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dawn-amber" />
                    <span className="text-sm leading-relaxed text-dawn-navy">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        {!readOnly && (
          <div className="flex justify-end gap-3 border-t border-dawn-border bg-white px-6 py-4">
            <Button onClick={onClose} variant="secondary" size="md" rounded="lg">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="primary" size="md" rounded="lg">
              Continue with Auto Mode →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
