'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useAuth } from '@/contexts/auth-context';
import { bffFetch } from '@/lib/api-client';

interface NotificationBadgeState {
  unreadCount: number;
  zeroCount: () => void;
  decrementCount: () => void;
  refetchCount: () => Promise<void>;
}

const NotificationBadgeContext = createContext<NotificationBadgeState>({
  unreadCount: 0,
  zeroCount: () => {},
  decrementCount: () => {},
  refetchCount: async () => {},
});

export function NotificationBadgeProvider({ children }: { children: ReactNode }) {
  const { user, accessToken } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await bffFetch<{ unread_count: number }>(
        '/api/notifications/unread-count',
        { method: 'GET' },
        accessToken,
      );
      setUnreadCount(data?.unread_count ?? 0);
    } catch {
      // best-effort — badge stays at 0 on error
    }
  }, [accessToken]);

  useEffect(() => {
    if (user && accessToken) {
      void fetchCount();
    } else {
      setUnreadCount(0);
    }
  }, [user, accessToken, fetchCount]);

  const zeroCount = useCallback(() => setUnreadCount(0), []);
  const decrementCount = useCallback(
    () => setUnreadCount((n) => Math.max(0, n - 1)),
    [],
  );

  return (
    <NotificationBadgeContext.Provider
      value={{ unreadCount, zeroCount, decrementCount, refetchCount: fetchCount }}
    >
      {children}
    </NotificationBadgeContext.Provider>
  );
}

export function useNotificationBadge() {
  return useContext(NotificationBadgeContext);
}
