'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface PreferenceItem {
  notification_type: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
}

const TYPE_LABELS: Record<string, { label: string; group: string }> = {
  membership_renewal_success: { label: 'Üyelik yenilendi', group: 'Üyelik' },
  membership_renewal_failed: { label: 'Üyelik yenileme başarısız', group: 'Üyelik' },
  membership_cancelled_confirmed: { label: 'Üyelik iptal edildi', group: 'Üyelik' },
  membership_expired: { label: 'Üyelik sona erdi', group: 'Üyelik' },
  new_post_published: { label: 'Yeni içerik yayınlandı', group: 'İçerik' },
  new_product_published: { label: 'Yeni ürün yayınlandı', group: 'İçerik' },
  order_confirmed: { label: 'Sipariş onaylandı', group: 'Sipariş' },
  content_removed: { label: 'İçerik kaldırıldı', group: 'Sistem' },
  creator_application_approved: { label: 'Üretici başvurusu onaylandı', group: 'Sistem' },
  creator_application_rejected: { label: 'Üretici başvurusu reddedildi', group: 'Sistem' },
  admin_broadcast: { label: 'Platform duyurusu', group: 'Sistem' },
};

const GROUPS = ['Üyelik', 'İçerik', 'Sipariş', 'Sistem'];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
        checked ? 'bg-primary' : 'bg-gray-200',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}

export default function BildirimlerPage() {
  const { accessToken, status: authStatus } = useAuth();
  const router = useRouter();

  const [prefs, setPrefs] = useState<PreferenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/giris?next=/ayarlar/bildirimler');
      return;
    }
    if (authStatus === 'loading' || !accessToken) return;
    void load();
  }, [authStatus, accessToken, router]);

  async function load() {
    try {
      const res = await fetch(`${API}/settings/notification-preferences`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { preferences: PreferenceItem[] };
      setPrefs(data.preferences);
    } catch {
      setError('Tercihler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  function toggle(type: string, field: 'email_enabled' | 'in_app_enabled', value: boolean) {
    setPrefs((prev) =>
      prev.map((p) => (p.notification_type === type ? { ...p, [field]: value } : p)),
    );
  }

  async function handleSave() {
    if (!accessToken || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${API}/settings/notification-preferences`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error('SAVE_FAILED');
      setSuccess(true);
    } catch {
      setError('Tercihler kaydedilemedi. Tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/ayarlar" className="text-sm text-primary hover:underline">
          ← Ayarlar
        </Link>
        <span className="text-muted">·</span>
        <h1 className="text-lg font-semibold text-foreground">Bildirim Tercihleri</h1>
      </div>

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Tercihler kaydedildi.
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {GROUPS.map((group) => {
          const groupPrefs = prefs.filter(
            (p) => TYPE_LABELS[p.notification_type]?.group === group,
          );
          if (groupPrefs.length === 0) return null;

          return (
            <div key={group}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
                {group}
              </h2>
              <div className="rounded-2xl border border-border bg-surface overflow-hidden divide-y divide-border">
                {/* Header */}
                <div className="flex items-center px-4 py-2">
                  <span className="flex-1 text-xs text-muted" />
                  <span className="w-20 text-center text-xs text-muted">Uygulama</span>
                  <span className="w-20 text-center text-xs text-muted">E-posta</span>
                </div>
                {groupPrefs.map((pref) => (
                  <div key={pref.notification_type} className="flex items-center px-4 py-3 gap-3">
                    <span className="flex-1 text-sm text-foreground">
                      {TYPE_LABELS[pref.notification_type]?.label ?? pref.notification_type}
                    </span>
                    <div className="w-20 flex justify-center">
                      <Toggle
                        checked={pref.in_app_enabled}
                        onChange={(v) => toggle(pref.notification_type, 'in_app_enabled', v)}
                      />
                    </div>
                    <div className="w-20 flex justify-center">
                      <Toggle
                        checked={pref.email_enabled}
                        onChange={(v) => toggle(pref.notification_type, 'email_enabled', v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? 'Kaydediliyor…' : 'Tercihleri Kaydet'}
        </button>
      </div>
    </main>
  );
}
