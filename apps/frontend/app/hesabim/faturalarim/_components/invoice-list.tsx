'use client';

export interface InvoiceItem {
  id: string;
  invoice_type: string;
  label: string;
  amount_try: number;
  currency: string;
  status: string;
  issued_at: string;
  paid_at: string | null;
  creator_display_name: string | null;
  creator_username: string | null;
}

interface InvoiceListProps {
  items: InvoiceItem[];
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'paid') {
    return (
      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
        Ödendi
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
        Başarısız
      </span>
    );
  }
  if (status === 'refunded') {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-muted">
        İade Edildi
      </span>
    );
  }
  return null;
}

export default function InvoiceList({ items }: InvoiceListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted">Henüz ödeme geçmişiniz yok.</p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface overflow-hidden">
      {items.map((inv) => (
        <div key={inv.id} className="flex items-center justify-between gap-4 px-5 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{inv.label}</p>
            {inv.creator_display_name && (
              <p className="text-xs text-muted">{inv.creator_display_name}</p>
            )}
            <p className="text-xs text-muted">
              {new Date(inv.issued_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <p
              className={[
                'text-sm font-semibold',
                inv.status === 'failed' ? 'text-muted line-through' : 'text-foreground',
              ].join(' ')}
            >
              {(inv.amount_try / 100).toFixed(2)} ₺
            </p>
            <StatusBadge status={inv.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
