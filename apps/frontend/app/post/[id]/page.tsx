'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface PostFeedItem {
  id: string;
  title: string;
  access_level: 'public' | 'member_only' | 'tier_gated';
  required_tier_id: string | null;
  cta_plan_id: string | null;
  published_at: string | null;
  locked: boolean;
  teaser: string | null;
  content: { type: string; body: string } | null;
}

type PageState = 'loading' | 'ready' | 'not_found';

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { accessToken, status: authStatus } = useAuth();

  const [post, setPost] = useState<PostFeedItem | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');

  useEffect(() => {
    if (!id || authStatus === 'loading') return;

    async function load() {
      const headers: Record<string, string> = {};
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
      try {
        const res = await fetch(`${API}/posts/${id}`, { headers });
        if (!res.ok) {
          setPageState('not_found');
          return;
        }
        const data = (await res.json()) as PostFeedItem;
        setPost(data);
        setPageState('ready');
      } catch {
        setPageState('not_found');
      }
    }

    void load();
  }, [id, authStatus, accessToken]);

  if (pageState === 'loading') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (pageState === 'not_found' || !post) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">Post bulunamadı</p>
          <p className="mt-2 text-sm text-muted">Bu içerik mevcut değil veya kaldırılmış.</p>
        </div>
      </main>
    );
  }

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('tr-TR')
    : null;

  // Locked state
  if (post.locked) {
    const lockLabel =
      post.access_level === 'tier_gated' ? 'Belirli Üyelik Gerekli' : 'Üyelik Gerekli';

    const ctaHref = post.cta_plan_id
      ? (accessToken ? `/abonelik/${post.cta_plan_id}` : `/auth/giris?next=/post/${post.id}`)
      : `/auth/giris?next=/post/${post.id}`;

    return (
      <main className="px-4 py-10 max-w-2xl mx-auto">
        <div className="mb-6">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-border text-muted">
            🔒 {lockLabel}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-4">{post.title}</h1>

        {date && <p className="text-xs text-muted mb-6">{date}</p>}

        {post.teaser && (
          <p className="text-sm text-muted leading-relaxed mb-8">{post.teaser}</p>
        )}

        <div className="rounded-2xl border border-border bg-surface px-6 py-8 text-center flex flex-col gap-4">
          <p className="text-sm font-semibold text-foreground">
            Bu içeriği okumak için üye olun
          </p>
          <p className="text-xs text-muted">
            {post.access_level === 'tier_gated'
              ? 'Bu post belirli bir üyelik planı gerektiriyor.'
              : 'Bu post yalnızca üyelere açık.'}
          </p>
          <Link
            href={ctaHref}
            className="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            {accessToken ? 'Abone Ol' : 'Giriş Yap'}
          </Link>
        </div>
      </main>
    );
  }

  // Full access
  return (
    <main className="px-4 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">{post.title}</h1>
      {date && <p className="text-xs text-muted mb-8">{date}</p>}

      {post.content?.body ? (
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {post.content.body}
        </div>
      ) : (
        <p className="text-sm text-muted">İçerik yok.</p>
      )}
    </main>
  );
}
