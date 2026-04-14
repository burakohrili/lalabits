'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  status: 'draft' | 'published';
  published_at: string | null;
}

export default function AdminBlogEditPage() {
  const { accessToken, logout } = useAdminAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    if (!accessToken || !id) return;
    void (async () => {
      try {
        const res = await fetch(`${API}/admin/blog/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.status === 401) { logout(); return; }
        if (!res.ok) { setError('Yazı bulunamadı.'); return; }
        const data = (await res.json()) as BlogPost;
        setPost(data);
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt ?? '');
        setContent(data.content);
        setCoverImageUrl(data.cover_image_url ?? '');
        setAuthorName(data.author_name);
      } catch {
        setError('Yazı yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, id, logout]);

  async function handleSave() {
    if (!accessToken || saving || !post) return;
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError('Başlık, slug ve içerik zorunludur.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${API}/admin/blog/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
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
      if (!res.ok) throw new Error('UPDATE_FAILED');
      const updated = (await res.json()) as BlogPost;
      setPost(updated);
      setSuccess(true);
    } catch {
      setError('Yazı kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    if (!accessToken || saving || !post) return;
    const action = post.status === 'published' ? 'unpublish' : 'publish';
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/blog/${id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error('ACTION_FAILED');
      const updated = (await res.json()) as BlogPost;
      setPost(updated);
      setSuccess(true);
    } catch {
      setError('İşlem gerçekleştirilemedi.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">{error ?? 'Yazı bulunamadı.'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Yazıyı Düzenle</h1>
            <span className={[
              'inline-block mt-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
              post.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-muted',
            ].join(' ')}>
              {post.status === 'published' ? 'Yayında' : 'Taslak'}
            </span>
          </div>
          <a href="/admin/blog" className="text-sm text-muted hover:text-foreground">← Geri</a>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Kaydedildi.
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Başlık *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
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
              className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">İçerik *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
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

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => void togglePublish()}
              disabled={saving}
              className={[
                'rounded-xl border px-4 py-2.5 text-sm font-medium disabled:opacity-40 transition-colors',
                post.status === 'published'
                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
              ].join(' ')}
            >
              {saving ? '…' : post.status === 'published' ? 'Taslağa Al' : 'Yayınla'}
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
