import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İade ve İptal Politikası | lalabits.art',
  description:
    'lalabits.art iade ve iptal politikası. Dijital ürün iadesi, abonelik iptali ve ödeme itirazı koşulları.',
};

const bolumler = [
  'Genel İlkeler',
  'Dijital Ürün ve Koleksiyon İadesi',
  'Abonelik İptali ve İade',
  'Premium İçerik İadesi',
  'İade Başvurusu Nasıl Yapılır?',
  'İade Onayı ve Süreç',
  'İade Yapılamayan Durumlar',
  'Üretici Hesabı Kapatılırsa',
  'İletişim',
];

export default function IadePolitikasiPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">İade ve İptal Politikası</h1>
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

            <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-4">
              <p className="text-sm text-text-primary">
                lalabits.art&apos;ta satılan ürünler dijital niteliktedir. Dijital içeriklere erişim
                ödeme anında başladığından, Türkiye&apos;deki tüketici mevzuatı kapsamında cayma
                hakkı —Alıcı onayıyla— kullanılamaz hâle gelir. Ancak belirli hâllerde iade
                yapılmaktadır. Bu sayfa tüm koşulları açıklamaktadır.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Genel İlkeler</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>İade talepleri satın alma tarihinden itibaren <strong>7 gün</strong> içinde yapılmalıdır.</li>
                <li>İade başvuruları <strong>5 iş günü</strong> içinde incelenir ve yanıtlanır.</li>
                <li>Onaylanan iadeler <strong>3–5 iş günü</strong> içinde aynı karta yansır.</li>
                <li>İade onaylanırsa ilgili içeriğe erişim kaldırılır.</li>
                <li>Her kullanıcı aynı ürün için yalnızca bir kez iade talebinde bulunabilir.</li>
              </ul>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Dijital Ürün ve Koleksiyon İadesi</h2>
              <p className="mb-4">
                Mağazadan tek seferlik ödemeyle satın alınan dijital ürün veya koleksiyonlarda
                iade aşağıdaki hâllerde yapılır:
              </p>
              <div className="rounded-[16px] border border-border overflow-hidden mb-4">
                <div className="flex items-center gap-4 px-5 py-3 border-b border-border bg-surface">
                  <span className="w-56 flex-shrink-0 font-semibold text-text-primary">Durum</span>
                  <span className="font-semibold text-text-primary">İade Kararı</span>
                </div>
                {[
                  ['Teknik hata nedeniyle içeriğe erişilemiyor', '✅ İade yapılır'],
                  ['Dosya indirme bağlantısı çalışmıyor', '✅ İade yapılır veya sorun giderilir'],
                  ['İçerik açıklananla önemli ölçüde farklı', '✅ İade yapılır'],
                  ['Çift ödeme / sistem hatası', '✅ Otomatik iade başlatılır'],
                  ['İçerik beğenilmedi / beklentileri karşılamadı', '❌ İade yapılmaz'],
                  ['Dosya indirildi ve açıldı', '❌ İade yapılmaz'],
                  ['7 günden sonra başvuru yapıldı', '❌ İade yapılmaz'],
                ].map(([durum, karar], i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== 6 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-56 flex-shrink-0 text-text-primary">{durum}</span>
                    <span>{karar}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Abonelik İptali ve İade</h2>
              <p className="mb-4">
                Üyelik planı abonelikleri için iade ve iptal koşulları:
              </p>

              <p className="mb-2 font-semibold text-text-primary">İptal (Geleceğe Dönük):</p>
              <p className="mb-4">
                Abonelik dilediğiniz zaman iptal edilebilir. İptal, <strong>mevcut dönem
                sonunda</strong> geçerlidir. Dönem boyunca içeriklere erişim devam eder;
                iptal anında herhangi bir ücret iadesi yapılmaz.
              </p>

              <p className="mb-2 font-semibold text-text-primary">Ödeme Sonrası Anlık İptal:</p>
              <p className="mb-4">
                Yenileme ödemesi yanlışlıkla gerçekleştiyse ve içeriğe hiç erişilmediyse,
                ödeme tarihinden itibaren <strong>48 saat</strong> içinde başvuru yapılarak
                o dönem için iade talep edilebilir.
              </p>

              <p className="mb-2 font-semibold text-text-primary">İptal Sonrası Erişim:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Dönem sonuna kadar: Tüm kilitli içerikler açık kalmaya devam eder</li>
                <li>Dönem bittikten sonra: Üyeliğe özel içerikler kapanır</li>
                <li>Satın alınan dijital ürünler: Abonelikten bağımsız, Kütüphane&apos;de kalır</li>
              </ul>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Premium İçerik İadesi</h2>
              <p className="mb-4">
                Üretici&apos;nin belirli bir gönderi veya içerik için talep ettiği tekil
                erişim ücretinde iade, Bölüm 2&apos;deki dijital ürün kurallarıyla
                aynı esaslar çerçevesinde değerlendirilir.
              </p>
              <p>
                İçeriğe erişim sağlandıktan sonra (görüntüleme veya indirme) iade
                yapılmaz; yalnızca teknik sorun veya içerik açıklamasında yanıltıcılık
                tespit edilmesi hâlinde istisnai değerlendirme yapılabilir.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. İade Başvurusu Nasıl Yapılır?</h2>
              <p className="mb-3">Adım adım iade başvurusu:</p>
              <ol className="list-decimal list-inside space-y-3 mb-4">
                <li>
                  <strong>/hesabim/faturalarim</strong> adresine gidin
                </li>
                <li>
                  &quot;Ödeme İtirazı&quot; sekmesini açın
                </li>
                <li>
                  İade talep ettiğiniz işlemi listeden seçin
                </li>
                <li>
                  İade nedeninizi açık biçimde yazın
                </li>
                <li>
                  Varsa ekran görüntüsü veya hata mesajı ekleyin
                </li>
                <li>
                  Formu gönderin
                </li>
              </ol>
              <p>
                Alternatif olarak{' '}
                <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                  destek@lalabits.art
                </a>{' '}
                adresine e-posta gönderebilirsiniz. E-postanızda kayıtlı e-posta adresinizi,
                işlem tarihini ve iade nedeninizi belirtmeniz süreci hızlandırır.
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. İade Onayı ve Süreç</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Başvuru alındı', 'Anında — sistem bildirimi ve e-posta gönderilir'],
                  ['İnceleme', '5 iş günü içinde tamamlanır'],
                  ['Karar bildirimi', 'E-posta ile bildirilir'],
                  ['İade yansıması', 'Onay sonrası 3–5 iş günü (banka işlem süresi)'],
                  ['Reddedilen başvuru', 'Gerekçe e-postayla bildirilir; itiraz hakkı saklıdır'],
                ].map(([adim, detay], i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== 4 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-44 flex-shrink-0 font-semibold text-text-primary">{adim}</span>
                    <span>{detay}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. İade Yapılamayan Durumlar</h2>
              <p className="mb-3">Aşağıdaki hâllerde iade talebi değerlendirilemez:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Satın alma tarihinden 7 gün geçmiş olması</li>
                <li>Dosyanın indirilmiş ve açılmış olması</li>
                <li>İçeriğin kısmen tüketilmiş olması (video izleme, içerik okuma)</li>
                <li>Aynı ürün için daha önce iade yapılmış olması</li>
                <li>İçeriğin beğenilmemesi veya kişisel tercihlere uymadığı gerekçesiyle başvuru</li>
                <li>Teknik destek yardımıyla çözülmüş sorunlar için geriye dönük talep</li>
              </ul>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. Üretici Hesabı Kapatılırsa</h2>
              <p className="mb-4">
                Bir Üretici&apos;nin hesabı kapatılır veya Platform tarafından sonlandırılırsa:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Aktif üyelik abonelikleri Platform tarafından iptal edilir</li>
                <li>Kalan dönem için orantılı iade hesaplanır ve otomatik başlatılır</li>
                <li>Satın alınan dijital ürünler için iade talebi 30 gün içinde yapılabilir</li>
              </ul>
              <p>
                Üretici kendi isteğiyle hesabını kapatırsa aynı koşullar geçerlidir.
                Platform, Alıcıları e-posta yoluyla bilgilendirir.
              </p>
            </section>

            <section id="bolum-9">
              <h2 className="text-base font-bold text-text-primary mb-4">9. İletişim</h2>
              <p className="mb-4">
                İade politikasına ilişkin sorular veya başvurular için:
              </p>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
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
              <p className="mt-4">
                Tüketici hakları kapsamındaki başvurular için{' '}
                <a
                  href="https://tuketicisikayeti.gov.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  tuketicisikayeti.gov.tr
                </a>{' '}
                adresinden Tüketici Hakem Heyeti&apos;ne başvurabilirsiniz.
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
