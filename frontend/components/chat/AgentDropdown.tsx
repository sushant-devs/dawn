'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Sparkles, ShieldCheck, Wand2 } from 'lucide-react';

export type AgentKey = 'generation' | 'mlr_agent' | 'personalization';

interface AgentItem {
  key: AgentKey;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const AGENTS: AgentItem[] = [
  {
    key: 'generation',
    label: 'Generation Agent',
    description: 'Build campaign assets from selected templates',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    key: 'mlr_agent',
    label: 'MLR Agent',
    description: 'Pre-screen generated assets for compliance',
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    key: 'personalization',
    label: 'Personalization Agent',
    description: 'Tailor approved templates for a specific audience',
    icon: <Wand2 className="h-4 w-4" />,
  },
];

interface Props {
  onPick: (key: AgentKey) => void;
  disabled?: boolean;
}

export default function AgentDropdown({ onPick, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative self-start">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
          open
            ? 'border-[#8624FF] bg-[#8624FF] text-white shadow-[0_2px_8px_rgba(134,36,255,0.35)]'
            : 'border-zinc-200 bg-white text-zinc-600 hover:border-[#b47cff] hover:text-[#8624FF]'
        } disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Pick an agent"
      >
        <Plus
          size={16}
          className={`transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 w-72 origin-bottom-left overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_32px_rgba(134,36,255,0.15)] animate-fade-in-up"
          role="menu"
        >
          <div className="border-b border-zinc-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Agents
          </div>
          <ul className="max-h-72 overflow-y-auto p-1.5">
            {AGENTS.map((a) => (
              <li key={a.key}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onPick(a.key);
                  }}
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#f7f1ff] cursor-pointer"
                  role="menuitem"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#8624FF] to-[#a855f7] text-white shadow-[0_0_12px_rgba(134,36,255,0.25)]">
                    {a.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-zinc-900">
                      {a.label}
                    </span>
                    <span className="block text-xs leading-snug text-zinc-500">
                      {a.description}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
