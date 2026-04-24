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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Select Brief Mode</h2>
              <p className="text-xs text-gray-400">Choose how you want to create your campaign brief</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Manual Mode */}
            <button
              onClick={() => setSelectedMode('manual')}
              className={`text-left rounded-xl border-2 p-6 transition-all cursor-pointer ${
                selectedMode === 'manual'
                  ? 'border-dawn-teal bg-dawn-teal/5 shadow-lg'
                  : 'border-dawn-border hover:border-dawn-teal/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedMode === 'manual' ? 'bg-dawn-teal text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Pencil size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-dawn-navy mb-1">Manual Mode</h3>
                  <p className="text-xs text-gray-500">You control the brief</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-xs text-gray-600">Add your own campaign briefs and key messages</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-xs text-gray-600">Full control over content direction</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-xs text-gray-600">Ideal when you have existing brand guidelines</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">Best for: Established campaigns</span>
              </div>
            </button>

            {/* Auto Mode */}
            <button
              onClick={() => setSelectedMode('auto')}
              className={`text-left rounded-xl border-2 p-6 transition-all cursor-pointer ${
                selectedMode === 'auto'
                  ? 'border-dawn-teal bg-dawn-teal/5 shadow-lg'
                  : 'border-dawn-border hover:border-dawn-teal/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedMode === 'auto' ? 'bg-dawn-teal text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Sparkles size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-dawn-navy mb-1">Auto Mode</h3>
                  <p className="text-xs text-gray-500">AI generates the brief</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-xs text-gray-600">AI analyzes selected documents automatically</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-xs text-gray-600">Extracts key claims and evidence</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-dawn-navy mt-1.5 shrink-0" />
                  <p className="text-xs text-gray-600">You can review and edit before confirming</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">Best for: New campaigns & evidence-based content</span>
              </div>
            </button>
          </div>

          {/* Recommendation */}
          <div className="mt-4 p-4 bg-dawn-sky/30 rounded-lg border border-dawn-teal/20">
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-dawn-navy">Recommendation:</span> Auto mode is ideal for
              evidence-based campaigns where you want AI to extract the strongest claims from clinical data.
              Manual mode gives you complete control when you have predefined messaging.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors bg-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedMode}
            className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue with {selectedMode === 'manual' ? 'Manual' : selectedMode === 'auto' ? 'Auto' : 'Selected'} Mode →
          </button>
        </div>
      </div>
    </div>
  );
}
