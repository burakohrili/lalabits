'use client';

import { useState } from 'react';
import type { useOnboarding } from '../_hooks/use-onboarding';
import { ApiError } from '@/lib/api-client';

type OnboardingHook = ReturnType<typeof useOnboarding>;

interface Props {
  onboarding: OnboardingHook;
  onBack: () => void;
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

export default function StepConfirm({ onboarding, onBack }: Props) {
  const { profile, category, plans, payout } = onboarding.status!;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await onboarding.submit();
      // Auth context updated by submit() via refreshToken().
      // page.tsx will re-render and show PendingView automatically.
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'ALREADY_SUBMITTED' || err.status === 409) {
          // Already submitted — auth context refresh may not have propagated yet.
          // Trigger another refresh to ensure PendingView shows.
          await onboarding.submit().catch(() => null);
        } else if (err.status === 503) {
          setError('Sözleşme sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
        } else if (err.code === 'ONBOARDING_INCOMPLETE') {
          setError('Tüm adımlar tamamlanmamış. Lütfen geri dönüp eksik alanları doldurun.');
        } else {
          setError(`Bir hata oluştu (${err.code}). Lütfen tekrar deneyin.`);
        }
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">Başvuruyu Gönder</h2>
        <p className="text-sm text-muted">
          Bilgilerinizi kontrol edin ve başvurunuzu gönderin.
        </p>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-3">
        {/* Profile */}
        <SummaryRow label="Görünen Ad" value={profile.display_name ?? '—'} />
        {profile.bio && <SummaryRow label="Biyografi" value={profile.bio} truncate />}
        {profile.avatar_url && (
          <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-xs text-muted">Profil Fotoğrafı</span>
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
        )}

        {/* Category */}
        <SummaryRow
          label="Kategori"
          value={category.category ? (CATEGORY_LABELS[category.category] ?? category.category) : '—'}
        />
        {category.content_format_tags.length > 0 && (
          <SummaryRow label="Formatlar" value={category.content_format_tags.join(', ')} />
        )}

        {/* Plans */}
        <div className="py-2 border-b border-border">
          <p className="text-xs text-muted mb-1.5">Üyelik Planları</p>
          {plans.length === 0 ? (
            <p className="text-sm text-red-600">Plan bulunamadı — geri dönüp plan ekleyin.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {plans.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{p.name}</span>
                  <span className="text-muted">{p.price_monthly_try} TL / ay</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Payout */}
        {payout && (
          <SummaryRow label="IBAN (son 4)" value={`•••• ${payout.iban_last_four}`} />
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-background disabled:opacity-50"
        >
          Geri
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || plans.length === 0 || !payout}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? 'Gönderiliyor…' : 'Başvuruyu Gönder'}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted shrink-0">{label}</span>
      <span className={['text-sm text-foreground text-right', truncate ? 'line-clamp-2' : ''].join(' ')}>
        {value}
      </span>
    </div>
  );
}
