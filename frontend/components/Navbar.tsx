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
      className="relative z-[80] !overflow-visible flex items-center justify-between px-6 py-3 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-sm"
      style={{ overflow: 'visible' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy via-dawn-teal to-blue-600 shadow-lg shadow-dawn-navy/25">
          <span className="font-serif text-sm font-bold text-white">D</span>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-xl font-bold bg-gradient-to-r from-dawn-navy via-dawn-teal to-blue-600 bg-clip-text text-transparent">DAWN</span>
          <span className="text-xs font-medium text-slate-500 -mt-1">AI Agent Platform</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Agent Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200/50 rounded-full">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <span className="text-xs font-medium text-green-700">Agent Online</span>
        </div>

        <div ref={profileMenuRef} className="relative z-[90]">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-2 shadow-lg shadow-slate-900/5 transition-all duration-200 hover:border-slate-300/60 hover:bg-white hover:shadow-xl hover:shadow-slate-900/10"
          >
            <div className="relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy via-dawn-teal to-blue-600 text-xs font-bold text-white shadow-md">
                {userInitial}
              </span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <span className="min-w-0 text-left">
              <div className="block truncate text-sm font-semibold text-slate-800">{safeFullName}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                Online
              </div>
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute top-full right-0 z-[100] mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/95 shadow-2xl shadow-slate-900/20 backdrop-blur-xl">
              <div className="bg-gradient-to-br from-dawn-navy/5 to-dawn-teal/5 px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy via-dawn-teal to-blue-600 text-sm font-bold text-white shadow-md">
                      {userInitial}
                    </span>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="truncate text-sm font-semibold text-slate-800">{safeFullName}</p>
                    <p className="text-xs text-slate-500">Active Agent Session</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-rose-600 transition-all duration-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <LogOut size={16} />
                <span className="font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
