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

export default function FanRegisterForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeKvkk, setAgreeKvkk] = useState(false);

  const allAgreed = agreeTerms && agreeKvkk;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!allAgreed) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register/fan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          display_name: displayName,
          password,
          consent_version: '2025-v1',
          consented_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string; message?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', body.message ?? '');
      }

      try {
        await login({ email, password });
      } catch {
        // login failure is non-fatal
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
          placeholder="Adın veya takma adın"
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

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface/50 px-4 py-3">
        <p className="text-xs font-medium text-foreground">Onaylar (zorunlu)</p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
          />
          <span className="text-xs text-foreground leading-relaxed">
            <Link href="/kullanim-sartlari" target="_blank" className="font-semibold text-primary hover:underline">
              Kullanım Koşulları
            </Link>
            &apos;nı ve{' '}
            <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="font-semibold text-primary hover:underline">
              Mesafeli Satış Sözleşmesi
            </Link>
            &apos;ni okudum, anladım ve kabul ediyorum.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeKvkk}
            onChange={(e) => setAgreeKvkk(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
          />
          <span className="text-xs text-foreground leading-relaxed">
            Kişisel verilerimin platform hizmetleri ve ödeme altyapısı için 6698 sayılı KVKK kapsamında işleneceğini okudum ve onaylıyorum.{' '}
            <Link href="/gizlilik" target="_blank" className="text-primary hover:underline">
              Gizlilik Politikası
            </Link>
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !allAgreed}
        className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Kayıt yapılıyor…' : 'Kayıt Ol'}
      </button>

      <p className="text-center text-sm text-muted">
        Zaten hesabın var mı?{' '}
        <Link href="/auth/giris" className="text-primary hover:underline">
          Giriş yap
        </Link>
      </p>

      <div className="border-t border-border pt-4 text-center">
        <p className="text-xs text-muted mb-1">İçerik üretmek mi istiyorsun?</p>
        <Link href="/auth/kayit/yaratici" className="text-sm font-medium text-primary hover:underline">
          Üretici olarak kayıt ol →
        </Link>
      </div>
    </form>
  );
}
