'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import MilestoneBadgeList from '@/components/milestones/MilestoneBadgeList';
import { MILESTONE_LABEL_MAP } from '@/lib/milestone-labels';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface RawMilestone {
  id: string;
  type: string;
  certificate_url: string | null;
  share_text: string;
  earned_at: string;
}

export default function FanMilestonesPage() {
  const { accessToken } = useAuth();
  const [milestones, setMilestones] = useState<RawMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    fetch(`${API}/milestones/fan`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((data: RawMilestone[]) => setMilestones(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken]);

  const items = milestones.map((m) => ({
    id: m.id,
    type: m.type,
    titleTr: MILESTONE_LABEL_MAP[m.type]?.titleTr ?? m.type,
    earnedAt: m.earned_at,
    certificateUrl: m.certificate_url,
    shareText: m.share_text,
    palette: MILESTONE_LABEL_MAP[m.type]?.palette,
  }));

  return (
    <div className="px-6 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Rozetlerim</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Destekçi yolculuğundaki dönüm noktaların
      </p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <MilestoneBadgeList
          milestones={items}
          emptyMessage="Henüz rozet kazanmadın. Üreticileri keşfet ve desteklemeye başla!"
        />
      )}
    </div>
  );
}
