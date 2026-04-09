import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REFRESH_COOKIE = '__lala_refresh';
const LOGIN_URL = '/auth/giris';

// Routes that require an active session (refresh cookie present).
// The proxy cannot verify the token cryptographically — full validation happens
// inside the BFF route handlers and server components via the access token.
const PROTECTED_PREFIXES = ['/onboarding', '/dashboard', '/satin-al', '/kutuphane', '/abonelik'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rewrite /@username → /u/username for public creator pages
  if (pathname.startsWith('/@')) {
    const rest = pathname.slice(2); // strip leading @
    const username = rest.split('/')[0];
    if (username) {
      const rewriteUrl = new URL(`/u/${username}`, request.url);
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected) {
    const hasSession = request.cookies.has(REFRESH_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL(LOGIN_URL, request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/onboarding/:path*', '/dashboard/:path*', '/satin-al/:path*', '/kutuphane/:path*', '/kutuphane', '/abonelik/:path*', '/@:path*'],
};
