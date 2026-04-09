'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

type CreatorStatus = 'onboarding' | 'pending_review' | 'approved' | 'rejected' | 'suspended';

interface CreatorListItem {
  id: string;
  display_name: string;
  username: string | null;
  email: string | null;
  category: string;
  status: CreatorStatus;
  created_at: string;
  approved_at: string | null;
  suspended_at: string | null;
  active_subscriber_count: number;
}

interface ListResponse {
  items: CreatorListItem[];
  total: number;
  page: number;
  limit: number;
}

const STATUS_LABELS: Record<CreatorStatus, string> = {
  onboarding: 'Onboarding',
  pending_review: 'İnceleme Bekliyor',
  approved: 'Onaylı',
  rejected: 'Reddedildi',
  suspended: 'Askıya Alındı',
};

const STATUS_COLORS: Record<CreatorStatus, string> = {
  onboarding: 'bg-gray-100 text-gray-600',
  pending_review: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  suspended: 'bg-orange-50 text-orange-700',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('tr-TR');
}

export default function AdminKreatorlerPage() {
  const { accessToken, logout } = useAdminAuth();

  const [items, setItems] = useState<CreatorListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<CreatorStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 20;

  const load = useCallback(async (p: number, status: CreatorStatus | '') => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (status) params.set('status', status);
      const res = await fetch(`${API}/admin/creators?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }
      const data = (await res.json()) as ListResponse;
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      } else {
        setError('Kreatör listesi yüklenemedi.');
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => {
    void load(page, statusFilter);
  }, [load, page, statusFilter]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-primary hover:underline">
              ← Admin
            </Link>
            <span className="text-muted">·</span>
            <h1 className="text-xl font-semibold text-foreground">Kreatörler</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-muted hover:text-foreground"
          >
            Çıkış
          </button>
        </div>

        {/* Filter */}
        <div className="mb-4 flex items-center gap-3">
          <label htmlFor="status-filter" className="text-sm text-muted">
            Durum:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value as CreatorStatus | '');
            }}
            className="rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Tümü</option>
            {(Object.entries(STATUS_LABELS) as [CreatorStatus, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <span className="ml-auto text-sm text-muted">
            Toplam: {total}
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          {loading ? (
            <div className="space-y-px">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-50 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted">
              {statusFilter ? 'Bu durumda kreatör bulunamadı.' : 'Henüz kreatör yok.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-xs font-medium uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Kreatör</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">Aboneler</th>
                  <th className="px-4 py-3">Kayıt</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((c) => (
                  <tr key={c.id} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{c.display_name}</p>
                      <p className="text-xs text-muted">
                        {c.username ? `@${c.username}` : '—'}
                        {c.email && <span className="ml-2">{c.email}</span>}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted capitalize">{c.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status]}`}>
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {c.active_subscriber_count}
                    </td>
                    <td className="px-4 py-3 text-muted">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/kreatorler/${c.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Detay →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40 hover:bg-surface"
            >
              ← Önceki
            </button>
            <span className="text-sm text-muted">
              Sayfa {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40 hover:bg-surface"
            >
              Sonraki →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
