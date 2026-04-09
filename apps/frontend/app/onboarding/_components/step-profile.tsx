'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import type { useOnboarding } from '../_hooks/use-onboarding';
import { ApiError } from '@/lib/api-client';

type OnboardingHook = ReturnType<typeof useOnboarding>;

interface Props {
  onboarding: OnboardingHook;
  onNext: () => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AllowedType = typeof ALLOWED_TYPES[number];

const USERNAME_REGEX = /^[a-z0-9][a-z0-9_-]{2,29}$/;

export default function StepProfile({ onboarding, onNext }: Props) {
  const initial = onboarding.status!.profile;
  const [displayName, setDisplayName] = useState(initial.display_name ?? '');
  const [username, setUsername] = useState(initial.username ?? '');
  const [bio, setBio] = useState(initial.bio ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initial.avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type as AllowedType)) {
      setError('Yalnızca JPEG, PNG veya WebP dosyası yükleyebilirsiniz.');
      return;
    }
    setError(null);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleNext() {
    if (!displayName.trim()) {
      setError('Görünen ad zorunludur.');
      return;
    }
    const normalizedUsername = username.toLowerCase().trim();
    if (!USERNAME_REGEX.test(normalizedUsername)) {
      setError('Kullanıcı adı 3-30 karakter, yalnızca harf/rakam/alt çizgi/tire içermeli ve harf/rakamla başlamalı.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const payload: Parameters<OnboardingHook['saveProfile']>[0] = {
        display_name: displayName.trim(),
        username: normalizedUsername,
        bio: bio.trim() || null,
      };

      if (avatarFile) {
        payload.avatar_filename = avatarFile.name;
        payload.avatar_content_type = avatarFile.type as AllowedType;
      }

      const { presigned_put_url } = await onboarding.saveProfile(payload);

      // Upload avatar directly to storage if we have a new file and presigned URL
      if (avatarFile && presigned_put_url) {
        const uploadRes = await fetch(presigned_put_url, {
          method: 'PUT',
          headers: { 'Content-Type': avatarFile.type },
          body: avatarFile,
        });
        if (!uploadRes.ok) {
          setError('Avatar yüklenemedi. Lütfen tekrar deneyin.');
          setSaving(false);
          return;
        }
      }

      onNext();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'USERNAME_TAKEN') {
        setError('Bu kullanıcı adı alınmış. Başka bir tane deneyin.');
      } else {
        setError(err instanceof ApiError ? `Hata: ${err.code}` : 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">Profil Bilgileri</h2>
        <p className="text-sm text-muted">Ziyaretçilere görünecek adınızı ve biyografinizi girin.</p>
      </div>

      {/* Avatar */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Profil Fotoğrafı</label>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-background border border-border overflow-hidden shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar önizleme" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted text-xs">Yok</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-background disabled:opacity-50"
          >
            Fotoğraf Seç
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Display name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="display-name" className="text-sm font-medium text-foreground">
          Görünen Ad <span className="text-accent">*</span>
        </label>
        <input
          id="display-name"
          type="text"
          maxLength={100}
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Adınız veya marka adınız"
          disabled={saving}
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-foreground">
          Kullanıcı Adı <span className="text-accent">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">@</span>
          <input
            id="username"
            type="text"
            maxLength={30}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            placeholder="kullanici_adi"
            disabled={saving}
            className="w-full rounded-lg border border-border bg-surface pl-8 pr-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
          />
        </div>
        <p className="text-xs text-muted">Profilinizin adresi: lalabits.art/@{username || 'kullanici_adi'}</p>
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-sm font-medium text-foreground">
          Biyografi
        </label>
        <textarea
          id="bio"
          maxLength={2000}
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Kendinizi kısaca tanıtın…"
          disabled={saving}
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 resize-none"
        />
        <p className="text-xs text-muted text-right">{bio.length} / 2000</p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={saving || !displayName.trim() || !username.trim()}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor…' : 'İleri'}
        </button>
      </div>
    </div>
  );
}
