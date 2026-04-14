'use client';

import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL!;

const REQUEST_TYPES = [
  { value: 'data_access', label: 'Kişisel Verilerime Erişim' },
  { value: 'data_deletion', label: 'Kişisel Verilerimin Silinmesi' },
  { value: 'data_correction', label: 'Kişisel Verilerimin Düzeltilmesi' },
  { value: 'opt_out', label: 'Veri İşlemeden Vazgeçme' },
  { value: 'other', label: 'Diğer' },
] as const;

type RequestType = (typeof REQUEST_TYPES)[number]['value'];

export default function KvkkTalepPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('data_access');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (submitting) return;
    if (!fullName.trim() || !email.trim()) {
      setError('Ad soyad ve e-posta zorunludur.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/kvkk/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          request_type: requestType,
          details: details.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('SUBMIT_FAILED');
      setDone(true);
    } catch {
      setError('Talebiniz gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-16">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">Talebiniz Alındı</h1>
          <p className="text-sm text-muted leading-relaxed">
            KVKK talebiniz kaydedildi. En kısa sürede e-posta adresinize dönüş yapılacaktır.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-2xl font-bold text-foreground mb-2">KVKK Başvuru Formu</h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki haklarınızı kullanmak için aşağıdaki formu doldurun.
        </p>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Ad Soyad *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={200}
              placeholder="Adınız Soyadınız"
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">E-posta *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={300}
              placeholder="ornek@eposta.com"
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Talep Türü *</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as RequestType)}
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {REQUEST_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Açıklama (opsiyonel)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Talebinizi daha ayrıntılı açıklayın…"
              className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {submitting ? 'Gönderiliyor…' : 'Talebi Gönder'}
          </button>
        </div>

        <p className="mt-6 text-xs text-muted text-center leading-relaxed">
          Talebiniz mevzuat kapsamında en geç 30 gün içinde yanıtlanacaktır.
        </p>
      </div>
    </main>
  );
}
