import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kariyer — lalabits.art',
  description: 'lalabits.art\'ta kariyer fırsatları. Türkiye\'nin içerik platformunu birlikte inşa edelim.',
};

export default function KariyerPage() {
  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-light mb-8">
        <svg className="h-10 w-10 text-orange" viewBox="0 0 40 40" fill="none">
          <rect x="10" y="16" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M14 16v-4a6 6 0 0 1 12 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 24v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-[32px] font-bold text-text-primary tracking-tight mb-4">Kariyer</h1>
      <p className="text-lg text-text-secondary max-w-md leading-[1.7] mb-8">
        Türkiye&apos;nin içerik platformunu birlikte inşa etmek ister misin?
        Açık pozisyonlar yakında burada.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="mailto:kariyer@lalabits.art"
          className="rounded-xl bg-orange px-8 py-3 text-sm font-semibold text-white hover:bg-orange-dark transition-colors"
        >
          kariyer@lalabits.art
        </a>
        <Link
          href="/"
          className="rounded-xl border border-border px-8 py-3 text-sm font-semibold text-text-primary hover:bg-teal-light hover:border-teal hover:text-teal transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </main>
  );
}
