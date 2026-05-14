import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Üyelik İptal Politikası | lalabits.art',
  description:
    'lalabits.art üyelik iptali, cayma hakkı ve dijital içerik istisnası. 6502 sayılı TKHK kapsamında bilgilendirme.',
};

const bolumler = [
  'Genel Bilgi',
  'İptal Nasıl Yapılır?',
  'İptal Sonrası Erişim',
  'Cayma Hakkı',
  'Dijital İçerik İstisnası',
  'Otomatik Yenileme',
  'Üretici Hesabı Kapanırsa',
  'İletişim',
];

export default function UyelikIptalPolitikasiPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Üyelik İptal Politikası</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Son güncelleme: Ocak 2025</span>
            <span>6502 sayılı TKHK kapsamında</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-4">
              <p className="text-sm text-text-primary">
                lalabits.art&apos;ta herhangi bir üyelik aboneliğini dilediğiniz zaman iptal
                edebilirsiniz. İptal, mevcut faturalama döneminin sonunda geçerli olur.
                Bu sayfa iptal sürecini ve yasal haklarınızı açıklamaktadır.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Genel Bilgi</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Üyelik abonelikleri herhangi bir ücret veya ceza uygulanmaksızın istediğiniz zaman iptal edilebilir</li>
                <li>İptal işlemi anında gerçekleşir; erişim mevcut dönem sonuna kadar devam eder</li>
                <li>İptal için ayrıca bir gerekçe belirtmeniz gerekmez</li>
                <li>Yıllık aboneliğinizi yıl ortasında iptal etseniz dahi kalan aylara ait ücret iade edilmez (bkz. Bölüm 4)</li>
              </ul>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. İptal Nasıl Yapılır?</h2>
              <p className="mb-4">
                Aboneliğinizi üç farklı yoldan iptal edebilirsiniz:
              </p>
              <p className="mb-2 font-semibold text-text-primary">Yöntem 1 — Panel üzerinden:</p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li><strong>/hesabim/uyelikler</strong> adresine gidin</li>
                <li>İptal etmek istediğiniz aboneliği bulun</li>
                <li>&quot;İptal Et&quot; butonuna tıklayın</li>
                <li>Onay ekranında işlemi onaylayın</li>
              </ol>
              <p className="mb-2 font-semibold text-text-primary">Yöntem 2 — E-posta bağlantısından:</p>
              <p className="mb-4">
                Yenileme hatırlatma e-postalarında yer alan &quot;İptal Et&quot; bağlantısını
                kullanabilirsiniz. Bu bağlantı oturum açmanızı gerektirmeden çalışır.
              </p>
              <p className="mb-2 font-semibold text-text-primary">Yöntem 3 — Destek üzerinden:</p>
              <p>
                <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                  destek@lalabits.art
                </a>
                {' '}adresine kayıtlı e-posta adresinizden yazarak iptal talep edebilirsiniz.
                Talebiniz 1 iş günü içinde işleme alınır.
              </p>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. İptal Sonrası Erişim</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['İptal anında', 'Abonelik "iptal edildi — dönem sonunda sona erer" olarak işaretlenir'],
                  ['Dönem sonuna kadar', 'Tüm üyelik içeriklerine erişim devam eder'],
                  ['Dönem bittikten sonra', 'Üyeliğe özel gönderiler ve koleksiyonlara erişim kapanır'],
                  ['Satın alınan dijital ürünler', 'Abonelikten bağımsız olarak Kütüphane\'de kalır'],
                  ['Ücretsiz içerikler', 'İptal sonrasında da erişilebilir olmaya devam eder'],
                ].map(([durum, aciklama], i, arr) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-52 flex-shrink-0 font-semibold text-text-primary">{durum}</span>
                    <span>{aciklama}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Cayma Hakkı</h2>
              <p className="mb-4">
                6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca mesafeli
                sözleşmelerde tüketicilere <strong>14 günlük cayma hakkı</strong> tanınmaktadır.
              </p>
              <p className="mb-4">
                Aboneliğinizi ilk başlattığınız tarihten itibaren 14 gün içinde cayma hakkını
                kullanmak istiyorsanız{' '}
                <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                  destek@lalabits.art
                </a>
                {' '}adresine yazabilirsiniz.
              </p>
              <p>
                Ancak <strong>dijital içeriğe erişim sağlanmışsa</strong> (abonelik kapsamındaki
                içerikleri görüntülemiş veya indirmişseniz) aşağıdaki bölümdeki istisna geçerli
                olabilir.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Dijital İçerik İstisnası</h2>
              <div className="rounded-[16px] bg-orange/5 border border-orange/20 px-6 py-4 mb-4">
                <p className="text-sm text-text-primary font-semibold mb-2">6502 sayılı Kanun Madde 49/3</p>
                <p className="text-sm text-text-primary">
                  Tüketici, dijital içeriğin ifasına açıkça onay vermiş ve cayma hakkını
                  kaybedeceğini peşinen kabul etmişse cayma hakkı kullanılamaz.
                </p>
              </div>
              <p className="mb-4">
                lalabits.art&apos;ta abonelik aktivasyonu sırasında:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Dijital içeriğe erişimin abonelik aktivasyonuyla başladığı bildirilir</li>
                <li>Bu husus onay ekranında açıkça gösterilir</li>
                <li>Onay vermeksizin abonelik tamamlanamaz</li>
              </ul>
              <p>
                Dolayısıyla içeriklere erişim sağlandıktan sonra cayma hakkı kural olarak kullanılamaz.
                Teknik hata gibi istisnai durumlarda değerlendirme yapılır; bkz.{' '}
                <a href="/iade-politikasi" className="text-primary hover:underline">İade Politikası</a>.
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Otomatik Yenileme</h2>
              <p className="mb-4">
                Abonelikler, aksi belirtilmedikçe dönem sonunda otomatik olarak yenilenir:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Aylık abonelikler her ay aynı tarihte yenilenir</li>
                <li>Yıllık abonelikler her yıl aynı tarihte yenilenir</li>
                <li>Yenileme öncesinde <strong>3 gün önce</strong> e-posta ile hatırlatma gönderilir</li>
                <li>Hatırlatma e-postasındaki bağlantıdan tek tıkla iptal yapılabilir</li>
              </ul>
              <p>
                Yenileme ödemesi başarısız olursa abonelik <strong>3 günlük</strong> ödemesiz
                kullanım süresi (grace period) tanınır; bu sürede ödeme yapılmazsa abonelik sona erer.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Üretici Hesabı Kapanırsa</h2>
              <p className="mb-4">
                Abone olduğunuz üreticinin hesabı kapatılırsa:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Aboneliğiniz otomatik olarak iptal edilir</li>
                <li>Kalan dönem için orantılı iade hesaplanır ve başlatılır</li>
                <li>E-posta yoluyla bilgilendirilirsiniz</li>
              </ul>
              <p>
                Ayrıntılar için{' '}
                <a href="/iade-politikasi" className="text-primary hover:underline">İade Politikası</a>
                {' '}Bölüm 8&apos;i inceleyiniz.
              </p>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. İletişim</h2>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <p className="font-semibold text-text-primary mb-1">lalabits.art Destek</p>
                <p>
                  E-posta:{' '}
                  <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                    destek@lalabits.art
                  </a>
                </p>
                <p className="mt-1">
                  Tüketici Hakları:{' '}
                  <a href="https://tuketicisikayeti.gov.tr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    tuketicisikayeti.gov.tr
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
