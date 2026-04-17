'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';
import { ApiError } from '@/lib/api-client';
import ApplicationList from './_components/application-list';
import ReviewPanel from './_components/review-panel';

const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_SIZE = 20;

type DecisionFilter = 'pending' | 'approved';

export interface ApplicationListItem {
  id: string;
  creator_profile_id: string;
  submitted_at: string;
  resubmission_count: number;
  decision: string;
  creator: {
    display_name: string;
    username: string;
    category: string;
    email: string;
  };
}

interface ListResponse {
  items: ApplicationListItem[];
  total: number;
  page: number;
  limit: number;
}

const FILTER_LABELS: Record<DecisionFilter, string> = {
  pending: 'Bekleyenler',
  approved: 'Onaylananlar',
};

const EMPTY_TEXT: Record<DecisionFilter, string> = {
  pending: 'Bekleyen başvuru yok.',
  approved: 'Onaylanmış başvuru yok.',
};

export default function UreticiBasvurularPage() {
  const { accessToken, logout } = useAdminAuth();
  const [decision, setDecision] = useState<DecisionFilter>('pending');
  const [items, setItems] = useState<ApplicationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchList = useCallback(async (d: DecisionFilter, p: number) => {
    if (!accessToken) return;
    setLoadingList(true);
    setListError(null);
    try {
      const res = await fetch(
        `${API}/admin/creator-applications?decision=${d}&page=${p}&limit=${PAGE_SIZE}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }
      const data = (await res.json()) as ListResponse;
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      } else {
        setListError('Liste yüklenemedi.');
      }
    } finally {
      setLoadingList(false);
    }
  }, [accessToken, logout]);

  useEffect(() => {
    void fetchList(decision, page);
  }, [fetchList, decision, page]);

  function handleFilterChange(d: DecisionFilter) {
    setDecision(d);
    setPage(1);
    setSelectedId(null);
  }

  function handleReviewed(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
    setSelectedId(null);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Üretici Başvuruları</h1>
            <p className="mt-0.5 text-sm text-muted">
              {FILTER_LABELS[decision]}
              {total > 0 && ` — ${total} adet`}
            </p>
          </div>
          <a href="/admin/ureticiler" className="text-sm text-primary hover:underline">
            ← Üreticiler
          </a>
        </div>

        {/* Decision filter tabs */}
        <div className="mb-5 flex gap-1 rounded-xl border border-border bg-surface p-1 w-fit">
          {(['pending', 'approved'] as DecisionFilter[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleFilterChange(d)}
              className={[
                'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
                decision === d
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-foreground',
              ].join(' ')}
            >
              {FILTER_LABELS[d]}
            </button>
          ))}
        </div>

        {listError && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{listError}</p>
        )}

        <div className="flex gap-6">
          <div className="min-w-0 flex-1">
            <ApplicationList
              items={items}
              loading={loadingList}
              selectedId={selectedId}
              onSelect={setSelectedId}
              emptyText={EMPTY_TEXT[decision]}
            />

            {totalPages > 1 && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-background disabled:opacity-40"
                >
                  Önceki
                </button>
                <span className="text-sm text-muted">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-background disabled:opacity-40"
                >
                  Sonraki
                </button>
              </div>
            )}
          </div>

          {selectedId && (
            <div className="w-full max-w-sm shrink-0">
              <ReviewPanel
                applicationId={selectedId}
                accessToken={accessToken!}
                onReviewed={handleReviewed}
                onClose={() => setSelectedId(null)}
                onAuthError={logout}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
