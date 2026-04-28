'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FolderOpen, LayoutGrid, Plus } from 'lucide-react';

interface WorkspaceSidebarProps {
  activeWorkspace: string;
}

const WORKSPACES_STORAGE_KEY = 'dawn_workspaces';

export default function WorkspaceSidebar({ activeWorkspace }: WorkspaceSidebarProps) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<string[]>([]);

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

  return (
    <aside className="hidden h-full w-[276px] shrink-0 border-r border-slate-200/80 bg-slate-100/85 p-4 md:flex md:flex-col">
      <p className=' mb-4 px-1 text-[15px] font-semibold text-dawn-navy'>WORKSPACES</p>

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

      <Link
        href="/workspace"
        className="mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-3.5 text-center text-sm font-medium text-white transition cursor-pointer border border-dawn-teal/30 bg-gradient-to-br from-dawn-teal to-[#5a49dd] shadow-[0_8px_18px_rgba(111,92,255,0.35)] hover:scale-105 hover:shadow-[0_12px_22px_rgba(111,92,255,0.42)]"
      >
        <LayoutGrid size={15} />
        Workspace
      </Link>

    </aside>
  );
}
