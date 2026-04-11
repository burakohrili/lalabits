import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Politikası | lalabits.art',
  description:
    'lalabits.art çerez politikası. Hangi çerezlerin kullanıldığı, amaçları ve nasıl yönetileceği.',
};

const bolumler = [
  'Çerez Nedir?',
  'Kullandığımız Çerez Türleri',
  'Çerez Yönetimi',
  'Üçüncü Taraf Çerezler',
  'Değişiklikler',
  'İletişim',
];

export default function CerezPolitikasiPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Çerez Politikası</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Son güncelleme: Ocak 2025</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          {/* Ana içerik */}
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Çerez Nedir?</h2>
              <p>
                Çerezler, ziyaret ettiğiniz web sitesi tarafından tarayıcınıza
                yerleştirilen küçük metin dosyalarıdır. Oturumunuzu hatırlamak,
                tercihlerinizi saklamak ve platform performansını ölçmek amacıyla kullanılır.
              </p>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-6">2. Kullandığımız Çerez Türleri</h2>

              {/* Zorunlu */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-text-primary">2.1 Zorunlu Çerezler</h3>
                  <span className="rounded-full bg-teal-light text-teal text-[11px] font-semibold px-2.5 py-0.5">
                    Devre dışı bırakılamaz
                  </span>
                </div>
                <p className="mb-4">Platform işlevselliği için gereklidir.</p>
                <div className="rounded-[16px] border border-border overflow-hidden">
                  <div className="grid grid-cols-4 bg-background px-5 py-2.5 border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wide">
                    <span>Çerez adı</span>
                    <span>Amaç</span>
                    <span>Süre</span>
                    <span>Sağlayıcı</span>
                  </div>
                  {[
                    ['session_id', 'Oturum yönetimi', 'Oturum süresince', 'lalabits.art'],
                    ['csrf_token', 'Güvenlik — sahte istek koruması', 'Oturum süresince', 'lalabits.art'],
                  ].map(([ad, amac, sure, sagla]) => (
                    <div key={ad} className="grid grid-cols-4 px-5 py-3 border-b border-border last:border-0 text-xs">
                      <span className="font-mono text-text-primary font-medium">{ad}</span>
                      <span>{amac}</span>
                      <span>{sure}</span>
                      <span>{sagla}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tercih */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-text-primary">2.2 Tercih Çerezleri</h3>
                  <span className="rounded-full bg-orange-light text-orange text-[11px] font-semibold px-2.5 py-0.5">
                    Devre dışı bırakılabilir
                  </span>
                </div>
                <p className="mb-4">Dil, tema ve kullanıcı ayarlarını hatırlar.</p>
                <div className="rounded-[16px] border border-border overflow-hidden">
                  <div className="grid grid-cols-4 bg-background px-5 py-2.5 border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wide">
                    <span>Çerez adı</span>
                    <span>Amaç</span>
                    <span>Süre</span>
                    <span>Sağlayıcı</span>
                  </div>
                  <div className="grid grid-cols-4 px-5 py-3 text-xs">
                    <span className="font-mono text-text-primary font-medium">user_prefs</span>
                    <span>Kullanıcı tercihleri (dil, görünüm)</span>
                    <span>1 yıl</span>
                    <span>lalabits.art</span>
                  </div>
                </div>
              </div>

              {/* Analitik */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-text-primary">2.3 Analitik Çerezler</h3>
                  <span className="rounded-full bg-orange-light text-orange text-[11px] font-semibold px-2.5 py-0.5">
                    Devre dışı bırakılabilir
                  </span>
                </div>
                <p className="mb-4">Platform kullanımını anonim olarak ölçer.</p>
                <div className="rounded-[16px] border border-border overflow-hidden">
                  <div className="grid grid-cols-4 bg-background px-5 py-2.5 border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wide">
                    <span>Çerez adı</span>
                    <span>Amaç</span>
                    <span>Süre</span>
                    <span>Sağlayıcı</span>
                  </div>
                  <div className="grid grid-cols-4 px-5 py-3 text-xs">
                    <span className="font-mono text-text-primary font-medium">_ga / _gid</span>
                    <span>Anonim ziyaretçi istatistikleri</span>
                    <span>2 yıl / 24 saat</span>
                    <span>Google Analytics</span>
                  </div>
                </div>
              </div>

              {/* Pazarlama */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-text-primary">2.4 Pazarlama Çerezleri</h3>
                  <span className="rounded-full bg-background border border-border text-text-muted text-[11px] font-semibold px-2.5 py-0.5">
                    Yalnızca açık rıza ile
                  </span>
                </div>
                <div className="rounded-[16px] border border-border px-5 py-4">
                  <p className="text-xs mb-1"><span className="font-medium text-text-primary">Amaç:</span> Hedefli reklam ve yeniden pazarlama</p>
                  <p className="text-xs mb-1"><span className="font-medium text-text-primary">Süre:</span> 90 gün</p>
                  <p className="text-xs"><span className="font-medium text-text-primary">Sağlayıcı:</span> Google, Meta (varsa)</p>
                </div>
              </div>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Çerez Yönetimi</h2>
              <p className="mb-4">
                Siteyi ilk ziyaretinizde çerez tercih bannerı görüntülenir.
                Zorunlu dışındaki çerezleri kabul edebilir veya reddedebilirsiniz.
              </p>
              <p className="mb-4">Tercihlerinizi değiştirmek için:</p>
              <ul className="space-y-1 mb-6">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-teal flex-shrink-0">·</span>
                  Sitemizin alt kısmındaki &quot;Çerez Tercihleri&quot; bağlantısını kullanın.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-teal flex-shrink-0">·</span>
                  Tarayıcı ayarlarından çerezleri silebilirsiniz.
                </li>
              </ul>
              <p className="font-medium text-text-primary mb-2">Tarayıcı bazlı çerez silme:</p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Chrome', 'Ayarlar > Gizlilik > Çerezler'],
                  ['Firefox', 'Seçenekler > Gizlilik > Çerezleri Temizle'],
                  ['Safari', 'Tercihler > Gizlilik > Web Sitesi Verilerini Yönet'],
                ].map(([tarayici, yol], i) => (
                  <div key={tarayici} className={`flex items-center gap-4 px-5 py-3 ${i !== 2 ? 'border-b border-border' : ''}`}>
                    <span className="font-semibold text-text-primary w-20 flex-shrink-0">{tarayici}</span>
                    <span className="text-xs">{yol}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Üçüncü Taraf Çerezler</h2>
              <p>
                Google Analytics, platforma anonim ziyaretçi verileri sağlamak
                amacıyla kullanılmaktadır. Google&apos;ın gizlilik politikası için:{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal hover:underline"
                >
                  policies.google.com/privacy
                </a>
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Değişiklikler</h2>
              <p>
                Bu politika güncellenebilir. Önemli değişikliklerde
                kayıtlı e-posta adresinize bildirim gönderilir.
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. İletişim</h2>
              <p>
                Çerezler hakkında sorularınız için:{' '}
                <a href="mailto:iletisim@lalabits.art" className="text-teal hover:underline">
                  iletisim@lalabits.art
                </a>
              </p>
            </section>
          </article>

          {/* Sticky TOC */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 rounded-[16px] border border-border bg-white p-5">
              <p className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">İçindekiler</p>
              <ol className="space-y-2.5">
                {bolumler.map((baslik, i) => (
                  <li key={baslik}>
                    <a
                      href={`#bolum-${i + 1}`}
                      className="text-xs text-text-secondary hover:text-teal transition-colors leading-[1.5] block"
                    >
                      {i + 1}. {baslik}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
