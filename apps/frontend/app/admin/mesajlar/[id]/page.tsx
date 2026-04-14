'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Message {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
}

export default function AdminMesajlarDetailPage() {
  const { accessToken, logout } = useAdminAuth();
  const params = useParams();
  const id = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !id) return;
    void (async () => {
      try {
        const res = await fetch(`${API}/admin/conversations/${id}/messages?limit=100`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.status === 401) { logout(); return; }
        if (!res.ok) throw new Error('FETCH_FAILED');
        const data = (await res.json()) as { items: Message[]; total: number };
        setMessages(data.items);
        setTotal(data.total);
      } catch {
        setError('Mesajlar yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, id, logout]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Konuşma</h1>
            <p className="mt-0.5 text-sm text-muted">
              {total > 0 ? `${total} mesaj` : ''}
              <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Sadece okuma</span>
            </p>
          </div>
          <a href="/admin/mesajlar" className="text-sm text-primary hover:underline">← Konuşmalar</a>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-12 rounded-xl bg-gray-100 animate-pulse ${i % 2 ? 'ml-auto w-3/4' : 'w-3/4'}`} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
            <p className="text-sm text-muted">Bu konuşmada henüz mesaj yok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => {
              // Alternate sides: first sender is creator (left), second is fan (right)
              const firstSenderId = messages[0]?.sender_user_id;
              const isFirst = msg.sender_user_id === firstSenderId;
              return (
                <div key={msg.id} className={`flex ${isFirst ? 'justify-start' : 'justify-end'}`}>
                  <div className={[
                    'max-w-[75%] rounded-2xl px-4 py-3',
                    isFirst ? 'bg-surface border border-border' : 'bg-primary/10',
                  ].join(' ')}>
                    <p className="text-sm text-foreground leading-relaxed">{msg.body}</p>
                    <p className="mt-1 text-[10px] text-muted">
                      {new Date(msg.created_at).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
