'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, BookOpen, Award, ShieldCheck, Eye } from 'lucide-react';
import type { DocumentCard as DocumentCardType } from '@/lib/types';

interface DocumentCardProps extends DocumentCardType {
  onPreview?: (filePath: string, title: string) => void;
}

const TYPE_CONFIG = {
  CSR: { icon: FileText, color: 'bg-blue-50 text-blue-700', border: 'border-blue-200/70' },
  Publication: { icon: BookOpen, color: 'bg-purple-50 text-purple-700', border: 'border-purple-200/70' },
  'Brand Standard': { icon: Award, color: 'bg-dawn-teal/10 text-dawn-teal', border: 'border-dawn-teal/25' },
  Regulatory: { icon: ShieldCheck, color: 'bg-dawn-amber/10 text-dawn-amber', border: 'border-dawn-amber/30' },
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

function getRelevanceBadgeBg(score: number) {
  if (score >= 90) return 'bg-dawn-green/10';
  if (score >= 80) return 'bg-dawn-amber/10';
  return 'bg-gray-100';
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
      className="group relative overflow-hidden rounded-2xl border border-[#e5e9f2] bg-gradient-to-b from-white to-[#fcfdff] p-4 shadow-[0_8px_26px_rgba(14,30,86,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-dawn-teal/40 hover:shadow-[0_16px_34px_rgba(14,30,86,0.14)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-dawn-teal/90 to-[#1A3FCC]" />

      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.color} border ${cfg.border}`}>
          <Icon size={11} />
          {type}
        </span>
        <div className="flex items-center gap-2 pr-10">
          {pageCount && (
            <span className="text-[11px] font-medium text-gray-400">
              {pageCount} pages
            </span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${getRelevanceBadgeColor(relevance)} ${getRelevanceBadgeBg(relevance)}`}>
            {relevance}%
          </span>
        </div>
      </div>

      {/* Preview action */}
      {filePath && onPreview && (
        <div className="group/preview absolute right-3 top-3">
          <button
            onClick={handlePreview}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-dawn-teal/25 bg-white text-dawn-teal shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-dawn-teal/10 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dawn-teal/40 focus-visible:ring-offset-1"
            aria-label="Preview Document"
          >
            <Eye size={14} />
          </button>
          <span className="pointer-events-none absolute right-0 top-9 whitespace-nowrap rounded-md bg-dawn-navy px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover/preview:opacity-100 group-focus-within/preview:opacity-100">
            Preview Document
          </span>
        </div>
      )}

      {/* Relevance bar */}
      <div className="relative mb-3 h-[3px] w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${getRelevanceColor(relevance)}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {/* Title */}
      <h4 className="mb-1.5 text-base font-semibold leading-tight text-dawn-navy">{title}</h4>

      {/* Key finding */}
      <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">{keyFinding}</p>

    </div>
  );
}
