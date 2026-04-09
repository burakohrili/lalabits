import Link from 'next/link';

interface Props {
  planCount: number | null;
  publishedCount: number | null;
}

export default function PlanStatsWidget({ planCount, publishedCount }: Props) {
  const loading = planCount === null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted uppercase tracking-wide">Üyelik Planları</p>
        <Link
          href="/dashboard/uyelik-planlari"
          className="text-xs text-primary hover:underline"
        >
          Yönet →
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="h-7 w-16 rounded bg-border animate-pulse" />
          <div className="h-4 w-24 rounded bg-border animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-semibold text-foreground">{planCount}</p>
          <p className="text-xs text-muted">
            {publishedCount} yayında · {(planCount ?? 0) - (publishedCount ?? 0)} taslak
          </p>
        </div>
      )}
    </div>
  );
}
