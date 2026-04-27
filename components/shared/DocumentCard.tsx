'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, BookOpen, Award, ShieldCheck, Eye } from 'lucide-react';
import type { DocumentCard as DocumentCardType } from '@/lib/types';

interface DocumentCardProps extends DocumentCardType {
  onPreview?: (filePath: string, title: string) => void;
}

const TYPE_CONFIG = {
  CSR: { icon: FileText, color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  Publication: { icon: BookOpen, color: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
  'Brand Standard': { icon: Award, color: 'bg-dawn-teal/10 text-dawn-teal', border: 'border-dawn-teal/20' },
  Regulatory: { icon: ShieldCheck, color: 'bg-dawn-amber/10 text-dawn-amber', border: 'border-dawn-amber/20' },
};

function getRelevanceColor(score: number) {
  if (score >= 90) return 'bg-dawn-green';
  if (score >= 80) return 'bg-dawn-amber';
  return 'bg-gray-400';
}

function getRelevanceBadgeColor(score: number) {
  if (score >= 90) return 'text-dawn-green';
  if (score >= 80) return 'text-dawn-amber';
  return 'text-gray-500';
}

export default function DocumentCard({ id, title, type, relevance, keyFinding, filePath, pageCount, onPreview }: DocumentCardProps) {
  const cfg = TYPE_CONFIG[type];
  const Icon = cfg.icon;
  const [barWidth, setBarWidth] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setTimeout(() => setBarWidth(relevance), 100);
    }
  }, [relevance]);

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filePath && onPreview) {
      onPreview(filePath, title);
    }
  };

  return (
    <div
      className="relative rounded-xl border bg-white p-4 transition-all duration-200 hover:shadow-md border-dawn-border hover:border-dawn-teal/40"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color} border ${cfg.border}`}>
          <Icon size={10} />
          {type}
        </span>
        <div className="flex items-center gap-2">
          {pageCount && (
            <span className="text-[10px] text-gray-400">
              {pageCount} pages
            </span>
          )}
          <span className={`text-xs font-semibold ${getRelevanceBadgeColor(relevance)}`}>
            {relevance}%
          </span>
        </div>
      </div>

      {/* Relevance bar */}
      <div className="w-full bg-gray-100 rounded-full h-1 mb-3">
        <div
          className={`h-1 rounded-full transition-all duration-500 ease-out ${getRelevanceColor(relevance)}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-dawn-navy mb-1 leading-tight">{title}</h4>

      {/* Key finding */}
      <p className="text-xs text-gray-500 italic line-clamp-2 leading-relaxed">{keyFinding}</p>

      {/* Preview button */}
      {filePath && onPreview && (
        <button
          onClick={handlePreview}
          className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dawn-teal/25 bg-gradient-to-r from-dawn-teal to-[#1A3FCC] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(26,63,204,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#3B67FF] hover:to-[#1738B8] hover:shadow-[0_12px_22px_rgba(26,63,204,0.3)] active:translate-y-0 active:shadow-[0_6px_12px_rgba(26,63,204,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dawn-teal/40 focus-visible:ring-offset-2"
        >
          <Eye size={12} />
          Preview Document
        </button>
      )}
    </div>
  );
}
