import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl font-bold text-foreground">404</p>
      <p className="mt-3 text-lg text-muted">Sayfa bulunamadı.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Ana sayfaya dön
      </Link>
    </main>
  );
}
