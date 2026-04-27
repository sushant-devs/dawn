'use client';

import { useState } from 'react';
import { X, CheckCircle, XCircle, Brain, FileCheck, Zap } from 'lucide-react';
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
  const text = asset.content;
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
  const [showTransparency, setShowTransparency] = useState(false);

  const passedCount = MLR_ASSETS.filter((a) => a.status === 'Passed').length;
  const pendingCount = MLR_ASSETS.filter((a) => a.status === 'Pending').length;
  const tier1Count = MLR_ASSETS.filter((a) => a.tier === 'Tier 1').length;
  const tier2Count = MLR_ASSETS.filter((a) => a.tier === 'Tier 2').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">MLR Pre-Screen</h2>
              <p className="text-xs text-gray-400">Stage 5 — Internal Pre-Screen</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy cursor-pointer"><X size={20} /></button>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 border-b border-dawn-border overflow-x-auto">
          <span className="bg-dawn-navy/10 text-dawn-navy rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">5 Assets</span>
          <span className="bg-dawn-green/10 text-dawn-green rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">{passedCount} Passed</span>
          <span className="bg-dawn-amber/10 text-dawn-amber rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">{pendingCount} Pending</span>
          <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">Tier 1: {tier1Count}</span>
          <span className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">Tier 2: {tier2Count}</span>
          <span className="ml-auto bg-dawn-sky text-dawn-navy rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">Pre-screen only</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">
          {/* Asset list */}
          <div className="w-64 border-r border-dawn-border bg-gray-50 overflow-y-auto shrink-0">
            {MLR_ASSETS.map((asset) => {
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
                      <StatusPill status={asset.status} size="sm" />
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
                <button
                  onClick={() => setShowTransparency(!showTransparency)}
                  className="text-[10px] text-purple-600 hover:text-purple-800 underline flex items-center gap-1 cursor-pointer"
                >
                  <Brain size={12} />
                  {showTransparency ? 'Hide' : 'Show'} AI Process
                </button>
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="w-3 h-0.5 bg-dawn-green inline-block" /> Substantiated
                  <span className="w-3 h-0.5 bg-dawn-amber inline-block ml-2" /> Fair Balance
                  <span className="w-3 h-0.5 bg-dawn-red inline-block ml-2" /> Puffery
                </div>
              </div>
            </div>

            {/* AI Transparency Panel */}
            {showTransparency && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Brain size={16} className="text-purple-600" />
                  <h4 className="text-sm font-bold text-purple-900">How AI Pre-Screen Works (White Box)</h4>
                </div>

                <div className="bg-white rounded-lg p-3 space-y-2 text-[11px]">
                  <p className="font-semibold text-gray-900">Configuration → Prompts → Execution Flow:</p>

                  <div className="space-y-1.5 ml-2">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">1.</span>
                      <div>
                        <p className="font-medium text-gray-800">Reference Documents Loaded</p>
                        <p className="text-gray-600">• HAVEN 1-4 CSRs • MLR Review Protocols • Brand Guidelines</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">2.</span>
                      <div>
                        <p className="font-medium text-gray-800">Prompt Construction</p>
                        <p className="text-gray-600">
                          "Analyze {selectedAsset.name} for: claim substantiation against HAVEN data,
                          fair balance per MLR protocols, ISI completeness, promotional language flags"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">3.</span>
                      <div>
                        <p className="font-medium text-gray-800">Multi-Step Validation</p>
                        <p className="text-gray-600">
                          Each claim extracted → cross-referenced with evidence → scored →
                          flagged if unsupported or imbalanced
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">4.</span>
                      <div>
                        <p className="font-medium text-gray-800">Total Review Analysis</p>
                        <p className="text-gray-600">
                          All 5 assets compared for messaging consistency, tone alignment,
                          and claim harmony across the campaign
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">5.</span>
                      <div>
                        <p className="font-medium text-gray-800">Output Generation</p>
                        <p className="text-gray-600">
                          Pre-screen report with color-coded flags, confidence scores,
                          and context-aware recommendations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-100 rounded-lg p-2 text-[10px] text-purple-900">
                  <p className="font-semibold">You are in control:</p>
                  <p className="mt-1">This process is deterministic and traceable. No "magic button" — every validation
                  step references specific documents and follows defined MLR protocols.</p>
                </div>
              </div>
            )}

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

            {/* AI Intelligence & Recommendations */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-purple-600" />
                <p className="text-xs font-semibold text-purple-900">AI Insights & Recommendations</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-gray-700">
                    <strong>Context-aware:</strong> This {selectedAsset.name} references HAVEN 4 median ABR data.
                    Cross-checked against selected evidence documents — claim substantiated.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-gray-700">
                    <strong>Smart alignment:</strong> Risk/benefit balance score could improve by adding
                    bleeding event frequency context from HAVEN 1 data.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-gray-700">
                    <strong>Campaign cohesion:</strong> Messaging tone consistent with HCP Email (US) —
                    professional clinical emphasis maintained across touchpoints.
                  </p>
                </div>
              </div>
            </div>

            {/* Total Review - Campaign Cohesion */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-blue-600" />
                <p className="text-xs font-semibold text-blue-900">Total Review — Campaign Cohesion</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-2 border border-blue-100">
                  <p className="text-[10px] text-gray-500 mb-1">Message Consistency</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div className="h-1 rounded-full bg-green-500" style={{ width: '94%' }} />
                    </div>
                    <span className="text-[10px] font-semibold text-green-600">94%</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-100">
                  <p className="text-[10px] text-gray-500 mb-1">Tone Alignment</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div className="h-1 rounded-full bg-green-500" style={{ width: '89%' }} />
                    </div>
                    <span className="text-[10px] font-semibold text-green-600">89%</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-100">
                  <p className="text-[10px] text-gray-500 mb-1">Visual Cohesion</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div className="h-1 rounded-full bg-green-500" style={{ width: '91%' }} />
                    </div>
                    <span className="text-[10px] font-semibold text-green-600">91%</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-100">
                  <p className="text-[10px] text-gray-500 mb-1">Claim Harmony</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div className="h-1 rounded-full bg-green-500" style={{ width: '96%' }} />
                    </div>
                    <span className="text-[10px] font-semibold text-green-600">96%</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-blue-700 italic mt-1">
                All 5 assets analyzed as a cohesive campaign unit — no conflicting messages detected
              </p>
            </div>

            {/* Veeva Integration Notice */}
            <div className="bg-dawn-sky/20 border border-dawn-teal/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-dawn-navy flex items-center gap-2">
                <FileCheck size={14} />
                Veeva PromoMats Integration
              </p>
              <p className="text-xs text-dawn-navy">
                This is an <strong>internal AI pre-screen only</strong>. Final medical/legal/regulatory approval
                is performed in Veeva PromoMats (system of record).
              </p>
              <div className="flex items-start gap-2 bg-white/50 rounded-lg p-2 mt-2">
                <CheckCircle size={14} className="text-green-600 mt-0.5 shrink-0" />
                <div className="text-[10px] text-gray-700">
                  <p className="font-medium">Pre-check results will transfer to Veeva with visual indicators:</p>
                  <ul className="mt-1 space-y-0.5 ml-2">
                    <li>• Green badges for pre-validated content</li>
                    <li>• Amber flags for items needing attention</li>
                    <li>• Change tracking for modified claims</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex items-center justify-between">
          <p className="text-xs text-gray-500">Internal pre-screen complete. Final approval occurs in Veeva Promomat.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button onClick={onConfirm} className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm cursor-pointer">
              Confirm & Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
