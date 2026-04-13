'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface BlockedUser {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  blocked_at: string;
}

export default function EngellendiPage() {
  const { accessToken, status: authStatus } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/ayarlar/engellenenler');
      return;
    }
    if (authStatus === 'loading' || !accessToken) return;

    async function load() {
      try {
        const res = await fetch(`${API}/settings/blocked`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('FETCH_FAILED');
        const data = (await res.json()) as { items: BlockedUser[] };
        setItems(data.items);
      } catch {
        setError('Liste yüklenemedi. Lütfen sayfayı yenile.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [authStatus, accessToken, router]);

  async function handleUnblock(userId: string) {
    if (!accessToken) return;
    setRemoving(userId);
    try {
      const res = await fetch(`${API}/users/${userId}/block`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('UNBLOCK_FAILED');
      setItems((prev) => prev.filter((u) => u.user_id !== userId));
    } catch {
      setError('Engel kaldırılamadı. Tekrar dene.');
    } finally {
      setRemoving(null);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/ayarlar" className="text-sm text-primary hover:underline">
          ← Ayarlar
        </Link>
        <span className="text-muted">·</span>
        <h1 className="text-lg font-semibold text-foreground">Engellenen Kullanıcılar</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">Henüz kimseyi engellemeding</p>
          <p className="mt-1 text-xs text-muted">
            Topluluk sohbetinde bir kullanıcıyı engelleyebilirsin.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.user_id}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-background border border-border overflow-hidden">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.display_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm font-bold text-muted">
                      {item.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.display_name}</p>
                  <p className="text-xs text-muted">
                    {new Date(item.blocked_at).toLocaleDateString('tr-TR')} tarihinde engellendi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleUnblock(item.user_id)}
                disabled={removing === item.user_id}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-red-300 hover:text-red-600 disabled:opacity-40 transition-colors"
              >
                {removing === item.user_id ? '…' : 'Engeli Kaldır'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
