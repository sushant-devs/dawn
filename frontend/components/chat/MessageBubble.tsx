'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, CheckCircle, Copy, RefreshCw, Check } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import type { ChatMessage, AgentResponseContent, DocumentCard as DocType } from '@/lib/types';
import DocumentCard from '@/components/shared/DocumentCard';
import StatusPill from '@/components/shared/StatusPill';
import { useDAWN } from '@/context/DAWNContext';
import { STORYLINE } from '@/lib/storyline';

interface MessageBubbleProps {
  message: ChatMessage;
  shouldStream?: boolean;
  onStreamComplete?: (messageId: string) => void;
  onContentExpand?: () => void;
}

const MESSAGE_STREAM_SPEED = 70;
const MESSAGE_STREAM_START_DELAY_MS = 250;

function formatTime(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Simple markdown-like renderer (bold via **)
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
      {parts.map((part, i) =>
        part.startsWith('**') ? (
          <strong key={i} className="font-semibold text-dawn-navy">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

// Campaign summary card
function CampaignSummaryCard({ data }: { data: NonNullable<AgentResponseContent['campaignSummary']> }) {
  return (
    <div className="mt-3 rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden max-w-md">
      {/* Header */}
      <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Campaign Configuration</h4>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Brand - Featured */}
        <div className="pb-2 border-b border-slate-100">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Brand</span>
          <h3 className="text-base font-semibold text-slate-900 mt-0.5">{data.brand}</h3>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Therapeutic Area</span>
            <p className="text-sm font-medium text-slate-800 mt-0.5">{data.ta}</p>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Budget</span>
            <p className="text-sm font-semibold text-emerald-600 mt-0.5">{data.budget}</p>
          </div>
        </div>

        {/* Markets */}
        <div>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1 block">Markets</span>
          <div className="flex flex-wrap gap-1">
            {data.markets.map((market) => (
              <span key={market} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                {market}
              </span>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1 block">Target Audience</span>
          <div className="flex flex-wrap gap-1">
            {data.audience.map((aud) => (
              <span key={aud} className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200">
                {aud}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Document list with expandable view
function DocumentGrid({ docs }: { docs: DocType[] }) {
  const [showAll, setShowAll] = useState(false);
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

  const handlePreview = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  // Show first 5 documents initially
  const displayedDocs = showAll ? docs : docs.slice(0, 5);
  const hiddenCount = docs.length - 5;

  const getTypeIcon = (type: string) => {
    if (type === 'Clinical Study Report' || type === 'CSR') {
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 95) return 'text-emerald-600 bg-emerald-50';
    if (relevance >= 90) return 'text-green-600 bg-green-50';
    if (relevance >= 85) return 'text-amber-600 bg-amber-50';
    return 'text-orange-600 bg-orange-50';
  };

  return (
    <div className="mt-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          <span className="text-xs font-semibold text-slate-700">{docs.length} Documents Retrieved</span>
        </div>
        <span className="text-[10px] text-slate-500">HAVEN Clinical Program</span>
      </div>

      {/* Document List */}
      <div className="space-y-1.5">
        {displayedDocs.map((doc) => (
          <div
            key={doc.id}
            onMouseEnter={() => setHoveredDoc(doc.id)}
            onMouseLeave={() => setHoveredDoc(null)}
            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg border bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={() => handlePreview(doc.filePath)}
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
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  {doc.pageCount} pages
                </span>
                <span className="text-slate-300">•</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${getRelevanceColor(doc.relevance)}`}>
                  {doc.relevance}% match
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-medium text-slate-500">{doc.type}</span>
              </div>
            </div>

            {/* Preview Icon on Hover */}
            {hoveredDoc === doc.id && (
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-dawn-teal/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-dawn-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
            Show {hiddenCount} More Document{hiddenCount !== 1 ? 's' : ''}
          </span>
          <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-dawn-teal transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
          <svg className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Content generation assets
function ContentAssetsBlock({ assets }: { assets: NonNullable<AgentResponseContent['contentAssets']> }) {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    assets.forEach((asset, i) => {
      setTimeout(() => {
        const interval = setInterval(() => {
          setProgress((prev) => {
            const current = prev[asset.id] ?? 0;
            if (current >= 100) { clearInterval(interval); return prev; }
            return { ...prev, [asset.id]: Math.min(current + 8, 100) };
          });
        }, 60);
      }, i * 300);
    });
  }, [assets]);

  return (
    <div className="mt-3 space-y-2">
      {assets.map((asset) => {
        const prog = progress[asset.id] ?? 0;
        return (
          <div key={asset.id} className="rounded-xl border border-dawn-border/90 bg-gradient-to-b from-white to-[#fbfcff] px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.11)]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-dawn-navy">{asset.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-400">{asset.persona}</span>
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400">{asset.language}</span>
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400">{asset.wordCount} words</span>
                </div>
              </div>
              {prog >= 100 ? (
                <CheckCircle size={16} className="text-dawn-green shrink-0" />
              ) : (
                <span className="text-xs text-dawn-teal font-medium">{prog}%</span>
              )}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div
                className="h-1 rounded-full bg-dawn-teal transition-all duration-150"
                style={{ width: `${prog}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Image variations
function ImageVariationsBlock({ variations }: { variations: NonNullable<AgentResponseContent['imageVariations']> }) {
  const [selected, setSelected] = useState(variations[0]?.id);
  return (
    <div className="mt-3 grid grid-cols-3 gap-3">
      {variations.map((v) => (
        <div
          key={v.id}
          onClick={() => setSelected(v.id)}
          className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
            selected === v.id ? 'border-dawn-teal shadow-[0_14px_30px_rgba(95,77,230,0.22)]' : 'border-dawn-border shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-dawn-teal/50 hover:shadow-[0_12px_26px_rgba(15,23,42,0.1)]'
          }`}
        >
          {/* Template Image */}
          <div className="relative h-40 bg-gray-100">
            <img
              src={v.image}
              alt={v.title}
              className="w-full h-full object-cover"
            />
            {selected === v.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-dawn-teal rounded-full flex items-center justify-center shadow-md">
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-b from-white to-[#fcfdff] px-3 py-2.5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-dawn-navy">{v.title}</p>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-dawn-sky text-dawn-navy font-medium">
                {v.type}
              </span>
            </div>
            <p className="text-[10px] text-gray-600 leading-relaxed">{v.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// MLR table
function MLRTableBlock({ rows }: { rows: NonNullable<AgentResponseContent['mlrTable']> }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-dawn-border bg-white shadow-[0_12px_26px_rgba(15,23,42,0.08)]">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-dawn-border">
            {['Asset', 'Tier', 'AI Pre-Screen', 'Status'].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-dawn-border last:border-0 hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2.5 font-medium text-dawn-navy">{row.asset}</td>
              <td className="px-3 py-2.5">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${row.tier === 'Tier 1' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {row.tier}
                </span>
              </td>
              <td className="px-3 py-2.5 text-gray-500">{row.aiPreScreen}</td>
              <td className="px-3 py-2.5"><StatusPill status={row.status} size="sm" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// PLS quality scores
function PLSScoresBlock({ scores, preview, onExpand }: { scores: NonNullable<AgentResponseContent['plsScores']>; preview?: string; onExpand?: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 space-y-3">
      <div className="space-y-2.5 rounded-xl border border-dawn-border bg-gradient-to-b from-white to-[#fbfcff] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
        {scores.map((s) => (
          <div key={s.dimension}>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-dawn-navy">{s.dimension}</span>
              <span className={`text-xs font-semibold ${s.score >= 90 ? 'text-dawn-green' : s.score >= 80 ? 'text-dawn-teal' : 'text-dawn-amber'}`}>
                {s.score}/100
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-700 ${s.score >= 90 ? 'bg-dawn-green' : s.score >= 80 ? 'bg-dawn-teal' : 'bg-dawn-amber'}`}
                style={{ width: `${s.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {preview && (
        <div className="rounded-xl border border-dawn-teal/20 bg-gradient-to-br from-[#f8f9ff] to-[#eef2ff] p-4 shadow-[0_10px_24px_rgba(111,92,255,0.12)]">
          <p className="text-xs font-semibold text-dawn-teal mb-2 uppercase tracking-wide">PLS Preview</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {expanded ? preview : preview.slice(0, 200) + '…'}
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
            {expanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Show more</>}
          </button>
        </div>
      )}
    </div>
  );
}

// KPI metrics
function MetricsBlock({ metrics }: { metrics: NonNullable<AgentResponseContent['metrics']> }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-xl border border-dawn-border/90 bg-gradient-to-b from-white to-[#fbfcff] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{m.label}</p>
          <p className="text-2xl font-bold text-dawn-navy font-serif leading-none">{m.value}</p>
          {m.trend && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-xs font-medium ${m.trendUp ? 'text-dawn-green' : 'text-dawn-red'}`}>
                {m.trend}
              </span>
            </div>
          )}
          {m.benchmark && <p className="text-[10px] text-gray-400 mt-0.5">{m.benchmark}</p>}
        </div>
      ))}
    </div>
  );
}

// Status summary row
function StatusSummaryBlock({ summary }: { summary: NonNullable<AgentResponseContent['statusSummary']> }) {
  return (
    <div className="mt-3 flex gap-2 flex-wrap">
      <span className="bg-dawn-navy/10 text-dawn-navy rounded-full px-3 py-1 text-xs font-medium">{summary.total} Assets</span>
      <span className="bg-dawn-green/10 text-dawn-green rounded-full px-3 py-1 text-xs font-medium">{summary.passed} Passed</span>
      {summary.pending > 0 && <span className="bg-dawn-amber/10 text-dawn-amber rounded-full px-3 py-1 text-xs font-medium">{summary.pending} Pending</span>}
      {summary.flagged > 0 && <span className="bg-dawn-red/10 text-dawn-red rounded-full px-3 py-1 text-xs font-medium">{summary.flagged} Flags</span>}
    </div>
  );
}

// ─── Main MessageBubble ───────────────────────────────────────────────────────

export default function MessageBubble({ message, shouldStream = true, onStreamComplete, onContentExpand }: MessageBubbleProps) {
  const { openModal } = useDAWN();
  const isUser = message.role === 'user';
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
    return resp.text.replace(/\*\*/g, '');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPlainText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const streamText = isUser ? (content as string) : (content as AgentResponseContent).text;
  const agentLines = isUser ? [] : ((content as AgentResponseContent).text.split('\n'));

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
        resp.metrics
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
          <div className={`transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={handleCopy}
              title="Copy message"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-dawn-navy hover:bg-gray-100 transition-colors"
            >
              {copied ? <Check size={13} className="text-dawn-green" /> : <Copy size={13} />}
            </button>
          </div>

          <div>
            <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-dawn-teal to-[#1A3FCC] px-4 py-3 text-white shadow-[0_10px_24px_rgba(26,63,204,0.32)]">
              {/* User messages never stream - always show instantly */}
              <p className="text-sm leading-relaxed whitespace-pre-line">{content as string}</p>
            </div>
            <p className="text-[10px] text-gray-400 text-right mt-1 pr-1">{formatTime(message.timestamp)}</p>
          </div>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-dawn-teal flex items-center justify-center shrink-0 shadow-[0_8px_18px_rgba(95,77,230,0.34)]">
            <span className="text-white font-serif text-xs font-bold">U</span>
          </div>
        </div>
      </div>
    );
  }

  // Agent message
  const resp = content as AgentResponseContent;
  const stepThinkingMessage =
    typeof message.stepIndex === 'number' ? STORYLINE[message.stepIndex]?.thinkingMessage : undefined;
  const hasThinkingMessage = !!stepThinkingMessage?.trim();

  const handleAction = () => {
    if (!resp.actionButton?.modal) return;
    openModal(resp.actionButton.modal);
  };

  return (
    <div
      className="flex max-w-3xl items-start gap-3 animate-fade-in-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-dawn-navy flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white font-serif text-xs font-bold">D</span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="rounded-2xl rounded-tl-sm border border-dawn-border/90 border-l-[3px] border-l-dawn-teal bg-gradient-to-b from-white to-[#fcfdff] px-4 py-3 shadow-[0_14px_32px_rgba(15,23,42,0.09)] ring-1 ring-white/80">
          {/* Thinking message toggle + panel */}
          {hasThinkingMessage && (
            <div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowThinkingMessage((prev) => {
                      const willShow = !prev;
                      if (willShow && onContentExpand) {
                        // Delay to allow DOM update
                        setTimeout(() => onContentExpand(), 100);
                      }
                      return willShow;
                    });
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-500 hover:text-dawn-navy hover:bg-gray-100 transition-colors text-[11px] cursor-pointer"
                >
                  {showThinkingMessage ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  <span>Tool Response</span>
                </button>
              </div>

              {showThinkingMessage && (
                <div className="mt-2 rounded-xl border border-dawn-border bg-slate-50 px-3 py-2">
                  <p className="whitespace-pre-line text-xs leading-relaxed text-gray-600">{stepThinkingMessage}</p>
                </div>
              )}
            </div>
          )}

          {/* Main text */}
          {hasFinishedStreaming || !shouldStream ? (
            <RichText text={resp.text} />
          ) : (
            <div className="space-y-0.5">
              {completedAgentLines.map((line, index) => (
                line.trim() === '' ? (
                  <div key={`line-gap-${index}`} className="h-3" />
                ) : (
                  <RichText key={`line-${index}`} text={line} />
                )
              ))}

              {currentAgentLineIndex < agentLines.length && (
                <TypeAnimation
                  key={`${message.id}-${currentAgentLineIndex}`}
                  sequence={[
                    currentAgentLineIndex === 0 ? MESSAGE_STREAM_START_DELAY_MS : 120,
                    agentLines[currentAgentLineIndex] ?? '',
                    () => {
                      const completedLine = agentLines[currentAgentLineIndex] ?? '';
                      setCompletedAgentLines((prev) => [...prev, completedLine]);
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
                  style={{ display: 'block', whiteSpace: 'pre-line' }}
                  className="text-sm text-gray-700 leading-relaxed"
                />
              )}
            </div>
          )}

          {/* Campaign summary */}
          {(hasFinishedStreaming || !shouldStream) && resp.campaignSummary && <CampaignSummaryCard data={resp.campaignSummary} />}

          {/* Document cards */}
          {(hasFinishedStreaming || !shouldStream) && resp.documentCards && (
            <DocumentGrid
              docs={resp.documentCards}
            />
          )}

          {/* Content generation */}
          {(hasFinishedStreaming || !shouldStream) && resp.contentAssets && <ContentAssetsBlock assets={resp.contentAssets} />}

          {/* Image variations */}
          {(hasFinishedStreaming || !shouldStream) && resp.imageVariations && <ImageVariationsBlock variations={resp.imageVariations} />}

          {/* MLR table */}
          {(hasFinishedStreaming || !shouldStream) && resp.mlrTable && <MLRTableBlock rows={resp.mlrTable} />}

          {/* Status summary */}
          {(hasFinishedStreaming || !shouldStream) && resp.statusSummary && <StatusSummaryBlock summary={resp.statusSummary} />}

          {/* PLS scores */}
          {(hasFinishedStreaming || !shouldStream) && resp.plsScores && <PLSScoresBlock scores={resp.plsScores} preview={resp.plsPreview} onExpand={onContentExpand} />}

          {/* Metrics */}
          {(hasFinishedStreaming || !shouldStream) && resp.metrics && <MetricsBlock metrics={resp.metrics} />}

          {/* Recommendation - shown after all content */}
          {(hasFinishedStreaming || !shouldStream) && resp.recommendation && (
            <div className="mt-4 rounded-r-xl border-l-2 border-dawn-amber bg-gradient-to-r from-dawn-amber/10 to-dawn-amber/5 px-4 py-3 shadow-[0_10px_22px_rgba(251,191,36,0.15)]">
              <p className="text-xs font-semibold text-dawn-amber mb-1 uppercase tracking-wide flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Recommendation
              </p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{resp.recommendation}</p>
            </div>
          )}

          {/* Action button */}
          {(hasFinishedStreaming || !shouldStream) && resp.actionButton && (
            <button
              onClick={handleAction}
              className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-dawn-teal to-[#1A3FCC] px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(26,63,204,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#3B67FF] hover:to-[#1738B8] hover:shadow-[0_16px_30px_rgba(26,63,204,0.35)]"
            >
              {resp.actionButton.label}
            </button>
          )}
        </div>

        {/* Timestamp + action buttons */}
        <div className="flex items-center gap-2 mt-1 pl-1">
          <p className="text-[10px] text-gray-400">{formatTime(message.timestamp)}</p>

          <div className={`flex items-center gap-1 transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={handleCopy}
              title="Copy response"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-400 hover:text-dawn-navy hover:bg-gray-100 transition-colors text-[11px]"
            >
              {copied ? (
                <><Check size={12} className="text-dawn-green" /><span className="text-dawn-green">Copied</span></>
              ) : (
                <><Copy size={12} /><span>Copy</span></>
              )}
            </button>

            <button
              onClick={() => {/* regenerate is a demo no-op */}}
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
  );
}
