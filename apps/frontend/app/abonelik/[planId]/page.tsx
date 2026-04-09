'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface PlanPreview {
  id: string;
  name: string;
  description: string | null;
  price_monthly_try: number;
  perks: string[];
  seller: { display_name: string; username: string | null } | null;
}

type PageState = 'loading' | 'ready' | 'not_found' | 'already_subscribed' | 'success' | 'error';

export default function SubscriptionCheckoutPage() {
  const { accessToken, status: authStatus } = useAuth();
  const params = useParams();
  const planId = params.planId as string;

  const [plan, setPlan] = useState<PlanPreview | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscriptionResult, setSubscriptionResult] = useState<{
    plan_name: string;
    current_period_end: string;
  } | null>(null);

  useEffect(() => {
    if (!planId || authStatus === 'loading') return;

    async function loadPlan() {
      try {
        const res = await fetch(`${API}/membership/plans/${planId}`);
        if (!res.ok) {
          setPageState('not_found');
          return;
        }
        setPlan((await res.json()) as PlanPreview);
        setPageState('ready');
      } catch {
        setPageState('not_found');
      }
    }

    void loadPlan();
  }, [planId, authStatus]);

  async function handleSubscribe() {
    if (!accessToken) return;
    setBusy(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API}/membership/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ plan_id: planId, billing_interval: 'monthly' }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        if (body.message === 'ALREADY_SUBSCRIBED') {
          setPageState('already_subscribed');
          return;
        }
        if (body.message === 'PLAN_NOT_AVAILABLE') {
          setPageState('not_found');
          return;
        }
        setErrorMessage(body.message ?? 'Abonelik başarısız oldu.');
        return;
      }

      const data = (await res.json()) as {
        plan_name: string;
        current_period_end: string;
      };
      setSubscriptionResult(data);
      setPageState('success');
    } catch {
      setErrorMessage('Abonelik başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setBusy(false);
    }
  }

  if (pageState === 'loading') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (pageState === 'not_found') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">Plan bulunamadı</p>
          <p className="mt-2 text-sm text-muted">Bu üyelik planı mevcut değil veya artık aktif değil.</p>
        </div>
      </main>
    );
  }

  if (pageState === 'already_subscribed') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center flex flex-col gap-4">
          <p className="text-lg font-semibold text-foreground">Zaten Üyesiniz</p>
          <p className="text-sm text-muted">Bu içerik üreticisine zaten aktif üyeliğiniz var.</p>
          <Link href="/kutuphane" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            Kütüphaneme Git
          </Link>
        </div>
      </main>
    );
  }

  if (pageState === 'success') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-green-200 bg-green-50 p-8 text-center flex flex-col gap-4">
          <p className="text-lg font-semibold text-green-800">Abonelik Başarılı!</p>
          <p className="text-sm text-green-700">
            {subscriptionResult?.plan_name} planına abone oldunuz.
          </p>
          {subscriptionResult?.current_period_end && (
            <p className="text-xs text-green-600">
              Dönem sonu: {new Date(subscriptionResult.current_period_end).toLocaleDateString('tr-TR')}
            </p>
          )}
          <Link href="/kutuphane" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            Kütüphaneme Git
          </Link>
          {plan?.seller?.username && (
            <Link
              href={`/u/${plan.seller.username}`}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
            >
              ← {plan.seller.display_name} sayfasına dön
            </Link>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 max-w-lg mx-auto">
      {plan?.seller?.username && (
        <div className="mb-6">
          <Link href={`/u/${plan.seller.username}`} className="text-sm text-muted hover:text-foreground">
            ← {plan.seller.display_name}
          </Link>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col gap-5">
        <div>
          <p className="text-xs text-muted mb-1">Üyelik Planı</p>
          <h1 className="text-xl font-semibold text-foreground">{plan?.name ?? 'Üyelik Planı'}</h1>
          {plan?.description && (
            <p className="mt-2 text-sm text-muted leading-relaxed">{plan.description}</p>
          )}
          {plan && plan.perks.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {plan.perks.map((perk, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary mt-px text-xs">✓</span> {perk}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <p className="text-sm text-muted">Aylık</p>
          <p className="text-lg font-bold text-foreground">
            {plan ? (plan.price_monthly_try / 100).toFixed(2) : '—'} ₺
          </p>
        </div>

        {errorMessage && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="button"
          onClick={handleSubscribe}
          disabled={busy}
          className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? 'İşleniyor…' : 'Abone Ol'}
        </button>

        <p className="text-xs text-muted text-center">
          Abonelik işlemi test modundadır.
        </p>
      </div>
    </main>
  );
}
