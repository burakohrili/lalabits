import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — lalabits.art',
  description: 'lalabits.art blogu — içerik üreticileri için ipuçları, haberler ve ilham.',
};

export default function BlogPage() {
  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-light mb-8">
        <svg className="h-10 w-10 text-teal" viewBox="0 0 40 40" fill="none">
          <path d="M8 32V10a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v22l-12-5-12 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 16h12M14 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-[32px] font-bold text-text-primary tracking-tight mb-4">Blog</h1>
      <p className="text-lg text-text-secondary max-w-md leading-[1.7] mb-8">
        İçerik üreticileri için ipuçları, platform haberleri ve ilham verici hikayeler yakında burada.
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
