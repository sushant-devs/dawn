'use client';

import { useState } from 'react';
import { X, CheckCircle2, FileText, Eye, ExternalLink } from 'lucide-react';
import { TEMPLATE_RECOMMENDATIONS } from '@/lib/mockData';
import type { ContentTemplate } from '@/lib/types';

interface TemplateSelectorModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

// Visual preview component - shows actual images for specific templates
function TemplateVisualPreview({ template }: { template: ContentTemplate }) {
  // Professional HCP Email gets the email image
  if (template.id === 'email-professional') {
    return (
      <div className="w-full h-16 rounded border border-gray-200 overflow-hidden bg-white">
        <img 
          src="/templates/email.png"
          alt={`${template.name} preview`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA5NiA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0OCIgcng9IjQiIGZpbGw9IiNFNUU3RUIiLz4KPHN2Zz4K';
          }}
        />
      </div>
    );
  }

  // Scientific Congress Poster gets the poster image
  if (template.id === 'poster-scientific') {
    return (
      <div className="w-full h-16 rounded border border-gray-200 overflow-hidden bg-white">
        <img 
          src="/templates/poster.png"
          alt={`${template.name} preview`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA5NiA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0OCIgcng9IjQiIGZpbGw9IiNFNUU3RUIiLz4KPHN2Zz4K';
          }}
        />
      </div>
    );
  }

  // Modular Interactive DDA gets the dda image
  if (template.id === 'dda-modular') {
    return (
      <div className="w-full h-16 rounded border border-gray-200 overflow-hidden bg-white">
        <img 
          src="/templates/dda.jpg"
          alt={`${template.name} preview`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA5NiA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0OCIgcng9IjQiIGZpbGw9IiNFNUU3RUIiLz4KPHN2Zz4K';
          }}
        />
      </div>
    );
  }

  // All other templates use the template structure preview
  return (
    <div className="w-full h-16 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-xs text-gray-400 font-medium mb-1">Template Structure</div>
        <div className="text-[10px] text-gray-500">
          {template.structure.slice(0, 2).join(' → ')}
          {template.structure.length > 2 && '...'}
        </div>
      </div>
    </div>
  );
}

export default function TemplateSelectorModal({ onConfirm, onClose }: TemplateSelectorModalProps) {
  const [selectedTemplates, setSelectedTemplates] = useState<Record<string, string>>({
    'Congress Poster': 'poster-scientific',
    'HCP Email (US)': 'email-professional',
    'HCP Email (DE)': 'email-professional',
    'Patient Leaflet': 'leaflet-standard',
    'Digital Detail Aid': 'dda-modular',
  });
  const [activeTab, setActiveTab] = useState<string>('Congress Poster');

  // Get unique asset types for tabs
  const assetTypes = TEMPLATE_RECOMMENDATIONS.map(r => r.assetType);

  const handleTemplateSelect = (assetType: string, templateId: string) => {
    setSelectedTemplates((prev) => ({
      ...prev,
      [assetType]: templateId,
    }));
  };

  const handlePreviewTemplate = (template: ContentTemplate) => {
    // Map template types to available HTML files
    const getPreviewPath = (template: ContentTemplate) => {
      switch (template.type) {
        case 'email':
          return '/templates/previews/email-template.html';
        case 'poster':
          return '/templates/previews/poster-template.html';
        case 'leaflet':
          return '/templates/previews/leaflet-template.html'; // You'll need to add this
        case 'dda':
          return '/templates/previews/dda-template.html';
        default:
          return '/templates/previews/email-template.html'; // Fallback
      }
    };

    // Open HTML preview in new window
    window.open(getPreviewPath(template), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border bg-white">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Content Template Selection</h2>
              <p className="text-xs text-gray-400">Stage 4 — Choose templates for your content</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer">
            <X size={20} />
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
                {assetType}
              </button>
            ))}
          </div>
        </div>

        {/* Body - Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {TEMPLATE_RECOMMENDATIONS.filter(r => r.assetType === activeTab).map((recommendation) => (
            <div key={recommendation.assetType} className="space-y-3">
              {recommendation.recommendedTemplates.map((template) => {
                const isSelected = selectedTemplates[recommendation.assetType] === template.id;
                const isRecommended = template.recommended;

                return (
                  <div
                    key={template.id}
                    className={`group relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-dawn-teal/70 bg-gradient-to-br from-dawn-teal/[0.06] via-white to-[#eef8ff] shadow-[0_12px_28px_rgba(9,30,66,0.10)] ring-1 ring-dawn-teal/15'
                        : 'border-[#dbe3ee] bg-white shadow-[0_6px_16px_rgba(9,30,66,0.04)] hover:-translate-y-0.5 hover:border-dawn-teal/45 hover:shadow-[0_14px_26px_rgba(9,30,66,0.10)]'
                    }`}
                    onClick={() => handleTemplateSelect(recommendation.assetType, template.id)}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-dawn-teal/90 to-[#1A3FCC] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <div className="flex items-start gap-3">
                      {/* Selection indicator */}
                      <div className={`mt-0.5 shrink-0 ${isSelected ? 'text-dawn-teal' : 'text-gray-300'}`}>
                        <CheckCircle2 size={20} fill={isSelected ? 'currentColor' : 'none'} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex items-start gap-3">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h4 className="text-base font-semibold leading-tight text-dawn-navy">{template.name}</h4>
                              {isRecommended && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-dawn-amber/30 bg-dawn-amber/15 px-2 py-0.5 text-xs font-semibold text-dawn-amber">
                                  ★ Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-gray-600">{template.description}</p>
                          </div>

                          {/* Visual Preview */}
                          <div className="w-24 shrink-0">
                            <TemplateVisualPreview template={template} />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviewTemplate(template);
                              }}
                              className="mt-1 flex w-full items-center justify-center gap-1 rounded-md border border-dawn-teal/30 bg-white px-2 py-1 text-xs font-medium text-dawn-teal transition-colors hover:bg-dawn-teal/5 hover:text-dawn-teal/80 cursor-pointer"
                              title={`Preview ${template.name}`}
                            >
                              <Eye size={10} />
                              Preview
                            </button>
                          </div>
                        </div>

                        {/* Structure preview */}
                        <div className="mb-2 rounded-md border border-[#d8e0eb] bg-[#f9fbff] px-2 py-1.5 font-mono text-[10px] text-gray-500">
                          {template.preview}
                        </div>

                        {/* Structure elements */}
                        <div className="flex flex-wrap gap-1">
                          {template.structure.map((element, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-[#f1f5fb] px-1.5 py-0.5 text-[10px] font-medium text-gray-600"
                            >
                              {element}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500">
              {Object.keys(selectedTemplates).length} templates selected
            </p>
            <button
              onClick={() => {
                // Reset to recommended templates
                setSelectedTemplates({
                  'Congress Poster': 'poster-scientific',
                  'HCP Email (US)': 'email-professional',
                  'HCP Email (DE)': 'email-professional',
                  'Patient Leaflet': 'leaflet-standard',
                  'Digital Detail Aid': 'dda-modular',
                });
              }}
              className="text-xs text-dawn-teal hover:text-dawn-teal/80 font-medium cursor-pointer"
            >
              Reset to recommended
            </button>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-dawn-teal to-[#1A3FCC] text-white text-sm font-medium shadow-[0_10px_22px_rgba(26,63,204,0.26)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#1AB7C3] hover:to-[#2449DD] hover:shadow-[0_14px_28px_rgba(26,63,204,0.34)] active:translate-y-0 active:shadow-[0_8px_16px_rgba(26,63,204,0.26)] cursor-pointer"
            >
              Confirm Templates & Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
