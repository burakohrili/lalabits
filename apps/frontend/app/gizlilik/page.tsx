import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | lalabits.art',
  description:
    'lalabits.art gizlilik politikası ve kişisel veri işleme esasları. KVKK kapsamında hazırlanmıştır.',
};

const bolumler = [
  'Veri Sorumlusu',
  'Toplanan Kişisel Veriler',
  'Verilerin İşlenme Amaçları ve Hukuki Dayanaklar',
  'Verilerin Aktarıldığı Taraflar',
  'Veri Saklama Süreleri',
  'Veri Sahibi Hakları (KVKK Madde 11)',
  'Veri Güvenliği',
  'Politika Değişiklikleri',
];

export default function GizlilikPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Gizlilik Politikası</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Son güncelleme: Ocak 2025</span>
            <span>Yürürlük: Ocak 2025</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          {/* Ana içerik */}
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Veri Sorumlusu</h2>
              <p className="mb-4">
                Bu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması
                Kanunu (KVKK) ve ilgili mevzuat kapsamında hazırlanmıştır.
              </p>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <p className="font-semibold text-text-primary mb-2">Veri Sorumlusu:</p>
                <p>Noesis Social / Burak OHRİLİ</p>
                <p>Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir</p>
                <p>Ege Vergi Dairesi | VKN: 35509755908</p>
                <p>
                  <a href="mailto:iletisim@lalabits.art" className="text-teal hover:underline">
                    iletisim@lalabits.art
                  </a>{' '}
                  | 0532 744 94 34
                </p>
              </div>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Toplanan Kişisel Veriler</h2>

              <h3 className="font-semibold text-text-primary mb-2">2.1 Hesap ve Kimlik Verileri</h3>
              <p className="mb-4">
                Ad, soyad, kullanıcı adı, e-posta adresi, şifre (hash&apos;lenmiş),
                profil fotoğrafı, biyografi.
              </p>

              <h3 className="font-semibold text-text-primary mb-2">2.2 Finansal Veriler</h3>
              <p className="mb-4">
                IBAN (üreticiler — ödeme transferi için), ödeme geçmişi, fatura bilgileri.
                Kart bilgileri lalabits sunucularında saklanmaz; PCI DSS uyumlu altyapı tarafından işlenir.
              </p>

              <h3 className="font-semibold text-text-primary mb-2">2.3 Kullanım Verileri</h3>
              <p className="mb-4">
                IP adresi, tarayıcı türü, ziyaret edilen sayfalar,
                platform işlem geçmişi, çerez verileri.
              </p>

              <h3 className="font-semibold text-text-primary mb-2">2.4 İletişim İçerikleri</h3>
              <p>Destek talepleri ve yazışma kayıtları.</p>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">
                3. Verilerin İşlenme Amaçları ve Hukuki Dayanaklar
              </h2>
              <ul className="space-y-3">
                {[
                  ['Hizmetin sunulması ve hesap yönetimi', 'Sözleşmenin ifası (KVKK md. 5/2-c)'],
                  ['Ödeme ve tahsilat işlemleri', 'Sözleşmenin ifası (KVKK md. 5/2-c)'],
                  ['Yasal yükümlülüklerin yerine getirilmesi', 'Kanuni zorunluluk (KVKK md. 5/2-ç)'],
                  ['Güvenlik ve dolandırıcılık önleme', 'Meşru menfaat (KVKK md. 5/2-f)'],
                  ['Platform iyileştirme ve anonim analitik', 'Meşru menfaat (KVKK md. 5/2-f)'],
                  ['Pazarlama iletişimi', 'Açık rıza (KVKK md. 5/1)'],
                ].map(([amac, dayanak]) => (
                  <li key={amac} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="mt-1 text-teal flex-shrink-0">·</span>
                    <div>
                      <span className="font-medium text-text-primary">{amac}</span>
                      <span className="text-text-muted"> — Hukuki dayanak: {dayanak}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Verilerin Aktarıldığı Taraflar</h2>
              <ul className="space-y-2">
                {[
                  'Ödeme hizmet sağlayıcıları (yalnızca ödeme işlemi kapsamında)',
                  'Yasal zorunluluk halinde kamu kurum ve kuruluşları',
                  'Teknik altyapı sağlayıcıları (hosting, e-posta — işlemci sıfatıyla)',
                ].map((madde) => (
                  <li key={madde} className="flex items-start gap-2">
                    <span className="mt-1 text-teal flex-shrink-0">·</span>
                    {madde}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-text-primary font-medium">
                Verileriniz üçüncü taraflara ticari amaçla satılmaz veya kiralanmaz.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Veri Saklama Süreleri</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Hesap verileri', 'Hesap aktif süresi + 3 yıl'],
                  ['Finansal kayıtlar', '10 yıl (213 sayılı VUK gereği)'],
                  ['İletişim kayıtları', '2 yıl'],
                  ['Çerez verileri', 'Çerez türüne göre (bkz. Çerez Politikası)'],
                ].map(([tur, sure], i) => (
                  <div
                    key={tur}
                    className={`flex items-center gap-4 px-5 py-3 ${i !== 3 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-40 flex-shrink-0 font-medium text-text-primary">{tur}</span>
                    <span className="text-text-secondary">{sure}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Veri Sahibi Hakları (KVKK Madde 11)</h2>
              <p className="mb-4">Kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:</p>
              <ul className="space-y-2">
                {[
                  'Verilerinizin işlenip işlenmediğini öğrenme',
                  'İşlenmişse buna ilişkin bilgi talep etme',
                  'İşlenme amacını ve amaca uygunluğunu öğrenme',
                  'Yurt içi/dışı aktarımları öğrenme',
                  'Eksik/yanlış verilerin düzeltilmesini isteme',
                  'Silinmesini veya yok edilmesini isteme',
                  'Otomatik işleme itiraz etme',
                  'Kanuna aykırı işleme nedeniyle zararın tazminini talep etme',
                ].map((hak, i) => (
                  <li key={hak} className="flex items-start gap-2">
                    <span className="text-teal font-semibold flex-shrink-0">{String.fromCharCode(96 + i + 1)})</span>
                    {hak}
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Başvuru:{' '}
                <a href="mailto:iletisim@lalabits.art" className="text-teal hover:underline">
                  iletisim@lalabits.art
                </a>{' '}
                — Yanıt süresi: 30 gün içinde
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Veri Güvenliği</h2>
              <p>
                SSL/TLS şifreleme, rol tabanlı erişim kontrolü,
                şifreli veri depolama ve düzenli güvenlik denetimleri uygulanmaktadır.
              </p>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. Politika Değişiklikleri</h2>
              <p>
                Bu politika güncellenebilir. Önemli değişikliklerde
                kayıtlı e-posta adresinize önceden bildirim gönderilir.
              </p>
            </section>
          </article>

          {/* Sticky TOC — sağ panel */}
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
