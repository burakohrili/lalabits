import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Destek Merkezi — lalabits.art',
  description: 'lalabits.art destek merkezi. Sık sorulan sorular ve yardım kaynakları.',
};

export default function DestekPage() {
  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-light mb-8">
        <svg className="h-10 w-10 text-teal" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
          <path d="M20 22v-1a4 4 0 1 0-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="27" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <h1 className="text-[32px] font-bold text-text-primary tracking-tight mb-4">Destek Merkezi</h1>
      <p className="text-lg text-text-secondary max-w-md leading-[1.7] mb-8">
        Destek merkezimiz hazırlanıyor. Sorularınız için şu an bize e-posta ile ulaşabilirsiniz.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="mailto:destek@lalabits.art"
          className="rounded-xl bg-teal px-8 py-3 text-sm font-semibold text-white hover:bg-teal-dark transition-colors"
        >
          destek@lalabits.art
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
