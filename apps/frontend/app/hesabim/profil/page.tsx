'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function HesabimProfilPage() {
  const { user, accessToken, status: authStatus, refreshToken } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/hesabim/profil');
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name);
      setAvatarPreview(user.avatar_url);
    }
  }, [user]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  async function handleSave() {
    if (!accessToken || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const body: Record<string, string> = {};
      if (displayName.trim() !== user?.display_name) {
        body.display_name = displayName.trim();
      }
      if (avatarFile) {
        body.avatar_filename = avatarFile.name;
        body.avatar_content_type = avatarFile.type;
      }

      const res = await fetch(`${API}/auth/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('SAVE_FAILED');

      const data = (await res.json()) as { avatar_upload_url?: string };

      if (avatarFile && data.avatar_upload_url) {
        const uploadRes = await fetch(data.avatar_upload_url, {
          method: 'PUT',
          headers: { 'Content-Type': avatarFile.type },
          body: avatarFile,
        });
        if (!uploadRes.ok) throw new Error('UPLOAD_FAILED');
      }

      await refreshToken();
      setAvatarFile(null);
      setSuccess(true);
    } catch {
      setError('Profil kaydedilemedi. Tekrar deneyin.');
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
        <h1 className="text-lg font-semibold text-foreground">Profilim</h1>
      </div>

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Profil güncellendi.
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-20 w-20 rounded-full bg-background border border-border overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profil" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-muted">
                {user?.display_name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-primary hover:underline"
          >
            Fotoğraf değiştir
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Görünen Ad
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={100}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || (!avatarFile && displayName.trim() === user?.display_name)}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </main>
  );
}
