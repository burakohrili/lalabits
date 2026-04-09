'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { bffFetch } from '@/lib/api-client';

export interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  email_verified_at: string | null;
  has_fan_role: boolean;
  is_admin: boolean;
  account_status: string;
  creator_profile: {
    id: string;
    username: string | null;
    display_name: string;
    avatar_url: string | null;
    status: string;
  } | null;
}

interface BffAuthResponse {
  access_token: string;
  user: AuthUser;
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
}

type AuthAction =
  | { type: 'SET_AUTH'; user: AuthUser; accessToken: string }
  | { type: 'CLEAR_AUTH' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return { user: action.user, accessToken: action.accessToken, status: 'authenticated' };
    case 'CLEAR_AUTH':
      return { user: null, accessToken: null, status: 'unauthenticated' };
    default:
      return state;
  }
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    status: 'loading',
  });

  // On mount: attempt silent refresh to restore session from HttpOnly cookie.
  // If no cookie exists (or it's expired) the BFF returns 401 and we set unauthenticated.
  useEffect(() => {
    void silentRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const silentRefresh = useCallback(async () => {
    try {
      const data = await bffFetch<BffAuthResponse>('/api/auth/refresh', { method: 'POST' });
      if (data) {
        dispatch({ type: 'SET_AUTH', user: data.user, accessToken: data.access_token });
      } else {
        dispatch({ type: 'CLEAR_AUTH' });
      }
    } catch {
      dispatch({ type: 'CLEAR_AUTH' });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
    const data = await bffFetch<BffAuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (!data) throw new Error('Empty response from login');
    dispatch({ type: 'SET_AUTH', user: data.user, accessToken: data.access_token });
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await bffFetch('/api/auth/logout', { method: 'DELETE' }, state.accessToken ?? undefined);
    } catch {
      // best-effort — clear local state regardless
    }
    dispatch({ type: 'CLEAR_AUTH' });
  }, [state.accessToken]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const data = await bffFetch<BffAuthResponse>('/api/auth/refresh', { method: 'POST' });
      if (data) {
        dispatch({ type: 'SET_AUTH', user: data.user, accessToken: data.access_token });
        return data.access_token;
      }
      dispatch({ type: 'CLEAR_AUTH' });
      return null;
    } catch {
      dispatch({ type: 'CLEAR_AUTH' });
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
