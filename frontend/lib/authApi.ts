export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
};

type AuthPayload = {
  email: string;
  password: string;
  full_name?: string;
};

type AuthResponse = {
  message: string;
  user: UserProfile;
};

export async function login(payload: AuthPayload): Promise<AuthResponse> {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || 'Invalid credentials');
  }

  return data as AuthResponse;
}

export async function register(payload: AuthPayload): Promise<AuthResponse> {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || 'Registration failed');
  }

  return data as AuthResponse;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const stored = localStorage.getItem('dawn_user');
  if (stored) {
    return JSON.parse(stored) as UserProfile;
  }
  throw new Error('No user session found');
}

export async function logout(): Promise<void> {
  localStorage.removeItem('dawn_user');
}
