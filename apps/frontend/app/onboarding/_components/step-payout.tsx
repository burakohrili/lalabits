'use client';

import { useState } from 'react';
import type { useOnboarding } from '../_hooks/use-onboarding';
import { ApiError } from '@/lib/api-client';

type OnboardingHook = ReturnType<typeof useOnboarding>;

interface Props {
  onboarding: OnboardingHook;
  onNext: () => void;
  onBack: () => void;
}

const IBAN_REGEX = /^TR\d{24}$/;

function validateIban(value: string): string | null {
  const normalized = value.replace(/\s/g, '').toUpperCase();
  if (!normalized) return 'IBAN zorunludur.';
  if (!IBAN_REGEX.test(normalized)) return 'Geçerli bir Türkiye IBAN numarası girin. (örn. TR12 3456 7890 1234 5678 9012 34)';
  return null;
}

function normalizeIban(value: string): string {
  return value.replace(/\s/g, '').toUpperCase();
}

export default function StepPayout({ onboarding, onNext, onBack }: Props) {
  const savedPayout = onboarding.status!.payout;
  const [iban, setIban] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // If payout already saved, show masked summary initially
  const alreadySaved = savedPayout != null;

  async function handleNext() {
    // If already saved and user hasn't entered a new IBAN, advance directly
    if (alreadySaved && !iban.trim()) {
      onNext();
      return;
    }

    const normalized = normalizeIban(iban);
    const validationError = validateIban(normalized);
    if (validationError) {
      setClientError(validationError);
      return;
    }
    setClientError(null);
    setServerError(null);
    setSaving(true);
    try {
      await onboarding.savePayout(normalized);
      onNext();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'INVALID_IBAN_FORMAT') {
          setServerError('IBAN formatı geçersiz. Lütfen kontrol edin.');
        } else {
          setServerError(`Hata: ${err.code}`);
        }
      } else {
        setServerError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setSaving(false);
    }
  }

  const displayError = clientError ?? serverError;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">Ödeme Bilgileri</h2>
        <p className="text-sm text-muted">
          Kazançlarınızın aktarılacağı Türkiye IBAN numaranızı girin.
        </p>
      </div>

      {/* Already saved summary */}
      {alreadySaved && (
        <div className="rounded-xl border border-border bg-background px-4 py-3 flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-muted">Kayıtlı IBAN (son 4 hane)</p>
            <p className="text-sm font-medium text-foreground">•••• {savedPayout.iban_last_four}</p>
          </div>
          <span className={[
            'ml-auto text-xs font-medium rounded-full px-2 py-0.5',
            savedPayout.iban_format_valid
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-600',
          ].join(' ')}>
            {savedPayout.iban_format_valid ? 'Geçerli' : 'Geçersiz'}
          </span>
        </div>
      )}

      {/* IBAN input */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="iban" className="text-sm font-medium text-foreground">
          {alreadySaved ? 'Yeni IBAN Gir (değiştirmek için)' : 'IBAN'}
          {!alreadySaved && <span className="text-accent"> *</span>}
        </label>
        <input
          id="iban"
          type="text"
          value={iban}
          onChange={(e) => {
            setIban(e.target.value);
            setClientError(null);
            setServerError(null);
          }}
          placeholder="TR12 3456 7890 1234 5678 9012 34"
          disabled={saving}
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 font-mono"
        />
        <p className="text-xs text-muted">
          Boşluk bırakabilirsiniz, otomatik olarak temizlenir. Yalnızca TR IBAN kabul edilir.
        </p>
      </div>

      {displayError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{displayError}</p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-background disabled:opacity-50"
        >
          Geri
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={saving || (!alreadySaved && !iban.trim())}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor…' : 'İleri'}
        </button>
      </div>
    </div>
  );
}
