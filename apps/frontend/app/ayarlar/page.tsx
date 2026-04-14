'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function AyarlarPage() {
  const { status: authStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/ayarlar');
    }
  }, [authStatus, router]);

  if (authStatus === 'loading') {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="h-8 w-48 rounded-lg bg-gray-100 animate-pulse" />
      </main>
    );
  }

  const items: { href: string; title: string; description: string; badge?: string }[] = [
    {
      href: '/ayarlar/engellenenler',
      title: 'Engellenen Kullanıcılar',
      description: 'Engellediğin kullanıcıları görüntüle ve yönet.',
    },
    {
      href: '/ayarlar/bildirimler',
      title: 'Bildirim Tercihleri',
      description: 'E-posta ve uygulama bildirimi tercihlerini ayarla.',
    },
  ];

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Ayarlar</h1>
        <p className="mt-1 text-sm text-muted">Hesap ve uygulama tercihlerini yönet.</p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5 hover:border-primary/40 transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                {item.title}
                {item.badge && (
                  <span className="rounded-full bg-muted/20 px-2 py-0.5 text-xs text-muted">
                    {item.badge}
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-muted">{item.description}</p>
            </div>
            <span className="text-muted text-lg">›</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
