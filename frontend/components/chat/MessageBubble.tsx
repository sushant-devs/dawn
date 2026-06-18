"use client";

import { useState, useEffect, useRef } from "react";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Copy,
  RefreshCw,
  Check,
  Lightbulb,
  Sparkles,
  FileText,
  Eye,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import type {
  ChatMessage,
  AgentResponseContent,
  DocumentCard as DocType,
  ModalType,
} from "@/lib/types";
import DocumentCard from "@/components/shared/DocumentCard";
import StatusPill from "@/components/shared/StatusPill";
import {
  ImageViewerModal,
  PdfViewerModal,
  isImageUrl,
} from "@/components/shared/DocumentPreviewModal";
import Button from "@/components/ui/Button";
import QAChart from "@/components/chat/QAChart";
import { useDAWN } from "@/context/DAWNContext";
import { getCampaign } from "@/lib/campaigns";

interface MessageBubbleProps {
  message: ChatMessage;
  shouldStream?: boolean;
  onStreamComplete?: (messageId: string) => void;
  onContentExpand?: () => void;
}

const MESSAGE_STREAM_SPEED = 95;
const MESSAGE_STREAM_START_DELAY_MS = 100;

function formatTime(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Simple markdown-like renderer (bold via **)
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-[family-name:var(--font-poppins)]">
      {parts.map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="font-semibold text-dawn-navy">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}

// Campaign summary card - Clean Table Layout
function CampaignSummaryCard({
  data,
}: {
  data: NonNullable<AgentResponseContent["campaignSummary"]>;
}) {
  return (
    <div className="mt-3 max-w-2xl">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-[35%_65%] border-b border-gray-200">
          <div className="px-4 py-3 font-semibold text-sm text-gray-700 font-body">
            Configuration
          </div>
          <div className="px-4 py-3 font-semibold text-sm text-gray-700 font-body">
            Value
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {/* Brand Row */}
          <div className="grid grid-cols-[35%_65%]">
            <div className="px-4 py-3 text-sm font-normal text-gray-700 font-body">
              Brand
            </div>
            <div className="px-4 py-3 text-sm font-normal text-gray-900 font-body">
              {data.brand}
            </div>
          </div>

          {/* Therapeutic Area Row */}
          <div className="grid grid-cols-[35%_65%]">
            <div className="px-4 py-3 text-sm font-normal text-gray-700 font-body">
              Therapeutic Area
            </div>
            <div className="px-4 py-3 text-sm font-normal text-gray-900 font-body">
              {data.ta}
            </div>
          </div>

          {/* Markets Row */}
          <div className="grid grid-cols-[35%_65%]">
            <div className="px-4 py-3 text-sm font-normal text-gray-700 font-body">
              Markets
            </div>
            <div className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {data.markets.map((market) => (
                  <span
                    key={market}
                    className="inline-flex items-center px-1.5 py-1 rounded-md bg-blue-100 text-blue-700 text-sm font-medium font-body"
                  >
                    {market}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Target Audience Row */}
          <div className="grid grid-cols-[35%_65%]">
            <div className="px-4 py-3 text-sm font-normal text-gray-700 font-body">
              Target Audience
            </div>
            <div className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {data.audience.map((aud) => (
                  <span
                    key={aud}
                    className="inline-flex items-center px-1.5 py-1 rounded-md bg-purple-100 text-purple-700 text-sm font-medium font-body"
                  >
                    {aud}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generic Table Block
function TableBlock({
  table,
}: {
  table: NonNullable<AgentResponseContent["table"]>;
}) {
  return (
    <div className="mt-4 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {table.title && (
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200">
          <h4 className="text-sm font-semibold text-slate-800">{table.title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {table.headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 font-medium border-b border-slate-200 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  table.highlightRowIndex === rowIndex
                    ? "bg-blue-50/60"
                    : "hover:bg-slate-50/50"
                }
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-3 ${
                      cellIndex === 0 ? "font-medium text-slate-700" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.caption && (
        <div className="bg-slate-50 px-4 py-2 text-xs italic text-slate-500 border-t border-slate-200">
          {table.caption}
        </div>
      )}
    </div>
  );
}

// Paths from /public/data/<brand>/... contain spaces and characters like
// "+"/"-"; encode each segment so the browser resolves the static file
// reliably (already-encoded paths are left untouched).
function encodeAssetPath(filePath: string) {
  return filePath
    .split("/")
    .map((segment) =>
      segment === decodeURIComponent(segment) ? encodeURIComponent(segment) : segment,
    )
    .join("/");
}

const IMAGE_EXTENSION_RE = /\.(png|jpe?g|gif|webp|svg)$/i;
const isImageAsset = (doc: DocType) =>
  IMAGE_EXTENSION_RE.test(doc.filePath ?? "") || IMAGE_EXTENSION_RE.test(doc.title);

// Map a document to its tag label + tag styling. Each category routes to a
// dawn-* accent so the compliance/brand sections stay fully on-theme.
function getDocTag(doc: DocType): { label: string; className: string } {
  const title = doc.title.toLowerCase();
  switch (doc.type) {
    case "Regulatory":
      return { label: "MLR", className: "bg-dawn-amber/10 text-dawn-amber ring-1 ring-inset ring-dawn-amber/25" };
    case "Safety Guideline":
      return { label: "SAFETY GUIDELINE", className: "bg-dawn-red/10 text-dawn-red ring-1 ring-inset ring-dawn-red/25" };
    case "Publication":
      return {
        label: title.includes("market insight") ? "MARKET INSIGHT REFERENCE FILE" : "PUBLICATION",
        className: "bg-dawn-purple/10 text-dawn-purple ring-1 ring-inset ring-dawn-purple/25",
      };
    case "Brand Standard":
      if (title.includes("logo")) {
        return { label: "LOGO", className: "bg-dawn-green/10 text-dawn-green ring-1 ring-inset ring-dawn-green/25" };
      }
      return { label: "APPROVED IMAGE", className: "bg-dawn-teal/10 text-dawn-teal ring-1 ring-inset ring-dawn-teal/25" };
    default:
      return { label: doc.type.toUpperCase(), className: "bg-slate-50 text-slate-600 ring-1 ring-inset ring-dawn-border" };
  }
}

interface PreviewSectionProps {
  docs: DocType[];
  onPreview: (filePath: string, title: string) => void;
}

// Compliance Reference Set: vertical PDF rows. Used when the docs array mixes
// reference PDFs with brand image assets (see COMPLIANCE_ASSETS).
function ComplianceReferenceList({ docs, onPreview }: PreviewSectionProps) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-dawn-teal" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-dawn-navy">
            Compliance Reference Set
          </h3>
        </div>
        <span className="text-[11px] font-medium text-dawn-teal">
          {docs.length} document{docs.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="space-y-2">
        {docs.map((doc) => {
          const tag = getDocTag(doc);
          return (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-xl border border-dawn-border bg-white px-4 py-3 transition-colors hover:border-dawn-teal/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-dawn-sky text-dawn-teal">
                <FileText size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tag.className}`}>
                  {tag.label}
                </span>
                <p className="mt-1 truncate text-sm font-semibold text-dawn-navy">{doc.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-gray-500">{doc.keyFinding}</p>
              </div>
              {doc.filePath && (
                <button
                  type="button"
                  onClick={() => onPreview(doc.filePath!, doc.title)}
                  aria-label={`Preview ${doc.title}`}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-dawn-sky text-dawn-teal transition-colors hover:bg-dawn-teal/15"
                >
                  <Eye size={15} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Approved Brand Assets: 4-column compact image card grid (logo + imagery).
function ApprovedBrandAssetsGrid({ docs, onPreview }: PreviewSectionProps) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-dawn-teal" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-dawn-navy">
            Approved Brand Assets
          </h3>
        </div>
        <span className="text-[11px] font-medium text-dawn-teal">
          {docs.length} asset{docs.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {docs.map((doc) => {
          const tag = getDocTag(doc);
          const previewSrc = doc.filePath ? encodeAssetPath(doc.filePath) : undefined;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => doc.filePath && onPreview(doc.filePath, doc.title)}
              className="group flex aspect-square flex-col overflow-hidden rounded-lg border border-dawn-border bg-white text-left transition-all hover:-translate-y-0.5 hover:border-dawn-teal/40 hover:shadow-md"
            >
              <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-dawn-sky/40">
                {previewSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewSrc}
                    alt={doc.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="shrink-0 px-2 py-1.5">
                <span className={`inline-block rounded px-1 py-0 text-[9px] font-semibold uppercase tracking-wide ${tag.className}`}>
                  {tag.label}
                </span>
                <p className="mt-0.5 truncate text-[11px] font-semibold text-dawn-navy">{doc.title}</p>
                {doc.keyFinding && (
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-gray-500">{doc.keyFinding}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// Document list with expandable view
function DocumentGrid({ docs }: { docs: DocType[] }) {
  const [showAll, setShowAll] = useState(false);
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  const openPreview = (filePath: string, title: string) => {
    setPreview({ url: encodeAssetPath(filePath), title });
  };
  const closePreview = () => setPreview(null);

  // In-page viewer rendered alongside whichever layout the grid chooses below.
  const previewModal = preview
    ? (isImageUrl(preview.url) ? (
        <ImageViewerModal url={preview.url} title={preview.title} onClose={closePreview} />
      ) : (
        <PdfViewerModal url={preview.url} title={preview.title} onClose={closePreview} />
      ))
    : null;

  // When the docs array mixes reference PDFs with brand-asset images
  // (e.g. COMPLIANCE_ASSETS), split it into a Compliance Reference Set list
  // and an Approved Brand Assets image grid to match the design spec.
  const hasImages = docs.some(isImageAsset);
  if (hasImages) {
    const pdfDocs = docs.filter((d) => !isImageAsset(d));
    const imageDocs = docs.filter(isImageAsset);
    return (
      <>
        <div className="mt-3 space-y-5">
          {pdfDocs.length > 0 && (
            <ComplianceReferenceList docs={pdfDocs} onPreview={openPreview} />
          )}
          {imageDocs.length > 0 && (
            <ApprovedBrandAssetsGrid docs={imageDocs} onPreview={openPreview} />
          )}
        </div>
        {previewModal}
      </>
    );
  }

  // Show first 3 documents initially
  const displayedDocs = showAll ? docs : docs.slice(0, 3);
  const hiddenCount = docs.length - 3;

  const getTypeIcon = (type: string) => {
    if (type === "Clinical Study Report" || type === "CSR") {
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 95) return "text-emerald-600 bg-emerald-50";
    if (relevance >= 90) return "text-green-600 bg-green-50";
    if (relevance >= 85) return "text-amber-600 bg-amber-50";
    return "text-orange-600 bg-orange-50";
  };

  return (
    <>
    <div className="mt-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-slate-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          <span className="text-xs font-semibold text-slate-700">
            {docs.length} Documents Retrieved
          </span>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-1.5">
        {displayedDocs.map((doc) => (
          <div
            key={doc.id}
            onMouseEnter={() => setHoveredDoc(doc.id)}
            onMouseLeave={() => setHoveredDoc(null)}
            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg border bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={() => doc.filePath && openPreview(doc.filePath, doc.title)}
          >
            {/* Type Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              {getTypeIcon(doc.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-slate-900 leading-tight line-clamp-1">
                  {doc.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-snug line-clamp-1 mb-1.5">
                {doc.keyFinding}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {doc?.relevance !== undefined && (
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${getRelevanceColor(doc.relevance)}`}
                  >
                    {doc.relevance}% match
                  </span>
                )}
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-medium text-slate-500">
                  {doc.type}
                </span>
              </div>
            </div>

            {/* Preview Icon on Hover */}
            {hoveredDoc === doc.id && (
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-dawn-teal/10 flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-dawn-teal"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View More Button */}
      {!showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-dawn-teal hover:bg-dawn-teal/5 rounded-lg transition-all duration-200 group"
        >
          <span className="text-xs font-medium text-slate-700 group-hover:text-dawn-teal">
            Show {hiddenCount} More Document{hiddenCount !== 1 ? "s" : ""}
          </span>
          <svg
            className="w-3.5 h-3.5 text-slate-500 group-hover:text-dawn-teal transition-transform group-hover:translate-y-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}

      {/* Show Less Button */}
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-all duration-200 group"
        >
          <span className="text-xs font-medium text-slate-600">Show Less</span>
          <svg
            className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
    {previewModal}
    </>
  );
}

// Content generation assets

// Live HTML thumbnail — renders a generated template document in a scaled,
// non-interactive iframe so the card shows the real design.
const VT_DESIGN_WIDTH = 1080;
const VT_DESIGN_HEIGHT = 1600;

function VisualTemplateThumbnail({ file, title }: { file: string; title: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    let cancelled = false;
    fetch(file)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((text) => {
        if (!cancelled) setHtml(text);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [file]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / VT_DESIGN_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [html]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-white">
      {html && (
        <iframe
          title={`${title} thumbnail`}
          srcDoc={html}
          scrolling="no"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none origin-top-left border-0 bg-white"
          style={{
            width: `${VT_DESIGN_WIDTH}px`,
            height: `${VT_DESIGN_HEIGHT}px`,
            transform: `scale(${scale})`,
          }}
        />
      )}
    </div>
  );
}

// Visual templates — generated template HTML for the active campaign, rendered
// as thumbnail cards (HTML preview + name + asset type).
function ImageVariationsBlock() {
  const { state } = useDAWN();
  const { visualTemplates } = getCampaign(state.campaignId).data;

  if (visualTemplates.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-3">
        {visualTemplates.map((v) => (
          <div
            key={v.id}
            className="w-56 overflow-hidden rounded-xl border border-dawn-border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative h-36 w-full overflow-hidden bg-white">
              <VisualTemplateThumbnail file={v.file} title={v.title} />
            </div>
            <div className="border-t border-dawn-border px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-dawn-navy">{v.title}</p>
              {/* <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                {v.type}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// MLR table - Campaign table style
function MLRTableBlock({
  rows,
}: {
  rows: NonNullable<AgentResponseContent["mlrTable"]>;
}) {
  return (
    <div className="mt-3 max-w-3xl">
      <div className="overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-4 border-b border-gray-200">
          <div className="px-4 py-3 font-semibold text-sm text-gray-700 font-body">
            Asset
          </div>
          <div className="px-4 py-3 font-semibold text-sm text-gray-700 font-body">
            Tier
          </div>
          <div className="px-4 py-3 font-semibold text-sm text-gray-700 font-body">
            AI Pre-Screen
          </div>
          <div className="px-4 py-3 font-semibold text-sm text-gray-700 font-body">
            Status
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-4">
              <div className="px-2 py-1.5 text-sm font-normal text-gray-900 font-body">
                {row.asset}
              </div>
              <div className="px-2 py-1.5">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium font-body ${row.tier === "Tier 1" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}
                >
                  {row.tier}
                </span>
              </div>
              <div className="px-2 py-1.5 text-sm font-normal text-gray-700 font-body">
                {row.aiPreScreen}
              </div>
              <div className="px-2 py-1.5">
                <StatusPill status={row.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// PLS quality scores
function PLSScoresBlock({
  scores,
  preview,
  onExpand,
}: {
  scores: NonNullable<AgentResponseContent["plsScores"]>;
  preview?: string;
  onExpand?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 space-y-3">
      <div className="space-y-2.5 rounded-xl border border-dawn-border bg-gradient-to-b from-white to-[#fbfcff] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
        {scores.map((s) => (
          <div key={s.dimension}>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-dawn-navy">
                {s.dimension}
              </span>
              <span
                className={`text-xs font-semibold ${s.score >= 90 ? "text-dawn-green" : s.score >= 80 ? "text-dawn-teal" : "text-dawn-amber"}`}
              >
                {s.score}/100
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-700 ${s.score >= 90 ? "bg-dawn-green" : s.score >= 80 ? "bg-dawn-teal" : "bg-dawn-amber"}`}
                style={{ width: `${s.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {preview && (
        <div className="rounded-xl border border-dawn-teal/20 bg-gradient-to-br from-[#f8f9ff] to-[#eef2ff] p-4 shadow-[0_10px_24px_rgba(111,92,255,0.12)]">
          <p className="text-xs font-semibold text-dawn-teal mb-2 uppercase tracking-wide">
            PLS Preview
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {expanded ? preview : preview.slice(0, 200) + "…"}
          </p>
          <button
            onClick={() => {
              setExpanded((prev) => {
                const willExpand = !prev;
                if (willExpand && onExpand) {
                  setTimeout(() => onExpand(), 100);
                }
                return willExpand;
              });
            }}
            className="mt-2 flex items-center gap-1 text-xs text-dawn-teal hover:text-dawn-teal/80 font-medium"
          >
            {expanded ? (
              <>
                <ChevronUp size={12} /> Show less
              </>
            ) : (
              <>
                <ChevronDown size={12} /> Show more
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// KPI metrics
// Status summary row
function StatusSummaryBlock({
  summary,
}: {
  summary: NonNullable<AgentResponseContent["statusSummary"]>;
}) {
  return (
    <div className="mt-3 flex gap-2 flex-wrap">
      <span className="bg-dawn-navy/10 text-dawn-navy rounded-full px-3 py-1 text-xs font-medium">
        {summary.total} Assets
      </span>
      <span className="bg-dawn-green/10 text-dawn-green rounded-full px-3 py-1 text-xs font-medium">
        {summary.passed} Passed
      </span>
      {summary.pending > 0 && (
        <span className="bg-dawn-amber/10 text-dawn-amber rounded-full px-3 py-1 text-xs font-medium">
          {summary.pending} Pending
        </span>
      )}
      {summary.flagged > 0 && (
        <span className="bg-dawn-red/10 text-dawn-red rounded-full px-3 py-1 text-xs font-medium">
          {summary.flagged} Flags
        </span>
      )}
    </div>
  );
}

// ─── Main MessageBubble ───────────────────────────────────────────────────────

export default function MessageBubble({
  message,
  shouldStream = true,
  onStreamComplete,
  onContentExpand,
}: MessageBubbleProps) {
  const { openModal, state } = useDAWN();
  const isUser = message.role === "user";
  const content = message.content;
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showThinkingMessage, setShowThinkingMessage] = useState(false);
  const [hasFinishedStreaming, setHasFinishedStreaming] = useState(false);
  const [completedAgentLines, setCompletedAgentLines] = useState<string[]>([]);
  const [currentAgentLineIndex, setCurrentAgentLineIndex] = useState(0);

  const getPlainText = (): string => {
    if (isUser) return content as string;
    const resp = content as AgentResponseContent;
    return resp.text.replace(/\*\*/g, "");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPlainText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const streamText = isUser
    ? (content as string)
    : (content as AgentResponseContent).text;
  const agentLines = isUser
    ? []
    : (content as AgentResponseContent).text.split("\n");

  useEffect(() => {
    setHasFinishedStreaming(!shouldStream);
    setCompletedAgentLines([]);
    setCurrentAgentLineIndex(0);
    setShowThinkingMessage(false);
  }, [message.id, shouldStream]);

  // Mark user messages as completed immediately since they don't stream
  useEffect(() => {
    if (isUser && onStreamComplete) {
      onStreamComplete(message.id);
    }
  }, [isUser, message.id, onStreamComplete]);

  useEffect(() => {
    if (hasFinishedStreaming && shouldStream) {
      onStreamComplete?.(message.id);
    }
  }, [hasFinishedStreaming, shouldStream, onStreamComplete, message.id]);

  // Trigger scroll when rich content appears after streaming completes
  useEffect(() => {
    if (!isUser && (hasFinishedStreaming || !shouldStream)) {
      const resp = content as AgentResponseContent;
      const hasRichContent = !!(
        resp.documentCards ||
        resp.contentAssets ||
        resp.imageVariations ||
        resp.mlrTable ||
        resp.plsScores ||
        resp.metrics ||
        resp.table ||
        resp.chart
      );

      if (hasRichContent && onContentExpand) {
        // Delay to ensure DOM has updated with the content
        const timer = setTimeout(() => {
          onContentExpand();
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [hasFinishedStreaming, shouldStream, isUser, content, onContentExpand]);

  if (isUser) {
    return (
      <div
        className="flex justify-end animate-fade-in-up"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="max-w-lg flex items-start gap-2">
          {/* Copy button — appears on hover */}
          <div
            className={`transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}
          >
            <button
              onClick={handleCopy}
              title="Copy message"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-dawn-navy hover:bg-gray-100 transition-colors"
            >
              {copied ? (
                <Check size={13} className="text-dawn-green" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>

          <div>
            <div className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#8624FF] to-[#6B1FCC] px-4 py-3 text-white shadow-[0_10px_24px_rgba(107,31,204,0.32)]">
              {/* User messages never stream - always show instantly */}
              <p className="text-sm leading-relaxed whitespace-pre-line font-[family-name:var(--font-poppins)]">
                {content as string}
              </p>
            </div>
            <p className="text-[10px] text-gray-400 text-right mt-1 pr-1">
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Agent message
  const resp = content as AgentResponseContent;
  const stepThinkingMessage =
    typeof message.stepIndex === "number"
      ? getCampaign(state.campaignId).storyline[message.stepIndex]?.thinkingMessage
      : undefined;
  const hasThinkingMessage = !!stepThinkingMessage?.trim();

  const isReopenableAction = resp.actionButton?.modal === "effectiveness";
  const isActionConsumed =
    !isReopenableAction &&
    typeof message.stepIndex === "number" &&
    state.currentStepIndex > message.stepIndex;

  const handleAction = () => {
    if(isActionConsumed) return;
    if (!resp.actionButton?.modal) return;
    openModal(resp.actionButton.modal);
  };

  const isBriefModeAction = resp.actionButton?.modal === "briefModeSelector";
  const isTemplateAction = resp.actionButton?.modal === "templateSelector";
  const isContentEditorAction = resp.actionButton?.modal === "contentEditor";

  const lightPreviewClass =
    "border border-[#8624FF]/20 bg-[#8624FF]/10 text-[#8624FF] hover:bg-[#8624FF]/20";
  const solidPreviewClass =
    "bg-gradient-to-r from-[#8624FF] to-[#6B1FCC] text-white shadow-md shadow-dawn-teal/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-dawn-teal/40";

  let previewConfig: { modal: ModalType; label: string; className: string } | null = null;
  if (isActionConsumed) {
    if (isBriefModeAction && state.briefMode) {
      previewConfig = {
        modal: state.briefMode === "manual" ? "manualBriefPreview" : "briefBuilder",
        label: "Preview Brief",
        className: lightPreviewClass,
      };
    } else if (isTemplateAction) {
      previewConfig = { modal: "templateSelector", label: "Preview Template", className: lightPreviewClass };
    } else if (isContentEditorAction) {
      previewConfig = { modal: "contentEditor", label: "Preview Editor", className: solidPreviewClass };
    }
  }

  const hidePrimaryButton = isActionConsumed && isContentEditorAction;

  const handlePreview = () => {
    if (previewConfig) openModal(previewConfig.modal);
  };

  return (
    <>
      {/* Thinking Message - Minimal Design */}
      {hasThinkingMessage && (
        <div className="flex max-w-3xl items-start mb-3 animate-fade-in-up">
          <div className="flex-1 min-w-0">
            {/* Thinking Container - Transparent, No Border, No Shadow */}
            <div className="overflow-hidden">
              {/* Thinking Header - Clickable */}
              <button
                onClick={() => {
                  setShowThinkingMessage((prev) => {
                    const willShow = !prev;
                    if (willShow && onContentExpand) {
                      setTimeout(() => onContentExpand(), 100);
                    }
                    return willShow;
                  });
                }}
                className="w-full flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50/50 transition-colors duration-200 rounded-lg"
              >
                <Lightbulb
                  size={16}
                  className="text-amber-500 transition-transform duration-200"
                  style={{
                    transform: showThinkingMessage
                      ? "rotate(15deg)"
                      : "rotate(0deg)",
                  }}
                />
                <span className="text-[13px] font-medium text-gray-600 tracking-[0.3px]">
                  DAWN&apos;s thinking
                </span>
                <ChevronDown
                  size={14}
                  className="ml-auto text-gray-400 transition-transform duration-200"
                  style={{
                    transform: showThinkingMessage
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Thinking Content - Expandable */}
              <div
                className="transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                  maxHeight: showThinkingMessage ? "2000px" : "0px",
                  opacity: showThinkingMessage ? 1 : 0,
                }}
              >
                <div className="px-3 pb-2 ">
                  <pre className="text-[12px] leading-[1.6] text-gray-600 whitespace-pre-wrap break-words m-0 font-[family-name:var(--font-poppins)] ">
                    {stepThinkingMessage || ""}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="flex max-w-3xl items-start animate-fade-in-up"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex-1 min-w-0">
          {/* Bubble */}
          <div className="px-4 py-3">
            {/* Main text */}
            {hasFinishedStreaming || !shouldStream ? (
              <RichText text={resp.text} />
            ) : (
              <div className="space-y-0.5">
                {completedAgentLines.map((line, index) =>
                  line.trim() === "" ? (
                    <div key={`line-gap-${index}`} className="h-3" />
                  ) : (
                    <RichText key={`line-${index}`} text={line} />
                  ),
                )}

                {currentAgentLineIndex < agentLines.length && (
                  <TypeAnimation
                    key={`${message.id}-${currentAgentLineIndex}`}
                    sequence={[
                      currentAgentLineIndex === 0
                        ? MESSAGE_STREAM_START_DELAY_MS
                        : 50,
                      agentLines[currentAgentLineIndex] ?? "",
                      () => {
                        const completedLine =
                          agentLines[currentAgentLineIndex] ?? "";
                        setCompletedAgentLines((prev) => [
                          ...prev,
                          completedLine,
                        ]);
                        setCurrentAgentLineIndex((prev) => {
                          const next = prev + 1;
                          if (next >= agentLines.length) {
                            setHasFinishedStreaming(true);
                          }
                          return next;
                        });
                      },
                    ]}
                    speed={MESSAGE_STREAM_SPEED}
                    repeat={0}
                    cursor={true}
                    style={{ display: "block", whiteSpace: "pre-line" }}
                    className="text-sm text-gray-700 leading-relaxed font-[family-name:var(--font-poppins)]"
                  />
                )}
              </div>
            )}

            {/* Campaign summary */}
            {(hasFinishedStreaming || !shouldStream) &&
              resp.campaignSummary && (
                <CampaignSummaryCard data={resp.campaignSummary} />
              )}

            {/* Text after campaign summary */}
            {(hasFinishedStreaming || !shouldStream) &&
              resp.textAfterSummary && (
                <div className="mt-3">
                  <RichText text={resp.textAfterSummary} />
                </div>
              )}

            {/* Document cards */}
            {(hasFinishedStreaming || !shouldStream) && resp.documentCards && (
              <DocumentGrid docs={resp.documentCards} />
            )}

            {/* Visual templates (generated template HTML for the campaign) */}
            {(hasFinishedStreaming || !shouldStream) &&
              resp.imageVariations && <ImageVariationsBlock />}

            {/* MLR table */}
            {(hasFinishedStreaming || !shouldStream) && resp.mlrTable && (
              <MLRTableBlock rows={resp.mlrTable} />
            )}

            {/* Status summary */}
            {(hasFinishedStreaming || !shouldStream) && resp.statusSummary && (
              <StatusSummaryBlock summary={resp.statusSummary} />
            )}

            {/* PLS scores */}
            {(hasFinishedStreaming || !shouldStream) && resp.plsScores && (
              <PLSScoresBlock
                scores={resp.plsScores}
                preview={resp.plsPreview}
                onExpand={onContentExpand}
              />
            )}

            {/* Chart */}
            {(hasFinishedStreaming || !shouldStream) && resp.chart && (
              <QAChart chart={resp.chart} />
            )}

            {/* Table */}
            {(hasFinishedStreaming || !shouldStream) && resp.table && (
              <TableBlock table={resp.table} />
            )}

            {/* Recommendation - shown after all content */}
            {(hasFinishedStreaming || !shouldStream) && resp.recommendation && (
              <div className="mt-4 rounded-r-xl border-l-2 border-dawn-amber bg-gradient-to-r from-dawn-amber/10 to-dawn-amber/5 px-4 py-3 shadow-[0_10px_22px_rgba(251,191,36,0.15)]">
                <p className="text-xs font-semibold text-dawn-amber mb-1 uppercase tracking-wide flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  Recommendation
                </p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {resp.recommendation}
                </p>
              </div>
            )}

            {/* Action button */}
            {(hasFinishedStreaming || !shouldStream) && resp.actionButton && (
              <div className="mt-4 flex items-center gap-2">
                {
                  !hidePrimaryButton && (
                    <Button
                  onClick={handleAction}
                  variant="primary"
                  size="md"
                  rounded="xl"
                  disabled={isActionConsumed}
                >
                  {resp.actionButton.label}
                </Button>
                  )
                }
                {previewConfig && (
                  <button
                    type="button"
                    onClick={handlePreview}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-200 cursor-pointer ${previewConfig.className}`}
                  >
                    <Eye size={16} />
                    {previewConfig.label}
                  </button>
                )}
                
              </div>
            )}
          </div>

          {/* Timestamp + action buttons */}
          <div className="flex items-center gap-2 mt-1 pl-1">
            <p className="text-[10px] text-gray-400">
              {formatTime(message.timestamp)}
            </p>

            <div
              className={`flex items-center gap-1 transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}
            >
              <button
                onClick={handleCopy}
                title="Copy response"
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-400 hover:text-dawn-navy hover:bg-gray-100 transition-colors text-[11px]"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-dawn-green" />
                    <span className="text-dawn-green">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  /* regenerate is a demo no-op */
                }}
                title="Regenerate response"
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-400 hover:text-dawn-navy hover:bg-gray-100 transition-colors text-[11px]"
              >
                <RefreshCw size={12} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}