'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, FolderOpen, LogOut, Plus, User } from 'lucide-react';
import { logout, type UserProfile } from '@/lib/authApi';

interface WorkspaceSidebarProps {
  activeWorkspace: string;
}

const WORKSPACES_STORAGE_KEY = 'dawn_workspaces';

export default function WorkspaceSidebar({ activeWorkspace }: WorkspaceSidebarProps) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState('User');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as string[]) : [];
    const unique = Array.from(new Set(stored));
    if (activeWorkspace) {
      const hasActive = unique.some((item) => item.toLowerCase() === activeWorkspace.toLowerCase());
      if (!hasActive) unique.unshift(activeWorkspace);
    }
    setWorkspaces(unique);
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(unique));
  }, [activeWorkspace]);

  const normalizedActive = useMemo(() => activeWorkspace.trim().toLowerCase(), [activeWorkspace]);
  const userInitial = useMemo(() => userName.trim().charAt(0).toUpperCase() || 'U', [userName]);
  const safeFullName = useMemo(() => userName.trim() || 'User', [userName]);

  useEffect(() => {
    const stored = localStorage.getItem('dawn_user');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as UserProfile;
      if (parsed.full_name?.trim()) {
        setUserName(parsed.full_name.trim());
      }
    } catch {
      setUserName('User');
    }
  }, []);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // proceed local cleanup when API fails
    } finally {
      localStorage.removeItem('dawn_user');
      router.push('/login');
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={`hidden h-full shrink-0 border-r border-slate-200/80 bg-slate-100/85 p-3 transition-all duration-300 md:flex md:flex-col ${isCollapsed ? 'w-[92px]' : 'w-[286px]'
        }`}
    >
      <div className="mb-3 flex items-center justify-between rounded-xl  px-1 py-1">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-dawn-navy to-[#203463] text-xs font-semibold text-white shadow-[0_6px_12px_rgba(32,52,99,0.25)]">
          D
        </span>
        <button
          type="button"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-dawn-teal/30 hover:text-dawn-teal"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <Link
        href="#"
        className={`mb-2.5 flex h-10 items-center rounded-xl bg-dawn-teal text-sm font-semibold text-white shadow-[0_10px_18px_rgba(46,91,255,0.28)] transition hover:-translate-y-0.5 hover:bg-[#2d73f6] ${isCollapsed ? 'justify-center px-0' : 'gap-2 px-3'
          }`}
      >
        <Plus size={15} />
        {!isCollapsed ? 'New Chat' : null}
      </Link>

      {!isCollapsed ? <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Recents</p> : null}

      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {workspaces.map((workspace) => {
          const isActive = workspace.toLowerCase() === normalizedActive;
          return (
            <button
              key={workspace}
              type="button"
              onClick={() => router.push(`/chat?workspace=${encodeURIComponent(workspace)}`)}
              className={`flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition ${isActive
                ? 'border-dawn-teal/35 bg-dawn-sky/55 text-dawn-navy'
                : 'border-transparent bg-transparent text-slate-700 hover:border-slate-200 hover:bg-white/85'
                }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-white text-dawn-teal' : 'bg-slate-200/70 text-slate-500'
                  }`}
              >
                <FolderOpen size={13} />
              </span>
              {!isCollapsed ? (
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{workspace}</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div ref={profileMenuRef} className="relative mt-3 border-t border-slate-200/80 pt-3">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`inline-flex w-full items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:border-slate-300 hover:bg-white ${isCollapsed ? 'justify-center' : 'gap-2'
            }`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#2f5cff] to-[#4b6fff] text-[11px] font-semibold text-white">
            {userInitial}
          </span>
          {!isCollapsed ? (
            <span className="min-w-0 text-left leading-tight">
              <span className="block truncate text-[12px] font-semibold uppercase tracking-wide text-slate-800">{safeFullName}</span>
            </span>
          ) : null}
        </button>

        {isMenuOpen && (
          <div className="absolute bottom-full left-1/2 z-[100] mb-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-white/70 bg-white/95 shadow-[0_20px_40px_rgba(15,23,42,0.14)] backdrop-blur-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5">
              <User size={15} className="text-dawn-teal" />
              <p className="truncate text-sm font-medium text-slate-700">{safeFullName}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut size={15} />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
