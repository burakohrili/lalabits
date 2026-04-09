'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import SubscriptionCard, { type SubscriptionItem } from './_components/subscription-card';
import InvoiceList, { type InvoiceItem } from './_components/invoice-list';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function BillingPage() {
  const { accessToken, status: authStatus } = useAuth();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // LD-1: redirect unauthenticated to /auth/giris
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/hesabim/faturalarim');
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [subRes, invRes] = await Promise.all([
          fetch(`${API}/membership/subscriptions/history?limit=50`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`${API}/billing/invoices?limit=50`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        if (!subRes.ok && !invRes.ok) {
          throw new Error('fetch_failed');
        }
        if (subRes.ok) {
          const data = (await subRes.json()) as { items: SubscriptionItem[] };
          setSubscriptions(data.items);
        }
        if (invRes.ok) {
          const data = (await invRes.json()) as { items: InvoiceItem[] };
          setInvoices(data.items);
        }
      } catch {
        setError('Veriler yüklenemedi. Sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [authStatus, accessToken]);

  // Mark subscription as cancelled in local state — avoids full refetch
  function handleCancelled(subscriptionId: string) {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.subscription_id === subscriptionId
          ? { ...s, status: 'cancelled', cancelled_at: new Date().toISOString() }
          : s,
      ),
    );
  }

  if (authStatus === 'loading' || (authStatus === 'unauthenticated')) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  // Partition subscriptions by display section
  const activeSubs = subscriptions.filter((s) =>
    ['active', 'cancelled', 'grace_period'].includes(s.status),
  );
  // LD-2: pending = payment_failed first attempt — separate block
  const pendingSubs = subscriptions.filter((s) => s.status === 'pending');
  const expiredSubs = subscriptions.filter((s) => s.status === 'expired');

  return (
    <main className="px-4 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-8">Faturalarım</h1>

      {/* Active memberships */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">
          Aktif Üyelikler
        </h2>
        {activeSubs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
            <p className="text-sm text-muted">Aktif üyeliğiniz bulunmuyor.</p>
            <p className="mt-1 text-xs text-muted">
              Kreatörleri keşfet ve bir üyelik planına abone ol.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeSubs.map((sub) => (
              <SubscriptionCard
                key={sub.subscription_id}
                item={sub}
                accessToken={accessToken!}
                onCancelled={handleCancelled}
              />
            ))}
          </div>
        )}
      </section>

      {/* LD-2: Pending / failed first-attempt payments */}
      {pendingSubs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">
            Tamamlanamayan Ödemeler
          </h2>
          <div className="flex flex-col gap-3">
            {pendingSubs.map((sub) => (
              <div
                key={sub.subscription_id}
                className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
              >
                <p className="text-sm font-medium text-foreground">
                  {sub.plan_name ?? 'Üyelik Planı'}
                  {sub.creator_display_name && (
                    <span className="font-normal text-muted"> · {sub.creator_display_name}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-red-600">
                  Ödeme tamamlanamadı, erişim açılmadı.
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Invoice history */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">
          Ödeme Geçmişi
        </h2>
        <InvoiceList items={invoices} />
      </section>

      {/* Past memberships */}
      {expiredSubs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">
            Geçmiş Üyelikler
          </h2>
          <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface overflow-hidden">
            {expiredSubs.map((sub) => (
              <div key={sub.subscription_id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted">
                    {sub.plan_name ?? 'Üyelik Planı'}
                  </p>
                  {sub.creator_display_name && (
                    <p className="text-xs text-muted">{sub.creator_display_name}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-muted">
                    Sona Erdi
                  </span>
                  <p className="text-xs text-muted">
                    {new Date(sub.current_period_end).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
