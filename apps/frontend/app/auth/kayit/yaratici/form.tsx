'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

const ERROR_MAP: Record<string, string> = {
  EMAIL_EXISTS: 'Bu email adresi zaten kullanılıyor.',
};

export default function CreatorRegisterForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register/creator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, display_name: displayName, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string; message?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', body.message ?? '');
      }

      // Auto-login so the email verification page can show user email and send resend
      try {
        await login({ email, password });
      } catch {
        // login failure is non-fatal — redirect to verify page anyway
      }

      router.replace('/auth/emaili-dogrula');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(ERROR_MAP[err.code] ?? 'Bir hata oluştu. Lütfen tekrar dene.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar dene.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="display-name" className="text-sm font-medium text-foreground">
          Görünen ad
        </label>
        <input
          id="display-name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Adın veya marka adın"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
          disabled={loading}
        />
      </div>

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
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
          disabled={loading}
        />
        <p className="text-xs text-muted">En az 8 karakter</p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Kayıt yapılıyor…' : 'Kayıt Ol'}
      </button>

      <p className="text-center text-xs text-muted">
        Kayıt olarak Kullanım Koşulları&apos;nı ve Gizlilik Politikası&apos;nı kabul etmiş olursun.
      </p>

      <p className="text-center text-sm text-muted">
        Zaten hesabın var mı?{' '}
        <Link href="/auth/giris" className="text-primary hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
