'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

const RESEND_COOLDOWN_S = 60;

export default function EmailiDogrulaPage() {
  const { accessToken, user } = useAuth();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  async function handleResend() {
    if (!accessToken) {
      setError('Oturumun bulunamadı. Lütfen tekrar giriş yap.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/email-verify/resend`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        if (body.code === 'ALREADY_VERIFIED') {
          setError('Email adresin zaten doğrulanmış. Sayfayı yenile veya yeniden giriş yap.');
        } else {
          setError('Bir hata oluştu. Lütfen tekrar dene.');
        }
        return;
      }
      setSent(true);
      // Start cooldown timer
      setCooldown(RESEND_COOLDOWN_S);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError('Bir hata oluştu. Lütfen tekrar dene.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar dene.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm flex flex-col gap-6 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-foreground">Emailini Doğrula</h1>
            <p className="text-sm text-muted">
              {user?.email
                ? <>
                    <span className="font-medium text-foreground">{user.email}</span>
                    {' '}adresine bir doğrulama bağlantısı gönderdik.
                    Gelen kutunu kontrol et ve bağlantıya tıkla.
                  </>
                : 'Kayıt olurken verdiğin email adresine bir doğrulama bağlantısı gönderdik.'}
            </p>
          </div>

          {sent && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              Yeni doğrulama bağlantısı gönderildi. Lütfen gelen kutunu kontrol et.
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={handleResend}
            disabled={loading || cooldown > 0}
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-background disabled:opacity-50"
          >
            {loading
              ? 'Gönderiliyor…'
              : cooldown > 0
              ? `Tekrar gönder (${cooldown}s)`
              : 'Yeniden Gönder'}
          </button>

          <Link href="/auth/giris" className="text-sm text-muted hover:underline">
            Farklı bir hesapla giriş yap
          </Link>
        </div>
      </div>
    </main>
  );
}
