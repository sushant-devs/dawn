'use client';

import { useState } from 'react';
import { X, Bold, Italic, List, Copy, RotateCcw, RefreshCw, Download, FileImage, Check, Palette, Type, Layout, ChevronLeft, ChevronRight } from 'lucide-react';
import { GENERATED_ASSETS } from '@/lib/mockData';
import StatusPill from '@/components/shared/StatusPill';
import Button from '@/components/ui/Button';

const CONTENT_REFERENCES: Record<string, { source: string; regional: string[] }> = {
  poster: {
    source: 'Poster - Brexiva PFS Efficacy Data (EN master)',
    regional: ['Brand Guidelines', 'Master creative asset', 'Global HCP messaging'],
  },
  email: {
    source: 'HCP Email (EN master)',
    regional: ['Brexiva ISI', 'Brand Guidelines', 'Global HCP email best practices'],
  },
  leaflet: {
    source: 'Patient Leaflet (EN master)',
    regional: ['Brexiva ISI', 'Patient-friendly readability guidance'],
  },
  dda: {
    source: 'Digital Detail Aid (EN master)',
    regional: ['Brand Guidelines', 'Field force presentation standards', 'Brexiva ISI'],
  },
};

function getDetailedSources(assetId: string) {
  const sources: Record<string, Array<{ section: string; source: string; guideline: string; colorClass: string }>> = {
    poster: [
      {
        section: 'Title & Background',
        source: 'Brexiva Clinical Review Report (HR+/HER2− mBC)',
        guideline: 'Scientific Congress Poster format (ICMJE standards)',
        colorClass: 'bg-blue-200 border border-blue-400',
      },
      {
        section: 'Methods Section',
        source: 'Simulated Multicenter Phase II Study - Study Design & Patient Population',
        guideline: 'Medical Communication Guidelines - Study methodology presentation',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Results Data',
        source: 'Phase II Study - Primary & Secondary Endpoints (PFS, ORR)',
        guideline: 'Medical Communication Guidelines - Statistical reporting',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Conclusion',
        source: 'Brexiva in Metastatic Breast Cancer — Clinical Review (combined evidence)',
        guideline: 'Brexiva medical guidelines - Evidence-based conclusions',
        colorClass: 'bg-green-200 border border-green-400',
      },
      {
        section: 'Safety Information',
        source: 'Safety Management and Practical Monitoring Considerations for Brexiva-Based Therapy',
        guideline: 'Brexiva MLR - Boxed warning requirements',
        colorClass: 'bg-green-200 border border-green-400',
      },
    ],
    email: [
      {
        section: 'Subject Line',
        source: 'Professional HCP Email Template',
        guideline: 'Brexiva medical guidelines - 28% higher open rate format',
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
        source: 'Simulated Multicenter Phase II Study — Efficacy Endpoints',
        guideline: 'Medical Communication Guidelines - Endpoint presentation',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Practice Benefits',
        source: 'Treatment Sequencing and Clinical Decision-Making for Brexiva-Based Therapy',
        guideline: 'Treatment burden comparison methodology',
        colorClass: 'bg-teal-200 border border-teal-400',
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
        section: 'What is Brexiva?',
        source: 'Brexiva Clinical Review Report (CDK4/6 mechanism overview)',
        guideline: 'Patient-friendly language - Avoid medical jargon',
        colorClass: 'bg-blue-200 border border-blue-400',
      },
      {
        section: 'Dosing Information',
        source: 'Safety Management and Practical Monitoring Considerations (dosing section)',
        guideline: 'Patient education standards - Clear administration instructions',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'What to Expect',
        source: 'Patient-Reported Outcomes and Treatment Persistence with Brexiva',
        guideline: 'Patient-friendly readability - Outcome communication',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Safety Information',
        source: 'Safety Management and Practical Monitoring Considerations for Brexiva-Based Therapy',
        guideline: 'Patient safety communication - Accessible language',
        colorClass: 'bg-green-200 border border-green-400',
      },
    ],
    dda: [
      {
        section: 'Module 1: Treatment Challenge',
        source: 'Brexiva Market Insight Reference Report + Field force insights',
        guideline: 'Field force presentation standards - Problem framing',
        colorClass: 'bg-amber-200 border border-amber-400',
      },
      {
        section: 'Module 2: Mechanism of Action',
        source: 'Brexiva Clinical Review Report (CDK4/6 pathway)',
        guideline: 'Brand Guidelines - MOA visualization standards',
        colorClass: 'bg-blue-200 border border-blue-400',
      },
      {
        section: 'Module 3: Brexiva Efficacy',
        source: 'Phase II Study + Brexiva in Metastatic Breast Cancer Clinical Review',
        guideline: 'Medical Communication Guidelines - Comparative efficacy presentation',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Module 4: Dosing',
        source: 'Treatment Sequencing and Clinical Decision-Making (150mg once daily oral)',
        guideline: 'Field force standards - Practical prescribing information',
        colorClass: 'bg-teal-200 border border-teal-400',
      },
      {
        section: 'Safety Section',
        source: 'Safety Management and Practical Monitoring Considerations for Brexiva-Based Therapy',
        guideline: 'Brexiva ISI - Boxed warning presentation',
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
    pdf: '/templates/BREXIVA_Congress_Poster_BLYVOR3.pdf',
    description: 'Scientific poster layout with Brexiva clinical data',
    type: 'Scientific',
  },
  {
    id: 'email',
    title: 'HCP Email Template',
    pdf: '/templates/BREXIVA_HCP_Email_Clinical_Focus.pdf',
    description: 'Professional HCP email format with data highlights',
    type: 'Digital',
  },
  {
    id: 'leaflet',
    title: 'Patient Leaflet',
    pdf: '/templates/BREXIVA_Patient_Leaflet_Guide.pdf',
    description: 'Patient-friendly educational leaflet with clear safety info',
    type: 'Print',
  },
  {
    id: 'dda',
    title: 'Digital Detail Aid',
    pdf: '/templates/BREXIVA_Digital_Detail_Aid.pdf',
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
  const [templateSidebarCollapsed, setTemplateSidebarCollapsed] = useState(false);
  const [contentSidebarCollapsed, setContentSidebarCollapsed] = useState(false);
  const [contentPropertiesCollapsed, setContentPropertiesCollapsed] = useState(false);
  const [templatePropertiesCollapsed, setTemplatePropertiesCollapsed] = useState(false);

  const asset = GENERATED_ASSETS[activeTab];
  const currentContent = contents[activeTab];

  const updateContent = (text: string) => {
    setContents((prev) => {
      const next = [...prev];
      next[activeTab] = text;
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-dawn-border bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dawn-border bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2E5BFF] to-[#1A3FCC] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-serif text-lg font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-xl text-dawn-navy font-semibold">Content & Visual Editor</h2>
              <p className="text-sm text-gray-500 mt-0.5">Review and edit your campaign content</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer"><X size={22} /></button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-3 px-6 py-4 bg-dawn-sky/30 border-b border-dawn-border">
          <button
            onClick={() => setViewMode('content')}
            className={`px-4 py-2 text-sm font-medium font-body rounded-lg transition-all cursor-pointer ${
              viewMode === 'content'
                ? 'bg-gradient-to-r from-[#2E5BFF] to-[#1A3FCC] text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-dawn-navy border border-dawn-border'
            }`}
          >
            Content Editor
          </button>
          <button
            onClick={() => setViewMode('images')}
            className={`px-4 py-2 text-sm font-medium font-body rounded-lg transition-all cursor-pointer ${
              viewMode === 'images'
                ? 'bg-gradient-to-r from-[#2E5BFF] to-[#1A3FCC] text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-dawn-navy border border-dawn-border'
            }`}
          >
            Visual Templates
          </button>
          <div className="ml-auto text-xs text-gray-500 font-body">
            {viewMode === 'content' ? `${GENERATED_ASSETS.length} assets to review` : `${IMAGE_VARIATIONS.length} templates available`}
          </div>
        </div>

        {/* Main editor area */}
        {viewMode === 'content' ? (
          <div className="flex-1 flex overflow-hidden bg-[#f5f7fa] min-h-0">
            {/* Left Sidebar - Asset Library (Collapsible) */}
            <div
              className={`bg-white border-r border-dawn-border flex flex-col transition-all duration-300 shrink-0 ${
                contentSidebarCollapsed ? 'w-16' : 'w-64'
              }`}
            >
              <div className="px-4 py-3 border-b border-dawn-border flex items-center justify-between">
                {!contentSidebarCollapsed && (
                  <div>
                    <h3 className="text-sm font-semibold text-dawn-navy font-body">Content Assets</h3>
                    <p className="text-xs text-gray-500 font-body mt-0.5">Select asset</p>
                  </div>
                )}
                <button
                  onClick={() => setContentSidebarCollapsed(!contentSidebarCollapsed)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer ml-auto"
                >
                  {contentSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {contentSidebarCollapsed ? (
                  <div className="p-2 space-y-2">
                    {GENERATED_ASSETS.map((a, idx) => (
                      <button
                        key={a.id}
                        onClick={() => setActiveTab(idx)}
                        className={`w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-xs font-bold font-body cursor-pointer ${
                          activeTab === idx
                            ? 'border-dawn-teal bg-dawn-teal text-white shadow-lg'
                            : 'border-dawn-border bg-white text-gray-500 hover:border-dawn-teal/50 hover:bg-dawn-teal/5'
                        }`}
                        title={a.title}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 space-y-1.5">
                    {GENERATED_ASSETS.map((a, idx) => (
                      <button
                        key={a.id}
                        onClick={() => setActiveTab(idx)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer ${
                          activeTab === idx
                            ? 'border-dawn-teal bg-dawn-teal/10 shadow-sm'
                            : 'border-transparent bg-gray-50 hover:bg-white hover:border-dawn-border'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold font-body truncate ${
                              activeTab === idx ? 'text-dawn-teal' : 'text-dawn-navy'
                            }`}>
                              {a.title}
                            </p>
                            <span className={`text-[10px] font-medium font-body ${
                              activeTab === idx ? 'text-dawn-teal/70' : 'text-gray-500'
                            }`}>
                              {a.persona}
                            </span>
                          </div>
                          {activeTab === idx && (
                            <div className="w-5 h-5 bg-dawn-teal rounded-full flex items-center justify-center shadow-sm shrink-0">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center - Content Editor Area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* Toolbar */}
              <div className="bg-white border-b border-dawn-border px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                    <button className="px-3 py-1.5 text-xs font-medium font-body rounded bg-white text-dawn-navy shadow-sm cursor-pointer">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium font-body rounded text-gray-600 hover:bg-white cursor-pointer">
                      Preview
                    </button>
                  </div>
                  <div className="h-4 w-px bg-dawn-border" />
                  <div className="flex items-center gap-1">
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
                    <button title="Undo" className="p-1.5 rounded hover:bg-gray-100 text-gray-600 cursor-pointer">
                      <RotateCcw size={16} />
                    </button>
                    <button title="Redo" className="p-1.5 rounded hover:bg-gray-100 text-gray-600 cursor-pointer">
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-body">
                    {asset.title}
                  </span>
                </div>
              </div>

              {/* Canvas - Text Editor Area */}
              <div className="flex-1 overflow-auto p-8 bg-[#f5f7fa]">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6 min-h-[500px]">
                  <textarea
                    value={currentContent}
                    onChange={(e) => updateContent(e.target.value)}
                    className="w-full h-full min-h-[400px] text-sm text-gray-700 leading-relaxed resize-none outline-none font-sans bg-transparent"
                    spellCheck={false}
                    placeholder="Edit your content here..."
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar - Properties Panel (Collapsible) */}
            <div
              className={`bg-white border-l border-dawn-border flex flex-col transition-all duration-300 shrink-0 ${
                contentPropertiesCollapsed ? 'w-16' : 'w-80'
              }`}
            >
              <div className="px-4 py-3 border-b border-dawn-border flex items-center justify-between">
                {!contentPropertiesCollapsed && (
                  <h3 className="text-sm font-semibold text-dawn-navy font-body">Properties</h3>
                )}
                <button
                  onClick={() => setContentPropertiesCollapsed(!contentPropertiesCollapsed)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer ml-auto"
                >
                  {contentPropertiesCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>

              {!contentPropertiesCollapsed ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-xs font-semibold text-dawn-navy font-body">Persona</h4>
                    </div>
                    <div className="space-y-1.5">
                      {PERSONAS.map((p, i) => (
                        <button
                          key={p}
                          onClick={() => setActivePersona(i)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium font-body transition-all cursor-pointer ${
                            activePersona === i
                              ? 'bg-dawn-teal/10 text-dawn-teal border border-dawn-teal/30'
                              : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-dawn-border" />

                  <div>
                    <h4 className="text-xs font-semibold text-dawn-navy font-body mb-3">Metadata</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 font-body">Readability</span>
                        <span className="font-semibold text-dawn-green font-body">Grade 6.2</span>
                      </div>
                      <div className="flex justify-between text-xs items-center">
                        <span className="text-gray-600 font-body">MLR Status</span>
                        <StatusPill status={asset.status as 'Passed' | 'Pending' | 'Flagged'} size="sm" />
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <span className="bg-dawn-sky text-dawn-navy rounded-full px-2 py-0.5 text-[10px] font-medium">{asset.persona}</span>
                        <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-[10px] font-medium">{asset.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-dawn-border" />

                  <div>
                    <h4 className="text-xs font-semibold text-dawn-navy font-body mb-3">Content Sources</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] text-gray-500 font-body mb-1">Master Source</p>
                        <p className="text-xs text-dawn-navy font-body">{CONTENT_REFERENCES[asset.id]?.source || 'Master content source'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-body mb-1.5">Regional References</p>
                        <div className="flex flex-wrap gap-1">
                          {(CONTENT_REFERENCES[asset.id]?.regional ?? []).map((r) => (
                            <span key={r} className="bg-dawn-teal/10 text-dawn-teal rounded px-1.5 py-0.5 text-[10px]">{r}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-dawn-border" />

                  <div>
                    <h4 className="text-xs font-semibold text-dawn-navy font-body mb-3">Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-center gap-2 text-xs text-dawn-teal border border-dawn-teal/30 rounded-lg px-3 py-2 hover:bg-dawn-teal/5 transition-colors cursor-pointer">
                        <RefreshCw size={12} />
                        Regenerate
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2E5BFF] to-[#1A3FCC] text-white text-xs font-medium font-body rounded-lg px-3 py-2 hover:shadow-md transition-all cursor-pointer">
                        Mark Ready for MLR
                      </button>
                    </div>
                  </div>

                  <div>
                    <details className="group">
                      <summary className="text-xs font-semibold text-dawn-navy font-body mb-2 cursor-pointer hover:text-dawn-teal">
                        📋 View Detailed Sources ({getDetailedSources(asset.id).length})
                      </summary>
                      <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                        {getDetailedSources(asset.id).map((section, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded mt-1 shrink-0 ${section.colorClass}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold text-gray-900 mb-0.5">{section.section}</p>
                                <p className="text-[9px] text-gray-600">
                                  <span className="font-medium">Source:</span> {section.source}
                                </p>
                                <p className="text-[9px] text-gray-600">
                                  <span className="font-medium">Guideline:</span> {section.guideline}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4">
                  <p className="text-xs text-gray-400 text-center font-body transform -rotate-90 whitespace-nowrap">
                    Properties
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden bg-[#f5f7fa] min-h-0">
            {/* Left Sidebar - Template Library (Collapsible) */}
            <div
              className={`bg-white border-r border-dawn-border flex flex-col transition-all duration-300 shrink-0 ${
                templateSidebarCollapsed ? 'w-16' : 'w-64'
              }`}
            >
              <div className="px-4 py-3 border-b border-dawn-border flex items-center justify-between">
                {!templateSidebarCollapsed && (
                  <div>
                    <h3 className="text-sm font-semibold text-dawn-navy font-body">Templates</h3>
                    <p className="text-xs text-gray-500 font-body mt-0.5">Select template</p>
                  </div>
                )}
                <button
                  onClick={() => setTemplateSidebarCollapsed(!templateSidebarCollapsed)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer ml-auto"
                >
                  {templateSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {templateSidebarCollapsed ? (
                  <div className="p-2 space-y-2">
                    {IMAGE_VARIATIONS.map((variant, idx) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedImage(variant.id)}
                        className={`w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-xs font-bold font-body cursor-pointer ${
                          selectedImage === variant.id
                            ? 'border-dawn-teal bg-dawn-teal text-white shadow-lg'
                            : 'border-dawn-border bg-white text-gray-500 hover:border-dawn-teal/50 hover:bg-dawn-teal/5'
                        }`}
                        title={variant.title}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 space-y-1.5">
                    {IMAGE_VARIATIONS.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedImage(variant.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer ${
                          selectedImage === variant.id
                            ? 'border-dawn-teal bg-dawn-teal/10 shadow-sm'
                            : 'border-transparent bg-gray-50 hover:bg-white hover:border-dawn-border'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold font-body truncate ${
                              selectedImage === variant.id ? 'text-dawn-teal' : 'text-dawn-navy'
                            }`}>
                              {variant.title}
                            </p>
                            <span className={`text-[10px] font-medium font-body ${
                              selectedImage === variant.id ? 'text-dawn-teal/70' : 'text-gray-500'
                            }`}>
                              {variant.type}
                            </span>
                          </div>
                          {selectedImage === variant.id && (
                            <div className="w-5 h-5 bg-dawn-teal rounded-full flex items-center justify-center shadow-sm shrink-0">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center - Canvas Area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <div className="bg-white border-b border-dawn-border px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                    <button className="px-3 py-1.5 text-xs font-medium font-body rounded bg-white text-dawn-navy shadow-sm cursor-pointer">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium font-body rounded text-gray-600 hover:bg-white cursor-pointer">
                      Preview
                    </button>
                  </div>
                  <div className="h-4 w-px bg-dawn-border" />
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 cursor-pointer" title="Undo">
                      <RotateCcw size={16} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 cursor-pointer" title="Redo">
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-body">
                    {IMAGE_VARIATIONS.find(v => v.id === selectedImage)?.title || 'Select a template'}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                {selectedImage ? (
                  <div className="relative bg-white rounded-lg shadow-2xl border border-gray-200" style={{ maxWidth: '800px', width: '100%', height: '600px' }}>
                    <iframe
                      src={IMAGE_VARIATIONS.find(v => v.id === selectedImage)?.pdf}
                      title="Template PDF"
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-400 font-body">
                    <FileImage size={48} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Select a template to start editing</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Properties Panel (Collapsible) */}
            <div
              className={`bg-white border-l border-dawn-border flex flex-col transition-all duration-300 shrink-0 ${
                templatePropertiesCollapsed ? 'w-16' : 'w-80'
              }`}
            >
              <div className="px-4 py-3 border-b border-dawn-border flex items-center justify-between">
                {!templatePropertiesCollapsed && (
                  <h3 className="text-sm font-semibold text-dawn-navy font-body">Properties</h3>
                )}
                <button
                  onClick={() => setTemplatePropertiesCollapsed(!templatePropertiesCollapsed)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer ml-auto"
                >
                  {templatePropertiesCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>

              {!templatePropertiesCollapsed && selectedImage ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Type size={14} className="text-dawn-teal" />
                      <h4 className="text-xs font-semibold text-dawn-navy font-body">Text Content</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 font-body mb-1">Headline</label>
                        <input
                          type="text"
                          placeholder="Edit headline..."
                          className="w-full px-3 py-2 text-xs border border-dawn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dawn-teal/20 font-body"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 font-body mb-1">Body Text</label>
                        <textarea
                          placeholder="Edit body text..."
                          rows={3}
                          className="w-full px-3 py-2 text-xs border border-dawn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dawn-teal/20 font-body resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-dawn-border" />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Palette size={14} className="text-dawn-teal" />
                      <h4 className="text-xs font-semibold text-dawn-navy font-body">Colors</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-body">Background</span>
                        <div className="flex items-center gap-2">
                          <input type="color" defaultValue="#2E5BFF" className="w-8 h-8 rounded border border-dawn-border cursor-pointer" />
                          <span className="text-xs text-gray-500 font-mono">#2E5BFF</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-body">Text</span>
                        <div className="flex items-center gap-2">
                          <input type="color" defaultValue="#0D1B3E" className="w-8 h-8 rounded border border-dawn-border cursor-pointer" />
                          <span className="text-xs text-gray-500 font-mono">#0D1B3E</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-body">Accent</span>
                        <div className="flex items-center gap-2">
                          <input type="color" defaultValue="#14B8A6" className="w-8 h-8 rounded border border-dawn-border cursor-pointer" />
                          <span className="text-xs text-gray-500 font-mono">#14B8A6</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-dawn-border" />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Layout size={14} className="text-dawn-teal" />
                      <h4 className="text-xs font-semibold text-dawn-navy font-body">Layout</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="p-2 border-2 border-dawn-teal bg-dawn-teal/5 rounded-lg hover:bg-dawn-teal/10 cursor-pointer">
                        <div className="w-full h-12 bg-dawn-teal/20 rounded mb-1" />
                        <p className="text-[10px] text-center text-dawn-navy font-body">Full Width</p>
                      </button>
                      <button className="p-2 border border-dawn-border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-full h-12 bg-gray-200 rounded mb-1" />
                        <p className="text-[10px] text-center text-gray-600 font-body">Split</p>
                      </button>
                      <button className="p-2 border border-dawn-border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-full h-12 bg-gray-200 rounded mb-1" />
                        <p className="text-[10px] text-center text-gray-600 font-body">Sidebar</p>
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-dawn-border" />

                  <div>
                    <h4 className="text-xs font-semibold text-dawn-navy font-body mb-3">Export</h4>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2E5BFF] to-[#1A3FCC] text-white text-xs font-medium font-body rounded-lg px-4 py-2.5 hover:shadow-md transition-all cursor-pointer">
                        <Download size={14} /> Download PNG
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 border border-dawn-border text-dawn-navy text-xs font-medium font-body rounded-lg px-4 py-2.5 hover:bg-dawn-sky/30 transition-colors cursor-pointer">
                        <FileImage size={14} /> Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              ) : !templatePropertiesCollapsed ? (
                <div className="flex-1 flex items-center justify-center p-4">
                  <p className="text-xs text-gray-400 text-center font-body">
                    Select a template to view properties
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4">
                  <p className="text-xs text-gray-400 text-center font-body transform -rotate-90 whitespace-nowrap">
                    Properties
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex justify-between items-center">
          <p className="text-xs text-gray-500">
            {viewMode === 'content' ? '5 content assets' : `Visual: ${IMAGE_VARIATIONS.find(v => v.id === selectedImage)?.title}`}
          </p>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary" size="md" rounded="lg">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="primary" size="md" rounded="lg">
              Confirm & Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
