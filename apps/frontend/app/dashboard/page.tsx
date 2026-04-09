'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import PlanStatsWidget from './_components/overview/plan-stats-widget';
import MemberStatsWidget from './_components/overview/member-stats-widget';
import QuickActionsBar from './_components/overview/quick-actions-bar';
import RevenuePlaceholderWidget from './_components/overview/revenue-placeholder-widget';
import PayoutMissingBanner from './_components/overview/payout-missing-banner';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface DashboardOverview {
  status: string;
  display_name: string;
  onboarding_last_step: number;
  plan_count: number;
  published_plan_count: number;
  active_member_count: number;
  payout_iban_connected: boolean;
}

export default function DashboardPage() {
  const { accessToken } = useAuth();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    async function load() {
      try {
        const res = await fetch(`${API}/dashboard/overview`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { code?: string };
          throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
        }
        setOverview((await res.json()) as DashboardOverview);
      } catch {
        setError('Genel bakış yüklenemedi.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [accessToken]);

  if (error) {
    return (
      <div className="px-6 py-8">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 flex flex-col gap-6 max-w-3xl">
      {!loading && overview && !overview.payout_iban_connected && <PayoutMissingBanner />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PlanStatsWidget
          planCount={loading ? null : (overview?.plan_count ?? 0)}
          publishedCount={loading ? null : (overview?.published_plan_count ?? 0)}
        />
        <MemberStatsWidget
          activeMemberCount={loading ? null : (overview?.active_member_count ?? 0)}
        />
        <RevenuePlaceholderWidget />
      </div>

      {!loading && <QuickActionsBar />}
    </div>
  );
}
