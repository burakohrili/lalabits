'use client';

import { useState } from 'react';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price_monthly_try: number;
  price_annual_try: number | null;
  tier_rank: number;
  status: 'draft' | 'published' | 'hidden' | 'archived';
}

const STATUS_LABELS: Record<Plan['status'], string> = {
  draft: 'Taslak',
  published: 'Yayında',
  hidden: 'Gizli',
  archived: 'Arşivlendi',
};

const STATUS_COLORS: Record<Plan['status'], string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  hidden: 'bg-amber-100 text-amber-700',
  archived: 'bg-red-50 text-red-600',
};

interface Props {
  plans: Plan[];
  accessToken: string;
  onUpdated: (id: string, newStatus: Plan['status']) => void;
}

type ActionState = Record<string, 'idle' | 'publishing' | 'hiding' | 'archiving'>;

async function planAction(
  planId: string,
  action: 'publish' | 'hide' | 'archive',
  accessToken: string,
): Promise<{ id: string; status: Plan['status'] }> {
  const res = await fetch(`${API}/dashboard/plans/${planId}/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { code?: string };
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
  }
  return res.json() as Promise<{ id: string; status: Plan['status'] }>;
}

export default function PlanList({ plans, accessToken, onUpdated }: Props) {
  const [actionState, setActionState] = useState<ActionState>({});
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  async function handleAction(planId: string, action: 'publish' | 'hide' | 'archive') {
    setActionErrors((prev) => ({ ...prev, [planId]: '' }));
    setActionState((prev) => ({
      ...prev,
      [planId]: action === 'publish' ? 'publishing' : action === 'hide' ? 'hiding' : 'archiving',
    }));

    try {
      const result = await planAction(planId, action, accessToken);
      onUpdated(result.id, result.status);
    } catch (err) {
      let msg = 'İşlem başarısız. Tekrar deneyin.';
      if (err instanceof ApiError) {
        if (err.status === 409 && err.code === 'PLAN_HAS_SUBSCRIBERS') {
          msg = 'Aktif üyeleri olan plan arşivlenemez.';
        } else if (err.status === 409 && err.code === 'PLAN_ALREADY_PUBLISHED') {
          msg = 'Plan zaten yayında.';
        }
      }
      setActionErrors((prev) => ({ ...prev, [planId]: msg }));
    } finally {
      setActionState((prev) => ({ ...prev, [planId]: 'idle' }));
    }
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
        <p className="text-sm text-muted">Henüz plan yok.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {plans.map((plan) => {
        const busy = actionState[plan.id] && actionState[plan.id] !== 'idle';
        const isArchived = plan.status === 'archived';

        return (
          <div
            key={plan.id}
            className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{plan.name}</p>
                  <span
                    className={[
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                      STATUS_COLORS[plan.status],
                    ].join(' ')}
                  >
                    {STATUS_LABELS[plan.status]}
                  </span>
                </div>
                {plan.description && (
                  <p className="mt-0.5 text-xs text-muted line-clamp-2">{plan.description}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-foreground">
                  {(plan.price_monthly_try / 100).toFixed(2)} ₺/ay
                </p>
                {plan.price_annual_try != null && (
                  <p className="text-xs text-muted">
                    {(plan.price_annual_try / 100).toFixed(2)} ₺/yıl
                  </p>
                )}
              </div>
            </div>

            {actionErrors[plan.id] && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {actionErrors[plan.id]}
              </p>
            )}

            {!isArchived && (
              <div className="flex gap-2 flex-wrap">
                {plan.status !== 'published' && (
                  <button
                    type="button"
                    onClick={() => handleAction(plan.id, 'publish')}
                    disabled={!!busy}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    {actionState[plan.id] === 'publishing' ? 'Yayınlanıyor…' : 'Yayınla'}
                  </button>
                )}
                {plan.status === 'published' && (
                  <button
                    type="button"
                    onClick={() => handleAction(plan.id, 'hide')}
                    disabled={!!busy}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background disabled:opacity-50"
                  >
                    {actionState[plan.id] === 'hiding' ? 'Gizleniyor…' : 'Gizle'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleAction(plan.id, 'archive')}
                  disabled={!!busy}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {actionState[plan.id] === 'archiving' ? 'Arşivleniyor…' : 'Arşivle'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
