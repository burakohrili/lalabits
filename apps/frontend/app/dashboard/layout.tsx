'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import DashboardPendingView from './_components/dashboard-pending-view';
import DashboardRejectedView from './_components/dashboard-rejected-view';
import DashboardSuspendedView from './_components/dashboard-suspended-view';

const NAV_ITEMS = [
  { label: 'Genel Bakış', href: '/dashboard' },
  { label: 'Üyelik Planları', href: '/dashboard/uyelik-planlari' },
  { label: 'Gönderiler', href: '/dashboard/gonderiler' },
  { label: 'Mağaza', href: '/dashboard/magaza' },
  { label: 'Koleksiyonlar', href: '/dashboard/koleksiyonlar' },
  { label: 'İstatistikler', href: '/dashboard/istatistikler' },
  { label: 'Rozetlerim', href: '/dashboard/milestones' },
  { label: 'Profil Düzenle', href: '/dashboard/profil-duzenle' },
  { label: 'Ayarlar', href: '/dashboard/ayarlar' },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status: authStatus, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/dashboard');
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === 'authenticated' && user?.creator_profile?.status === 'onboarding') {
      router.replace('/onboarding');
    }
  }, [authStatus, user?.creator_profile?.status, router]);

  if (authStatus === 'loading') {
    return (
      <main className="flex flex-1 items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (authStatus === 'unauthenticated') {
    return null;
  }

  const creatorStatus = user?.creator_profile?.status;

  if (creatorStatus === 'onboarding') {
    return null;
  }

  if (creatorStatus === 'pending_review') {
    return <DashboardPendingView />;
  }

  if (creatorStatus === 'rejected') {
    return <DashboardRejectedView />;
  }

  if (creatorStatus === 'suspended') {
    return <DashboardSuspendedView />;
  }

  if (!creatorStatus) {
    return (
      <main className="flex flex-1 items-center justify-center min-h-screen px-4 py-12">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm text-center max-w-sm w-full">
          <p className="text-sm text-muted">Üretici profili bulunamadı.</p>
        </div>
      </main>
    );
  }

  // approved — render shell
  const displayName = user?.creator_profile?.display_name ?? '';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
        <div className="px-5 py-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">lalabits.art</p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">{displayName}</p>
        </div>
        <nav className="flex-1 px-3 pb-4">
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-muted hover:bg-background hover:text-foreground',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="px-3 pb-5 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-background hover:text-red-500 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center border-b border-border bg-surface px-6">
          <p className="text-sm font-medium text-foreground">Kontrol Paneli</p>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
