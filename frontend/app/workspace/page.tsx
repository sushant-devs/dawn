'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, FolderOpen, LogOut, MessageSquare, Plus, Sparkles, Type, User } from 'lucide-react';
import { getCurrentUser, logout, type UserProfile } from '@/lib/authApi';

const WORKSPACES_STORAGE_KEY = 'dawn_workspaces';

export default function WorkspacePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceError, setWorkspaceError] = useState('');
  const [workspaceList, setWorkspaceList] = useState<string[]>([]);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as string[]) : [];
    const unique = Array.from(new Set(stored));
    setWorkspaceList(unique);
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(unique));
  }, []);

  useEffect(() => {
    const syncUser = async () => {
      try {
        const stored = localStorage.getItem('dawn_user');
        if (stored) {
          const parsed = JSON.parse(stored) as UserProfile;
          if (parsed.full_name?.trim()) {
            setUserName(parsed.full_name.trim());
            return;
          }
        }

        const currentUser = await getCurrentUser();
        if (currentUser.full_name?.trim()) {
          setUserName(currentUser.full_name.trim());
          localStorage.setItem('dawn_user', JSON.stringify(currentUser));
        }
      } catch {
        setUserName('User');
      }
    };

    void syncUser();
  }, []);

  const userInitial = useMemo(() => userName.trim().charAt(0).toUpperCase() || 'U', [userName]);
  const firstName = useMemo(() => userName.trim().split(/\s+/)[0] || 'there', [userName]);
  const safeFullName = useMemo(() => userName.trim() || 'User', [userName]);
  const stats = useMemo(
    () => [
      { label: 'Workspaces', value: String(workspaceList.length), subLabel: 'active projects' },
      { label: 'Total Chats', value: '0', subLabel: 'conversations' },
      { label: 'Generated', value: '0', subLabel: 'content pieces' },
      { label: 'Words', value: '0', subLabel: 'words created' },
    ],
    [workspaceList.length]
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // Proceed with local cleanup even if API call fails.
    } finally {
      localStorage.removeItem('dawn_user');
      router.push('/login');
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const handleCreateWorkspace = () => {
    const trimmedName = workspaceName.trim();
    if (!trimmedName) {
      setWorkspaceError('Workspace name is required');
      return;
    }

    const existingRaw = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    const existing = existingRaw ? (JSON.parse(existingRaw) as string[]) : [];
    const hasWorkspace = existing.some((item) => item.toLowerCase() === trimmedName.toLowerCase());
    const nextWorkspaces = hasWorkspace ? existing : [trimmedName, ...existing];
    setWorkspaceList(nextWorkspaces);
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(nextWorkspaces));

    setWorkspaceError('');
    setIsCreateModalOpen(false);
    setWorkspaceName('');
    router.push(`/chat?workspace=${encodeURIComponent(trimmedName)}`);
  };

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
    <main className="h-screen overflow-hidden px-4 py-3 md:px-6 md:py-7">
      <div className="mx-auto flex h-full w-full  flex-col gap-6">
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
              <div className="absolute left-1/2 top-full z-[100] mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-white/70 bg-white/95 shadow-[0_20px_40px_rgba(15,23,42,0.14)] backdrop-blur-sm">
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
        </header>

        <section className="rounded-2xl border border-white/70 bg-white/60 px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.07)] backdrop-blur-sm">
          <h1 className="font-display text-3xl text-dawn-navy md:text-4xl">Hi {firstName}, how can I help you today?</h1>
          <p className="mt-1 text-sm text-slate-500">DAWN — Your AI-powered content lifecycle agent</p>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-dawn-sky text-dawn-teal">
                  {index === 0 ? <FolderOpen size={14} /> : null}
                  {index === 1 ? <MessageSquare size={14} /> : null}
                  {index === 2 ? <Sparkles size={14} /> : null}
                  {index === 3 ? <Type size={14} /> : null}
                </span>
              </div>
              <p className="mt-2 text-3xl font-bold leading-none text-dawn-navy">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{stat.subLabel}</p>
            </article>
          ))}
        </section>

        <section className="flex items-center justify-between rounded-xl border border-white/60 bg-white/35 px-4 py-3 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-semibold text-dawn-navy">Your Workspaces</h2>
            <p className="text-sm text-slate-500">Click any workspace to start chatting with AI.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setWorkspaceError('');
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-dawn-teal px-4 py-2 text-sm font-medium text-white shadow-[0_12px_24px_rgba(46,91,255,0.35)] transition hover:-translate-y-0.5"
          >
            <Plus size={16} />
            New Workspace
          </button>
        </section>

        <section className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/60 bg-white/25 p-3 backdrop-blur-[1px]">
          {workspaceList.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dawn-teal/20 border-dashed bg-white/45 px-4 text-center sm:min-h-[260px] lg:min-h-[290px]">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-dawn-sky text-dawn-teal">
                <Activity size={18} />
              </span>
              <p className="text-sm font-semibold text-slate-700">No workspace created</p>
              <p className="mt-1 text-xs text-slate-500">Create your first workspace to begin collaborating.</p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {workspaceList.map((workspace) => (
              <Link
                key={workspace}
                href={`/chat?workspace=${encodeURIComponent(workspace)}`}
                className="group rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-dawn-teal/30 hover:shadow-[0_20px_38px_rgba(15,23,42,0.11)]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dawn-sky text-dawn-teal">
                    <FolderOpen size={18} />
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                    Active
                  </span>
                </div>

                <h3 className="text-base font-semibold text-dawn-navy">{workspace}</h3>
                <p className="mt-1 inline-flex rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  Workspace
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  Manage campaigns, drafts, and approvals for this workspace.
                </p>

                <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare size={13} />
                    0 messages
                  </span>
                  <span>Today</span>
                </div>
              </Link>
            ))}

           
          </div>
        </section>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/35 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white p-6 shadow-[0_30px_70px_rgba(15,23,42,0.25)]">
            <h3 className="text-xl font-semibold text-dawn-navy">Create Workspace</h3>
            <p className="mt-1 text-sm text-slate-500">Add a workspace name to continue.</p>

            <div className="mt-5">
              <label htmlFor="workspaceName" className="mb-2 block text-sm font-medium text-slate-700">
                Workspace Name
              </label>
              <input
                id="workspaceName"
                type="text"
                value={workspaceName}
                onChange={(event) => {
                  setWorkspaceName(event.target.value);
                  if (workspaceError) setWorkspaceError('');
                }}
                placeholder="Enter workspace name"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-dawn-teal/60 focus:ring-2 focus:ring-dawn-teal/20"
              />
              {workspaceError ? <p className="mt-2 text-xs text-rose-600">{workspaceError}</p> : null}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setWorkspaceName('');
                  setWorkspaceError('');
                }}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateWorkspace}
                className="h-11 rounded-xl bg-dawn-teal px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(46,91,255,0.35)] transition hover:-translate-y-0.5"
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
