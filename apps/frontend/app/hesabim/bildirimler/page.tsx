'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface NotificationPrefs {
  new_post: boolean;
  membership_renewed: boolean;
  payment_failed: boolean;
  new_product: boolean;
  platform_message: boolean;
}

const PREF_LABELS: { key: keyof NotificationPrefs; title: string; description: string }[] = [
  { key: 'new_post', title: 'Yeni Gönderi', description: 'Abone olduğun üreticiler yeni içerik paylaştığında.' },
  { key: 'membership_renewed', title: 'Üyelik Yenilendi', description: 'Üyeliğin başarıyla yenilendiğinde.' },
  { key: 'payment_failed', title: 'Ödeme Başarısız', description: 'Ödemen alınamazsa seni bilgilendiririz.' },
  { key: 'new_product', title: 'Yeni Ürün', description: 'Abone olduğun üreticiler yeni ürün eklediğinde.' },
  { key: 'platform_message', title: 'Platform Mesajı', description: 'lalabits.art duyuruları ve önemli güncellemeler.' },
];

export default function BildirimTercihlerPage() {
  const { accessToken } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [saving, setSaving] = useState<keyof NotificationPrefs | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    void fetch(`${API}/settings/notification-preferences`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((data) => setPrefs(data as NotificationPrefs))
      .catch(() => setError('Tercihler yüklenemedi.'));
  }, [accessToken]);

  async function toggle(key: keyof NotificationPrefs) {
    if (!prefs || !accessToken || saving !== null) return;
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(key);
    try {
      const res = await fetch(`${API}/settings/notification-preferences`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
    } catch {
      setPrefs(prefs);
      setError('Kaydedilemedi. Tekrar deneyin.');
    } finally {
      setSaving(null);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-2">
        <Link href="/hesabim" className="text-xs text-muted hover:text-foreground transition-colors">
          ← Hesabım
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Bildirim Tercihleri</h1>
        <p className="mt-1 text-sm text-muted">Almak istediğin bildirimleri seç.</p>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!prefs ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {PREF_LABELS.map(({ key, title, description }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5"
            >
              <div className="pr-4">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs text-muted">{description}</p>
              </div>
              <button
                type="button"
                onClick={() => void toggle(key)}
                disabled={saving === key}
                aria-label={prefs[key] ? 'Kapat' : 'Aç'}
                className={[
                  'relative shrink-0 h-6 w-11 rounded-full transition-colors duration-200',
                  prefs[key] ? 'bg-primary' : 'bg-gray-200',
                  saving === key ? 'opacity-60 cursor-wait' : '',
                ].join(' ')}
              >
                <span
                  className={[
                    'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
                    prefs[key] ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
