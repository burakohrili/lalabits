import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi | lalabits.art',
  description:
    'lalabits.art mesafeli satış sözleşmesi. 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.',
};

const bolumler = [
  'Taraflar',
  'Konu ve Kapsam',
  'Ürün / Hizmet Bilgileri',
  'Ödeme Koşulları',
  'Teslimat ve Erişim',
  'Cayma Hakkı',
  'Cayma Hakkının Kullanılamayacağı Hâller',
  'Ödeme İtirazı ve İade Süreci',
  'Abonelik İptali',
  'Üretici İçeriği Kaldırırsa',
  'Uyuşmazlık ve Yetkili Makamlar',
  'Yürürlük',
];

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Mesafeli Satış Sözleşmesi</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>6502 s. Kanun &amp; Mesafeli Sözleşmeler Yönetmeliği kapsamında</span>
            <span>Yürürlük: Ocak 2025</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          {/* Ana içerik */}
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <div className="rounded-[16px] bg-amber-50 border border-amber-200 px-6 py-4">
              <p className="text-sm text-amber-800">
                Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
                Mesafeli Sözleşmeler Yönetmeliği (RG: 27.11.2014 / 29188) uyarınca
                düzenlenmektedir. Satın alma işlemi gerçekleştirmeden önce lütfen dikkatle okuyunuz.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Taraflar</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                <div className="flex items-start gap-4 px-5 py-4 border-b border-border">
                  <span className="w-24 flex-shrink-0 font-semibold text-text-primary">SATICI</span>
                  <div>
                    <p className="font-medium text-text-primary">Noesis Social / Burak OHRİLİ</p>
                    <p>Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir</p>
                    <p>Ege Vergi Dairesi | VKN: 35509755908</p>
                    <p>E-posta: destek@lalabits.art</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 px-5 py-4">
                  <span className="w-24 flex-shrink-0 font-semibold text-text-primary">ALICI</span>
                  <div>
                    <p>Ödeme sırasında sisteme kayıtlı ad, e-posta ve fatura bilgileri
                    doğrultusunda belirlenen kullanıcı (&quot;Alıcı&quot; veya &quot;Fan&quot;).</p>
                  </div>
                </div>
              </div>
              <p className="mt-4">
                <strong>Platform Notu:</strong> lalabits.art, içerik üreticileri (&quot;Üretici&quot;)
                ile Alıcılar arasında aracı teknoloji hizmeti sağlayan bir platformdur. Platform,
                Üreticinin temsilcisi, çalışanı veya ortağı değildir; ancak ödeme altyapısını
                işleterek bu Sözleşme kapsamındaki yükümlülükleri Satıcı sıfatıyla üstlenir.
              </p>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Konu ve Kapsam</h2>
              <p className="mb-4">
                Bu Sözleşme, lalabits.art üzerinden gerçekleştirilen aşağıdaki dijital içerik
                ve hizmet satışlarını kapsar:
              </p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Üyelik Planı', 'Üreticinin içeriklerine aylık veya yıllık tekrarlı abonelikle erişim'],
                  ['Dijital Ürün', 'PDF, ZIP, ses, video, tasarım dosyaları gibi tek seferlik satışlık materyaller'],
                  ['Koleksiyon', 'İçerik ve ürün paketlerinin bir arada sunulduğu tek ödemelik paket'],
                  ['Premium İçerik', 'Üreticinin belirli bir gönderi veya içeriği için talep ettiği tekil erişim ücreti'],
                ].map(([tur, aciklama], i) => (
                  <div
                    key={tur}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== 3 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-36 flex-shrink-0 font-semibold text-text-primary">{tur}</span>
                    <span>{aciklama}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Ürün / Hizmet Bilgileri</h2>
              <p className="mb-4">
                Satın alınacak ürün veya hizmetin adı, kapsamı, erişim koşulları ve fiyatı
                satın alma ekranında (ödeme öncesi) açıkça gösterilir. Alıcı, ödeme onayı
                vermeden önce bu bilgileri incelemekle yükümlüdür.
              </p>
              <p className="mb-4">
                Üyelik planları için plandaki avantajlar (perks), erişilebilir içerik kategorileri
                ve aylık / yıllık fiyat satın alma ekranında yer alır.
              </p>
              <p>
                Dijital ürün ve koleksiyonlar için dosya türü, tahmini boyut ve içerik özeti
                ürün sayfasında sunulur.
              </p>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Ödeme Koşulları</h2>
              <p className="mb-4">
                Tüm fiyatlar Türk Lirası (TRY) cinsindendir ve KDV dahildir.
                Ödeme, aşağıdaki yöntemlerle kabul edilir:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Kredi kartı (Visa, Mastercard)</li>
                <li>Banka kartı (yurt içi)</li>
                <li>Platform&apos;un zaman zaman ekleyebileceği diğer ödeme yöntemleri</li>
              </ul>
              <p className="mb-4">
                Tekrarlı ödemeler (üyelik planları), her yenileme döneminde Alıcı&apos;nın
                kayıtlı kartından otomatik olarak tahsil edilir. Alıcı, tahsilattan en az
                24 saat önce aboneliği iptal edebilir.
              </p>
              <p>
                Ödeme başarısız olursa erişim açılmaz veya askıya alınır. Alıcı bildirim
                alır ve ödeme yöntemi güncellenebilir.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Teslimat ve Erişim</h2>
              <p className="mb-4">
                lalabits.art&apos;ta satılan tüm ürün ve hizmetler dijital niteliktedir;
                fiziksel teslimat yapılmaz.
              </p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Üyelik Planı', 'Ödeme onayının ardından anında aktif olur. Kilitli içeriklere erişim hemen başlar.'],
                  ['Dijital Ürün / Koleksiyon', 'Ödeme onayının ardından /kutuphane (Kütüphane) sayfasına düşer, anında indirilebilir.'],
                  ['Premium İçerik', 'Ödeme sonrası içerik anında kilidini açar; Kütüphane\'de de görünür.'],
                ].map(([tur, aciklama], i) => (
                  <div
                    key={tur}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== 2 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-48 flex-shrink-0 font-semibold text-text-primary">{tur}</span>
                    <span>{aciklama}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                Teknik bir sorun nedeniyle erişim sağlanamazsa destek@lalabits.art adresine
                başvurun; sorun 2 iş günü içinde çözülür veya iade yapılır.
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Cayma Hakkı</h2>
              <p className="mb-4">
                6502 sayılı Kanun&apos;un 48. maddesi ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin
                15. maddesi uyarınca, dijital içeriklerde cayma hakkı aşağıdaki koşullara bağlıdır:
              </p>
              <p className="mb-4">
                Alıcı, ödeme tamamlandıktan sonra içeriğe erişim başlamadan önce 14 gün
                içinde cayma hakkını kullanabilir. Ancak Alıcı, satın alma sırasında
                &quot;içeriğe erişimimin başlamasıyla cayma hakkımdan vazgeçtiğimi anlıyorum&quot;
                onayını vermiş ise <strong>erişim başladığı anda cayma hakkı sona erer</strong>.
              </p>
              <p>
                lalabits.art&apos;ta dijital içeriklere erişim ödeme anında başladığından,
                Alıcı&apos;nın onay vermesiyle cayma hakkı kullanılamaz hâle gelir. Bu durum
                satın alma ekranında açıkça bildirilir.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Cayma Hakkının Kullanılamayacağı Hâller</h2>
              <p className="mb-3">Aşağıdaki durumlarda cayma hakkı kullanılamaz:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Dijital içeriğe erişim başlamış ise (Alıcı onayı ile)</li>
                <li>İndirilen dosya Alıcı tarafından açılmış ise</li>
                <li>Abonelik dönemi başlamış ise ve içerikten yararlanılmış ise</li>
                <li>Kişiye özel veya kişiselleştirilen dijital hizmetler</li>
              </ul>
              <p className="mt-4">
                Yukarıdaki istisnalar kapsamında olmayan durumlarda (örn. içeriğe hiç erişilmemiş,
                teknik sorun) iade talep edilebilir. Bkz. Bölüm 8.
              </p>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. Ödeme İtirazı ve İade Süreci</h2>
              <p className="mb-4">
                Cayma hakkı kapsamı dışında kalmakla birlikte, aşağıdaki hâllerde iade
                talep edilebilir:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>İçeriğe teknik nedenle hiç erişilememesi</li>
                <li>Satın alınan ürünün açıklananla önemli ölçüde farklı olması</li>
                <li>Çift ödeme veya sistem hatası</li>
              </ul>
              <p className="mb-3 font-semibold text-text-primary">İade başvurusu:</p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li><strong>/hesabim/faturalarim</strong> → &quot;Ödeme İtirazı&quot; sekmesi</li>
                <li>İlgili işlemi seçin, neden belirtin</li>
                <li>5 iş günü içinde inceleme yapılır ve bildirim gönderilir</li>
                <li>Onaylanan iade 3–5 iş günü içinde aynı karta yansır</li>
              </ol>
              <p>
                İade başvurusu, satın alma tarihinden itibaren <strong>7 gün</strong> içinde
                yapılmalıdır. Bu süre geçtikten sonra yapılan başvurular değerlendirilemez.
              </p>
            </section>

            <section id="bolum-9">
              <h2 className="text-base font-bold text-text-primary mb-4">9. Abonelik İptali</h2>
              <p className="mb-4">
                Alıcı, aktif üyelik aboneliğini dilediği zaman iptal edebilir.
              </p>
              <p className="mb-3 font-semibold text-text-primary">İptal adımları:</p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li><strong>/hesabim/faturalarim</strong> → &quot;Aktif Üyelikler&quot;</li>
                <li>İlgili planın yanındaki &quot;İptal Et&quot; seçeneğini tıklayın</li>
                <li>Onay ekranında iptal edin</li>
              </ol>
              <p className="mb-4">
                İptal, <strong>mevcut dönem sonunda</strong> geçerli olur. İptal anında
                ücret iadesi yapılmaz; Alıcı dönem sonuna kadar içeriklere erişmeye devam eder.
              </p>
              <p>
                Dönem bittikten sonra kilitli içerikler kapanır. Satın alınan dijital
                ürünler abonelik durumundan bağımsız olarak Kütüphane&apos;de kalır.
              </p>
            </section>

            <section id="bolum-10">
              <h2 className="text-base font-bold text-text-primary mb-4">10. Üretici İçeriği Kaldırırsa</h2>
              <p className="mb-4">
                lalabits.art aracı platform olduğundan, içerik varlığını garanti edemez.
                Üretici bir içeriği kaldırırsa:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>İçeriği önceden satın almış Alıcılar için Platform iade politikasını uygular</li>
                <li>İçerik kaldırma tarihinden itibaren 30 gün içinde iade başvurusu yapılabilir</li>
                <li>İade değerlendirmesi Bölüm 8&apos;deki süreç çerçevesinde yürütülür</li>
              </ul>
              <p>
                Platform, Üretici hesabı kapandığında aktif abonelikleri iptal eder
                ve orantılı iade başlatır.
              </p>
            </section>

            <section id="bolum-11">
              <h2 className="text-base font-bold text-text-primary mb-4">11. Uyuşmazlık ve Yetkili Makamlar</h2>
              <p className="mb-4">
                Bu Sözleşme&apos;den doğan uyuşmazlıklarda öncelikle platform üzerinden veya
                destek@lalabits.art adresi üzerinden çözüm aranır.
              </p>
              <p className="mb-4">
                Tüketici olarak aşağıdaki yollara başvurma hakkınız saklıdır:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Tüketici Hakem Heyeti:</strong> 6502 s. Kanun kapsamındaki parasal sınırlar dahilinde</li>
                <li><strong>Tüketici Mahkemesi:</strong> Sınırı aşan uyuşmazlıklarda</li>
                <li><strong>Yetki:</strong> Alıcı&apos;nın yerleşim yeri veya satıcının bulunduğu yer (İzmir)</li>
              </ul>
            </section>

            <section id="bolum-12">
              <h2 className="text-base font-bold text-text-primary mb-4">12. Yürürlük</h2>
              <p className="mb-4">
                Bu Sözleşme, Alıcı&apos;nın satın alma onayı verdiği anda elektronik olarak
                akdedilmiş sayılır ve her iki taraf için bağlayıcı olur.
              </p>
              <p>
                Sözleşmenin bir kopyasına{' '}
                <a href="/mesafeli-satis-sozlesmesi" className="text-primary hover:underline">
                  mesafeli-satis-sozlesmesi
                </a>{' '}
                adresinden ve kayıtlı e-posta adresinize gönderilen onay e-postasından ulaşabilirsiniz.
              </p>
            </section>

          </article>

          {/* İçindekiler — masaüstü */}
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
