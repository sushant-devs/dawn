'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Sparkles, X, AlertTriangle } from 'lucide-react';
import { runGenerationMlr, type MlrAgentRequest } from '@/lib/mlrApi';
import type { MLRPreScreenPayload } from '@/lib/types';
import MLRPreScreenModal from '@/components/modals/MLRPreScreenModal';

interface Props {
  request: MlrAgentRequest;
  onClose: () => void;
}

// Standalone, read-only MLR pre-screen. Runs the agent and shows the analysis;
// it does NOT submit anything to the DAM platform.
export default function MLRAgentRunModal({ request, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [payload, setPayload] = useState<MLRPreScreenPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestRef = useRef(request);
  const startedRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR mount gate
    setMounted(true);
  }, []);

  useEffect(() => {
    if (startedRef.current) return; 
    startedRef.current = true;
    runGenerationMlr(requestRef.current)
      .then((res) => setPayload(res))
      .catch((e) =>
        setError((e as Error).message ?? 'Failed to run MLR agent.'),
      );
  }, []);

  if (!mounted) return null;

  if (payload) {
    return <MLRPreScreenModal payload={payload} onClose={onClose} />;
  }

  const overlay = (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 text-left">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.16)]">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8624FF] to-[#a855f7] shadow-lg">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-medium text-slate-900">MLR Pre-Screen</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {error ? 'Could not run the MLR agent' : 'Running compliance analysis…'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 transition-colors hover:text-zinc-900 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          {error ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                <AlertTriangle className="h-6 w-6 text-rose-500" />
              </div>
              <p className="text-sm text-rose-600">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-[#8624FF]" />
              <p className="text-sm text-zinc-600">
                Analysing assets for compliance, fair balance, and claims…
              </p>
              <p className="text-xs text-zinc-400">This can take a moment.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
