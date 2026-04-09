'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useOnboarding } from './_hooks/use-onboarding';
import WizardShell from './_components/wizard-shell';
import PendingView from './_components/pending-view';
import SuspendedInfoView from './_components/suspended-info-view';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function OnboardingPage() {
  const { status: authStatus, user, accessToken } = useAuth();
  const router = useRouter();
  const onboarding = useOnboarding();
  const fetchedRef = useRef(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris');
    }
  }, [authStatus, router]);

  // Fetch onboarding status once when we have a token and creator is in onboarding or rejected status.
  useEffect(() => {
    const creatorStatus = user?.creator_profile?.status;
    if (creatorStatus !== 'onboarding' && creatorStatus !== 'rejected') return;
    if (!accessToken) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    void onboarding.fetchStatus();

    // For rejected creators, also fetch rejection reason from creator/status
    if (creatorStatus === 'rejected') {
      void (async () => {
        try {
          const res = await fetch(`${API}/creator/status`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.ok) {
            const data = (await res.json()) as { rejection_reason: string | null };
            setRejectionReason(data.rejection_reason);
          }
        } catch {
          // non-critical — wizard renders without banner
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.creator_profile?.status, accessToken]);

  if (authStatus === 'loading') {
    return <PageSpinner />;
  }

  if (authStatus === 'unauthenticated') {
    // redirect in progress
    return null;
  }

  const creatorStatus = user?.creator_profile?.status;

  if (creatorStatus === 'pending_review') return <PendingView />;
  if (creatorStatus === 'approved') {
    router.replace('/dashboard');
    return null;
  }
  if (creatorStatus === 'suspended') return <SuspendedInfoView />;

  if (creatorStatus === 'onboarding' || creatorStatus === 'rejected') {
    if (onboarding.loadError) {
      return <FetchError code={onboarding.loadError} />;
    }
    if (!onboarding.status) {
      return <PageSpinner />;
    }
    return (
      <WizardShell
        onboarding={onboarding}
        rejectionReason={creatorStatus === 'rejected' ? rejectionReason : null}
      />
    );
  }

  // No creator profile or unknown status
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm text-center max-w-sm w-full">
        <p className="text-sm text-muted">Yaratıcı profili bulunamadı.</p>
      </div>
    </main>
  );
}

function PageSpinner() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </main>
  );
}

function FetchError({ code }: { code: string }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm text-center max-w-sm w-full">
        <p className="text-sm text-red-600">Veriler yüklenemedi ({code}). Sayfayı yenileyin.</p>
      </div>
    </main>
  );
}
