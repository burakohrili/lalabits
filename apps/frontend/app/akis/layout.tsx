'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function AkisLayout({ children }: { children: React.ReactNode }) {
  const { status: authStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/akis');
    }
  }, [authStatus, router]);

  if (authStatus === 'loading') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (authStatus === 'unauthenticated') return null;

  return <>{children}</>;
}
