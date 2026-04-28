const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

type AuthPayload = {
  email: string;
  password: string;
  full_name?: string;
};

async function callAuth(path: string, payload: AuthPayload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
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

export async function login(payload: AuthPayload) {
  return callAuth("/auth/login", payload);
}

export async function register(payload: AuthPayload) {
  return callAuth("/auth/register", payload);
}
