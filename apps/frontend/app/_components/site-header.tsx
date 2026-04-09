'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useNotificationBadge } from '@/contexts/notification-badge-context';
import { useChatBadge } from '@/contexts/chat-badge-context';

export default function SiteHeader() {
  const { user, status } = useAuth();
  const { unreadCount } = useNotificationBadge();
  const { unreadCount: chatUnreadCount } = useChatBadge();

  function renderCTA() {
    if (status === 'loading') {
      return <div className="h-8 w-20 rounded-lg bg-gray-100 animate-pulse" />;
    }

    if (!user) {
      return (
        <div className="flex items-center gap-2">
          <Link
            href="/auth/giris"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Giriş Yap
          </Link>
          <Link
            href="/auth/giris?next=/onboarding"
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Başla
          </Link>
        </div>
      );
    }

    if (user.creator_profile) {
      const isApproved = user.creator_profile.status === 'approved';
      return (
        <Link
          href={isApproved ? '/dashboard' : '/onboarding/status'}
          className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          {isApproved ? 'Dashboard' : 'Başvurum'}
        </Link>
      );
    }

    return (
      <Link
        href="/hesabim/faturalarim"
        className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-background transition-colors"
      >
        Hesabım
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-bold text-primary tracking-tight">
          lalabits.art
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/kreatorler"
            className="hidden sm:block text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Kreatörler
          </Link>
          {user && (
            <Link
              href="/mesajlar"
              className="relative text-sm font-medium text-muted hover:text-foreground transition-colors"
              aria-label="Mesajlar"
            >
              <span>Mesajlar</span>
              {chatUnreadCount > 0 && (
                <span className="absolute -top-1.5 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white leading-none">
                  {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                </span>
              )}
            </Link>
          )}
          {user && (
            <Link
              href="/bildirimler"
              className="relative text-sm font-medium text-muted hover:text-foreground transition-colors"
              aria-label="Bildirimler"
            >
              <span>Bildirimler</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white leading-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )}
          {renderCTA()}
        </nav>
      </div>
    </header>
  );
}
