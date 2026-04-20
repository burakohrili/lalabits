'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import FanShell from '@/components/FanShell';

export default function MesajlarLayout({ children }: { children: React.ReactNode }) {
  const { status: authStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/mesajlar');
    }
  }, [authStatus, router]);

  if (authStatus === 'loading') {
    return (
      <FanShell>
        <div className="mx-auto max-w-3xl px-4 py-10 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </FanShell>
    );
  }

  if (authStatus === 'unauthenticated') return null;

  return <FanShell>{children}</FanShell>;
}
