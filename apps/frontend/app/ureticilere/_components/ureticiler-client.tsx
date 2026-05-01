'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

interface UreticiItem {
  username: string | null;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  category: string;
}

interface UreticilerResponse {
  items: UreticiItem[];
  total: number;
  page: number;
  limit: number;
}

interface Props {
  initialData: UreticilerResponse;
  initialCategory?: string;
}

function UreticiKart({ item }: { item: UreticiItem }) {
  const href = item.username ? `/u/${item.username}` : '#';
  const label = CATEGORY_LABELS[item.category] ?? item.category;
  const initial = item.display_name.charAt(0).toUpperCase();

  return (
    <div className="group flex flex-col bg-white border border-border rounded-[20px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:scale-[1.01] transition-all duration-300">
      {/* Cover */}
      <div className="h-[140px] bg-gradient-to-br from-teal-light to-teal/20" />
      {/* Avatar */}
      <div className="px-5 -mt-7">
        {item.avatar_url ? (
          <Image
            src={item.avatar_url}
            alt={item.display_name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border-4 border-white object-cover shadow-sm"
            sizes="56px"
          />
        ) : (
          <div className="h-14 w-14 rounded-full border-4 border-white bg-teal flex items-center justify-center text-white text-lg font-bold shadow-sm">
            {initial}
          </div>
        )}
      </div>
      {/* İçerik */}
      <div className="flex flex-col flex-1 px-5 pt-2 pb-5">
        <div className="flex items-start gap-2 justify-between">
          <p className="font-semibold text-text-primary text-base leading-tight truncate">{item.display_name}</p>
          <span className="shrink-0 rounded-full bg-teal-light text-teal text-xs font-medium px-2.5 py-0.5">
            {label}
          </span>
        </div>
        {item.username && (
          <p className="text-xs text-text-muted mt-0.5">@{item.username}</p>
        )}
        {item.bio && (
          <p className="mt-2 text-sm text-text-secondary line-clamp-2 leading-[1.6]">{item.bio}</p>
        )}
        <Link
          href={href}
          className="mt-4 rounded-xl border border-border py-2.5 text-center text-sm font-semibold text-text-primary hover:border-teal hover:text-teal transition-colors duration-150"
        >
          Profilini Gör
        </Link>
      </div>
    </div>
  );
}

export default function UreticilerClient({ initialData, initialCategory }: Props) {
  const [data, setData] = useState<UreticilerResponse>(initialData);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(initialCategory ?? '');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchUreticiler = useCallback(async (p: number, cat: string, q: string) => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (cat) params.set('category', cat);
      if (q) params.set('q', q);
      const res = await fetch(`${API}/creators?${params.toString()}`);
      if (!res.ok) throw new Error();
      const json = (await res.json()) as UreticilerResponse;
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const isInitialMount =
    page === 1 && category === (initialCategory ?? '') && debouncedQuery === '';

  useEffect(() => {
    if (isInitialMount) return;
    void fetchUreticiler(page, category, debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, debouncedQuery]);

  function handleCategory(val: string) {
    setCategory(val);
    setPage(1);
  }

  const totalPages = Math.ceil(data.total / LIMIT);
  const from = data.total === 0 ? 0 : (data.page - 1) * LIMIT + 1;
  const to = Math.min(data.page * LIMIT, data.total);

  return (
    <div>
      {/* Arama + filtre */}
      <div className="mb-8 flex flex-col gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="İsim veya kullanıcı adı ara..."
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal/25"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategory('')}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              category === ''
                ? 'bg-teal text-white'
                : 'border border-border text-text-secondary hover:text-text-primary hover:border-teal',
            ].join(' ')}
          >
            Tümü
          </button>
          {CATEGORIES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => handleCategory(value)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                category === value
                  ? 'bg-teal text-white'
                  : 'border border-border text-text-secondary hover:text-text-primary hover:border-teal',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sonuç sayısı */}
      {!loading && !error && data.total > 0 && (
        <p className="mb-6 text-sm text-text-muted">
          {data.total} içerik üreticisinden {from}–{to} gösteriliyor
        </p>
      )}

      {/* Hata */}
      {error && (
        <div className="rounded-[20px] border border-border bg-white px-6 py-12 text-center">
          <p className="text-sm text-text-secondary">Üreticiler yüklenemedi.</p>
          <button
            type="button"
            onClick={() => void fetchUreticiler(page, category, debouncedQuery)}
            className="mt-3 text-sm font-semibold text-teal hover:underline"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[20px] border border-border bg-white overflow-hidden animate-pulse">
              <div className="h-[140px] bg-gray-100" />
              <div className="px-5 -mt-7 mb-2">
                <div className="h-14 w-14 rounded-full bg-gray-200 border-4 border-white" />
              </div>
              <div className="px-5 pb-5 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Boş durum */}
      {!loading && !error && data.items.length === 0 && (
        <div className="rounded-[20px] border border-border bg-white px-6 py-12 text-center">
          <p className="text-sm text-text-secondary">
            {category || debouncedQuery
              ? 'Bu filtreyle eşleşen içerik üreticisi bulunamadı.'
              : 'Henüz içerik üreticisi yok.'}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && data.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((c) => (
            <UreticiKart key={c.username ?? c.display_name} item={c} />
          ))}
        </div>
      )}

      {/* Sayfalama */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-primary disabled:opacity-40 hover:bg-background transition-colors"
          >
            Önceki
          </button>
          <span className="text-sm text-text-muted">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-primary disabled:opacity-40 hover:bg-background transition-colors"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}
