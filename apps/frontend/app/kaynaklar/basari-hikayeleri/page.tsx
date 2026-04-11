import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Başarı Hikayeleri — lalabits.art',
  description: 'Türkiye\'nin içerik üreticilerinin lalabits.art\'taki başarı hikayeleri.',
};

export default function BasariHikayeleriPage() {
  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-light mb-8">
        <svg className="h-10 w-10 text-orange" viewBox="0 0 40 40" fill="none">
          <path d="M20 6l3.5 10.5H34l-9 6.5 3.5 10.5L20 27l-9 6.5 3.5-10.5-9-6.5h10.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="text-[32px] font-bold text-text-primary tracking-tight mb-4">Başarı Hikayeleri</h1>
      <p className="text-lg text-text-secondary max-w-md leading-[1.7] mb-8">
        Türkiye'nin en başarılı içerik üreticilerinin hikayeleri yakında burada.
      </p>
      <Link
        href="/ureticilere"
        className="rounded-xl bg-orange px-8 py-3 text-sm font-semibold text-white hover:bg-orange-dark transition-colors"
      >
        Üreticileri Keşfet
      </Link>
    </main>
  );
}
