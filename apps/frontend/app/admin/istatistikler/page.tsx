'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Statistics {
  platform_overview: {
    total_creators: number;
    active_creators: number;
    total_fans: number;
    total_revenue_try: number;
  };
  revenue_by_month: { month: string; revenue_try: number }[];
  new_subscriptions_by_month: { month: string; count: number }[];
  top_creators: {
    username: string;
    display_name: string;
    active_members: number;
    total_revenue: number;
  }[];
}

function formatTRY(amount: number) {
  return (amount / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <p className="text-xs font-medium text-muted mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function AdminIstatistiklerPage() {
  const { accessToken, logout } = useAdminAuth();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    void (async () => {
      try {
        const res = await fetch(`${API}/admin/istatistikler`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.status === 401) { logout(); return; }
        if (!res.ok) throw new Error('FETCH_FAILED');
        setStats((await res.json()) as Statistics);
      } catch {
        setError('İstatistikler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, logout]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Platform İstatistikleri</h1>
          <a href="/admin" className="text-sm text-primary hover:underline">← Genel Bakış</a>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
        ) : stats && (
          <div className="space-y-8">
            {/* Overview cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Toplam Üretici" value={stats.platform_overview.total_creators} />
              <StatCard label="Aktif Üretici" value={stats.platform_overview.active_creators} />
              <StatCard label="Toplam Fan" value={stats.platform_overview.total_fans} />
              <StatCard label="Toplam Gelir" value={formatTRY(stats.platform_overview.total_revenue_try)} />
            </div>

            {/* Revenue by month */}
            {stats.revenue_by_month.length > 0 && (
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-surface">
                  <h2 className="text-sm font-semibold text-foreground">Aylık Gelir (Son 12 Ay)</h2>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-surface/50 border-b border-border">
                    <tr>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-muted">Ay</th>
                      <th className="px-5 py-2.5 text-right text-xs font-medium text-muted">Gelir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {stats.revenue_by_month.map((row) => (
                      <tr key={row.month} className="hover:bg-surface/50">
                        <td className="px-5 py-2.5 text-xs text-foreground">{row.month}</td>
                        <td className="px-5 py-2.5 text-xs text-foreground text-right font-medium">
                          {formatTRY(row.revenue_try)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* New subscriptions by month */}
            {stats.new_subscriptions_by_month.length > 0 && (
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-surface">
                  <h2 className="text-sm font-semibold text-foreground">Yeni Abonelikler (Son 12 Ay)</h2>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-surface/50 border-b border-border">
                    <tr>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-muted">Ay</th>
                      <th className="px-5 py-2.5 text-right text-xs font-medium text-muted">Yeni Abonelik</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {stats.new_subscriptions_by_month.map((row) => (
                      <tr key={row.month} className="hover:bg-surface/50">
                        <td className="px-5 py-2.5 text-xs text-foreground">{row.month}</td>
                        <td className="px-5 py-2.5 text-xs text-foreground text-right font-medium">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Top creators */}
            {stats.top_creators.length > 0 && (
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-surface">
                  <h2 className="text-sm font-semibold text-foreground">En İyi Üreticiler (Top 10)</h2>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-surface/50 border-b border-border">
                    <tr>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-muted">Üretici</th>
                      <th className="px-5 py-2.5 text-right text-xs font-medium text-muted">Aktif Üye</th>
                      <th className="px-5 py-2.5 text-right text-xs font-medium text-muted">Toplam Gelir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {stats.top_creators.map((c) => (
                      <tr key={c.username} className="hover:bg-surface/50">
                        <td className="px-5 py-2.5">
                          <p className="text-xs font-medium text-foreground">{c.display_name}</p>
                          <p className="text-[11px] text-muted">@{c.username}</p>
                        </td>
                        <td className="px-5 py-2.5 text-xs text-foreground text-right">{c.active_members}</td>
                        <td className="px-5 py-2.5 text-xs text-foreground text-right font-medium">
                          {formatTRY(c.total_revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
