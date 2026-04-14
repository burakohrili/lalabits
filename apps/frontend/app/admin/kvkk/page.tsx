'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_SIZE = 20;

type StatusFilter = 'all' | 'pending' | 'in_review' | 'completed' | 'rejected';

interface KvkkRequest {
  id: string;
  full_name: string;
  email: string;
  request_type: string;
  status: string;
  details: string | null;
  admin_notes: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor',
  in_review: 'İnceleniyor',
  completed: 'Tamamlandı',
  rejected: 'Reddedildi',
};

const TYPE_LABELS: Record<string, string> = {
  data_access: 'Erişim',
  data_deletion: 'Silme',
  data_correction: 'Düzeltme',
  opt_out: 'Vazgeçme',
  other: 'Diğer',
};

export default function AdminKvkkPage() {
  const { accessToken, logout } = useAdminAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [items, setItems] = useState<KvkkRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRequests = useCallback(async (status: StatusFilter, p: number) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      if (status !== 'all') params.set('status', status);
      const res = await fetch(`${API}/admin/kvkk?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: KvkkRequest[]; total: number };
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError('KVKK talepleri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => { void fetchRequests(statusFilter, page); }, [fetchRequests, statusFilter, page]);

  function handleStatusChange(s: StatusFilter) {
    setStatusFilter(s);
    setPage(1);
    setSelectedId(null);
  }

  function openPanel(item: KvkkRequest) {
    setSelectedId(item.id);
    setNewStatus(item.status);
    setAdminNotes(item.admin_notes ?? '');
  }

  async function handleUpdate() {
    if (!accessToken || !selectedId || updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API}/admin/kvkk/${selectedId}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes || undefined }),
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error('UPDATE_FAILED');
      const updated = (await res.json()) as KvkkRequest;
      setItems((prev) => prev.map((it) => it.id === updated.id ? updated : it));
      setSelectedId(null);
    } catch {
      setError('Güncelleme başarısız.');
    } finally {
      setUpdating(false);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">KVKK Talepleri</h1>
            <p className="mt-0.5 text-sm text-muted">{total > 0 ? `${total} talep` : 'Talep yok'}</p>
          </div>
          <a href="/admin" className="text-sm text-primary hover:underline">← Genel Bakış</a>
        </div>

        <div className="mb-5 flex gap-1 rounded-xl border border-border bg-surface p-1 w-fit">
          {(['all', 'pending', 'in_review', 'completed', 'rejected'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={[
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
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

        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
                <p className="text-sm text-muted">Bu filtreyle eşleşen talep yok.</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted">Başvuran</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted">Tür</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted">Durum</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted">Tarih</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium text-foreground">{item.full_name}</p>
                          <p className="text-[11px] text-muted">{item.email}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted">
                          {TYPE_LABELS[item.request_type] ?? item.request_type}
                        </td>
                        <td className="px-4 py-3">
                          <span className={[
                            'inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                            item.status === 'completed' ? 'bg-green-50 text-green-700'
                              : item.status === 'rejected' ? 'bg-red-50 text-red-600'
                              : item.status === 'in_review' ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-muted',
                          ].join(' ')}>
                            {STATUS_LABELS[item.status] ?? item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => openPanel(item)}
                            className="text-xs text-primary hover:underline"
                          >
                            İncele
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-4 flex items-center gap-3">
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

          {selectedId && (
            <div className="w-80 shrink-0">
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-foreground">Talep Güncelle</h2>
                  <button type="button" onClick={() => setSelectedId(null)} className="text-muted hover:text-foreground text-lg leading-none">×</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Durum</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full rounded-xl border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Admin Notu</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      maxLength={2000}
                      className="w-full resize-none rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleUpdate()}
                    disabled={updating}
                    className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    {updating ? 'Kaydediliyor…' : 'Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
