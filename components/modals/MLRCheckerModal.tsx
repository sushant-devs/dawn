'use client';

import { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { MLR_ASSETS } from '@/lib/mockData';
import StatusPill from '@/components/shared/StatusPill';
import type { MLRAssetDetail } from '@/lib/types';

interface MLRCheckerModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const FLAG_STYLES = {
  substantiated: 'underline decoration-dawn-green decoration-2',
  'fair-balance': 'underline decoration-dawn-amber decoration-2',
  puffery: 'underline decoration-dawn-red decoration-2',
};

const FLAG_TOOLTIP = {
  substantiated: 'bg-dawn-green/10 text-dawn-green border-dawn-green/20',
  'fair-balance': 'bg-dawn-amber/10 text-dawn-amber border-dawn-amber/20',
  puffery: 'bg-dawn-red/10 text-dawn-red border-dawn-red/20',
};

function AnnotatedContent({ asset }: { asset: MLRAssetDetail }) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  // Build annotated text
  let text = asset.content;
  const lines = text.split('\n');

  return (
    <div className="text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">
      {lines.map((line, li) => {
        let annotatedLine: React.ReactNode = line;
        for (const flag of asset.flags) {
          if (line.includes(flag.phrase)) {
            const parts = line.split(flag.phrase);
            annotatedLine = (
              <span key={li}>
                {parts[0]}
                <span
                  className={`relative cursor-help ${FLAG_STYLES[flag.type]}`}
                  onMouseEnter={() => setTooltip(`${flag.type}:${flag.phrase}`)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {flag.phrase}
                  {tooltip === `${flag.type}:${flag.phrase}` && (
                    <span className={`absolute left-0 top-5 z-10 w-56 rounded-lg border p-2 text-[10px] shadow-lg ${FLAG_TOOLTIP[flag.type]}`}>
                      {flag.source ? <><strong>Source:</strong> {flag.source}</> : null}
                      {flag.suggestion ? <><br /><strong>Suggestion:</strong> {flag.suggestion}</> : null}
                    </span>
                  )}
                </span>
                {parts.slice(1).join(flag.phrase)}
              </span>
            );
            break;
          }
        }
        return <div key={li}>{annotatedLine}</div>;
      })}
    </div>
  );
}

export default function MLRCheckerModal({ onConfirm, onClose }: MLRCheckerModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<MLRAssetDetail>(MLR_ASSETS[0]);
  const [assetStatuses, setAssetStatuses] = useState<Record<string, 'Passed' | 'Pending' | 'Flagged' | 'Rejected'>>(
    Object.fromEntries(MLR_ASSETS.map((a) => [a.id, a.status]))
  );

  const updateStatus = (id: string, status: 'Passed' | 'Pending' | 'Flagged' | 'Rejected') => {
    setAssetStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const allResolved = Object.values(assetStatuses).every((s) => s === 'Passed' || s === 'Rejected');
  const passedCount = Object.values(assetStatuses).filter((s) => s === 'Passed').length;
  const pendingCount = Object.values(assetStatuses).filter((s) => s === 'Pending').length;

  const batchApproveTier1 = () => {
    const tier1 = MLR_ASSETS.filter((a) => a.tier === 'Tier 1');
    setAssetStatuses((prev) => {
      const next = { ...prev };
      tier1.forEach((a) => { next[a.id] = 'Passed'; });
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-4xl bg-white h-full flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">MLR Checker</h2>
              <p className="text-xs text-gray-400">Stage 5 — Compliance Review</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy"><X size={20} /></button>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 border-b border-dawn-border overflow-x-auto">
          <span className="bg-dawn-navy/10 text-dawn-navy rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">5 Assets</span>
          <span className="bg-dawn-green/10 text-dawn-green rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">{passedCount} Passed</span>
          <span className="bg-dawn-amber/10 text-dawn-amber rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">{pendingCount} Pending</span>
          <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">Tier 1: 1</span>
          <span className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">Tier 2: 4</span>
          <button onClick={batchApproveTier1} className="ml-auto whitespace-nowrap text-xs bg-dawn-green text-white rounded-full px-3 py-1 font-medium hover:bg-dawn-green/90 transition-colors">
            Batch Approve Tier 1
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">
          {/* Asset list */}
          <div className="w-64 border-r border-dawn-border bg-gray-50 overflow-y-auto shrink-0">
            {MLR_ASSETS.map((asset) => {
              const status = assetStatuses[asset.id];
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-dawn-border transition-colors ${selectedAsset.id === asset.id ? 'bg-white border-l-2 border-l-dawn-teal' : 'hover:bg-white'}`}
                >
                  <div className="w-8 h-8 bg-dawn-navy/10 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-dawn-navy text-[10px] font-bold">{asset.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-dawn-navy truncate">{asset.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${asset.tier === 'Tier 1' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {asset.tier}
                      </span>
                      <StatusPill status={status} size="sm" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Claim annotation */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-dawn-navy text-sm">{selectedAsset.name}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="w-3 h-0.5 bg-dawn-green inline-block" /> Substantiated
                  <span className="w-3 h-0.5 bg-dawn-amber inline-block ml-2" /> Fair Balance
                  <span className="w-3 h-0.5 bg-dawn-red inline-block ml-2" /> Puffery
                </div>
              </div>
            </div>

            {/* Annotated content */}
            <div className="bg-white border border-dawn-border rounded-xl p-4 max-h-48 overflow-y-auto">
              <AnnotatedContent asset={selectedAsset} />
            </div>

            {/* AI Pre-Screen Report */}
            <div className="bg-gray-50 border border-dawn-border rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-dawn-navy">AI Pre-Screen Report</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Fair Balance Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${selectedAsset.fairBalanceScore >= 85 ? 'bg-dawn-green' : selectedAsset.fairBalanceScore >= 75 ? 'bg-dawn-amber' : 'bg-dawn-red'}`}
                        style={{ width: `${selectedAsset.fairBalanceScore}%` }} />
                    </div>
                    <span className={`text-xs font-semibold ${selectedAsset.fairBalanceScore >= 85 ? 'text-dawn-green' : 'text-dawn-amber'}`}>
                      {selectedAsset.fairBalanceScore}/100
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-gray-400">ISI Completeness</p>
                  {selectedAsset.isiComplete ? (
                    <CheckCircle size={14} className="text-dawn-green" />
                  ) : (
                    <XCircle size={14} className="text-dawn-red" />
                  )}
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Substantiation</p>
                  <p className="text-xs font-medium text-dawn-navy">{selectedAsset.substantiationCount} claims linked</p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Puffery Detected</p>
                  {selectedAsset.pufferyItems.length === 0 ? (
                    <p className="text-xs text-dawn-green font-medium">None</p>
                  ) : (
                    <div className="space-y-0.5">
                      {selectedAsset.pufferyItems.map((p) => (
                        <p key={p} className="text-xs text-dawn-red">{p}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review actions */}
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 mr-2">Review decision:</p>
              <button
                onClick={() => updateStatus(selectedAsset.id, 'Passed')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${assetStatuses[selectedAsset.id] === 'Passed' ? 'bg-dawn-green text-white' : 'border border-dawn-green text-dawn-green hover:bg-dawn-green/5'}`}
              >
                <CheckCircle size={12} /> Approve
              </button>
              <button
                onClick={() => updateStatus(selectedAsset.id, 'Pending')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${assetStatuses[selectedAsset.id] === 'Pending' ? 'bg-dawn-amber text-white' : 'border border-dawn-amber text-dawn-amber hover:bg-dawn-amber/5'}`}
              >
                <AlertCircle size={12} /> Approve with Changes
              </button>
              <button
                onClick={() => updateStatus(selectedAsset.id, 'Rejected')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${assetStatuses[selectedAsset.id] === 'Rejected' ? 'bg-dawn-red text-white' : 'border border-dawn-red text-dawn-red hover:bg-dawn-red/5'}`}
              >
                <XCircle size={12} /> Reject
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex items-center">
          {allResolved && (
            <div className="flex items-center gap-2 text-dawn-green text-sm font-medium">
              <CheckCircle size={16} />
              All Assets Reviewed — Proceed to Distribution ✓
            </div>
          )}
          <div className="ml-auto flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors">Cancel</button>
            <button onClick={onConfirm} className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm">
              Confirm & Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
