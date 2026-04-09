'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import ProductForm, { type ProductFormValues } from '../_components/product-form';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price_try: number;
  publish_status: 'draft' | 'published' | 'archived';
  original_filename: string;
  file_size_bytes: string;
  content_type: string;
}

function formatBytes(bytes: string): string {
  const n = parseInt(bytes, 10);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EditUrunPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !productId) return;

    async function load() {
      try {
        const res = await fetch(`${API}/dashboard/products/${productId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { code?: string };
          if (res.status === 404 || res.status === 403) {
            router.replace('/dashboard/magaza');
            return;
          }
          throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
        }
        const data = (await res.json()) as ProductDetail;
        setProduct(data);
      } catch {
        setLoadError('Ürün yüklenemedi.');
      }
    }

    void load();
  }, [accessToken, productId, router]);

  async function handleSubmit(values: ProductFormValues) {
    if (!accessToken || !product) return;

    setBusy(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API}/dashboard/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          price_try: values.price_try,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }

      router.push('/dashboard/magaza');
    } catch {
      setSubmitError('Değişiklikler kaydedilemedi. Tekrar deneyin.');
      setBusy(false);
    }
  }

  return (
    <div className="px-6 py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/magaza" className="text-sm text-muted hover:text-foreground">
          ← Mağaza
        </Link>
        <span className="text-muted">/</span>
        <h1 className="text-xl font-semibold text-foreground">Ürünü Düzenle</h1>
      </div>

      {loadError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{loadError}</p>
      )}

      {!product && !loadError && (
        <div className="rounded-2xl border border-border bg-surface p-6 animate-pulse">
          <div className="h-4 w-48 rounded bg-border mb-4" />
          <div className="h-20 rounded bg-border mb-4" />
          <div className="h-4 w-32 rounded bg-border" />
        </div>
      )}

      {product && product.publish_status === 'archived' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-5">
          Bu ürün arşivlenmiştir ve düzenlenemez.
        </div>
      )}

      {product && product.publish_status !== 'archived' && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-border bg-surface px-5 py-4">
            <p className="text-xs font-medium text-muted mb-1">Mevcut dosya</p>
            <p className="text-sm text-foreground">{product.original_filename}</p>
            <p className="text-xs text-muted mt-0.5">
              {formatBytes(product.file_size_bytes)} · {product.content_type}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <ProductForm
              initial={{
                title: product.title,
                description: product.description,
                price_try: product.price_try,
              }}
              submitLabel="Değişiklikleri kaydet"
              busy={busy}
              error={submitError}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
