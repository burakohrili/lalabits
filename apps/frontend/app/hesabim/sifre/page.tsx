'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function HesabimSifrePage() {
  const { accessToken, status: authStatus } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/hesabim/sifre');
    }
  }, [authStatus, router]);

  async function handleSave() {
    if (!accessToken || saving) return;
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalıdır.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });

      if (!res.ok) {
        if (res.status === 403) {
          setError('Mevcut şifreniz hatalı.');
          return;
        }
        throw new Error('SAVE_FAILED');
      }

      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setSuccess(true);
    } catch {
      setError('Şifre değiştirilemedi. Tekrar deneyin.');
    } finally {
      setSaving(false);
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
        <h1 className="text-lg font-semibold text-foreground">Şifre Değiştir</h1>
      </div>

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Şifreniz güncellendi.
        </div>
      )}
      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Mevcut Şifre
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Yeni Şifre
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="mt-1 text-xs text-muted">En az 8 karakter</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Yeni Şifre Tekrar
          </label>
          <input
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            maxLength={72}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || !currentPassword || !newPassword || !newPasswordConfirm}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? 'Güncelleniyor…' : 'Şifremi Güncelle'}
        </button>
      </div>
    </main>
  );
}
