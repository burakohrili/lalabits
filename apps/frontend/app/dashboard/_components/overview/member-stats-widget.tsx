interface Props {
  activeMemberCount: number | null;
}

export default function MemberStatsWidget({ activeMemberCount }: Props) {
  const loading = activeMemberCount === null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">Aktif Üyeler</p>

      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="h-7 w-12 rounded bg-border animate-pulse" />
          <div className="h-4 w-28 rounded bg-border animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-semibold text-foreground">{activeMemberCount}</p>
          <p className="text-xs text-muted">
            {activeMemberCount === 0
              ? 'Henüz aktif üye yok.'
              : 'aktif üyelik'}
          </p>
        </div>
      )}
    </div>
  );
}
