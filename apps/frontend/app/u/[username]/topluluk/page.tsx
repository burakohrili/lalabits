'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;
const POLL_INTERVAL_MS = 5_000;

interface CommunityMessageItem {
  id: string;
  body: string;
  sender_user_id: string;
  is_own: boolean;
  created_at: string;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const rtf = new Intl.RelativeTimeFormat('tr', { numeric: 'auto' });
  if (minutes < 1) return 'şimdi';
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  if (hours < 24) return rtf.format(-hours, 'hour');
  return new Date(dateStr).toLocaleDateString('tr-TR');
}

export default function ToplulukPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user, accessToken, status: authStatus } = useAuth();

  const [messages, setMessages] = useState<CommunityMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [body, setBody] = useState('');
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestCreatedAtRef = useRef<string | null>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace(`/auth/giris?next=/u/${username}/topluluk`);
    }
  }, [authStatus, router, username]);

  const markRead = useCallback(async () => {
    if (!accessToken) return;
    try {
      await fetch(`${API}/chat/community/${username}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {
      // best-effort
    }
  }, [accessToken, username]);

  const loadMessages = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${API}/chat/community/${username}/messages?limit=30`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (res.status === 404) {
        router.replace('/kreatorler');
        return;
      }
      if (!res.ok) throw new Error('FETCH_FAILED');

      const data = (await res.json()) as { items: CommunityMessageItem[] };
      setMessages(data.items);
      if (data.items.length > 0) {
        latestCreatedAtRef.current = data.items[data.items.length - 1].created_at;
      }
    } catch {
      setError('Topluluk mesajları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, username, router]);

  const pollMessages = useCallback(async () => {
    if (!accessToken || !latestCreatedAtRef.current) return;
    try {
      const res = await fetch(`${API}/chat/community/${username}/messages?limit=30`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { items: CommunityMessageItem[] };
      const newItems = data.items.filter(
        (m) => new Date(m.created_at) > new Date(latestCreatedAtRef.current!),
      );
      if (newItems.length > 0) {
        setMessages((prev) => [...prev, ...newItems]);
        latestCreatedAtRef.current = newItems[newItems.length - 1].created_at;
      }
    } catch {
      // silent
    }
  }, [accessToken, username]);

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;
    void loadMessages().then(() => void markRead());
  }, [authStatus, accessToken, loadMessages, markRead]);

  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (loading || !accessToken || forbidden) return;
    pollingRef.current = setInterval(() => void pollMessages(), POLL_INTERVAL_MS);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [loading, accessToken, forbidden, pollMessages]);

  async function handleSend() {
    if (!accessToken || !body.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/chat/community/${username}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: body.trim() }),
      });
      if (!res.ok) {
        if (res.status === 403) {
          setForbidden(true);
          return;
        }
        throw new Error('SEND_FAILED');
      }
      const message = (await res.json()) as CommunityMessageItem;
      setMessages((prev) => [...prev, message]);
      latestCreatedAtRef.current = message.created_at;
      setBody('');
    } catch {
      setError('Mesaj gönderilemedi. Tekrar deneyin.');
    } finally {
      setSending(false);
    }
  }

  if (authStatus === 'loading' || loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (forbidden) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-lg font-semibold text-foreground mb-2">Bu topluluğa erişmek için abone olmanız gerekiyor.</p>
        <p className="text-sm text-muted mb-6">@{username} üreticinin üyelik planlarına bakın.</p>
        <Link
          href={`/u/${username}`}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Üretici sayfasına git
        </Link>
      </main>
    );
  }

  const isCreator = user?.creator_profile?.username === username;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 flex flex-col" style={{ minHeight: 'calc(100vh - 60px)' }}>
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Link href={`/u/${username}`} className="text-sm text-primary hover:underline">
          ← @{username}
        </Link>
        <span className="text-muted">·</span>
        <h1 className="text-sm font-semibold text-foreground">Topluluk</h1>
        {isCreator && (
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Üretici
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted py-10">
            Henüz mesaj gönderilmedi. İlk mesajı siz gönderin!
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.is_own ? 'justify-end' : 'justify-start'} group`}>
            <div className="flex flex-col gap-1 max-w-[75%]">
              <div
                className={[
                  'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  m.is_own
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-surface border border-border text-foreground rounded-bl-sm',
                ].join(' ')}
              >
                <p>{m.body}</p>
                <p className={`text-[10px] mt-1 ${m.is_own ? 'text-white/70' : 'text-muted/70'}`}>
                  {relativeTime(m.created_at)}
                </p>
              </div>
              {!m.is_own && (
                <button
                  type="button"
                  onClick={() => {
                    if (!accessToken) return;
                    if (!confirm('Bu kullanıcıyı engellemek istediğine emin misin?')) return;
                    setBlockingUserId(m.sender_user_id);
                    fetch(`${API}/users/${m.sender_user_id}/block`, {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${accessToken}` },
                    })
                      .then(() => {
                        setMessages((prev) => prev.filter((msg) => msg.sender_user_id !== m.sender_user_id));
                      })
                      .catch(() => setError('Engelleme başarısız. Tekrar dene.'))
                      .finally(() => setBlockingUserId(null));
                  }}
                  disabled={blockingUserId === m.sender_user_id}
                  className="self-start text-[10px] text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
                >
                  Engelle
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 pt-3 bg-background border-t border-border">
        <div className="flex gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Topluluğa mesaj gönder…"
            rows={2}
            maxLength={2000}
            className="flex-1 resize-none rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!body.trim() || sending}
            className="self-end rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {sending ? '…' : 'Gönder'}
          </button>
        </div>
        <p className="mt-1 text-right text-xs text-muted">{body.length}/2000</p>
      </div>
    </main>
  );
}
