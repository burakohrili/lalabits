'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useChatBadge } from '@/contexts/chat-badge-context';

const API = process.env.NEXT_PUBLIC_API_URL!;
const POLL_INTERVAL_MS = 5_000;

interface MessageItem {
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

export default function MesajlarThreadPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const { accessToken, status: authStatus } = useAuth();
  const { refetchCount } = useChatBadge();

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestCreatedAtRef = useRef<string | null>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace(`/auth/giris?next=/mesajlar/${conversationId}`);
    }
  }, [authStatus, router, conversationId]);

  const markRead = useCallback(async () => {
    if (!accessToken) return;
    try {
      await fetch(`${API}/chat/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      void refetchCount();
    } catch {
      // best-effort
    }
  }, [accessToken, conversationId, refetchCount]);

  const loadMessages = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${API}/chat/conversations/${conversationId}/messages?limit=30`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        if (res.status === 403 || res.status === 404) {
          router.replace('/mesajlar');
          return;
        }
        throw new Error('FETCH_FAILED');
      }
      const data = (await res.json()) as {
        items: MessageItem[];
        has_more: boolean;
      };
      setMessages(data.items);
      setHasMore(data.has_more);
      if (data.items.length > 0) {
        latestCreatedAtRef.current = data.items[data.items.length - 1].created_at;
      }
    } catch {
      setError('Mesajlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, conversationId, router]);

  // Poll for new messages — append only items newer than latest known
  const pollMessages = useCallback(async () => {
    if (!accessToken || !latestCreatedAtRef.current) return;
    try {
      const res = await fetch(`${API}/chat/conversations/${conversationId}/messages?limit=30`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { items: MessageItem[]; has_more: boolean };
      const newItems = data.items.filter(
        (m) => new Date(m.created_at) > new Date(latestCreatedAtRef.current!),
      );
      if (newItems.length > 0) {
        setMessages((prev) => [...prev, ...newItems]);
        latestCreatedAtRef.current = newItems[newItems.length - 1].created_at;
        void markRead();
      }
    } catch {
      // silent
    }
  }, [accessToken, conversationId, markRead]);

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;
    void loadMessages().then(() => void markRead());
  }, [authStatus, accessToken, loadMessages, markRead]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loading]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Start polling after initial load
  useEffect(() => {
    if (loading || !accessToken) return;
    pollingRef.current = setInterval(() => void pollMessages(), POLL_INTERVAL_MS);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [loading, accessToken, pollMessages]);

  async function handleSend() {
    if (!accessToken || !body.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: body.trim() }),
      });
      if (!res.ok) {
        if (res.status === 403) {
          setError('Mesaj göndermek için aktif abonelik gerekli.');
          return;
        }
        throw new Error('SEND_FAILED');
      }
      const message = (await res.json()) as MessageItem;
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
            <div
              key={i}
              className={`h-10 rounded-2xl bg-gray-100 animate-pulse ${i % 2 === 0 ? 'w-2/3' : 'w-1/2 ml-auto'}`}
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 flex flex-col" style={{ minHeight: 'calc(100vh - 60px)' }}>
      {/* Back */}
      <a
        href="/mesajlar"
        className="mb-4 text-sm text-primary hover:underline inline-block"
      >
        ← Mesajlar
      </a>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {hasMore && (
          <p className="text-center text-xs text-muted py-2">Daha eski mesajlar yüklenmiyor.</p>
        )}
        {messages.length === 0 && !loading && (
          <p className="text-center text-sm text-muted py-10">Henüz mesaj yok. İlk mesajı siz gönderin.</p>
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
            placeholder="Mesajınızı yazın…"
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
