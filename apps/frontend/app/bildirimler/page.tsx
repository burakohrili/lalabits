'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useNotificationBadge } from '@/contexts/notification-badge-context';
import NotificationList, { type NotificationItem } from './_components/notification-list';

const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_LIMIT = 20;

interface NotificationPage {
  items: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  unread_count: number;
}

export default function BildirimlerPage() {
  const { accessToken, status: authStatus } = useAuth();
  const { zeroCount, decrementCount } = useNotificationBadge();
  const router = useRouter();

  const [data, setData] = useState<NotificationPage | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/bildirimler');
    }
  }, [authStatus, router]);

  const load = useCallback(
    async (p: number) => {
      if (!accessToken) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API}/notifications?page=${p}&limit=${PAGE_LIMIT}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        if (!res.ok) throw new Error('FETCH_FAILED');
        const json = (await res.json()) as NotificationPage;
        setData(json);
      } catch {
        setError('Bildirimler yüklenemedi. Tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    },
    [accessToken],
  );

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;
    void load(page);
  }, [authStatus, accessToken, page, load]);

  function handleRead(id: string) {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      };
    });
    decrementCount();
  }

  async function handleMarkAll() {
    if (!accessToken || markingAll) return;
    setMarkingAll(true);
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setData((prev) => {
        if (!prev) return prev;
        const now = new Date().toISOString();
        return {
          ...prev,
          items: prev.items.map((n) => ({ ...n, read_at: n.read_at ?? now })),
          unread_count: 0,
        };
      });
      zeroCount();
    } catch {
      // best-effort
    } finally {
      setMarkingAll(false);
    }
  }

  const totalPages = data ? Math.ceil(data.total / PAGE_LIMIT) : 1;
  const hasUnread = (data?.items ?? []).some((n) => !n.read_at);

  if (authStatus === 'loading' || (loading && !data)) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Bildirimler</h1>
        {hasUnread && (
          <button
            type="button"
            onClick={() => void handleMarkAll()}
            disabled={markingAll}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            {markingAll ? 'İşleniyor…' : 'Tümünü okundu işaretle'}
          </button>
        )}
      </div>

      {error ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted mb-4">{error}</p>
          <button
            type="button"
            onClick={() => void load(page)}
            className="text-sm text-primary hover:underline"
          >
            Tekrar dene
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <NotificationList
              items={data?.items ?? []}
              accessToken={accessToken ?? ''}
              onRead={handleRead}
            />
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-border px-4 py-1.5 text-foreground hover:bg-surface-raised transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              <span className="text-muted">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-border px-4 py-1.5 text-foreground hover:bg-surface-raised transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
