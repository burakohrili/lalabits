'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface ProductListItem {
  id: string;
  title: string;
  description: string;
  price_try: number;
  currency: string;
  publish_status: 'draft' | 'published' | 'archived';
  moderation_status: 'clean' | 'flagged' | 'removed';
  original_filename: string;
  file_size_bytes: string;
  content_type: string;
  created_at: string;
}

const STATUS_LABELS: Record<ProductListItem['publish_status'], string> = {
  draft: 'Taslak',
  published: 'Yayında',
  archived: 'Arşivlendi',
};

const STATUS_COLORS: Record<ProductListItem['publish_status'], string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-50 text-red-600',
};

function formatBytes(bytes: string): string {
  const n = parseInt(bytes, 10);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

type ActionState = Record<string, 'idle' | 'publishing' | 'archiving' | 'deleting'>;

async function productAction(
  productId: string,
  action: 'publish' | 'archive',
  accessToken: string,
): Promise<{ id: string; publish_status: ProductListItem['publish_status'] }> {
  const res = await fetch(`${API}/dashboard/products/${productId}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { code?: string };
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
  }
  return res.json() as Promise<{ id: string; publish_status: ProductListItem['publish_status'] }>;
}

async function deleteProduct(productId: string, accessToken: string): Promise<void> {
  const res = await fetch(`${API}/dashboard/products/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { code?: string };
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
  }
}

interface Props {
  products: ProductListItem[];
  accessToken: string;
  onStatusUpdated: (id: string, newStatus: ProductListItem['publish_status']) => void;
  onDeleted: (id: string) => void;
}

export default function ProductList({ products, accessToken, onStatusUpdated, onDeleted }: Props) {
  const [actionState, setActionState] = useState<ActionState>({});
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  async function handleAction(productId: string, action: 'publish' | 'archive') {
    setActionErrors((prev) => ({ ...prev, [productId]: '' }));
    setActionState((prev) => ({
      ...prev,
      [productId]: action === 'publish' ? 'publishing' : 'archiving',
    }));

    try {
      const result = await productAction(productId, action, accessToken);
      onStatusUpdated(result.id, result.publish_status);
    } catch {
      setActionErrors((prev) => ({ ...prev, [productId]: 'İşlem başarısız. Tekrar deneyin.' }));
    } finally {
      setActionState((prev) => ({ ...prev, [productId]: 'idle' }));
    }
  }

  async function handleDelete(productId: string) {
    setActionErrors((prev) => ({ ...prev, [productId]: '' }));
    setActionState((prev) => ({ ...prev, [productId]: 'deleting' }));

    try {
      await deleteProduct(productId, accessToken);
      onDeleted(productId);
    } catch {
      setActionErrors((prev) => ({ ...prev, [productId]: 'Silinemedi. Tekrar deneyin.' }));
      setActionState((prev) => ({ ...prev, [productId]: 'idle' }));
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
        <p className="text-sm text-muted">Henüz ürün yok.</p>
        <Link
          href="/dashboard/magaza/yeni"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          İlk ürününüzü ekleyin
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => {
        const busy = actionState[product.id] && actionState[product.id] !== 'idle';
        const isArchived = product.publish_status === 'archived';

        return (
          <div
            key={product.id}
            className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">{product.title}</p>
                  <span
                    className={[
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                      STATUS_COLORS[product.publish_status],
                    ].join(' ')}
                  >
                    {STATUS_LABELS[product.publish_status]}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted line-clamp-1">{product.description}</p>
                <p className="mt-1 text-xs text-muted">
                  {product.original_filename} · {formatBytes(product.file_size_bytes)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-foreground">
                  {(product.price_try / 100).toFixed(2)} ₺
                </p>
              </div>
            </div>

            {actionErrors[product.id] && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {actionErrors[product.id]}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {!isArchived && (
                <Link
                  href={`/dashboard/magaza/${product.id}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background"
                >
                  Düzenle
                </Link>
              )}

              {product.publish_status === 'draft' && (
                <button
                  type="button"
                  onClick={() => handleAction(product.id, 'publish')}
                  disabled={!!busy}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {actionState[product.id] === 'publishing' ? 'Yayınlanıyor…' : 'Yayınla'}
                </button>
              )}

              {!isArchived && (
                <button
                  type="button"
                  onClick={() => handleAction(product.id, 'archive')}
                  disabled={!!busy}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-background disabled:opacity-50"
                >
                  {actionState[product.id] === 'archiving' ? 'Arşivleniyor…' : 'Arşivle'}
                </button>
              )}

              {product.publish_status === 'draft' && (
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  disabled={!!busy}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {actionState[product.id] === 'deleting' ? 'Siliniyor…' : 'Sil'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
