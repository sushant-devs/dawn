'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, FolderOpen, MessageSquare, Plus, Sparkles } from 'lucide-react';
import { Pie, PieChart } from 'recharts';
import { getCurrentUser, logout, type UserProfile } from '@/lib/authApi';
import { createWorkspace, getWorkspaces, type Workspace } from '@/lib/workspaceApi';
import Navbar from '@/components/Navbar';
import CreateWorkspaceModal from '@/components/workspace/CreateWorkspaceModal';

export default function WorkspacePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceError, setWorkspaceError] = useState('');
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>([]);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoadingWorkspaces(true);
      try {
        const response = await getWorkspaces();
        setWorkspaceList(response.workspaces);
      } catch (error) {
        console.error('Failed to fetch workspaces:', error);
      } finally {
        setIsLoadingWorkspaces(false);
      }
    };

    void fetchWorkspaces();
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
  const selectedDrugChartData = useMemo(
    () => selectedDrugContent.map((segment) => ({ ...segment, fill: segment.stroke })),
    [selectedDrugContent]
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

  const handleCreateWorkspace = async () => {
    const trimmedName = workspaceName.trim();
    if (!trimmedName) {
      setWorkspaceError('Workspace name is required');
      return;
    }

    setIsCreatingWorkspace(true);
    setWorkspaceError('');

    try {
      const response = await createWorkspace({ name: trimmedName });
      
      // Update the workspace list with the new workspace
      setWorkspaceList(prev => [response.workspace, ...prev]);
      
      setIsCreateModalOpen(false);
      setWorkspaceName('');
      
      // Redirect to chat with the new workspace
      router.push(`/chat?workspace=${encodeURIComponent(trimmedName)}`);
    } catch (error: any) {
      setWorkspaceError(error.message || 'Failed to create workspace');
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-teal-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-purple-100/20 to-pink-100/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-dawn-teal/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="shrink-0">
          <Navbar
            userInitial={userInitial}
            safeFullName={safeFullName}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />
        </div>

        <div className="min-h-0 flex-1 px-6 py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Enhanced Welcome Section */}
            <div className="relative">
              {/* Floating particles animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-dawn-teal/30 rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce delay-700"></div>
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce delay-1000"></div>
              </div>

              <div className="text-center my-6">
                

                <h1 className="font-display text-3xl md:text-4xl bg-gradient-to-r from-dawn-navy via-dawn-teal to-blue-600 bg-clip-text text-transparent mb-3 font-bold leading-tight">
                  Hi {firstName}, how can I help you today?
                </h1>
                <p className="text-slate-600 text-base font-medium mb-1">
                  DAWN — Your AI-powered content lifecycle agent
                </p>
                <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
                  Manage your workspaces and streamline your workflow with AI assistance
                </p>
              </div>
            </div>
            {/* Analytics Section */}
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <article className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/90 backdrop-blur-xl p-3 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
                <div className="relative flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 mb-1">Active Workspace Drug Mix</p>
                    <h2 className="text-lg font-semibold text-dawn-navy">Projects by drug name</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25">
                    <FolderOpen size={18} />
                  </div>
                </div>

                <div className="relative space-y-2">
                  {workspaceDistribution.map((item, index) => (
                    <div
                      key={item.drug}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-gradient-to-r from-white/80 to-slate-50/50 backdrop-blur-sm px-3 py-2 transition-all duration-300 hover:border-indigo-300/60 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex min-w-0 items-center gap-2.5">
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-md">
                            {item.rank}
                          </span>
                          <div>
                            <p className="truncate text-sm font-semibold text-slate-800">{item.drug}</p>
                            <p className="text-xs text-slate-500">{item.trend} vs last month</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {item.projects} projects
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/90 backdrop-blur-xl p-3 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
                <div className="relative flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 mb-1">Profile Content Signature</p>
                    <h2 className="text-lg font-semibold text-dawn-navy">Drug content type distribution</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
                    <Sparkles size={18} />
                  </div>
                </div>

                <div className="space-y-2">
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

                  <div className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-100 bg-white p-2 sm:grid-cols-[1fr_1fr] sm:items-center">
                    <div className="relative mx-auto h-[144px] w-[144px]">
                      <PieChart width={144} height={144}>
                        <Pie
                          data={selectedDrugChartData}
                          dataKey="share"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          innerRadius={44}
                          outerRadius={64}
                          strokeWidth={0}
                          paddingAngle={1}
                        />
                      </PieChart>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                        <p className="max-w-[70px] text-[10px] font-semibold leading-tight text-dawn-navy">{selectedDrug}</p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-xl bg-slate-50/70 p-3">
                      {selectedDrugContent.map((item) => (
                        <div key={item.type} className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-white">
                          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                            <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
                            <span className="font-medium text-slate-600">{item.type}</span>
                          </span>
                          <span className="text-sm font-semibold tracking-tight text-slate-800">{item.share}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </section>

            {/* Workspace Section */}
            <section className="relative">
              <div className="flex items-center justify-between mb-4 p-4 rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-md shadow-slate-900/5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-dawn-navy">Your Workspaces</h2>
                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <FolderOpen size={12} />
                      {isLoadingWorkspaces ? 'Loading...' : `${workspaceList.length}`}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Click any workspace to start chatting with AI agent.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceError('');
                    setIsCreateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-dawn-teal to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-dawn-teal/30 transition-all duration-200 hover:shadow-lg hover:shadow-dawn-teal/40 hover:-translate-y-0.5"
                >
                  <Plus size={16} />
                  New Workspace
                </button>
              </div>

              <div className="relative">
                {workspaceList.length === 0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-dawn-teal/30 bg-gradient-to-br from-white/80 to-dawn-sky/20 backdrop-blur-xl p-12 text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-dawn-teal/20 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-dawn-teal to-blue-500 text-white shadow-lg">
                        <Activity size={24} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No workspaces yet</h3>
                    <p className="text-slate-500 text-sm max-w-sm">Create your first workspace to start collaborating with the AI agent and manage your projects.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {workspaceList.map((workspace, index) => (
                      <Link
                        key={workspace.id}
                        href={`/chat?workspace=${encodeURIComponent(workspace.name)}`}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/90 backdrop-blur-xl p-4 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/15 hover:-translate-y-1 hover:border-dawn-teal/40"
                      >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-dawn-teal/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className="relative">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-teal to-blue-500 text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                                <FolderOpen size={16} />
                              </div>
                              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                            </div>
                            <div className="rounded-lg bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              Active
                            </div>
                          </div>

                          <div className="mb-3">
                            <h3 className="text-base font-bold text-dawn-navy mb-1 group-hover:text-dawn-teal transition-colors duration-300 line-clamp-1">{workspace.name}</h3>
                            <div className="inline-flex rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                              Environment
                            </div>
                          </div>

                          {workspace.description ? (
                            <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">{workspace.description}</p>
                          ) : (
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                              AI workspace for content creation and workflow management.
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <MessageSquare size={12} />
                              <span className="font-medium">{workspace.message_count}</span>
                            </div>
                            <span className="text-xs text-slate-400">
                              {new Date(workspace.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {isCreateModalOpen ? (
        <CreateWorkspaceModal
          workspaceName={workspaceName}
          workspaceError={workspaceError}
          isCreatingWorkspace={isCreatingWorkspace}
          onWorkspaceNameChange={setWorkspaceName}
          onClearWorkspaceError={() => setWorkspaceError('')}
          onClose={() => {
            setIsCreateModalOpen(false);
            setWorkspaceName('');
            setWorkspaceError('');
          }}
          onCreateWorkspace={handleCreateWorkspace}
        />
      ) : null}
    </main>
  );
}
