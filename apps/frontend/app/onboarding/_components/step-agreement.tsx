'use client';

import Link from 'next/link';

interface Props {
  agreed: boolean;
  onAgreeChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepAgreement({ agreed, onAgreeChange, onNext, onBack }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">Yaratıcı Sözleşmesi</h2>
        <p className="text-sm text-muted">
          Başvurunuzu tamamlamadan önce lütfen Yaratıcı Sözleşmesi&apos;ni okuyun ve kabul edin.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background px-4 py-4 flex flex-col gap-3">
        <p className="text-sm text-muted">
          Sözleşmeyi yeni sekmede açmak için aşağıdaki bağlantıya tıklayın.
        </p>
        <Link
          href="/legal/yaratici-sozlesmesi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Yaratıcı Sözleşmesi&apos;ni Oku
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4.5 11.5l7-7M6 4.5h5.5V10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreeChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary shrink-0"
        />
        <span className="text-sm text-foreground">
          Yaratıcı Sözleşmesi&apos;ni okudum ve kabul ediyorum.
        </span>
      </label>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-background"
        >
          Geri
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!agreed}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          İleri
        </button>
      </div>
    </div>
  );
}
