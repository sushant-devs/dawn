const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

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

async function callWorkspaceApi(path: string, method: string = "GET", payload?: any) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...(payload && { body: JSON.stringify(payload) }),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export async function createWorkspace(payload: WorkspaceCreateRequest): Promise<WorkspaceCreateResponse> {
  return callWorkspaceApi("/workspaces/", "POST", payload);
}

export async function getWorkspaces(): Promise<WorkspaceListResponse> {
  return callWorkspaceApi("/workspaces/");
}

export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  return callWorkspaceApi(`/workspaces/${workspaceId}`);
}