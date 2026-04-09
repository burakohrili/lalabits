'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ApiError } from '@/lib/api-client';

const SESSION_KEY = '__lala_admin_at';
const LOGIN_PATH = '/admin/giris';

interface AdminAuthContextValue {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Restore token from sessionStorage on mount (client only).
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    setAccessToken(stored);
    setReady(true);
  }, []);

  // Redirect to login when no token and not already on login page.
  useEffect(() => {
    if (!ready) return;
    if (!accessToken && pathname !== LOGIN_PATH) {
      router.replace(LOGIN_PATH);
    }
  }, [ready, accessToken, pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { code?: string; message?: string };
      throw new ApiError(res.status, body.code ?? 'UNKNOWN', body.message ?? res.statusText);
    }

    const { access_token } = (await res.json()) as { access_token: string };
    sessionStorage.setItem(SESSION_KEY, access_token);
    setAccessToken(access_token);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAccessToken(null);
    router.replace(LOGIN_PATH);
  }, [router]);

  // Don't render protected children until we know the auth state.
  if (!ready) return null;

  return (
    <AdminAuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
