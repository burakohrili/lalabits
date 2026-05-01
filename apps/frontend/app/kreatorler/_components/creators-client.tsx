'use client';

import { useState, useEffect, useCallback } from 'react';
import CreatorCard, { type CreatorCardItem } from '@/app/_components/creator-card';

const API = process.env.NEXT_PUBLIC_API_URL!;

const CATEGORY_LABELS: Record<string, string> = {
  writer: 'Yazar',
  illustrator: 'Çizer',
  educator: 'Eğitimci',
  podcaster: 'Podcastçı',
  musician: 'Müzisyen',
  designer: 'Tasarımcı',
  developer: 'Geliştirici',
  other: 'Diğer',
};

const CATEGORIES = Object.entries(CATEGORY_LABELS);
const LIMIT = 20;

interface CreatorsResponse {
  items: CreatorCardItem[];
  total: number;
  page: number;
  limit: number;
}

interface CreatorsClientProps {
  initialData: CreatorsResponse;
  initialCategory?: string;
}

export default function CreatorsClient({ initialData, initialCategory }: CreatorsClientProps) {
  const [data, setData] = useState<CreatorsResponse>(initialData);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(initialCategory ?? '');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchCreators = useCallback(async (p: number, cat: string, q: string) => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (cat) params.set('category', cat);
      if (q) params.set('q', q);
      const res = await fetch(`${API}/creators?${params.toString()}`);
      if (!res.ok) throw new Error('fetch failed');
      const json = (await res.json()) as CreatorsResponse;
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch on filter/search/page change (skip on mount — we have initialData)
  const isInitialMount =
    page === 1 && category === (initialCategory ?? '') && debouncedQuery === '';

  useEffect(() => {
    if (isInitialMount) return;
    void fetchCreators(page, category, debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, debouncedQuery]);

  function handleCategoryChange(val: string) {
    setCategory(val);
    setPage(1);
  }

  function handleQueryChange(val: string) {
    setQuery(val);
    setPage(1);
  }

  const totalPages = Math.ceil(data.total / LIMIT);
  const from = data.total === 0 ? 0 : (data.page - 1) * LIMIT + 1;
  const to = Math.min(data.page * LIMIT, data.total);

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="İsim veya kullanıcı adı ara..."
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={[
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              category === ''
                ? 'bg-primary text-white'
                : 'border border-border text-muted hover:text-foreground',
            ].join(' ')}
          >
            Tümü
          </button>
          {CATEGORIES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => handleCategoryChange(value)}
              className={[
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                category === value
                  ? 'bg-primary text-white'
                  : 'border border-border text-muted hover:text-foreground',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!loading && !error && data.total > 0 && (
        <p className="mb-4 text-xs text-muted">
          {data.total} üreticiden {from}–{to} gösteriliyor
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
          <p className="text-sm text-muted">Üreticiler yüklenemedi.</p>
          <button
            type="button"
            onClick={() => void fetchCreators(page, category, debouncedQuery)}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-5 animate-pulse">
              <div className="flex gap-3 items-center mb-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded bg-gray-100 w-3/4" />
                  <div className="h-3 rounded bg-gray-100 w-1/2" />
                </div>
              </div>
              <div className="h-3 rounded bg-gray-100 w-full mb-2" />
              <div className="h-3 rounded bg-gray-100 w-5/6" />
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && data.items.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
          <p className="text-sm text-muted">
            {category || debouncedQuery
              ? 'Bu filtreyle eşleşen üretici bulunamadı.'
              : 'Henüz üretici yok.'}
          </p>
        </div>
      )}

      {!loading && !error && data.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((c) => (
            <CreatorCard key={c.username} item={c} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground disabled:opacity-40 hover:bg-background transition-colors"
          >
            Önceki
          </button>
          <span className="text-sm text-muted">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground disabled:opacity-40 hover:bg-background transition-colors"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}
