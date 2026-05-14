'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface FanBillingProfile {
  id: string;
  legal_full_name: string | null;
  tax_number: string | null;
  billing_address: string | null;
  city: string | null;
  postal_code: string | null;
  billing_email: string | null;
}

export default function FanBillingProfilePage() {
  const { accessToken, status: authStatus } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<FanBillingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    legal_full_name: '',
    tax_number: '',
    billing_address: '',
    city: '',
    postal_code: '',
    billing_email: '',
  });

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/hesabim/fatura-bilgileri');
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus !== 'authenticated' || !accessToken) return;
    void (async () => {
      try {
        const res = await fetch(`${API}/billing/fan-profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = (await res.json()) as FanBillingProfile;
          setProfile(data);
          setForm({
            legal_full_name: data.legal_full_name ?? '',
            tax_number: data.tax_number ?? '',
            billing_address: data.billing_address ?? '',
            city: data.city ?? '',
            postal_code: data.postal_code ?? '',
            billing_email: data.billing_email ?? '',
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [authStatus, accessToken]);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !accessToken) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const method = profile ? 'PUT' : 'POST';
      const res = await fetch(`${API}/billing/fan-profile`, {
        method,
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legal_full_name: form.legal_full_name.trim() || null,
          tax_number: form.tax_number.trim() || null,
          billing_address: form.billing_address.trim() || null,
          city: form.city.trim() || null,
          postal_code: form.postal_code.trim() || null,
          billing_email: form.billing_email.trim() || null,
        }),
      });
      if (!res.ok) throw new Error('SAVE_FAILED');
      const data = (await res.json()) as FanBillingProfile;
      setProfile(data);
      setSuccess(true);
    } catch {
      setError('Bilgiler kaydedilemedi. Tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  }

  if (authStatus === 'loading' || authStatus === 'unauthenticated' || loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <main className="px-4 py-10 max-w-2xl mx-auto">
      <a href="/hesabim" className="text-xs text-muted hover:text-foreground transition-colors mb-6 inline-block">
        ← Hesabım
      </a>
      <h1 className="text-2xl font-bold text-foreground mb-2">Fatura Bilgileri</h1>
      <p className="text-sm text-muted mb-8">
        Bu bilgiler satın aldığınız ürün ve üyelikler için fatura düzenlenirken kullanılır.
      </p>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Kişisel / Kurumsal Bilgiler</h2>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Ad Soyad / Unvan</label>
            <input
              type="text"
              value={form.legal_full_name}
              onChange={(e) => set('legal_full_name', e.target.value)}
              placeholder="Ad Soyad veya Şirket Unvanı"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              Vergi Numarası <span className="font-normal">(isteğe bağlı)</span>
            </label>
            <input
              type="text"
              value={form.tax_number}
              onChange={(e) => set('tax_number', e.target.value)}
              placeholder="Vergi numaranız"
              maxLength={20}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Fatura E-posta Adresi</label>
            <input
              type="email"
              value={form.billing_email}
              onChange={(e) => set('billing_email', e.target.value)}
              placeholder="fatura@ornek.com"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="mt-1 text-[11px] text-muted">Boş bırakırsanız hesap e-postanız kullanılır.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Fatura Adresi</h2>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Adres</label>
            <textarea
              value={form.billing_address}
              onChange={(e) => set('billing_address', e.target.value)}
              rows={3}
              placeholder="Mahalle, sokak, kapı no…"
              className="w-full resize-none rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Şehir</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="İstanbul"
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Posta Kodu</label>
              <input
                type="text"
                value={form.postal_code}
                onChange={(e) => set('postal_code', e.target.value)}
                placeholder="34000"
                maxLength={10}
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">Fatura bilgileri kaydedildi.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </form>
    </main>
  );
}
