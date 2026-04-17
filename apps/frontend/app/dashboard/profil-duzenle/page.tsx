'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

const CATEGORY_OPTIONS = [
  { value: 'writer', label: 'Yazar' },
  { value: 'illustrator', label: 'Çizer / İllüstratör' },
  { value: 'educator', label: 'Eğitimci' },
  { value: 'podcaster', label: 'Podcaster' },
  { value: 'musician', label: 'Müzisyen' },
  { value: 'designer', label: 'Tasarımcı' },
  { value: 'developer', label: 'Geliştirici' },
  { value: 'video_creator', label: 'Video Üreticisi' },
  { value: 'ai_creator', label: 'Yapay Zekâ Üreticisi' },
  { value: 'game_developer', label: 'Oyun Geliştirici' },
  { value: 'designer_3d', label: '3D Tasarımcı' },
  { value: 'other', label: 'Diğer' },
];

const USERNAME_REGEX = /^[a-z0-9][a-z0-9_-]{2,29}$/;

interface ProfileData {
  display_name: string;
  username: string | null;
  bio: string | null;
  category: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
}

export default function DashboardProfilDuzenlePage() {
  const { accessToken, status: authStatus } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus, accessToken]);

  async function loadProfile() {
    try {
      const res = await fetch(`${API}/dashboard/overview`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as ProfileData & { status: string };
      setProfile(data);
      setDisplayName(data.display_name ?? '');
      setUsername(data.username ?? '');
      setBio(data.bio ?? '');
      setCategory(data.category ?? '');
      setAvatarPreview(data.avatar_url);
      setCoverPreview(data.cover_image_url);
    } catch {
      setError('Profil yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!accessToken || saving) return;

    const trimmedName = displayName.trim();
    if (!trimmedName) { setError('Görünen ad zorunludur.'); return; }

    const normalizedUsername = username.toLowerCase().trim();
    if (!USERNAME_REGEX.test(normalizedUsername)) {
      setError('Kullanıcı adı 3-30 karakter, harf/rakam/alt çizgi/tire içermeli ve harf/rakamla başlamalı.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const body: Record<string, string | null> = {
        display_name: trimmedName,
        username: normalizedUsername,
        bio: bio.trim() || null,
        category: category || null,
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
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { code?: string };
        if (err.code === 'USERNAME_TAKEN') {
          setError('Bu kullanıcı adı alınmış. Başka bir tane deneyin.');
        } else {
          setError('Profil kaydedilemedi. Tekrar deneyin.');
        }
        return;
      }

      const data = (await res.json()) as { avatar_upload_url?: string; cover_image_upload_url?: string };

      const uploads: Promise<void>[] = [];
      if (avatarFile && data.avatar_upload_url) {
        uploads.push(fetch(data.avatar_upload_url, { method: 'PUT', headers: { 'Content-Type': avatarFile.type }, body: avatarFile }).then(() => undefined));
      }
      if (coverFile && data.cover_image_upload_url) {
        uploads.push(fetch(data.cover_image_upload_url, { method: 'PUT', headers: { 'Content-Type': coverFile.type }, body: coverFile }).then(() => undefined));
      }
      await Promise.all(uploads);

      setAvatarFile(null);
      setCoverFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-xl">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground">Profil Düzenle</h1>
        <p className="text-sm text-muted mt-0.5">Ziyaretçilere görünen profil bilgilerini güncelle.</p>
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

        {/* Kapak Fotoğrafı */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Kapak Fotoğrafı</p>
          <div
            className="relative h-32 rounded-2xl bg-background border border-border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <img src={coverPreview} alt="Kapak" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #e0f2f2 0%, #f0faf9 100%)' }}>
                <span className="text-xs text-muted">Kapak fotoğrafı ekle</span>
              </div>
            )}
            <div className="absolute bottom-2 right-2">
              <span className="rounded-lg bg-white/90 border border-border px-2 py-1 text-xs text-foreground shadow-sm">
                Değiştir
              </span>
            </div>
          </div>
          <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); }} />
          <p className="text-xs text-muted mt-1">Önerilen: 1500×400 px. JPEG, PNG veya WebP.</p>
        </div>

        {/* Profil Fotoğrafı */}
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
            <button type="button" onClick={() => avatarInputRef.current?.click()}
              className="text-sm text-primary hover:underline">
              Profil fotoğrafı değiştir
            </button>
            <p className="text-xs text-muted mt-0.5">JPG, PNG veya WebP</p>
          </div>
          <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); }} />
        </div>

        {/* Görünen Ad */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Görünen Ad <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={100}
            placeholder="Adınız veya marka adınız"
            disabled={saving}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
        </div>

        {/* Kullanıcı Adı */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Kullanıcı Adı <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              maxLength={30}
              placeholder="kullanici_adi"
              disabled={saving}
              className="w-full rounded-xl border border-border pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            />
          </div>
          <p className="text-xs text-muted mt-1">lalabits.art/@{username || 'kullanici_adi'}</p>
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={saving}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          >
            <option value="">Kategori seç</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Biyografi */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Biyografi</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="Kendinizi destekçilerinize tanıtın…"
            disabled={saving}
            className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
          <p className="mt-1 text-right text-xs text-muted">{bio.length}/2000</p>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || !displayName.trim() || !username.trim()}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
}
