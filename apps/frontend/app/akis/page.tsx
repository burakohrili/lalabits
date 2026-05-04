'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { relativeDate } from '@/lib/date-utils';

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

const CATEGORIES = [
  { label: 'Yazarlar', q: 'yazar' },
  { label: 'Video', q: 'video' },
  { label: 'Podcast', q: 'podcast' },
  { label: 'Tasarım', q: 'tasarim' },
  { label: 'Müzik', q: 'muzik' },
];

export default function AkisPage() {
  const { accessToken, status: authStatus, user } = useAuth();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subCount, setSubCount] = useState<number | null>(null);

  const LIMIT = 20;

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;
    void load(1);
    fetch(`${API}/membership/subscriptions`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((d: { total?: number; items?: unknown[] }) => {
        setSubCount(d.total ?? d.items?.length ?? 0);
      })
      .catch(() => {});
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
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground">
            Merhaba{user?.display_name ? `, ${user.display_name}` : ''}
          </h1>
          {subCount !== null && subCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {subCount} üyelik
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">Abone olduğun üreticilerin son içerikleri.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {posts.length === 0 && !error && (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <p className="text-base font-semibold text-foreground mb-1">Henüz üye olduğun üretici yok</p>
          <p className="text-sm text-muted mb-6">Üreticileri keşfet ve abone olarak içeriklerini burada takip et.</p>
          <Link
            href="/kesfet"
            className="inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity mb-6"
          >
            Keşfet →
          </Link>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.q}
                href={`/kesfet?kategori=${c.q}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="rounded-2xl border border-border bg-surface p-5 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-full bg-background border border-border overflow-hidden shrink-0">
                {post.creator_avatar_url ? (
                  <Image
                    src={post.creator_avatar_url}
                    alt={post.creator_display_name}
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                    sizes="28px"
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

            <p className="text-sm font-semibold text-foreground leading-snug mb-1.5">{post.title}</p>

            {post.locked ? (
              <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-gray-50 border border-border px-3 py-2">
                <p className="text-xs text-muted italic line-clamp-1">
                  {post.teaser ?? 'Bu içerik üyelere özeldir.'}
                </p>
                <Link
                  href={`/u/${post.creator_username}`}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 rounded-lg bg-primary px-3 py-1 text-[11px] font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Üye Ol
                </Link>
              </div>
            ) : (
              post.teaser && (
                <p className="text-xs text-muted leading-relaxed line-clamp-2">{post.teaser}</p>
              )
            )}
          </Link>
        ))}
      </div>

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
