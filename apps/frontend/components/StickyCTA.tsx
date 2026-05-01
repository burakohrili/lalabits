'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { FAN_PANEL_PATHS } from './FanSidebar';

const HIDDEN_PREFIXES = [
  '/auth',
  '/dashboard',
  '/onboarding',
  '/admin',
  ...FAN_PANEL_PATHS,
];

export default function StickyCTA() {
  const pathname = usePathname();
  const { user, status } = useAuth();
  const [visible, setVisible] = useState(false);

  const isHidden =
    HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    (status !== 'loading' && !!user?.creator_profile);

  useEffect(() => {
    if (isHidden) return;

    function onScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHidden]);

  if (isHidden || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Link
        href="/auth/kayit/yaratici"
        className="flex items-center gap-2 rounded-2xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orange/90 transition-colors"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="10" cy="7" r="3" />
          <path d="M10 13v4M8 15h4" strokeLinecap="round" />
        </svg>
        Üretici Hesabı Aç →
      </Link>
    </div>
  );
}
