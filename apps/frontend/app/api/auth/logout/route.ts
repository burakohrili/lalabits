import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;
const REFRESH_COOKIE = '__lala_refresh';

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  // Forward the access token from the Authorization header to satisfy JwtAuthGuard
  const authHeader = req.headers.get('authorization') ?? '';

  if (refreshToken && authHeader) {
    // Best-effort: tell backend to invalidate the Redis key.
    // We do not fail on backend errors — cookie will be cleared regardless.
    await fetch(`${BACKEND}/auth/logout`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => {});
  }

  // Always clear the cookie on the client side
  cookieStore.delete(REFRESH_COOKIE);

  return new Response(null, { status: 204 });
}
