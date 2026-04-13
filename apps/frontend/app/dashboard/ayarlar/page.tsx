'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface SocialLinks {
  youtube?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  discord?: string | null;
  tiktok?: string | null;
  website?: string | null;
}

const PLATFORMS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@kanaladi' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/kullanici' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/kullanici' },
  { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/davetlinki' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@kullanici' },
  { key: 'website', label: 'Kişisel Site', placeholder: 'https://siteadresi.com' },
];

export default function DashboardAyarlarPage() {
  const { accessToken, status: authStatus } = useAuth();
  const router = useRouter();

  const [links, setLinks] = useState<SocialLinks>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris');
      return;
    }
    if (authStatus === 'loading' || !accessToken) return;

    async function load() {
      try {
        const res = await fetch(`${API}/dashboard/profile/social-links`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = (await res.json()) as { social_links: SocialLinks | null };
          setLinks(data.social_links ?? {});
        }
      } catch {
        // non-fatal — start with empty form
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [authStatus, accessToken, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${API}/dashboard/profile/social-links`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(links),
      });

      if (!res.ok) {
        throw new Error('SAVE_FAILED');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Kaydedilemedi. Lütfen tekrar dene.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Profil Ayarları</h1>
        <p className="mt-1 text-sm text-muted">Sosyal medya ve harici linklerini yönet.</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-5">Sosyal Linkler</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {PLATFORMS.map(({ key, label, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label htmlFor={key} className="text-sm font-medium text-foreground">
                {label}
              </label>
              <input
                id={key}
                type="url"
                value={links[key] ?? ''}
                onChange={(e) => setLinks((prev) => ({ ...prev, [key]: e.target.value || undefined }))}
                placeholder={placeholder}
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                disabled={saving}
              />
            </div>
          ))}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          {success && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              Linkler kaydedildi.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </form>
      </div>
    </main>
  );
}
