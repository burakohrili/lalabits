'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface CollectionItem {
  item_id: string;
  item_type: string;
  sort_order: number;
  product: {
    id: string;
    title: string;
    original_filename: string;
    content_type: string;
    file_size_bytes: string;
  };
}

interface CollectionDetail {
  collection_id: string;
  title: string;
  description: string;
  items: CollectionItem[];
}

type PageState = 'loading' | 'ready' | 'not_found' | 'error';

function formatBytes(bytes: string): string {
  const n = parseInt(bytes, 10);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CollectionDetailPage() {
  const { accessToken, status: authStatus } = useAuth();
  const params = useParams();
  const collectionId = params.id as string;

  const [detail, setDetail] = useState<CollectionDetail | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionId || authStatus === 'loading' || !accessToken) return;

    async function load() {
      try {
        const res = await fetch(`${API}/library/collections/${collectionId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.status === 404 || res.status === 403) {
          setPageState('not_found');
          return;
        }
        if (!res.ok) {
          setPageState('error');
          return;
        }
        const data = (await res.json()) as CollectionDetail;
        setDetail(data);
        setPageState('ready');
      } catch {
        setPageState('error');
      }
    }

    void load();
  }, [collectionId, authStatus, accessToken]);

  async function handleDownloadItem(itemId: string) {
    if (!accessToken) return;
    setDownloadingId(itemId);
    setDownloadError(null);
    try {
      const res = await fetch(
        `${API}/library/collections/${collectionId}/items/${itemId}/download`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
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

  if (pageState === 'loading') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (pageState === 'not_found') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">Koleksiyon bulunamadı</p>
          <p className="mt-2 text-sm text-muted">Bu koleksiyon satın alınmamış veya erişim kaldırılmış olabilir.</p>
          <Link href="/kutuphane" className="mt-4 inline-block text-sm text-primary hover:underline">
            Kütüphaneme dön
          </Link>
        </div>
      </main>
    );
  }

  if (pageState === 'error') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">Bir hata oluştu.</p>
          <Link href="/kutuphane" className="mt-4 inline-block text-sm text-primary hover:underline">
            Kütüphaneme dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/kutuphane" className="text-sm text-muted hover:text-foreground">
          ← Kütüphanem
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">{detail?.title}</h1>
      {detail?.description && (
        <p className="text-sm text-muted leading-relaxed mb-6">{detail.description}</p>
      )}

      {downloadError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{downloadError}</p>
      )}

      {detail?.items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted">Bu koleksiyonda henüz indirilebilir içerik yok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {detail?.items.map((item) => (
            <div
              key={item.item_id}
              className="rounded-2xl border border-border bg-surface p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.product.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {item.product.original_filename} · {formatBytes(item.product.file_size_bytes)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadItem(item.item_id)}
                disabled={downloadingId === item.item_id}
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {downloadingId === item.item_id ? 'Hazırlanıyor…' : 'İndir'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
