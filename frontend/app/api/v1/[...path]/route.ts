import { NextRequest, NextResponse } from 'next/server';

type UserEntry = {
  email: string;
  password: string;
  full_name: string;
  id: string;
};

function getUsers(): UserEntry[] {
  const raw = process.env.DAWN_USERS ?? '[]';
  try {
    return JSON.parse(raw) as UserEntry[];
  } catch {
    return [];
  }
}

async function handleRequest(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const route = path.join('/');

  if (route === 'auth/login' && request.method === 'POST') {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ detail: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, full_name: user.full_name },
    });
  }

  if (route === 'auth/register' && request.method === 'POST') {
    return NextResponse.json({
      detail: 'Registration is disabled. Please use pre-configured credentials.',
    }, { status: 403 });
  }

  if (route === 'auth/me' && request.method === 'GET') {
    return NextResponse.json({ detail: 'Use localStorage for user data' }, { status: 200 });
  }

  if (route === 'auth/logout' && request.method === 'POST') {
    return NextResponse.json({ message: 'Logged out' });
  }

  return NextResponse.json({ detail: 'Not found' }, { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
