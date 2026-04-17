'use client';

import { useState } from 'react';
import type { useOnboarding } from '../_hooks/use-onboarding';
import { ApiError } from '@/lib/api-client';

type OnboardingHook = ReturnType<typeof useOnboarding>;

interface Props {
  onboarding: OnboardingHook;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES = [
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
] as const;

const FORMAT_TAG_OPTIONS = [
  'Metin', 'Görsel', 'Video', 'Podcast', 'Müzik', 'PDF', 'Şablon',
  'İllüstrasyon', 'Yazılım', 'Eğitim', 'Fotoğraf', 'Tasarım Dosyası',
];

export default function StepCategory({ onboarding, onNext, onBack }: Props) {
  const initial = onboarding.status!.category;
  const [category, setCategory] = useState(initial.category ?? '');
  const [tags, setTags] = useState<string[]>(initial.content_format_tags ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  async function handleNext() {
    if (!category) {
      setError('Lütfen bir kategori seçin.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onboarding.saveCategory({ category, content_format_tags: tags });
      onNext();
    } catch (err) {
      setError(err instanceof ApiError ? `Hata: ${err.code}` : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">Kategori</h2>
        <p className="text-sm text-muted">İçerik türünüzü en iyi tanımlayan kategoriyi seçin.</p>
      </div>

      {/* Category selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Kategori <span className="text-accent">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              disabled={saving}
              className={[
                'rounded-lg border px-4 py-2.5 text-sm font-medium text-left transition-colors',
                category === value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-foreground hover:border-primary/40',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content format tags */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          İçerik Formatları <span className="text-muted font-normal">(isteğe bağlı)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {FORMAT_TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              disabled={saving}
              className={[
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                tags.includes(tag)
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted hover:border-primary/40',
              ].join(' ')}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-background disabled:opacity-50"
        >
          Geri
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={saving || !category}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor…' : 'İleri'}
        </button>
      </div>
    </div>
  );
}
