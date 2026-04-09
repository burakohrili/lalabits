import type { ApplicationListItem } from '../page';

interface Props {
  items: ApplicationListItem[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  emptyText?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  writer: 'Yazar',
  illustrator: 'İllüstratör',
  educator: 'Eğitimci',
  podcaster: 'Podcaster',
  musician: 'Müzisyen',
  designer: 'Tasarımcı',
  developer: 'Geliştirici',
  other: 'Diğer',
};

export default function ApplicationList({ items, loading, selectedId, onSelect, emptyText = 'Başvuru yok.' }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
        <p className="text-sm text-muted">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <ul className="divide-y divide-border">
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          const submittedDate = new Date(item.submitted_at).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={[
                  'w-full px-5 py-4 text-left transition-colors hover:bg-background',
                  isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : '',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.creator.display_name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {item.creator.email}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-muted">
                      {CATEGORY_LABELS[item.creator.category] ?? item.creator.category}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{submittedDate}</p>
                  </div>
                </div>
                {item.resubmission_count > 0 && (
                  <span className="mt-1.5 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                    {item.resubmission_count}. yeniden başvuru
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
