'use client';

import { useState } from 'react';
import { X, Bold, Italic, List, Copy, RotateCcw, RefreshCw, Download, FileImage } from 'lucide-react';
import { GENERATED_ASSETS } from '@/lib/mockData';
import StatusPill from '@/components/shared/StatusPill';

const CONTENT_REFERENCES: Record<string, { source: string; regional: string[] }> = {
  poster: {
    source: 'Poster - HAVEN 4 Data (EN master)',
    regional: ['Brand Guidelines', 'Master creative asset', 'Global HCP messaging'],
  },
  'email-us': {
    source: 'HCP Email (US) (EN master)',
    regional: ['Hemlibra ISI', 'Brand Guidelines', 'Global HCP email best practices'],
  },
  'email-de': {
    source: 'HCP Email (US) (EN master)',
    regional: ['German medical poster rules', 'German HCP communication conventions', 'Hemlibra Fachinformation / ISI'],
  },
  leaflet: {
    source: 'Patient Leaflet (EN master)',
    regional: ['Hemlibra ISI', 'Patient-friendly readability guidance'],
  },
  dda: {
    source: 'Digital Detail Aid (EN master)',
    regional: ['Brand Guidelines', 'Field force presentation standards', 'Hemlibra ISI'],
  },
};

// Source attribution data for each content section
function getDetailedSources(assetId: string) {
  const sources: Record<string, Array<{ section: string; source: string; guideline: string; colorClass: string }>> = {
    poster: [
      {
        section: 'Title & Background',
        source: 'HEMLIBRA_clinical report.pdf (HAVEN 1 CSR)',
        guideline: 'Scientific Congress Poster format (ICMJE standards)',
        colorClass: 'bg-blue-200 border border-blue-400',
      },
      {
        section: 'Methods Section',
        source: 'HEMLIBRA_emicizumab-kxwh_research_ppr.pdf (HAVEN 4)',
        guideline: 'Medical Communication Guidelines - Study methodology presentation',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Results Data',
        source: 'HEMLIBRA_emicizumab-kxwh_research_ppr.pdf (HAVEN 4 - Table 2, p.14)',
        guideline: 'Medical Communication Guidelines - Statistical reporting',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Conclusion',
        source: 'HAVEN 4 Clinical Study Report (Primary endpoints)',
        guideline: 'hemlibra-medical-guid.pdf - Evidence-based conclusions',
        colorClass: 'bg-green-200 border border-green-400',
      },
      {
        section: 'Safety Information',
        source: 'HEMLIBRA-MLR.pdf (MLR Review Protocols)',
        guideline: 'HEMLIBRA-MLR.pdf - Boxed warning requirements',
        colorClass: 'bg-green-200 border border-green-400',
      },
    ],
    'email-us': [
      {
        section: 'Subject Line',
        source: 'Professional HCP Email Template',
        guideline: 'hemlibra-medical-guid.pdf - 28% higher open rate format',
        colorClass: 'bg-amber-200 border border-amber-400',
      },
      {
        section: 'Opening Paragraph',
        source: 'Empathetic Specialist persona guidelines',
        guideline: 'Brand Guidelines - Patient-centric tone',
        colorClass: 'bg-amber-200 border border-amber-400',
      },
      {
        section: 'Clinical Data',
        source: 'HEMLIBRA_emicizumab-kxwh_research_ppr.pdf (HAVEN 4)',
        guideline: 'Medical Communication Guidelines - Endpoint presentation',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Practice Benefits',
        source: 'HAVEN 4 Study + Standard of Care data',
        guideline: 'Treatment burden comparison methodology',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
    ],
    'email-de': [
      {
        section: 'Subject Line (Betreff)',
        source: 'Professional HCP Email Template (German localization)',
        guideline: 'German HCP communication conventions - Formal clinical data emphasis',
        colorClass: 'bg-amber-200 border border-amber-400',
      },
      {
        section: 'Formal Greeting',
        source: 'Conservative Specialist persona (German market)',
        guideline: 'Regional norms - Formal "Sie" addressing',
        colorClass: 'bg-amber-200 border border-amber-400',
      },
      {
        section: 'Clinical Data (German)',
        source: 'HEMLIBRA_emicizumab-kxwh_research_ppr.pdf (HAVEN 4)',
        guideline: 'German medical poster rules - Evidence-first approach',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Closing & References',
        source: 'Fachinformation requirements',
        guideline: 'German regulatory standards - ISI format per regulations',
        colorClass: 'bg-green-200 border border-green-400',
      },
    ],
    leaflet: [
      {
        section: 'Title & Introduction',
        source: 'Patient Education Standard template',
        guideline: 'Plain language guidance - Grade 6-8 readability level',
        colorClass: 'bg-amber-200 border border-amber-400',
      },
      {
        section: 'What is Hemlibra?',
        source: 'HEMLIBRA_research_ppr.pdf (Mechanism overview)',
        guideline: 'Patient-friendly language - Avoid medical jargon',
        colorClass: 'bg-blue-200 border border-blue-400',
      },
      {
        section: 'Dosing Information',
        source: 'HAVEN 4 Study (Monthly dosing regimen)',
        guideline: 'Patient education standards - Clear administration instructions',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'What to Expect',
        source: 'HAVEN 4 patient outcomes data',
        guideline: 'Patient-friendly readability - Outcome communication',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Safety Information',
        source: 'Hemlibra ISI requirements',
        guideline: 'Patient safety communication - Accessible language',
        colorClass: 'bg-green-200 border border-green-400',
      },
    ],
    dda: [
      {
        section: 'Module 1: Treatment Burden',
        source: 'Standard of Care data + Field force insights',
        guideline: 'Field force presentation standards - Problem framing',
        colorClass: 'bg-amber-200 border border-amber-400',
      },
      {
        section: 'Module 2: Mechanism of Action',
        source: 'HEMLIBRA_research_ppr.pdf (Pharmacology)',
        guideline: 'Brand Guidelines - MOA visualization standards',
        colorClass: 'bg-blue-200 border border-blue-400',
      },
      {
        section: 'Module 3: HAVEN Efficacy',
        source: 'HAVEN 1, 3, 4 combined data (Full program)',
        guideline: 'Medical Communication Guidelines - Comparative efficacy presentation',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Module 4: Dosing',
        source: 'HAVEN 4 dosing protocols',
        guideline: 'Field force standards - Practical prescribing information',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Safety Section',
        source: 'HEMLIBRA-MLR.pdf protocols',
        guideline: 'Hemlibra ISI - Boxed warning presentation',
        colorClass: 'bg-green-200 border border-green-400',
      },
    ],
  };

  return sources[assetId] || [];
}

interface ContentEditorModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const PERSONAS = ['Clinical Researcher', 'Nurse Practitioner', 'Patient'];

const IMAGE_VARIATIONS = [
  {
    id: 'poster',
    title: 'Congress Poster',
    image: '/templates/poster.png',
    description: 'Scientific poster layout with HAVEN 4 clinical data',
    type: 'Scientific',
  },
  {
    id: 'email',
    title: 'HCP Email Template',
    image: '/templates/email.png',
    description: 'Professional HCP email format with data highlights',
    type: 'Digital',
  },
  {
    id: 'dda',
    title: 'Digital Detail Aid',
    image: '/templates/dda.jpg',
    description: 'Interactive modular presentation for field teams',
    type: 'Interactive',
  },
];

export default function ContentEditorModal({ onConfirm, onClose }: ContentEditorModalProps) {
  const [viewMode, setViewMode] = useState<'content' | 'images'>('content');
  const [activeTab, setActiveTab] = useState(0);
  const [activePersona, setActivePersona] = useState(0);
  const [contents, setContents] = useState(GENERATED_ASSETS.map((a) => a.content));
  const [selectedImage, setSelectedImage] = useState<string>('poster');

  // Image editing states
  const [contrast, setContrast] = useState(50);
  const [brightness, setBrightness] = useState(50);
  const [brandOverlay, setBrandOverlay] = useState(false);
  const [isiFooter, setIsiFooter] = useState(true);
  const [imageFormat, setImageFormat] = useState<'A0 Poster' | 'A4 Print' | 'Digital Banner'>('A0 Poster');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Content & Visual Editor</h2>
              <p className="text-xs text-gray-400">Stage 3 — Content & Visual Creator</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy cursor-pointer"><X size={20} /></button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-b border-dawn-border">
          <button
            onClick={() => setViewMode('content')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'content'
                ? 'bg-dawn-teal text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-dawn-navy border border-dawn-border'
            }`}
          >
            Content Editor
          </button>
          <button
            onClick={() => setViewMode('images')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'images'
                ? 'bg-dawn-teal text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-dawn-navy border border-dawn-border'
            }`}
          >
            Visual Variations
          </button>
          <div className="ml-auto text-xs text-gray-500">
            {viewMode === 'content' ? 'Edit copy & messaging' : 'Select visual direction'}
          </div>
        </div>

        {/* Asset tabs (only for content view) */}
        {viewMode === 'content' && (
          <div className="flex border-b border-dawn-border overflow-x-auto">
            {GENERATED_ASSETS.map((a, i) => (
              <button
                key={a.id}
                onClick={() => setActiveTab(i)}
                className={`shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === i
                    ? 'border-dawn-teal text-dawn-teal'
                    : 'border-transparent text-gray-500 hover:text-dawn-navy'
                }`}
              >
                {a.title.split(' — ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Main editor area */}
        {viewMode === 'content' ? (
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
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Master source</p>
                <p className="text-xs font-medium text-dawn-navy mb-2">{CONTENT_REFERENCES[asset.id]?.source || 'Master content source'}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Regional adaptation references</p>
                <div className="flex flex-wrap gap-1">
                  {(CONTENT_REFERENCES[asset.id]?.regional ?? []).map((r) => (
                    <span key={r} className="bg-dawn-teal/10 text-dawn-teal rounded px-1.5 py-0.5 text-[10px]">{r}</span>
                  ))}
                </div>
              </div>
              <div className="pt-2 space-y-2">
                <button className="w-full flex items-center gap-2 text-xs text-dawn-teal border border-dawn-teal/30 rounded-lg px-3 py-2 hover:bg-dawn-teal/5 transition-colors cursor-pointer">
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
                  className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors cursor-pointer ${
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
                <button key={title} title={title} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer">
                  <Icon size={14} />
                </button>
              ))}
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <button title="Copy" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"><Copy size={14} /></button>
              <button title="Undo" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"><RotateCcw size={14} /></button>

              {/* Flag indicator */}
              <div className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] text-amber-700 font-medium">Hover flagged phrases for suggestions</span>
              </div>
            </div>

            {/* Text area with source annotations */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Annotated Content */}
              <div className="relative">
                <textarea
                  value={currentContent}
                  onChange={(e) => updateContent(e.target.value)}
                  className="w-full h-full min-h-[300px] text-sm text-gray-700 leading-relaxed resize-none outline-none font-sans bg-transparent relative z-10"
                  spellCheck={false}
                />
              </div>

              {/* Detailed Source & Guidelines Panel */}
              <div className="bg-gray-50 border border-dawn-border rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-dawn-navy mb-2">📋 Content Sources & Guidelines Applied</p>
                {getDetailedSources(asset.id).map((section, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-2 border border-gray-200">
                    <div className="flex items-start gap-2">
                      <div className={`w-3 h-3 rounded mt-0.5 ${section.colorClass}`} />
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-gray-900">{section.section}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">
                          <span className="font-medium">Source:</span> {section.source}
                        </p>
                        <p className="text-[10px] text-gray-600">
                          <span className="font-medium">Guideline:</span> {section.guideline}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-dawn-border bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{wordCount} words</span>
                <span className="w-px h-3 bg-gray-300" />
                <span className="text-xs bg-dawn-green/10 text-dawn-green rounded-full px-2 py-0.5 font-medium">Grade 6.2</span>
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-gray-500 border border-dawn-border rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  Save Draft
                </button>
                <button className="text-xs bg-dawn-amber/10 text-dawn-amber border border-dawn-amber/30 rounded-lg px-3 py-1.5 hover:bg-dawn-amber/20 transition-colors cursor-pointer">
                  Mark Ready for MLR
                </button>
              </div>
            </div>
          </div>
        </div>
        ) : (
          /* Image Variations View */
          <div className="flex-1 overflow-hidden flex">
            {/* Left: Image gallery */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-serif text-dawn-navy mb-2">Template Previews</h3>
                  <p className="text-sm text-gray-600">
                    Visual templates generated for your campaign assets. Each template follows Hemlibra brand guidelines
                    and is optimized for its specific format.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {IMAGE_VARIATIONS.map((variant) => (
                    <div
                      key={variant.id}
                      onClick={() => setSelectedImage(variant.id)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === variant.id
                          ? 'border-dawn-teal shadow-lg scale-[1.02]'
                          : 'border-gray-200 hover:border-dawn-teal/50'
                      }`}
                    >
                      {/* Image preview */}
                      <div className="relative h-64 bg-gray-100">
                        <img
                          src={variant.image}
                          alt={variant.title}
                          className="w-full h-full object-cover"
                          style={{
                            filter: selectedImage === variant.id
                              ? `contrast(${contrast}%) brightness(${brightness}%)`
                              : undefined
                          }}
                        />
                        {selectedImage === variant.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                            <div className="w-3 h-3 bg-dawn-teal rounded-full" />
                          </div>
                        )}
                        {selectedImage === variant.id && brandOverlay && (
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                            <p className="text-xs font-serif font-bold text-dawn-navy">Hemlibra</p>
                            <p className="text-[8px] text-gray-500">emicizumab-kxwh</p>
                          </div>
                        )}
                        {selectedImage === variant.id && isiFooter && (
                          <div className="absolute bottom-0 left-0 right-0 bg-dawn-navy/90 backdrop-blur-sm px-3 py-2">
                            <p className="text-white/80 text-[7px] leading-tight">
                              IMPORTANT SAFETY INFORMATION: See full Prescribing Information including Boxed Warning. HEMLIBRA® (emicizumab-kxwh)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Template info */}
                      <div className="p-4 bg-white">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-dawn-navy">{variant.title}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-dawn-sky text-dawn-navy font-medium">
                            {variant.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{variant.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected image details */}
                {selectedImage && (
                  <div className="mt-6 bg-white rounded-xl border border-dawn-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-dawn-navy mb-1">
                          {IMAGE_VARIATIONS.find(v => v.id === selectedImage)?.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Format: {imageFormat}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Width:</span>
                          <input
                            type="number"
                            defaultValue={imageFormat === 'A0 Poster' ? 841 : imageFormat === 'A4 Print' ? 210 : 1920}
                            className="w-16 border border-dawn-border rounded px-2 py-1 text-dawn-navy"
                          />
                          <span className="text-gray-400">{imageFormat === 'Digital Banner' ? 'px' : 'mm'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Height:</span>
                          <input
                            type="number"
                            defaultValue={imageFormat === 'A0 Poster' ? 1189 : imageFormat === 'A4 Print' ? 297 : 1080}
                            className="w-16 border border-dawn-border rounded px-2 py-1 text-dawn-navy"
                          />
                          <span className="text-gray-400">{imageFormat === 'Digital Banner' ? 'px' : 'mm'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Editing tools panel */}
            <div className="w-64 border-l border-dawn-border bg-white flex flex-col overflow-y-auto shrink-0">
              <div className="p-4 space-y-4">
                <p className="text-xs font-semibold text-dawn-navy">Image Adjustments</p>

                {/* Format selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Format</label>
                  <div className="space-y-1.5">
                    {(['A0 Poster', 'A4 Print', 'Digital Banner'] as typeof imageFormat[]).map((f) => (
                      <label key={f} className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${imageFormat === f ? 'border-dawn-teal' : 'border-gray-300'}`}>
                          {imageFormat === f && <div className="w-2 h-2 rounded-full bg-dawn-teal" />}
                        </div>
                        <span className="text-xs text-dawn-navy">{f}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Contrast slider */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs text-gray-600">Contrast</label>
                    <span className="text-xs text-dawn-navy font-medium">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-dawn-teal"
                  />
                </div>

                {/* Brightness slider */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs text-gray-600">Brightness</label>
                    <span className="text-xs text-dawn-navy font-medium">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-dawn-teal"
                  />
                </div>

                <div className="h-px bg-gray-200" />

                {/* Toggle options */}
                <div className="space-y-2.5">
                  <p className="text-xs font-medium text-gray-600 mb-2">Overlays</p>
                  {[
                    { label: 'Apply Brand Overlay', value: brandOverlay, set: setBrandOverlay },
                    { label: 'Add ISI Footer', value: isiFooter, set: setIsiFooter },
                  ].map(({ label, value, set }) => (
                    <label key={label} className="flex items-center justify-between gap-2 cursor-pointer">
                      <span className="text-xs text-gray-700">{label}</span>
                      <div
                        onClick={() => set(!value)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-dawn-teal' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? 'left-4' : 'left-0.5'}`} />
                      </div>
                    </label>
                  ))}
                </div>

                <div className="h-px bg-gray-200" />

                {/* Reset button */}
                <button
                  onClick={() => {
                    setContrast(50);
                    setBrightness(50);
                    setBrandOverlay(false);
                    setIsiFooter(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs text-gray-600 border border-dawn-border rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Reset All
                </button>

                {/* Export buttons */}
                <div className="pt-2 space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 bg-dawn-navy text-white text-xs font-medium rounded-lg px-3 py-2.5 hover:bg-dawn-navy/90 transition-colors cursor-pointer">
                    <Download size={12} /> Export PNG
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-dawn-border text-dawn-navy text-xs font-medium rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                    <FileImage size={12} /> Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex justify-between items-center">
          <p className="text-xs text-gray-500">
            {viewMode === 'content' ? '5 content assets' : `Visual: ${IMAGE_VARIATIONS.find(v => v.id === selectedImage)?.title}`}
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button onClick={onConfirm} className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm cursor-pointer">
              Confirm & Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
