'use client';

import { useState } from 'react';

export interface CollectionFormValues {
  title: string;
  description: string;
  access_type: 'purchase' | 'tier_gated';
  price_try?: number;
  required_tier_id?: string;
}

interface TierOption {
  id: string;
  name: string;
}

interface Props {
  initial?: Partial<CollectionFormValues>;
  tiers: TierOption[];
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onSubmit: (values: CollectionFormValues) => void;
}

export default function CollectionForm({ initial, tiers, submitLabel, busy, error, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [accessType, setAccessType] = useState<'purchase' | 'tier_gated'>(initial?.access_type ?? 'purchase');
  const [priceRaw, setPriceRaw] = useState(
    initial?.price_try != null ? String(initial.price_try / 100) : '',
  );
  const [tierId, setTierId] = useState(initial?.required_tier_id ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const values: CollectionFormValues = {
      title,
      description,
      access_type: accessType,
    };
    if (accessType === 'purchase') {
      values.price_try = Math.round(parseFloat(priceRaw) * 100);
    } else {
      values.required_tier_id = tierId;
    }
    onSubmit(values);
  }

  const priceValid = accessType !== 'purchase' || (!isNaN(parseFloat(priceRaw)) && parseFloat(priceRaw) > 0);
  const tierValid = accessType !== 'tier_gated' || tierId !== '';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="col-title" className="text-sm font-medium text-foreground">
          Başlık <span className="text-red-500">*</span>
        </label>
        <input
          id="col-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          required
          disabled={busy}
          placeholder="Koleksiyon başlığı"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="col-description" className="text-sm font-medium text-foreground">
          Açıklama <span className="text-red-500">*</span>
        </label>
        <textarea
          id="col-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          disabled={busy}
          placeholder="Koleksiyon hakkında kısa bir açıklama…"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 resize-y"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-foreground">Erişim türü <span className="text-red-500">*</span></p>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="access_type"
              value="purchase"
              checked={accessType === 'purchase'}
              onChange={() => setAccessType('purchase')}
              disabled={busy}
            />
            <span className="text-sm text-foreground">Satın alma</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="access_type"
              value="tier_gated"
              checked={accessType === 'tier_gated'}
              onChange={() => setAccessType('tier_gated')}
              disabled={busy}
            />
            <span className="text-sm text-foreground">Üyelik katmanı</span>
          </label>
        </div>
      </div>

      {accessType === 'purchase' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="col-price" className="text-sm font-medium text-foreground">
            Fiyat (₺) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="col-price"
              type="number"
              min="0.01"
              step="0.01"
              value={priceRaw}
              onChange={(e) => setPriceRaw(e.target.value)}
              required
              disabled={busy}
              placeholder="0.00"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">₺</span>
          </div>
        </div>
      )}

      {accessType === 'tier_gated' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="col-tier" className="text-sm font-medium text-foreground">
            Üyelik katmanı <span className="text-red-500">*</span>
          </label>
          {tiers.length === 0 ? (
            <p className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted">
              Yayınlanmış üyelik planı yok.
            </p>
          ) : (
            <select
              id="col-tier"
              value={tierId}
              onChange={(e) => setTierId(e.target.value)}
              required
              disabled={busy}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            >
              <option value="">Seçin…</option>
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={busy || !title.trim() || !description.trim() || !priceValid || !tierValid}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? 'Kaydediliyor…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
