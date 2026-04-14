'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_SIZE = 20;

type StatusFilter = 'open' | 'under_review' | 'actioned' | 'dismissed';
type TargetTypeFilter = 'all' | 'post' | 'product' | 'collection' | 'user' | 'creator_profile';

interface ReportItem {
  id: string;
  target_type: string;
  target_id: string;
  reason_code: string;
  status: string;
  reporter_email: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_LABELS: Record<StatusFilter, string> = {
  open: 'Açık',
  under_review: 'İnceleniyor',
  actioned: 'İşlem Yapıldı',
  dismissed: 'Kapatıldı',
};

const TARGET_TYPE_LABELS: Record<string, string> = {
  post: 'Gönderi',
  product: 'Ürün',
  collection: 'Koleksiyon',
  user: 'Kullanıcı',
  creator_profile: 'Üretici Profili',
  chat_message: 'Mesaj',
  community_message: 'Topluluk Mesajı',
};

const REASON_LABELS: Record<string, string> = {
  spam: 'Spam / Yanıltıcı',
  illegal_content: 'Yasadışı İçerik',
  copyright: 'Telif Hakkı',
  harassment: 'Taciz / Zorbalık',
  misinformation: 'Yanlış Bilgi',
  other: 'Diğer',
};

const TARGET_TYPE_FILTERS: { value: TargetTypeFilter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'post', label: 'Gönderi' },
  { value: 'product', label: 'Ürün' },
  { value: 'collection', label: 'Koleksiyon' },
  { value: 'user', label: 'Kullanıcı' },
  { value: 'creator_profile', label: 'Üretici Profili' },
];

export default function AdminRaporlarPage() {
  const { accessToken, logout } = useAdminAuth();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('open');
  const [targetTypeFilter, setTargetTypeFilter] = useState<TargetTypeFilter>('all');
  const [items, setItems] = useState<ReportItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchReports = useCallback(async (
    status: StatusFilter,
    targetType: TargetTypeFilter,
    p: number,
  ) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        status,
        page: String(p),
        limit: String(PAGE_SIZE),
      });
      if (targetType !== 'all') params.set('target_type', targetType);

      const res = await fetch(`${API}/admin/reports?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: ReportItem[]; total: number };
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError('Raporlar yüklenemedi. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => {
    void fetchReports(statusFilter, targetTypeFilter, page);
  }, [fetchReports, statusFilter, targetTypeFilter, page]);

  function handleStatusChange(s: StatusFilter) {
    setStatusFilter(s);
    setPage(1);
    setActionError(null);
  }

  function handleTargetTypeChange(t: TargetTypeFilter) {
    setTargetTypeFilter(t);
    setPage(1);
    setActionError(null);
  }

  async function doAction(reportId: string, action: 'remove' | 'dismiss' | 'restore') {
    if (!accessToken || actionLoading) return;
    setActionLoading(reportId + action);
    setActionError(null);
    try {
      const res = await fetch(`${API}/admin/reports/${reportId}/${action}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error('ACTION_FAILED');
      // Remove from list or refresh
      setItems((prev) => prev.filter((r) => r.id !== reportId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch {
      setActionError('İşlem gerçekleştirilemedi. Tekrar deneyin.');
    } finally {
      setActionLoading(null);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Raporlar</h1>
            <p className="mt-0.5 text-sm text-muted">
              {STATUS_LABELS[statusFilter]}
              {total > 0 && ` — ${total} rapor`}
            </p>
          </div>
          <a href="/admin" className="text-sm text-primary hover:underline">
            ← Genel Bakış
          </a>
        </div>

        {/* Status filter tabs */}
        <div className="mb-4 flex gap-1 rounded-xl border border-border bg-surface p-1 w-fit">
          {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={[
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                statusFilter === s
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-foreground',
              ].join(' ')}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Target type filter */}
        <div className="mb-5 flex flex-wrap gap-2">
          {TARGET_TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => handleTargetTypeChange(f.value)}
              className={[
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                targetTypeFilter === f.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted hover:border-primary/40 hover:text-foreground',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
        {actionError && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{actionError}</p>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <p className="text-sm font-medium text-foreground">Rapor bulunamadı</p>
            <p className="mt-1 text-xs text-muted">Bu filtrelerle eşleşen rapor yok.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Hedef</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Sebep</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Şikayetçi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Tarih</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {items.map((report) => {
                  const isActioning = actionLoading?.startsWith(report.id);
                  return (
                    <tr key={report.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {TARGET_TYPE_LABELS[report.target_type] ?? report.target_type}
                        </span>
                        <p className="mt-0.5 text-[11px] text-muted font-mono truncate max-w-[120px]">
                          {report.target_id.slice(0, 8)}…
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">
                        {REASON_LABELS[report.reason_code] ?? report.reason_code}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">
                        {report.reporter_email ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {new Date(report.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {report.status === 'open' || report.status === 'under_review' ? (
                            <>
                              <button
                                type="button"
                                disabled={isActioning}
                                onClick={() => void doAction(report.id, 'remove')}
                                className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-40 transition-colors"
                              >
                                {actionLoading === report.id + 'remove' ? '…' : 'İçeriği Kaldır'}
                              </button>
                              <button
                                type="button"
                                disabled={isActioning}
                                onClick={() => void doAction(report.id, 'dismiss')}
                                className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted hover:text-foreground hover:bg-surface disabled:opacity-40 transition-colors"
                              >
                                {actionLoading === report.id + 'dismiss' ? '…' : 'Kapat'}
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              disabled={isActioning}
                              onClick={() => void doAction(report.id, 'restore')}
                              className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted hover:text-foreground hover:bg-surface disabled:opacity-40 transition-colors"
                            >
                              {actionLoading === report.id + 'restore' ? '…' : 'Geri Al'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
