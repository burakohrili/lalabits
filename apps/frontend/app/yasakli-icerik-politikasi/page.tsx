import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yasaklı İçerik Politikası | lalabits.art',
  description:
    'lalabits.art platformunda yayımlanamayacak içerik türleri. TCK, 5816, 3713 ve ilgili mevzuat kapsamında yasak içerik kategorileri.',
};

const bolumler = [
  'Genel İlke',
  'Mutlak Yasaklar',
  'Yetişkin İçeriği',
  'Fikri Mülkiyet İhlalleri',
  'Yanıltıcı ve Zararlı İçerik',
  'Uygulama ve Yaptırımlar',
  'Bildirim ve İtiraz',
  'Mevzuat Referansları',
];

export default function YasakliIcerikPolitikasiPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Yasaklı İçerik Politikası</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Son güncelleme: Ocak 2025</span>
            <span>TCK, 5816, 3713, 5651 kapsamında</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-4">
              <p className="text-sm text-text-primary">
                lalabits.art, onaylı üreticilerin içerik yayımladığı <strong>kontrollü bir dijital
                içerik platformudur</strong>. Aşağıdaki politika, platformda yayımlanamayacak içerik
                türlerini ve bu kurallara aykırılık hâlinde uygulanacak yaptırımları tanımlar.
                Tüm üreticiler onboarding sürecinde bu politikayı kabul etmektedir.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Genel İlke</h2>
              <p className="mb-4">
                lalabits.art&apos;ta yayımlanan her içerik, Türkiye Cumhuriyeti mevzuatına ve platform
                kurallarına uygun olmak zorundadır. Üreticiler, yayımladıkları içeriklerden
                hukuki ve cezai olarak sorumludur. Platform, içerik yayımlanmadan önce
                otomatik ve insan denetimi uygulayabilir.
              </p>
              <p>
                İçerik şikâyetleri için{' '}
                <a href="/telif-sikayeti" className="text-primary hover:underline">Telif ve Şikâyet</a>
                {' '}sayfamızı veya{' '}
                <a href="mailto:guvenlik@lalabits.art" className="text-primary hover:underline">
                  guvenlik@lalabits.art
                </a>
                {' '}adresini kullanabilirsiniz.
              </p>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Mutlak Yasaklar</h2>
              <p className="mb-4">
                Aşağıdaki içerik türleri <strong>hiçbir koşulda</strong> yayımlanamaz; ihlal
                durumunda hesap derhal kapatılır ve yetkili makamlarla paylaşım sağlanır:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong>Çocuk istismarı (CSAM):</strong> 18 yaşın altındaki bireylerin müstehcen
                  biçimde yer aldığı her tür içerik — 5237 sayılı TCK Madde 226
                </li>
                <li>
                  <strong>Terör propagandası:</strong> PKK, DEAŞ ve benzeri örgütlerin propagandasını
                  yapan içerik — 3713 sayılı TMK Madde 7/2
                </li>
                <li>
                  <strong>Atatürk&apos;e hakaret:</strong> Atatürk&apos;ün hatırasına alenen hakaret — 5816 sayılı Kanun
                </li>
                <li>
                  <strong>Devlet kurumlarına hakaret:</strong> Türk milletini, devleti ve kurumlarını aşağılayan içerik — TCK 301
                </li>
                <li>
                  <strong>Nefret söylemi:</strong> Irk, din, milliyet, cinsiyet veya cinsel yönelim temelinde şiddete tahrik — TCK 216
                </li>
                <li>
                  <strong>Kumar ve yasadışı bahis içeriği:</strong> Lisanssız kumar hizmeti tanıtımı
                </li>
                <li>
                  <strong>Uyuşturucu üretim/satış rehberleri:</strong> Yasadışı madde kullanımını teşvik eden içerik — TCK 188-190
                </li>
              </ul>
              <div className="rounded-[16px] bg-red-50 border border-red-200 px-6 py-4">
                <p className="text-sm text-red-800 font-semibold">
                  Bu kategorilerdeki ihlaller 24 saat içinde yetkili kurumlara (BTK, Cumhuriyet Savcılığı)
                  bildirilir.
                </p>
              </div>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Yetişkin İçeriği</h2>
              <p className="mb-4">
                lalabits.art şu an için yalnızca <strong>genel izleyici (18+ üyelere erişilebilir değil)</strong>
                {' '}kapsam kategorileri ile hizmet vermektedir. Aşağıdaki içerikler yasaktır:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Açık cinsel içerik (pornografi)</li>
                <li>Suç oluşturmasa dahi rıza dışı cinsel içerik (revenge porn)</li>
                <li>Müstehcen veya cinsel ima içeren ücretli içerik</li>
              </ul>
              <p>
                Platform politikası değişirse yetişkin içerik kategorisi için ayrı bir onay ve
                yaş doğrulama süreci uygulanacaktır. Bu güncelleme önceden duyurulacaktır.
              </p>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Fikri Mülkiyet İhlalleri</h2>
              <p className="mb-4">
                5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında başkasına ait telif hakkı
                içeriklerin izinsiz kullanımı yasaktır:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Başkasına ait müzik, film, fotoğraf veya metnin izinsiz paylaşılması</li>
                <li>Çalınmış yazılım veya dijital varlıkların satışa sunulması</li>
                <li>Sahte marka, logo veya kimlik kullanımı</li>
              </ul>
              <p>
                Telif şikâyetleri için{' '}
                <a href="/telif-sikayeti" className="text-primary hover:underline">Telif Şikâyeti</a>
                {' '}sayfamızı kullanınız.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Yanıltıcı ve Zararlı İçerik</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Sahte tıbbi tavsiye veya lisanssız sağlık hizmeti sunumu</li>
                <li>Dolandırıcılığa yönelik yatırım tavsiyesi (pump & dump, MLM)</li>
                <li>Kimlik avı (phishing) veya kötü amaçlı yazılım içeren dosyalar</li>
                <li>Seçim süreçlerini manipüle eden dezenformasyon</li>
                <li>Başkasının kimliğine bürünme</li>
                <li>Yapay zeka ile üretilmiş ve gerçekmiş gibi sunulan yanıltıcı içerik (deepfake)</li>
              </ul>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Uygulama ve Yaptırımlar</h2>
              <p className="mb-4">
                İhlal ağırlığına göre kademeli yaptırım uygulanır:
              </p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Uyarı', 'İlk ihlallerde içerik kaldırılır, üretici uyarılır'],
                  ['Geçici Askı', 'Tekrarlı veya orta ağırlıklı ihlallerde hesap 7–30 gün askıya alınır'],
                  ['Kalıcı Kapatma', 'Ağır ihlallerde (özellikle Bölüm 2) hesap kalıcı olarak kapatılır'],
                  ['Hukuki Bildirim', 'Suç teşkil eden içeriklerde yetkili makamlarla paylaşım yapılır'],
                ].map(([yaptırim, aciklama], i, arr) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-44 flex-shrink-0 font-semibold text-text-primary">{yaptırim}</span>
                    <span>{aciklama}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Bildirim ve İtiraz</h2>
              <p className="mb-4">
                İçeriğiniz kaldırıldıysa veya hesabınız askıya alındıysa:
              </p>
              <ol className="list-decimal list-inside space-y-3 mb-4">
                <li>E-posta yoluyla karar gerekçesi bildirilir</li>
                <li>Karardan itibaren <strong>14 gün</strong> içinde itiraz hakkınız mevcuttur</li>
                <li>İtiraz için{' '}<a href="mailto:itiraz@lalabits.art" className="text-primary hover:underline">itiraz@lalabits.art</a>{' '}adresine yazın</li>
                <li>İtirazlar <strong>5 iş günü</strong> içinde sonuçlandırılır</li>
              </ol>
              <p>
                Moderasyon sürecinin işleyişi hakkında ayrıntılı bilgi için{' '}
                <a href="/moderasyon-politikasi" className="text-primary hover:underline">Moderasyon Politikası</a>
                {' '}sayfamızı inceleyiniz.
              </p>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. Mevzuat Referansları</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>5237 sayılı Türk Ceza Kanunu (Madde 226, 216, 301, 188–190)</li>
                <li>5816 sayılı Atatürk Aleyhine İşlenen Suçlar Hakkında Kanun</li>
                <li>3713 sayılı Terörle Mücadele Kanunu (Madde 7/2)</li>
                <li>5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun</li>
                <li>5846 sayılı Fikir ve Sanat Eserleri Kanunu</li>
                <li>6698 sayılı Kişisel Verilerin Korunması Kanunu</li>
              </ul>
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
