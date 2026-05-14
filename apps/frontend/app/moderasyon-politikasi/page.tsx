import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moderasyon Politikası | lalabits.art',
  description:
    'lalabits.art moderasyon süreci, içerik denetimi ve hesap kararlarına itiraz yöntemi.',
};

const bolumler = [
  'Moderasyon Yaklaşımı',
  'Proaktif Denetim',
  'Şikâyet Temelli Denetim',
  'Karar Kategorileri',
  'Bildirim Süreci',
  'İtiraz Hakkı',
  'Şeffaflık',
  'İletişim',
];

export default function ModerasyonPolitikasiPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Moderasyon Politikası</h1>
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
                lalabits.art, içerik kalitesini ve kullanıcı güvenliğini korumak için hem
                otomatik hem de insan denetimli moderasyon uygular. Bu politika, moderasyon
                sürecinin nasıl işlediğini ve kullanıcıların haklarını açıklamaktadır.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Moderasyon Yaklaşımı</h2>
              <p className="mb-4">
                lalabits.art moderasyonu iki temel katmandan oluşur:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li><strong>Otomatik denetim:</strong> Yükleme anında zararlı içerik, yasaklı kelime ve format ihlali kontrolü</li>
                <li><strong>İnsan denetimi:</strong> Şikâyet üzerine veya otomatik bayrak atılan içeriklerin moderatörler tarafından incelenmesi</li>
              </ul>
              <p>
                Platform, üreticilerin içeriğini önceden onaylamaz (pre-moderation); ancak
                ihlal tespitinde hızlı müdahale uygular (reactive moderation).
              </p>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Proaktif Denetim</h2>
              <p className="mb-4">
                Platform, ihlal şikâyeti gelmeden aşağıdaki durumlarda proaktif olarak harekete geçer:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Yüklenen içeriklerin otomatik hash eşleşmesiyle bilinen yasadışı içerik tespiti</li>
                <li>Yoğun şikâyet alan hesapların ön incelemesi</li>
                <li>BTK veya savcılık bildirimleri üzerine acil kaldırma</li>
                <li>Kullanım anormalliği tespiti (botlu indirme, hesap ele geçirme belirtisi)</li>
              </ul>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Şikâyet Temelli Denetim</h2>
              <p className="mb-4">
                Kullanıcılar içerik veya hesap şikâyetlerini aşağıdaki kanallardan iletebilir:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Gönderi veya profil sayfasındaki &quot;Bildir&quot; butonu</li>
                <li>
                  E-posta:{' '}
                  <a href="mailto:guvenlik@lalabits.art" className="text-primary hover:underline">
                    guvenlik@lalabits.art
                  </a>
                </li>
              </ul>
              <p className="mb-4">Şikâyet alındıktan sonra süreç şöyle işler:</p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Şikâyet alındı', 'Otomatik onay e-postası gönderilir'],
                  ['Ön değerlendirme', '24 saat içinde yapılır'],
                  ['Tam inceleme', '3 iş günü içinde tamamlanır'],
                  ['Karar ve aksiyon', '5 iş günü içinde uygulanır'],
                  ['Şikâyet sahibine bildirim', 'Karar e-posta ile iletilir'],
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
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Karar Kategorileri</h2>
              <p className="mb-4">
                Moderasyon sonucunda alınabilecek kararlar:
              </p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['İçerik kaldırma', 'İhlal eden tek gönderi veya dosya kaldırılır'],
                  ['İçerik gizleme', 'İçerik geçici olarak gizlenir, inceleme devam eder'],
                  ['Uyarı', 'Kullanıcıya yazılı uyarı gönderilir'],
                  ['Özellik kısıtlama', 'Belirli özellikler geçici olarak devre dışı bırakılır'],
                  ['Hesap askıya alma', 'Hesap 7–30 gün süreyle erişime kapatılır'],
                  ['Kalıcı kapatma', 'Hesap kalıcı olarak sonlandırılır'],
                  ['Yasal bildirim', 'Suç teşkil eden durumlarda yetkili makamlara bildirim'],
                ].map(([karar, aciklama], i, arr) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-48 flex-shrink-0 font-semibold text-text-primary">{karar}</span>
                    <span>{aciklama}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Bildirim Süreci</h2>
              <p className="mb-4">
                İçeriği kaldırılan veya hesabı kısıtlanan kullanıcı şunları alır:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>E-posta yoluyla kararın özeti ve gerekçesi</li>
                <li>Hangi kural(lar)ın ihlal edildiğinin açıklaması</li>
                <li>Varsa itiraz hakkı ve süresi</li>
                <li>İyileştirme yapılması hâlinde hesabın nasıl normale döneceğine dair bilgi</li>
              </ul>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. İtiraz Hakkı</h2>
              <p className="mb-4">
                Her moderasyon kararına itiraz hakkı tanınır. İtiraz süresi karar tarihinden
                itibaren <strong>14 gündür.</strong>
              </p>
              <p className="mb-4">İtiraz sürecinde:</p>
              <ol className="list-decimal list-inside space-y-3 mb-4">
                <li>
                  <a href="mailto:itiraz@lalabits.art" className="text-primary hover:underline">
                    itiraz@lalabits.art
                  </a>
                  {' '}adresine &quot;İtiraz — [kullanıcı adı] — [karar tarihi]&quot; konusuyla yazın
                </li>
                <li>Kararın neden hatalı olduğunu açıklayan gerekçenizi ekleyin</li>
                <li>Varsa destekleyici belge veya kanıt ekleyin</li>
                <li>İtirazınız <strong>5 iş günü</strong> içinde sonuçlandırılır</li>
              </ol>
              <p>
                İtiraz kararı platform içi değerlendirmede nihai olmakla birlikte, 6502 sayılı Kanun
                kapsamındaki tüketici hakları ve ilgili mevzuat saklıdır.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Şeffaflık</h2>
              <p className="mb-4">
                lalabits.art, moderasyon istatistiklerini yılda en az bir kez yayımlamayı
                taahhüt eder. Bu raporda şunlar yer alır:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Alınan şikâyet sayısı (kategoriye göre)</li>
                <li>Kaldırılan içerik sayısı</li>
                <li>Kapatılan hesap sayısı</li>
                <li>Kabul edilen itiraz oranı</li>
                <li>Yetkili makam bildirim sayısı</li>
              </ul>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. İletişim</h2>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <p className="font-semibold text-text-primary mb-1">Güvenlik ve Moderasyon</p>
                <p>
                  Şikâyet:{' '}
                  <a href="mailto:guvenlik@lalabits.art" className="text-primary hover:underline">
                    guvenlik@lalabits.art
                  </a>
                </p>
                <p className="mt-1">
                  İtiraz:{' '}
                  <a href="mailto:itiraz@lalabits.art" className="text-primary hover:underline">
                    itiraz@lalabits.art
                  </a>
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  Yanıt süresi: 1–3 iş günü (Pazartesi–Cuma, 09:00–18:00 TSİ)
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
