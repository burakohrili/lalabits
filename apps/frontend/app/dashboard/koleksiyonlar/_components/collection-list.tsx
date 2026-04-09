'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface CollectionListItem {
  id: string;
  title: string;
  description: string;
  access_type: 'purchase' | 'tier_gated';
  price_try: number | null;
  required_tier_id: string | null;
  publish_status: 'draft' | 'published' | 'archived';
  moderation_status: 'clean' | 'flagged' | 'removed';
  item_count: number;
  created_at: string;
}

const STATUS_LABELS: Record<CollectionListItem['publish_status'], string> = {
  draft: 'Taslak',
  published: 'Yayında',
  archived: 'Arşivlendi',
};

const STATUS_COLORS: Record<CollectionListItem['publish_status'], string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-50 text-red-600',
};

type ActionState = Record<string, 'idle' | 'publishing' | 'archiving' | 'deleting'>;

interface Props {
  collections: CollectionListItem[];
  accessToken: string;
  onStatusUpdated: (id: string, newStatus: CollectionListItem['publish_status']) => void;
  onDeleted: (id: string) => void;
}

async function collectionAction(
  collectionId: string,
  action: 'publish' | 'archive',
  accessToken: string,
): Promise<{ id: string; publish_status: CollectionListItem['publish_status'] }> {
  const res = await fetch(`${API}/dashboard/collections/${collectionId}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { code?: string };
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
  }
  return res.json() as Promise<{ id: string; publish_status: CollectionListItem['publish_status'] }>;
}

async function deleteCollection(collectionId: string, accessToken: string): Promise<void> {
  const res = await fetch(`${API}/dashboard/collections/${collectionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { code?: string };
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
  }
}

export default function CollectionList({ collections, accessToken, onStatusUpdated, onDeleted }: Props) {
  const [actionState, setActionState] = useState<ActionState>({});
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  async function handleAction(collectionId: string, action: 'publish' | 'archive') {
    setActionErrors((prev) => ({ ...prev, [collectionId]: '' }));
    setActionState((prev) => ({
      ...prev,
      [collectionId]: action === 'publish' ? 'publishing' : 'archiving',
    }));

    try {
      const result = await collectionAction(collectionId, action, accessToken);
      onStatusUpdated(result.id, result.publish_status);
    } catch {
      setActionErrors((prev) => ({ ...prev, [collectionId]: 'İşlem başarısız. Tekrar deneyin.' }));
    } finally {
      setActionState((prev) => ({ ...prev, [collectionId]: 'idle' }));
    }
  }

  async function handleDelete(collectionId: string) {
    setActionErrors((prev) => ({ ...prev, [collectionId]: '' }));
    setActionState((prev) => ({ ...prev, [collectionId]: 'deleting' }));

    try {
      await deleteCollection(collectionId, accessToken);
      onDeleted(collectionId);
    } catch {
      setActionErrors((prev) => ({ ...prev, [collectionId]: 'Silinemedi. Tekrar deneyin.' }));
      setActionState((prev) => ({ ...prev, [collectionId]: 'idle' }));
    }
  }

  if (collections.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
        <p className="text-sm text-muted">Henüz koleksiyon yok.</p>
        <Link
          href="/dashboard/koleksiyonlar/yeni"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          İlk koleksiyonunu ekle
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {collections.map((collection) => {
        const busy = actionState[collection.id] && actionState[collection.id] !== 'idle';
        const isArchived = collection.publish_status === 'archived';

        return (
          <div
            key={collection.id}
            className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">{collection.title}</p>
                  <span
                    className={[
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                      STATUS_COLORS[collection.publish_status],
                    ].join(' ')}
                  >
                    {STATUS_LABELS[collection.publish_status]}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted line-clamp-1">{collection.description}</p>
                <p className="mt-1 text-xs text-muted">
                  {collection.item_count} öğe ·{' '}
                  {collection.access_type === 'purchase'
                    ? `${collection.price_try != null ? (collection.price_try / 100).toFixed(2) : '—'} ₺`
                    : 'Üyelik katmanı'}
                </p>
              </div>
            </div>

            {actionErrors[collection.id] && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {actionErrors[collection.id]}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {!isArchived && (
                <Link
                  href={`/dashboard/koleksiyonlar/${collection.id}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background"
                >
                  Düzenle
                </Link>
              )}

              {collection.publish_status === 'draft' && (
                <button
                  type="button"
                  onClick={() => handleAction(collection.id, 'publish')}
                  disabled={!!busy}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {actionState[collection.id] === 'publishing' ? 'Yayınlanıyor…' : 'Yayınla'}
                </button>
              )}

              {!isArchived && (
                <button
                  type="button"
                  onClick={() => handleAction(collection.id, 'archive')}
                  disabled={!!busy}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-background disabled:opacity-50"
                >
                  {actionState[collection.id] === 'archiving' ? 'Arşivleniyor…' : 'Arşivle'}
                </button>
              )}

              {collection.publish_status === 'draft' && (
                <button
                  type="button"
                  onClick={() => handleDelete(collection.id)}
                  disabled={!!busy}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {actionState[collection.id] === 'deleting' ? 'Siliniyor…' : 'Sil'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
