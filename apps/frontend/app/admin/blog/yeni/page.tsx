'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function AdminBlogYeniPage() {
  const { accessToken, logout } = useAdminAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('lalabits.art');
  const [publish, setPublish] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(v));
    }
  }

  async function handleSubmit() {
    if (!accessToken || saving) return;
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError('Başlık, slug ve içerik zorunludur.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/blog`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim() || undefined,
          content: content.trim(),
          cover_image_url: coverImageUrl.trim() || undefined,
          author_name: authorName.trim() || 'lalabits.art',
        }),
      });
      if (res.status === 401) { logout(); return; }
      if (res.status === 409) { setError('Bu slug zaten kullanılıyor.'); return; }
      if (!res.ok) throw new Error('CREATE_FAILED');
      const created = (await res.json()) as { id: string };

      if (publish) {
        await fetch(`${API}/admin/blog/${created.id}/publish`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
      }

      router.push('/admin/blog');
    } catch {
      setError('Yazı oluşturulamadı. Tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Yeni Blog Yazısı</h1>
          <a href="/admin/blog" className="text-sm text-muted hover:text-foreground">← Geri</a>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Başlık *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              maxLength={300}
              placeholder="Yazı başlığı"
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              maxLength={300}
              placeholder="blog-yaziyi-url"
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="mt-1 text-xs text-muted">lalabits.art/blog/{slug || '…'}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Özet (opsiyonel)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder="Kısa özet — liste ve meta açıklamasında görünür"
              className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">İçerik *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              placeholder="Yazı içeriği…"
              className="w-full resize-y rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Kapak Görseli URL (opsiyonel)</label>
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              maxLength={500}
              placeholder="https://…"
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Yazar</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={200}
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-foreground">Kaydet ve hemen yayınla</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={saving}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {saving ? 'Kaydediliyor…' : publish ? 'Yayınla' : 'Taslak Olarak Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
