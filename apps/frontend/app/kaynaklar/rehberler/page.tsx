import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rehberler — lalabits.art',
  description: 'lalabits.art üretici rehberleri — platform kurulumu, üyelik yönetimi ve daha fazlası.',
};

export default function RehberlerPage() {
  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-light mb-8">
        <svg className="h-10 w-10 text-teal" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="6" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M14 14h12M14 20h12M14 26h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-[32px] font-bold text-text-primary tracking-tight mb-4">Rehberler</h1>
      <p className="text-lg text-text-secondary max-w-md leading-[1.7] mb-8">
        Platform kurulumu, üyelik yönetimi ve içerik stratejisi rehberleri yakında yayında.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-teal px-8 py-3 text-sm font-semibold text-white hover:bg-teal-dark transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </main>
  );
}
