'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface PurchasedProduct {
  purchase_id: string;
  product_id: string;
  title: string;
  description: string;
  original_filename: string;
  content_type: string;
  file_size_bytes: string;
  amount_paid_try: number;
  purchased_at: string;
  seller: { display_name: string; username: string | null } | null;
}

interface PurchasedCollection {
  purchase_id: string;
  collection_id: string;
  title: string;
  description: string;
  item_count: number;
  amount_paid_try: number;
  purchased_at: string;
  seller: { display_name: string; username: string | null } | null;
}

interface ActiveSubscription {
  subscription_id: string;
  plan_id: string;
  plan_name: string | null;
  creator_display_name: string | null;
  creator_username: string | null;
  status: string;
  billing_interval: string;
  current_period_end: string;
}

type Tab = 'products' | 'collections' | 'memberships';

function formatBytes(bytes: string): string {
  const n = parseInt(bytes, 10);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LibraryPage() {
  const { accessToken, status: authStatus } = useAuth();
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<PurchasedProduct[]>([]);
  const [collections, setCollections] = useState<PurchasedCollection[]>([]);
  const [memberships, setMemberships] = useState<ActiveSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'loading' || !accessToken) return;

    async function load() {
      setLoading(true);
      try {
        const [prodRes, colRes, memRes] = await Promise.all([
          fetch(`${API}/library/products`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`${API}/library/collections`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`${API}/membership/subscriptions`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);
        if (prodRes.ok) {
          const data = (await prodRes.json()) as { items: PurchasedProduct[] };
          setProducts(data.items);
        }
        if (colRes.ok) {
          const data = (await colRes.json()) as { items: PurchasedCollection[] };
          setCollections(data.items);
        }
        if (memRes.ok) {
          const data = (await memRes.json()) as { items: ActiveSubscription[] };
          setMemberships(data.items);
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [authStatus, accessToken]);

  async function handleDownloadProduct(productId: string) {
    if (!accessToken) return;
    setDownloadingId(productId);
    setDownloadError(null);
    try {
      const res = await fetch(`${API}/library/products/${productId}/download`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setDownloadError(body.message ?? 'İndirme başarısız.');
        return;
      }
      const { download_url } = (await res.json()) as { download_url: string };
      window.location.href = download_url;
    } catch {
      setDownloadError('İndirme başarısız. Lütfen tekrar deneyin.');
    } finally {
      setDownloadingId(null);
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  const isEmpty = products.length === 0 && collections.length === 0 && memberships.length === 0;

  return (
    <main className="px-4 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Kütüphanem</h1>

      {isEmpty ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">Henüz satın alınan içerik yok.</p>
          <p className="mt-2 text-sm text-muted">Üreticileri keşfet ve dijital ürünlerini satın al.</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-border">
            <button
              type="button"
              onClick={() => setTab('products')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              Ürünler {products.length > 0 && `(${products.length})`}
            </button>
            <button
              type="button"
              onClick={() => setTab('collections')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === 'collections'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              Koleksiyonlar {collections.length > 0 && `(${collections.length})`}
            </button>
            <button
              type="button"
              onClick={() => setTab('memberships')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === 'memberships'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              Üyeliklerim {memberships.length > 0 && `(${memberships.length})`}
            </button>
          </div>

          {downloadError && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {downloadError}
            </p>
          )}

          {/* Products tab */}
          {tab === 'products' && (
            <div className="flex flex-col gap-4">
              {products.length === 0 ? (
                <p className="text-sm text-muted">Satın alınan ürün yok.</p>
              ) : (
                products.map((item) => (
                  <div
                    key={item.purchase_id}
                    className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs text-muted line-clamp-2">{item.description}</p>
                        <p className="mt-1 text-xs text-muted">
                          {item.original_filename} · {formatBytes(item.file_size_bytes)}
                          {item.seller && <> · {item.seller.display_name}</>}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadProduct(item.product_id)}
                        disabled={downloadingId === item.product_id}
                        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                      >
                        {downloadingId === item.product_id ? 'Hazırlanıyor…' : 'İndir'}
                      </button>
                    </div>
                    <p className="text-xs text-muted">
                      {(item.amount_paid_try / 100).toFixed(2)} ₺ ·{' '}
                      {new Date(item.purchased_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Collections tab */}
          {tab === 'collections' && (
            <div className="flex flex-col gap-4">
              {collections.length === 0 ? (
                <p className="text-sm text-muted">Satın alınan koleksiyon yok.</p>
              ) : (
                collections.map((item) => (
                  <Link
                    key={item.purchase_id}
                    href={`/kutuphane/koleksiyonlar/${item.collection_id}`}
                    className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs text-muted line-clamp-2">{item.description}</p>
                        <p className="mt-1 text-xs text-muted">
                          {item.item_count} öğe
                          {item.seller && <> · {item.seller.display_name}</>}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-primary font-medium">Aç →</span>
                    </div>
                    <p className="text-xs text-muted">
                      {(item.amount_paid_try / 100).toFixed(2)} ₺ ·{' '}
                      {new Date(item.purchased_at).toLocaleDateString('tr-TR')}
                    </p>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Memberships tab — LD-3: list surface only, no download */}
          {tab === 'memberships' && (
            <div className="flex flex-col gap-4">
              {memberships.length === 0 ? (
                <p className="text-sm text-muted">Aktif üyelik yok.</p>
              ) : (
                memberships.map((item) => (
                  <div
                    key={item.subscription_id}
                    className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{item.plan_name ?? 'Üyelik Planı'}</p>
                        {item.creator_display_name && (
                          <p className="mt-0.5 text-xs text-muted">
                            {item.creator_display_name}
                            {item.creator_username && (
                              <> · <Link href={`/@${item.creator_username}`} className="hover:underline">@{item.creator_username}</Link></>
                            )}
                          </p>
                        )}
                      </div>
                      <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
                        item.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.status === 'active' ? 'Aktif' : 'İptal Edildi'}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      Dönem sonu: {new Date(item.current_period_end).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
