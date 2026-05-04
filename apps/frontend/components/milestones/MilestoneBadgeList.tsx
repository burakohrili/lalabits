'use client';

import MilestoneBadge from './MilestoneBadge';

interface MilestoneItem {
  id: string;
  type: string;
  titleTr: string;
  earnedAt: string;
  certificateUrl?: string | null;
  shareText?: string;
  palette?: {
    bg?: string;
    accent?: string;
    text?: string;
  };
}

interface MilestoneBadgeListProps {
  milestones: MilestoneItem[];
  emptyMessage?: string;
}

export default function MilestoneBadgeList({
  milestones,
  emptyMessage = 'Henüz rozetin yok. Aktif olarak platforma katıl!',
}: MilestoneBadgeListProps) {
  if (milestones.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
        <p className="text-sm text-neutral-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {milestones.map((m) => (
        <MilestoneBadge
          key={m.id}
          titleTr={m.titleTr}
          earnedAt={m.earnedAt}
          certificateUrl={m.certificateUrl}
          shareText={m.shareText}
          palette={m.palette}
        />
      ))}
    </div>
  );
}
