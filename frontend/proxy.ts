import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = Boolean(accessToken);
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname === '/workspace' || pathname.startsWith('/workspace/') || pathname === '/chat' || pathname.startsWith('/chat/');

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/workspace/:path*', '/chat/:path*'],
};
