'use client';

import { useState } from 'react';
import { X, GripVertical, Plus, Minus } from 'lucide-react';
import { MOCK_BRIEF } from '@/lib/mockData';

interface BriefBuilderModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

function ChipInput({ values, onChange, aiPopulated }: { values: string[]; onChange: (v: string[]) => void; aiPopulated?: boolean }) {
  const [input, setInput] = useState('');
  return (
    <div className={`flex flex-wrap gap-1.5 p-2 rounded-lg border min-h-[42px] ${aiPopulated ? 'bg-dawn-teal/5 border-dawn-teal/30' : 'bg-white border-dawn-border'}`}>
      {values.map((v) => (
        <span key={v} className="inline-flex items-center gap-1 bg-dawn-sky text-dawn-navy rounded-full px-2.5 py-0.5 text-xs font-medium">
          {v}
          <button onClick={() => onChange(values.filter((x) => x !== v))} className="text-gray-400 hover:text-dawn-red cursor-pointer">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim()) {
            onChange([...values, input.trim()]);
            setInput('');
          }
        }}
        className="flex-1 min-w-[80px] bg-transparent text-xs outline-none text-dawn-navy placeholder-gray-400"
        placeholder="Add & press Enter"
      />
    </div>
  );
}

export default function BriefBuilderModal({ onConfirm, onClose }: BriefBuilderModalProps) {
  const [brief, setBrief] = useState(MOCK_BRIEF);
  const [messages, setMessages] = useState(brief.keyMessages);

  const updateField = (key: keyof typeof brief, value: string | string[]) => {
    setBrief((prev) => ({ ...prev, [key]: value }));
  };

  const moveMessage = (i: number, dir: -1 | 1) => {
    const next = [...messages];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setMessages(next);
  };

  const deliverableOptions = ['Congress Poster', 'HCP Email (US)', 'HCP Email (DE)', 'Patient Leaflet', 'Digital Detail Aid', 'Social Assets'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] flex max-h-[92vh] flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border bg-white">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Brief Builder</h2>
              <p className="text-xs text-gray-400">Stage 2 — Campaign Brief</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer"><X size={20} /></button>
        </div>

        {/* AI populated notice */}
        <div className="px-6 py-2.5 bg-dawn-teal/5 border-b border-dawn-teal/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-dawn-teal" />
          <p className="text-xs text-dawn-teal">Fields with a teal background were auto-populated by DAWN from your selected evidence.</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Section 1: Campaign Identity */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">1. Campaign Identity</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-dawn-navy mb-1">Campaign Name</label>
                <input
                  value={brief.campaignName}
                  onChange={(e) => updateField('campaignName', e.target.value)}
                  className="w-full bg-dawn-teal/5 border border-dawn-teal/30 rounded-lg px-3 py-2 text-sm text-dawn-navy focus:outline-none focus:ring-2 focus:ring-dawn-navy/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dawn-navy mb-1">Brand</label>
                <select
                  value={brief.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                  className="w-full bg-dawn-teal/5 border border-dawn-teal/30 rounded-lg px-3 py-2 text-sm text-dawn-navy focus:outline-none focus:ring-2 focus:ring-dawn-navy/20"
                >
                  <option>Hemlibra (emicizumab-kxwh)</option>
                  <option>Tecentriq</option>
                  <option>Ocrevus</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-dawn-navy mb-1">Therapeutic Area</label>
                <select
                  value={brief.therapeuticArea}
                  onChange={(e) => updateField('therapeuticArea', e.target.value)}
                  className="w-full bg-dawn-teal/5 border border-dawn-teal/30 rounded-lg px-3 py-2 text-sm text-dawn-navy focus:outline-none focus:ring-2 focus:ring-dawn-navy/20"
                >
                  <option>Hematology — Hemophilia A</option>
                  <option>Oncology</option>
                  <option>Neurology</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-dawn-navy mb-1">Markets</label>
                <ChipInput values={brief.markets} onChange={(v) => updateField('markets', v)} aiPopulated />
              </div>
            </div>
          </section>

          {/* Section 2: Audience */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">2. Audience</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-dawn-navy mb-1">Primary Audience</label>
                <ChipInput values={brief.primaryAudience} onChange={(v) => updateField('primaryAudience', v)} aiPopulated />
              </div>
              <div>
                <label className="block text-xs font-medium text-dawn-navy mb-1">Secondary Audience</label>
                <ChipInput values={brief.secondaryAudience} onChange={(v) => updateField('secondaryAudience', v)} aiPopulated />
              </div>
            </div>
          </section>

          {/* Section 3: Key Messages */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">3. Key Messages</h3>
            <div className="space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className="flex items-start gap-2 bg-dawn-teal/5 border border-dawn-teal/20 rounded-lg px-3 py-2.5">
                  <GripVertical size={14} className="text-gray-300 mt-0.5 shrink-0 cursor-grab" />
                  <p className="flex-1 text-sm text-dawn-navy">{i + 1}. {msg}</p>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveMessage(i, -1)} disabled={i === 0} className="text-gray-300 hover:text-dawn-navy disabled:opacity-30 cursor-pointer">
                      <Plus size={12} />
                    </button>
                    <button onClick={() => moveMessage(i, 1)} disabled={i === messages.length - 1} className="text-gray-300 hover:text-dawn-navy disabled:opacity-30 cursor-pointer">
                      <Minus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Mandatory Inclusions */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">4. Mandatory Inclusions</h3>
            <div className="space-y-2">
              {[
                'Boxed Warning — TMA/Thromboembolism with aPCC',
                'Important Safety Information (ISI)',
                'Fair Balance — benefit/risk prominence',
              ].map((item) => (
                <label key={item} className="flex items-center gap-2 bg-dawn-amber/5 border border-dawn-amber/20 rounded-lg px-3 py-2.5 cursor-not-allowed">
                  <div className="w-4 h-4 rounded border-2 border-dawn-amber bg-dawn-amber/20 flex items-center justify-center shrink-0">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm text-dawn-navy">{item}</span>
                  <span className="ml-auto text-[10px] bg-dawn-amber/20 text-dawn-amber px-1.5 py-0.5 rounded font-medium">Required</span>
                </label>
              ))}
            </div>
          </section>

          {/* Section 5: Deliverables */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">5. Deliverables</h3>
            <div className="grid grid-cols-3 gap-2">
              {deliverableOptions.map((d) => {
                const checked = brief.deliverables.includes(d);
                return (
                  <label key={d} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${checked ? 'bg-dawn-teal/5 border-dawn-teal/30' : 'border-dawn-border hover:bg-gray-50'}`}>
                    <div
                      onClick={() => {
                        updateField('deliverables', checked ? brief.deliverables.filter((x) => x !== d) : [...brief.deliverables, d]);
                      }}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${checked ? 'bg-dawn-teal border-dawn-teal' : 'border-gray-300'}`}
                    >
                      {checked && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-dawn-navy">{d}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Section 6: Timeline & Budget */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">6. Timeline & Budget</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-dawn-navy mb-1">Deadline</label>
                <input
                  value={brief.deadline}
                  onChange={(e) => updateField('deadline', e.target.value)}
                  className="w-full bg-dawn-teal/5 border border-dawn-teal/30 rounded-lg px-3 py-2 text-sm text-dawn-navy focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dawn-navy mb-1">Budget</label>
                <div className="bg-dawn-green/5 border border-dawn-green/30 rounded-lg px-3 py-2">
                  <p className="text-sm font-semibold text-dawn-green">{brief.budget}</p>
                  <div className="w-full bg-dawn-green/20 rounded-full h-1 mt-1.5">
                    <div className="w-0 h-1 rounded-full bg-dawn-green" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm cursor-pointer"
          >
            Confirm Brief & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
