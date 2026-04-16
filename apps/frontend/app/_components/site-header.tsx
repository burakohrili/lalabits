'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNotificationBadge } from '@/contexts/notification-badge-context';
import { useChatBadge } from '@/contexts/chat-badge-context';

/* ── Logo wordmark ──────────────────────────────────────────── */
function Logo({ white = false }: { white?: boolean }) {
  const textColor = white ? '#FFFFFF' : '#212121';
  return (
    <svg
      width="142"
      height="24"
      viewBox="0 0 142 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="lalabits.art"
    >
      <text
        x="0"
        y="19"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="400"
        fill={textColor}
      >
        lala
      </text>
      <text
        x="47"
        y="19"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="#FF5722"
      >
        bits
      </text>
      <text
        x="92"
        y="19"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="400"
        fill={textColor}
      >
        .art
      </text>
    </svg>
  );
}

/* ── Dropdown nav ───────────────────────────────────────────── */
function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 text-[15px] text-text-secondary hover:text-text-primary transition-colors duration-150 py-2">
        {label}
        <svg
          className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-180"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
        <div className="bg-white border border-border rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.12)] py-2 min-w-[180px]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Sağ CTA ────────────────────────────────────────────────── */
function HeaderCTA() {
  const { user, status } = useAuth();
  const { unreadCount } = useNotificationBadge();
  const { unreadCount: chatUnreadCount } = useChatBadge();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-16 rounded-lg bg-gray-100 animate-pulse" />
        <div className="h-8 w-20 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/giris"
          className="px-3 py-2 text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
        >
          Giriş yap
        </Link>
        <Link
          href="/kayit/uretici"
          className="rounded-xl bg-orange px-5 py-2 text-sm font-semibold text-white hover:bg-orange-dark transition-colors duration-150"
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
        href={isApproved ? '/dashboard' : '/onboarding'}
        className="rounded-xl bg-teal px-5 py-2 text-sm font-semibold text-white hover:bg-teal-dark transition-colors duration-150"
      >
        {isApproved ? 'Panel' : 'Başvurum'}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/akis"
        className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        Akış
      </Link>
      <Link
        href="/mesajlar"
        className="relative text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        Mesajlar
        {chatUnreadCount > 0 && (
          <span className="absolute -top-1.5 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[10px] font-bold text-white leading-none">
            {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
          </span>
        )}
      </Link>
      <Link
        href="/bildirimler"
        className="relative text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        Bildirimler
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[10px] font-bold text-white leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Link>
      <Link
        href="/hesabim/faturalarim"
        className="rounded-xl border border-border px-5 py-2 text-sm font-semibold text-text-primary hover:bg-background transition-colors duration-150"
      >
        Hesabım
      </Link>
    </div>
  );
}

/* ── Ana Header ─────────────────────────────────────────────── */
export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const kaynaklar = [
    { label: 'Blog', href: '/blog' },
    { label: 'Rehberler', href: '/kaynaklar/rehberler' },
    { label: 'Başarı Hikayeleri', href: '/kaynaklar/basari-hikayeleri' },
  ];

  const sirket = [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Basın', href: '/basin' },
    { label: 'Kariyer', href: '/kariyer' },
    { label: 'İletişim', href: '/iletisim' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/kesfet"
            className="text-[15px] text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            Keşfet
          </Link>
          <Link
            href="/ozellikler"
            className="text-[15px] text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            Özellikler
          </Link>
          <Link
            href="/fiyatlar"
            className="text-[15px] text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            Fiyatlar
          </Link>
          <NavDropdown label="Kaynaklar" items={kaynaklar} />
          <NavDropdown label="Şirket" items={sirket} />
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex">
          <HeaderCTA />
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menüyü aç/kapat"
        >
          <svg
            className="h-6 w-6 text-text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menü */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {[
              { label: 'Keşfet', href: '/kesfet' },
              { label: 'Özellikler', href: '/ozellikler' },
              { label: 'Fiyatlar', href: '/fiyatlar' },
              { label: 'Blog', href: '/blog' },
              { label: 'Rehberler', href: '/kaynaklar/rehberler' },
              { label: 'Hakkımızda', href: '/hakkimizda' },
              { label: 'İletişim', href: '/iletisim' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-base font-medium text-text-secondary hover:text-text-primary border-b border-border/50 last:border-0 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 pb-6 flex flex-col gap-3">
            <Link
              href="/auth/giris"
              className="w-full rounded-xl border border-border py-3 text-center text-sm font-semibold text-text-primary hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Giriş yap
            </Link>
            <Link
              href="/kayit/uretici"
              className="w-full rounded-xl bg-orange py-3 text-center text-sm font-semibold text-white hover:bg-orange-dark transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Başla
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
