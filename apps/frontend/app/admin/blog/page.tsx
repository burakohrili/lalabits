'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  author_name: string;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const { accessToken, logout } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/blog?limit=50`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: BlogPost[] };
      setPosts(data.items);
    } catch {
      setError('Blog yazıları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => { void fetchPosts(); }, [fetchPosts]);

  async function toggleStatus(post: BlogPost) {
    if (!accessToken || actionLoading) return;
    const action = post.status === 'published' ? 'unpublish' : 'publish';
    setActionLoading(post.id + action);
    try {
      const res = await fetch(`${API}/admin/blog/${post.id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error('ACTION_FAILED');
      const updated = (await res.json()) as BlogPost;
      setPosts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    } catch {
      setError('İşlem gerçekleştirilemedi.');
    } finally {
      setActionLoading(null);
    }
  }

  async function deletePost(id: string) {
    if (!accessToken || actionLoading) return;
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
    setActionLoading(id + 'delete');
    try {
      const res = await fetch(`${API}/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok && res.status !== 204) throw new Error('DELETE_FAILED');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Yazı silinemedi.');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Blog Yazıları</h1>
            <p className="mt-0.5 text-sm text-muted">{posts.length} yazı</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-sm text-muted hover:text-foreground">← Genel Bakış</a>
            <Link
              href="/admin/blog/yeni"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Yeni Yazı
            </Link>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <p className="text-sm font-medium text-foreground mb-1">Henüz blog yazısı yok</p>
            <p className="text-xs text-muted mb-4">İlk yazıyı oluşturun.</p>
            <Link
              href="/admin/blog/yeni"
              className="inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Yeni Yazı
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Başlık</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Durum</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Tarih</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {posts.map((post) => {
                  const isActioning = actionLoading?.startsWith(post.id);
                  return (
                    <tr key={post.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{post.title}</p>
                        <p className="text-xs text-muted">/blog/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={[
                          'inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                          post.status === 'published'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-muted',
                        ].join(' ')}>
                          {post.status === 'published' ? 'Yayında' : 'Taslak'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('tr-TR')
                          : new Date(post.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted hover:text-foreground hover:bg-surface transition-colors"
                          >
                            Düzenle
                          </Link>
                          <button
                            type="button"
                            disabled={!!isActioning}
                            onClick={() => void toggleStatus(post)}
                            className={[
                              'rounded-lg border px-2.5 py-1 text-xs font-medium disabled:opacity-40 transition-colors',
                              post.status === 'published'
                                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
                            ].join(' ')}
                          >
                            {isActioning ? '…' : post.status === 'published' ? 'Taslağa Al' : 'Yayınla'}
                          </button>
                          <button
                            type="button"
                            disabled={!!isActioning}
                            onClick={() => void deletePost(post.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-600 hover:bg-red-100 disabled:opacity-40 transition-colors"
                          >
                            {actionLoading === post.id + 'delete' ? '…' : 'Sil'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
