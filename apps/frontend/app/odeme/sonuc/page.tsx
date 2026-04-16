'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

type ResultStatus = 'loading' | 'polling' | 'success' | 'failed';

interface SubscriptionResult {
  status: string;
  plan_name?: string;
  current_period_end?: string;
}

interface OrderResult {
  status: string;
}

function PaymentResultInner() {
  const searchParams = useSearchParams();
  const { accessToken } = useAuth();

  const type = searchParams.get('type');
  const conversationId = searchParams.get('conversation_id') ?? '';
  const rawStatus = searchParams.get('status');

  const [pageStatus, setPageStatus] = useState<ResultStatus>('loading');
  const [planName, setPlanName] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [pollAttempts, setPollAttempts] = useState(0);

  useEffect(() => {
    if (!conversationId) {
      setPageStatus('failed');
      return;
    }
    if (rawStatus === 'failed') {
      setPageStatus('failed');
      return;
    }
    if (rawStatus === 'success' && !accessToken) {
      setPageStatus('success');
      return;
    }
    if (rawStatus === 'success' && accessToken) {
      void fetchResult();
      return;
    }
    setPageStatus('polling');
  }, [rawStatus, accessToken, conversationId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (pageStatus !== 'polling' || !accessToken || pollAttempts >= 6) {
      if (pageStatus === 'polling' && pollAttempts >= 6) {
        setPageStatus('success');
      }
      return;
    }
    const timer = setTimeout(() => {
      void fetchResult();
      setPollAttempts((n) => n + 1);
    }, 2500);
    return () => clearTimeout(timer);
  }, [pageStatus, accessToken, pollAttempts]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchResult() {
    if (!accessToken || !conversationId) return;
    try {
      let res: Response;
      if (type === 'subscription') {
        res = await fetch(`${API}/membership/result/${conversationId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        res = await fetch(`${API}/checkout/result/${conversationId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      if (!res.ok) { setPageStatus('polling'); return; }
      if (type === 'subscription') {
        const data = (await res.json()) as SubscriptionResult;
        if (data.status === 'active' || data.status === 'grace_period') {
          setPlanName(data.plan_name ?? null);
          setPeriodEnd(data.current_period_end ?? null);
          setPageStatus('success');
        } else if (data.status === 'failed' || data.status === 'expired') {
          setPageStatus('failed');
        } else {
          setPageStatus('polling');
        }
      } else {
        const data = (await res.json()) as OrderResult;
        if (data.status === 'completed') {
          setPageStatus('success');
        } else if (data.status === 'failed' || data.status === 'cancelled') {
          setPageStatus('failed');
        } else {
          setPageStatus('polling');
        }
      }
    } catch {
      setPageStatus('polling');
    }
  }

  if (pageStatus === 'loading' || pageStatus === 'polling') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-base font-semibold text-foreground">Ödemeniz işleniyor…</p>
          <p className="text-sm text-muted">Bu birkaç saniye sürebilir. Lütfen bekleyin.</p>
        </div>
      </main>
    );
  }

  if (pageStatus === 'failed') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center flex flex-col gap-4">
          <p className="text-lg font-semibold text-red-800">Ödeme Başarısız</p>
          <p className="text-sm text-red-700">
            Ödeme işlemi tamamlanamadı. Kart bilgilerinizi kontrol ederek tekrar deneyebilirsiniz.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              Geri Dön
            </button>
            <Link
              href="/"
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (type === 'subscription') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-green-200 bg-green-50 p-8 text-center flex flex-col gap-4">
          <p className="text-lg font-semibold text-green-800">Abonelik Başarılı!</p>
          {planName && (
            <p className="text-sm text-green-700">{planName} planına abone oldunuz.</p>
          )}
          {periodEnd && (
            <p className="text-xs text-green-600">
              Dönem sonu: {new Date(periodEnd).toLocaleDateString('tr-TR')}
            </p>
          )}
          <div className="flex flex-col gap-2 mt-2">
            <Link
              href="/kutuphane"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Kütüphaneme Git
            </Link>
            <Link
              href="/kesfet"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
            >
              Üreticilere Göz At
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-md rounded-2xl border border-green-200 bg-green-50 p-8 text-center flex flex-col gap-4">
        <p className="text-lg font-semibold text-green-800">Satın Alma Başarılı!</p>
        <p className="text-sm text-green-700">
          İçerik kütüphanenize eklendi. Hemen erişebilirsiniz.
        </p>
        <div className="flex flex-col gap-2 mt-2">
          <Link
            href="/kutuphane"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Kütüphaneme Git
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted">Yükleniyor…</p>
          </div>
        </main>
      }
    >
      <PaymentResultInner />
    </Suspense>
  );
}
