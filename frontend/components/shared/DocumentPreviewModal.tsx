'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Loader2 } from 'lucide-react';

export function isImageUrl(url: string): boolean {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() || '';
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext);
}

interface ViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function ImageViewerModal({ url, title, onClose }: ViewerProps) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative flex flex-col w-full max-w-4xl max-h-[88vh] rounded-2xl overflow-hidden bg-white shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-slate-800 truncate">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="relative flex-1 flex items-center justify-center overflow-auto bg-slate-50 p-4">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="text-dawn-teal animate-spin" />
                <span className="text-xs text-slate-500 font-medium">
                  Loading image…
                </span>
              </div>
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={title}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-sm"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function PdfViewerModal({ url, title, onClose }: ViewerProps) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=0&zoom=100`;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative flex flex-col w-full max-w-5xl h-[88vh] rounded-2xl overflow-hidden bg-white/95 shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={15} className="text-slate-500 shrink-0" />
            <span className="text-sm font-medium text-slate-800 truncate">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="relative flex-1 overflow-auto">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="text-dawn-teal animate-spin" />
                <span className="text-xs text-slate-500 font-medium">
                  Loading document…
                </span>
              </div>
            </div>
          )}
          <iframe
            src={iframeSrc}
            title={title}
            className="w-full h-full border-0 bg-white"
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
