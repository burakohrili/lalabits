'use client';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface CancelModalProps {
  subscriptionId: string;
  planName: string | null;
  creatorName: string | null;
  periodEnd: string;
  accessToken: string;
  onClose: () => void;
  onCancelled: (subscriptionId: string) => void;
}

export default function CancelModal({
  subscriptionId,
  planName,
  creatorName,
  periodEnd,
  accessToken,
  onClose,
  onCancelled,
}: CancelModalProps) {
  async function handleConfirm() {
    const res = await fetch(`${API}/membership/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      onCancelled(subscriptionId);
    } else {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      alert(body.message ?? 'İptal işlemi başarısız. Lütfen tekrar deneyin.');
    }
  }

  const formattedDate = new Date(periodEnd).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-lg">
        <h2 className="text-base font-semibold text-foreground">Üyeliği İptal Et</h2>

        <p className="mt-3 text-sm text-muted">
          <span className="font-medium text-foreground">{planName ?? 'Üyelik Planı'}</span>
          {creatorName && (
            <> ({creatorName})</>
          )}{' '}
          üyeliğinizi iptal etmek üzeresiniz.
        </p>

        <p className="mt-2 text-sm text-muted">
          İptal etseniz bile{' '}
          <span className="font-medium text-foreground">{formattedDate}</span>{' '}
          tarihine kadar erişiminiz devam edecektir.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-background transition-colors"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Evet, İptal Et
          </button>
        </div>
      </div>
    </div>
  );
}
