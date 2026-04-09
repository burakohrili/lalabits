import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;
const REFRESH_COOKIE = '__lala_refresh';
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

interface BackendTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface BackendUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  email_verified_at: string | null;
  has_fan_role: boolean;
  is_admin: boolean;
  account_status: string;
  creator_profile: unknown;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: 'Invalid request body' }, { status: 400 });
  }

  // 1. Get tokens from backend
  const tokenRes = await fetch(`${BACKEND}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!tokenRes.ok) {
    const error = await tokenRes.json().catch(() => ({ message: 'Login failed' }));
    return Response.json(error, { status: tokenRes.status });
  }

  const tokens = (await tokenRes.json()) as BackendTokenResponse;

  // 2. Fetch user profile using the access token
  const meRes = await fetch(`${BACKEND}/auth/me`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!meRes.ok) {
    return Response.json({ message: 'Failed to load user profile' }, { status: 500 });
  }

  const user = (await meRes.json()) as BackendUser;

  // 3. Store refresh token in HttpOnly cookie — never exposed to JS
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_COOKIE, tokens.refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: REFRESH_MAX_AGE,
    path: '/',
  });

  return Response.json({ access_token: tokens.access_token, user });
}
