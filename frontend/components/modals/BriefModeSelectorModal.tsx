'use client';

import { useState } from 'react';
import { X, Pencil, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

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
        <div className="flex items-center justify-between border-b border-dawn-border bg-white px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8624FF] to-[#6B1FCC] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-serif text-lg font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-xl text-dawn-navy font-semibold">Select Brief Mode</h2>
              <p className="text-sm text-gray-500 mt-0.5">Choose how you want to create your campaign brief</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer">
            <X size={22} />
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
                  selectedMode === 'manual' ? 'bg-gradient-to-br from-[#8624FF] to-[#6B1FCC] text-white shadow-[0_8px_18px_rgba(107,31,204,0.28)]' : 'bg-slate-100 text-gray-500'
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
                  selectedMode === 'auto' ? 'bg-gradient-to-br from-[#8624FF] to-[#6B1FCC] text-white shadow-[0_8px_18px_rgba(107,31,204,0.28)]' : 'bg-slate-100 text-gray-500'
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
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
            rounded="xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedMode}
            variant="primary"
            size="md"
            rounded="xl"
          >
            Continue with {selectedMode === 'manual' ? 'Manual' : selectedMode === 'auto' ? 'Auto' : 'Selected'} Mode →
          </Button>
        </div>
      </div>
    </div>
  );
}
