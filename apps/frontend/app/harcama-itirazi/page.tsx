import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Harcama İtirazı | lalabits.art',
  description:
    'lalabits.art harcama itirazı (chargeback) süreci. Tanımadığınız bir ödeme için ne yapmalısınız.',
};

const bolumler = [
  'Genel Bilgi',
  'Önce Bize Yazın',
  'İtiraz Başvurusu',
  'Banka İtirazı Süreci',
  'Hesap Etkisi',
  'Sahte Chargeback',
  'Sık Sorulan Sorular',
  'İletişim',
];

export default function HarcamaItiraziPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Harcama İtirazı</h1>
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
                Banka ekstrenizde tanımadığınız bir &quot;lalabits&quot; ya da &quot;İyzico&quot;
                harcaması gördüyseniz bu sayfadaki adımları takip edin. Çoğu durumda sorunu
                bankaya gitmeden çözebilirsiniz.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Genel Bilgi</h2>
              <p className="mb-4">
                Harcama itirazı (chargeback), tüketicinin tanımadığı veya onaylamadığı bir
                ödemeye banka aracılığıyla itiraz etmesidir. lalabits.art, meşru itirazlarda
                tam destek sağlar.
              </p>
              <p className="mb-4">
                Ekstrenizde lalabits ile ilişkili bir ödeme görüyorsanız bu ödeme genellikle
                şunlardan kaynaklanıyor olabilir:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Aktif bir üyelik aboneliğinin otomatik yenilemesi</li>
                <li>Bir dijital ürün veya koleksiyon satın alımı</li>
                <li>Aile veya ev arkadaşının hesabınızı kullanarak yaptığı işlem</li>
                <li>Daha önce açılan ve unutulan bir abonelik</li>
              </ul>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Önce Bize Yazın</h2>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-4 mb-4">
                <p className="text-sm text-text-primary font-semibold mb-1">Hızlı çözüm için önce bize yazın</p>
                <p className="text-sm text-text-primary">
                  Bankaya itiraz başlatmadan önce bize yazarsanız çoğu durumda 1–2 iş günü
                  içinde çözüm sağlayabilir veya iade başlatabiliriz. Banka süreci hem
                  sizin için hem de bizim için zaman alıcıdır.
                </p>
              </div>
              <p className="mb-4">
                <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                  destek@lalabits.art
                </a>
                {' '}adresine aşağıdaki bilgilerle yazın:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Hesabınızda kayıtlı e-posta adresi</li>
                <li>İtiraz etmek istediğiniz ödemenin tarihi ve tutarı</li>
                <li>Banka ekstrenizde görünen işlem açıklaması</li>
                <li>Ödemeyi tanımamanızın nedeni (mümkünse)</li>
              </ul>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. İtiraz Başvurusu</h2>
              <p className="mb-4">
                <strong>/hesabim/faturalarim</strong> sayfasından &quot;Ödeme İtirazı&quot;
                sekmesini açarak itiraz başvurusu yapabilirsiniz. Başvuruda şunları belirtin:
              </p>
              <ol className="list-decimal list-inside space-y-3">
                <li>İtiraz ettiğiniz işlemi listeden seçin</li>
                <li>İtiraz nedeninizi seçin (tanımadım / çift ödeme / teknik hata vb.)</li>
                <li>Açıklama kutusuna detay ekleyin</li>
                <li>Formu gönderin</li>
              </ol>
              <p className="mt-4">
                Başvurunuz <strong>5 iş günü</strong> içinde incelenir. Ödeme meşruiyeti
                teyit edilemezse otomatik iade başlatılır.
              </p>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Banka İtirazı Süreci</h2>
              <p className="mb-4">
                Banka üzerinden chargeback başlatıldıysa süreç şöyle işler:
              </p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Banka bildirimi', 'İyzico/lalabits bilgilendirilir (1–3 iş günü)'],
                  ['Belge sunumu', 'lalabits işlem belgelerini bankaya sunar (7 gün)'],
                  ['Banka kararı', 'Banka 30–45 gün içinde karar verir'],
                  ['Sonuç', 'İtiraz onaylanırsa tutar iadenizde belirir; reddedilirse işlem geçerlidir'],
                ].map(([adim, detay], i, arr) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-44 flex-shrink-0 font-semibold text-text-primary">{adim}</span>
                    <span>{detay}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-text-muted">
                Banka süreci genellikle platforma doğrudan başvurudan çok daha uzun sürer.
                İlk adım olarak bize yazmanızı öneririz.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Hesap Etkisi</h2>
              <p className="mb-4">
                Banka üzerinden chargeback başlatıldıysa:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>İtiraz konusu ödemeyle erişilen içeriklere erişim geçici olarak kısıtlanabilir</li>
                <li>Chargeback süreci devam ederken yeni abonelik başlatılamayabilir</li>
                <li>Chargeback meşru bulunursa erişim kalıcı olarak kaldırılır</li>
              </ul>
              <p>
                Meşru bir itirazınız varsa hesap kısıtlaması sürecinde iletişime geçmenizi
                öneririz; durum değerlendirilerek çözüm üretilebilir.
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Sahte Chargeback</h2>
              <p className="mb-4">
                İçeriğe erişilmiş veya kullanılmış olmasına karşın yapılan asılsız chargeback
                başvuruları kötüye kullanım olarak değerlendirilir:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Hesap kalıcı olarak kapatılır</li>
                <li>Erişim engeli uygulanır</li>
                <li>Gerekirse hukuki yollara başvurulur</li>
              </ul>
              <p>
                lalabits.art, tüm işlemler için erişim kayıtları, IP bilgileri ve kullanım
                geçmişi tutmaktadır.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Sık Sorulan Sorular</h2>
              <div className="space-y-4">
                {[
                  {
                    soru: 'Ekstremde "IYZICO *LALABITS" yazıyor — bu nedir?',
                    cevap: 'İyzico, lalabits.art\'ın ödeme altyapısı sağlayıcısıdır. Banka ekstrenizdeki bu açıklama lalabits.art üzerinden yapılan bir ödemeye aittir.',
                  },
                  {
                    soru: 'Aboneliği iptal etmiştim; neden yenilendi?',
                    cevap: 'İptal işleminin dönem bitmeden yapılması gerekir. İptal tarihini ve dönem bitiş tarihini kontrol edin. Hata varsa 48 saat içinde bize yazın; iade değerlendirilebilir.',
                  },
                  {
                    soru: 'Ailem veya başkası kartımı kullandı; ne yapmalıyım?',
                    cevap: 'Bize yazın. Hesap şifrenizi değiştirip güvence altına alın. Yetkisiz kullanım tespit edilirse iade süreci başlatılabilir.',
                  },
                ].map(({ soru, cevap }, i) => (
                  <div key={i} className="rounded-[12px] border border-border p-5">
                    <p className="font-semibold text-text-primary mb-2">{soru}</p>
                    <p>{cevap}</p>
                  </div>
                ))}
              </div>
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
                <p className="mt-1">Konu: &quot;Ödeme İtirazı — [tutar] — [tarih]&quot;</p>
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
