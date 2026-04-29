'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FolderOpen, LayoutGrid, LogOut, Plus, User } from 'lucide-react';
import { logout, type UserProfile } from '@/lib/authApi';

interface WorkspaceSidebarProps {
  activeWorkspace: string;
}

const WORKSPACES_STORAGE_KEY = 'dawn_workspaces';

export default function WorkspaceSidebar({ activeWorkspace }: WorkspaceSidebarProps) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<string[]>([]);
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
    <aside className="hidden h-full w-[276px] shrink-0 border-r border-slate-200/80 bg-slate-100/85 p-4 md:flex md:flex-col">
      <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2">
        <p className="text-[13px] font-semibold tracking-[0.08em] text-dawn-navy/90">WORKSPACES</p>
        <Link
          href="/workspace"
          aria-label="Open workspace page"
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-dawn-sky text-dawn-teal shadow-[0_6px_14px_rgba(46,91,255,0.14)] transition hover:scale-105 hover:bg-white hover:text-dawn-teal"
        >
          <LayoutGrid size={15} />
        </Link>
      </div>

      <Link
        href="/workspace"
        className="mb-3 flex h-11 items-center gap-2 rounded-xl border border-dashed border-dawn-teal/45 bg-white px-3.5 text-sm font-semibold text-dawn-teal transition hover:border-dawn-teal/70 hover:bg-dawn-sky/45"
      >
        <Plus size={15} />
        New Workspace
      </Link>

      <div className="space-y-1.5">
        {workspaces.map((workspace) => {
          const isActive = workspace.toLowerCase() === normalizedActive;
          return (
            <button
              key={workspace}
              type="button"
              onClick={() => router.push(`/chat?workspace=${encodeURIComponent(workspace)}`)}
              className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${isActive
                  ? 'border-dawn-teal/45 bg-dawn-sky/60 text-dawn-navy shadow-[0_8px_18px_rgba(46,91,255,0.12)]'
                  : 'border-transparent bg-transparent text-slate-700 hover:border-slate-200 hover:bg-white/80'
                }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-white text-dawn-teal' : 'bg-slate-200/60 text-slate-500'
                  }`}
              >
                <FolderOpen size={14} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{workspace}</span>
                <span className="block text-xs text-slate-500">0 messages</span>
              </span>
            </button>
          );
        })}
      </div>

      <div ref={profileMenuRef} className="relative mt-auto">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex w-full items-center gap-2 rounded-xl border border-[#7f93ff] bg-gradient-to-r from-[#2f5cff] via-[#4a6eff] to-[#6884ff] p-1.5 shadow-[0_18px_34px_rgba(53,100,255,0.38)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#f3d893] to-[#c9ab66] text-[11px] font-semibold text-white">
            {userInitial}
          </span>
          <span className="min-w-0 text-left leading-tight">
            <span className="block truncate text-[12px] font-semibold uppercase tracking-wide text-white">{safeFullName}</span>
          </span>
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
