'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import CollectionForm, { type CollectionFormValues } from '../_components/collection-form';
import ItemManager from '../_components/item-manager';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface CollectionItem {
  id: string;
  item_type: 'post' | 'product';
  item_id: string;
  sort_order: number;
  created_at: string;
}

interface CollectionDetail {
  id: string;
  title: string;
  description: string;
  access_type: 'purchase' | 'tier_gated';
  price_try: number | null;
  required_tier_id: string | null;
  publish_status: 'draft' | 'published' | 'archived';
  items: CollectionItem[];
}

interface TierOption {
  id: string;
  name: string;
  status: string;
}

export default function EditKoleksiyonPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [tiers, setTiers] = useState<TierOption[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !collectionId) return;

    async function load() {
      try {
        const [colRes, tierRes] = await Promise.all([
          fetch(`${API}/dashboard/collections/${collectionId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`${API}/dashboard/plans`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        if (!colRes.ok) {
          const body = await colRes.json().catch(() => ({})) as { code?: string };
          if (colRes.status === 404 || colRes.status === 403) {
            router.replace('/dashboard/koleksiyonlar');
            return;
          }
          throw new ApiError(colRes.status, body.code ?? 'UNKNOWN', '');
        }

        const data = (await colRes.json()) as CollectionDetail;
        setCollection(data);

        if (tierRes.ok) {
          const tierData = (await tierRes.json()) as { items: TierOption[] };
          setTiers(tierData.items.filter((t) => t.status === 'published'));
        }
      } catch {
        setLoadError('Koleksiyon yüklenemedi.');
      }
    }

    void load();
  }, [accessToken, collectionId, router]);

  async function handleSubmit(values: CollectionFormValues) {
    if (!accessToken || !collection) return;

    setBusy(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API}/dashboard/collections/${collection.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          access_type: values.access_type,
          price_try: values.price_try,
          required_tier_id: values.required_tier_id,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }

      router.push('/dashboard/koleksiyonlar');
    } catch {
      setSubmitError('Değişiklikler kaydedilemedi. Tekrar deneyin.');
      setBusy(false);
    }
  }

  return (
    <div className="px-6 py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/koleksiyonlar" className="text-sm text-muted hover:text-foreground">
          ← Koleksiyonlar
        </Link>
        <span className="text-muted">/</span>
        <h1 className="text-xl font-semibold text-foreground">Koleksiyonu Düzenle</h1>
      </div>

      {loadError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{loadError}</p>
      )}

      {!collection && !loadError && (
        <div className="rounded-2xl border border-border bg-surface p-6 animate-pulse">
          <div className="h-4 w-48 rounded bg-border mb-4" />
          <div className="h-20 rounded bg-border mb-4" />
          <div className="h-4 w-32 rounded bg-border" />
        </div>
      )}

      {collection && collection.publish_status === 'archived' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-5">
          Bu koleksiyon arşivlenmiştir ve düzenlenemez.
        </div>
      )}

      {collection && collection.publish_status !== 'archived' && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <CollectionForm
              initial={{
                title: collection.title,
                description: collection.description,
                access_type: collection.access_type,
                price_try: collection.price_try ?? undefined,
                required_tier_id: collection.required_tier_id ?? undefined,
              }}
              tiers={tiers}
              submitLabel="Değişiklikleri kaydet"
              busy={busy}
              error={submitError}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm font-medium text-foreground mb-4">Öğeler</p>
            <ItemManager
              collectionId={collection.id}
              items={collection.items}
              accessToken={accessToken!}
              onItemsChanged={(newItems) =>
                setCollection((prev) => prev ? { ...prev, items: newItems } : prev)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
