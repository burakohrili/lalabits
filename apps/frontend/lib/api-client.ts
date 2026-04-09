const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function extractError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as { code?: string; message?: string };
    return new ApiError(
      res.status,
      body.code ?? 'UNKNOWN',
      body.message ?? res.statusText,
    );
  } catch {
    return new ApiError(res.status, 'UNKNOWN', res.statusText);
  }
}

/**
 * Direct call to the NestJS backend — use from server components and no-auth endpoints.
 * Never call this from client components with sensitive data.
 */
export async function backendFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw await extractError(res);
  return res.json() as Promise<T>;
}

/**
 * Call a Next.js BFF route handler — use from client components for auth operations.
 * Sends cookies automatically and optionally attaches a Bearer access token.
 */
export async function bffFetch<T>(
  path: string,
  init?: RequestInit,
  accessToken?: string,
): Promise<T | undefined> {
  const res = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw await extractError(res);
  if (res.status === 204) return undefined;
  return res.json() as Promise<T>;
}
