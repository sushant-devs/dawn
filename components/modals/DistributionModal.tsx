'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Tablet, Monitor, Users, Building, Share2, Check } from 'lucide-react';
import { DISTRIBUTION_CHANNELS } from '@/lib/mockData';

interface DistributionModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Mail, Tablet, Monitor, Users, Building, Share2,
};

const VAULT_STEPS = [
  'Packaging assets…',
  'Uploading to Vault…',
  'Metadata tagging…',
  'Rendition generation…',
  'Ready for Distribution',
];

export default function DistributionModal({ onConfirm, onClose }: DistributionModalProps) {
  const [channels, setChannels] = useState(DISTRIBUTION_CHANNELS);
  const [vaultStep, setVaultStep] = useState(-1);

  useEffect(() => {
    // Start vault animation after short delay
    const timer = setTimeout(() => {
      let step = 0;
      const interval = setInterval(() => {
        setVaultStep(step);
        step++;
        if (step >= VAULT_STEPS.length) clearInterval(interval);
      }, 600);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const toggleChannel = (id: string) => {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const enabledCount = channels.filter((c) => c.enabled).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Distribution Hub</h2>
              <p className="text-xs text-gray-400">Stage 7 — Multichannel Distribution</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy cursor-pointer"><X size={20} /></button>
        </div>

        {/* Status header */}
        <div className="px-6 py-3 bg-dawn-green/5 border-b border-dawn-green/20">
          <p className="text-sm font-medium text-dawn-green">
            5 Assets — Passed Status Confirmed. Select distribution channels.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Channel grid */}
          <div className="grid grid-cols-2 gap-3">
            {channels.map((channel) => {
              const Icon = ICON_MAP[channel.icon] ?? Mail;
              return (
                <div
                  key={channel.id}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    channel.enabled ? 'border-dawn-teal/30 bg-dawn-sky' : 'border-dawn-border bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${channel.enabled ? 'bg-dawn-teal/20' : 'bg-gray-200'}`}>
                        <Icon size={16} className={channel.enabled ? 'text-dawn-teal' : 'text-gray-400'} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-dawn-navy">{channel.name}</p>
                        <p className="text-[10px] text-gray-400">{channel.audience}</p>
                      </div>
                    </div>
                    <div
                      onClick={() => toggleChannel(channel.id)}
                      className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${channel.enabled ? 'bg-dawn-teal' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${channel.enabled ? 'left-4' : 'left-0.5'}`} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500">Asset: <span className="text-dawn-navy font-medium">{channel.asset}</span></p>
                    <div className="flex items-center gap-1">
                      <p className="text-[10px] text-gray-500">Delivery:</p>
                      <input
                        type="date"
                        defaultValue={channel.deliveryDate}
                        className="text-[10px] text-dawn-navy bg-transparent border-0 outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Veeva Vault status */}
          <div className="bg-dawn-navy/5 border border-dawn-navy/10 rounded-xl p-4">
            <p className="text-xs font-semibold text-dawn-navy mb-3">Veeva Vault Integration</p>
            <div className="space-y-2">
              {VAULT_STEPS.map((step, i) => {
                const done = vaultStep >= i;
                const active = vaultStep === i;
                return (
                  <div key={step} className={`flex items-center gap-2 transition-all duration-300 ${done ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-dawn-green' : 'bg-gray-300'}`}>
                      {done && <Check size={10} className="text-white" />}
                    </div>
                    <span className={`text-xs ${active ? 'text-dawn-teal font-medium' : done ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step}
                    </span>
                    {active && <div className="w-2 h-2 rounded-full bg-dawn-teal animate-pulse ml-auto" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex items-center justify-between">
          <p className="text-xs text-gray-500">{enabledCount} of {channels.length} channels enabled</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button onClick={onConfirm} className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm cursor-pointer">
              Confirm Distribution →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
