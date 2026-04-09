'use client';

import { useState } from 'react';
import { X, Download, FileImage } from 'lucide-react';

interface ImageGenModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const VARIATIONS = [
  { id: 'var-1', title: 'Variation 1 — Data-Led', gradient: 'linear-gradient(135deg, #0D1B3E 0%, #00A896 100%)', headline: '0.0 Median ABR', subline: '13 injections vs. 156 — HAVEN 4' },
  { id: 'var-2', title: 'Variation 2 — Patient-Centric', gradient: 'linear-gradient(135deg, #1a2f5e 0%, #008575 100%)', headline: '56% Zero Bleeds', subline: 'Monthly prophylaxis. Real freedom.' },
  { id: 'var-3', title: 'Variation 3 — Bold Minimal', gradient: 'linear-gradient(135deg, #0D1B3E 0%, #7C3AED 60%, #00A896 100%)', headline: '13 × / year', subline: 'Hemlibra Q4W — HAVEN 4 data' },
];

type ColorScheme = 'navy-teal' | 'white-blue' | 'warm-orange';
type Format = 'A0 Congress Poster' | 'A4 Print' | 'Digital Banner';

export default function ImageGenModal({ onConfirm, onClose }: ImageGenModalProps) {
  const [selected, setSelected] = useState('var-1');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('navy-teal');
  const [format, setFormat] = useState<Format>('A0 Congress Poster');
  const [contrast, setContrast] = useState(50);
  const [brightness, setBrightness] = useState(50);
  const [brandOverlay, setBrandOverlay] = useState(false);
  const [isiFooter, setIsiFooter] = useState(true);
  const [styleInstructions, setStyleInstructions] = useState(
    'Congress poster for HAVEN 4 data presentation. Deep navy and teal brand palette. Prominently feature the "13 treatments per year" vs "156 infusions" benefit. Include Hemlibra logo, HAVEN 4 citation, and ISI footer zone. Clean clinical aesthetic.'
  );

  const selectedVar = VARIATIONS.find((v) => v.id === selected) ?? VARIATIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-4xl bg-white h-full flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Image Generator</h2>
              <p className="text-xs text-gray-400">Stage 4 — Visual Assets</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy"><X size={20} /></button>
        </div>

        {/* Body — 3-panel layout */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left: Settings */}
          <div className="w-64 border-r border-dawn-border flex flex-col bg-gray-50 overflow-y-auto shrink-0">
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-dawn-navy mb-1.5">Style Instructions</label>
                <textarea
                  value={styleInstructions}
                  onChange={(e) => setStyleInstructions(e.target.value)}
                  rows={5}
                  className="w-full text-xs text-gray-700 bg-white border border-dawn-border rounded-lg p-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-dawn-teal leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dawn-navy mb-1.5">Color Scheme</label>
                <div className="space-y-1.5">
                  {([['navy-teal', 'Deep Navy + Teal'], ['white-blue', 'Clinical White + Blue'], ['warm-orange', 'Patient Warm + Orange']] as [ColorScheme, string][]).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${colorScheme === val ? 'border-dawn-teal' : 'border-gray-300'}`}>
                        {colorScheme === val && <div className="w-2 h-2 rounded-full bg-dawn-teal" />}
                      </div>
                      <span className="text-xs text-dawn-navy">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dawn-navy mb-1.5">Focus Highlight</label>
                <div className="flex flex-wrap gap-1">
                  {['13 treatments/yr', '0.0 ABR', '56% zero bleeds', 'Monthly dosing'].map((chip) => (
                    <span key={chip} className={`rounded-full px-2.5 py-1 text-[10px] font-medium cursor-pointer transition-colors ${chip === '13 treatments/yr' ? 'bg-dawn-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-dawn-sky'}`}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dawn-navy mb-1.5">Format</label>
                <div className="space-y-1.5">
                  {(['A0 Congress Poster', 'A4 Print', 'Digital Banner'] as Format[]).map((f) => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${format === f ? 'border-dawn-teal' : 'border-gray-300'}`}>
                        {format === f && <div className="w-2 h-2 rounded-full bg-dawn-teal" />}
                      </div>
                      <span className="text-xs text-dawn-navy">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center: Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-3 text-center">3 design variations — click to select</p>
            <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
              {VARIATIONS.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelected(v.id)}
                  className={`shrink-0 w-56 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 shadow-sm ${
                    selected === v.id ? 'border-dawn-teal ring-2 ring-dawn-teal/30 shadow-lg' : 'border-white hover:border-dawn-teal/50'
                  }`}
                >
                  <div
                    className="h-40 flex flex-col items-center justify-center relative"
                    style={{ background: v.gradient }}
                  >
                    {selected === v.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-dawn-teal rounded-full flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                    <p className="text-white font-serif text-xl font-bold text-center px-3 leading-tight">{v.headline}</p>
                    <p className="text-white/70 text-xs mt-1 text-center px-3">{v.subline}</p>
                    {isiFooter && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/30 px-2 py-1">
                        <p className="text-white/60 text-[7px] leading-tight">IMPORTANT SAFETY INFORMATION: See full Prescribing Information including Boxed Warning. HEMLIBRA® (emicizumab-kxwh)</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-white px-3 py-2">
                    <p className="text-xs font-medium text-dawn-navy">{v.title}</p>
                    <p className="text-[10px] text-gray-400">Congress Poster · A0</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected details */}
            <div className="mt-3 bg-white rounded-xl border border-dawn-border p-3 flex items-center gap-4">
              <div>
                <p className="text-xs font-medium text-dawn-navy">{selectedVar.title}</p>
                <p className="text-[10px] text-gray-400">Selected — {format}</p>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-400">Width:</span>
                <input type="number" defaultValue={841} className="w-16 text-xs border border-dawn-border rounded px-2 py-1 text-dawn-navy" /> mm
                <span className="text-xs text-gray-400 ml-2">Height:</span>
                <input type="number" defaultValue={1189} className="w-16 text-xs border border-dawn-border rounded px-2 py-1 text-dawn-navy" /> mm
              </div>
            </div>
          </div>

          {/* Right: Tools */}
          <div className="w-52 border-l border-dawn-border bg-gray-50 flex flex-col overflow-y-auto shrink-0">
            <div className="p-4 space-y-4">
              <p className="text-xs font-semibold text-dawn-navy">Adjust</p>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500">Contrast</label>
                  <span className="text-xs text-dawn-navy font-medium">{contrast}</span>
                </div>
                <input type="range" min={0} max={100} value={contrast} onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-dawn-teal" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500">Brightness</label>
                  <span className="text-xs text-dawn-navy font-medium">{brightness}</span>
                </div>
                <input type="range" min={0} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-dawn-teal" />
              </div>

              <div className="pt-1 space-y-2">
                {[
                  { label: 'Apply Brand Overlay', value: brandOverlay, set: setBrandOverlay },
                  { label: 'Add ISI Footer', value: isiFooter, set: setIsiFooter },
                ].map(({ label, value, set }) => (
                  <label key={label} className="flex items-center justify-between gap-2 cursor-pointer">
                    <span className="text-xs text-gray-600">{label}</span>
                    <div
                      onClick={() => set(!value)}
                      className={`w-8 h-4 rounded-full transition-colors relative ${value ? 'bg-dawn-teal' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${value ? 'left-4' : 'left-0.5'}`} />
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-2 space-y-2">
                <button className="w-full flex items-center justify-center gap-2 bg-dawn-navy text-white text-xs font-medium rounded-lg px-3 py-2 hover:bg-dawn-navy/90 transition-colors">
                  <Download size={12} /> Export PNG
                </button>
                <button className="w-full flex items-center justify-center gap-2 border border-dawn-border text-dawn-navy text-xs font-medium rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors">
                  <FileImage size={12} /> Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm">
            Confirm & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
