'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Analytics {
  summary: {
    total_revenue_try: number;
    active_members: number;
    total_content_count: number;
  };
  revenue_by_month: { month: string; revenue_try: number }[];
  members_by_month: { month: string; count: number }[];
  top_posts: {
    id: string;
    title: string;
    access_level: string;
    published_at: string | null;
  }[];
}

function formatTRY(amount: number) {
  return (amount / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

const ACCESS_LEVEL_LABELS: Record<string, string> = {
  public: 'Herkese Açık',
  member_only: 'Üyelere Özel',
  tier_gated: 'Katmana Özel',
  premium: 'Premium',
};

export default function DashboardIstatistiklerPage() {
  const { accessToken, status: authStatus } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;
    void (async () => {
      try {
        const res = await fetch(`${API}/dashboard/analytics`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('FETCH_FAILED');
        setAnalytics((await res.json()) as Analytics);
      } catch {
        setError('İstatistikler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [authStatus, accessToken]);

  if (loading) {
    return (
      <main className="px-4 py-10 max-w-3xl mx-auto">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !analytics) {
    return (
      <main className="px-4 py-10 max-w-3xl mx-auto">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error ?? 'Veriler yüklenemedi.'}
        </p>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-8">İstatistikler</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-medium text-muted mb-1">Toplam Gelir</p>
          <p className="text-2xl font-bold text-foreground">
            {formatTRY(analytics.summary.total_revenue_try)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-medium text-muted mb-1">Aktif Üye</p>
          <p className="text-2xl font-bold text-foreground">{analytics.summary.active_members}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-medium text-muted mb-1">Yayınlanan İçerik</p>
          <p className="text-2xl font-bold text-foreground">{analytics.summary.total_content_count}</p>
        </div>
      </div>

      {/* Revenue by month */}
      {analytics.revenue_by_month.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-foreground mb-4">Aylık Gelir (Son 6 Ay)</h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Ay</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted">Gelir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {analytics.revenue_by_month.map((row) => (
                  <tr key={row.month}>
                    <td className="px-4 py-2.5 text-xs text-foreground">{row.month}</td>
                    <td className="px-4 py-2.5 text-xs text-foreground text-right font-medium">
                      {formatTRY(row.revenue_try)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Members by month */}
      {analytics.members_by_month.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-foreground mb-4">Yeni Üye (Son 6 Ay)</h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Ay</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted">Yeni Üye</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {analytics.members_by_month.map((row) => (
                  <tr key={row.month}>
                    <td className="px-4 py-2.5 text-xs text-foreground">{row.month}</td>
                    <td className="px-4 py-2.5 text-xs text-foreground text-right font-medium">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recent posts */}
      {analytics.top_posts.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-4">Son Gönderiler</h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="divide-y divide-border bg-background">
              {analytics.top_posts.map((post) => (
                <div key={post.id} className="px-4 py-3 flex items-center justify-between gap-4">
                  <p className="text-sm text-foreground truncate">{post.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-muted">
                      {ACCESS_LEVEL_LABELS[post.access_level] ?? post.access_level}
                    </span>
                    {post.published_at && (
                      <span className="text-[11px] text-muted">
                        {new Date(post.published_at).toLocaleDateString('tr-TR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
