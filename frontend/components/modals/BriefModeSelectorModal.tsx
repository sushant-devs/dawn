'use client';

import { useState } from 'react';
import { X, Pencil, Sparkles } from 'lucide-react';

interface BriefModeSelectorModalProps {
  onConfirm: (mode: 'manual' | 'auto') => void;
  onClose: () => void;
}

export default function BriefModeSelectorModal({ onConfirm, onClose }: BriefModeSelectorModalProps) {
  const [selectedMode, setSelectedMode] = useState<'manual' | 'auto' | null>(null);

  const handleConfirm = () => {
    if (selectedMode) {
      onConfirm(selectedMode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_20px_52px_rgba(15,23,42,0.16)] ring-1 ring-white/70 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e6eafb] bg-gradient-to-r from-[#fcfdff] to-[#f8faff] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-dawn-navy shadow-[0_6px_14px_rgba(13,27,62,0.26)]">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-3xl leading-none text-dawn-navy">Select Brief Mode</h2>
              <p className="mt-1 text-xs text-slate-500">Choose how you want to create your campaign brief</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-all hover:bg-white hover:text-dawn-navy hover:shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Manual Mode */}
            <button
              onClick={() => setSelectedMode('manual')}
              className={`group relative cursor-pointer rounded-xl border p-5 text-left transition-all duration-200 ${
                selectedMode === 'manual'
                  ? 'border-dawn-teal/55 bg-[#f8f9ff] shadow-[0_12px_28px_rgba(95,77,230,0.14)] ring-1 ring-[#dfe3ff]'
                  : 'border-[#e2e7f6] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-dawn-teal/35 hover:shadow-[0_12px_26px_rgba(15,23,42,0.1)]'
              }`}
            >
              {selectedMode === 'manual' && (
                <span className="absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-dawn-teal text-white text-[11px] font-bold shadow-sm">
                  ✓
                </span>
              )}
              <div className="mb-4 flex items-start gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selectedMode === 'manual' ? 'bg-gradient-to-br from-dawn-teal to-[#1A3FCC] text-white shadow-[0_8px_18px_rgba(26,63,204,0.22)]' : 'bg-slate-100 text-gray-500'
                }`}>
                  <Pencil size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-[22px] font-semibold text-dawn-navy">Manual Mode</h3>
                  <p className="text-sm text-slate-500">You control the brief</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-sm leading-snug text-slate-600">Add your own campaign briefs and key messages</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-sm leading-snug text-slate-600">Full control over content direction</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-sm leading-snug text-slate-600">Ideal when you have existing brand guidelines</p>
                </div>
              </div>

              <div className="mt-5 border-t border-[#e7ebf7] pt-4">
                <span className="text-sm text-slate-500">Best for: Established campaigns</span>
              </div>
            </button>

            {/* Auto Mode */}
            <button
              onClick={() => setSelectedMode('auto')}
              className={`group relative cursor-pointer rounded-xl border p-5 text-left transition-all duration-200 ${
                selectedMode === 'auto'
                  ? 'border-dawn-teal/55 bg-[#f8f9ff] shadow-[0_12px_28px_rgba(95,77,230,0.14)] ring-1 ring-[#dfe3ff]'
                  : 'border-[#e2e7f6] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-dawn-teal/35 hover:shadow-[0_12px_26px_rgba(15,23,42,0.1)]'
              }`}
            >
              {selectedMode === 'auto' && (
                <span className="absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-dawn-teal text-white text-[11px] font-bold shadow-sm">
                  ✓
                </span>
              )}
              <div className="mb-4 flex items-start gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selectedMode === 'auto' ? 'bg-gradient-to-br from-dawn-teal to-[#1A3FCC] text-white shadow-[0_8px_18px_rgba(26,63,204,0.22)]' : 'bg-slate-100 text-gray-500'
                }`}>
                  <Sparkles size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-[22px] font-semibold text-dawn-navy">Auto Mode</h3>
                  <p className="text-sm text-slate-500">AI generates the brief</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-sm leading-snug text-slate-600">AI analyzes selected documents automatically</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-sm leading-snug text-slate-600">Extracts key claims and evidence</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-sm leading-snug text-slate-600">You can review and edit before confirming</p>
                </div>
              </div>

              <div className="mt-5 border-t border-[#e7ebf7] pt-4">
                <span className="text-sm text-slate-500">Best for: New campaigns & evidence-based content</span>
              </div>
            </button>
          </div>

          {/* Recommendation */}
          <div className="mt-5 rounded-xl border border-dawn-teal/20 bg-gradient-to-r from-[#f8f9ff] to-[#f2f5ff] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <p className="text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-dawn-navy">Recommendation:</span> Auto mode is ideal for
              evidence-based campaigns where you want AI to extract the strongest claims from clinical data.
              Manual mode gives you complete control when you have predefined messaging.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 rounded-b-2xl border-t border-[#e6eafb] bg-gradient-to-r from-[#f7f9ff] to-[#f3f6ff] px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[#d8dff5] bg-white px-5 py-2.5 text-sm font-medium text-slate-500 shadow-[0_3px_8px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:text-dawn-navy hover:shadow-[0_8px_16px_rgba(15,23,42,0.1)]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedMode}
            className="rounded-xl bg-gradient-to-r from-dawn-teal to-[#1A3FCC] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(26,63,204,0.28)] transition-all hover:-translate-y-0.5 hover:from-[#3B67FF] hover:to-[#1738B8] hover:shadow-[0_16px_30px_rgba(26,63,204,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            Continue with {selectedMode === 'manual' ? 'Manual' : selectedMode === 'auto' ? 'Auto' : 'Selected'} Mode →
          </button>
        </div>
      </div>
    </div>
  );
}
