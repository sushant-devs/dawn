'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Eye, Check, Loader2 } from 'lucide-react';
import { TemplateResponse } from '@/lib/types';
import { useCampaignData } from '@/context/DAWNContext';
import Button from '@/components/ui/Button';

interface TemplateSelectorModalProps {
  onConfirm: () => void;
  onClose: () => void;
  readOnly?: boolean;
}

// Small palette used to give templates of the same type slight visual variation.
// Once real thumbnails come back from S3 (template.template_image), these mocks
// are no longer used.
const THUMBNAIL_PALETTE: { primary: string; soft: string }[] = [
  { primary: '#8624FF', soft: '#F3E8FF' },
  { primary: '#0EA5E9', soft: '#E0F2FE' },
  { primary: '#10B981', soft: '#D1FAE5' },
  { primary: '#8B5CF6', soft: '#EDE9FE' },
  { primary: '#F59E0B', soft: '#FEF3C7' },
  { primary: '#EC4899', soft: '#FCE7F3' },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pickPalette(id: string) {
  return THUMBNAIL_PALETTE[hashString(id) % THUMBNAIL_PALETTE.length];
}

// Pure SVG mock thumbnails per template type. Designed for a ~16:9-ish container
// (the parent is `w-full h-32`). Each renders inside a viewBox so it scales nicely.
function EmailMock({ primary, soft }: { primary: string; soft: string }) {
  return (
    <svg viewBox="0 0 200 128" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="128" fill="white" />
      <rect x="0" y="0" width="200" height="22" fill={primary} />
      <rect x="10" y="8" width="42" height="6" rx="1.5" fill="white" opacity="0.95" />
      <rect x="14" y="34" width="120" height="6" rx="1.5" fill="#0F172A" />
      <rect x="14" y="48" width="170" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="14" y="56" width="160" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="14" y="64" width="140" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="14" y="78" width="172" height="20" rx="3" fill={soft} />
      <rect x="14" y="106" width="60" height="9" rx="2" fill={primary} />
      <rect x="80" y="108" width="40" height="5" rx="1.5" fill="#E2E8F0" />
    </svg>
  );
}

function PosterMock({ primary, soft }: { primary: string; soft: string }) {
  return (
    <svg viewBox="0 0 200 128" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="128" fill="white" />
      <rect x="58" y="6" width="84" height="50" rx="3" fill={soft} />
      <circle cx="100" cy="31" r="11" fill={primary} opacity="0.85" />
      <rect x="58" y="62" width="84" height="6" rx="1.5" fill="#0F172A" />
      <rect x="62" y="74" width="76" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="62" y="82" width="68" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="62" y="90" width="72" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="62" y="106" width="40" height="8" rx="2" fill={primary} />
      <rect x="10" y="6" width="40" height="116" rx="2" fill="#F8FAFC" />
      <rect x="150" y="6" width="40" height="116" rx="2" fill="#F8FAFC" />
    </svg>
  );
}

function LeafletMock({ primary, soft }: { primary: string; soft: string }) {
  return (
    <svg viewBox="0 0 200 128" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="128" fill="white" />
      {/* three vertical panels */}
      <rect x="6" y="6" width="60" height="116" rx="3" fill="#F8FAFC" stroke="#E2E8F0" />
      <rect x="70" y="6" width="60" height="116" rx="3" fill={soft} />
      <rect x="134" y="6" width="60" height="116" rx="3" fill="#F8FAFC" stroke="#E2E8F0" />
      {/* panel 1 content */}
      <rect x="12" y="14" width="48" height="22" rx="2" fill={primary} opacity="0.85" />
      <rect x="12" y="42" width="40" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="12" y="50" width="44" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="12" y="58" width="36" height="3" rx="1.5" fill="#CBD5E1" />
      {/* panel 2 content */}
      <rect x="76" y="14" width="48" height="6" rx="1.5" fill="#0F172A" />
      <rect x="76" y="26" width="48" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="76" y="34" width="42" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="76" y="46" width="48" height="32" rx="2" fill="white" stroke={primary} strokeOpacity="0.4" />
      <rect x="76" y="86" width="48" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="76" y="94" width="40" height="3" rx="1.5" fill="#94A3B8" />
      {/* panel 3 content */}
      <rect x="140" y="14" width="48" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="140" y="22" width="44" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="140" y="30" width="48" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="140" y="44" width="48" height="22" rx="2" fill={soft} />
      <rect x="140" y="72" width="32" height="7" rx="1.5" fill={primary} />
    </svg>
  );
}

function DdaMock({ primary, soft }: { primary: string; soft: string }) {
  return (
    <svg viewBox="0 0 200 128" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="128" fill="#F1F5F9" />
      {/* device frame */}
      <rect x="8" y="8" width="184" height="112" rx="6" fill="white" stroke="#E2E8F0" />
      {/* top nav */}
      <rect x="8" y="8" width="184" height="18" rx="6" fill={primary} />
      <rect x="14" y="14" width="30" height="6" rx="1.5" fill="white" opacity="0.95" />
      <rect x="50" y="14" width="20" height="6" rx="1.5" fill="white" opacity="0.55" />
      <rect x="74" y="14" width="20" height="6" rx="1.5" fill="white" opacity="0.55" />
      {/* content */}
      <rect x="16" y="34" width="74" height="68" rx="3" fill={soft} />
      <circle cx="53" cy="68" r="14" fill={primary} opacity="0.85" />
      <rect x="100" y="36" width="86" height="6" rx="1.5" fill="#0F172A" />
      <rect x="100" y="48" width="80" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="100" y="56" width="72" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="100" y="64" width="84" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="100" y="78" width="40" height="8" rx="2" fill={primary} />
      {/* pagination dots */}
      <circle cx="92" cy="112" r="2" fill={primary} />
      <circle cx="100" cy="112" r="2" fill="#CBD5E1" />
      <circle cx="108" cy="112" r="2" fill="#CBD5E1" />
    </svg>
  );
}

function SocialMock({ primary, soft }: { primary: string; soft: string }) {
  return (
    <svg viewBox="0 0 200 128" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="128" fill="white" />
      {/* header */}
      <circle cx="20" cy="18" r="8" fill={primary} />
      <rect x="32" y="13" width="40" height="4" rx="1.5" fill="#0F172A" />
      <rect x="32" y="20" width="28" height="3" rx="1.5" fill="#CBD5E1" />
      {/* image */}
      <rect x="10" y="32" width="180" height="62" rx="3" fill={soft} />
      <circle cx="100" cy="63" r="14" fill={primary} opacity="0.85" />
      {/* caption */}
      <rect x="10" y="100" width="170" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="10" y="108" width="140" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="10" y="116" width="100" height="3" rx="1.5" fill="#CBD5E1" />
    </svg>
  );
}

function GenericMock({ primary, soft }: { primary: string; soft: string }) {
  return (
    <svg viewBox="0 0 200 128" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="128" fill="white" />
      <rect x="10" y="10" width="180" height="50" rx="3" fill={soft} />
      <rect x="14" y="68" width="120" height="6" rx="1.5" fill="#0F172A" />
      <rect x="14" y="80" width="170" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="14" y="88" width="160" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="14" y="96" width="140" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="14" y="110" width="50" height="8" rx="2" fill={primary} />
    </svg>
  );
}

function MockThumbnail({ template }: { template: TemplateResponse }) {
  const palette = pickPalette(template.id || template.name);

  switch (template.type) {
    case 'email':
      return <EmailMock {...palette} />;
    case 'poster':
      return <PosterMock {...palette} />;
    case 'leaflet':
      return <LeafletMock {...palette} />;
    case 'dda':
      return <DdaMock {...palette} />;
    case 'social':
      return <SocialMock {...palette} />;
    default:
      return <GenericMock {...palette} />;
  }
}

// Renders a live thumbnail of the template's HTML. The template documents are
// authored at a fixed design width (e.g. 1080px posters), so we render them in a
// non-interactive iframe at that width and scale it down to fill the card. Using
// `srcDoc` keeps it isolated and avoids a separate navigation.
// Width the template documents are authored at (posters ~1080px). The iframe
// renders at this width then scales to exactly fill the card; the wrapper clips
// the overflowing height so we see the top of the document.
const THUMB_DESIGN_WIDTH = 1080;
const THUMB_DESIGN_HEIGHT = 1600;

function HtmlThumbnail({ template }: { template: TemplateResponse }) {
  const [html, setHtml] = useState<string | null>(template.html_code ?? null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    if (template.html_code || !template.templateFile) return;
    let cancelled = false;
    fetch(template.templateFile)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((text) => {
        if (!cancelled) setHtml(text);
      })
      .catch(() => {
        /* fall back to mock on error */
      });
    return () => {
      cancelled = true;
    };
  }, [template.templateFile, template.html_code]);

  // Scale the fixed-width document so its width exactly fills the card.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / THUMB_DESIGN_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [html]);

  if (!html) return <MockThumbnail template={template} />;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-white">
      <iframe
        title={`${template.name} thumbnail`}
        srcDoc={html}
        scrolling="no"
        tabIndex={-1}
        aria-hidden
        // pointer-events-none keeps the whole card clickable for selection.
        className="pointer-events-none origin-top-left border-0 bg-white"
        style={{
          width: `${THUMB_DESIGN_WIDTH}px`,
          height: `${THUMB_DESIGN_HEIGHT}px`,
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}

// Renders a thumbnail for a template card. Prefers the first real image URL
// returned by the backend (e.g. from S3) via `template.template_image`; then a
// live HTML render of the template; otherwise a type-specific SVG mockup.
// NOTE: the parent container must be `relative` for `fill`/`inset-0` to work.
function TemplateThumbnail({ template }: { template: TemplateResponse }) {
  const imageUrl = template.template_image?.[0];

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={`${template.name} preview`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 320px"
        draggable={false}
      />
    );
  }

  if (template.html_code || template.templateFile) {
    return <HtmlThumbnail template={template} />;
  }

  return <MockThumbnail template={template} />;
}

function formatAssetType(assetType: string): string {
  return assetType.replace(/^HCP\s+/i, '');
}

export default function TemplateSelectorModal({ onConfirm, onClose, readOnly = false }: TemplateSelectorModalProps) {
  // Templates come from the active campaign's bundle (no API call). Each
  // template's HTML lives as a static file under /data/<brand>/Templates/.
  const { templates: templateData } = useCampaignData();

  const [selectedTemplates, setSelectedTemplates] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateResponse | null>(null);
  // Fetched HTML for the currently previewed template file.
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Seed default selections (recommended template per asset type) and the
  // initial active tab whenever the campaign's templates change.
  useEffect(() => {
    const defaultSelections: Record<string, string> = {};
    templateData.forEach((group) => {
      const recommendedTemplate = group.recommendedTemplates.find((t) => t.recommended);
      if (recommendedTemplate) {
        defaultSelections[group.assetType] = recommendedTemplate.id;
      } else if (group.recommendedTemplates.length > 0) {
        defaultSelections[group.assetType] = group.recommendedTemplates[0].id;
      }
    });
    setSelectedTemplates(defaultSelections);
    setActiveTab(templateData[0]?.assetType ?? '');
  }, [templateData]);

  // Get unique asset types for tabs
  const assetTypes = templateData.map(r => r.assetType);

  const handleTemplateSelect = (assetType: string, templateId: string) => {
    setSelectedTemplates((prev) => ({
      ...prev,
      [assetType]: templateId,
    }));
  };

  const handlePreviewTemplate = async (template: TemplateResponse) => {
    // Prefer inline html_code if present; otherwise fetch the static file.
    if (!template.html_code && !template.templateFile) {
      alert('No preview available for this template.');
      return;
    }

    setPreviewTemplate(template);
    setPreviewError(null);

    if (template.html_code) {
      setPreviewHtml(template.html_code);
      return;
    }

    setIsPreviewLoading(true);
    setPreviewHtml(null);
    try {
      const res = await fetch(template.templateFile as string);
      if (!res.ok) throw new Error(`Failed to load template (${res.status})`);
      setPreviewHtml(await res.text());
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'Failed to load template preview.');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
    setPreviewHtml(null);
    setPreviewError(null);
    setIsPreviewLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dawn-border bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8624FF] to-[#6B1FCC] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-serif text-lg font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-xl text-dawn-navy font-semibold">Content Template Selection</h2>
              <p className="text-sm text-gray-500 mt-0.5">Choose templates for your content</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer">
            <X size={22} />
          </button>
        </div>

        {/* AI recommendation notice */}
        <div className="px-6 py-2.5 bg-dawn-teal/5 border-b border-dawn-teal/20 flex items-center gap-2">
          <p className="text-xs text-dawn-teal">
            Recommended templates are selected based on your campaign brief and target audience.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="px-6 flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {assetTypes.map((assetType) => (
              <button
                key={assetType}
                onClick={() => setActiveTab(assetType)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === assetType
                    ? 'border-dawn-teal text-dawn-teal bg-white'
                    : 'border-transparent text-slate-600 hover:text-dawn-navy hover:bg-slate-100'
                }`}
              >
                {formatAssetType(assetType)}
              </button>
            ))}
          </div>
        </div>

        {/* Body - Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {templateData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-dawn-navy">No templates available yet</p>
              <p className="mt-1 text-xs text-gray-500">
                Templates for this brand will appear here once they are added.
              </p>
            </div>
          ) : templateData.filter(r => r.assetType === activeTab).map((recommendation) => (
            <div key={recommendation.assetType} className="grid grid-cols-2 gap-4">
              {recommendation.recommendedTemplates.map((template) => {
                const isSelected = selectedTemplates[recommendation.assetType] === template.id;
                const isRecommended = template.recommended;

                return (
                  <div
                    key={template.id}
                    className={`group relative flex w-full flex-col overflow-hidden rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#8624FF] shadow-[0_8px_24px_rgba(134,36,255,0.18)]'
                        : 'border-gray-200 hover:border-[#8624FF]/40 hover:shadow-[0_8px_20px_rgba(134,36,255,0.14)]'
                    }`}
                    onClick={() => handleTemplateSelect(recommendation.assetType, template.id)}
                  >
                    {isSelected && (
                      <div className="absolute top-3 left-3 w-6 h-6 bg-[#8624FF] rounded-full flex items-center justify-center shadow-md z-10">
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* Thumbnail fills the card top, edge-to-edge */}
                    <div className="relative h-44 w-full overflow-hidden bg-white">
                      <TemplateThumbnail template={template} />
                    </div>

                    {/* Preview action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewTemplate(template);
                      }}
                      className="flex w-full items-center justify-center gap-2 border-t border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                      title={`Preview ${template.name}`}
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>


        {/* Footer */}
        {!readOnly && (
           <div className="px-6 py-4 border-t border-dawn-border bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500">
              {Object.keys(selectedTemplates).length} templates selected
            </p>
            <button
              onClick={() => {
                // Reset to recommended templates
                const defaultSelections: Record<string, string> = {};
                templateData.forEach(group => {
                  const recommendedTemplate = group.recommendedTemplates.find(t => t.recommended);
                  if (recommendedTemplate) {
                    defaultSelections[group.assetType] = recommendedTemplate.id;
                  } else if (group.recommendedTemplates.length > 0) {
                    defaultSelections[group.assetType] = group.recommendedTemplates[0].id;
                  }
                });
                setSelectedTemplates(defaultSelections);
              }}
              className="text-xs text-dawn-teal hover:text-dawn-teal/80 font-medium cursor-pointer"
            >
              Reset to recommended
            </button>
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={onClose} variant="secondary" size="md" rounded="lg">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="primary" size="md" rounded="lg" disabled={templateData.length === 0}>
              Confirm Templates & Continue →
            </Button>
          </div>
        </div>
        )}
      </div>

      {/* Full-page HTML preview overlay (renders above the template selector). */}
      {previewTemplate && (
        <div className="fixed inset-0 z-60 flex flex-col bg-white animate-scale-in">
          <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border bg-white">
            <div>
              <h3 className="font-serif text-lg text-dawn-navy font-semibold">{previewTemplate.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Template preview</p>
            </div>
            <button
              onClick={handleClosePreview}
              className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer"
              title="Close preview"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden bg-[#f5f7fa]">
            {isPreviewLoading ? (
              <div className="flex h-full flex-col items-center justify-center">
                <Loader2 size={32} className="mb-3 animate-spin text-[#8624FF]" />
                <p className="text-sm text-gray-500">Loading preview…</p>
              </div>
            ) : previewError ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="text-sm font-medium text-dawn-red">{previewError}</p>
              </div>
            ) : (
              <iframe
                title={`${previewTemplate.name} preview`}
                srcDoc={previewHtml ?? ''}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                className="h-full w-full border-0 bg-white"
              />
            )}
          </div>
          <div className="px-6 py-3 border-t border-dawn-border bg-white flex justify-end">
            <Button onClick={handleClosePreview} variant="secondary" size="md" rounded="lg">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
