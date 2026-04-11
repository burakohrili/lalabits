import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | lalabits.art',
  description:
    'lalabits.art, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel veri işleme aydınlatma metni.',
};

const bolumler = [
  'Veri Sorumlusunun Kimliği',
  'İşlenen Kişisel Veriler ve Kategorileri',
  'Kişisel Verilerin İşlenme Amaçları',
  'Kişisel Verilerin Aktarıldığı Taraflar ve Amaçlar',
  'Kişisel Verilerin Toplanma Yöntemi ve Hukuki Dayanağı',
  'Veri Sahibinin Hakları (KVKK Madde 11)',
  'Başvuru Yöntemi ve Yanıt Süresi',
];

export default function KvkkPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[28px] font-bold text-text-primary mb-2 leading-[1.3]">
            Kişisel Verilerin Korunması Kanunu (KVKK)
            <br />
            Kapsamında Aydınlatma Metni
          </h1>
          <div className="flex gap-6 text-xs text-text-muted mt-3">
            <span>Düzenleme: 6698 Sayılı KVKK Madde 10</span>
            <span>Son güncelleme: Ocak 2025</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          {/* Ana içerik */}
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Veri Sorumlusunun Kimliği</h2>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ['Unvan', 'Noesis Social'],
                    ['Yetkili', 'Burak OHRİLİ'],
                    ['Adres', 'Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir'],
                    ['VKN', '35509755908 (Ege Vergi Dairesi)'],
                    ['Telefon', '0532 744 94 34'],
                    ['E-posta', 'iletisim@lalabits.art'],
                    ['Web', 'https://lalabits.art'],
                  ].map(([alan, deger]) => (
                    <div key={alan} className="flex items-start gap-2">
                      <span className="font-semibold text-text-primary w-20 flex-shrink-0">{alan}</span>
                      <span>
                        {alan === 'E-posta' ? (
                          <a href="mailto:iletisim@lalabits.art" className="text-teal hover:underline">
                            {deger}
                          </a>
                        ) : (
                          deger
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">
                2. İşlenen Kişisel Veriler ve Kategorileri
              </h2>
              <div className="space-y-4">
                {[
                  {
                    kategori: 'Kimlik Verileri',
                    veriler: 'Ad, soyad, kullanıcı adı, doğum tarihi (yaş doğrulama).',
                  },
                  {
                    kategori: 'İletişim Verileri',
                    veriler: 'E-posta adresi, telefon numarası.',
                  },
                  {
                    kategori: 'Finansal Veriler',
                    veriler:
                      'IBAN numarası (üreticiler — ödeme çıkışı için), ödeme geçmişi, fatura bilgileri. Not: Kart numarası gibi ödeme aracı bilgileri lalabits sistemlerinde işlenmez ve saklanmaz.',
                  },
                  {
                    kategori: 'İşlem Güvenliği Verileri',
                    veriler: 'IP adresi, oturum bilgileri, işlem geçmişi.',
                  },
                  {
                    kategori: 'Pazarlama Verileri',
                    veriler: 'E-posta tercihleri (yalnızca onay verilmişse).',
                  },
                ].map((item) => (
                  <div key={item.kategori} className="rounded-[12px] border border-border p-5">
                    <p className="font-semibold text-text-primary mb-1">{item.kategori}</p>
                    <p>{item.veriler}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">
                3. Kişisel Verilerin İşlenme Amaçları
              </h2>
              <ul className="space-y-2">
                {[
                  'Platform hizmetinin sunulması ve hesap yönetimi',
                  'Ödeme ve tahsilat işlemlerinin gerçekleştirilmesi',
                  'Üretici ve destekçi kimliğinin doğrulanması',
                  'Vergi mevzuatı kapsamında yasal yükümlülüklerin ifası',
                  'Dolandırıcılık ve güvenlik ihlallerinin önlenmesi',
                  'Platform iyileştirme çalışmalarında anonim analitik kullanımı',
                  'Pazarlama iletişimi (yalnızca açık rıza ile)',
                ].map((amac, i) => (
                  <li key={amac} className="flex items-start gap-2">
                    <span className="text-teal font-semibold flex-shrink-0">{String.fromCharCode(96 + i + 1)})</span>
                    {amac}
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">
                4. Kişisel Verilerin Aktarıldığı Taraflar ve Amaçlar
              </h2>
              <div className="space-y-3">
                {[
                  ['Ödeme hizmet sağlayıcıları', 'Ödeme işleminin gerçekleştirilmesi amacıyla sınırlı bilgi aktarımı.'],
                  ['Yasal zorunluluk halinde kamu kurum ve kuruluşları', 'Yargı veya idari makam talebi.'],
                  ['Yurt dışı bulut hizmet sağlayıcıları', 'Platform altyapısı için; KVKK md. 9 kapsamında gerekli önlemler alınmıştır.'],
                ].map(([taraf, amac]) => (
                  <div key={taraf} className="rounded-[12px] border border-border p-5">
                    <p className="font-semibold text-text-primary mb-1">{taraf}</p>
                    <p className="text-text-muted">{amac}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">
                5. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Dayanağı
              </h2>
              <p className="mb-4">
                Veriler; web formu, mobil/web uygulama, e-posta ve çerezler aracılığıyla toplanmaktadır.
              </p>
              <p className="font-semibold text-text-primary mb-2">Hukuki dayanaklar:</p>
              <ul className="space-y-2">
                {[
                  'Sözleşmenin kurulması ve ifası (KVKK md. 5/2-c)',
                  'Veri sorumlusunun hukuki yükümlülüğü (KVKK md. 5/2-ç)',
                  'Meşru menfaat (KVKK md. 5/2-f)',
                  'Açık rıza (KVKK md. 5/1) — yalnızca pazarlama için',
                ].map((dayanak) => (
                  <li key={dayanak} className="flex items-start gap-2">
                    <span className="mt-1 text-teal flex-shrink-0">·</span>
                    {dayanak}
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">
                6. Veri Sahibinin Hakları (KVKK Madde 11)
              </h2>
              <p className="mb-4">
                Aşağıdaki haklarınızı kullanmak için{' '}
                <a href="mailto:iletisim@lalabits.art" className="text-teal hover:underline">
                  iletisim@lalabits.art
                </a>{' '}
                adresine yazabilirsiniz:
              </p>
              <ul className="space-y-2">
                {[
                  'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
                  'İşlenmişse buna ilişkin bilgi talep etme',
                  'İşlenme amacını ve amaca uygunluğunu öğrenme',
                  'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme',
                  'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
                  'KVKK\'nın 7. maddesi çerçevesinde silinmesini isteme',
                  'Düzeltme ve silme işlemlerinin aktarım yapılan üçüncü kişilere bildirilmesini isteme',
                  'İşlenen verilerin münhasıran otomatik sistemler aracılığıyla analiz edilmesi suretiyle aleyhinize sonuç çıkmasına itiraz etme',
                  'Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme',
                ].map((hak, i) => (
                  <li key={hak} className="flex items-start gap-2">
                    <span className="text-teal font-semibold flex-shrink-0">{String.fromCharCode(96 + i + 1)})</span>
                    {hak}
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">
                7. Başvuru Yöntemi ve Yanıt Süresi
              </h2>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-text-primary w-36 flex-shrink-0">Başvuru e-postası</span>
                  <a href="mailto:iletisim@lalabits.art" className="text-teal hover:underline">iletisim@lalabits.art</a>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-text-primary w-36 flex-shrink-0">Konu satırı</span>
                  <span>&quot;KVKK Başvurusu&quot;</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-text-primary w-36 flex-shrink-0">Yanıt süresi</span>
                  <span>30 gün</span>
                </div>
              </div>
              <p className="mt-4">
                Başvurunuzda; adınız, soyadınız, TC kimlik numaranız (isteğe bağlı),
                talep ettiğiniz hak ve iletişim bilgileriniz yer almalıdır.
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
