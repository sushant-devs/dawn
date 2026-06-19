'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  AlertTriangle,
  Maximize2,
} from 'lucide-react';
import {
  listEndTemplates,
  countEndTemplates,
  fetchEndTemplateOutputHtml,
  type EndTemplateListEntry,
  type EndTemplateItem,
} from '@/lib/editTemplateApi';
import { runMlrAgent, type MlrAgentRequest } from '@/lib/mlrApi';
import type { MLRPreScreenPayload } from '@/lib/types';
import MLRPreScreenModal from '@/components/modals/MLRPreScreenModal';

const PAGE_SIZE = 4;

interface Props {
  sessionId?: string;
  onClose: () => void;
}

interface FlatTemplate {
  rowId: string;          // unique grid key
  index: number;          // outputs[index] in parent entry
  entry: EndTemplateListEntry;
  output: EndTemplateItem;
}

function flatten(items: EndTemplateListEntry[]): FlatTemplate[] {
  const out: FlatTemplate[] = [];
  for (const e of items) {
    const outputs = Array.isArray(e.outputs) ? e.outputs : [];
    if (outputs.length === 0) continue;
    out.push({ rowId: `${e.end_template_id}-0`, index: 0, entry: e, output: outputs[0] });
  }
  return out;
}

function buildMlrRequest(
  entry: EndTemplateListEntry,
  sessionId: string,
): MlrAgentRequest | null {
  const req: MlrAgentRequest = {
    session_id: sessionId,
    end_template_id: entry.end_template_id ?? '',
    mlr_collection_id: entry.mlr_collection_id ?? '',
    chunks_id: entry.chunk_id ?? '',
    claim_id: entry.claim_id ?? '',
    content_id: entry.content_id ?? '',
  };
  return Object.values(req).every((v) => v && v.length > 0) ? req : null;
}

const LOADING_MESSAGES = [
  'Fetching generated templates…',
  'Compiling preview HTML…',
  'Rendering thumbnails…',
  'Almost there…',
];

export default function MLRAgentSelectionModal({ sessionId, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(0);              // 0-indexed page
  const [items, setItems] = useState<EndTemplateListEntry[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [htmlByRow, setHtmlByRow] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);     // metadata + html together
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [previewRow, setPreviewRow] = useState<{ item: FlatTemplate; html: string } | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<MLRPreScreenPayload | null>(null);
  const hasMoreRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-flight: ask backend for the total so the range chip shows instantly,
  // independent of when the first page lands.
  useEffect(() => {
    let cancelled = false;
    countEndTemplates()
      .then((n) => {
        if (!cancelled) setTotal(n);
      })
      .catch(() => {
        // List response will fill `total` if this fails — no-op.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Cycle the loading copy while the page is fetching.
  useEffect(() => {
    if (!loading) return;
    setLoadingMsgIdx(0);
    const id = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, [loading]);

  // Server-side pagination + sequential html fetch. Only flip `loading` off
  // once metadata AND every html blob for the page is in hand, so the grid
  // renders fully populated — no empty cards.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setHtmlByRow({});
    setItems([]);
    (async () => {
      try {
        const res = await listEndTemplates(PAGE_SIZE, page * PAGE_SIZE);
        if (cancelled) return;
        // Prefer real collection total; fall back to page count when older
        // backends don't ship `total`.
        setTotal(
          typeof res.total === 'number'
            ? res.total
            : typeof res.count === 'number'
            ? res.count
            : null,
        );
        const rows = flatten(res.items);
        // Parallel fetch — independent reads, no inter-row dependency.
        // Wall-clock = slowest single fetch, not sum.
        const settled = await Promise.all(
          rows.map((r) =>
            fetchEndTemplateOutputHtml(r.entry.end_template_id, r.index)
              .then((html) => [r.rowId, html] as const)
              .catch(() => [r.rowId, ''] as const),
          ),
        );
        if (cancelled) return;
        const htmls: Record<string, string> = {};
        for (const [rowId, html] of settled) htmls[rowId] = html;
        setItems(res.items);
        setHtmlByRow(htmls);
      } catch (e) {
        if (!cancelled) setError((e as Error).message ?? 'Failed to load templates.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  // Prefetch the next page of metadata + html as soon as the current page
  // finished rendering. Cache layer dedupes; arrow-click feels instant.
  useEffect(() => {
    if (loading) return;
    if (!hasMoreRef.current) return;
    const nextSkip = (page + 1) * PAGE_SIZE;
    const w = typeof window !== 'undefined' ? window : null;
    const idle =
      w && 'requestIdleCallback' in w
        ? (w as Window & {
            requestIdleCallback: (cb: () => void) => number;
            cancelIdleCallback: (id: number) => void;
          })
        : null;
    let timer: number | null = null;
    let idleId: number | null = null;
    const run = () => {
      listEndTemplates(PAGE_SIZE, nextSkip)
        .then((res) => {
          flatten(res.items).forEach((r) => {
            // Warm the html cache.
            void fetchEndTemplateOutputHtml(r.entry.end_template_id, r.index);
          });
        })
        .catch(() => {});
    };
    if (idle) {
      idleId = idle.requestIdleCallback(run);
    } else {
      timer = window.setTimeout(run, 250);
    }
    return () => {
      if (idleId !== null && idle) idle.cancelIdleCallback(idleId);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [loading, page]);

  const flat = useMemo(() => flatten(items), [items]);
  // hasMore: prefer the real `total` from the server. Fall back to "page was
  // full" heuristic when the API didn't ship a total.
  const hasMore =
    total !== null
      ? (page + 1) * PAGE_SIZE < total
      : items.length >= PAGE_SIZE;
  hasMoreRef.current = hasMore;
  const pageCount =
    total !== null ? Math.max(1, Math.ceil(total / PAGE_SIZE)) : null;
  void pageCount;
  const selected = flat.find((f) => f.rowId === selectedRowId) ?? null;
  const slug = sessionId || 'mlr-session';

  const handleRun = async () => {
    if (!selected) return;
    const req = buildMlrRequest(selected.entry, slug);
    if (!req) {
      setError('Selected template is missing the ids required to run MLR.');
      return;
    }
    // Add the selected content type to the request
    req.selected_content_types = [selected.output.content_type];
    setRunning(true);
    setError(null);
    try {
      const payload = await runMlrAgent(req);
      setResult(payload);
    } catch (e) {
      setError((e as Error).message ?? 'Failed to run MLR agent.');
    } finally {
      setRunning(false);
    }
  };

  if (!mounted) return null;
  if (result) {
    return <MLRPreScreenModal payload={result} onClose={onClose} />;
  }

  const body = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.16)] animate-modal-card"
      >
        <Header onClose={onClose} />
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {loading ? (
            <LoadingState message={LOADING_MESSAGES[loadingMsgIdx]} />
          ) : flat.length === 0 ? (
            <p className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500">
              {page === 0
                ? 'No generated templates available to screen yet.'
                : 'No more templates.'}
            </p>
          ) : (
            <>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    Pick a generated template
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Choose one of the recently generated assets to run through the MLR
                    pre-screen.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {total !== null && total > 0 && (
                    <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-600">
                      {page * PAGE_SIZE + 1}
                      {items.length > 1
                        ? `–${page * PAGE_SIZE + items.length}`
                        : ''}{' '}
                      of {total}
                    </span>
                  )}
                  <Pager
                    canPrev={page > 0}
                    canNext={hasMore}
                    onPrev={() => {
                      setSelectedRowId(null);
                      setPage((p) => Math.max(0, p - 1));
                    }}
                    onNext={() => {
                      setSelectedRowId(null);
                      setPage((p) => p + 1);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {flat.map((f) => (
                  <TemplateCard
                    key={f.rowId}
                    item={f}
                    html={htmlByRow[f.rowId] ?? ''}
                    selected={selectedRowId === f.rowId}
                    onSelect={() => setSelectedRowId(f.rowId)}
                    onPreview={(html) => setPreviewRow({ item: f, html })}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <Footer
          canRun={!!selected && !running && !loading}
          running={running}
          selectedLabel={selected?.output.template_name ?? null}
          onRun={handleRun}
        />
      </div>
      {previewRow && (
        <PreviewModal
          item={previewRow.item}
          html={previewRow.html}
          onClose={() => setPreviewRow(null)}
        />
      )}
    </div>
  );

  return createPortal(body, document.body);
}

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8624FF] to-[#a855f7] shadow-[0_0_24px_rgba(134,36,255,0.25)]">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            MLR Agent
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-zinc-900">
            Compliance Pre-Screen
          </h2>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function Pager({
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous"
        className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-[#b47cff] hover:text-[#8624FF] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next"
        className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-[#b47cff] hover:text-[#8624FF] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-center gap-2 text-[#8624FF]">
        <span className="stream-dot h-2 w-2 rounded-full bg-[#8624FF]" />
        <span className="stream-dot h-2 w-2 rounded-full bg-[#8624FF]" />
        <span className="stream-dot h-2 w-2 rounded-full bg-[#8624FF]" />
      </div>
      <p
        key={message}
        className="text-sm font-medium text-zinc-700 animate-fade-in-up"
      >
        {message}
      </p>
      <p className="text-[11px] text-zinc-400">This may take a moment.</p>
    </div>
  );
}

function TemplateCard({
  item,
  html,
  selected,
  onSelect,
  onPreview,
}: {
  item: FlatTemplate;
  html: string;
  selected: boolean;
  onSelect: () => void;
  onPreview: (html: string) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const ifr = iframeRef.current;
    if (!ifr) return;
    const doc = ifr.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html || '<!doctype html><body></body>');
    doc.close();
  }, [html]);

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
        selected
          ? 'border-[#8624FF] shadow-[0_0_0_2px_rgba(134,36,255,0.25)]'
          : 'border-zinc-200 hover:border-[#b47cff]/60 hover:shadow-md'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="relative h-48 w-full cursor-pointer overflow-hidden bg-zinc-50"
      >
        <iframe
          ref={iframeRef}
          title={item.output.template_name}
          sandbox="allow-same-origin"
          className="pointer-events-none h-full w-full origin-top-left scale-[0.55] border-0 bg-white"
          style={{ width: '182%', height: '182%' }}
        />
        {selected && (
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#8624FF] text-white shadow-lg">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-1 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {item.output.content_type}
          </span>
          <button
            type="button"
            onClick={() => onPreview(html)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-[#8624FF] transition-colors hover:bg-[#f7f1ff] cursor-pointer"
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>
        <p className="line-clamp-1 text-sm font-semibold text-zinc-900">
          {item.output.template_name}
        </p>
      </div>
    </div>
  );
}

function PreviewModal({
  item,
  html,
  onClose,
}: {
  item: FlatTemplate;
  html: string;
  onClose: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <Maximize2 className="h-4 w-4 text-[#8624FF]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {item.output.content_type}
              </p>
              <h3 className="text-base font-semibold text-zinc-900">
                {item.output.template_name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden bg-zinc-100 p-4">
          <iframe
            title={item.output.template_name}
            srcDoc={html || ''}
            sandbox="allow-same-origin allow-scripts"
            className="h-full w-full resize overflow-auto rounded-lg border border-zinc-300 bg-white shadow-inner"
            style={{ minHeight: '60vh' }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Footer({
  canRun,
  running,
  selectedLabel,
  onRun,
}: {
  canRun: boolean;
  running: boolean;
  selectedLabel: string | null;
  onRun: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-zinc-200 bg-white px-8 py-4">
      <span className="text-xs text-zinc-500">
        {selectedLabel
          ? `Selected: ${selectedLabel}`
          : 'Select a template to enable MLR pre-screen.'}
      </span>
      <button
        type="button"
        onClick={onRun}
        disabled={!canRun}
        className="inline-flex items-center gap-2 rounded-lg bg-[#8624FF] px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(134,36,255,0.25)] transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:opacity-60 disabled:shadow-none cursor-pointer"
      >
        {running ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Run MLR Agent
          </>
        )}
      </button>
    </div>
  );
}
