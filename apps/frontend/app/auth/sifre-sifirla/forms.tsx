'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { code?: string; message?: string };
    throw new ApiError(res.status, err.code ?? 'UNKNOWN', err.message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── Step A: email form ─────────────────────────────────────────────────────

export function RequestForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Backend always returns 200 regardless of whether email exists (enumeration protection)
      await apiPost('/auth/password-reset/request', { email });
      setDone(true);
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-foreground">
          Eğer bu e-posta adresiyle bir hesap varsa, şifre sıfırlama linki gönderildi.
          Lütfen gelen kutunuzu kontrol edin.
        </p>
        <Link href="/auth/giris" className="text-sm text-primary hover:underline">
          Giriş sayfasına dön
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email adresi
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

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Gönderiliyor…' : 'Sıfırlama Linki Gönder'}
      </button>

      <p className="text-center text-sm text-muted">
        <Link href="/auth/giris" className="text-primary hover:underline">
          Giriş sayfasına dön
        </Link>
      </p>
    </form>
  );
}

// ── Step B: new password form ──────────────────────────────────────────────

export function ConfirmForm({ token }: { token: string }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ERROR_MAP: Record<string, string> = {
    INVALID_TOKEN: 'Bu bağlantı geçersiz veya süresi dolmuş.',
    TOKEN_ALREADY_USED: 'Bu bağlantı daha önce kullanılmış.',
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiPost('/auth/password-reset/confirm', { token, new_password: newPassword });
      router.replace('/auth/giris');
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
        <label htmlFor="new-password" className="text-sm font-medium text-foreground">
          Yeni şifre
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
        {loading ? 'Kaydediliyor…' : 'Şifreyi Güncelle'}
      </button>
    </form>
  );
}
