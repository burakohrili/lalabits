'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price_monthly_try: number;
  tier_rank: number;
  status: string;
}

export interface OnboardingStatus {
  onboarding_last_step: number;
  profile: {
    display_name: string | null;
    username: string | null;
    bio: string | null;
    avatar_url: string | null;
  };
  category: {
    category: string | null;
    content_format_tags: string[];
  };
  plans: Plan[];
  payout: { iban_last_four: string; iban_format_valid: boolean } | null;
  application: { status: string; submitted_at: string; resubmission_count: number } | null;
}

async function apiFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { code?: string; message?: string };
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', body.message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export function useOnboarding() {
  const { accessToken, refreshToken } = useAuth();

  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await apiFetch<OnboardingStatus>('/onboarding/status', accessToken);
      setStatus(data);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.code : 'UNKNOWN');
    }
  }, [accessToken]);

  const saveProfile = useCallback(async (data: {
    display_name: string;
    username: string;
    bio?: string | null;
    avatar_filename?: string | null;
    avatar_content_type?: string | null;
  }): Promise<{ avatar_url: string | null; presigned_put_url: string | null }> => {
    const res = await apiFetch<{
      onboarding_last_step: number;
      avatar_url: string | null;
      presigned_put_url: string | null;
    }>('/onboarding/profile', accessToken!, { method: 'PUT', body: JSON.stringify(data) });

    setStatus((prev) => prev ? {
      ...prev,
      onboarding_last_step: Math.max(prev.onboarding_last_step, res.onboarding_last_step),
      profile: {
        ...prev.profile,
        display_name: data.display_name,
        username: data.username,
        bio: data.bio ?? prev.profile.bio,
        avatar_url: res.avatar_url ?? prev.profile.avatar_url,
      },
    } : prev);

    return { avatar_url: res.avatar_url, presigned_put_url: res.presigned_put_url };
  }, [accessToken]);

  const saveCategory = useCallback(async (data: {
    category: string;
    content_format_tags: string[];
  }) => {
    const res = await apiFetch<{ onboarding_last_step: number }>(
      '/onboarding/category',
      accessToken!,
      { method: 'PUT', body: JSON.stringify(data) },
    );
    setStatus((prev) => prev ? {
      ...prev,
      onboarding_last_step: Math.max(prev.onboarding_last_step, res.onboarding_last_step),
      category: data,
    } : prev);
  }, [accessToken]);

  const createPlan = useCallback(async (data: {
    name: string;
    description?: string | null;
    price_monthly_try: number;
    tier_rank: number;
  }): Promise<Plan> => {
    const plan = await apiFetch<Plan>(
      '/onboarding/plans',
      accessToken!,
      { method: 'POST', body: JSON.stringify(data) },
    );
    setStatus((prev) => prev ? {
      ...prev,
      onboarding_last_step: Math.max(prev.onboarding_last_step, 3),
      plans: [...prev.plans, plan],
    } : prev);
    return plan;
  }, [accessToken]);

  const updatePlan = useCallback(async (
    planId: string,
    data: { name?: string; description?: string | null; price_monthly_try?: number; tier_rank?: number },
  ): Promise<Plan> => {
    const plan = await apiFetch<Plan>(
      `/onboarding/plans/${planId}`,
      accessToken!,
      { method: 'PUT', body: JSON.stringify(data) },
    );
    setStatus((prev) => prev ? {
      ...prev,
      plans: prev.plans.map((p) => p.id === planId ? plan : p),
    } : prev);
    return plan;
  }, [accessToken]);

  const savePayout = useCallback(async (iban: string) => {
    const res = await apiFetch<{
      onboarding_last_step: number;
      payout: { iban_last_four: string; iban_format_valid: boolean };
    }>('/onboarding/payout', accessToken!, { method: 'PUT', body: JSON.stringify({ iban }) });

    setStatus((prev) => prev ? {
      ...prev,
      onboarding_last_step: Math.max(prev.onboarding_last_step, res.onboarding_last_step),
      payout: res.payout,
    } : prev);
  }, [accessToken]);

  const submit = useCallback(async () => {
    await apiFetch('/onboarding/submit', accessToken!, {
      method: 'POST',
      body: JSON.stringify({ agree_creator_terms: true }),
    });
    await refreshToken();
  }, [accessToken, refreshToken]);

  return {
    status,
    loadError,
    fetchStatus,
    saveProfile,
    saveCategory,
    createPlan,
    updatePlan,
    savePayout,
    submit,
  };
}
