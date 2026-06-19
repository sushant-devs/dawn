'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, Loader2, ChevronLeft, FileText, Check, Sparkles } from 'lucide-react';
import {
  listEndTemplates,
  type EndTemplateItem,
  type EndTemplateListEntry,
} from '@/lib/editTemplateApi';
import { type MlrAgentRequest } from '@/lib/mlrApi';
import MLRAgentRunModal from '@/components/modals/MLRAgentRunModal';

const BRAND_NAVY = '#001d4a';
const BRAND_BLUE = '#003da5';
const BRAND_LIGHT = '#4a9ee0';

const PAGE_SIZE = 5;

interface Props {
  onClose: () => void;
}

interface TemplateCard extends EndTemplateItem {
  end_template_id: string;
  key: string;
  mlr_collection_id?: string | null;
  chunk_id?: string | null;
  claim_id?: string | null;
  content_id?: string | null;
}

function useInView(
  rootRef: React.RefObject<HTMLElement | null>,
): [(node: HTMLElement | null) => void, boolean] {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setNode = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      if (!node || inView) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setInView(true);
            obs.disconnect();
          }
        },
        { root: rootRef.current ?? null, rootMargin: '200px' },
      );
      obs.observe(node);
      observerRef.current = obs;
    },
    [inView, rootRef],
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);
  return [setNode, inView];
}

function flattenEntries(items: EndTemplateListEntry[]): TemplateCard[] {
  const flat: TemplateCard[] = [];
  items.forEach((item) => {
    (item.outputs ?? []).forEach((out, i) => {
      flat.push({
        ...out,
        end_template_id: item.end_template_id,
        key: `${item.end_template_id}-${i}`,
        mlr_collection_id: item.mlr_collection_id,
        chunk_id: item.chunk_id,
        claim_id: item.claim_id,
        content_id: item.content_id,
      });
    });
  });
  return flat;
}

function buildMlrRequest(card: TemplateCard): MlrAgentRequest | null {
  const req: MlrAgentRequest = {
    session_id: `deep-research-${card.end_template_id}-${Date.now()}`,
    end_template_id: card.end_template_id ?? '',
    mlr_collection_id: card.mlr_collection_id ?? '',
    chunks_id: card.chunk_id ?? '',
    claim_id: card.claim_id ?? '',
    content_id: card.content_id ?? '',
  };
  const complete = Object.values(req).every((v) => v && v.length > 0);
  return complete ? req : null;
}

export default function DeepResearchTemplatesModal({ onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [cards, setCards] = useState<TemplateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<TemplateCard | null>(null);
  const [loadedEntries, setLoadedEntries] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [mlrOpen, setMlrOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setLoading(true);
    setError(null);

    (async () => {
      let skip = 0;
      let firstPage = true;
      for (;;) {
        try {
          const res = await listEndTemplates(PAGE_SIZE, skip);
          const pageLen = res.items.length;
          setCards((prev) => [...prev, ...flattenEntries(res.items)]);
          setLoadedEntries((n) => n + pageLen);
          if (firstPage) {
            setLoading(false);
            firstPage = false;
          } else {
            setLoadingMore(true);
          }
          skip += pageLen;
          if (pageLen < PAGE_SIZE) break;
        } catch (e) {
          setError((e as Error).message ?? 'Failed to load templates.');
          setLoading(false);
          break;
        }
      }
      setLoadingMore(false);
    })();
  }, []);

  const selectedCard = cards.find((c) => c.key === selectedKey) ?? null;
  const mlrRequest = selectedCard ? buildMlrRequest(selectedCard) : null;

  if (!mounted) return null;

  const body = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl shadow-2xl animate-fade-in-up"
        style={{ background: 'linear-gradient(180deg,#fff,#f5f8ff)' }}
      >
        <div
          className="flex items-center justify-between px-8 py-5"
          style={{ background: `linear-gradient(135deg,${BRAND_NAVY},${BRAND_BLUE})` }}
        >
          <div className="flex items-center gap-3">
            {active && (
              <button
                type="button"
                onClick={() => setActive(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                aria-label="Back to templates"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                Deep Research Agent
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                {active ? active.template_name : 'Generated Templates'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_BLUE }} />
              <p className="text-sm">Loading generated templates…</p>
            </div>
          ) : active ? (
            <TemplateDetail tpl={active} />
          ) : cards.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-zinc-400">
              <FileText className="h-8 w-8" />
              <p className="text-sm">No generated templates found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((c) => (
                  <TemplateThumb
                    key={c.key}
                    tpl={c}
                    rootRef={scrollRef}
                    selected={c.key === selectedKey}
                    onSelect={() =>
                      setSelectedKey((k) => (k === c.key ? null : c.key))
                    }
                    onPreview={() => setActive(c)}
                  />
                ))}
                {loadingMore &&
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <ThumbSkeleton key={`skeleton-${i}`} />
                  ))}
              </div>
              {loadingMore && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" style={{ color: BRAND_BLUE }} />
                  Loading more templates… ({loadedEntries} loaded)
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-8 py-4">
          <span className="text-xs text-zinc-500">
            {loading
              ? 'Loading…'
              : active
              ? active.content_type || 'Template'
              : selectedCard
              ? `Selected: ${selectedCard.template_name}`
              : loadingMore
              ? `${cards.length} loaded…`
              : `${cards.length} template${cards.length === 1 ? '' : 's'}`}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={active ? () => setActive(null) : onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 cursor-pointer"
            >
              {active ? 'Back' : 'Close'}
            </button>
            {!active && (
              <button
                type="button"
                onClick={() => setMlrOpen(true)}
                disabled={!mlrRequest}
                title={
                  !selectedCard
                    ? 'Select a template to run the MLR agent.'
                    : !mlrRequest
                    ? 'MLR inputs are not available for this template.'
                    : 'Run MLR pre-screen'
                }
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:shadow-lg cursor-pointer"
                style={{
                  background: mlrRequest
                    ? 'linear-gradient(135deg,#8624FF,#a855f7)'
                    : '#94a3b8',
                }}
              >
                <Sparkles className="h-4 w-4" />
                Run MLR Agent
              </button>
            )}
          </div>
        </div>
      </div>
      {mlrOpen && mlrRequest && (
        <MLRAgentRunModal request={mlrRequest} onClose={() => setMlrOpen(false)} />
      )}
    </div>
  );

  return createPortal(body, document.body);
}

function ThumbSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="flex h-48 w-full items-center justify-center bg-zinc-50">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-zinc-100" />
        <div className="h-3.5 w-12 animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  );
}

function TemplateThumb({
  tpl,
  rootRef,
  selected,
  onSelect,
  onPreview,
}: {
  tpl: TemplateCard;
  rootRef: React.RefObject<HTMLElement | null>;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}) {
  const [setNode, inView] = useInView(rootRef);
  return (
    <div
      ref={setNode}
      onClick={onSelect}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        selected ? '' : 'border-zinc-200 hover:border-[#4a9ee0]/60'
      }`}
      style={
        selected
          ? { borderColor: BRAND_BLUE, boxShadow: `0 0 0 2px ${BRAND_BLUE}33` }
          : undefined
      }
    >
      <div className="relative h-48 w-full overflow-hidden bg-zinc-50">
        {tpl.processed_html ? (
          <>
            {inView ? (
              <iframe
                title={tpl.template_name}
                sandbox="allow-same-origin"
                srcDoc={tpl.processed_html}
                scrolling="no"
                tabIndex={-1}
                className="pointer-events-none origin-top-left border-0 bg-white"
                style={{
                  width: '250%',
                  height: '250%',
                  transform: 'scale(0.4)',
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              aria-label="Preview template"
              className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 hover:bg-black/30 cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/0 text-white opacity-0 shadow-lg transition-all duration-200 group-hover:bg-white/90 group-hover:opacity-100">
                <Eye className="h-5 w-5" style={{ color: BRAND_BLUE }} />
              </span>
            </button>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
            No preview
          </div>
        )}
        {tpl.content_type && (
          <span
            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow"
            style={{ background: BRAND_NAVY }}
          >
            {tpl.content_type}
          </span>
        )}
        {selected && (
          <div
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg"
            style={{ background: BRAND_BLUE }}
          >
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <p className="line-clamp-1 text-sm font-semibold text-zinc-900">
          {tpl.template_name}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          aria-label="Preview template"
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors hover:bg-[#eef4ff] cursor-pointer"
          style={{ color: BRAND_BLUE }}
        >
          <Eye className="h-3.5 w-3.5" /> Preview
        </button>
      </div>
    </div>
  );
}

function TemplateDetail({ tpl }: { tpl: TemplateCard }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
        {tpl.content_type && (
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ background: BRAND_NAVY }}
          >
            {tpl.content_type}
          </span>
        )}
        <span className="text-sm font-semibold text-zinc-900">
          {tpl.template_name}
        </span>
        <span className="ml-auto font-mono text-[11px] text-zinc-400">
          {tpl.end_template_id}
        </span>
      </div>
      <div
        className="overflow-hidden rounded-xl border bg-white p-4 shadow-sm"
        style={{ borderColor: BRAND_LIGHT }}
      >
        {tpl.processed_html ? (
          <iframe
            title={`${tpl.template_name}-full`}
            sandbox="allow-same-origin"
            srcDoc={tpl.processed_html}
            className="h-[68vh] w-full rounded-lg border border-zinc-200 bg-white"
          />
        ) : (
          <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-400">
            No preview available for this template.
          </p>
        )}
      </div>
    </div>
  );
}
