'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function HesabimiSilPage() {
  const { accessToken, status: authStatus, logout } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/hesabim/hesabimi-sil');
    }
  }, [authStatus, router]);

  async function handleDelete() {
    if (!accessToken || deleting || !password) return;
    setError(null);
    setDeleting(true);

    try {
      const res = await fetch(`${API}/auth/me`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        if (res.status === 403) {
          setError('Şifreniz hatalı. Lütfen tekrar deneyin.');
          return;
        }
        throw new Error('DELETE_FAILED');
      }

      await logout();
      router.replace('/?hesap=silindi');
    } catch {
      setError('Hesap silinemedi. Tekrar deneyin.');
    } finally {
      setDeleting(false);
    }
  }

  if (authStatus === 'loading') {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="h-8 w-48 rounded-lg bg-gray-100 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/hesabim" className="text-sm text-primary hover:underline">
          ← Hesabım
        </Link>
        <span className="text-muted">·</span>
        <h1 className="text-lg font-semibold text-foreground">Hesabımı Sil</h1>
      </div>

      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-semibold text-red-700 mb-2">Bu işlem geri alınamaz</p>
        <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
          <li>Tüm içerikleriniz, mesajlarınız ve geçmişiniz silinecektir.</li>
          <li>Aktif abonelikleriniz sona erecektir.</li>
          <li>Bu e-posta adresiyle tekrar kayıt olabilirsiniz, ancak verileriniz geri gelmez.</li>
        </ul>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Onay için şifrenizi girin
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Şifreniz"
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={deleting || !password}
          className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {deleting ? 'Siliniyor…' : 'Hesabımı Kalıcı Olarak Sil'}
        </button>
      </div>
    </main>
  );
}
