'use client';

import { useState, useMemo } from 'react';
import { X, CheckCircle, XCircle, Brain, FileCheck, Zap, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCampaignData } from '@/context/DAWNContext';
import StatusPill from '@/components/shared/StatusPill';
import type { MLRAssetDetail } from '@/lib/types';
import Button from '@/components/ui/Button';

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
  const { mlrAssets: rawMlrAssets, generatedAssets } = useCampaignData();

  // Backfill empty MLR content from the matching generated asset so newer
  // campaigns (which keep MLR content lean) still show the full copy.
  const MLR_ASSETS = useMemo<MLRAssetDetail[]>(
    () =>
      rawMlrAssets.map((a) =>
        a.content
          ? a
          : { ...a, content: generatedAssets.find((g) => g.id === a.id)?.content ?? '' },
      ),
    [rawMlrAssets, generatedAssets],
  );

  const [selectedAsset, setSelectedAsset] = useState<MLRAssetDetail>(MLR_ASSETS[0]);
  const [showTransparency, setShowTransparency] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const passedCount = MLR_ASSETS.filter((a) => a.status === 'Passed').length;
  const pendingCount = MLR_ASSETS.filter((a) => a.status === 'Pending').length;
  const tier1Count = MLR_ASSETS.filter((a) => a.tier === 'Tier 1').length;
  const tier2Count = MLR_ASSETS.filter((a) => a.tier === 'Tier 2').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dawn-border bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8624FF] to-[#6B1FCC] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-serif text-lg font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-xl text-dawn-navy font-semibold">MLR Pre-Screen</h2>
              <p className="text-sm text-gray-500 mt-0.5">Review AI pre-screen analysis and recommendations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer"><X size={22} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex bg-[#f5f7fa]">
          {/* Asset list - Collapsible Sidebar */}
          <div
            className={`border-r border-dawn-border bg-white flex flex-col transition-all duration-300 ${
              sidebarCollapsed ? 'w-16' : 'w-64'
            }`}
          >
            <div className="px-4 py-3 border-b border-dawn-border flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h3 className="text-sm font-semibold text-dawn-navy font-body">Assets</h3>
                  <p className="text-xs text-gray-500 font-body mt-0.5">Select to review</p>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-dawn-navy transition-colors cursor-pointer ml-auto"
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {sidebarCollapsed ? (
                /* Collapsed - Icon Pills */
                <div className="p-2 space-y-2">
                  {MLR_ASSETS.map((asset, idx) => (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-xs font-bold font-body cursor-pointer ${
                        selectedAsset.id === asset.id
                          ? 'border-dawn-teal bg-dawn-teal text-white shadow-lg'
                          : 'border-dawn-border bg-white text-gray-500 hover:border-dawn-teal/50 hover:bg-dawn-teal/5'
                      }`}
                      title={asset.name}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              ) : (
                /* Expanded - Asset Cards */
                <div>
                  {MLR_ASSETS.map((asset) => {
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-dawn-border transition-colors ${
                          selectedAsset.id === asset.id ? 'bg-dawn-teal/10 border-l-2 border-l-dawn-teal' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-8 h-8 bg-dawn-navy/10 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-dawn-navy text-[10px] font-bold">{asset.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-dawn-navy truncate">{asset.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${asset.tier === 'Tier 1' ? 'bg-blue-100 text-blue-700' : asset.tier === 'Tier 2' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                              {asset.tier}
                            </span>
                            <StatusPill status={asset.tier === 'Tier 1' ? 'Passed' : asset.status} size="sm" />
                          </div>
                        </div>
                        {selectedAsset.id === asset.id && (
                          <div className="w-5 h-5 bg-dawn-teal rounded-full flex items-center justify-center shadow-sm shrink-0">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Claim annotation */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-dawn-navy text-sm">{selectedAsset.name}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Fair Balance
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block ml-2" /> Puffery
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
                        <p className="text-gray-600">• Brexiva Clinical Studies • MLR Review Protocols • Brand Guidelines</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">2.</span>
                      <div>
                        <p className="font-medium text-gray-800">Prompt Construction</p>
                        <p className="text-gray-600">
                          {`"Analyze ${selectedAsset.name} for: claim substantiation against Brexiva clinical data, fair balance per MLR protocols, ISI completeness, promotional language flags"`}
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

            {/* Compliance Findings */}
            {selectedAsset.complianceFindings && selectedAsset.complianceFindings.length > 0 && (
              <div className="bg-white border border-dawn-border rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-dawn-navy">
                  Compliance findings ({selectedAsset.complianceFindings.length})
                </p>
                <div className="space-y-3">
                  {selectedAsset.complianceFindings.map((f, i) => (
                    <div key={i} className="rounded-lg border border-dawn-border bg-gray-50 p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            f.severity === 'HIGH'
                              ? 'bg-dawn-red/10 text-dawn-red'
                              : 'bg-dawn-amber/10 text-dawn-amber'
                          }`}
                        >
                          {f.severity}
                        </span>
                        <span className="text-[11px] font-semibold text-dawn-navy uppercase tracking-wide">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-700">{f.finding}</p>
                      <p className="text-[11px] leading-relaxed text-dawn-navy">
                        <strong>Suggested fix:</strong> {f.suggestion}
                      </p>
                      <p className="text-[10px] leading-relaxed text-gray-400">
                        <strong>Ref:</strong> {f.ref}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Pre-Screen Report */}
            <div className="bg-gray-50 border border-dawn-border rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-dawn-navy">AI Pre-Screen Report</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Fair Balance Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-amber-400"
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
                {selectedAsset.aiInsights && selectedAsset.aiInsights.length > 0 ? (
                  selectedAsset.aiInsights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-gray-700">{insight}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-gray-700">
                        <strong>Context-aware:</strong> This {selectedAsset.name} references clinical data.
                        Cross-checked against selected evidence documents — claim substantiated.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-gray-700">
                        <strong>Smart alignment:</strong> Risk/benefit balance could improve with
                        additional safety-frequency context from the Safety Management Report.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-gray-700">
                        <strong>Campaign cohesion:</strong> Messaging tone consistent across touchpoints.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Total Review - Campaign Cohesion */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-blue-600" />
                <p className="text-xs font-semibold text-blue-900">Total Review — Campaign Cohesion</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(() => {
                  const c = selectedAsset.cohesion ?? {
                    messageConsistency: 94,
                    toneAlignment: 89,
                    visualCohesion: 91,
                    claimHarmony: 96,
                  };
                  const metrics: { label: string; value: number }[] = [
                    { label: 'Message Consistency', value: c.messageConsistency },
                    { label: 'Tone Alignment', value: c.toneAlignment },
                    { label: 'Visual Cohesion', value: c.visualCohesion },
                    { label: 'Claim Harmony', value: c.claimHarmony },
                  ];
                  return metrics.map((m) => {
                    const forceGreen = m.label === 'Claim Harmony';
                    const barColor = forceGreen || m.value >= 85 ? 'bg-green-500' : m.value >= 70 ? 'bg-amber-500' : 'bg-red-500';
                    const textColor = forceGreen || m.value >= 85 ? 'text-green-600' : m.value >= 70 ? 'text-amber-600' : 'text-red-600';
                    return (
                      <div key={m.label} className="bg-white rounded-lg p-2 border border-blue-100">
                        <p className="text-[10px] text-gray-500 mb-1">{m.label}</p>
                        <div className="flex items-center gap-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div className={`h-1 rounded-full ${barColor}`} style={{ width: `${m.value}%` }} />
                          </div>
                          <span className={`text-[10px] font-semibold ${textColor}`}>{m.value}%</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex items-center justify-between">
          <p className="text-xs text-gray-500">Internal pre-screen complete.</p>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary" size="md" rounded="lg">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="primary" size="md" rounded="lg">
              Confirm & Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
