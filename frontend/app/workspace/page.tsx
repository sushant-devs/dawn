'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, FolderOpen, MessageSquare, Plus, Sparkles } from 'lucide-react';
import { getCurrentUser, logout, type UserProfile } from '@/lib/authApi';
import Navbar from '@/components/Navbar';

const WORKSPACES_STORAGE_KEY = 'dawn_workspaces';

export default function WorkspacePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceError, setWorkspaceError] = useState('');
  const [workspaceList, setWorkspaceList] = useState<string[]>([]);

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
  const workspaceDistribution = useMemo(() => {
    const dummyWorkspaceData = [
      { drug: 'Semaglutide', projects: 6, trend: '+12%' },
      { drug: 'Atorvastatin', projects: 4, trend: '+6%' },
      { drug: 'Metformin', projects: 3, trend: '+4%' },
      { drug: 'Losartan', projects: 2, trend: '+2%' },
    ];
    return dummyWorkspaceData.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, []);

  const drugContentDistribution = useMemo(() => {
    const dummyDistributionByDrug = [
      {
        drug: 'Semaglutide',
        distribution: [
          { type: 'Email Campaigns', share: 38, tone: 'bg-indigo-500', stroke: '#6366f1' },
          { type: 'Doctor Leave-behinds', share: 26, tone: 'bg-cyan-500', stroke: '#06b6d4' },
          { type: 'Patient Education', share: 20, tone: 'bg-emerald-500', stroke: '#10b981' },
          { type: 'Social Creatives', share: 16, tone: 'bg-fuchsia-500', stroke: '#d946ef' },
        ],
      },
      {
        drug: 'Atorvastatin',
        distribution: [
          { type: 'Email Campaigns', share: 24, tone: 'bg-indigo-500', stroke: '#6366f1' },
          { type: 'Doctor Leave-behinds', share: 33, tone: 'bg-cyan-500', stroke: '#06b6d4' },
          { type: 'Patient Education', share: 27, tone: 'bg-emerald-500', stroke: '#10b981' },
          { type: 'Social Creatives', share: 16, tone: 'bg-fuchsia-500', stroke: '#d946ef' },
        ],
      },
      {
        drug: 'Metformin',
        distribution: [
          { type: 'Email Campaigns', share: 20, tone: 'bg-indigo-500', stroke: '#6366f1' },
          { type: 'Doctor Leave-behinds', share: 24, tone: 'bg-cyan-500', stroke: '#06b6d4' },
          { type: 'Patient Education', share: 36, tone: 'bg-emerald-500', stroke: '#10b981' },
          { type: 'Social Creatives', share: 20, tone: 'bg-fuchsia-500', stroke: '#d946ef' },
        ],
      },
      {
        drug: 'Losartan',
        distribution: [
          { type: 'Email Campaigns', share: 18, tone: 'bg-indigo-500', stroke: '#6366f1' },
          { type: 'Doctor Leave-behinds', share: 31, tone: 'bg-cyan-500', stroke: '#06b6d4' },
          { type: 'Patient Education', share: 29, tone: 'bg-emerald-500', stroke: '#10b981' },
          { type: 'Social Creatives', share: 22, tone: 'bg-fuchsia-500', stroke: '#d946ef' },
        ],
      },
    ];
    return dummyDistributionByDrug;
  }, []);
  const [selectedDrug, setSelectedDrug] = useState('Semaglutide');
  const selectedDrugContent = useMemo(
    () =>
      drugContentDistribution.find((item) => item.drug === selectedDrug)?.distribution ??
      drugContentDistribution[0]?.distribution ??
      [],
    [drugContentDistribution, selectedDrug]
  );
  const selectedDrugDonut = useMemo(() => {
    const total = selectedDrugContent.reduce((sum, item) => sum + item.share, 0) || 1;
    let cumulative = 0;
    return selectedDrugContent.map((item) => {
      const percent = (item.share / total) * 100;
      const dashArray = `${percent} ${100 - percent}`;
      const dashOffset = -cumulative;
      cumulative += percent;
      return { ...item, dashArray, dashOffset };
    });
  }, [selectedDrugContent]);

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

  return (
    <main className="h-screen overflow-hidden px-4 py-3 md:px-6 md:py-7">
      <div className="mx-auto flex h-full w-full flex-col">
        <div className="shrink-0 pb-6">
          <Navbar
            userInitial={userInitial}
            safeFullName={safeFullName}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />
        </div>

        <div
          className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >

          <div className="rounded-2xl border border-white/70 bg-white/60 px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.07)] backdrop-blur-sm xl:col-span-2">
            <h1 className="font-display text-3xl text-dawn-navy md:text-4xl">Hi {firstName}, how can I help you today?</h1>
            <p className="mt-1 text-sm text-slate-500">DAWN — Your AI-powered content lifecycle agent</p>
          </div>
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <article className="rounded-3xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_18px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Active Workspace Drug Mix</p>
                  <h2 className="mt-1 text-xl font-semibold text-dawn-navy">Projects by drug name</h2>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-500">
                  <FolderOpen size={15} />
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {workspaceDistribution.map((item) => (
                  <div
                    key={item.drug}
                    className="rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50/70 px-3 py-2.5 transition hover:border-indigo-100 hover:shadow-[0_8px_18px_rgba(99,102,241,0.08)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex min-w-0 items-center gap-2.5">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-xs font-semibold text-indigo-700">
                          {item.rank}
                        </span>
                        <p className="truncate text-sm font-medium text-slate-700">{item.drug}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{item.projects} active projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_18px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Profile Content Signature</p>
                  <h2 className="mt-1 text-xl font-semibold text-dawn-navy">Drug content type distribution</h2>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-500">
                  <Sparkles size={15} />
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                <div className="flex flex-wrap gap-2 rounded-xl bg-slate-50/80 p-1.5">
                  {drugContentDistribution.map((item) => (
                    <button
                      key={item.drug}
                      type="button"
                      onClick={() => setSelectedDrug(item.drug)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${selectedDrug === item.drug
                        ? 'border-indigo-200 bg-white text-indigo-600 shadow-[0_6px_14px_rgba(99,102,241,0.14)]'
                        : 'border-transparent bg-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-700'
                        }`}
                    >
                      {item.drug}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-white p-3 sm:grid-cols-[1.25fr_0.75fr] sm:items-center">
                  <div className="relative mx-auto h-[210px] w-[210px]">
                    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                      <circle cx="18" cy="18" r="13" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                      {selectedDrugDonut.map((segment) => (
                        <circle
                          key={segment.type}
                          cx="18"
                          cy="18"
                          r="13"
                          fill="none"
                          stroke={segment.stroke}
                          strokeWidth="5"
                          strokeDasharray={segment.dashArray}
                          strokeDashoffset={segment.dashOffset}
                          pathLength={100}
                        />
                      ))}
                    </svg>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                      <p className="max-w-[84px] text-[11px] font-semibold leading-tight text-dawn-navy">{selectedDrug}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {selectedDrugContent.map((item) => (
                      <div key={item.type} className="rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50/70 px-2.5 py-2">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                            <span className={`h-2 w-2 rounded-full ${item.tone}`} />
                            {item.type}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{item.share}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section className="flex items-center justify-between rounded-xl border border-white/60 bg-white/35 px-4 py-3 backdrop-blur-sm">
            <div className='flex items-center justify-between'>
              <div>
                <h2 className="text-xl font-semibold text-dawn-navy">Your Workspaces  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700">
                  <FolderOpen size={14} />
                  {workspaceList.length} workspaces
                </span></h2>
                <p className="text-sm text-slate-500">Click any workspace to start chatting with AI.</p>
              </div>
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

          <section className="max-h-[52vh] overflow-y-auto rounded-2xl border border-white/60 bg-white/25 p-3 backdrop-blur-[1px]">
            {workspaceList.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dawn-teal/20 border-dashed bg-white/45 px-4 text-center sm:min-h-[260px] lg:min-h-[290px]">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-dawn-sky text-dawn-teal">
                  <Activity size={18} />
                </span>
                <p className="text-sm font-semibold text-slate-700">No workspace created</p>
                <p className="mt-1 text-xs text-slate-500">Create your first workspace to begin collaborating.</p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
