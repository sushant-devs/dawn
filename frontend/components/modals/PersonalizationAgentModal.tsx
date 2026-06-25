'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Wand2,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  Eye,
  Download,
  Maximize2,
  Check,
} from 'lucide-react';
import {
  getApprovedTemplates,
  getTemplatePreview,
  personalizeTemplateAgent,
  type ApprovedTemplateItem,
  type PersonalizedVersion,
} from '@/lib/personalizationApi';

interface Props {
  onClose: () => void;
}

type Stage = 'list' | 'configure' | 'results';

const LOADING_MSGS = [
  'Loading approved templates…',
  'Compiling preview HTML…',
  'Almost there…',
];

export default function PersonalizationAgentModal({ onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<Stage>('list');
  const [error, setError] = useState<string | null>(null);

  // List state
  const [templates, setTemplates] = useState<ApprovedTemplateItem[]>([]);
  const [htmlByTemplateId, setHtmlByTemplateId] = useState<Record<string, string>>({});
  const [listLoading, setListLoading] = useState(true);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Configure state
  const [picked, setPicked] = useState<ApprovedTemplateItem | null>(null);
  const [personalizationText, setPersonalizationText] = useState('');
  const [maxVariation, setMaxVariation] = useState<1 | 2>(1);
  const [generating, setGenerating] = useState(false);

  // Approved-template preview (eye icon) state
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  // Results state
  const [variations, setVariations] = useState<PersonalizedVersion[]>([]);
  const [fullScreenIdx, setFullScreenIdx] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!listLoading) return;
    setLoadingMsgIdx(0);
    const id = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MSGS.length);
    }, 1800);
    return () => clearInterval(id);
  }, [listLoading]);

  // Single fetch — no pagination, small fixed set of approved templates.
  // Only flips listLoading off once metadata + every preview is in hand, so
  // the grid renders fully populated.
  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    setError(null);
    setTemplates([]);
    setHtmlByTemplateId({});
    (async () => {
      try {
        const res = await getApprovedTemplates();
        if (cancelled) return;
        const flat: ApprovedTemplateItem[] = [];
        for (const list of Object.values(res.brands)) {
          if (Array.isArray(list)) flat.push(...list);
        }
        // Parallel HTML fetches via /end-templates/{id} (cached layer).
        const htmlPairs = await Promise.all(
          flat.map((t) =>
            getTemplatePreview(t.end_template_id)
              .then((html) => [t.end_template_id, html] as const)
              .catch(() => [t.end_template_id, ''] as const),
          ),
        );
        if (cancelled) return;
        const htmlMap: Record<string, string> = {};
        for (const [id, html] of htmlPairs) htmlMap[id] = html;
        setTemplates(flat);
        setHtmlByTemplateId(htmlMap);
      } catch (e) {
        if (!cancelled) setError((e as Error).message ?? 'Failed to load templates.');
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePick = (item: ApprovedTemplateItem) => {
    setPicked(item);
    setStage('configure');
    setError(null);
  };

  const handleGenerate = async () => {
    if (!picked || !personalizationText.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const resp = await personalizeTemplateAgent({
        end_template_id: picked.end_template_id,
        channel: picked.channel,
        template_name: picked.template_name,
        personalization_text: personalizationText.trim(),
        max_variation: maxVariation,
      });
      setVariations(resp.personalized_versions || []);
      setStage('results');
    } catch (e) {
      setError((e as Error).message ?? 'Failed to generate versions.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectVersion = (v: PersonalizedVersion) => {
    const blob = new Blob([v.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName =
      (picked?.template_name || 'template').replace(/[^a-zA-Z0-9_-]+/g, '_') +
      `_v${v.version}.html`;
    a.href = url;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const headerSubtitle = useMemo(() => {
    if (stage === 'list') return 'Pick an approved template';
    if (stage === 'configure') return picked?.template_name ?? 'Configure';
    return 'Personalised versions';
  }, [stage, picked]);

  if (!mounted) return null;

  const body = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.16)] animate-modal-card"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-5">
          <div className="flex items-center gap-3">
            {stage !== 'list' && (
              <button
                type="button"
                onClick={() => {
                  if (stage === 'results') {
                    setStage('configure');
                    setVariations([]);
                  } else {
                    setStage('list');
                    setPicked(null);
                    setPersonalizationText('');
                  }
                }}
                aria-label="Back"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8624FF] to-[#a855f7] shadow-[0_0_24px_rgba(134,36,255,0.25)]">
              <Wand2 size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                Personalization Agent
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-zinc-900">
                {headerSubtitle}
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

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {stage === 'list' && (
            <ListStage
              loading={listLoading}
              loadingMsg={LOADING_MSGS[loadingMsgIdx]}
              templates={templates}
              htmlByTemplateId={htmlByTemplateId}
              onPick={handlePick}
              onPreview={(html, title) => {
                setPreviewHtml(html);
                setPreviewTitle(title);
              }}
            />
          )}

          {stage === 'configure' && picked && (
            <ConfigureStage
              picked={picked}
              personalizationText={personalizationText}
              setPersonalizationText={setPersonalizationText}
              maxVariation={maxVariation}
              setMaxVariation={setMaxVariation}
              generating={generating}
              onGenerate={handleGenerate}
            />
          )}

          {stage === 'results' && (
            <ResultsStage
              variations={variations}
              onFullScreen={setFullScreenIdx}
              onSelect={handleSelectVersion}
            />
          )}
        </div>
      </div>

      {fullScreenIdx !== null && variations[fullScreenIdx] && (
        <FullScreenPreview
          variation={variations[fullScreenIdx]}
          onClose={() => setFullScreenIdx(null)}
        />
      )}

      {previewHtml && (
        <ApprovedTemplatePreview
          html={previewHtml}
          title={previewTitle}
          onClose={() => setPreviewHtml(null)}
        />
      )}
    </div>
  );

  return createPortal(body, document.body);
}

function ApprovedTemplatePreview({
  html,
  title,
  onClose,
}: {
  html: string;
  title: string;
  onClose: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[90vh] max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[#8624FF]" />
            <p className="text-base font-semibold text-zinc-900">{title}</p>
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
            title={title}
            srcDoc={html}
            sandbox="allow-same-origin allow-scripts"
            className="h-full w-full border-0 rounded-lg bg-white"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ListStage({
  loading,
  loadingMsg,
  templates,
  htmlByTemplateId,
  onPick,
  onPreview,
}: {
  loading: boolean;
  loadingMsg: string;
  templates: ApprovedTemplateItem[];
  htmlByTemplateId: Record<string, string>;
  onPick: (t: ApprovedTemplateItem) => void;
  onPreview: (html: string, title: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center gap-2 text-[#8624FF]">
          <span className="stream-dot h-2 w-2 rounded-full bg-[#8624FF]" />
          <span className="stream-dot h-2 w-2 rounded-full bg-[#8624FF]" />
          <span className="stream-dot h-2 w-2 rounded-full bg-[#8624FF]" />
        </div>
        <p key={loadingMsg} className="text-sm font-medium text-zinc-700 animate-fade-in-up">
          {loadingMsg}
        </p>
      </div>
    );
  }
  if (templates.length === 0) {
    return (
      <p className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500">
        No approved templates yet.
      </p>
    );
  }
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900">
          Pick an approved template
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">
          Click a card to personalise it.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <ApprovedTemplateCard
            key={t.approved_content_id}
            item={t}
            html={htmlByTemplateId[t.end_template_id] ?? ''}
            onSelect={() => onPick(t)}
            onPreview={() => onPreview(htmlByTemplateId[t.end_template_id] ?? '', t.template_name)}
          />
        ))}
      </div>
    </div>
  );
}

function ApprovedTemplateCard({
  item,
  html,
  onSelect,
  onPreview,
}: {
  item: ApprovedTemplateItem;
  html: string;
  onSelect: () => void;
  onPreview: () => void;
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

  const snippet = (item.content_text ?? '').trim();

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition-all hover:border-[#b47cff] hover:shadow-md">
      <button
        type="button"
        onClick={onSelect}
        className="relative h-44 w-full cursor-pointer overflow-hidden bg-zinc-50"
      >
        <iframe
          ref={iframeRef}
          title={item.template_name}
          sandbox="allow-same-origin"
          className="pointer-events-none h-full w-full origin-top-left scale-[0.55] border-0 bg-white"
          style={{ width: '182%', height: '182%' }}
        />
      </button>
      <div className="flex flex-1 flex-col gap-1.5 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {item.channel}
          </span>
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-[#8624FF] transition-colors hover:bg-[#f7f1ff] cursor-pointer"
          >
            <Eye className="h-3 w-3" />
            Preview
          </button>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="text-left cursor-pointer"
        >
          <p className="line-clamp-1 text-sm font-semibold text-zinc-900">
            {item.template_name}
          </p>
          {snippet && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-zinc-500">
              {snippet}
            </p>
          )}
        </button>
      </div>
    </div>
  );
}

function ConfigureStage({
  picked,
  personalizationText,
  setPersonalizationText,
  maxVariation,
  setMaxVariation,
  generating,
  onGenerate,
}: {
  picked: ApprovedTemplateItem;
  personalizationText: string;
  setPersonalizationText: (v: string) => void;
  maxVariation: 1 | 2;
  setMaxVariation: (n: 1 | 2) => void;
  generating: boolean;
  onGenerate: () => void;
}) {
  const canGenerate = !!personalizationText.trim() && !generating;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8624FF]">
          {picked.channel}
        </p>
        <h4 className="mt-0.5 text-sm font-semibold text-zinc-900">{picked.template_name}</h4>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-600">
          Describe personalization
        </label>
        <textarea
          value={personalizationText}
          onChange={(e) => setPersonalizationText(e.target.value)}
          rows={5}
          placeholder="e.g. Make it personalized for oncology specialists attending ASCO 2026."
          className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition-colors focus:border-[#8624FF] focus:ring-2 focus:ring-[#8624FF]/15 placeholder:text-[11px] placeholder:text-zinc-400"
        />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-600">
          Versions
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((n) => {
            const on = maxVariation === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setMaxVariation(n as 1 | 2)}
                disabled={generating}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  on
                    ? 'border-[#8624FF] bg-[#8624FF] text-white shadow-[0_0_18px_rgba(134,36,255,0.25)]'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-[#b47cff]'
                } ${generating ? '' : 'cursor-pointer'}`}
              >
                {n} {n === 1 ? 'Version' : 'Versions'}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8624FF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(134,36,255,0.25)] transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:opacity-60 disabled:shadow-none cursor-pointer"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate
          </>
        )}
      </button>
    </div>
  );
}

function ResultsStage({
  variations,
  onFullScreen,
  onSelect,
}: {
  variations: PersonalizedVersion[];
  onFullScreen: (idx: number) => void;
  onSelect: (v: PersonalizedVersion) => void;
}) {
  if (variations.length === 0) {
    return (
      <p className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500">
        No versions returned.
      </p>
    );
  }
  return (
    <div
      className={`grid gap-4 ${
        variations.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
      }`}
    >
      {variations.map((v, i) => (
        <VariationCard
          key={v.version}
          variation={v}
          onFullScreen={() => onFullScreen(i)}
          onSelect={() => onSelect(v)}
        />
      ))}
    </div>
  );
}

function VariationCard({
  variation,
  onFullScreen,
  onSelect,
}: {
  variation: PersonalizedVersion;
  onFullScreen: () => void;
  onSelect: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const ifr = iframeRef.current;
    if (!ifr) return;
    const doc = ifr.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(variation.html || '<!doctype html><body></body>');
    doc.close();
  }, [variation.html]);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gradient-to-br from-[#8624FF] to-[#a855f7] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            V{variation.version}
          </span>
          <p className="text-sm font-semibold text-zinc-900">
            Version {variation.version}
          </p>
        </div>
        <button
          type="button"
          onClick={onFullScreen}
          aria-label="Full screen"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-[#8624FF] cursor-pointer"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
      <div className="h-[420px] bg-zinc-50">
        <iframe
          ref={iframeRef}
          title={`Version ${variation.version}`}
          sandbox="allow-same-origin"
          className="h-full w-full border-0 bg-white"
        />
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-zinc-200 bg-white px-4 py-3">
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#8624FF] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_18px_rgba(134,36,255,0.25)] transition-all duration-200 hover:opacity-90 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          Select & Download
        </button>
      </div>
    </div>
  );
}

function FullScreenPreview({
  variation,
  onClose,
}: {
  variation: PersonalizedVersion;
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
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#8624FF]" />
            <p className="text-base font-semibold text-zinc-900">
              Version {variation.version}
            </p>
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
            title={`Variation ${variation.version}`}
            srcDoc={variation.html || ''}
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