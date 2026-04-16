'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';

const ERROR_MAP: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email veya şifre hatalı.',
  ACCOUNT_SUSPENDED: 'Hesabınız askıya alınmıştır. Destek için iletişime geçin.',
};

function resolveRedirect(user: {
  email_verified_at: string | null;
  is_admin: boolean;
  creator_profile: { status: string } | null;
}, next: string | null): string {
  if (!user.email_verified_at) return '/auth/emaili-dogrula';
  if (user.is_admin) return next ?? '/admin';
  if (!user.creator_profile) return next ?? '/kesfet';
  const s = user.creator_profile.status;
  if (s === 'approved') return next ?? '/dashboard';
  return '/onboarding';
}

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login({ email, password });
      router.replace(resolveRedirect(user, next));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(ERROR_MAP[err.code] ?? 'Bir hata oluştu. Lütfen tekrar deneyin.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@mail.com"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Şifre
          </label>
          <Link
            href="/auth/sifre-sifirla"
            className="text-xs text-primary hover:underline"
          >
            Şifremi unuttum
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
          disabled={loading}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
      </button>

      <p className="text-center text-sm text-muted">
        Hesabın yok mu?{' '}
        <Link href="/auth/kayit" className="text-primary hover:underline">
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
