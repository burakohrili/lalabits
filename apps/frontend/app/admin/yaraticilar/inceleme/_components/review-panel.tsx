'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface MembershipPlanItem {
  id: string;
  name: string;
  price_monthly_try: number;
  price_annual_try: number | null;
  tier_rank: number;
  status: string;
}

interface ApplicationDetail {
  id: string;
  submitted_at: string;
  reviewed_at: string | null;
  decision: string;
  rejection_reason: string | null;
  resubmission_count: number;
  iban_last_four: string;
  iban_format_valid: boolean;
  agreement_version: {
    version_identifier: string;
    effective_date: string;
  } | null;
  creator_profile: {
    id: string;
    display_name: string;
    username: string | null;
    category: string;
    content_format_tags: string[];
    bio: string | null;
    status: string;
  };
  creator_email: string;
  membership_plans: MembershipPlanItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  writer: 'Yazar',
  illustrator: 'İllüstratör',
  educator: 'Eğitimci',
  podcaster: 'Podcaster',
  musician: 'Müzisyen',
  designer: 'Tasarımcı',
  developer: 'Geliştirici',
  other: 'Diğer',
};

const PLAN_STATUS_LABELS: Record<string, string> = {
  draft: 'Taslak',
  published: 'Yayında',
  hidden: 'Gizli',
  archived: 'Arşivlendi',
};

interface Props {
  applicationId: string;
  accessToken: string;
  onReviewed: (id: string) => void;
  onClose: () => void;
  onAuthError: () => void;
}

type ActionState = 'idle' | 'approving' | 'rejecting' | 'suspending';

async function adminFetch<T>(
  path: string,
  accessToken: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { code?: string; message?: string };
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', body.message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export default function ReviewPanel({
  applicationId,
  accessToken,
  onReviewed,
  onClose,
  onAuthError,
}: Props) {
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>('idle');
  const [actionError, setActionError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    setDetail(null);
    setLoadError(null);
    setActionError(null);
    setRejectReason('');
    setShowRejectForm(false);
    setActionState('idle');

    async function load() {
      try {
        const data = await adminFetch<ApplicationDetail>(
          `/admin/creator-applications/${applicationId}`,
          accessToken,
        );
        setDetail(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          onAuthError();
        } else {
          setLoadError('Detay yüklenemedi.');
        }
      }
    }

    void load();
  }, [applicationId, accessToken, onAuthError]);

  async function handleApprove() {
    setActionError(null);
    setActionState('approving');
    try {
      await adminFetch(
        `/admin/creator-applications/${applicationId}/approve`,
        accessToken,
        { method: 'POST' },
      );
      onReviewed(applicationId);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError();
      } else if (err instanceof ApiError && err.status === 409) {
        setActionError('Bu başvuru zaten değerlendirilmiş.');
      } else {
        setActionError('İşlem başarısız. Tekrar deneyin.');
      }
      setActionState('idle');
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    setActionError(null);
    setActionState('rejecting');
    try {
      await adminFetch(
        `/admin/creator-applications/${applicationId}/reject`,
        accessToken,
        { method: 'POST', body: JSON.stringify({ rejection_reason: rejectReason.trim() }) },
      );
      onReviewed(applicationId);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError();
      } else if (err instanceof ApiError && err.status === 409) {
        setActionError('Bu başvuru zaten değerlendirilmiş.');
      } else {
        setActionError('İşlem başarısız. Tekrar deneyin.');
      }
      setActionState('idle');
    }
  }

  async function handleSuspend() {
    setActionError(null);
    setActionState('suspending');
    try {
      await adminFetch(
        `/admin/creator-applications/${applicationId}/suspend`,
        accessToken,
        { method: 'POST', body: JSON.stringify({}) },
      );
      onReviewed(applicationId);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError();
      } else if (err instanceof ApiError && err.status === 409) {
        setActionError('Bu yaratıcı zaten askıya alınmış.');
      } else if (err instanceof ApiError && err.status === 422) {
        setActionError('Bu işlem yalnızca onaylanmış yaratıcılar için geçerlidir.');
      } else {
        setActionError('İşlem başarısız. Tekrar deneyin.');
      }
      setActionState('idle');
    }
  }

  const busy = actionState !== 'idle';
  const isApprovedCreator = detail?.creator_profile.status === 'approved';

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">Başvuru Detayı</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-muted hover:text-foreground"
          aria-label="Kapat"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {!detail && !loadError && (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {loadError && (
          <p className="py-6 text-center text-sm text-red-600">{loadError}</p>
        )}

        {detail && (
          <div className="flex flex-col gap-4">
            {/* Creator info */}
            <section className="flex flex-col gap-2">
              <Row label="Görünen Ad" value={detail.creator_profile.display_name} />
              {detail.creator_profile.username && (
                <Row label="Kullanıcı Adı" value={`@${detail.creator_profile.username}`} />
              )}
              <Row label="Email" value={detail.creator_email} />
              {detail.creator_profile.bio && (
                <Row label="Biyografi" value={detail.creator_profile.bio} truncate />
              )}
            </section>

            <hr className="border-border" />

            {/* Category */}
            <section className="flex flex-col gap-2">
              <Row
                label="Kategori"
                value={CATEGORY_LABELS[detail.creator_profile.category] ?? detail.creator_profile.category}
              />
              {detail.creator_profile.content_format_tags.length > 0 && (
                <Row
                  label="Formatlar"
                  value={detail.creator_profile.content_format_tags.join(', ')}
                />
              )}
            </section>

            <hr className="border-border" />

            {/* Payout */}
            <section className="flex flex-col gap-2">
              <Row label="IBAN (son 4)" value={`•••• ${detail.iban_last_four}`} />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">IBAN Format</span>
                {detail.iban_format_valid ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    ✓ Geçerli
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                    ✗ Hatalı format
                  </span>
                )}
              </div>
            </section>

            {/* Membership plans */}
            {detail.membership_plans.length > 0 && (
              <>
                <hr className="border-border" />
                <section className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted">Üyelik Planları</p>
                  {detail.membership_plans.map((plan) => (
                    <div key={plan.id} className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-foreground">{plan.name}</p>
                        <p className="text-xs text-muted">
                          {(plan.price_monthly_try / 100).toFixed(2)} ₺/ay
                          {plan.price_annual_try != null && (
                            <> · {(plan.price_annual_try / 100).toFixed(2)} ₺/yıl</>
                          )}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted">
                        {PLAN_STATUS_LABELS[plan.status] ?? plan.status}
                      </span>
                    </div>
                  ))}
                </section>
              </>
            )}

            <hr className="border-border" />

            {/* Meta */}
            <section className="flex flex-col gap-2">
              <Row
                label="Gönderilme"
                value={new Date(detail.submitted_at).toLocaleDateString('tr-TR', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              />
              {detail.resubmission_count > 0 && (
                <Row label="Yeniden Başvuru" value={`${detail.resubmission_count}. kez`} />
              )}
              {detail.agreement_version && (
                <Row label="Sözleşme" value={detail.agreement_version.version_identifier} />
              )}
            </section>

            {/* Action error */}
            {actionError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{actionError}</p>
            )}

            {/* Reject form — only for pending */}
            {!isApprovedCreator && showRejectForm && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-foreground">
                  Red nedeni <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Red gerekçesini yazın…"
                  disabled={busy}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowRejectForm(false); setRejectReason(''); }}
                    disabled={busy}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-background disabled:opacity-50"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={busy || !rejectReason.trim()}
                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionState === 'rejecting' ? 'Reddediliyor…' : 'Reddet'}
                  </button>
                </div>
              </div>
            )}

            {/* Primary actions */}
            {isApprovedCreator ? (
              /* Approved creator → Suspend only */
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSuspend}
                  disabled={busy}
                  className="w-full rounded-lg border border-amber-300 px-3 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                >
                  {actionState === 'suspending' ? 'Askıya Alınıyor…' : 'Askıya Al'}
                </button>
              </div>
            ) : (
              /* Pending creator → Approve + Reject only */
              !showRejectForm && (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(true)}
                    disabled={busy}
                    className="flex-1 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Reddet
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={busy}
                    className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    {actionState === 'approving' ? 'Onaylanıyor…' : 'Onayla'}
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-xs text-muted">{label}</span>
      <span className={['text-right text-sm text-foreground', truncate ? 'line-clamp-2' : ''].join(' ')}>
        {value}
      </span>
    </div>
  );
}
