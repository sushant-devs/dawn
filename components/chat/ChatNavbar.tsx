'use client';

import { Bell, FileText } from 'lucide-react';

interface ChatNavbarProps {
  hasNotifications: boolean;
  onShowPLSModal: () => void;
  onShowNotifications: () => void;
}

export default function ChatNavbar({
  hasNotifications,
  onShowPLSModal,
  onShowNotifications,
}: ChatNavbarProps) {
  return (
    <header className="shrink-0 px-4 py-2 md:px-5">
      <div className="glass-navbar mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy to-[#203463] shadow-[0_10px_18px_rgba(13,27,62,0.32)]">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <span className="font-serif text-lg text-dawn-navy">AI</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy to-[#203463] shadow-[0_10px_18px_rgba(13,27,62,0.32)]">
              <span className="font-serif text-sm font-bold text-white">D</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-dawn-navy">DAWN</p>
              {/* <p className="text-[11px] text-cyan-100/90">Content Lifecycle Workspace</p> */}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onShowPLSModal}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/50 bg-white/55 text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/75 hover:text-dawn-navy"
            title="Generate PLS"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => hasNotifications && onShowNotifications()}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border bg-white/55 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition-all duration-200 ${
              hasNotifications
                ? 'border-dawn-teal/45 text-dawn-teal hover:-translate-y-0.5 hover:bg-white/75'
                : 'border-white/50 text-slate-500 hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/75 hover:text-dawn-navy'
            }`}
            disabled={!hasNotifications}
            title="Notifications"
          >
            <Bell size={16} />
            {hasNotifications && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-rose-500" />
            )}
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-500 shadow-[0_10px_22px_rgba(236,72,153,0.35)] ring-2 ring-white/70">
            <span className="text-xs font-semibold text-white">U</span>
          </div>
        </div>
      </div>
    </header>
  );
}
