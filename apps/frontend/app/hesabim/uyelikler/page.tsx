'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface SubscriptionItem {
  subscription_id: string;
  plan_id: string;
  plan_name: string | null;
  creator_display_name: string | null;
  creator_username: string | null;
  status: string;
  billing_interval: string;
  current_period_start: string;
  current_period_end: string;
  cancelled_at: string | null;
  grace_period_ends_at: string | null;
  paused_at: string | null;
  pause_resumes_at: string | null;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'active') {
    return <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Aktif</span>;
  }
  if (status === 'cancelled') {
    return <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">İptal Edildi</span>;
  }
  if (status === 'grace_period') {
    return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Ödeme Başarısız</span>;
  }
  if (status === 'paused') {
    return <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Duraklatıldı</span>;
  }
  if (status === 'expired') {
    return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Sona Erdi</span>;
  }
  return null;
}

function CancelModal({
  item,
  accessToken,
  onClose,
  onCancelled,
}: {
  item: SubscriptionItem;
  accessToken: string;
  onClose: () => void;
  onCancelled: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const periodEnd = new Date(item.current_period_end).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  async function handleCancel() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/membership/subscriptions/${item.subscription_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('CANCEL_FAILED');
      onCancelled(item.subscription_id);
    } catch {
      setError('İptal işlemi başarısız oldu. Lütfen tekrar dene.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-base font-semibold text-foreground">Üyeliği İptal Et</h3>
        <p className="mt-2 text-sm text-muted">
          <strong>{item.plan_name ?? 'Üyelik'}</strong> planını iptal etmek istediğinizden emin misiniz?
        </p>
        <p className="mt-1 text-sm text-muted">
          İçeriklere erişiminiz <strong>{periodEnd}</strong> tarihine kadar devam edecektir.
        </p>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleCancel()}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'İptal ediliyor…' : 'Üyeliği İptal Et'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UyeliklerPage() {
  const { accessToken } = useAuth();
  const searchParams = useSearchParams();

  const [subs, setSubs] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<SubscriptionItem | null>(null);
  const [tokenCancelStatus, setTokenCancelStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');

  const fetchSubs = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/membership/subscriptions/history?limit=50`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = (await res.json()) as { items: SubscriptionItem[] };
        setSubs(data.items);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void fetchSubs();
  }, [fetchSubs]);

  // Handle cancel-by-token from email link
  useEffect(() => {
    const cancelToken = searchParams.get('cancel_token');
    const sub = searchParams.get('sub');
    if (!cancelToken || !sub) return;

    setTokenCancelStatus('processing');
    void (async () => {
      try {
        const res = await fetch(`${API}/membership/cancel-by-token?sub=${sub}&token=${cancelToken}`);
        if (res.ok) {
          setTokenCancelStatus('done');
          void fetchSubs();
        } else {
          setTokenCancelStatus('error');
        }
      } catch {
        setTokenCancelStatus('error');
      }
    })();
  }, [searchParams, fetchSubs]);

  const activeSubs = subs.filter((s) => ['active', 'cancelled', 'grace_period', 'paused'].includes(s.status));
  const pastSubs = subs.filter((s) => s.status === 'expired');

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-xl font-bold text-foreground mb-6">Üyeliklerim</h1>

      {tokenCancelStatus === 'processing' && (
        <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
          İptal işlemi gerçekleştiriliyor…
        </div>
      )}
      {tokenCancelStatus === 'done' && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Üyeliğiniz başarıyla iptal edildi. Dönem sonuna kadar içeriklere erişmeye devam edebilirsiniz.
        </div>
      )}
      {tokenCancelStatus === 'error' && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          İptal işlemi başarısız oldu. Üyeliğiniz zaten iptal edilmiş olabilir veya bağlantı süresi dolmuş olabilir.
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : activeSubs.length === 0 && pastSubs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-base font-medium text-foreground">Henüz üyeliğin yok</p>
          <p className="mt-1 text-sm text-muted">Beğendiğin üreticilere üye olarak içeriklerine erişebilirsin.</p>
          <Link
            href="/kesfet"
            className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Üreticileri Keşfet
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {activeSubs.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Aktif Üyelikler</h2>
              <div className="space-y-3">
                {activeSubs.map((sub) => (
                  <SubscriptionRow
                    key={sub.subscription_id}
                    item={sub}
                    accessToken={accessToken!}
                    onCancel={() => setCancelModal(sub)}
                    onStatusChange={(id, newStatus, extra) => {
                      setSubs((prev) => prev.map((s) =>
                        s.subscription_id === id ? { ...s, status: newStatus, ...extra } : s
                      ));
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {pastSubs.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Geçmiş Üyelikler</h2>
              <div className="space-y-3">
                {pastSubs.map((sub) => (
                  <SubscriptionRow
                    key={sub.subscription_id}
                    item={sub}
                    accessToken={accessToken!}
                    onCancel={() => {}}
                    onStatusChange={() => {}}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {cancelModal && accessToken && (
        <CancelModal
          item={cancelModal}
          accessToken={accessToken}
          onClose={() => setCancelModal(null)}
          onCancelled={(id) => {
            setCancelModal(null);
            setSubs((prev) => prev.map((s) =>
              s.subscription_id === id ? { ...s, status: 'cancelled', cancelled_at: new Date().toISOString() } : s
            ));
          }}
        />
      )}
    </div>
  );
}

function SubscriptionRow({
  item,
  accessToken,
  onCancel,
  onStatusChange,
}: {
  item: SubscriptionItem;
  accessToken: string;
  onCancel: () => void;
  onStatusChange: (id: string, newStatus: string, extra?: Partial<SubscriptionItem>) => void;
}) {
  const [pauseLoading, setPauseLoading] = useState(false);
  const [pauseError, setPauseError] = useState<string | null>(null);

  const periodEnd = new Date(item.current_period_end).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const graceEnd = item.grace_period_ends_at
    ? new Date(item.grace_period_ends_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const pauseResumes = item.pause_resumes_at
    ? new Date(item.pause_resumes_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  async function handlePause() {
    setPauseLoading(true);
    setPauseError(null);
    try {
      const res = await fetch(`${API}/membership/subscriptions/${item.subscription_id}/pause`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { pause_resumes_at: string };
      onStatusChange(item.subscription_id, 'paused', { pause_resumes_at: data.pause_resumes_at });
    } catch {
      setPauseError('Üyelik duraklatılamadı.');
    } finally {
      setPauseLoading(false);
    }
  }

  async function handleResume() {
    setPauseLoading(true);
    setPauseError(null);
    try {
      const res = await fetch(`${API}/membership/subscriptions/${item.subscription_id}/resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error();
      onStatusChange(item.subscription_id, 'active', { paused_at: null, pause_resumes_at: null });
    } catch {
      setPauseError('Üyelik devam ettirilemedi.');
    } finally {
      setPauseLoading(false);
    }
  }

  return (
    <div className={[
      'rounded-2xl border bg-surface p-5',
      item.status === 'grace_period' ? 'border-amber-300'
        : item.status === 'paused' ? 'border-blue-200'
        : 'border-border',
    ].join(' ')}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{item.plan_name ?? 'Üyelik Planı'}</p>
          {item.creator_display_name && (
            <p className="mt-0.5 text-xs text-muted">
              {item.creator_display_name}
              {item.creator_username && (
                <> · <Link href={`/@${item.creator_username}`} className="hover:underline">@{item.creator_username}</Link></>
              )}
            </p>
          )}
          <p className="mt-0.5 text-xs text-muted">
            {item.billing_interval === 'annual' ? 'Yıllık' : 'Aylık'}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="mt-3 text-xs text-muted">
        {item.status === 'active' && <p>Dönem sonu: {periodEnd}</p>}
        {item.status === 'cancelled' && (
          <p className="text-orange-600">{periodEnd} tarihine kadar erişiminiz devam eder</p>
        )}
        {item.status === 'grace_period' && (
          <p className="text-amber-700">
            Ödeme alınamadı.{graceEnd ? ` ${graceEnd} tarihine kadar erişiminiz devam eder.` : ' Erişim yakında sona erecek.'}
          </p>
        )}
        {item.status === 'paused' && (
          <p className="text-blue-700">
            Duraklatıldı.{pauseResumes ? ` ${pauseResumes} tarihinde otomatik devam eder.` : ''}
          </p>
        )}
        {item.status === 'expired' && <p>Sona erdi: {periodEnd}</p>}
      </div>

      {pauseError && <p className="mt-2 text-xs text-red-600">{pauseError}</p>}

      {(item.status === 'active' || item.status === 'paused') && (
        <div className="mt-4 flex items-center justify-end gap-4">
          {item.status === 'active' && (
            <button
              type="button"
              disabled={pauseLoading}
              onClick={() => void handlePause()}
              className="text-xs font-medium text-muted hover:text-blue-600 disabled:opacity-40 transition-colors"
            >
              {pauseLoading ? '…' : 'Duraklat'}
            </button>
          )}
          {item.status === 'paused' && (
            <button
              type="button"
              disabled={pauseLoading}
              onClick={() => void handleResume()}
              className="text-xs font-medium text-primary hover:opacity-80 disabled:opacity-40 transition-colors"
            >
              {pauseLoading ? '…' : 'Devam Ettir'}
            </button>
          )}
          {item.status === 'active' && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-muted hover:text-red-600 transition-colors"
            >
              İptal Et
            </button>
          )}
        </div>
      )}
    </div>
  );
}
