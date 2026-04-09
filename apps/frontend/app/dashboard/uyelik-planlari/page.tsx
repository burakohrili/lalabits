'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import PlanList, { type Plan } from './_components/plan-list';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function UyelikPlanlariPage() {
  const { accessToken } = useAuth();
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    async function load() {
      try {
        const res = await fetch(`${API}/dashboard/plans`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { code?: string };
          throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
        }
        const data = (await res.json()) as { items: Plan[] };
        setPlans(data.items);
      } catch {
        setError('Planlar yüklenemedi. Yenile.');
      }
    }

    void load();
  }, [accessToken]);

  function handlePlanUpdated(id: string, newStatus: Plan['status']) {
    setPlans((prev) =>
      prev ? prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)) : prev,
    );
  }

  return (
    <div className="px-6 py-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Üyelik Planları</h1>
          <p className="mt-0.5 text-sm text-muted">
            Onboarding sırasında oluşturduğunuz planları yönetin.
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {!plans && !error && (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-5 animate-pulse">
              <div className="h-4 w-32 rounded bg-border mb-2" />
              <div className="h-3 w-20 rounded bg-border" />
            </div>
          ))}
        </div>
      )}

      {plans && (
        <PlanList
          plans={plans}
          accessToken={accessToken!}
          onUpdated={handlePlanUpdated}
        />
      )}
    </div>
  );
}
