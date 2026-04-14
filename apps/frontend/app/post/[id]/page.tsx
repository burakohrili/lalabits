'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import ReportModal from '@/components/ReportModal';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface ChecklistItem {
  id: string;
  text: string;
}

interface PostContent {
  type: string;
  body?: string;
  items?: ChecklistItem[];
}

interface PostFeedItem {
  id: string;
  title: string;
  access_level: 'public' | 'member_only' | 'tier_gated';
  required_tier_id: string | null;
  cta_plan_id: string | null;
  published_at: string | null;
  locked: boolean;
  teaser: string | null;
  content: PostContent | null;
}

type PageState = 'loading' | 'ready' | 'not_found';

// ── Checklist renderer ───────────────────────────────────────────────────────

function ChecklistContent({
  postId,
  items,
  accessToken,
}: {
  postId: string;
  items: ChecklistItem[];
  accessToken: string | null;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [progressLoaded, setProgressLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted progress
  useEffect(() => {
    if (!accessToken) {
      setProgressLoaded(true);
      return;
    }
    void (async () => {
      try {
        const res = await fetch(`${API}/posts/${postId}/checklist-progress`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = (await res.json()) as { checked_item_ids: string[] };
          setChecked(new Set(data.checked_item_ids));
        }
      } finally {
        setProgressLoaded(true);
      }
    })();
  }, [postId, accessToken]);

  // Cleanup pending save on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  function saveProgress(nextChecked: Set<string>) {
    if (!accessToken) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void fetch(`${API}/posts/${postId}/checklist-progress`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checked_item_ids: [...nextChecked] }),
      });
    }, 600);
  }

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveProgress(next);
      return next;
    });
  }

  if (!progressLoaded) {
    return <div className="h-4 w-24 rounded bg-border animate-pulse" />;
  }

  const doneCount = items.filter((it) => checked.has(it.id)).length;

  return (
    <div className="flex flex-col gap-1">
      {accessToken && items.length > 0 && (
        <p className="text-xs text-muted mb-3">
          {doneCount}/{items.length} tamamlandı
        </p>
      )}
      {items.map((item) => {
        const isChecked = checked.has(item.id);
        return (
          <label
            key={item.id}
            className="flex items-start gap-3 cursor-pointer group py-1.5"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggle(item.id)}
              disabled={!accessToken}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer disabled:cursor-default"
            />
            <span
              className={[
                'text-sm leading-relaxed',
                isChecked ? 'line-through text-muted' : 'text-foreground',
              ].join(' ')}
            >
              {item.text}
            </span>
          </label>
        );
      })}
      {!accessToken && (
        <p className="mt-3 text-xs text-muted">
          İlerlemenizi kaydetmek için{' '}
          <Link href="/auth/giris" className="text-primary hover:underline">
            giriş yapın
          </Link>
          .
        </p>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { accessToken, status: authStatus } = useAuth();

  const [post, setPost] = useState<PostFeedItem | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [showReport, setShowReport] = useState(false);

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
  const isChecklist = post.content?.type === 'checklist';

  return (
    <main className="px-4 py-10 max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
        {accessToken && (
          <button
            type="button"
            onClick={() => setShowReport(true)}
            className="shrink-0 mt-1 text-xs text-muted hover:text-red-500 transition-colors"
          >
            Şikayet Et
          </button>
        )}
      </div>
      {date && <p className="text-xs text-muted mb-8">{date}</p>}

      {isChecklist ? (
        <ChecklistContent
          postId={post.id}
          items={post.content?.items ?? []}
          accessToken={accessToken}
        />
      ) : post.content?.body ? (
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {post.content.body}
        </div>
      ) : (
        <p className="text-sm text-muted">İçerik yok.</p>
      )}

      {showReport && accessToken && (
        <ReportModal
          targetType="post"
          targetId={post.id}
          accessToken={accessToken}
          onClose={() => setShowReport(false)}
        />
      )}
    </main>
  );
}
