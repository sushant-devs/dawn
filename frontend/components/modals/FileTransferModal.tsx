'use client';

import { useState, useEffect, useRef } from 'react';
import { Monitor, Database, Share2, Check, FileText } from 'lucide-react';
import { useCampaignData } from '@/context/DAWNContext';

interface FileTransferModalProps {
  onComplete: () => void;
}

// Per-asset presentation: filename extension, icon, and a representative size.
// Generated deliverables are rendered as HTML templates for every brand, so all
// transferred files carry the .html extension.
const ASSET_FILE_META: Record<string, { ext: string; icon: typeof FileText; size: string }> = {
  poster: { ext: 'html', icon: FileText, size: '8.2 MB' },
  email: { ext: 'html', icon: FileText, size: '2.4 MB' },
  leaflet: { ext: 'html', icon: FileText, size: '1.8 MB' },
  dda: { ext: 'html', icon: FileText, size: '3.1 MB' },
};

export default function FileTransferModal({ onComplete }: FileTransferModalProps) {
  const { generatedAssets } = useCampaignData();

  // Build the transfer file list from the campaign's generated assets so only
  // the campaign's actual deliverables are shown.
  const TRANSFER_FILES = generatedAssets.map((a) => {
    const meta = ASSET_FILE_META[a.id] ?? { ext: 'html', icon: FileText, size: '2.0 MB' };
    const baseName = a.title.split(' - ')[0].replace(/\s+/g, '_');
    return { name: `${baseName}.${meta.ext}`, icon: meta.icon, size: meta.size };
  });

  const [transferProgress, setTransferProgress] = useState(0);
  const [activeFileIndex, setActiveFileIndex] = useState(-1);
  const [completedFiles, setCompletedFiles] = useState<number[]>([]);
  const [transferComplete, setTransferComplete] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const fileCount = TRANSFER_FILES.length;

  useEffect(() => {
    if (fileCount === 0) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let fileIdx = 0;
    const progressPerFile = 100 / fileCount;

    const startNextFile = () => {
      if (fileIdx >= fileCount) {
        setTransferComplete(true);
        timers.push(setTimeout(() => onCompleteRef.current(), 1500));
        return;
      }
      setActiveFileIndex(fileIdx);
      const duration = 800 + Math.random() * 400;
      timers.push(
        setTimeout(() => {
          const completedIdx = fileIdx;
          setCompletedFiles((prev) =>
            prev.includes(completedIdx) ? prev : [...prev, completedIdx],
          );
          setTransferProgress((completedIdx + 1) * progressPerFile);
          fileIdx++;
          timers.push(setTimeout(startNextFile, 200));
        }, duration),
      );
    };

    timers.push(setTimeout(startNextFile, 600));
    return () => timers.forEach(clearTimeout);
  }, [fileCount]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-dawn-border bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-dawn-teal to-dawn-purple flex items-center justify-center shadow-[0_0_12px_rgba(134,36,255,0.35)]">
              <Share2 size={12} className="text-white" />
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">File Transfer</h2>
              <p className="text-xs text-gray-400">Distributing assets to selected channels</p>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${transferComplete ? 'bg-dawn-green/10 text-dawn-green' : 'bg-dawn-amber/10 text-dawn-amber'}`}>
            {transferComplete ? 'Complete' : 'In Progress'}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* PC-to-PC visualization */}
          <div className="w-full flex items-center justify-between mb-8 px-4">
            {/* Source PC */}
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${transferComplete ? 'opacity-50' : ''}`}>
              <div className="w-[72px] h-[60px] rounded-xl border border-dawn-border bg-dawn-sky/50 flex items-center justify-center relative" style={{ animation: transferComplete ? undefined : 'pulse-glow 2.5s ease-in-out infinite' }}>
                <Monitor size={26} className="text-dawn-navy" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-dawn-green border-2 border-white" />
              </div>
              <p className="text-[10px] font-medium text-gray-500">DAWN Platform</p>
            </div>

            {/* Animated connection */}
            <div className="flex-1 mx-5 relative h-16 flex items-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M 8 30 C 60 10, 140 10, 192 30" fill="none" stroke="#D8C9F2" strokeWidth="1.5" strokeDasharray="5 4" style={{ animation: 'dash-flow 0.8s linear infinite' }} />
              </svg>

              {activeFileIndex >= 0 && !completedFiles.includes(activeFileIndex) && (
                <div
                  key={activeFileIndex}
                  className="absolute left-1 top-1/2 -translate-y-1/2"
                  style={{ ['--fly-distance' as string]: 'calc(100% - 12px)', animation: 'file-fly 0.75s ease-in-out forwards' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-dawn-teal/30 flex items-center justify-center shadow-sm">
                    {(() => { const IconComp = TRANSFER_FILES[activeFileIndex]?.icon ?? FileText; return <IconComp size={14} className="text-dawn-teal" />; })()}
                  </div>
                </div>
              )}
            </div>

            {/* Destination */}
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${transferComplete ? 'scale-105' : ''}`}>
              <div className="w-[72px] h-[60px] rounded-xl border border-dawn-border bg-dawn-sky/50 flex items-center justify-center relative" style={{ animation: transferComplete ? 'pulse-glow 1s ease-in-out 2' : undefined }}>
                <Database size={26} className="text-dawn-teal" />
                {transferComplete && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-dawn-green border-2 border-white flex items-center justify-center">
                    <Check size={8} className="text-white" />
                  </div>
                )}
              </div>
              <p className="text-[10px] font-medium text-gray-500">Distribution Channels</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-dawn-navy">
                {transferComplete ? 'All files transferred' : `Transferring ${completedFiles.length + 1} of ${TRANSFER_FILES.length}...`}
              </p>
              <p className="text-xs font-medium text-dawn-teal tabular-nums">{Math.round(transferProgress)}%</p>
            </div>
            <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-dawn-teal to-dawn-purple-light shadow-[0_0_8px_rgba(134,36,255,0.4)]" style={{ width: `${transferProgress}%` }} />
            </div>
          </div>

          {/* File list */}
          <div className="space-y-2">
            {TRANSFER_FILES.map((file, idx) => {
              const FileIcon = file.icon;
              const isComplete = completedFiles.includes(idx);
              const isActive = activeFileIndex === idx && !isComplete;
              return (
                <div
                  key={file.name}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                    isComplete
                      ? 'border-dawn-green/20 bg-dawn-green/5'
                      : isActive
                        ? 'border-dawn-teal/30 bg-dawn-sky'
                        : 'border-dawn-border bg-gray-50 opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isComplete ? 'bg-dawn-green/10' : isActive ? 'bg-dawn-teal/10' : 'bg-gray-100'}`}>
                    {isComplete ? <Check size={14} className="text-dawn-green" /> : <FileIcon size={14} className={isActive ? 'text-dawn-teal' : 'text-gray-400'} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${isComplete || isActive ? 'text-dawn-navy' : 'text-gray-400'}`}>{file.name}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 tabular-nums">{file.size}</p>
                  {isActive && (
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-dawn-teal animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-dawn-teal animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-dawn-teal animate-pulse [animation-delay:300ms]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Success message */}
          {transferComplete && (
            <div className="mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-dawn-green/5 border border-dawn-green/20 animate-scale-in">
              <Check size={16} className="text-dawn-green" />
              <p className="text-sm font-medium text-dawn-green">All assets distributed successfully</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
