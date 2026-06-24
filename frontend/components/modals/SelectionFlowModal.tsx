'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  Loader2,
  Star,
  FileText,
  Image as ImageIcon,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const PAGE_SIZE = 4;

function usePager<T>(items: T[]) {
  const [page, setPage] = useState(0);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safe = Math.min(page, pageCount - 1);
  const start = safe * PAGE_SIZE;
  const slice = items.slice(start, start + PAGE_SIZE);
  return {
    slice,
    page: safe,
    pageCount,
    total,
    start,
    end: Math.min(start + PAGE_SIZE, total),
    next: () => setPage((p) => Math.min(p + 1, pageCount - 1)),
    prev: () => setPage((p) => Math.max(p - 1, 0)),
    setPage,
  };
}

function Pager({
  page,
  pageCount,
  total,
  start,
  end,
  onPrev,
  onNext,
  label,
}: {
  page: number;
  pageCount: number;
  total: number;
  start: number;
  end: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (p: number) => void;
  label: string;
}) {
  if (total <= PAGE_SIZE) return null;
  void label;
  void start;
  void end;
  return (
    <div className="mt-3 flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={onPrev}
        disabled={page === 0}
        aria-label="Previous page"
        className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-[#b47cff] hover:text-[#8624FF] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= pageCount - 1}
        aria-label="Next page"
        className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-[#b47cff] hover:text-[#8624FF] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
import {
  getSelectionOptions,
  confirmSelection,
  runGenerationAgent,
  type SelectionOptionsResponse,
  type ChannelOptions,
  type TemplateOption,
  type GenerationAgentResponse,
  type SelectionConfirmResponse,
  type DocOption,
  type ApprovedAssetOption,
} from '@/lib/selectionApi';
import { fetchEndTemplate, type EndTemplateItem } from '@/lib/editTemplateApi';
import { type MlrAgentRequest } from '@/lib/mlrApi';
import MLRAgentRunModal from '@/components/modals/MLRAgentRunModal';

// Product brand — violet system (matches Button.tsx / globals.css --brand-violet).
const BRAND_NAVY = '#09090b';      // ink for headings (zinc-950)
const BRAND_BLUE = '#8624FF';      // primary accent
const BRAND_LIGHT = '#b47cff';     // soft violet

// Strip internal field names (document_id, doc_ids, etc.) from API errors so
// surfaced messages stay user-friendly without dropping the validation itself.
function sanitizeError(msg: string): string {
  if (!msg) return 'Something went wrong. Please try again.';
  const lower = msg.toLowerCase();
  if (lower.includes('document_id') || lower.includes('doc_ids')) {
    return 'Please select at least one document or asset to continue.';
  }
  if (lower.includes('parent_template_doc_id')) {
    return 'No templates available for this brand.';
  }
  if (lower.includes('chunks_id')) {
    return 'Could not extract content from the selected documents.';
  }
  return msg;
}

type Step = 'brand' | 'select' | 'confirm' | 'generate';

interface Props {
  brand?: string;
  sessionId?: string;
  onClose: () => void;
  onComplete?: (result: GenerationAgentResponse) => void;
}

interface StreamLine {
  id: string;
  text: string;
}

export default function SelectionFlowModal({
  brand: initialBrand,
  sessionId,
  onClose,
  onComplete,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [brand, setBrand] = useState<string>(initialBrand ?? '');
  const [step, setStep] = useState<Step>(initialBrand ? 'select' : 'brand');
  const [options, setOptions] = useState<SelectionOptionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeChannel, setActiveChannel] = useState<string>('');
  const [selectedTemplates, setSelectedTemplates] = useState<Record<string, Set<string>>>({});
  // Optional generation inputs (all optional).
  
  const [query, setQuery] = useState('');
  const [audience, setAudience] = useState('');
  const [keyMessages, setKeyMessages] = useState('');
  const [mandatoryInclusions, setMandatoryInclusions] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [previewTpl, setPreviewTpl] = useState<TemplateOption | null>(null);

  const [genResp, setGenResp] = useState<GenerationAgentResponse | null>(null);
  const [streamLines, setStreamLines] = useState<StreamLine[]>([]);
  const [mlrOpen, setMlrOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR mount gate
    setMounted(true);
  }, []);

  useEffect(() => {
    if (step !== 'select' || !brand) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch start
    setLoading(true);
    setError(null);
    getSelectionOptions(brand)
      .then((res) => {
        if (cancelled) return;
        const channels = Array.isArray(res?.templates) ? res.templates : [];
        const normalized: SelectionOptionsResponse = {
          ...res,
          brand: res?.brand ?? brand,
          templates: channels,
          documents: Array.isArray(res?.documents) ? res.documents : [],
          approved_assets: Array.isArray(res?.approved_assets)
            ? res.approved_assets
            : [],
        };
        setOptions(normalized);
        const seed: Record<string, Set<string>> = {};
        // Only select "Clinical Focus Email" by default
        const emailChannel = channels.find(
          (c) => c.channel?.toLowerCase() === 'email',
        );
        if (emailChannel) {
          const tmpls = Array.isArray(emailChannel.templates)
            ? emailChannel.templates
            : [];
          const clinicalFocus = tmpls.find(
            (t) => t.template_name === 'Clinical Focus Email'
          );
          if (clinicalFocus) {
            seed[emailChannel.channel] = new Set(['Clinical Focus Email']);
          }
        }
        setSelectedTemplates(seed);
        if (channels[0]) setActiveChannel(channels[0].channel);
      })
      .catch((e) => !cancelled && setError(e.message ?? 'Failed to load options'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [brand, step]);

  const allChannelsPicked = useMemo(() => {
    const channels = options?.templates ?? [];
    if (channels.length === 0) return false;
    return channels.some((c) => selectedTemplates[c.channel]?.size > 0);
  }, [options, selectedTemplates]);


  const docsAndAssetsComplete = selectedDocIds.size > 0;

  const canConfirm = !loading && allChannelsPicked && docsAndAssetsComplete;

  // Build the MLR-agent request from the generation response. Only valid once
  // every id the endpoint requires is present.
  const mlrRequest = useMemo<MlrAgentRequest | null>(() => {
    if (!genResp) return null;
    const session_id = genResp.session_id || sessionId || '';

    // Get selected content types from selectedTemplates
    const selected_content_types = Object.keys(selectedTemplates);
    const selected_template_names = selected_content_types.flatMap((channel) =>
      Array.from(selectedTemplates[channel] ?? []),
    );

    const req: MlrAgentRequest = {
      session_id,
      end_template_id: genResp.end_template_id ?? '',
      mlr_collection_id: genResp.mlr_collection_id ?? '',
      chunks_id: genResp.chunks_id ?? '',
      claim_id: genResp.claim_id ?? '',
      content_id: genResp.content_id ?? '',
      selected_content_types,
      selected_template_names,
    };
    const idsComplete = [
      req.session_id,
      req.end_template_id,
      req.mlr_collection_id,
      req.chunks_id,
      req.claim_id,
      req.content_id,
    ].every((v) => v && v.length > 0);
    const complete =
      idsComplete &&
      selected_content_types.length > 0 &&
      selected_template_names.length > 0;
    return complete ? req : null;
  }, [genResp, sessionId, selectedTemplates]);

  const toggleSet = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const handleConfirm = async () => {
    if (!options) return;
    if (!options.parent_template_doc_id) {
      setError('No templates available for this brand.');
      return;
    }
    setStep('confirm');
    setError(null);
    try {
      // Flatten selectedTemplates from Record<string, Set<string>> to Record<string, string>
      // by taking the first template from each channel set
      const flattenedSelections: Record<string, string> = {};
      Object.entries(selectedTemplates).forEach(([channel, templateSet]) => {
        const templates = Array.from(templateSet);
        if (templates.length > 0) {
          flattenedSelections[channel] = templates[0];
        }
      });

      const resp = await confirmSelection({
        parent_template_doc_id: options.parent_template_doc_id,
        template_selections: flattenedSelections,
        doc_ids: Array.from(selectedDocIds),
        approved_asset_ids: Array.from(selectedAssetIds),
      });
      runGeneration(resp);
    } catch (e) {
      setError(sanitizeError((e as Error).message));
      setStep('select');
    }
  };

  const runGeneration = async (resp: SelectionConfirmResponse) => {
    setStep('generate');
    setStreamLines([]);
    const stages = [
      'Booting Generation Agent…',
      'Loading approved claims library…',
      'Drafting copy from selected templates…',
      'Rendering HTML output…',
      'Finalizing assets…',
    ];
    const STAGE_INTERVAL = 450;
    stages.forEach((text, i) => {
      setTimeout(() => {
        setStreamLines((prev) => [...prev, { id: `s${i}`, text }]);
      }, STAGE_INTERVAL * i);
    });
    const stagesShown = new Promise<void>((resolve) =>
      setTimeout(resolve, STAGE_INTERVAL * (stages.length - 1) + 700),
    );
    try {
      const channels = Object.keys(selectedTemplates);
      // Split multi-line fields into arrays; drop blank lines.
      const toLines = (v: string) =>
        v
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
      const audienceList = toLines(audience);
      const result = await runGenerationAgent({
        content_type: channels,
        template_id: resp.template_id,
        approved_asset_id: resp.approved_asset_id || '',
        doc_ids: resp.doc_ids ?? [],
        key_messages: toLines(keyMessages),
        mandatory_inclusions: toLines(mandatoryInclusions),
        audience: audienceList.length ? audienceList : ['professional'],
        query: query.trim(),
        thread_id: sessionId || null,
      });
      await stagesShown;
      setGenResp(result);
      onComplete?.(result);
    } catch (e) {
      setError(sanitizeError((e as Error).message));
    }
  };

  if (!mounted) return null;

  const stepIdx =
    step === 'brand'
      ? 0
      : step === 'select'
      ? 1
      : step === 'confirm'
      ? 2
      : 3;

  const body = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.16)] animate-modal-card"
      >
        <Header brand={brand || '—'} onClose={onClose} stepIdx={stepIdx} />
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {step === 'brand' && (
            <BrandStep
              initial={brand}
              onSubmit={(b) => {
                setBrand(b);
                setStep('select');
              }}
            />
          )}
          {step === 'select' && (
            <SelectStep
              loading={loading}
              options={options}
              activeChannel={activeChannel}
              setActiveChannel={setActiveChannel}
              selectedTemplates={selectedTemplates}
              toggleTemplate={(channel, name) =>
                setSelectedTemplates((p) => {
                  const next = { ...p };
                  if (next[channel]?.has(name)) {
                    delete next[channel];
                  } else {
                    next[channel] = new Set([name]);
                  }
                  return next;
                })
              }
              onPreview={setPreviewTpl}
              selectedDocIds={selectedDocIds}
              toggleDoc={(id) => setSelectedDocIds((p) => toggleSet(p, id))}
              selectedAssetIds={selectedAssetIds}
              toggleAsset={(id) => setSelectedAssetIds((p) => toggleSet(p, id))}
              query={query}
              setQuery={setQuery}
              audience={audience}
              setAudience={setAudience}
              keyMessages={keyMessages}
              setKeyMessages={setKeyMessages}
              mandatoryInclusions={mandatoryInclusions}
              setMandatoryInclusions={setMandatoryInclusions}
            />
          )}
          {step === 'confirm' && (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-zinc-600">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_BLUE }} />
              <p className="text-sm">Confirming selection with backend…</p>
            </div>
          )}
          {step === 'generate' && (
            <GenerateStep
              streamLines={streamLines}
              result={genResp}
              selectedContentTypes={Object.keys(selectedTemplates)}
              selectedTemplateNames={Object.values(selectedTemplates).flatMap(
                (set) => Array.from(set),
              )}
            />
          )}
        </div>
        <Footer
          step={step}
          canConfirm={canConfirm}
          onClose={onClose}
          onConfirm={handleConfirm}
          done={!!genResp}
          canRunMlr={!!mlrRequest}
          onRunMlr={() => setMlrOpen(true)}
          summary={
            options
              ? {
                  templates: Object.values(selectedTemplates).reduce(
                    (sum, set) => sum + set.size,
                    0
                  ),
                  totalChannels: (options.templates ?? []).length,
                  docs: selectedDocIds.size,
                  assets: selectedAssetIds.size,
                }
              : null
          }
        />
      </div>
      {previewTpl && (
        <TemplatePreviewModal tpl={previewTpl} onClose={() => setPreviewTpl(null)} />
      )}
      {mlrOpen && mlrRequest && (
        <MLRAgentRunModal request={mlrRequest} onClose={() => setMlrOpen(false)} />
      )}
    </div>
  );

  return createPortal(body, document.body);
}

function Header({
  brand,
  onClose,
  stepIdx,
}: {
  brand: string;
  onClose: () => void;
  stepIdx: number;
}) {
  const labels = ['Brand', 'Select', 'Confirm', 'Generate'];
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8624FF] to-[#a855f7] shadow-[0_0_24px_rgba(134,36,255,0.25)]">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Generation Agent · {brand}
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-zinc-900">
            Pharma Campaign Builder
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <ol className="hidden items-center gap-2 text-xs text-zinc-500 md:flex">
          {labels.map((l, i) => {
            const active = i === stepIdx;
            const done = i < stepIdx;
            return (
              <li key={l} className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-all ${
                    active
                      ? 'bg-[#8624FF] text-white shadow-[0_0_18px_rgba(134,36,255,0.45)]'
                      : done
                      ? 'bg-[#b47cff] text-white'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={active ? 'font-semibold text-zinc-900' : ''}>{l}</span>
                {i < labels.length - 1 && <span className="text-zinc-300">→</span>}
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function SelectStep({
  loading,
  options,
  activeChannel,
  setActiveChannel,
  selectedTemplates,
  toggleTemplate,
  onPreview,
  selectedDocIds,
  toggleDoc,
  selectedAssetIds,
  toggleAsset,
  query,
  setQuery,
  audience,
  setAudience,
  keyMessages,
  setKeyMessages,
  mandatoryInclusions,
  setMandatoryInclusions,
}: {
  loading: boolean;
  options: SelectionOptionsResponse | null;
  activeChannel: string;
  setActiveChannel: (c: string) => void;
  selectedTemplates: Record<string, Set<string>>;
  toggleTemplate: (channel: string, name: string) => void;
  onPreview: (t: TemplateOption) => void;
  selectedDocIds: Set<string>;
  toggleDoc: (id: string) => void;
  selectedAssetIds: Set<string>;
  toggleAsset: (id: string) => void;
  query: string;
  setQuery: (v: string) => void;
  audience: string;
  setAudience: (v: string) => void;
  keyMessages: string;
  setKeyMessages: (v: string) => void;
  mandatoryInclusions: string;
  setMandatoryInclusions: (v: string) => void;
}) {
  if (loading) return <Skeleton />;
  if (!options) return null;

  const channels = options.templates ?? [];
  const docs = options.documents ?? [];
  const assets = options.approved_assets ?? [];
  const active = channels.find((c) => c.channel === activeChannel) ?? channels[0];

  return (
    <div className="space-y-8">
      <BriefForm
        query={query}
        setQuery={setQuery}
        audience={audience}
        setAudience={setAudience}
        keyMessages={keyMessages}
        setKeyMessages={setKeyMessages}
        mandatoryInclusions={mandatoryInclusions}
        setMandatoryInclusions={setMandatoryInclusions}
      />
      {channels.length === 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          No channels returned for this brand.
        </p>
      )}
      {channels.length > 0 && (
        <section>
          <h3 className="mb-4 text-base font-semibold" style={{ color: BRAND_NAVY }}>
            Channels & Templates
          </h3>
          <div className="mb-5 flex flex-wrap gap-2">
            {channels.map((c) => {
              const hasPicked = (selectedTemplates[c.channel]?.size ?? 0) > 0;
              const on = c.channel === active?.channel;
              return (
                <button
                  key={c.channel}
                  type="button"
                  onClick={() => setActiveChannel(c.channel)}
                  className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all cursor-pointer"
                  style={{
                    background: on ? BRAND_BLUE : '#fff',
                    borderColor: on ? BRAND_BLUE : '#e4e7ec',
                    color: on ? '#fff' : '#475569',
                  }}
                >
                  {c.channel}
                  {hasPicked && (
                    <Check
                      className="h-3.5 w-3.5"
                      style={{ color: on ? '#fff' : BRAND_BLUE }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {active && (
            <ChannelBlock
              channel={active}
              selectedNames={selectedTemplates[active.channel] ?? new Set()}
              onToggle={(name) => toggleTemplate(active.channel, name)}
              onPreview={onPreview}
            />
          )}
        </section>
      )}

      <DocumentList
        docs={docs}
        selected={selectedDocIds}
        onToggle={toggleDoc}
      />
      <ApprovedAssetGrid
        assets={assets}
        selected={selectedAssetIds}
        onToggle={toggleAsset}
      />
    </div>
  );
}

function BriefField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
  className?: string;
  required?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border border-zinc-200 bg-white p-3.5 transition-colors hover:border-zinc-300 focus-within:border-[#8624FF] focus-within:shadow-[0_0_0_3px_rgba(134,36,255,0.12)] ${className}`}
    >
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-600">
        {label}
        {hint && (
          <span className="font-normal normal-case tracking-normal text-zinc-400">
            {hint}
          </span>
        )}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full flex-1 resize-none bg-transparent text-sm text-zinc-800 outline-none placeholder:text-[11px] placeholder:text-zinc-400"
      />
    </div>
  );
}

function BriefForm({
  query,
  setQuery,
  audience,
  setAudience,
  keyMessages,
  setKeyMessages,
  mandatoryInclusions,
  setMandatoryInclusions,
}: {
  query: string;
  setQuery: (v: string) => void;
  audience: string;
  setAudience: (v: string) => void;
  keyMessages: string;
  setKeyMessages: (v: string) => void;
  mandatoryInclusions: string;
  setMandatoryInclusions: (v: string) => void;
}) {
  return (
    <section>
      <h3 className="mb-3 text-base font-semibold text-zinc-900">Brief</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-2">
        <BriefField
          className="md:col-span-2 md:row-span-2"
          label="Query"
          value={query}
          onChange={setQuery}
          rows={6}
          placeholder="e.g. Generate a clinical email for oncology specialists targeting metastatic breast cancer."
        />
        <BriefField
          label="Audience"
          value={audience}
          onChange={setAudience}
          rows={2}
          placeholder={'hcp professionals\noncology specialists'}
        />
        <BriefField
          label="Key messages"
          value={keyMessages}
          onChange={setKeyMessages}
          rows={2}
          placeholder="e.g. Oncoryva offers a unique treatment pathway for patients with metastatic breast cancer."
        />
        <BriefField
          className="md:col-span-3"
          label="Mandatory inclusions"
          value={mandatoryInclusions}
          onChange={setMandatoryInclusions}
          rows={2}
          placeholder="e.g. Review of hypersensitivity history before treatment."
        />
      </div>
    </section>
  );
}

function ChannelBlock({
  channel,
  selectedNames,
  onToggle,
  onPreview,
}: {
  channel: ChannelOptions;
  selectedNames: Set<string>;
  onToggle: (name: string) => void;
  onPreview: (t: TemplateOption) => void;
}) {
  const templates = Array.isArray(channel.templates) ? channel.templates : [];
  const pager = usePager(templates);
  return (
    <div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pager.slice.map((t) => {
        const selected = selectedNames.has(t.template_name);
        return (
          <button
            type="button"
            key={t.template_name}
            onClick={() => onToggle(t.template_name)}
            className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
              selected ? '' : 'border-zinc-200 hover:border-[#b47cff]/60'
            }`}
            style={
              selected
                ? { borderColor: BRAND_BLUE, boxShadow: `0 0 0 2px ${BRAND_BLUE}33` }
                : undefined
            }
          >
            <div className="relative h-40 w-full overflow-hidden bg-white flex items-center justify-center">
              {t.html_code ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <iframe
                    srcDoc={t.html_code}
                    title={t.template_name}
                    className="absolute border-0 pointer-events-none"
                    style={{
                      width: '1000px',
                      height: '1400px',
                      transform: 'scale(0.15)',
                      transformOrigin: 'center center',
                    }}
                    sandbox=""
                  />
                </div>
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-xs font-medium"
                  style={{ color: BRAND_BLUE }}
                >
                  No Preview Available
                </div>
              )}

              {t.recommended && (
                <span
                  className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow"
                  style={{ background: BRAND_BLUE }}
                >
                  <Star className="h-3 w-3 fill-white" />
                  Recommended
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
            <div className="flex flex-1 flex-col gap-1.5 px-3 py-3">
              <p className="text-sm font-semibold text-zinc-900">{t.template_name}</p>
              {t.description && (
                <p className="line-clamp-2 text-xs text-zinc-500">{t.description}</p>
              )}
              <div className="mt-auto flex items-center justify-end pt-2">
                {t.html_code && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPreview(t);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onPreview(t);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors hover:bg-[#eef4ff] cursor-pointer"
                    style={{ color: BRAND_BLUE }}
                  >
                    <Eye className="h-3 w-3" /> Preview
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
    <Pager
      page={pager.page}
      pageCount={pager.pageCount}
      total={pager.total}
      start={pager.start}
      end={pager.end}
      onPrev={pager.prev}
      onNext={pager.next}
      onJump={pager.setPage}
      label="templates"
    />
    </div>
  );
}

function DocumentList({
  docs,
  selected,
  onToggle,
}: {
  docs: DocOption[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const pager = usePager(docs);
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3
          className="flex items-center gap-2 text-base font-semibold"
          style={{ color: BRAND_NAVY }}
        >
          <FileText className="h-4 w-4" style={{ color: BRAND_BLUE }} />
          Documents  <span className="text-red-500">*</span>
        </h3>
      </div>
      {docs.length === 0 ? (
        <p className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-400">
          No documents available.
        </p>
      ) : (
        <>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {pager.slice.map((d) => {
            const on = selected.has(d.asset_id);
            return (
              <label
                key={d.asset_id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-3 transition-all ${
                  on
                    ? 'shadow-[0_2px_8px_rgba(0,61,165,0.15)]'
                    : 'border-zinc-200 hover:border-[#b47cff]/60'
                }`}
                style={on ? { borderColor: BRAND_BLUE } : undefined}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggle(d.asset_id)}
                  className="mt-1 h-4 w-4 rounded"
                  style={{ accentColor: BRAND_BLUE }}
                />
                <div className="min-w-0 flex-1">
                  {d.asset_type && (
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                        style={{ background: BRAND_LIGHT }}
                      >
                        {d.asset_type}
                      </span>
                    </div>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-900">
                    {d.asset_name}
                  </p>
                  {d.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                      {d.description}
                    </p>
                  )}
                  {d.file_url && (
                    <a
                      href={d.file_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                      style={{ color: BRAND_BLUE }}
                    >
                      Open <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        <Pager
          page={pager.page}
          pageCount={pager.pageCount}
          total={pager.total}
          start={pager.start}
          end={pager.end}
          onPrev={pager.prev}
          onNext={pager.next}
          onJump={pager.setPage}
          label="documents"
        />
        </>
      )}
    </section>
  );
}

function ApprovedAssetGrid({
  assets,
  selected,
  onToggle,
}: {
  assets: ApprovedAssetOption[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const pager = usePager(assets);
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3
          className="flex items-center gap-2 text-base font-semibold"
          style={{ color: BRAND_NAVY }}
        >
          <ImageIcon className="h-4 w-4" style={{ color: BRAND_BLUE }} />
          Approved Assets <span className="text-red-500">*</span>
        </h3>
      </div>
      {assets.length === 0 ? (
        <p className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-400">
          No approved assets.
        </p>
      ) : (
        <>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pager.slice.map((a) => {
            const on = selected.has(a.asset_id);
            return (
              <button
                type="button"
                key={a.asset_id}
                onClick={() => onToggle(a.asset_id)}
                className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
                  on ? '' : 'border-zinc-200 hover:border-[#b47cff]/60'
                }`}
                style={
                  on
                    ? { borderColor: BRAND_BLUE, boxShadow: `0 0 0 2px ${BRAND_BLUE}33` }
                    : undefined
                }
              >
                <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-[#f1f5fb] to-[#dbeafe]">
                  {a.file_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.file_url}
                      alt={a.asset_name}
                      className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-xs"
                      style={{ color: BRAND_BLUE }}
                    >
                      {a.asset_type ?? 'Asset'}
                    </div>
                  )}
                  {a.asset_type && (
                    <span
                      className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow"
                      style={{ background: BRAND_NAVY }}
                    >
                      {a.asset_type}
                    </span>
                  )}
                  {on && (
                    <div
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg"
                      style={{ background: BRAND_BLUE }}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div className="px-2.5 py-2">
                  <p className="line-clamp-1 text-xs font-semibold text-zinc-900">
                    {a.asset_name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <Pager
          page={pager.page}
          pageCount={pager.pageCount}
          total={pager.total}
          start={pager.start}
          end={pager.end}
          onPrev={pager.prev}
          onNext={pager.next}
          onJump={pager.setPage}
          label="assets"
        />
        </>
      )}
    </section>
  );
}

function TemplatePreviewModal({
  tpl,
  onClose,
}: {
  tpl: TemplateOption;
  onClose: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Template Preview
            </p>
            <h3 className="text-base font-semibold text-zinc-900">{tpl.template_name}</h3>
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
            title={tpl.template_name}
            srcDoc={tpl.html_code}
            sandbox="allow-same-origin allow-scripts"
            className="h-full w-full rounded-lg border border-zinc-300 bg-white shadow-inner"
            style={{ minHeight: '60vh' }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function GenerateStep({
  streamLines,
  result,
  selectedContentTypes,
  selectedTemplateNames,
}: {
  streamLines: StreamLine[];
  result: GenerationAgentResponse | null;
  selectedContentTypes: string[];
  selectedTemplateNames: string[];
}) {
  const endTemplateId = result?.end_template_id;
  type TplState =
    | { status: 'idle' }
    | { status: 'loading'; id: string }
    | { status: 'ready'; id: string; items: EndTemplateItem[] }
    | { status: 'error'; id: string; error: string };
  const [tpl, setTpl] = useState<TplState>({ status: 'idle' });
  // Reset during render when the target id changes — avoids setState-in-effect
  // and its cascading-render warning. (React docs: "Adjusting state on prop
  // change".)
  if (endTemplateId) {
    if (tpl.status === 'idle' || tpl.id !== endTemplateId) {
      setTpl({ status: 'loading', id: endTemplateId });
    }
  } else if (tpl.status !== 'idle') {
    setTpl({ status: 'idle' });
  }
  const templates = tpl.status === 'ready' ? tpl.items : [];
  const tplLoading = tpl.status === 'loading';
  const tplError = tpl.status === 'error' ? tpl.error : null;

  const selectedTemplateNamesKey = selectedTemplateNames.join('|');
  useEffect(() => {
    if (!endTemplateId) return;
    let cancelled = false;
    fetchEndTemplate(endTemplateId, selectedContentTypes, selectedTemplateNames)
      .then((items) => {
        if (!cancelled) setTpl({ status: 'ready', id: endTemplateId, items });
      })
      .catch((e) => {
        if (!cancelled)
          setTpl({
            status: 'error',
            id: endTemplateId,
            error: (e as Error).message ?? 'Failed to load template.',
          });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTemplateId, selectedContentTypes, selectedTemplateNamesKey]);

  const lastIdx = streamLines.length - 1;
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Activity
          </p>
          {!result && streamLines.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8624FF]">
              <span className="stream-dot h-1.5 w-1.5 rounded-full bg-[#8624FF]" />
              <span className="stream-dot h-1.5 w-1.5 rounded-full bg-[#8624FF]" />
              <span className="stream-dot h-1.5 w-1.5 rounded-full bg-[#8624FF]" />
              <span className="ml-1">Generating</span>
            </div>
          )}
        </div>
        <ol className="relative space-y-3 border-l border-zinc-200 pl-4">
          {streamLines.map((l, i) => {
            const isCurrent = !result && i === lastIdx;
            const isDone = result || i < lastIdx;
            return (
              <li
                key={l.id}
                className="relative flex items-center gap-3 text-sm text-zinc-700 animate-fade-in-up"
              >
                <span
                  className={`absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full ${
                    isCurrent
                      ? 'bg-[#8624FF] animate-pulse-ring'
                      : isDone
                      ? 'bg-[#8624FF]'
                      : 'bg-zinc-300'
                  }`}
                >
                  {isDone && !isCurrent && (
                    <Check className="h-2 w-2 text-white" strokeWidth={4} />
                  )}
                </span>
                <span className={isCurrent ? 'font-medium text-zinc-900' : ''}>
                  {l.text}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {result && (
        <div className="space-y-5">
          {tplLoading && (
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" style={{ color: BRAND_BLUE }} />
              Loading generated template…
            </div>
          )}
          {tplError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {tplError}
            </div>
          )}
          {!tplLoading &&
            !tplError &&
            templates.map((tpl, i) => (
              <EndTemplatePreview key={`${tpl.template_name}-${i}`} tpl={tpl} />
            ))}
        </div>
      )}
    </div>
  );
}

function EndTemplatePreview({ tpl }: { tpl: EndTemplateItem }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8624FF]">
            {tpl.content_type || 'Output'}
          </p>
          <h4 className="text-sm font-semibold text-zinc-900">
            {tpl.template_name}
          </h4>
        </div>
        {tpl.content_type && (
          <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {tpl.content_type}
          </span>
        )}
      </div>
      <div className="p-4">
        {tpl.processed_html ? (
          <iframe
            title={tpl.template_name}
            sandbox="allow-same-origin allow-scripts"
            srcDoc={tpl.processed_html}
            className="h-[60vh] w-full rounded-lg border border-zinc-200 bg-white"
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

function BrandStep({
  initial,
  onSubmit,
}: {
  initial: string;
  onSubmit: (brand: string) => void;
}) {
  const [val, setVal] = useState(initial ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const trimmed = val.trim();
  const commit = () => {
    if (trimmed.length === 0) return;
    onSubmit(trimmed.toUpperCase());
  };
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8624FF] to-[#a855f7] text-white shadow-[0_0_24px_rgba(134,36,255,0.25)]">
        <Sparkles className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">Which brand?</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Type the pharmaceutical brand to load templates and approved assets.
        </p>
      </div>
      <div className="w-full">
        <input
          ref={inputRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              commit();
            }
          }}
          placeholder="e.g. BREXIVA"
          className="w-full rounded-xl border bg-white px-5 py-3.5 text-center text-base font-semibold uppercase tracking-wider text-zinc-900 outline-none transition-all focus:ring-2 focus:ring-[#8624FF]/30"
          style={{ borderColor: trimmed ? BRAND_BLUE : '#e4e7ec' }}
        />
        <p className="mt-2 text-[11px] text-zinc-400">
          Press Enter or click Continue
        </p>
      </div>
      {/* <div className="flex flex-wrap justify-center gap-2">
        {['HEMLIBRA', 'BREXIVA'].map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setVal(s)}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-[#b47cff] hover:text-[#8624FF] cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div> */}
      <button
        type="button"
        onClick={commit}
        disabled={trimmed.length === 0}
        className="rounded-lg bg-[#8624FF] px-8 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(134,36,255,0.25)] transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                className="h-48 animate-pulse rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Footer({
  step,
  canConfirm,
  onConfirm,
  done,
  canRunMlr,
  onRunMlr,
}: {
  step: Step;
  canConfirm: boolean;
  onClose: () => void;
  onConfirm: () => void;
  done: boolean;
  canRunMlr: boolean;
  onRunMlr: () => void;
  summary: {
    templates: number;
    totalChannels: number;
    docs: number;
    assets: number;
  } | null;
}) {
  if (step === 'brand') {
    return null;
  }
  // Generate step, once complete: only Run MLR action remains; close via header X.
  if (done) {
    return (
      <div className="flex items-center justify-between gap-4 border-t border-zinc-200 bg-white px-8 py-4">
        <span className="text-xs text-zinc-500">
          Generation complete.{' '}
          {canRunMlr
            ? 'Run the MLR agent to pre-screen for compliance.'
            : ''}
        </span>
        <button
          type="button"
          onClick={onRunMlr}
          disabled={!canRunMlr}
          title={
            canRunMlr
              ? 'Run MLR pre-screen'
              : 'MLR inputs are not available for this generation.'
          }
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:shadow-lg cursor-pointer"
          style={{
            background: canRunMlr
              ? 'linear-gradient(135deg,#8624FF,#a855f7)'
              : '#94a3b8',
          }}
        >
          <Sparkles className="h-4 w-4" />
          Run MLR Agent
        </button>
      </div>
    );
  }
  return (
  <div className="flex items-center justify-between gap-4 border-t border-zinc-200 bg-white px-8 py-4">
    {step === 'select' && (
      <>
        {!canConfirm && (
          <span className="text-xs text-zinc-500">
            Pick at least one channel template, and select at least one document to continue.
          </span>
        )}
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm}
          className="rounded-lg bg-[#8624FF] px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(134,36,255,0.25)] transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:opacity-60 disabled:shadow-none cursor-pointer ml-auto"
        >
          Confirm & Generate
        </button>
      </>
    )}
  </div>
);
}
