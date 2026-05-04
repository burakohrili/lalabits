'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';

function LegalConsent({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 flex gap-3">
      <input
        id="legal-consent-product"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
      />
      <label htmlFor="legal-consent-product" className="text-xs text-muted leading-relaxed cursor-pointer">
        <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="font-medium text-primary hover:underline">Mesafeli Satış Sözleşmesi</Link>
        {' '}ve{' '}
        <Link href="/iade-politikasi" target="_blank" className="font-medium text-primary hover:underline">İade Politikası</Link>
        &apos;nı okudum, anladım ve kabul ediyorum. Dijital ürünlerde erişim anında başladığından cayma hakkımın kullanılamayacağını onaylıyorum.
      </label>
    </div>
  );
}

const API = process.env.NEXT_PUBLIC_API_URL!;

interface ProductPreview {
  id: string;
  title: string;
  description: string;
  price_try: number;
  original_filename: string;
  content_type: string;
  seller: { display_name: string; username: string | null } | null;
}

type PageState = 'loading' | 'ready' | 'not_found' | 'already_owned' | 'success' | 'error';

export default function ProductCheckoutPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductPreview | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [legalAccepted, setLegalAccepted] = useState(false);

  useEffect(() => {
    if (!productId) return;

    async function load() {
      try {
        const [previewRes, statusRes] = await Promise.all([
          fetch(`${API}/store/products/${productId}`),
          accessToken
            ? fetch(`${API}/checkout/status?product_id=${productId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              })
            : Promise.resolve(null),
        ]);

        if (!previewRes.ok) {
          setPageState('not_found');
          return;
        }

        const data = (await previewRes.json()) as ProductPreview;
        setProduct(data);

        if (statusRes?.ok) {
          const status = (await statusRes.json()) as { purchased: boolean };
          if (status.purchased) {
            setPageState('already_owned');
            return;
          }
        }

        setPageState('ready');
      } catch {
        setPageState('not_found');
      }
    }

    void load();
  }, [productId, accessToken]);

  async function handlePurchase() {
    if (!accessToken || !product) return;

    setBusy(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API}/checkout/products/${product.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        if (body.code === 'ALREADY_PURCHASED') {
          setPageState('already_owned');
          return;
        }
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }

      setPageState('success');
    } catch {
      setErrorMessage('Satın alma başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setBusy(false);
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
          <p className="text-lg font-semibold text-foreground">Ürün bulunamadı</p>
          <p className="mt-2 text-sm text-muted">Bu ürün mevcut değil veya satışta değil.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-primary hover:underline">Ana sayfaya dön</Link>
        </div>
      </main>
    );
  }

  if (pageState === 'already_owned') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center flex flex-col gap-4">
          <p className="text-lg font-semibold text-foreground">Zaten Sahipsiniz</p>
          <p className="text-sm text-muted">Bu ürünü daha önce satın aldınız.</p>
          <Link
            href="/kutuphane"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Kütüphaneme Git
          </Link>
        </div>
      </main>
    );
  }

  if (pageState === 'success') {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-green-200 bg-green-50 p-8 text-center flex flex-col gap-4">
          <p className="text-lg font-semibold text-green-800">Satın Alındı!</p>
          <p className="text-sm text-green-700">{product?.title} kütüphanenize eklendi.</p>
          <Link
            href="/kutuphane"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Kütüphaneme Git
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 max-w-lg mx-auto">
      <div className="mb-6">
        {product?.seller?.username && (
          <Link
            href={`/@${product.seller.username}`}
            className="text-sm text-muted hover:text-foreground"
          >
            ← {product.seller.display_name}
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col gap-5">
        <div>
          <p className="text-xs text-muted mb-1">Ürün</p>
          <h1 className="text-xl font-semibold text-foreground">{product?.title}</h1>
          <p className="mt-2 text-sm text-muted leading-relaxed">{product?.description}</p>
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <p className="text-sm text-muted">Toplam</p>
          <p className="text-lg font-bold text-foreground">
            {product ? (product.price_try / 100).toFixed(2) : '—'} ₺
          </p>
        </div>

        {errorMessage && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</p>
        )}

        <LegalConsent checked={legalAccepted} onChange={setLegalAccepted} />

        <button
          type="button"
          onClick={handlePurchase}
          disabled={busy || !legalAccepted}
          className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? 'İşleniyor…' : 'Ödemeyi Tamamla'}
        </button>
      </div>
    </main>
  );
}
