import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dijital Teslimat Politikası | lalabits.art',
  description:
    'lalabits.art dijital içerik teslimat ve erişim koşulları. Ürün teslimi, indirme hakları ve erişim süresi.',
};

const bolumler = [
  'Teslimat Yöntemi',
  'Teslimat Zamanlaması',
  'Erişim Süresi',
  'Desteklenen Dosya Formatları',
  'İndirme Koşulları',
  'Teknik Sorunlar',
  'Platform Değişiklikleri',
  'İletişim',
];

export default function DijitalTeslimatPolitikasiPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Dijital Teslimat Politikası</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Son güncelleme: Ocak 2025</span>
            <span>Yürürlük: Ocak 2025</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-4">
              <p className="text-sm text-text-primary">
                lalabits.art üzerinden satın alınan tüm ürünler dijital niteliktedir. Bu politika,
                dijital içeriklerin nasıl ve ne zaman teslim edileceğini, erişim koşullarını
                ve teknik gereksinimleri açıklamaktadır.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Teslimat Yöntemi</h2>
              <p className="mb-4">
                Tüm dijital içerikler platform üzerinden elektronik olarak teslim edilir; fiziksel
                teslimat yapılmaz. Satın alma kategorisine göre teslimat şekli aşağıdaki gibidir:
              </p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Dijital Ürün (tek seferlik)', 'Kütüphane (/kutuphane) bölümünden indirilabilir'],
                  ['Abonelik', 'Üreticinin profil sayfası ve abonelere özel akış üzerinden erişilir'],
                  ['Koleksiyon', 'Kütüphane bölümüne otomatik eklenir'],
                  ['Premium Gönderi', 'İlgili gönderi sayfasında doğrudan erişilir'],
                ].map(([tur, aciklama], i, arr) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-52 flex-shrink-0 font-semibold text-text-primary">{tur}</span>
                    <span>{aciklama}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Teslimat Zamanlaması</h2>
              <p className="mb-4">
                Ödemenizin onaylanmasının ardından içerik <strong>anında</strong> hesabınıza tanımlanır.
                Herhangi bir gecikme beklentisi yoktur. Aşağıdaki durumlarda 15 dakikaya kadar
                gecikme oluşabilir:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Ödeme işleminin banka tarafından onaylanmasının uzaması</li>
                <li>3D Secure doğrulama sürecinin tamamlanması</li>
                <li>Yoğun işlem dönemlerinde sistem gecikmesi</li>
              </ul>
              <p>
                15 dakika sonrasında hâlâ erişim sağlayamıyorsanız lütfen{' '}
                <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                  destek@lalabits.art
                </a>
                {' '}adresiyle iletişime geçin.
              </p>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Erişim Süresi</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Dijital Ürün', 'Süresiz — hesabınız aktif olduğu sürece Kütüphane\'de kalır'],
                  ['Aylık Abonelik', 'Ödeme dönemi boyunca aktif; iptal sonrası dönem sonuna kadar'],
                  ['Yıllık Abonelik', 'Ödeme dönemi boyunca aktif; iptal sonrası dönem sonuna kadar'],
                  ['Koleksiyon', 'Süresiz — tek seferlik alımdaysa kalıcı; abonelik gerektiriyorsa abonelik süresi boyunca'],
                  ['Hesap kapatma', 'Erişim sona erer; dijital ürünlerin yedeğini önceden almanız önerilir'],
                ].map(([tur, aciklama], i, arr) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-44 flex-shrink-0 font-semibold text-text-primary">{tur}</span>
                    <span>{aciklama}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Desteklenen Dosya Formatları</h2>
              <p className="mb-4">Platform üzerinden teslim edilen yaygın dosya formatları:</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ['Doküman', 'PDF, DOCX, TXT, EPUB'],
                  ['Görsel', 'JPG, PNG, SVG, PSD, AI'],
                  ['Tasarım', 'Figma, Sketch, XD, AI'],
                  ['Ses', 'MP3, WAV, FLAC, AAC'],
                  ['Video', 'MP4, MOV (stream)'],
                  ['Sıkıştırılmış', 'ZIP, RAR, 7z'],
                ].map(([kategori, formatlar]) => (
                  <div key={kategori} className="rounded-[12px] border border-border p-4">
                    <p className="font-semibold text-text-primary text-xs mb-1">{kategori}</p>
                    <p className="text-xs text-text-muted">{formatlar}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                Üreticiler farklı format yükleyebilir; satın alma öncesinde ürün sayfasında
                belirtilen dosya formatını kontrol ediniz.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. İndirme Koşulları</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Dijital ürünler <strong>günde en fazla 5 kez</strong> indirilebilir (kötüye kullanımı önlemek amacıyla)</li>
                <li>İndirmeler yalnızca aktif hesap sahibi tarafından gerçekleştirilebilir</li>
                <li>İndirilen dosyalar üçüncü kişilerle paylaşılamaz; telif hakları üreticiye aittir</li>
                <li>Üretici &quot;indirilemez&quot; olarak işaretlediği içerikler platform üzerinden akışla sunulur</li>
              </ul>
              <p>
                İndirme limitine ulaştıysanız 24 saat sonra tekrar deneyebilir veya destek
                ekibimizle iletişime geçebilirsiniz.
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Teknik Sorunlar</h2>
              <p className="mb-4">
                Teslimat veya erişimle ilgili bir sorun yaşıyorsanız aşağıdaki adımları izleyin:
              </p>
              <ol className="list-decimal list-inside space-y-3 mb-4">
                <li>Tarayıcı önbelleğini temizleyip sayfayı yenileyin</li>
                <li>Farklı bir tarayıcı veya cihazda deneyin</li>
                <li><strong>/kutuphane</strong> adresinden Kütüphane&apos;nizi kontrol edin</li>
                <li>
                  Sorun devam ediyorsa{' '}
                  <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                    destek@lalabits.art
                  </a>
                  {' '}adresine ödeme referans numaranızla yazın
                </li>
              </ol>
              <p>
                Teknik arıza kaynaklı erişim sorunları için{' '}
                <a href="/iade-politikasi" className="text-primary hover:underline">İade Politikamız</a>
                {' '}kapsamında çözüm sağlanır.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Platform Değişiklikleri</h2>
              <p className="mb-4">
                lalabits.art, platforma veya üretici hesabına ilişkin değişikliklerde aşağıdaki
                ilkeleri benimser:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Üretici hesabının kapatılması durumunda aktif abonelikler iptal edilir ve kalan dönem için iade yapılır</li>
                <li>Platform altyapısındaki değişiklikler erişimi olumsuz etkilemeyecek şekilde planlanır</li>
                <li>Olağanüstü durumlarda (platform kapanması, zorunlu değişiklik) kullanıcılar en az <strong>30 gün önceden</strong> e-posta ile bilgilendirilir</li>
              </ul>
              <p>
                Satın alınan dijital ürünlerin yedeğini düzenli olarak almanızı öneririz.
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
                <p className="mt-1">Konu satırına: &quot;Teslimat Sorunu — [sipariş referansı]&quot; yazınız</p>
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
