'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_SIZE = 20;

type StatusFilter = 'all' | 'paid' | 'failed' | 'refunded';

interface InvoiceItem {
  id: string;
  fan_email: string | null;
  creator_username: string | null;
  invoice_type: string;
  amount_try: number;
  currency: string;
  status: string;
  issued_at: string;
  paid_at: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  paid: 'Ödendi',
  failed: 'Başarısız',
  refunded: 'İade',
};

const TYPE_LABELS: Record<string, string> = {
  subscription_charge: 'Abonelik',
  subscription_renewal: 'Yenileme',
  one_time_purchase: 'Tek Seferlik',
  refund: 'İade',
};

export default function AdminOdemelerPage() {
  const { accessToken, logout } = useAdminAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async (status: StatusFilter, p: number) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      if (status !== 'all') params.set('status', status);
      const res = await fetch(`${API}/admin/odemeler?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: InvoiceItem[]; total: number };
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError('Ödemeler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => { void fetchInvoices(statusFilter, page); }, [fetchInvoices, statusFilter, page]);

  function handleStatusChange(s: StatusFilter) {
    setStatusFilter(s);
    setPage(1);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Ödemeler</h1>
            <p className="mt-0.5 text-sm text-muted">{total > 0 ? `${total} fatura` : 'Fatura yok'}</p>
          </div>
          <a href="/admin" className="text-sm text-primary hover:underline">← Genel Bakış</a>
        </div>

        <div className="mb-5 flex gap-1 rounded-xl border border-border bg-surface p-1 w-fit">
          {(['all', 'paid', 'failed', 'refunded'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={[
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                statusFilter === s ? 'bg-primary text-white' : 'text-muted hover:text-foreground',
              ].join(' ')}
            >
              {s === 'all' ? 'Tümü' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
            <p className="text-sm text-muted">Bu filtreyle eşleşen fatura bulunamadı.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Fan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Üretici</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Tür</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">Tutar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Durum</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {items.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-foreground">{inv.fan_email ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {inv.creator_username ? `@${inv.creator_username}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {TYPE_LABELS[inv.invoice_type] ?? inv.invoice_type}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground text-right font-medium">
                      {(inv.amount_try / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={[
                        'inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                        inv.status === 'paid' ? 'bg-green-50 text-green-700'
                          : inv.status === 'failed' ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-muted',
                      ].join(' ')}>
                        {STATUS_LABELS[inv.status] ?? inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                      {new Date(inv.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40"
            >
              Önceki
            </button>
            <span className="text-sm text-muted">{page} / {totalPages}</span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
