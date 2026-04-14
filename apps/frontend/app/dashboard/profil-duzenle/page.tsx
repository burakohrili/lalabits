'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface ProfileData {
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
}

export default function DashboardProfilDuzenlePage() {
  const { accessToken, status: authStatus } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;
    void loadProfile();
  }, [authStatus, accessToken]);

  async function loadProfile() {
    try {
      const res = await fetch(`${API}/dashboard/overview`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as {
        creator_profile: ProfileData & { username: string };
      };
      const cp = data.creator_profile;
      setProfile(cp);
      setDisplayName(cp.display_name);
      setBio(cp.bio ?? '');
      setAvatarPreview(cp.avatar_url);
      setCoverPreview(cp.cover_image_url);
    } catch {
      setError('Profil yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!accessToken || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const body: Record<string, string | null> = {
        display_name: displayName.trim(),
        bio: bio.trim() || null,
      };
      if (avatarFile) {
        body.avatar_filename = avatarFile.name;
        body.avatar_content_type = avatarFile.type;
      }
      if (coverFile) {
        body.cover_image_filename = coverFile.name;
        body.cover_image_content_type = coverFile.type;
      }

      const res = await fetch(`${API}/dashboard/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('SAVE_FAILED');

      const data = (await res.json()) as {
        avatar_upload_url?: string;
        cover_image_upload_url?: string;
      };

      const uploads: Promise<void>[] = [];
      if (avatarFile && data.avatar_upload_url) {
        uploads.push(
          fetch(data.avatar_upload_url, {
            method: 'PUT',
            headers: { 'Content-Type': avatarFile.type },
            body: avatarFile,
          }).then(() => undefined),
        );
      }
      if (coverFile && data.cover_image_upload_url) {
        uploads.push(
          fetch(data.cover_image_upload_url, {
            method: 'PUT',
            headers: { 'Content-Type': coverFile.type },
            body: coverFile,
          }).then(() => undefined),
        );
      }
      await Promise.all(uploads);

      setAvatarFile(null);
      setCoverFile(null);
      setSuccess(true);
    } catch {
      setError('Profil kaydedilemedi. Tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-10 max-w-xl">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="text-sm text-primary hover:underline">
          ← Genel Bakış
        </Link>
        <span className="text-muted">·</span>
        <h1 className="text-lg font-semibold text-foreground">Profil Düzenle</h1>
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

      <div className="space-y-6">
        {/* Cover Image */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Kapak Fotoğrafı</p>
          <div
            className="relative h-32 rounded-2xl bg-background border border-border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <img src={coverPreview} alt="Kapak" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted">
                Kapak fotoğrafı ekle
              </div>
            )}
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setCoverFile(f);
              setCoverPreview(URL.createObjectURL(f));
            }}
          />
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-background border border-border overflow-hidden shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xl font-bold text-muted">
                {profile?.display_name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="text-sm text-primary hover:underline"
            >
              Profil fotoğrafı değiştir
            </button>
            <p className="text-xs text-muted mt-0.5">JPG, PNG veya WebP</p>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setAvatarFile(f);
              setAvatarPreview(URL.createObjectURL(f));
            }}
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

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Hakkında
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Kendinizi destekçilerinize tanıtın…"
            className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="mt-1 text-right text-xs text-muted">{bio.length}/1000</p>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || !displayName.trim()}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
}
