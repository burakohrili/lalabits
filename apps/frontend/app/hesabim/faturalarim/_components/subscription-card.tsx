'use client';

import { useState } from 'react';
import Link from 'next/link';
import CancelModal from './cancel-modal';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface SubscriptionItem {
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
  paused_at?: string | null;
  pause_resumes_at?: string | null;
}

interface SubscriptionCardProps {
  item: SubscriptionItem;
  accessToken: string;
  onCancelled: (subscriptionId: string) => void;
  onStatusChange?: (subscriptionId: string, newStatus: string, extra?: Partial<SubscriptionItem>) => void;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'active') {
    return (
      <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
        Aktif
      </span>
    );
  }
  if (status === 'cancelled') {
    return (
      <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
        İptal Edildi
      </span>
    );
  }
  if (status === 'grace_period') {
    return (
      <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
        Ödeme Başarısız
      </span>
    );
  }
  if (status === 'paused') {
    return (
      <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
        Duraklatıldı
      </span>
    );
  }
  return null;
}

export default function SubscriptionCard({
  item,
  accessToken,
  onCancelled,
  onStatusChange,
}: SubscriptionCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [pauseLoading, setPauseLoading] = useState(false);
  const [pauseError, setPauseError] = useState<string | null>(null);

  const periodEndFormatted = new Date(item.current_period_end).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const graceEndFormatted = item.grace_period_ends_at
    ? new Date(item.grace_period_ends_at).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const pauseResumesFormatted = item.pause_resumes_at
    ? new Date(item.pause_resumes_at).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const intervalLabel = item.billing_interval === 'annual' ? 'Yıllık' : 'Aylık';

  async function handlePause() {
    if (pauseLoading) return;
    setPauseLoading(true);
    setPauseError(null);
    try {
      const res = await fetch(`${API}/membership/subscriptions/${item.subscription_id}/pause`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('PAUSE_FAILED');
      const data = (await res.json()) as { pause_resumes_at: string };
      onStatusChange?.(item.subscription_id, 'paused', { pause_resumes_at: data.pause_resumes_at });
    } catch {
      setPauseError('Üyelik duraklatılamadı.');
    } finally {
      setPauseLoading(false);
    }
  }

  async function handleResume() {
    if (pauseLoading) return;
    setPauseLoading(true);
    setPauseError(null);
    try {
      const res = await fetch(`${API}/membership/subscriptions/${item.subscription_id}/resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('RESUME_FAILED');
      onStatusChange?.(item.subscription_id, 'active', { paused_at: null, pause_resumes_at: null });
    } catch {
      setPauseError('Üyelik devam ettirilemedi.');
    } finally {
      setPauseLoading(false);
    }
  }

  return (
    <>
      <div
        className={[
          'rounded-2xl border bg-surface p-5',
          item.status === 'grace_period' ? 'border-amber-300'
            : item.status === 'paused' ? 'border-blue-200'
            : 'border-border',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {item.plan_name ?? 'Üyelik Planı'}
            </p>
            {item.creator_display_name && (
              <p className="mt-0.5 text-xs text-muted">
                {item.creator_display_name}
                {item.creator_username && (
                  <>
                    {' · '}
                    <Link
                      href={`/@${item.creator_username}`}
                      className="hover:underline"
                    >
                      @{item.creator_username}
                    </Link>
                  </>
                )}
              </p>
            )}
            <p className="mt-0.5 text-xs text-muted">{intervalLabel}</p>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Period info */}
        <div className="mt-3 text-xs text-muted">
          {item.status === 'active' && (
            <p>Dönem sonu: {periodEndFormatted}</p>
          )}
          {item.status === 'cancelled' && (
            <p className="text-orange-600">
              {periodEndFormatted} tarihine kadar erişiminiz devam eder
            </p>
          )}
          {item.status === 'grace_period' && (
            <p className="text-amber-700">
              Ödeme alınamadı.{' '}
              {graceEndFormatted
                ? `${graceEndFormatted} tarihine kadar erişiminiz devam eder.`
                : 'Erişim yakında sona erecek.'}
            </p>
          )}
          {item.status === 'paused' && (
            <p className="text-blue-700">
              Duraklatıldı.{' '}
              {pauseResumesFormatted
                ? `${pauseResumesFormatted} tarihinde otomatik devam eder.`
                : ''}
            </p>
          )}
        </div>

        {pauseError && (
          <p className="mt-2 text-xs text-red-600">{pauseError}</p>
        )}

        {/* Actions */}
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
                onClick={() => setShowModal(true)}
                className="text-xs font-medium text-muted hover:text-red-600 transition-colors"
              >
                İptal Et
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <CancelModal
          subscriptionId={item.subscription_id}
          planName={item.plan_name}
          creatorName={item.creator_display_name}
          periodEnd={item.current_period_end}
          accessToken={accessToken}
          onClose={() => setShowModal(false)}
          onCancelled={(id) => {
            setShowModal(false);
            onCancelled(id);
          }}
        />
      )}
    </>
  );
}
