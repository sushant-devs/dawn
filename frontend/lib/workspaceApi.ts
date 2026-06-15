export type WorkspaceCreateRequest = {
  name: string;
  description?: string;
};

export type Workspace = {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  message_count: number;
};

export type WorkspaceCreateResponse = {
  message: string;
  workspace: Workspace;
};

export type WorkspaceListResponse = {
  workspaces: Workspace[];
  total: number;
};

const STORAGE_KEY = 'dawn_workspaces';

function loadWorkspaces(): Workspace[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Workspace[];
  } catch {
    return [];
  }
}

function saveWorkspaces(workspaces: Workspace[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
}

function getUserId(): string {
  try {
    const stored = localStorage.getItem('dawn_user');
    if (stored) {
      const user = JSON.parse(stored);
      return user.id ?? 'anonymous';
    }
  } catch {}
  return 'anonymous';
}

export async function createWorkspace(payload: WorkspaceCreateRequest): Promise<WorkspaceCreateResponse> {
  const workspaces = loadWorkspaces();
  const now = new Date().toISOString();
  const workspace: Workspace = {
    id: `ws_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: payload.name,
    description: payload.description,
    user_id: getUserId(),
    created_at: now,
    updated_at: now,
    message_count: 0,
  };

  workspaces.unshift(workspace);
  saveWorkspaces(workspaces);

  return { message: 'Workspace created', workspace };
}

export async function getWorkspaces(): Promise<WorkspaceListResponse> {
  const userId = getUserId();
  const workspaces = loadWorkspaces().filter(w => w.user_id === userId);
  return { workspaces, total: workspaces.length };
}

export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  const workspaces = loadWorkspaces();
  const workspace = workspaces.find(w => w.id === workspaceId);
  if (!workspace) {
    throw new Error('Workspace not found');
  }
  return workspace;
}
