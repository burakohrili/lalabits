'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface CollectionItem {
  id: string;
  item_type: 'post' | 'product';
  item_id: string;
  sort_order: number;
  created_at: string;
}

interface PostOption {
  id: string;
  title: string;
  publish_status: string;
}

interface ProductOption {
  id: string;
  title: string;
  publish_status: string;
}

interface Props {
  collectionId: string;
  items: CollectionItem[];
  accessToken: string;
  onItemsChanged: (items: CollectionItem[]) => void;
}

export default function ItemManager({ collectionId, items, accessToken, onItemsChanged }: Props) {
  const [tab, setTab] = useState<'posts' | 'products'>('posts');
  const [posts, setPosts] = useState<PostOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch(`${API}/dashboard/posts?limit=100`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { items: PostOption[] };
        setPosts(data.items);
      } catch {
        setLoadError('Gönderiler yüklenemedi.');
      }
    }

    async function loadProducts() {
      try {
        const res = await fetch(`${API}/dashboard/products?limit=100`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { items: ProductOption[] };
        setProducts(data.items);
      } catch {
        setLoadError('Ürünler yüklenemedi.');
      }
    }

    void loadPosts();
    void loadProducts();
  }, [accessToken]);

  const itemIds = new Set(items.map((i) => i.item_id));

  async function handleAdd(itemType: 'post' | 'product', itemId: string) {
    setActionError('');
    setBusyId(itemId);
    try {
      const res = await fetch(`${API}/dashboard/collections/${collectionId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ item_type: itemType, item_id: itemId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }
      const newItem = (await res.json()) as CollectionItem;
      onItemsChanged([...items, newItem]);
    } catch {
      setActionError('Öğe eklenemedi. Tekrar deneyin.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(item: CollectionItem) {
    setActionError('');
    setBusyId(item.id);
    try {
      const res = await fetch(
        `${API}/dashboard/collections/${collectionId}/items/${item.id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }
      onItemsChanged(items.filter((i) => i.id !== item.id));
    } catch {
      setActionError('Öğe kaldırılamadı. Tekrar deneyin.');
    } finally {
      setBusyId(null);
    }
  }

  const currentOptions = tab === 'posts' ? posts : products;

  return (
    <div className="flex flex-col gap-4">
      {/* Current items */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted">Koleksiyondaki öğeler ({items.length})</p>
          {[...items].sort((a, b) => a.sort_order - b.sort_order).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0 rounded px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600">
                  {item.item_type === 'post' ? 'Gönderi' : 'Ürün'}
                </span>
                <span className="text-xs text-muted truncate">{item.item_id}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                disabled={busyId === item.id}
                className="shrink-0 ml-3 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {busyId === item.id ? '…' : 'Kaldır'}
              </button>
            </div>
          ))}
        </div>
      )}

      {actionError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{actionError}</p>
      )}

      {/* Picker */}
      <div>
        <div className="mb-3 flex gap-1 border-b border-border">
          {(['posts', 'products'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                'px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-foreground',
              ].join(' ')}
            >
              {t === 'posts' ? 'Gönderiler' : 'Ürünler'}
            </button>
          ))}
        </div>

        {loadError && (
          <p className="text-xs text-red-600">{loadError}</p>
        )}

        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
          {currentOptions.length === 0 && !loadError && (
            <p className="text-xs text-muted">Henüz öğe yok.</p>
          )}
          {currentOptions.map((opt) => {
            const inCollection = itemIds.has(opt.id);
            return (
              <div
                key={opt.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">{opt.title}</p>
                  <p className="text-xs text-muted">{opt.publish_status}</p>
                </div>
                {inCollection ? (
                  <span className="ml-3 shrink-0 text-xs text-muted">Eklendi</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAdd(tab === 'posts' ? 'post' : 'product', opt.id)}
                    disabled={busyId === opt.id}
                    className="ml-3 shrink-0 rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    {busyId === opt.id ? '…' : 'Ekle'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
