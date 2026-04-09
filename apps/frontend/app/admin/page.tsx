'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Overview {
  pending_applications_count: number;
  open_reports_count: number;
}

export default function AdminOverviewPage() {
  const { accessToken, logout } = useAdminAuth();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    async function load() {
      try {
        const res = await fetch(`${API}/admin/overview`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { code?: string };
          throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
        }
        const data = (await res.json()) as Overview;
        setOverview(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          logout();
        } else {
          setError('Veri yüklenemedi.');
        }
      }
    }

    void load();
  }, [accessToken, logout]);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-muted hover:text-foreground"
          >
            Çıkış
          </button>
        </div>

        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/yaraticilar/inceleme"
            className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 shadow-sm hover:border-primary/40 transition-colors"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Bekleyen Başvurular
            </span>
            <span className="text-3xl font-bold text-foreground">
              {overview ? overview.pending_applications_count : '—'}
            </span>
            <span className="text-sm text-primary">İncele →</span>
          </Link>
          <Link
            href="/admin/kreatorler"
            className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 shadow-sm hover:border-primary/40 transition-colors"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Kreatör Yönetimi
            </span>
            <span className="text-3xl font-bold text-foreground">—</span>
            <span className="text-sm text-primary">Yönet →</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
