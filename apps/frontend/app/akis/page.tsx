'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface FeedPost {
  id: string;
  title: string;
  access_level: string;
  locked: boolean;
  teaser: string | null;
  published_at: string | null;
  creator_username: string;
  creator_display_name: string;
  creator_avatar_url: string | null;
}

const ACCESS_BADGE: Record<string, string> = {
  public: 'Herkese Açık',
  member_only: 'Üyelere Özel',
  tier_gated: 'Katmana Özel',
};

function relativeDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'az önce';
  if (hours < 24) return `${hours} saat önce`;
  if (days < 7) return `${days} gün önce`;
  return new Date(dateStr).toLocaleDateString('tr-TR');
}

export default function AkisPage() {
  const { accessToken, status: authStatus } = useAuth();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 20;

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;
    void load(1);
  }, [authStatus, accessToken]);

  async function load(p: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/feed/home?page=${p}&limit=${LIMIT}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: FeedPost[]; total: number };
      setPosts(data.items);
      setTotal(data.total);
      setPage(p);
    } catch {
      setError('Akış yüklenemedi. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / LIMIT);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Akış</h1>
        <p className="mt-1 text-sm text-muted">Abone olduğun üreticilerin son içerikleri.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {posts.length === 0 && !error && (
        <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground mb-1">Henüz içerik yok</p>
          <p className="text-xs text-muted mb-6">Üreticilere abone olarak içeriklerini burada görebilirsin.</p>
          <Link
            href="/kesfet"
            className="inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Üreticileri Keşfet
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="rounded-2xl border border-border bg-surface p-5 hover:border-primary/40 transition-colors"
          >
            {/* Creator */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-full bg-background border border-border overflow-hidden shrink-0">
                {post.creator_avatar_url ? (
                  <img
                    src={post.creator_avatar_url}
                    alt={post.creator_display_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs font-bold text-muted">
                    {post.creator_display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-muted">@{post.creator_username}</span>
              <span className="text-muted">·</span>
              <span className="text-xs text-muted">{relativeDate(post.published_at)}</span>
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {ACCESS_BADGE[post.access_level] ?? post.access_level}
              </span>
            </div>

            {/* Title */}
            <p className="text-sm font-semibold text-foreground leading-snug mb-1.5">{post.title}</p>

            {/* Teaser or locked indicator */}
            {post.locked ? (
              <p className="text-xs text-muted italic">
                {post.teaser ?? 'Bu içerik üyelere özeldir.'}
              </p>
            ) : (
              post.teaser && (
                <p className="text-xs text-muted leading-relaxed line-clamp-2">{post.teaser}</p>
              )
            )}
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => void load(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Önceki
          </button>
          <span className="text-sm text-muted">{page} / {totalPages}</span>
          <button
            type="button"
            onClick={() => void load(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sonraki →
          </button>
        </div>
      )}
    </main>
  );
}
