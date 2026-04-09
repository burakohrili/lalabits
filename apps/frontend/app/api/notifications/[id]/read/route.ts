import type { NextRequest } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = req.headers.get('Authorization');
  const res = await fetch(`${BACKEND}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { ...(auth ? { Authorization: auth } : {}) },
  });
  const body = await res.json().catch(() => ({}));
  return Response.json(body, { status: res.status });
}
