'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl font-bold text-foreground">Hata</p>
      <p className="mt-3 text-lg text-muted">Bir şeyler ters gitti.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Tekrar dene
      </button>
    </main>
  );
}
