'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface PostListItem {
  id: string;
  title: string;
  publish_status: 'draft' | 'published' | 'archived';
  moderation_status: 'clean' | 'flagged' | 'removed';
  access_level: 'public' | 'member_only';
  created_at: string;
  published_at: string | null;
}

const PUBLISH_STATUS_LABELS: Record<PostListItem['publish_status'], string> = {
  draft: 'Taslak',
  published: 'Yayında',
  archived: 'Arşivlendi',
};

const PUBLISH_STATUS_COLORS: Record<PostListItem['publish_status'], string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-50 text-red-600',
};

const ACCESS_LABELS: Record<PostListItem['access_level'], string> = {
  public: 'Herkese açık',
  member_only: 'Yalnızca üyeler',
};

type ActionState = Record<string, 'idle' | 'publishing' | 'unpublishing' | 'archiving' | 'deleting'>;

async function postAction(
  postId: string,
  action: 'publish' | 'unpublish' | 'archive',
  accessToken: string,
): Promise<{ id: string; publish_status: PostListItem['publish_status'] }> {
  const res = await fetch(`${API}/dashboard/posts/${postId}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { code?: string };
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
  }
  return res.json() as Promise<{ id: string; publish_status: PostListItem['publish_status'] }>;
}

async function deletePost(postId: string, accessToken: string): Promise<void> {
  const res = await fetch(`${API}/dashboard/posts/${postId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { code?: string };
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
  }
}

interface Props {
  posts: PostListItem[];
  accessToken: string;
  onStatusUpdated: (id: string, newStatus: PostListItem['publish_status']) => void;
  onDeleted: (id: string) => void;
}

export default function PostList({ posts, accessToken, onStatusUpdated, onDeleted }: Props) {
  const [actionState, setActionState] = useState<ActionState>({});
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  async function handleAction(postId: string, action: 'publish' | 'unpublish' | 'archive') {
    setActionErrors((prev) => ({ ...prev, [postId]: '' }));
    const busyLabel =
      action === 'publish' ? 'publishing' :
      action === 'unpublish' ? 'unpublishing' : 'archiving';
    setActionState((prev) => ({ ...prev, [postId]: busyLabel }));

    try {
      const result = await postAction(postId, action, accessToken);
      onStatusUpdated(result.id, result.publish_status);
    } catch {
      setActionErrors((prev) => ({ ...prev, [postId]: 'İşlem başarısız. Tekrar deneyin.' }));
    } finally {
      setActionState((prev) => ({ ...prev, [postId]: 'idle' }));
    }
  }

  async function handleDelete(postId: string) {
    setActionErrors((prev) => ({ ...prev, [postId]: '' }));
    setActionState((prev) => ({ ...prev, [postId]: 'deleting' }));

    try {
      await deletePost(postId, accessToken);
      onDeleted(postId);
    } catch {
      setActionErrors((prev) => ({ ...prev, [postId]: 'Silinemedi. Tekrar deneyin.' }));
      setActionState((prev) => ({ ...prev, [postId]: 'idle' }));
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
        <p className="text-sm text-muted">Henüz gönderi yok.</p>
        <Link
          href="/dashboard/gonderiler/yeni"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          İlk gönderinizi oluşturun
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => {
        const busy = actionState[post.id] && actionState[post.id] !== 'idle';
        const isArchived = post.publish_status === 'archived';

        return (
          <div
            key={post.id}
            className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">{post.title}</p>
                  <span
                    className={[
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                      PUBLISH_STATUS_COLORS[post.publish_status],
                    ].join(' ')}
                  >
                    {PUBLISH_STATUS_LABELS[post.publish_status]}
                  </span>
                  <span className="shrink-0 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
                    {ACCESS_LABELS[post.access_level]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {post.published_at
                    ? `Yayınlandı: ${new Date(post.published_at).toLocaleDateString('tr-TR')}`
                    : `Oluşturuldu: ${new Date(post.created_at).toLocaleDateString('tr-TR')}`}
                </p>
              </div>
            </div>

            {actionErrors[post.id] && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {actionErrors[post.id]}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {!isArchived && (
                <Link
                  href={`/dashboard/gonderiler/${post.id}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background"
                >
                  Düzenle
                </Link>
              )}

              {post.publish_status === 'draft' && (
                <button
                  type="button"
                  onClick={() => handleAction(post.id, 'publish')}
                  disabled={!!busy}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {actionState[post.id] === 'publishing' ? 'Yayınlanıyor…' : 'Yayınla'}
                </button>
              )}

              {post.publish_status === 'published' && (
                <button
                  type="button"
                  onClick={() => handleAction(post.id, 'unpublish')}
                  disabled={!!busy}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background disabled:opacity-50"
                >
                  {actionState[post.id] === 'unpublishing' ? 'Geri alınıyor…' : 'Yayından kaldır'}
                </button>
              )}

              {!isArchived && (
                <button
                  type="button"
                  onClick={() => handleAction(post.id, 'archive')}
                  disabled={!!busy}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-background disabled:opacity-50"
                >
                  {actionState[post.id] === 'archiving' ? 'Arşivleniyor…' : 'Arşivle'}
                </button>
              )}

              {post.publish_status === 'draft' && (
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  disabled={!!busy}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {actionState[post.id] === 'deleting' ? 'Siliniyor…' : 'Sil'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
