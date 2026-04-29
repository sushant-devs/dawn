'use client';

import { useEffect, useRef, useState } from 'react';
import { LogOut, User } from 'lucide-react';

interface NavbarProps {
  userInitial: string;
  safeFullName: string;
  isLoggingOut: boolean;
  onLogout: () => void;
}

export default function Navbar({ userInitial, safeFullName, isLoggingOut, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <header
      className="glass-navbar relative z-[80] !overflow-visible flex items-center justify-between px-5 py-1"
      style={{ overflow: 'visible' }}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy to-[#203463]">
          <span className="font-serif text-sm font-bold text-white">D</span>
        </div>
        <span className="font-display text-xl text-dawn-navy">DAWN</span>
      </div>

      <div ref={profileMenuRef} className="relative z-[90]">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex items-center rounded-full border border-white/60 bg-white/70 p-1 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition hover:bg-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-500 text-xs font-semibold text-white ring-2 ring-white/70">
            {userInitial}
          </span>
        </button>

        {isMenuOpen && (
          <div className="absolute top-full z-[100] mt-2 w-40 -translate-x-1/2 overflow-hidden rounded-xl border border-white/70 bg-white/95 shadow-[0_20px_40px_rgba(15,23,42,0.14)] backdrop-blur-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5">
              <User size={15} className="text-dawn-teal" />
              <p className="truncate text-sm font-medium text-slate-700">{safeFullName}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut size={15} />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
