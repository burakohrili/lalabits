'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function HeroSecondaryCTA() {
  const { user, status } = useAuth();

  // Creator of any status — CTA hidden (they're already in the ecosystem)
  if (status === 'authenticated' && user?.creator_profile) {
    return null;
  }

  const href =
    status === 'authenticated' ? '/onboarding' : '/auth/giris?next=/onboarding';

  return (
    <Link
      href={href}
      className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
    >
      Kreatör Ol
    </Link>
  );
}
