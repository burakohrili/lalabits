export const metadata = { title: 'Yaratıcı Sözleşmesi — lalabits.art' };

interface LegalMeta {
  document_type: string;
  version_identifier: string;
  effective_date: string;
  is_current: boolean;
}

async function fetchMeta(): Promise<LegalMeta | null> {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  try {
    const res = await fetch(`${API}/legal/creator-agreement`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<LegalMeta>;
  } catch {
    return null;
  }
}

const bolumler = [
  'Taraflar ve Kapsam',
  'Tanımlar',
  'Üretici Başvurusu ve Onay Süreci',
  'İçerik Yükleme ve Yayınlama',
  'Komisyon ve Gelir Paylaşımı',
  'Ödeme ve IBAN',
  'Üretici Yükümlülükleri',
  'Yasak İçerikler ve Davranışlar',
  'Fikri Mülkiyet',
  'Hesap Askıya Alma ve Kapatma',
  'Platform\'un Hakları',
  'Sorumluluk Sınırlaması',
  'Sözleşme Değişiklikleri',
  'Uygulanacak Hukuk ve Yetkili Mahkeme',
  'İletişim',
];

export default async function YaraticiSozlesmesiPage() {
  const meta = await fetchMeta();

  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Yaratıcı Sözleşmesi</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            {meta ? (
              <>
                <span>Sürüm {meta.version_identifier}</span>
                <span>Yürürlük: {new Date(meta.effective_date).toLocaleDateString('tr-TR')}</span>
              </>
            ) : (
              <>
                <span>Sürüm 1.0</span>
                <span>Yürürlük: Ocak 2025</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          {/* Ana içerik */}
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Taraflar ve Kapsam</h2>
              <p className="mb-4">
                Bu Yaratıcı Sözleşmesi (&quot;Sözleşme&quot;), lalabits.art platformunu işleten
                Noesis Social / Burak OHRİLİ (&quot;Platform&quot; veya &quot;Şirket&quot;) ile
                platforma içerik üreticisi olarak başvuran ve onaylanan gerçek kişiler
                (&quot;Üretici&quot;) arasındaki ilişkiyi düzenler.
              </p>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5 mb-4">
                <p className="font-semibold text-text-primary mb-2">Şirket bilgileri:</p>
                <p>Noesis Social / Burak OHRİLİ</p>
                <p>Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir</p>
                <p>Ege Vergi Dairesi | VKN: 35509755908</p>
              </div>
              <p className="mb-4">
                Bu Sözleşme, Kullanım Şartları&apos;nın ayrılmaz bir parçasıdır ve Üretici
                rolüne özgü ek hükümleri içerir. Kullanım Şartları ile bu Sözleşme arasında
                çelişki olması hâlinde bu Sözleşme öncelikli uygulanır.
              </p>
              <p>
                Üretici olarak başvuru yaparak ve onboarding sürecini tamamlayarak bu Sözleşme&apos;yi
                okuduğunuzu, anladığınızı ve tüm hükümleriyle bağlı olmayı kabul ettiğinizi beyan edersiniz.
              </p>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Tanımlar</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Platform', 'lalabits.art web sitesi ve hizmetlerinin bütünü.'],
                  ['Üretici', 'Platform üzerinde içerik yayınlayan, üyelik planı açan veya dijital ürün satan onaylı kullanıcı.'],
                  ['Destekçi / Fan', 'Üreticiyi ücretli üyelik veya tekil satın alma yoluyla destekleyen kullanıcı.'],
                  ['Üyelik Planı', 'Üreticinin belirlediği aylık veya yıllık ücretli erişim kademesi.'],
                  ['Dijital Ürün', 'Üreticinin platforma yüklediği, tek seferlik ödemeyle satılan dosya veya içerik paketi.'],
                  ['Koleksiyon', 'İçerik ve ürünlerin bir arada sunulduğu, tek ödemeyle satın alınabilen paket.'],
                  ['Kütüphane', 'Fanların satın aldıkları ürün ve üyelik içeriklerine eriştikleri /kutuphane sayfası.'],
                  ['Brüt Gelir', 'Fan ödemelerinin tamamı (işlem ücretleri ve vergi hariç).'],
                  ['Net Kazanç', 'Brüt Gelirden Platform komisyonu düşüldükten sonra Üretici\'ye aktarılan tutar.'],
                  ['IBAN', 'Üreticinin ödemelerini almak üzere sisteme kaydettiği Türk banka hesabı (TR formatı).'],
                ].map(([terim, tanim], i) => (
                  <div
                    key={terim}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== 9 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-32 flex-shrink-0 font-semibold text-text-primary">{terim}</span>
                    <span>{tanim}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Üretici Başvurusu ve Onay Süreci</h2>
              <p className="mb-4">
                Platforma Üretici olarak katılım, başvuru ve onay sürecine tabidir. Üretici
                sıfatı otomatik olarak kazanılmaz.
              </p>
              <p className="mb-3 font-semibold text-text-primary">Başvuru adımları:</p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Üretici hesabı oluşturmak için <strong>/auth/kayit/yaratici</strong> adresine gidin.</li>
                <li>Onboarding sihirbazını (profil, IBAN, üyelik planı) eksiksiz tamamlayın.</li>
                <li>Bu Sözleşme&apos;yi onaylayın.</li>
                <li>Başvurunuzu gönderin.</li>
              </ol>
              <p className="mb-4">
                Platform, başvuruları 1–3 iş günü içinde inceler. Onay kararı Platform&apos;un takdir
                yetkisindedir; gerekçe sunmakla yükümlü değildir. Reddedilen başvurular için
                bildirim yapılır ve kısa süre sonra yeniden başvuru hakkı doğar.
              </p>
              <p>
                Onay sonrasında Üretici profili yayınlanır, üyelik planları ve mağaza aktif hâle gelir.
                Onay öncesinde hiçbir içerik ve ürün yayınlanamaz.
              </p>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. İçerik Yükleme ve Yayınlama</h2>
              <p className="mb-4">
                Üretici; gönderi, dijital ürün, koleksiyon ve üyelik planı oluşturabilir.
                Her içerik türü için erişim düzeyi (herkese açık, üyelere açık, kademeye
                göre kilitli) Üretici tarafından belirlenir.
              </p>
              <p className="mb-3 font-semibold text-text-primary">Desteklenen dosya türleri:</p>
              <p className="mb-4">
                PDF, ZIP/RAR, ses dosyaları (MP3, WAV, FLAC), video dosyaları (MP4),
                tasarım dosyaları (PSD, AI, FIGMA, SVG) ve Platform&apos;un zaman zaman
                genişletebileceği diğer dijital formatlar.
              </p>
              <p className="mb-4">
                Dosya boyutu limitleri ve depolama kotası Platform tarafından belirlenir
                ve değiştirilebilir; güncel limitler dashboard&apos;da görüntülenir.
              </p>
              <p>
                Fanların satın aldığı içerikler kütüphanelerine eklenir. Üretici sonradan
                bir içeriği kaldırırsa, söz konusu içerik için iade politikası uygulanır.
                İçerik kaldırma, Üretici&apos;nin platform üzerindeki yükümlülüklerini ortadan kaldırmaz.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Komisyon ve Gelir Paylaşımı</h2>
              <p className="mb-4">
                Platform, Üretici aracılığıyla gerçekleşen her başarılı fan ödemesinden
                aşağıdaki oranda komisyon keser:
              </p>
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
                Komisyon, ödeme işlem ücretleri dahil Brüt Gelir üzerinden hesaplanır.
                Net Kazanç = Brüt Gelir × (1 − 0,08) formülüyle belirlenir.
              </p>
              <p className="mb-4">
                Ödeme işlem ücretleri (ödeme altyapısı sağlayıcısından kaynaklanan)
                ayrıca uygulanabilir; güncel oran dashboard&apos;da görüntülenir.
              </p>
              <p>
                Komisyon oranları değiştirilebilir. Değişiklikler, yürürlük tarihinden
                en az 30 gün önce Üreticiye e-posta yoluyla bildirilir. Değişiklik
                sonrasında platformu kullanmaya devam etmek, yeni oranları kabul
                ettiğiniz anlamına gelir.
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Ödeme ve IBAN</h2>
              <p className="mb-4">
                Üretici, Net Kazancını almak için geçerli bir Türk banka hesabına ait
                TR formatında IBAN girmek zorundadır. IBAN doğrulanamaz veya geçersiz
                ise ödeme gerçekleştirilemez.
              </p>
              <p className="mb-3 font-semibold text-text-primary">Ödeme koşulları:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Minimum çekim tutarı: <strong>100 ₺</strong></li>
                <li>Ödeme para birimi: <strong>Türk Lirası (TRY)</strong></li>
                <li>Çekim talebi sonrası işlem süresi: <strong>3–5 iş günü</strong></li>
                <li>Yanlış veya kapalı IBAN nedeniyle iade edilen ödemeler için sorumluluk Üretici&apos;ye aittir.</li>
              </ul>
              <p className="mb-4">
                Platform, yasal yükümlülükler veya fraud şüphesi gibi durumlarda ödemeyi
                geçici olarak askıya alabilir. Bu durum Üreticiye bildirilir.
              </p>
              <p>
                Vergi, SGK ve diğer yasal yükümlülükler tamamen Üretici&apos;nin sorumluluğundadır.
                Platform, Üretici adına herhangi bir vergi kesintisi yapmaz veya beyanname vermez.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Üretici Yükümlülükleri</h2>
              <p className="mb-3">Üretici aşağıdaki yükümlülükleri kabul eder:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Platforma yüklenen tüm içeriklerin kendisine ait veya gerekli lisansa sahip olduğunu beyan eder.</li>
                <li>İçerik açıklamalarının doğru ve yanıltıcı olmadığını taahhüt eder.</li>
                <li>Fanlara vaat edilen üyelik avantajlarını (perks) sunmakla yükümlüdür.</li>
                <li>Destekçilerle iletişimde dürüst ve saygılı davranır.</li>
                <li>Kişisel bilgilerini (e-posta, IBAN) güncel tutar.</li>
                <li>Hesabını üçüncü kişilerle paylaşmaz.</li>
                <li>Türkiye Cumhuriyeti yasaları ve uluslararası telif hukuku çerçevesinde hareket eder.</li>
                <li>Platform&apos;un zaman zaman yayımlayabileceği İçerik Politikası güncellemelerine uyar.</li>
              </ul>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. Yasak İçerikler ve Davranışlar</h2>
              <p className="mb-3">Platformda kesinlikle yasaktır:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Başkasına ait telif hakkıyla korunan içeriğin izinsiz kullanımı</li>
                <li>Yetişkinlere yönelik müstehcen içerik</li>
                <li>Nefret söylemi, ırkçılık, ayrımcılık veya şiddeti teşvik eden içerik</li>
                <li>Yanıltıcı veya sahte ürün/içerik açıklamaları</li>
                <li>Kişisel verilerin izinsiz paylaşımı (KVKK ihlali)</li>
                <li>Zararlı yazılım veya güvenlik açığı barındıran dosyalar</li>
                <li>Kumar, yasadışı ürün veya hizmet tanıtımı</li>
                <li>Platform sistemlerine yönelik manipülasyon veya saldırı girişimleri</li>
                <li>Birden fazla hesap açarak Platform politikalarını atlatmaya çalışmak</li>
              </ul>
              <p>
                Yasak içerik tespiti durumunda Platform; içeriği kaldırma, Üretici hesabını
                uyarma, askıya alma veya kalıcı olarak kapatma haklarını saklı tutar.
              </p>
            </section>

            <section id="bolum-9">
              <h2 className="text-base font-bold text-text-primary mb-4">9. Fikri Mülkiyet</h2>
              <p className="mb-4">
                Üretici, platforma yüklediği içeriklerin tüm fikri mülkiyet haklarını elinde
                tutar. Bu Sözleşme, Platform&apos;a içerik üzerinde herhangi bir mülkiyet hakkı
                tanımaz.
              </p>
              <p className="mb-4">
                Üretici, Platform&apos;a yalnızca aşağıdaki sınırlı lisansı verir:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>İçerikleri Platform altyapısında depolamak ve sunmak</li>
                <li>Üreticinin belirlediği erişim koşullarına göre Fanlara iletmek</li>
                <li>Platform tanıtım ve pazarlama materyallerinde Üretici adını ve profil
                    bilgilerini kullanmak (Üretici buna itiraz etme hakkını saklı tutar)</li>
              </ul>
              <p>
                Platform&apos;a ait marka, logo, yazılım ve tasarım unsurları üzerinde Üreticinin
                hiçbir hakkı yoktur.
              </p>
            </section>

            <section id="bolum-10">
              <h2 className="text-base font-bold text-text-primary mb-4">10. Hesap Askıya Alma ve Kapatma</h2>
              <p className="mb-4">
                Platform; bu Sözleşme, Kullanım Şartları veya İçerik Politikası&apos;nın ihlali
                hâlinde Üretici hesabını önceden bildirimde bulunmaksızın askıya alabilir
                veya kapatabilir.
              </p>
              <p className="mb-3 font-semibold text-text-primary">Askıya alma ve kapatma sonuçları:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Profil ve içerikler yayından kaldırılır.</li>
                <li>Aktif üyelikler iptal edilir; Fanlara orantılı iade yapılır.</li>
                <li>Hesap kapatıldığı tarihte mevcut net kazanç, yürürlükteki ödeme koşullarına
                    göre Üretici&apos;ye aktarılır (fraud tespiti veya yasal işlem durumları hariç).</li>
                <li>Kapatma kararına itiraz için destek@lalabits.art adresine 15 gün içinde
                    yazılı başvuru yapılabilir.</li>
              </ul>
              <p>
                Üretici dilediği zaman hesabını kapatabilir. Hesap kapatma talebi için
                dashboard &gt; Ayarlar &gt; Hesabı Kapat bölümü kullanılır.
              </p>
            </section>

            <section id="bolum-11">
              <h2 className="text-base font-bold text-text-primary mb-4">11. Platform&apos;un Hakları</h2>
              <p className="mb-3">Platform aşağıdaki hakları saklı tutar:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Platform özelliklerini, tasarımını ve hizmet koşullarını değiştirmek</li>
                <li>Yeni içerik kategori ve formatları eklemek veya mevcut olanları kaldırmak</li>
                <li>Teknik bakım veya acil durum için hizmeti geçici olarak durdurmak</li>
                <li>Kullanım Şartları veya bu Sözleşme&apos;ye aykırı içerikleri kaldırmak</li>
                <li>Yasal zorunluluk veya yetkili makam talebi üzerine kullanıcı bilgilerini paylaşmak</li>
                <li>Yeni Üretici başvurularını gerekçe sunmaksızın reddetmek</li>
              </ul>
            </section>

            <section id="bolum-12">
              <h2 className="text-base font-bold text-text-primary mb-4">12. Sorumluluk Sınırlaması</h2>
              <p className="mb-4">
                Platform, aracı teknoloji sağlayıcısı konumundadır. Üretici ile Fan arasındaki
                ticari ilişkiden doğan uyuşmazlıkların birincil muhatabı Üretici&apos;dir.
              </p>
              <p className="mb-4">
                Platform; Üretici içeriklerinin doğruluğundan, bir Fanın içeriğe erişememesinden
                (Üretici kaynaklı), teknik altyapı dışındaki kesintilerden ve üçüncü taraf
                ödeme sağlayıcısından kaynaklanan gecikmelerden sorumlu tutulamaz.
              </p>
              <p>
                Platform&apos;un herhangi bir Üretici&apos;ye karşı toplam sorumluluğu, ilgili
                takvim yılı içinde Üretici adına tahsil edilen Net Kazanç tutarını aşamaz.
              </p>
            </section>

            <section id="bolum-13">
              <h2 className="text-base font-bold text-text-primary mb-4">13. Sözleşme Değişiklikleri</h2>
              <p className="mb-4">
                Platform bu Sözleşme&apos;yi dilediği zaman güncelleyebilir. Önemli değişiklikler
                yürürlük tarihinden en az 30 gün önce kayıtlı e-posta adresinize bildirilir
                ve güncellenmiş sürüm platform üzerinde yayınlanır.
              </p>
              <p>
                Bildirim sonrasında platformu kullanmaya devam etmek, güncellenmiş Sözleşme&apos;yi
                kabul ettiğiniz anlamına gelir. Değişiklikleri kabul etmiyorsanız hesabınızı
                kapatmanız gerekmektedir.
              </p>
            </section>

            <section id="bolum-14">
              <h2 className="text-base font-bold text-text-primary mb-4">14. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
              <p className="mb-4">
                Bu Sözleşme, Türkiye Cumhuriyeti hukukuna tabidir. Sözleşmeden doğabilecek
                uyuşmazlıklarda İzmir Mahkemeleri ve İcra Daireleri yetkilidir.
              </p>
              <p>
                Uyuşmazlıkların çözümünde öncelikle müzakere ve arabuluculuk yolları
                denenir. Yasal yollara başvurmadan önce destek@lalabits.art adresine
                yazılı bildirim yapılması beklenir.
              </p>
            </section>

            <section id="bolum-15">
              <h2 className="text-base font-bold text-text-primary mb-4">15. İletişim</h2>
              <p className="mb-4">
                Bu Sözleşme kapsamındaki sorularınız, itirazlarınız veya bildirimleriniz için:
              </p>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <p className="font-semibold text-text-primary mb-2">Noesis Social / Burak OHRİLİ</p>
                <p>Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir</p>
                <p className="mt-2">
                  E-posta:{' '}
                  <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                    destek@lalabits.art
                  </a>
                </p>
              </div>
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
