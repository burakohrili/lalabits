'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface CreatorStatus {
  status: string;
  rejection_reason: string | null;
  onboarding_last_step: number;
}

export default function RejectedInfoView() {
  const { accessToken } = useAuth();
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    void (async () => {
      try {
        const res = await fetch(`${API}/creator/status`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = (await res.json()) as CreatorStatus;
          setRejectionReason(data.rejection_reason);
        }
      } catch (err) {
        if (!(err instanceof ApiError)) {
          // non-critical — view still renders without reason
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm flex flex-col gap-6 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-foreground">Başvurunuz Reddedildi</h1>
            <p className="text-sm text-muted">
              Maalesef başvurunuz bu aşamada onaylanamadı.
            </p>
          </div>

          {!loading && rejectionReason && (
            <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground text-left">
              <p className="text-xs font-medium text-muted mb-1">Red gerekçesi</p>
              <p>{rejectionReason}</p>
            </div>
          )}

          <p className="text-xs text-muted">
            Sorularınız için destek ekibiyle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </main>
  );
}
