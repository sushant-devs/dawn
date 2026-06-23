'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Bold, Italic, List, Copy, RotateCcw, RefreshCw, Download, FileImage, Check, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCampaignData } from '@/context/DAWNContext';
import Button from '@/components/ui/Button';
import { PdfViewerModal } from '@/components/shared/DocumentPreviewModal';

interface ContentEditorModalProps {
  onConfirm: () => void;
  onClose: () => void;
  readOnly?: boolean;
}

const TONE_OPTIONS = ['Default', 'Professional', 'Empathetic', 'Concise', 'Authoritative', 'Patient-friendly'];
const STRUCTURE_OPTIONS = ['Default', 'Bullet points', 'Paragraph', 'Q&A', 'Step-by-step'];

const COLOR_SCHEMES = ['Default', 'Blue', 'Green', 'Red', 'Purple', 'Orange', 'Monochrome'];
const FONT_STYLES = ['Default', 'Serif Classic', 'Modern Sans', 'Editorial', 'Compact'];
const BORDER_STYLES = ['Default', 'None', 'Subtle', 'Bold', 'Rounded'];
const SPACING_OPTIONS = ['Default', 'Compact', 'Comfortable', 'Spacious'];

// Pull a friendly variant name out of the template file path
// (e.g. "Congress%20Poster/Classic%20Scientific%20Poster.html" -> "Classic Scientific Poster").
// File paths are URL-encoded by the campaign data helper, so we decode the
// final segment before stripping its extension.
function getTemplateVariantName(file: string) {
  const last = file.split('/').pop() ?? '';
  const withoutExt = last.replace(/\.(html?|pdf)$/i, '');
  try {
    return decodeURIComponent(withoutExt);
  } catch {
    return withoutExt;
  }
}

function buildPdfPreviewSrc(file: string) {
  // 'Fit' scales the whole page (both axes) to fit the iframe so nothing clips.
  return `${file}#view=Fit&toolbar=0&navpanes=0`;
}

// HTML templates render straight from their URL; PDFs go through the viewer hints.
function isHtmlTemplate(file: string) {
  return file.split('?')[0].toLowerCase().endsWith('.html');
}

function buildPreviewSrc(file: string) {
  return isHtmlTemplate(file) ? file : buildPdfPreviewSrc(file);
}

// The HTML templates are authored against a poster-style fixed canvas. We render
// the iframe at these design dimensions and then CSS-scale it down so the whole
// document fits inside whatever space the preview area has — no clipping.
const TEMPLATE_DESIGN_WIDTH = 1080;
const TEMPLATE_DESIGN_HEIGHT = 1600;

interface TemplatePreviewCanvasProps {
  src: string;
  title: string;
  templateKey: string;
}

function TemplatePreviewCanvas({ src, title, templateKey }: TemplatePreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const next = Math.min(rect.width / TEMPLATE_DESIGN_WIDTH, rect.height / TEMPLATE_DESIGN_HEIGHT);
      if (next > 0) setScale(next);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaledWidth = TEMPLATE_DESIGN_WIDTH * scale;
  const scaledHeight = TEMPLATE_DESIGN_HEIGHT * scale;

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl"
        style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
      >
        <iframe
          key={templateKey}
          src={src}
          title={title}
          className="border-0 bg-white"
          style={{
            width: `${TEMPLATE_DESIGN_WIDTH}px`,
            height: `${TEMPLATE_DESIGN_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </div>
  );
}

export default function ContentEditorModal({ onConfirm, onClose, readOnly = false }: ContentEditorModalProps) {
  const { generatedAssets, visualTemplates } = useCampaignData();
  const [viewMode, setViewMode] = useState<'content' | 'images'>('content');
  const [activeTab, setActiveTab] = useState(0);
  const [contents, setContents] = useState(generatedAssets.map((a) => a.content));
  const [selectedImage, setSelectedImage] = useState<string>(visualTemplates[0]?.id ?? '');

  const [previewOpen, setPreviewOpen] = useState(false);

  // Text Edit panel (right rail in content view) — tone / structure / instructions
  // are presentation-only inputs that gate the "Apply Text Edit" action.
  const [tone, setTone] = useState('Default');
  const [structure, setStructure] = useState('Default');
  const [customInstructions, setCustomInstructions] = useState('');

  // Personalize panel (right rail in visual content view) — visual style options
  // that gate the "Apply Style" action.
  const [colorScheme, setColorScheme] = useState('Default');
  const [fontStyle, setFontStyle] = useState('Default');
  const [borderStyle, setBorderStyle] = useState('Default');
  const [spacing, setSpacing] = useState('Default');
  const [textSection, setTextSection] = useState('');

  const [templateSidebarCollapsed, setTemplateSidebarCollapsed] = useState(false);
  const [contentSidebarCollapsed, setContentSidebarCollapsed] = useState(false);
  const [contentPropertiesCollapsed, setContentPropertiesCollapsed] = useState(false);
  const [templatePropertiesCollapsed, setTemplatePropertiesCollapsed] = useState(false);

  const asset = generatedAssets[activeTab];
  const currentContent = contents[activeTab];

  const updateContent = (text: string) => {
    setContents((prev) => {
      const next = [...prev];
      next[activeTab] = text;
      return next;
    });
  };


  // Triggers a native browser download for the currently selected visual template.
  // Templates live under /public/data/... (same origin), so an anchor with the
  // `download` attribute is enough — no fetch/blob round-trip needed.
  const handleDownloadTemplate = () => {
    const template = visualTemplates.find((v) => v.id === selectedImage);
    if (!template) return;

    const variantName = getTemplateVariantName(template.file);
    const ext = (template.file.split('?')[0].split('.').pop() ?? 'html').toLowerCase();

    const a = document.createElement('a');
    a.href = template.file;
    a.download = `${variantName}.${ext}`;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const previewTemplate = visualTemplates.find((v) => v.id === selectedImage);

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-dawn-border bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border bg-white">
          <div>
            <h2 className="font-serif text-lg text-dawn-navy font-semibold">Content &amp; Visual Editor</h2>
            <p className="text-xs text-gray-500 mt-0.5">Review and edit your campaign content</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer"><X size={20} /></button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 px-6 py-3 bg-white border-b border-dawn-border">
          <button
            onClick={() => setViewMode('content')}
            className={`px-4 py-1.5 text-xs font-semibold font-body rounded-lg transition-all cursor-pointer ${
              viewMode === 'content'
                ? 'bg-gradient-to-r from-[#8624FF] to-[#6B1FCC] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-dawn-navy border border-dawn-border'
            }`}
          >
            Content Editor
          </button>
          <button
            onClick={() => setViewMode('images')}
            className={`px-4 py-1.5 text-xs font-semibold font-body rounded-lg transition-all cursor-pointer ${
              viewMode === 'images'
                ? 'bg-gradient-to-r from-[#8624FF] to-[#6B1FCC] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-dawn-navy border border-dawn-border'
            }`}
          >
            Visual Content
          </button>
          <div className="ml-auto text-xs text-gray-500 font-body">
            {viewMode === 'content'
              ? `${generatedAssets.length} asset${generatedAssets.length === 1 ? '' : 's'} to review`
              : `${visualTemplates.length} template${visualTemplates.length === 1 ? '' : 's'} available`}
          </div>
        </div>

        {/* Main editor area */}
        {viewMode === 'content' ? (
          <div className="flex-1 flex overflow-hidden bg-[#f5f7fa]">
            {/* Left Sidebar - Asset Library (Collapsible) */}
            <div
              className={`bg-white border-r border-dawn-border flex flex-col transition-all duration-300 ${
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
                  /* Collapsed - Icon Pills */
                  <div className="p-2 space-y-2">
                    {generatedAssets.map((a, idx) => (
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
                  /* Expanded - Pill List */
                  <div className="p-3 space-y-1.5">
                    {generatedAssets.map((a, idx) => (
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
                            <p className={`text-xs font-semibold font-body uppercase tracking-wide truncate ${
                              activeTab === idx ? 'text-dawn-teal' : 'text-dawn-navy'
                            }`}>
                              {a.title.split(' - ')[0]}
                            </p>
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
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="bg-white border-b border-dawn-border px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[
                  { icon: Bold, title: 'Bold' },
                  { icon: Italic, title: 'Italic' },
                  { icon: List, title: 'Bulleted list' },
                ].map(({ icon: Icon, title }) => (
                  <button key={title} title={title} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer">
                    <Icon size={14} />
                  </button>
                ))}
                <button title="Numbered list" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer">
                  <span className="text-[11px] font-semibold leading-none">1.</span>
                </button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button title="Copy" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer"><Copy size={14} /></button>
                <button title="Undo" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer">
                  <RotateCcw size={14} />
                </button>
                <button title="Redo" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer">
                  <RefreshCw size={14} />
                </button>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 font-body">
                {asset.title.split(' - ')[0]}
              </span>
            </div>

            {/* Canvas - Text Editor Area */}
            <div className="flex-1 overflow-auto p-8 bg-[#f5f7fa]">
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6 min-h-[500px]">
                <textarea
                  value={currentContent}
                  onChange={(e) => updateContent(e.target.value)}
                  readOnly={readOnly}
                  className="w-full h-full min-h-[400px] text-sm text-gray-700 leading-relaxed resize-none outline-none font-sans bg-transparent"
                  spellCheck={false}
                  placeholder="Edit your content here..."
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Text Edit Panel (Collapsible) */}
          {!readOnly && (
            <div
              className={`bg-white border-l border-dawn-border flex flex-col transition-all duration-300 ${
                contentPropertiesCollapsed ? 'w-16' : 'w-80'
              }`}
            >
            <div className="px-4 py-3 border-b border-dawn-border flex items-center justify-between gap-2">
              {!contentPropertiesCollapsed && (
                <div>
                  <h3 className="text-sm font-semibold text-dawn-navy font-body">Text Edit</h3>
                  <p className="text-[11px] text-gray-500 font-body mt-0.5">Adjust tone &amp; structure</p>
                </div>
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
                {/* Tone */}
                <div>
                  <label className="block text-xs font-semibold text-dawn-navy font-body mb-1.5">Tone</label>
                  <div className="relative">
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-dawn-border bg-white px-3 py-2 text-xs font-body text-dawn-navy outline-none transition-colors hover:border-dawn-teal/40 focus:border-dawn-teal focus:ring-2 focus:ring-dawn-teal/20 cursor-pointer"
                    >
                      {TONE_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronRight size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400" />
                  </div>
                </div>

                {/* Structure */}
                <div>
                  <label className="block text-xs font-semibold text-dawn-navy font-body mb-1.5">Structure</label>
                  <div className="relative">
                    <select
                      value={structure}
                      onChange={(e) => setStructure(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-dawn-border bg-white px-3 py-2 text-xs font-body text-dawn-navy outline-none transition-colors hover:border-dawn-teal/40 focus:border-dawn-teal focus:ring-2 focus:ring-dawn-teal/20 cursor-pointer"
                    >
                      {STRUCTURE_OPTIONS.map((s) => (
                        <option key={s} value={s} style={{ color: '#1E1B3D', backgroundColor: '#ffffff' }}>{s}</option>
                      ))}
                    </select>
                    <ChevronRight size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400" />
                  </div>
                </div>

                {/* Custom Instructions */}
                <div>
                  <label className="block text-xs font-semibold text-dawn-navy font-body mb-1.5">Custom Instructions</label>
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="e.g. Emphasise safety data, shorten headline..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-dawn-border bg-white px-3 py-2 text-xs font-body text-dawn-navy placeholder:text-gray-400 outline-none transition-colors hover:border-dawn-teal/40 focus:border-dawn-teal focus:ring-2 focus:ring-dawn-teal/20"
                  />
                </div>

                {/* Apply */}
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-[#8624FF] to-[#6B1FCC] text-white text-xs font-semibold font-body rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  Apply Text Edit
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-xs text-gray-400 text-center font-body transform -rotate-90 whitespace-nowrap">
                  Text Edit
                </p>
              </div>
            )}
          </div>
          )}
        </div>
        ) : (
          /* Visual Template Editor */
          <div className="flex min-h-0 flex-1 overflow-hidden bg-[#f5f7fa]">
            {/* Left Sidebar - Template Library (Collapsible) */}
            <div
              className={`bg-white border-r border-dawn-border flex flex-col transition-all duration-300 ${
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
                  /* Collapsed - Icon Pills */
                  <div className="p-2 space-y-2">
                    {visualTemplates.map((variant, idx) => (
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
                  /* Expanded - Pill List */
                  <div className="p-3 space-y-1.5">
                    {visualTemplates.map((variant) => (
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
                            <p className={`text-xs font-semibold font-body uppercase tracking-wide truncate ${
                              selectedImage === variant.id ? 'text-dawn-teal' : 'text-dawn-navy'
                            }`}>
                              {variant.title}
                            </p>
                            <span className={`text-[11px] font-medium font-body truncate block ${
                              selectedImage === variant.id ? 'text-dawn-teal/70' : 'text-gray-500'
                            }`}>
                              {getTemplateVariantName(variant.file)}
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
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="bg-white border-b border-dawn-border px-4 py-2.5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-dawn-navy font-body truncate">
                  {selectedImage
                    ? getTemplateVariantName(visualTemplates.find((v) => v.id === selectedImage)?.file ?? '')
                    : 'Select a template'}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    disabled={!selectedImage}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dawn-teal/40 bg-white px-3 py-1.5 text-xs font-semibold font-body text-dawn-teal transition-colors hover:bg-dawn-teal/5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                  >
                    <Eye size={13} />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    disabled={!selectedImage}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dawn-border bg-white px-3 py-1.5 text-xs font-semibold font-body text-dawn-navy transition-colors hover:border-dawn-teal/40 hover:text-dawn-teal cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-dawn-border disabled:hover:text-dawn-navy"
                  >
                    <Download size={13} />
                    Download
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 min-h-0 overflow-hidden p-4 bg-[#eef1f6]">
                {selectedImage ? (
                  <TemplatePreviewCanvas
                    templateKey={selectedImage}
                    src={buildPreviewSrc(visualTemplates.find((v) => v.id === selectedImage)?.file ?? '')}
                    title={getTemplateVariantName(visualTemplates.find((v) => v.id === selectedImage)?.file ?? '')}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-gray-400 font-body">
                    <div>
                      <FileImage size={48} className="mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Select a template to start editing</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Personalize Panel (Collapsible) */}
            {!readOnly && (
              <div
              className={`bg-white border-l border-dawn-border flex flex-col transition-all duration-300 ${
                templatePropertiesCollapsed ? 'w-16' : 'w-80'
              }`}
            >
              <div className="px-4 py-3 border-b border-dawn-border flex items-center justify-between gap-2">
                {!templatePropertiesCollapsed && (
                  <div>
                    <h3 className="text-sm font-semibold text-dawn-navy font-body">Personalize</h3>
                    <p className="text-[11px] text-gray-500 font-body mt-0.5">Visual style options</p>
                  </div>
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
                  {/* Color Scheme */}
                  <div>
                    <label className="block text-xs font-semibold text-dawn-navy font-body mb-1.5">Color Scheme</label>
                    <div className="relative">
                      <select
                        value={colorScheme}
                        onChange={(e) => setColorScheme(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-dawn-border bg-white px-3 py-2 text-xs font-body text-dawn-navy outline-none transition-colors hover:border-dawn-teal/40 focus:border-dawn-teal focus:ring-2 focus:ring-dawn-teal/20 cursor-pointer"
                      >
                        {COLOR_SCHEMES.map((s) => (
                          <option key={s} value={s} style={{ color: '#1E1B3D', backgroundColor: '#ffffff' }}>{s}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400" />
                    </div>
                  </div>

                  {/* Font Style */}
                  <div>
                    <label className="block text-xs font-semibold text-dawn-navy font-body mb-1.5">Font Style</label>
                    <div className="relative">
                      <select
                        value={fontStyle}
                        onChange={(e) => setFontStyle(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-dawn-border bg-white px-3 py-2 text-xs font-body text-dawn-navy outline-none transition-colors hover:border-dawn-teal/40 focus:border-dawn-teal focus:ring-2 focus:ring-dawn-teal/20 cursor-pointer"
                      >
                        {FONT_STYLES.map((s) => (
                          <option key={s} value={s} style={{ color: '#1E1B3D', backgroundColor: '#ffffff' }}>{s}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400" />
                    </div>
                  </div>

                  {/* Border Style */}
                  <div>
                    <label className="block text-xs font-semibold text-dawn-navy font-body mb-1.5">Border Style</label>
                    <div className="relative">
                      <select
                        value={borderStyle}
                        onChange={(e) => setBorderStyle(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-dawn-border bg-white px-3 py-2 text-xs font-body text-dawn-navy outline-none transition-colors hover:border-dawn-teal/40 focus:border-dawn-teal focus:ring-2 focus:ring-dawn-teal/20 cursor-pointer"
                      >
                        {BORDER_STYLES.map((s) => (
                          <option key={s} value={s} style={{ color: '#1E1B3D', backgroundColor: '#ffffff' }}>{s}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400" />
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <label className="block text-xs font-semibold text-dawn-navy font-body mb-1.5">Spacing</label>
                    <div className="relative">
                      <select
                        value={spacing}
                        onChange={(e) => setSpacing(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-dawn-border bg-white px-3 py-2 text-xs font-body text-dawn-navy outline-none transition-colors hover:border-dawn-teal/40 focus:border-dawn-teal focus:ring-2 focus:ring-dawn-teal/20 cursor-pointer"
                      >
                        {SPACING_OPTIONS.map((s) => (
                          <option key={s} value={s} style={{ color: '#1E1B3D', backgroundColor: '#ffffff' }}>{s}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400" />
                    </div>
                  </div>

                  {/* Text Section */}
                  <div>
                    <label className="block text-xs font-semibold text-dawn-navy font-body mb-1.5">Text Section</label>
                    <input
                      type="text"
                      value={textSection}
                      onChange={(e) => setTextSection(e.target.value)}
                      placeholder="e.g. header, footer..."
                      className="w-full rounded-lg border border-dawn-border bg-white px-3 py-2 text-xs font-body text-dawn-navy placeholder:text-gray-400 outline-none transition-colors hover:border-dawn-teal/40 focus:border-dawn-teal focus:ring-2 focus:ring-dawn-teal/20"
                    />
                  </div>

                  {/* Apply Style */}
                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-[#8624FF] to-[#6B1FCC] text-white text-xs font-semibold font-body rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    Apply Style
                  </button>
                </div>
              ) : !templatePropertiesCollapsed ? (
                <div className="flex-1 flex items-center justify-center p-4">
                  <p className="text-xs text-gray-400 text-center font-body">
                    Select a template to personalize
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4">
                  <p className="text-xs text-gray-400 text-center font-body transform -rotate-90 whitespace-nowrap">
                    Personalize
                  </p>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex justify-between items-center">
          <p className="text-xs text-gray-500">
            {viewMode === 'content' ? `${generatedAssets.length} content assets` : `Visual: ${visualTemplates.find(v => v.id === selectedImage)?.title ?? '—'}`}
          </p>
          {!readOnly && (
            <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary" size="md" rounded="lg">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="primary" size="md" rounded="lg">
              Confirm & Continue →
            </Button>
          </div>
          )} 
        </div>
      </div>
    </div>

    {previewOpen && previewTemplate && (
      <PdfViewerModal
        url={buildPreviewSrc(previewTemplate.file)}
        title={getTemplateVariantName(previewTemplate.file)}
        onClose={() => setPreviewOpen(false)}
      />
    )}
    </>
  );
}
