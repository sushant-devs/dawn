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
    <div className="mt-3 bg-dawn-sky rounded-xl border border-dawn-teal/20 overflow-hidden">
      <div className="px-4 py-3 bg-dawn-teal/10 border-b border-dawn-teal/20 flex items-center justify-between">
        <span className="text-xs font-semibold text-dawn-teal uppercase tracking-wide">Campaign Configuration</span>
        <span className="bg-dawn-amber/20 text-dawn-amber border border-dawn-amber/30 rounded-full px-2.5 py-0.5 text-xs font-medium">
          {data.campaignId}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-dawn-teal/10">
        {[
          { label: 'Brand', value: data.brand },
          { label: 'Therapeutic Area', value: data.ta },
          { label: 'Budget', value: data.budget },
          { label: 'Markets', value: data.markets.join(', ') },
          { label: 'Audience', value: data.audience.join(', ') },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-sm font-medium text-dawn-navy">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Document grid
function DocumentGrid({ docs }: { docs: DocType[] }) {
  const handlePreview = (filePath: string, title: string) => {
    // Open PDF in new window
    window.open(filePath, '_blank');
  };

  return (
    <div className="mt-3">
      {/* Document Grid */}
      <div className="grid grid-cols-2 gap-2">
        {docs.map((doc) => (
          <DocumentCard
            key={doc.id}
            {...doc}
            onPreview={handlePreview}
          />
        ))}
      </div>
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
          <div key={asset.id} className="bg-white border border-dawn-border rounded-lg px-4 py-3">
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
            selected === v.id ? 'border-dawn-teal shadow-lg' : 'border-dawn-border hover:border-dawn-teal/50'
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
          <div className="bg-white px-3 py-2.5">
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
    <div className="mt-3 overflow-hidden rounded-xl border border-dawn-border">
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
function PLSScoresBlock({ scores, preview }: { scores: NonNullable<AgentResponseContent['plsScores']>; preview?: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 space-y-3">
      <div className="bg-white border border-dawn-border rounded-xl p-4 space-y-2.5">
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
        <div className="bg-dawn-sky rounded-xl border border-dawn-teal/20 p-4">
          <p className="text-xs font-semibold text-dawn-teal mb-2 uppercase tracking-wide">PLS Preview</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {expanded ? preview : preview.slice(0, 200) + '…'}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
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
        <div key={m.label} className="bg-white border border-dawn-border rounded-xl p-3">
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

export default function MessageBubble({ message, shouldStream = true, onStreamComplete }: MessageBubbleProps) {
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

  useEffect(() => {
    if (hasFinishedStreaming && shouldStream) {
      onStreamComplete?.(message.id);
    }
  }, [hasFinishedStreaming, shouldStream, onStreamComplete, message.id]);

  if (isUser) {
    return (
      <div
        className="flex justify-end animate-fade-in-up"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="max-w-lg flex items-end gap-2">
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
            <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-dawn-teal to-cyan-600 px-4 py-3 text-white shadow-[0_12px_28px_rgba(0,168,150,0.32)]">
              {hasFinishedStreaming || !shouldStream ? (
                <p className="text-sm leading-relaxed whitespace-pre-line">{content as string}</p>
              ) : (
                <TypeAnimation
                  sequence={[
                    MESSAGE_STREAM_START_DELAY_MS,
                    streamText,
                    () => setHasFinishedStreaming(true),
                  ]}
                  speed={MESSAGE_STREAM_SPEED}
                  repeat={0}
                  cursor={true}
                  style={{ display: 'block', whiteSpace: 'pre-line' }}
                  className="text-sm leading-relaxed"
                />
              )}
            </div>
            <p className="text-[10px] text-gray-400 text-right mt-1 pr-1">{formatTime(message.timestamp)}</p>
          </div>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-dawn-teal flex items-center justify-center shrink-0 mt-0.5">
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
      <div className="w-8 h-8 rounded-full bg-dawn-navy flex items-center justify-center shrink-0 self-end mb-1">
        <span className="text-white font-serif text-xs font-bold">D</span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="rounded-2xl rounded-tl-sm border border-dawn-border bg-white px-4 py-3 shadow-sm border-l-[3px] border-l-dawn-teal">
          {/* Thinking message toggle + panel */}
          {hasThinkingMessage && (
            <div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowThinkingMessage((prev) => !prev)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-500 hover:text-dawn-navy hover:bg-gray-100 transition-colors text-[11px]"
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
          {(hasFinishedStreaming || !shouldStream) && resp.plsScores && <PLSScoresBlock scores={resp.plsScores} preview={resp.plsPreview} />}

          {/* Metrics */}
          {(hasFinishedStreaming || !shouldStream) && resp.metrics && <MetricsBlock metrics={resp.metrics} />}

          {/* Recommendation - shown after all content */}
          {(hasFinishedStreaming || !shouldStream) && resp.recommendation && (
            <div className="mt-4 bg-dawn-amber/5 border-l-2 border-dawn-amber rounded-r-lg px-4 py-3">
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
              className="mt-4 inline-flex items-center gap-2 bg-dawn-teal text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-dawn-teal/90 transition-all duration-200 shadow-sm hover:shadow-md"
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
