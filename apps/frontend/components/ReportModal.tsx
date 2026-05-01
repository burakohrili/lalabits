'use client';

import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL!;

const REASON_CODES = [
  { value: 'spam', label: 'Spam veya yanıltıcı içerik' },
  { value: 'illegal_content', label: 'Yasadışı içerik' },
  { value: 'copyright', label: 'Telif hakkı ihlali' },
  { value: 'harassment', label: 'Taciz veya zorbalık' },
  { value: 'misinformation', label: 'Yanlış bilgi' },
  { value: 'other', label: 'Diğer' },
] as const;

type ReasonCode = (typeof REASON_CODES)[number]['value'];

interface Props {
  targetType: 'post' | 'product' | 'collection' | 'user' | 'creator_profile';
  targetId: string;
  accessToken: string;
  onClose: () => void;
}

export default function ReportModal({ targetType, targetId, accessToken, onClose }: Props) {
  const [reasonCode, setReasonCode] = useState<ReasonCode>('spam');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/reports`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          reason_code: reasonCode,
          details: details.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('SUBMIT_FAILED');
      setDone(true);
    } catch {
      setError('Şikayet gönderilemedi. Tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-background border border-border p-6 shadow-xl">
        {done ? (
          <div className="text-center py-4">
            <p className="text-sm font-semibold text-foreground mb-1">Şikayet alındı</p>
            <p className="text-xs text-muted mb-5">Bildiriminiz incelenecek, teşekkürler.</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Kapat
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Şikayet Et</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="text-muted hover:text-foreground text-xl leading-none"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            {error && (
              <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium text-foreground mb-2">
                Şikayet nedeni
              </label>
              <select
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value as ReasonCode)}
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {REASON_CODES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-foreground mb-2">
                Ek açıklama (opsiyonel)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Durumu daha ayrıntılı açıklayın…"
                className="w-full resize-none rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                {submitting ? 'Gönderiliyor…' : 'Şikayet Et'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
