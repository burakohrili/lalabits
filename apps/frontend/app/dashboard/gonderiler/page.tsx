'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import PostList, { type PostListItem } from './_components/post-list';

const API = process.env.NEXT_PUBLIC_API_URL!;

type FilterStatus = 'all' | 'draft' | 'published' | 'archived';

const FILTER_TABS: { label: string; value: FilterStatus }[] = [
  { label: 'Tümü', value: 'all' },
  { label: 'Taslak', value: 'draft' },
  { label: 'Yayında', value: 'published' },
  { label: 'Arşiv', value: 'archived' },
];

export default function GonderilerPage() {
  const { accessToken } = useAuth();
  const [posts, setPosts] = useState<PostListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    if (!accessToken) return;

    setPosts(null);
    setError(null);

    async function load() {
      try {
        const qs = filter !== 'all' ? `?status=${filter}` : '';
        const res = await fetch(`${API}/dashboard/posts${qs}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { code?: string };
          throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
        }
        const data = (await res.json()) as { items: PostListItem[] };
        setPosts(data.items);
      } catch {
        setError('Gönderiler yüklenemedi. Sayfayı yenile.');
      }
    }

    void load();
  }, [accessToken, filter]);

  function handleStatusUpdated(id: string, newStatus: PostListItem['publish_status']) {
    setPosts((prev) =>
      prev ? prev.map((p) => (p.id === id ? { ...p, publish_status: newStatus } : p)) : prev,
    );
  }

  function handleDeleted(id: string) {
    setPosts((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
  }

  return (
    <div className="px-6 py-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Gönderiler</h1>
          <p className="mt-0.5 text-sm text-muted">İçeriklerinizi yönetin.</p>
        </div>
        <Link
          href="/dashboard/gonderiler/yeni"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Yeni Gönderi
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex gap-1 border-b border-border">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={[
              'px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              filter === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {!posts && !error && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-5 animate-pulse">
              <div className="h-4 w-48 rounded bg-border mb-2" />
              <div className="h-3 w-24 rounded bg-border" />
            </div>
          ))}
        </div>
      )}

      {posts && (
        <PostList
          posts={posts}
          accessToken={accessToken!}
          onStatusUpdated={handleStatusUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
