'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

type CreatorStatus = 'onboarding' | 'pending_review' | 'approved' | 'rejected' | 'suspended';

interface CreatorDetail {
  id: string;
  display_name: string;
  username: string | null;
  email: string | null;
  bio: string | null;
  category: string;
  avatar_url: string | null;
  status: CreatorStatus;
  created_at: string;
  approved_at: string | null;
  suspended_at: string | null;
  latest_application: {
    id: string;
    decision: string;
    submitted_at: string;
    reviewed_at: string | null;
    rejection_reason: string | null;
    resubmission_count: number;
  } | null;
  stats: {
    active_subscriber_count: number;
    total_posts: number;
    total_products: number;
    total_collections: number;
  };
  moderation_history: {
    id: string;
    action_type: string;
    admin_user_id: string;
    created_at: string;
  }[];
}

const STATUS_LABELS: Record<CreatorStatus, string> = {
  onboarding: 'Onboarding',
  pending_review: 'İnceleme Bekliyor',
  approved: 'Onaylı',
  rejected: 'Reddedildi',
  suspended: 'Askıya Alındı',
};

const STATUS_COLORS: Record<CreatorStatus, string> = {
  onboarding: 'bg-gray-100 text-gray-600',
  pending_review: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  suspended: 'bg-orange-50 text-orange-700',
};

const ACTION_LABELS: Record<string, string> = {
  approve_creator: 'Onaylandı',
  reject_creator: 'Reddedildi',
  suspend_creator: 'Askıya Alındı',
  unsuspend_creator: 'Askı Kaldırıldı',
  remove_content: 'İçerik Kaldırıldı',
  restore_content: 'İçerik Geri Yüklendi',
  dismiss_report: 'Rapor Kapatıldı',
  warn_user: 'Kullanıcı Uyarıldı',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleString('tr-TR');
}

export default function AdminUreticiDetailPage() {
  const params = useParams();
  const profileId = params.id as string;
  const { accessToken, logout } = useAdminAuth();

  const [creator, setCreator] = useState<CreatorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action state
  const [actionNote, setActionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'suspend' | 'unsuspend' | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/creators/${profileId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }
      const data = (await res.json()) as CreatorDetail;
      setCreator(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      } else if (err instanceof ApiError && err.status === 404) {
        setError('Üretici bulunamadı.');
      } else {
        setError('Üretici detayı yüklenemedi.');
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, profileId, logout]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAction(action: 'suspend' | 'unsuspend') {
    if (!accessToken || !creator) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`${API}/admin/creators/${creator.id}/${action}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_note: actionNote.trim() || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }
      setConfirmAction(null);
      setActionNote('');
      await load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      } else if (err instanceof ApiError) {
        const messages: Record<string, string> = {
          PROFILE_ALREADY_SUSPENDED: 'Üretici zaten askıya alınmış.',
          PROFILE_NOT_SUSPENDED: 'Üretici askıya alınmış değil.',
          INVALID_PROFILE_STATUS: 'Bu işlem için geçerli durum: Onaylı.',
        };
        setActionError(messages[err.code] ?? 'İşlem gerçekleştirilemedi.');
      } else {
        setActionError('Sunucu hatası. Tekrar deneyin.');
      }
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-6 py-10">
        <div className="mx-auto max-w-4xl space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (error || !creator) {
    return (
      <main className="min-h-screen bg-background px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <Link href="/admin/ureticiler" className="text-sm text-primary hover:underline">
            ← Üreticiler
          </Link>
          <p className="mt-6 text-sm text-red-600">{error ?? 'Bilinmeyen hata.'}</p>
        </div>
      </main>
    );
  }

  const canSuspend = creator.status === 'approved';
  const canUnsuspend = creator.status === 'suspended';

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link href="/admin/ureticiler" className="text-sm text-primary hover:underline">
            ← Üreticiler
          </Link>
          <span className="text-muted">·</span>
          <h1 className="text-xl font-semibold text-foreground">{creator.display_name}</h1>
          <span className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[creator.status]}`}>
            {STATUS_LABELS[creator.status]}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Profile + Application */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile card */}
            <section className="rounded-xl border border-border bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Profil</h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted">Username</dt>
                  <dd className="font-medium text-foreground">{creator.username ? `@${creator.username}` : '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted">E-posta</dt>
                  <dd className="font-medium text-foreground">{creator.email ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted">Kategori</dt>
                  <dd className="font-medium text-foreground capitalize">{creator.category}</dd>
                </div>
                <div>
                  <dt className="text-muted">Kayıt tarihi</dt>
                  <dd className="font-medium text-foreground">{formatDate(creator.created_at)}</dd>
                </div>
                {creator.approved_at && (
                  <div>
                    <dt className="text-muted">Onay tarihi</dt>
                    <dd className="font-medium text-foreground">{formatDate(creator.approved_at)}</dd>
                  </div>
                )}
                {creator.suspended_at && (
                  <div>
                    <dt className="text-muted">Askıya alınma</dt>
                    <dd className="font-medium text-orange-700">{formatDate(creator.suspended_at)}</dd>
                  </div>
                )}
                {creator.bio && (
                  <div className="col-span-2">
                    <dt className="text-muted">Bio</dt>
                    <dd className="mt-0.5 text-foreground">{creator.bio}</dd>
                  </div>
                )}
              </dl>
            </section>

            {/* Latest application */}
            {creator.latest_application && (
              <section className="rounded-xl border border-border bg-white p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Son Başvuru</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-muted">Karar</dt>
                    <dd className="font-medium text-foreground capitalize">{creator.latest_application.decision}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Başvuru tarihi</dt>
                    <dd className="font-medium text-foreground">{formatDate(creator.latest_application.submitted_at)}</dd>
                  </div>
                  {creator.latest_application.reviewed_at && (
                    <div>
                      <dt className="text-muted">İnceleme tarihi</dt>
                      <dd className="font-medium text-foreground">{formatDate(creator.latest_application.reviewed_at)}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted">Yeniden başvuru</dt>
                    <dd className="font-medium text-foreground">{creator.latest_application.resubmission_count}×</dd>
                  </div>
                  {creator.latest_application.rejection_reason && (
                    <div className="col-span-2">
                      <dt className="text-muted">Red gerekçesi</dt>
                      <dd className="mt-0.5 text-red-700">{creator.latest_application.rejection_reason}</dd>
                    </div>
                  )}
                </dl>
              </section>
            )}

            {/* Moderation history */}
            <section className="rounded-xl border border-border bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Moderasyon Geçmişi</h2>
              {creator.moderation_history.length === 0 ? (
                <p className="text-sm text-muted">Moderasyon kaydı yok.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {creator.moderation_history.map((a) => (
                    <li key={a.id} className="flex items-start justify-between py-2.5 text-sm">
                      <span className="text-foreground font-medium">
                        {ACTION_LABELS[a.action_type] ?? a.action_type}
                      </span>
                      <span className="text-muted text-xs">{formatDate(a.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Right: Stats + Actions */}
          <div className="space-y-6">

            {/* Stats */}
            <section className="rounded-xl border border-border bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">İstatistikler</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Aktif abone</dt>
                  <dd className="font-semibold text-foreground tabular-nums">{creator.stats.active_subscriber_count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Toplam gönderi</dt>
                  <dd className="font-semibold text-foreground tabular-nums">{creator.stats.total_posts}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Ürün</dt>
                  <dd className="font-semibold text-foreground tabular-nums">{creator.stats.total_products}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Koleksiyon</dt>
                  <dd className="font-semibold text-foreground tabular-nums">{creator.stats.total_collections}</dd>
                </div>
              </dl>
            </section>

            {/* Actions */}
            {(canSuspend || canUnsuspend) && (
              <section className="rounded-xl border border-border bg-white p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Yönetim İşlemleri</h2>

                {actionError && (
                  <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    {actionError}
                  </div>
                )}

                {confirmAction ? (
                  <div className="space-y-3">
                    <p className="text-sm text-foreground">
                      {confirmAction === 'suspend'
                        ? `@${creator.username ?? creator.display_name} hesabını askıya almak istediğinizden emin misiniz?`
                        : `@${creator.username ?? creator.display_name} hesabının askısını kaldırmak istediğinizden emin misiniz?`}
                    </p>
                    <textarea
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      placeholder="Admin notu (isteğe bağlı, yalnızca iç kullanım)"
                      rows={2}
                      maxLength={1000}
                      className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void handleAction(confirmAction)}
                        disabled={actionLoading}
                        className={[
                          'flex-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50',
                          confirmAction === 'suspend' ? 'bg-orange-500 hover:opacity-90' : 'bg-green-600 hover:opacity-90',
                        ].join(' ')}
                      >
                        {actionLoading ? '…' : confirmAction === 'suspend' ? 'Askıya Al' : 'Askıyı Kaldır'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setConfirmAction(null); setActionNote(''); setActionError(null); }}
                        disabled={actionLoading}
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface disabled:opacity-50"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {canSuspend && (
                      <button
                        type="button"
                        onClick={() => setConfirmAction('suspend')}
                        className="w-full rounded-lg bg-orange-50 border border-orange-200 px-4 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors"
                      >
                        Hesabı Askıya Al
                      </button>
                    )}
                    {canUnsuspend && (
                      <button
                        type="button"
                        onClick={() => setConfirmAction('unsuspend')}
                        className="w-full rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                      >
                        Askıyı Kaldır
                      </button>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
