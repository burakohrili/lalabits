'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import CollectionForm, { type CollectionFormValues } from '../_components/collection-form';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface TierOption {
  id: string;
  name: string;
  status: string;
}

export default function YeniKoleksiyonPage() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [tiers, setTiers] = useState<TierOption[]>([]);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    async function loadTiers() {
      try {
        const res = await fetch(`${API}/dashboard/plans`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) return;
        const data = (await res.json()) as { items: TierOption[] };
        setTiers(data.items.filter((t) => t.status === 'published'));
      } catch {
        // tiers are optional; silently ignore
      }
    }

    void loadTiers();
  }, [accessToken]);

  async function handleSubmit(values: CollectionFormValues) {
    if (!accessToken) return;

    setBusy(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API}/dashboard/collections`, {
        method: 'POST',
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
      setSubmitError('Koleksiyon oluşturulamadı. Tekrar deneyin.');
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
        <h1 className="text-xl font-semibold text-foreground">Yeni Koleksiyon</h1>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <CollectionForm
          tiers={tiers}
          submitLabel="Taslak olarak kaydet"
          busy={busy}
          error={submitError}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
