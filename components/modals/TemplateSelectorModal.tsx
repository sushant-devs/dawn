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
          <div className="w-1.5 h-1.5 rounded-full bg-dawn-teal" />
          <p className="text-xs text-dawn-teal">
            Templates marked with ★ are recommended based on your campaign brief and audience. These define content structure - visual design comes in the next step.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {TEMPLATE_RECOMMENDATIONS.map((recommendation) => (
            <section key={recommendation.assetType}>
              <h3 className="text-sm font-semibold text-dawn-navy mb-3 flex items-center gap-2">
                <FileText size={16} className="text-dawn-teal" />
                {recommendation.assetType}
              </h3>

              <div className="space-y-3">
                {recommendation.recommendedTemplates.map((template) => {
                  const isSelected = selectedTemplates[recommendation.assetType] === template.id;
                  const isRecommended = template.recommended;

                  return (
                    <div
                      key={template.id}
                      className={`w-full text-left rounded-lg border p-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-dawn-teal bg-dawn-teal/5 shadow-sm'
                          : 'border-dawn-border hover:border-dawn-teal/50 hover:bg-gray-50'
                      }`}
                      onClick={() => handleTemplateSelect(recommendation.assetType, template.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Selection indicator */}
                        <div className={`mt-0.5 shrink-0 ${isSelected ? 'text-dawn-teal' : 'text-gray-300'}`}>
                          <CheckCircle2 size={20} fill={isSelected ? 'currentColor' : 'none'} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-dawn-navy">{template.name}</h4>
                                {isRecommended && (
                                  <span className="text-xs bg-dawn-amber/20 text-dawn-amber px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                    ★ Recommended
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600">{template.description}</p>
                            </div>

                            {/* Visual Preview */}
                            <div className="w-24 shrink-0">
                              <TemplateVisualPreview template={template} />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreviewTemplate(template);
                                }}
                                className="mt-1 w-full flex items-center justify-center gap-1 px-2 py-1 text-xs text-dawn-teal hover:text-dawn-teal/80 border border-dawn-teal/30 rounded hover:bg-dawn-teal/5 transition-colors cursor-pointer"
                                title={`Preview ${template.name}`}
                              >
                                <Eye size={10} />
                                Preview
                              </button>
                            </div>
                          </div>

                          {/* Structure preview */}
                          <div className="bg-white border border-gray-200 rounded px-2 py-1.5 text-[10px] text-gray-500 font-mono mb-2">
                            {template.preview}
                          </div>

                          {/* Structure elements */}
                          <div className="flex flex-wrap gap-1">
                            {template.structure.map((element, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
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
            </section>
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
              className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm cursor-pointer"
            >
              Confirm Templates & Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
