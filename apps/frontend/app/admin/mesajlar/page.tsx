'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth';
import { relativeDate } from '@/lib/date-utils';

const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_SIZE = 20;

interface Conversation {
  id: string;
  creator_email: string | null;
  fan_email: string | null;
  last_message_at: string | null;
  created_at: string;
}

export default function AdminMesajlarPage() {
  const { accessToken, logout } = useAdminAuth();
  const [items, setItems] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async (p: number) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/conversations?page=${p}&limit=${PAGE_SIZE}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: Conversation[]; total: number };
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError('Konuşmalar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => { void fetchConversations(page); }, [fetchConversations, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Konuşmalar</h1>
            <p className="mt-0.5 text-sm text-muted">{total > 0 ? `${total} konuşma` : 'Konuşma yok'}</p>
          </div>
          <a href="/admin" className="text-sm text-primary hover:underline">← Genel Bakış</a>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
            <p className="text-sm text-muted">Henüz konuşma yok.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Üretici</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Fan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Son Mesaj</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {items.map((conv) => (
                  <tr key={conv.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-foreground">{conv.creator_email ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted">{conv.fan_email ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted">{relativeDate(conv.last_message_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/mesajlar/${conv.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Görüntüle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-5 flex items-center gap-3">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40">
              Önceki
            </button>
            <span className="text-sm text-muted">{page} / {totalPages}</span>
            <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40">
              Sonraki
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
