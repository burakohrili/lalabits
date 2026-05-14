import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ön Bilgilendirme Formu | lalabits.art',
  description:
    'lalabits.art mesafeli satış sözleşmesi kapsamında ön bilgilendirme formu. 6502 sayılı TKHK uyarınca zorunlu bilgiler.',
};

const bolumler = [
  'Satıcı Bilgileri',
  'Konu ve Kapsam',
  'Temel Nitelikler',
  'Satış Fiyatı',
  'Ödeme ve Teslimat',
  'Cayma Hakkı',
  'Kişisel Veri İşleme',
  'Uyuşmazlık Çözümü',
];

export default function OnBilgilendirmePage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Ön Bilgilendirme Formu</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Son güncelleme: Ocak 2025</span>
            <span>6502 sayılı TKHK Madde 49 kapsamında</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-4">
              <p className="text-sm text-text-primary">
                Bu form, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
                Yönetmeliği uyarınca, sözleşme kurulmadan önce tüketiciye sunulması zorunlu ön
                bilgilendirme belgesidir. Satın alma işlemini tamamlamadan önce lütfen dikkatle okuyunuz.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Satıcı Bilgileri</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Ticaret Unvanı', 'lalabits Bilişim Hizmetleri (Taslak — ticari kayıt süreci devam etmektedir)'],
                  ['Platform', 'lalabits.art'],
                  ['İletişim', 'destek@lalabits.art'],
                  ['Müşteri Hizmetleri', 'Pazartesi–Cuma, 09:00–18:00 TSİ'],
                ].map(([etiket, deger], i, arr) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-44 flex-shrink-0 font-semibold text-text-primary">{etiket}</span>
                    <span>{deger}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Konu ve Kapsam</h2>
              <p className="mb-4">
                lalabits.art; dijital içerik üreticilerinin abonelik planları, premium gönderiler,
                koleksiyonlar ve dijital ürünler aracılığıyla destekçilerinden (fan) gelir elde
                ettiği <strong>kontrollü dijital içerik ve üyelik platformudur.</strong>
              </p>
              <p className="mb-4">
                Platform üzerinden gerçekleştirilen satışlar aşağıdaki kategorileri kapsar:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Üyelik Abonelikleri:</strong> Belirli bir içerik üreticisinin planına aylık veya yıllık abonelik</li>
                <li><strong>Dijital Ürünler:</strong> PDF, ZIP, ses dosyası, tasarım dosyası vb. tek seferlik satın alım</li>
                <li><strong>Koleksiyonlar:</strong> Derlenmiş dijital içerik paketleri</li>
                <li><strong>Premium Gönderiler:</strong> Tekil içerik erişimi</li>
              </ul>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Temel Nitelikler</h2>
              <p className="mb-4">
                Satın alınan içeriklerin temel nitelikleri ilgili ürün, koleksiyon veya abonelik
                planı sayfasında açıkça belirtilmektedir. Satın alma öncesinde:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>İçerik açıklamasını ve sunulan erişim kapsamını inceleyiniz</li>
                <li>Üyelik planı perk listesini kontrol ediniz</li>
                <li>Dijital ürün dosya formatını ve boyutunu teyit ediniz</li>
              </ul>
              <p>
                Dijital içerikler elektronik ortamda teslim edilir; fiziksel teslimat söz konusu değildir.
                İçerik, satın alma işleminin tamamlanmasının ardından anında erişilebilir hâle gelir.
              </p>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Satış Fiyatı</h2>
              <p className="mb-4">
                Tüm fiyatlar Türk Lirası (₺) cinsinden ve <strong>KDV dahil</strong> olarak gösterilmektedir.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Üyelik aboneliklerinde fiyat, seçilen plan ve faturalama dönemine (aylık/yıllık) göre belirlenir</li>
                <li>Dijital ürünlerde fiyat, tek seferlik satın alım bedeli olarak gösterilir</li>
                <li>Ödeme onaylanmadan önce toplam tutar sipariş özeti ekranında gösterilir</li>
              </ul>
              <p>
                Fiyatlar önceden haber vermeksizin değiştirilebilir; ancak mevcut abonelikleriniz
                değişikliğin bildirilmesinden itibaren en az 30 gün süreyle mevcut fiyattan
                korunur.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Ödeme ve Teslimat</h2>
              <p className="mb-2 font-semibold text-text-primary">Ödeme:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Ödemeler İyzico ödeme altyapısı üzerinden güvenli biçimde alınır</li>
                <li>Kabul edilen yöntemler: kredi kartı, banka kartı (3D Secure destekli)</li>
                <li>Abonelikler, dönem sonunda otomatik olarak yenilenir; yenilemeyi iptal etmek istiyorsanız dönem bitmeden iptal işlemi yapmanız gerekir</li>
              </ul>
              <p className="mb-2 font-semibold text-text-primary">Teslimat:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Dijital ürünler: Ödeme onayının ardından anında Kütüphane&apos;nize eklenir</li>
                <li>Abonelikler: Ödeme anında aktif hâle gelir, üreticinin içeriklerine erişim başlar</li>
                <li>Teknik sorun durumunda 24 saat içinde destek ekibimizle iletişime geçebilirsiniz</li>
              </ul>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Cayma Hakkı</h2>
              <div className="rounded-[16px] bg-orange/5 border border-orange/20 px-6 py-4 mb-4">
                <p className="text-sm text-text-primary font-semibold mb-2">Dijital İçerik İstisnası</p>
                <p className="text-sm text-text-primary">
                  6502 sayılı Kanun&apos;un 49/3. maddesi uyarınca; tüketicinin onayıyla dijital içeriğe
                  erişim sağlandıktan sonra <strong>cayma hakkı kullanılamaz.</strong> Satın alma
                  onay ekranında bu husus açıkça belirtilmekte olup onay vermeniz hâlinde cayma hakkınızdan
                  feragat etmiş sayılırsınız.
                </p>
              </div>
              <p className="mb-4">
                Aşağıdaki hâllerde iade/cayma değerlendirme kapsamı dışında <strong>istisna</strong> olarak iade yapılabilir:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Teknik arıza nedeniyle içeriğe hiç erişilememesi</li>
                <li>İçeriğin açıklananla önemli ölçüde farklı çıkması</li>
                <li>Çift ödeme veya sistem hatası</li>
              </ul>
              <p className="mt-4">
                Ayrıntılar için{' '}
                <a href="/iade-politikasi" className="text-primary hover:underline">İade ve İptal Politikası</a>
                {' '}sayfamızı inceleyiniz.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Kişisel Veri İşleme</h2>
              <p className="mb-4">
                Satın alma işlemi sırasında toplanan kişisel veriler (ad, e-posta, ödeme bilgileri)
                6698 sayılı KVKK ve{' '}
                <a href="/gizlilik" className="text-primary hover:underline">Gizlilik Politikamız</a>
                {' '}kapsamında işlenmektedir. Ödeme bilgileri lalabits.art sunucularında saklanmaz;
                doğrudan İyzico&apos;nun PCI-DSS uyumlu altyapısında işlenir.
              </p>
              <p>
                KVKK kapsamındaki haklarınız için{' '}
                <a href="/kvkk" className="text-primary hover:underline">KVKK Aydınlatma Metni</a>
                &apos;ni inceleyebilirsiniz.
              </p>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. Uyuşmazlık Çözümü</h2>
              <p className="mb-4">
                Satın alma işlemlerine ilişkin uyuşmazlıklarda öncelikle{' '}
                <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                  destek@lalabits.art
                </a>
                {' '}adresi üzerinden çözüm aranması tavsiye edilir.
              </p>
              <p className="mb-4">
                Tüketici uyuşmazlıklarında yasal başvuru yolları:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <a href="https://tuketicisikayeti.gov.tr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    tuketicisikayeti.gov.tr
                  </a>
                  {' '}— Tüketici Hakem Heyeti başvurusu (e-Devlet)
                </li>
                <li>Bulunduğunuz yerdeki Tüketici Mahkemesi</li>
              </ul>
              <div className="mt-6 rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <p className="font-semibold text-text-primary mb-1">lalabits.art Destek</p>
                <p>
                  E-posta:{' '}
                  <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                    destek@lalabits.art
                  </a>
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  Yanıt süresi: 1–2 iş günü (Pazartesi–Cuma, 09:00–18:00 TSİ)
                </p>
              </div>
            </section>

          </article>

          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">İçindekiler</p>
            <nav className="flex flex-col gap-1">
              {bolumler.map((baslik, i) => (
                <a
                  key={i}
                  href={`#bolum-${i + 1}`}
                  className="text-xs text-text-secondary hover:text-primary transition-colors py-0.5"
                >
                  {i + 1}. {baslik}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
