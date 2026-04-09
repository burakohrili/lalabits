import { cookies } from 'next/headers';

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

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return Response.json({ code: 'NO_REFRESH_TOKEN', message: 'No session' }, { status: 401 });
  }

  // 1. Exchange refresh token for new token pair
  const tokenRes = await fetch(`${BACKEND}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!tokenRes.ok) {
    // Refresh failed — clear the stale cookie
    cookieStore.delete(REFRESH_COOKIE);
    const error = await tokenRes.json().catch(() => ({ message: 'Session expired' }));
    return Response.json(error, { status: tokenRes.status });
  }

  const tokens = (await tokenRes.json()) as BackendTokenResponse;

  // 2. Fetch user profile using the new access token
  const meRes = await fetch(`${BACKEND}/auth/me`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!meRes.ok) {
    return Response.json({ message: 'Failed to load user profile' }, { status: 500 });
  }

  const user = (await meRes.json()) as BackendUser;

  // 3. Rotate: store the new refresh token in HttpOnly cookie
  cookieStore.set(REFRESH_COOKIE, tokens.refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: REFRESH_MAX_AGE,
    path: '/',
  });

  return Response.json({ access_token: tokens.access_token, user });
}
