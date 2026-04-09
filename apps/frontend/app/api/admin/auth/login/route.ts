import type { NextRequest } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

interface BackendTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: 'Invalid request body' }, { status: 400 });
  }

  const tokenRes = await fetch(`${BACKEND}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!tokenRes.ok) {
    const error = await tokenRes.json().catch(() => ({ message: 'Login failed' }));
    return Response.json(error, { status: tokenRes.status });
  }

  const tokens = (await tokenRes.json()) as BackendTokenResponse;

  // Return access_token only — no cookie set.
  // Admin session is tab-scoped (sessionStorage). __lala_refresh is NOT touched.
  return Response.json({ access_token: tokens.access_token });
}
