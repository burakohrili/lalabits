import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Üretici Platform Sözleşmesi — lalabits.art',
  description: 'lalabits.art üretici platform kullanım sözleşmesi, içerik politikası, komisyon ve ödeme koşulları.',
};

const bolumler = [
  'Taraflar ve Kapsam',
  'Tanımlar',
  'Üretici Başvurusu ve Onay Süreci',
  'Platformun Hukuki Statüsü',
  'İçerik Yükleme ve Yayınlama',
  'Komisyon ve Gelir Paylaşımı',
  'Ödeme ve IBAN',
  'Üretici Yükümlülükleri',
  'Yasak İçerikler — Türk Hukuku Uyumu',
  'Fikri Mülkiyet',
  'Kişisel Veriler ve KVKK',
  'Hesap Askıya Alma ve Kapatma',
  'Platformun Hakları',
  'Sorumluluk Sınırlaması',
  'Sözleşme Değişiklikleri',
  'Uygulanacak Hukuk',
  'İletişim',
];

export default function UreticiPlatformSozlesmesiPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Üretici Platform Kullanım Sözleşmesi</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Sürüm 2025-v1</span>
            <span>Yürürlük: Ocak 2025</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Taraflar ve Kapsam</h2>
              <p className="mb-4">
                Bu Üretici Platform Kullanım Sözleşmesi (&quot;Sözleşme&quot;), lalabits.art platformunu
                işleten Noesis Social / Burak OHRİLİ (&quot;Platform&quot; veya &quot;Şirket&quot;) ile
                platforma içerik üreticisi olarak başvuran ve onaylanan gerçek kişiler
                (&quot;İçerik Üreticisi&quot; veya &quot;Üretici&quot;) arasındaki ilişkiyi düzenler.
              </p>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5 mb-4">
                <p className="font-semibold text-text-primary mb-2">Şirket Bilgileri:</p>
                <p>Noesis Social / Burak OHRİLİ</p>
                <p>Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir</p>
                <p>Ege Vergi Dairesi | VKN: 35509755908</p>
                <p>KEP: burak.ohrili@hs06.kep.tr</p>
                <p>Tel: 0532 744 94 34</p>
              </div>
              <p className="mb-4">
                Bu Sözleşme, Kullanım Şartları&apos;nın ayrılmaz bir parçasıdır ve Üretici rolüne
                özgü ek hükümleri içerir. Aralarında çelişki olması hâlinde bu Sözleşme öncelikli
                uygulanır.
              </p>
              <p>
                Üretici olarak kayıt yaptırarak bu Sözleşme&apos;yi okuduğunuzu, anladığınızı ve tüm
                hükümleriyle bağlı olmayı kabul ettiğinizi beyan edersiniz.
              </p>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Tanımlar</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Platform', 'lalabits.art web sitesi ve hizmetlerinin bütünü.'],
                  ['İçerik Üreticisi / Üretici', 'Platform üzerinde içerik yayınlayan, üyelik planı açan veya dijital ürün satan onaylı kullanıcı.'],
                  ['Destekçi / Fan', 'Üreticiyi ücretli üyelik veya tekil satın alma yoluyla destekleyen kullanıcı.'],
                  ['Üyelik Planı', 'Üreticinin belirlediği aylık veya yıllık ücretli erişim kademesi.'],
                  ['Dijital Ürün', 'Üreticinin platforma yüklediği, tek seferlik ödemeyle satılan dosya veya içerik paketi.'],
                  ['Koleksiyon', 'İçerik ve ürünlerin bir arada sunulduğu, tek ödemeyle satın alınabilen paket.'],
                  ['Brüt Gelir', 'Fan ödemelerinin tamamı.'],
                  ['Net Kazanç', 'Brüt Gelirden Platform komisyonu düşüldükten sonra Üretici\'ye aktarılan tutar.'],
                ].map(([terim, tanim], i, arr) => (
                  <div
                    key={terim}
                    className={`flex items-start gap-4 px-5 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-48 flex-shrink-0 font-semibold text-text-primary">{terim}</span>
                    <span>{tanim}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Üretici Başvurusu ve Onay Süreci</h2>
              <p className="mb-4">
                Platforma Üretici olarak katılım başvuru ve onay sürecine tabidir. Üretici sıfatı
                otomatik kazanılmaz.
              </p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Üretici hesabı oluşturmak için <strong>/auth/kayit/yaratici</strong> adresine gidin.</li>
                <li>Kimlik ve fatura bilgilerini eksiksiz doldurun.</li>
                <li>Bu Sözleşme ve içerik politikasını onaylayın.</li>
                <li>Onboarding sihirbazını (profil, IBAN, üyelik planı) tamamlayın ve başvurun.</li>
              </ol>
              <p>
                Platform başvuruları 1–3 iş günü içinde inceler. Onay kararı Platform&apos;un takdir
                yetkisindedir. Onay öncesinde hiçbir içerik ve ürün yayınlanamaz.
              </p>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Platformun Hukuki Statüsü</h2>
              <p className="mb-3">
                lalabits.art, içerik üreticileri ile destekçiler arasında aracılık hizmeti sunan
                elektronik bir platformdur.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Platform, <strong>yalnızca teknik altyapı ve ödeme aracılığı hizmeti</strong> sunmaktadır.
                  Üretici tarafından yayınlanan tüm içeriklerden doğan hukuki, cezai ve idari
                  sorumluluk münhasıran Üretici&apos;ye aittir.
                </li>
                <li>
                  Platform, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun kapsamında
                  <strong> aracı hizmet sağlayıcı</strong> sıfatını taşımaktadır.
                </li>
                <li>
                  Platform, 5651 sayılı Kanun gereği yetkili makamlarca talep edilmesi hâlinde
                  kullanıcı bilgilerini ve içerikleri yetkili mercilerle paylaşma yükümlülüğü altındadır.
                </li>
              </ul>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. İçerik Yükleme ve Yayınlama</h2>
              <p className="mb-4">
                Üretici; gönderi, dijital ürün, koleksiyon ve üyelik planı oluşturabilir. Her
                içerik türü için erişim düzeyi Üretici tarafından belirlenir.
              </p>
              <p className="mb-3 font-semibold text-text-primary">Desteklenen dosya türleri:</p>
              <p className="mb-4">
                PDF, ZIP/RAR, ses dosyaları (MP3, WAV, FLAC), video dosyaları (MP4), tasarım
                dosyaları (PSD, AI, FIGMA, SVG) ve Platform&apos;un zaman zaman genişletebileceği
                diğer dijital formatlar.
              </p>
              <p>
                Fanların satın aldığı içerikler kütüphanelerine eklenir. Üretici sonradan bir
                içeriği kaldırırsa iade politikası uygulanır.
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Komisyon ve Gelir Paylaşımı</h2>
              <div className="rounded-[16px] border border-border overflow-hidden mb-4">
                <div className="flex items-center gap-4 px-5 py-3 border-b border-border bg-surface">
                  <span className="w-40 flex-shrink-0 font-semibold text-text-primary">Plan</span>
                  <span className="font-semibold text-text-primary">Komisyon Oranı</span>
                </div>
                <div className="flex items-center gap-4 px-5 py-3">
                  <span className="w-40 flex-shrink-0 text-text-primary">Başlangıç Planı</span>
                  <span><strong>%8</strong> — tüm Üreticiler için geçerli sabit oran</span>
                </div>
              </div>
              <p className="mb-4">
                Net Kazanç = Brüt Gelir × (1 − 0,08). Ödeme işlem ücretleri ayrıca uygulanabilir.
              </p>
              <p>
                Komisyon oranı değiştirilebilir; değişiklikler yürürlükten en az 30 gün önce
                e-posta ile bildirilir.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Ödeme ve IBAN</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Minimum çekim tutarı: <strong>100 ₺</strong></li>
                <li>Para birimi: <strong>Türk Lirası (TRY)</strong></li>
                <li>Çekim talebi sonrası işlem süresi: <strong>3–5 iş günü</strong></li>
                <li>Geçersiz IBAN nedeniyle iade edilen ödemeler için sorumluluk Üretici&apos;ye aittir.</li>
              </ul>
              <p className="mb-4">
                Üretici; vergi, SGK ve diğer yasal yükümlülüklerden münhasıran sorumludur.
                Platform Üretici adına vergi kesintisi yapmaz veya beyanname vermez.
              </p>
              <p>
                Platform, fraud şüphesi veya yasal zorunluluk durumlarında ödemeyi geçici
                olarak askıya alabilir; bu durum Üretici&apos;ye bildirilir.
              </p>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. Üretici Yükümlülükleri</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Yüklenen tüm içeriklerin kendisine ait veya gerekli lisansa sahip olduğunu beyan eder.</li>
                <li>İçerik açıklamalarının doğru ve yanıltıcı olmadığını taahhüt eder.</li>
                <li>Fanlara vaat edilen üyelik avantajlarını (perks) sunmakla yükümlüdür.</li>
                <li>Destekçilerle iletişimde dürüst ve saygılı davranır.</li>
                <li>Kişisel bilgilerini (e-posta, IBAN) güncel tutar.</li>
                <li>Hesabını üçüncü kişilerle paylaşmaz.</li>
                <li>Türkiye Cumhuriyeti yasaları ve uluslararası telif hukuku çerçevesinde hareket eder.</li>
              </ul>
            </section>

            <section id="bolum-9">
              <h2 className="text-base font-bold text-text-primary mb-4">9. Yasak İçerikler — Türk Hukuku Uyumu</h2>
              <p className="mb-4 font-semibold text-red-700">
                Aşağıdaki içerikler kesinlikle yasaktır ve derhal hesap kapatma ile hukuki işlem
                başlatılmasına neden olur:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong>18 yaş altı bireylerin</strong> cinsellik içeren herhangi bir içerikte yer
                  aldığı veya bu içeriklere yönelik olduğu her türlü materyal (5237 sayılı TCK md. 103, 226)
                </li>
                <li>
                  Cinsel açıdan müstehcen, pornografik veya çıplaklık içeren görsel, ses veya metin
                  materyalleri (5237 sayılı TCK md. 226)
                </li>
                <li>
                  Atatürk aleyhine işlenmiş suçlar hakkındaki 5816 sayılı Kanun kapsamındaki içerikler
                </li>
                <li>
                  Terörü öven, propagandasını yapan ya da terör örgütlerini destekleyen içerikler
                  (3713 sayılı TMK)
                </li>
                <li>
                  Nefret söylemi; ırk, din, cinsiyet veya etnik kökene dayalı ayrımcılığı teşvik
                  eden içerikler (5237 sayılı TCK md. 122, 216)
                </li>
                <li>Kişilerin onayı alınmadan paylaşılan özel görsel veya bilgileri (KVKK ihlali)</li>
                <li>Telif hakkı ihlali oluşturan içerikler (5846 sayılı FSEK)</li>
                <li>Kumar, bahis veya yasadışı madde reklamı yapan içerikler</li>
                <li>Yanıltıcı, sahte ürün/içerik açıklamaları</li>
                <li>Zararlı yazılım veya güvenlik açığı barındıran dosyalar</li>
                <li>Türk hukuku ve TC mevzuatı kapsamında yasak olan her türlü içerik</li>
              </ul>
              <div className="rounded-[16px] border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-sm text-red-800">
                  Bu maddeyi ihlal eden Üretici&apos;nin hesabı önceden bildirim yapılmaksızın
                  askıya alınır ve kalıcı olarak kapatılabilir. Platform, şüpheli içerikleri
                  5651 sayılı Kanun gereği yetkili makamlara bildirme hakkını saklı tutar.
                  İhlal durumunda askıdaki ödemeler dondurulabilir.
                </p>
              </div>
            </section>

            <section id="bolum-10">
              <h2 className="text-base font-bold text-text-primary mb-4">10. Fikri Mülkiyet</h2>
              <p className="mb-4">
                Üretici, platforma yüklediği içeriklerin tüm fikri mülkiyet haklarını elinde tutar.
                Bu Sözleşme, Platform&apos;a içerik üzerinde herhangi bir mülkiyet hakkı tanımaz.
              </p>
              <p className="mb-3">Platform&apos;a verilen sınırlı lisans kapsamı:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>İçerikleri Platform altyapısında depolamak ve sunmak</li>
                <li>Üreticinin belirlediği erişim koşullarına göre Fanlara iletmek</li>
                <li>Platform tanıtım materyallerinde Üretici adı ve profil bilgilerini kullanmak</li>
              </ul>
            </section>

            <section id="bolum-11">
              <h2 className="text-base font-bold text-text-primary mb-4">11. Kişisel Veriler ve KVKK</h2>
              <p className="mb-4">
                Platform, 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca veri sorumlusu
                sıfatıyla hareket eder.
              </p>
              <p className="mb-3 font-semibold text-text-primary">İşlenen kişisel veriler:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Ad soyad, e-posta, telefon — hesap yönetimi ve iletişim amaçlı</li>
                <li>TC Kimlik Numarası — ödeme sağlayıcısı zorunluluğu; AES-256 ile şifreli saklanır</li>
                <li>IBAN — kazanç ödemeleri için; şifreli saklanır</li>
                <li>IP adresi ve cihaz bilgisi — güvenlik ve doğrulama amaçlı</li>
                <li>İçerik verileri — platform hizmetinin sunulması için</li>
              </ul>
              <p className="mb-4">
                Veriler yalnızca hizmetin gerektirdiği süre boyunca saklanır. 6698 sayılı Kanun&apos;un
                11. maddesi kapsamında erişim, düzeltme, silme, itiraz ve veri taşınabilirliği
                haklarınızı <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">destek@lalabits.art</a> adresine
                yazılı başvuru ile kullanabilirsiniz.
              </p>
              <p>
                TC Kimlik Numarası ve IBAN bilgileri hiçbir log kaydına veya API yanıtına ham
                metin olarak yazılmaz; yalnızca ödeme sağlayıcısının gerektirdiği durumlarda
                güvenli kanal üzerinden iletilir.
              </p>
            </section>

            <section id="bolum-12">
              <h2 className="text-base font-bold text-text-primary mb-4">12. Hesap Askıya Alma ve Kapatma</h2>
              <p className="mb-4">
                Platform, bu Sözleşme&apos;nin, Kullanım Şartları&apos;nın veya İçerik Politikası&apos;nın
                ihlali hâlinde Üretici hesabını önceden bildirimde bulunmaksızın askıya alabilir
                veya kapatabilir.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Profil ve içerikler yayından kaldırılır.</li>
                <li>Aktif üyelikler iptal edilir; Fanlara orantılı iade yapılır.</li>
                <li>Mevcut net kazanç yürürlükteki koşullara göre aktarılır (fraud ve yasal işlem hariç).</li>
                <li>Kapatma kararına itiraz için destek@lalabits.art adresine 15 gün içinde yazılı başvuru yapılabilir.</li>
              </ul>
            </section>

            <section id="bolum-13">
              <h2 className="text-base font-bold text-text-primary mb-4">13. Platformun Hakları</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Platform özelliklerini, tasarımını ve hizmet koşullarını değiştirmek</li>
                <li>Teknik bakım için hizmeti geçici durdurmak</li>
                <li>Sözleşme&apos;ye aykırı içerikleri kaldırmak</li>
                <li>Yasal zorunluluk veya yetkili makam talebi üzerine kullanıcı bilgilerini paylaşmak</li>
                <li>Yeni Üretici başvurularını gerekçe sunmaksızın reddetmek</li>
              </ul>
            </section>

            <section id="bolum-14">
              <h2 className="text-base font-bold text-text-primary mb-4">14. Sorumluluk Sınırlaması</h2>
              <p className="mb-4">
                Platform aracı teknoloji sağlayıcısı konumundadır. Üretici ile Fan arasındaki
                ticari ilişkiden doğan uyuşmazlıkların birincil muhatabı Üretici&apos;dir.
              </p>
              <p>
                Platform&apos;un herhangi bir Üretici&apos;ye karşı toplam sorumluluğu, ilgili takvim yılı
                içinde tahsil edilen Net Kazanç tutarını aşamaz.
              </p>
            </section>

            <section id="bolum-15">
              <h2 className="text-base font-bold text-text-primary mb-4">15. Sözleşme Değişiklikleri</h2>
              <p className="mb-4">
                Önemli değişiklikler yürürlük tarihinden en az 30 gün önce kayıtlı e-posta
                adresinize bildirilir.
              </p>
              <p>
                Bildirim sonrasında platformu kullanmaya devam etmek, güncellenmiş Sözleşme&apos;yi
                kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section id="bolum-16">
              <h2 className="text-base font-bold text-text-primary mb-4">16. Uygulanacak Hukuk</h2>
              <p className="mb-4">
                Bu Sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda öncelikle
                müzakere ve arabuluculuk yolları denenir; çözümsüz kalırsa <strong>İzmir Mahkemeleri
                ve İcra Daireleri</strong> yetkilidir.
              </p>
            </section>

            <section id="bolum-17">
              <h2 className="text-base font-bold text-text-primary mb-4">17. İletişim</h2>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <p className="font-semibold text-text-primary mb-2">Noesis Social / Burak OHRİLİ</p>
                <p>Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir</p>
                <p className="mt-2">
                  E-posta:{' '}
                  <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                    destek@lalabits.art
                  </a>
                </p>
                <p>KEP: burak.ohrili@hs06.kep.tr</p>
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
