import Link from 'next/link';

const ACTIONS = [
  { label: 'Gönderi Oluştur', href: '/dashboard/gonderiler' },
  { label: 'Plan Ekle', href: '/dashboard/uyelik-planlari' },
  { label: 'Ürün Ekle', href: '/dashboard/magaza' },
] as const;

export default function QuickActionsBar() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">Hızlı Erişim</p>
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-background transition-colors"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
