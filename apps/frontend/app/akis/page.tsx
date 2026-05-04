'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import CreatorFeedSection from '@/components/feed/CreatorFeedSection';
import SuggestedCreatorsCarousel from '@/components/feed/SuggestedCreatorsCarousel';
import type { FeedPost, CreatorGroup } from '@/components/feed/types';

export type { FeedPost };

const API = process.env.NEXT_PUBLIC_API_URL!;
const LIMIT = 20;

const CATEGORIES = [
  { label: 'Yazarlar', q: 'yazar' },
  { label: 'Video', q: 'video' },
  { label: 'Podcast', q: 'podcast' },
  { label: 'Tasarım', q: 'tasarim' },
  { label: 'Müzik', q: 'muzik' },
];

type FilterType = 'all' | 'subscribed' | 'free';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'subscribed', label: 'Üye Olduklarım' },
  { key: 'free', label: 'Serbest' },
];

function groupPosts(posts: FeedPost[]): CreatorGroup[] {
  const map = new Map<string, CreatorGroup>();
  for (const post of posts) {
    const key = post.creator_username;
    if (!map.has(key)) {
      map.set(key, {
        creator: {
          username: key,
          display_name: post.creator_display_name,
          avatar_url: post.creator_avatar_url,
        },
        posts: [],
      });
    }
    map.get(key)!.posts.push(post);
  }
  return [...map.values()].sort((a, b) => {
    const aDate = new Date(a.posts[0].published_at ?? 0).getTime();
    const bDate = new Date(b.posts[0].published_at ?? 0).getTime();
    return bDate - aDate;
  });
}

export default function AkisPage() {
  const { accessToken, status: authStatus, user } = useAuth();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subCount, setSubCount] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;
    void load(1, true);
    fetch(`${API}/membership/subscriptions`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((d: { total?: number; items?: unknown[] }) => {
        setSubCount(d.total ?? d.items?.length ?? 0);
      })
      .catch(() => {});
  }, [authStatus, accessToken]);

  async function load(p: number, reset = false) {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      const res = await fetch(`${API}/feed/home?page=${p}&limit=${LIMIT}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: FeedPost[]; total: number };
      setPosts((prev) => (reset ? data.items : [...prev, ...data.items]));
      setTotal(data.total);
      setPage(p);
    } catch {
      setError('Akış yüklenemedi. Tekrar deneyin.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const filteredPosts = useMemo(() => {
    if (filter === 'all') return posts;
    if (filter === 'subscribed') return posts.filter((p) => p.access_level !== 'public');
    return posts.filter((p) => p.access_level === 'public');
  }, [posts, filter]);

  const groups = useMemo(() => groupPosts(filteredPosts), [filteredPosts]);
  const hasMore = posts.length < total;

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
      {/* Header */}
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

      {/* Filter tabs */}
      {posts.length > 0 && (
        <div className="mb-6 flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={[
                'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                filter === f.key
                  ? 'bg-primary text-white'
                  : 'border border-border text-muted hover:border-primary/40 hover:text-foreground',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty state */}
      {posts.length === 0 && !error && (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <p className="mb-1 text-base font-semibold text-foreground">Henüz üye olduğun üretici yok</p>
          <p className="mb-6 text-sm text-muted">Üreticileri keşfet ve abone olarak içeriklerini burada takip et.</p>
          <Link
            href="/kesfet"
            className="mb-6 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Keşfet →
          </Link>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.q}
                href={`/kesfet?kategori=${c.q}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-primary"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filter empty state */}
      {posts.length > 0 && groups.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
          <p className="text-sm text-muted">Bu filtreye uygun içerik bulunamadı.</p>
        </div>
      )}

      {/* Creator groups with carousels */}
      {groups.map((group, idx) => (
        <div key={group.creator.username}>
          <CreatorFeedSection creator={group.creator} posts={group.posts} />
          {(idx + 1) % 3 === 0 && <SuggestedCreatorsCarousel />}
        </div>
      ))}

      {/* Load more */}
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => void load(page + 1)}
            disabled={loadingMore}
            className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface disabled:opacity-50"
          >
            {loadingMore ? 'Yükleniyor…' : 'Daha fazla yükle'}
          </button>
        </div>
      )}
    </main>
  );
}
