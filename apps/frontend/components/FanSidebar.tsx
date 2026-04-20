'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useNotificationBadge } from '@/contexts/notification-badge-context';
import { useChatBadge } from '@/contexts/chat-badge-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Subscription {
  id: string;
  status: string;
  creator_profile: {
    username: string | null;
    display_name: string;
    avatar_url: string | null;
  };
}

const FAN_PANEL_PATHS = ['/akis', '/kutuphane', '/bildirimler', '/mesajlar', '/hesabim'];

function NavItem({
  href,
  label,
  badge,
  children,
}: {
  href: string;
  label: string;
  badge?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={[
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-teal/10 text-teal'
          : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary',
      ].join(' ')}
    >
      <span className="h-5 w-5 shrink-0">{children}</span>
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1.5 text-[10px] font-bold text-white leading-none">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export default function FanSidebar() {
  const { user, accessToken } = useAuth();
  const { unreadCount } = useNotificationBadge();
  const { unreadCount: chatUnreadCount } = useChatBadge();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  useEffect(() => {
    if (!accessToken) { setLoadingSubs(false); return; }

    fetch(`${API}/membership/subscriptions`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((data: unknown) => {
        const items = Array.isArray(data) ? data : (data as { items?: Subscription[] }).items ?? [];
        setSubscriptions(items as Subscription[]);
      })
      .catch(() => setSubscriptions([]))
      .finally(() => setLoadingSubs(false));
  }, [user?.id]);

  const isCreator = !!user?.creator_profile;

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-white">
      <div className="flex flex-col flex-1 overflow-y-auto px-3 py-4 gap-1">

        <NavItem href="/akis" label="Akış">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" strokeLinejoin="round" />
            <path d="M7 18v-6h6v6" strokeLinejoin="round" />
          </svg>
        </NavItem>

        <NavItem href="/kesfet" label="Keşfet">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="10" cy="10" r="7" />
            <path d="M13.5 6.5l-2 4-4 2 2-4 4-2z" strokeLinejoin="round" />
          </svg>
        </NavItem>

        <NavItem href="/mesajlar" label="Mesajlar" badge={chatUnreadCount}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M17 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11l4 4V3a1 1 0 0 0-1-1z" strokeLinejoin="round" />
          </svg>
        </NavItem>

        <NavItem href="/bildirimler" label="Bildirimler" badge={unreadCount}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M10 2a6 6 0 0 1 6 6v3l1.5 2.5H2.5L4 11V8a6 6 0 0 1 6-6z" strokeLinejoin="round" />
            <path d="M8 16a2 2 0 0 0 4 0" strokeLinecap="round" />
          </svg>
        </NavItem>

        <NavItem href="/kutuphane" label="Kütüphane">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 3h3v14H4zM9 3h3v14H9zM14 3l4 2v10l-4 2V3z" strokeLinejoin="round" />
          </svg>
        </NavItem>

        <NavItem href="/hesabim" label="Hesabım">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="10" cy="7" r="3" />
            <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" strokeLinecap="round" />
          </svg>
        </NavItem>

        <div className="mt-4 px-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
            Üyeliklerim
          </p>
        </div>

        {loadingSubs && (
          <div className="flex flex-col gap-2 px-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gray-100 animate-pulse shrink-0" />
                <div className="h-3 flex-1 rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {!loadingSubs && subscriptions.length === 0 && (
          <div className="px-3">
            <p className="text-xs text-muted mb-2">Henüz üye olmadığın üretici yok.</p>
            <Link
              href="/kesfet"
              className="text-xs font-medium text-teal hover:underline"
            >
              Üretici keşfet →
            </Link>
          </div>
        )}

        {!loadingSubs && subscriptions.map((sub) => (
          <Link
            key={sub.id}
            href={sub.creator_profile.username ? `/u/${sub.creator_profile.username}` : '#'}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-colors"
          >
            {sub.creator_profile.avatar_url ? (
              <Image
                src={sub.creator_profile.avatar_url}
                alt={sub.creator_profile.display_name}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover shrink-0"
              />
            ) : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-semibold text-teal">
                {sub.creator_profile.display_name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="truncate text-xs font-medium">{sub.creator_profile.display_name}</span>
          </Link>
        ))}
      </div>

      {!isCreator && (
        <div className="border-t border-border px-3 py-4">
          <Link
            href="/auth/kayit/yaratici"
            className="flex items-center gap-2 rounded-xl bg-orange/10 px-3 py-2.5 text-sm font-medium text-orange hover:bg-orange/20 transition-colors"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="10" cy="7" r="3" />
              <path d="M10 13v4M8 15h4" strokeLinecap="round" />
            </svg>
            Üretici Ol
          </Link>
        </div>
      )}
    </aside>
  );
}

export { FAN_PANEL_PATHS };
