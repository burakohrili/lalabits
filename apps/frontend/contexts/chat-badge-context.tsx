'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;
const POLL_INTERVAL_MS = 30_000;

interface ChatBadgeState {
  unreadCount: number;
  refetchCount: () => Promise<void>;
}

const ChatBadgeContext = createContext<ChatBadgeState>({
  unreadCount: 0,
  refetchCount: async () => {},
});

export function ChatBadgeProvider({ children }: { children: ReactNode }) {
  const { user, accessToken } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${API}/chat/unread-count`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { unread_count: number };
      setUnreadCount(data.unread_count ?? 0);
    } catch {
      // best-effort — badge stays as-is on error
    }
  }, [accessToken]);

  useEffect(() => {
    if (user && accessToken) {
      void fetchCount();
      intervalRef.current = setInterval(() => void fetchCount(), POLL_INTERVAL_MS);
    } else {
      setUnreadCount(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, accessToken, fetchCount]);

  return (
    <ChatBadgeContext.Provider value={{ unreadCount, refetchCount: fetchCount }}>
      {children}
    </ChatBadgeContext.Provider>
  );
}

export function useChatBadge() {
  return useContext(ChatBadgeContext);
}
