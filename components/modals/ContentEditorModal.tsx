'use client';

import { useState } from 'react';
import { X, Bold, Italic, List, Copy, RotateCcw, RefreshCw } from 'lucide-react';
import { GENERATED_ASSETS } from '@/lib/mockData';
import StatusPill from '@/components/shared/StatusPill';

interface ContentEditorModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const PERSONAS = ['Clinical Researcher', 'Nurse Practitioner', 'Patient'];

export default function ContentEditorModal({ onConfirm, onClose }: ContentEditorModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [activePersona, setActivePersona] = useState(0);
  const [contents, setContents] = useState(GENERATED_ASSETS.map((a) => a.content));

  const asset = GENERATED_ASSETS[activeTab];
  const currentContent = contents[activeTab];

  const updateContent = (text: string) => {
    setContents((prev) => {
      const next = [...prev];
      next[activeTab] = text;
      return next;
    });
  };

  const wordCount = currentContent.split(/\s+/).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-3xl bg-white h-full flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Content Editor</h2>
              <p className="text-xs text-gray-400">Stage 3 — Content Creator</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy"><X size={20} /></button>
        </div>

        {/* Asset tabs */}
        <div className="flex border-b border-dawn-border overflow-x-auto">
          {GENERATED_ASSETS.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setActiveTab(i)}
              className={`shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === i
                  ? 'border-dawn-teal text-dawn-teal'
                  : 'border-transparent text-gray-500 hover:text-dawn-navy'
              }`}
            >
              {a.title.split(' — ')[0]}
            </button>
          ))}
        </div>

        {/* Main editor area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left metadata panel */}
          <div className="w-56 border-r border-dawn-border flex flex-col bg-gray-50 shrink-0">
            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Asset</p>
                <p className="text-xs font-semibold text-dawn-navy leading-tight">{asset.title}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-dawn-sky text-dawn-navy rounded-full px-2 py-0.5 text-[10px] font-medium">{asset.persona}</span>
                <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-[10px] font-medium">{asset.language}</span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Word Count</p>
                <p className="text-sm font-bold text-dawn-navy">{wordCount}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">MLR Status</p>
                <StatusPill status={asset.status as 'Passed' | 'Pending' | 'Flagged'} size="sm" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">References Used</p>
                <div className="flex flex-wrap gap-1">
                  {['HAVEN 4 CSR', 'Hemlibra ISI', 'Brand Guide'].map((r) => (
                    <span key={r} className="bg-dawn-teal/10 text-dawn-teal rounded px-1.5 py-0.5 text-[10px]">{r}</span>
                  ))}
                </div>
              </div>
              <div className="pt-2 space-y-2">
                <button className="w-full flex items-center gap-2 text-xs text-dawn-teal border border-dawn-teal/30 rounded-lg px-3 py-2 hover:bg-dawn-teal/5 transition-colors">
                  <RefreshCw size={12} />
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Right editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Persona tabs */}
            <div className="flex gap-1 px-4 pt-3 pb-0">
              {PERSONAS.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setActivePersona(i)}
                  className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors ${
                    activePersona === i ? 'bg-white border border-b-white border-dawn-border text-dawn-navy -mb-px z-10' : 'text-gray-400 hover:text-dawn-navy'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 bg-white border-b border-dawn-border">
              {[
                { icon: Bold, title: 'Bold' },
                { icon: Italic, title: 'Italic' },
                { icon: List, title: 'List' },
              ].map(({ icon: Icon, title }) => (
                <button key={title} title={title} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors">
                  <Icon size={14} />
                </button>
              ))}
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <button title="Copy" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"><Copy size={14} /></button>
              <button title="Undo" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"><RotateCcw size={14} /></button>

              {/* Flag indicator */}
              <div className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] text-amber-700 font-medium">Hover flagged phrases for suggestions</span>
              </div>
            </div>

            {/* Text area */}
            <div className="flex-1 overflow-y-auto p-4">
              <textarea
                value={currentContent}
                onChange={(e) => updateContent(e.target.value)}
                className="w-full h-full min-h-[300px] text-sm text-gray-700 leading-relaxed resize-none outline-none font-sans bg-transparent"
                spellCheck={false}
              />
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-dawn-border bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{wordCount} words</span>
                <span className="w-px h-3 bg-gray-300" />
                <span className="text-xs bg-dawn-green/10 text-dawn-green rounded-full px-2 py-0.5 font-medium">Grade 6.2</span>
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-gray-500 border border-dawn-border rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  Save Draft
                </button>
                <button className="text-xs bg-dawn-amber/10 text-dawn-amber border border-dawn-amber/30 rounded-lg px-3 py-1.5 hover:bg-dawn-amber/20 transition-colors">
                  Mark Ready for MLR
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
