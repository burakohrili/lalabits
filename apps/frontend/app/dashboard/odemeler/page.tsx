'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_SIZE = 20;

interface CreatorEarning {
  id: string;
  source_type: 'subscription' | 'product' | 'collection';
  gross_amount_try: number;
  commission_rate: number;
  commission_amount: number;
  net_amount_try: number;
  period_month: number;
  period_year: number;
  status: 'pending' | 'confirmed' | 'paid';
  created_at: string;
}

interface CreatorPayout {
  id: string;
  period_month: number;
  period_year: number;
  total_earnings_try: number;
  total_commission_try: number;
  net_payout_try: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  paid_at: string | null;
  notes: string | null;
  created_at: string;
}

const SOURCE_LABELS: Record<string, string> = {
  subscription: 'Abonelik',
  product: 'Ürün',
  collection: 'Koleksiyon',
};

const EARNING_STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor',
  confirmed: 'Onaylandı',
  paid: 'Ödendi',
};

const PAYOUT_STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor',
  processing: 'İşleniyor',
  paid: 'Ödendi',
  failed: 'Başarısız',
};

function fmt(amount: number) {
  return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 });
}

function periodLabel(month: number, year: number) {
  return new Date(year, month - 1, 1).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
}

type Tab = 'earnings' | 'payouts';

export default function CreatorOdemelerPage() {
  const { accessToken, status: authStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('earnings');
  const [earnings, setEarnings] = useState<CreatorEarning[]>([]);
  const [payouts, setPayouts] = useState<CreatorPayout[]>([]);
  const [earningsTotal, setEarningsTotal] = useState(0);
  const [payoutsTotal, setPayoutsTotal] = useState(0);
  const [earningsPage, setEarningsPage] = useState(1);
  const [payoutsPage, setPayoutsPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = useCallback(async (page: number) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      const res = await fetch(`${API}/creator/earnings?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: CreatorEarning[]; total: number };
      setEarnings(data.items);
      setEarningsTotal(data.total);
    } catch {
      setError('Hak edişler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchPayouts = useCallback(async (page: number) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      const res = await fetch(`${API}/creator/payouts?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: CreatorPayout[]; total: number };
      setPayouts(data.items);
      setPayoutsTotal(data.total);
    } catch {
      setError('Ödemeler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (authStatus !== 'authenticated') return;
    if (activeTab === 'earnings') void fetchEarnings(earningsPage);
    else void fetchPayouts(payoutsPage);
  }, [authStatus, activeTab, earningsPage, payoutsPage, fetchEarnings, fetchPayouts]);

  if (authStatus === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const earningsTotalPages = Math.ceil(earningsTotal / PAGE_SIZE);
  const payoutsTotalPages = Math.ceil(payoutsTotal / PAGE_SIZE);

  return (
    <div className="px-6 py-8 max-w-4xl">
      <h1 className="text-xl font-bold text-foreground mb-6">Ödemelerim</h1>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-surface p-1 w-fit mb-6">
        {(['earnings', 'payouts'] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={[
              'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab ? 'bg-primary text-white' : 'text-muted hover:text-foreground',
            ].join(' ')}
          >
            {tab === 'earnings' ? 'Hak Edişler' : 'Ödeme Geçmişi'}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Earnings tab */}
      {activeTab === 'earnings' && (
        <>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : earnings.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
              <p className="text-sm text-muted">Henüz hak ediş kaydınız yok.</p>
              <p className="mt-1 text-xs text-muted">Üyelik ve satış gelirleri burada görünür.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted">Dönem</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted">Kaynak</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted">Brüt</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted">Komisyon (%{20})</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted">Net</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {earnings.map((e) => (
                    <tr key={e.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {periodLabel(e.period_month, e.period_year)}
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">
                        {SOURCE_LABELS[e.source_type] ?? e.source_type}
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground text-right">{fmt(e.gross_amount_try)}</td>
                      <td className="px-4 py-3 text-xs text-muted text-right">−{fmt(e.commission_amount)}</td>
                      <td className="px-4 py-3 text-xs font-medium text-foreground text-right">{fmt(e.net_amount_try)}</td>
                      <td className="px-4 py-3">
                        <span className={[
                          'inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                          e.status === 'paid' ? 'bg-green-50 text-green-700'
                            : e.status === 'confirmed' ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700',
                        ].join(' ')}>
                          {EARNING_STATUS_LABELS[e.status] ?? e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {earningsTotalPages > 1 && (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                disabled={earningsPage === 1}
                onClick={() => setEarningsPage((p) => p - 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40"
              >
                Önceki
              </button>
              <span className="text-sm text-muted">{earningsPage} / {earningsTotalPages}</span>
              <button
                type="button"
                disabled={earningsPage === earningsTotalPages}
                onClick={() => setEarningsPage((p) => p + 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40"
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      )}

      {/* Payouts tab */}
      {activeTab === 'payouts' && (
        <>
          <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs text-muted mb-1">Platform komisyonu hakkında</p>
            <p className="text-sm text-foreground">
              Lalabits her işlemden <strong>%20</strong> komisyon keser. Kalan <strong>%80</strong> hak ediş olarak hesabınıza aktarılır.
              Ödemeler aylık olarak IBAN'ınıza yapılır. Ödeme için geçerli bir e-Fatura / e-SMM belgeniz olması gerekir.
            </p>
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : payouts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
              <p className="text-sm text-muted">Henüz ödeme kaydınız yok.</p>
              <p className="mt-1 text-xs text-muted">Onaylı hak edişleriniz aylık olarak ödenir.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-border bg-surface p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{periodLabel(p.period_month, p.period_year)}</p>
                    {p.notes && <p className="mt-0.5 text-xs text-muted">{p.notes}</p>}
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                      <span>Toplam hak ediş: {fmt(p.total_earnings_try)}</span>
                      <span>·</span>
                      <span>Komisyon: −{fmt(p.total_commission_try)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-foreground">{fmt(p.net_payout_try)}</p>
                    <span className={[
                      'inline-block rounded-full px-2 py-0.5 text-[11px] font-medium mt-1',
                      p.status === 'paid' ? 'bg-green-50 text-green-700'
                        : p.status === 'processing' ? 'bg-blue-50 text-blue-700'
                        : p.status === 'failed' ? 'bg-red-50 text-red-600'
                        : 'bg-amber-50 text-amber-700',
                    ].join(' ')}>
                      {PAYOUT_STATUS_LABELS[p.status] ?? p.status}
                    </span>
                    {p.paid_at && (
                      <p className="mt-1 text-[11px] text-muted">
                        {new Date(p.paid_at).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {payoutsTotalPages > 1 && (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                disabled={payoutsPage === 1}
                onClick={() => setPayoutsPage((p) => p - 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40"
              >
                Önceki
              </button>
              <span className="text-sm text-muted">{payoutsPage} / {payoutsTotalPages}</span>
              <button
                type="button"
                disabled={payoutsPage === payoutsTotalPages}
                onClick={() => setPayoutsPage((p) => p + 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface disabled:opacity-40"
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
