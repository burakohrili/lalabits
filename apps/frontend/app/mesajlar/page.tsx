'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface ConversationItem {
  id: string;
  other_party_display_name: string;
  other_party_username: string | null;
  role: 'fan' | 'creator';
  last_message_body: string | null;
  last_message_at: string | null;
  unread_count: number;
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const rtf = new Intl.RelativeTimeFormat('tr', { numeric: 'auto' });
  if (minutes < 1) return 'şimdi';
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  if (hours < 24) return rtf.format(-hours, 'hour');
  return rtf.format(-days, 'day');
}

export default function MesajlarPage() {
  const { user, accessToken, status: authStatus } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/mesajlar');
    }
  }, [authStatus, router]);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/chat/conversations`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: ConversationItem[] };
      setConversations(data.items);
    } catch {
      setError('Mesajlar yüklenemedi. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;
    void load();
  }, [authStatus, accessToken, load]);

  if (authStatus === 'loading' || (loading && conversations.length === 0)) {
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
      <h1 className="text-xl font-semibold text-foreground mb-6">Mesajlar</h1>

      {error ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted mb-4">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="text-sm text-primary hover:underline"
          >
            Tekrar dene
          </button>
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-xl border border-border bg-white py-16 text-center">
          <p className="text-sm text-muted">Henüz mesajınız yok.</p>
          <p className="mt-2 text-xs text-muted">
            Bir üreticinin sayfasından abone olarak mesaj başlatabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <ul className="divide-y divide-border">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <Link
                  href={`/mesajlar/${conv.id}`}
                  className={[
                    'flex items-start gap-3 px-4 py-4 hover:bg-surface-raised transition-colors',
                    conv.unread_count > 0 ? 'border-l-2 border-primary' : 'border-l-2 border-transparent',
                  ].join(' ')}
                >
                  {/* Avatar */}
                  <div className="h-10 w-10 shrink-0 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold text-muted">
                    {conv.other_party_display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={[
                        'text-sm font-medium truncate',
                        conv.unread_count > 0 ? 'text-foreground' : 'text-muted',
                      ].join(' ')}>
                        {conv.other_party_display_name}
                        {conv.other_party_username && (
                          <span className="ml-1 text-xs text-muted font-normal">
                            @{conv.other_party_username}
                          </span>
                        )}
                      </p>
                      <span className="shrink-0 text-xs text-muted">
                        {relativeTime(conv.last_message_at)}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5 truncate">
                      {conv.last_message_body ?? 'Henüz mesaj yok.'}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="mt-1 shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                      {conv.unread_count > 99 ? '99+' : conv.unread_count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
