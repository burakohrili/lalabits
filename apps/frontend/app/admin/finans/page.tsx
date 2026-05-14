'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_SIZE = 20;

// ─── Types ────────────────────────────────────────────────────────────────────

interface EarningItem {
  id: string;
  creator_profile_id: string;
  source_type: string;
  gross_amount_try: number;
  commission_amount: number;
  net_amount_try: number;
  period_month: number;
  period_year: number;
  status: string;
  created_at: string;
}

interface PayoutItem {
  id: string;
  creator_profile_id: string;
  period_month: number;
  period_year: number;
  total_earnings_try: number;
  net_payout_try: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

interface RefundItem {
  id: string;
  user_id: string;
  invoice_id: string | null;
  reason: string;
  status: string;
  amount_try: number;
  processed_at: string | null;
  created_at: string;
}

type Tab = 'earnings' | 'payouts' | 'refunds';

const EARNING_STATUS: Record<string, string> = { pending: 'Bekliyor', confirmed: 'Onaylandı', paid: 'Ödendi' };
const PAYOUT_STATUS: Record<string, string> = { pending: 'Bekliyor', processing: 'İşleniyor', paid: 'Ödendi', failed: 'Başarısız' };
const REFUND_STATUS: Record<string, string> = { open: 'Açık', approved: 'Onaylandı', rejected: 'Reddedildi', processed: 'İşlendi' };
const SOURCE_LABELS: Record<string, string> = { subscription: 'Abonelik', product: 'Ürün', collection: 'Koleksiyon' };

function fmt(amount: number) {
  return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 });
}

function periodLabel(month: number, year: number) {
  return new Date(year, month - 1, 1).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
}

// ─── Earnings Tab ─────────────────────────────────────────────────────────────

function EarningsTab({ accessToken, logout }: { accessToken: string; logout: () => void }) {
  const [items, setItems] = useState<EarningItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      const res = await fetch(`${API}/admin/earnings?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { items: EarningItem[]; total: number };
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError('Hak edişler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => { void fetch_(page); }, [fetch_, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <p className="mb-4 text-sm text-muted">{total} hak ediş kaydı</p>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted">Kayıt bulunamadı.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted">Dönem</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted">Kaynak</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">Brüt</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">Komisyon</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">Net</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {items.map((e) => (
                <tr key={e.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{periodLabel(e.period_month, e.period_year)}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{SOURCE_LABELS[e.source_type] ?? e.source_type}</td>
                  <td className="px-4 py-3 text-xs text-foreground text-right">{fmt(e.gross_amount_try)}</td>
                  <td className="px-4 py-3 text-xs text-muted text-right">−{fmt(e.commission_amount)}</td>
                  <td className="px-4 py-3 text-xs font-medium text-foreground text-right">{fmt(e.net_amount_try)}</td>
                  <td className="px-4 py-3">
                    <span className={[
                      'inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                      e.status === 'paid' ? 'bg-green-50 text-green-700'
                        : e.status === 'confirmed' ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700',
                    ].join(' ')}>{EARNING_STATUS[e.status] ?? e.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-3">
          <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40">Önceki</button>
          <span className="text-sm text-muted">{page} / {totalPages}</span>
          <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40">Sonraki</button>
        </div>
      )}
    </>
  );
}

// ─── Payouts Tab ──────────────────────────────────────────────────────────────

function PayoutsTab({ accessToken, logout }: { accessToken: string; logout: () => void }) {
  const [items, setItems] = useState<PayoutItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marking, setMarking] = useState<string | null>(null);

  const fetch_ = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      const res = await fetch(`${API}/admin/payouts?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { items: PayoutItem[]; total: number };
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError('Ödemeler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => { void fetch_(page); }, [fetch_, page]);

  async function markPaid(id: string) {
    if (marking) return;
    setMarking(id);
    try {
      const res = await fetch(`${API}/admin/payouts/${id}/mark-paid`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.map((p) => p.id === id ? { ...p, status: 'paid', paid_at: new Date().toISOString() } : p));
    } catch {
      setError('Ödeme işaretlenemedi.');
    } finally {
      setMarking(null);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <p className="mb-4 text-sm text-muted">{total} ödeme kaydı</p>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted">Ödeme kaydı bulunamadı.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-surface p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">{periodLabel(p.period_month, p.period_year)}</p>
                <p className="text-xs text-muted mt-0.5">
                  Net ödeme: <strong>{fmt(p.net_payout_try)}</strong>
                  {' · '}Brüt: {fmt(p.total_earnings_try)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={[
                  'rounded-full px-2 py-0.5 text-[11px] font-medium',
                  p.status === 'paid' ? 'bg-green-50 text-green-700'
                    : p.status === 'processing' ? 'bg-blue-50 text-blue-700'
                    : p.status === 'failed' ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-700',
                ].join(' ')}>{PAYOUT_STATUS[p.status] ?? p.status}</span>
                {p.status !== 'paid' && (
                  <button
                    type="button"
                    disabled={marking === p.id}
                    onClick={() => void markPaid(p.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background disabled:opacity-40 transition-colors"
                  >
                    {marking === p.id ? 'İşleniyor…' : 'Ödendi İşaretle'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-3">
          <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40">Önceki</button>
          <span className="text-sm text-muted">{page} / {totalPages}</span>
          <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40">Sonraki</button>
        </div>
      )}
    </>
  );
}

// ─── Refunds Tab ──────────────────────────────────────────────────────────────

function RefundsTab({ accessToken, logout }: { accessToken: string; logout: () => void }) {
  const [items, setItems] = useState<RefundItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetch_ = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      const res = await fetch(`${API}/admin/refund-requests?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { items: RefundItem[]; total: number };
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError('İade talepleri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => { void fetch_(page); }, [fetch_, page]);

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    if (processing) return;
    setProcessing(id);
    try {
      const res = await fetch(`${API}/admin/refund-requests/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.map((r) => r.id === id ? { ...r, status, processed_at: new Date().toISOString() } : r));
    } catch {
      setError('Durum güncellenemedi.');
    } finally {
      setProcessing(null);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <p className="mb-4 text-sm text-muted">{total} iade talebi</p>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted">İade talebi bulunamadı.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <p className="text-sm text-muted line-clamp-2">{r.reason}</p>
                  <p className="text-xs text-muted mt-1">
                    Talep: {new Date(r.created_at).toLocaleDateString('tr-TR')}
                    {r.amount_try > 0 && ` · ${fmt(r.amount_try)}`}
                  </p>
                </div>
                <span className={[
                  'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                  r.status === 'approved' || r.status === 'processed' ? 'bg-green-50 text-green-700'
                    : r.status === 'rejected' ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-700',
                ].join(' ')}>{REFUND_STATUS[r.status] ?? r.status}</span>
              </div>
              {r.status === 'open' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={processing === r.id}
                    onClick={() => void updateStatus(r.id, 'approved')}
                    className="flex-1 rounded-xl bg-green-600 px-3 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    Onayla
                  </button>
                  <button
                    type="button"
                    disabled={processing === r.id}
                    onClick={() => void updateStatus(r.id, 'rejected')}
                    className="flex-1 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted hover:text-red-600 hover:border-red-200 disabled:opacity-40 transition-colors"
                  >
                    Reddet
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-3">
          <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40">Önceki</button>
          <span className="text-sm text-muted">{page} / {totalPages}</span>
          <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40">Sonraki</button>
        </div>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminFinansPage() {
  const { accessToken, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<Tab>('earnings');

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Finans</h1>
            <p className="mt-0.5 text-sm text-muted">Hak edişler, ödemeler ve iade talepleri</p>
          </div>
          <a href="/admin" className="text-sm text-primary hover:underline">← Genel Bakış</a>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1 w-fit mb-6">
          {(['earnings', 'payouts', 'refunds'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab ? 'bg-primary text-white' : 'text-muted hover:text-foreground',
              ].join(' ')}
            >
              {tab === 'earnings' ? 'Hak Edişler' : tab === 'payouts' ? 'Ödemeler' : 'İade Talepleri'}
            </button>
          ))}
        </div>

        {activeTab === 'earnings' && <EarningsTab accessToken={accessToken} logout={logout} />}
        {activeTab === 'payouts' && <PayoutsTab accessToken={accessToken} logout={logout} />}
        {activeTab === 'refunds' && <RefundsTab accessToken={accessToken} logout={logout} />}
      </div>
    </main>
  );
}
