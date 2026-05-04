'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function HesabimPage() {
  const { user } = useAuth();

  const items = [
    {
      href: '/hesabim/profil',
      title: 'Profilim',
      description: 'Görünen adını ve profil fotoğrafını güncelle.',
    },
    {
      href: '/hesabim/sifre',
      title: 'Şifre Değiştir',
      description: 'Hesap güvenliğin için şifreni güncelle.',
    },
    {
      href: '/hesabim/faturalarim',
      title: 'Faturalarım',
      description: 'Geçmiş ödemelerini ve aktif aboneliklerini görüntüle.',
    },
    {
      href: '/hesabim/milestones',
      title: 'Rozetlerim',
      description: 'Destekçi yolculuğundaki dönüm noktaların ve kazandığın sertifikalar.',
    },
    {
      href: '/hesabim/bildirimler',
      title: 'Bildirim Tercihleri',
      description: 'Hangi bildirimler almak istediğini özelleştir.',
    },
    {
      href: '/hesabim/hesabimi-sil',
      title: 'Hesabımı Sil',
      description: 'Hesabını kalıcı olarak kapat.',
      danger: true,
    },
  ];

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Hesabım</h1>
        <p className="mt-1 text-sm text-muted">Profil ve hesap bilgilerini yönet.</p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'flex items-center justify-between rounded-2xl border bg-surface p-5 transition-colors',
              item.danger
                ? 'border-red-200 hover:border-red-400'
                : 'border-border hover:border-primary/40',
            ].join(' ')}
          >
            <div>
              <p className={`text-sm font-semibold ${item.danger ? 'text-red-600' : 'text-foreground'}`}>
                {item.title}
              </p>
              <p className="mt-0.5 text-xs text-muted">{item.description}</p>
            </div>
            <span className="text-muted text-lg">›</span>
          </Link>
        ))}
      </div>

      {!user?.creator_profile && (
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm font-semibold text-foreground mb-1">İçerik üreticisi olmak ister misin?</p>
          <p className="text-xs text-muted mb-4">Üyelikler oluştur, premium içerik sat ve topluluk kur.</p>
          <Link
            href="/auth/kayit/yaratici"
            className="inline-block rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Üretici Başvurusu Yap →
          </Link>
        </div>
      )}
    </main>
  );
}
