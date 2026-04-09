import type { NextRequest } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: NextRequest) {
  const auth = req.headers.get('Authorization');
  const res = await fetch(`${BACKEND}/notifications/unread-count`, {
    headers: { ...(auth ? { Authorization: auth } : {}) },
  });
  const body = await res.json().catch(() => ({}));
  return Response.json(body, { status: res.status });
}
