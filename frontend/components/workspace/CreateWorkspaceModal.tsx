'use client';

import { Plus } from 'lucide-react';

type CreateWorkspaceModalProps = {
  workspaceName: string;
  workspaceError: string;
  isCreatingWorkspace: boolean;
  onWorkspaceNameChange: (value: string) => void;
  onClearWorkspaceError: () => void;
  onClose: () => void;
  onCreateWorkspace: () => void;
};

export default function CreateWorkspaceModal({
  workspaceName,
  workspaceError,
  isCreatingWorkspace,
  onWorkspaceNameChange,
  onClearWorkspaceError,
  onClose,
  onCreateWorkspace,
}: CreateWorkspaceModalProps) {
  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/50 bg-white/95 p-8 shadow-2xl shadow-slate-900/25 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-dawn-teal to-blue-500 text-white shadow-lg">
            <Plus size={24} />
          </div>
          <h3 className="bg-linear-to-r from-dawn-navy to-dawn-teal bg-clip-text text-2xl font-bold text-transparent">
            Create Workspace
          </h3>
          <p className="mt-2 text-sm text-slate-500">Set up your AI-powered workspace environment</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="workspaceName" className="mb-2 block text-sm font-semibold text-slate-700">
              Workspace Name
            </label>
            <div className="relative">
              <input
                id="workspaceName"
                type="text"
                value={workspaceName}
                onChange={(event) => {
                  onWorkspaceNameChange(event.target.value);
                  if (workspaceError) onClearWorkspaceError();
                }}
                placeholder="Enter workspace name"
                className="h-12 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-dawn-teal/60 focus:bg-white focus:ring-4 focus:ring-dawn-teal/10 backdrop-blur-sm"
              />
            </div>
            {workspaceError ? (
              <p className="mt-2 flex items-center gap-1 text-xs text-rose-600">
                <span className="h-1 w-1 rounded-full bg-rose-500"></span>
                {workspaceError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300/80 hover:bg-white backdrop-blur-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onCreateWorkspace}
            disabled={isCreatingWorkspace}
            className="h-12 flex-1 rounded-2xl bg-linear-to-r from-dawn-teal to-blue-500 px-4 text-sm font-bold text-white shadow-lg shadow-dawn-teal/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-dawn-teal/40 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50"
          >
            {isCreatingWorkspace ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                Creating...
              </span>
            ) : (
              'Create Workspace'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
