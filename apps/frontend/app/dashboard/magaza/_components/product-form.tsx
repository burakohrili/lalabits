'use client';

import { useState } from 'react';

export interface ProductFormValues {
  title: string;
  description: string;
  price_try: number;
}

interface Props {
  initial?: Partial<ProductFormValues>;
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onSubmit: (values: ProductFormValues) => void;
}

export default function ProductForm({ initial, submitLabel, busy, error, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [priceRaw, setPriceRaw] = useState(
    initial?.price_try != null ? String(initial.price_try / 100) : '',
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = parseFloat(priceRaw);
    onSubmit({
      title,
      description,
      price_try: Math.round(priceNum * 100),
    });
  }

  const priceValid = !isNaN(parseFloat(priceRaw)) && parseFloat(priceRaw) > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="product-title" className="text-sm font-medium text-foreground">
          Başlık <span className="text-red-500">*</span>
        </label>
        <input
          id="product-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          required
          disabled={busy}
          placeholder="Ürün başlığı"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="product-description" className="text-sm font-medium text-foreground">
          Açıklama <span className="text-red-500">*</span>
        </label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
          disabled={busy}
          placeholder="Ürün hakkında kısa bir açıklama yazın…"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 resize-y"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="product-price" className="text-sm font-medium text-foreground">
          Fiyat (₺) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="product-price"
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

      <div>
        <button
          type="submit"
          disabled={busy || !title.trim() || !description.trim() || !priceValid}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? 'Kaydediliyor…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
