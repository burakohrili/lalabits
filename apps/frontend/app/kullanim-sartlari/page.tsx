import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Şartları | lalabits.art',
  description:
    'lalabits.art kullanım şartları ve koşulları. Platform kullanımına ilişkin hak ve yükümlülükler.',
};

const bolumler = [
  'Taraflar ve Kapsam',
  'Kullanıcı Türleri ve Tanımlar',
  'Kayıt ve Hesap',
  'Üretici Yükümlülükleri',
  'Destekçi ve Takipçi Yükümlülükleri',
  'Komisyon ve Fiyatlandırma',
  'Fikri Mülkiyet',
  'İade Politikası',
  'Hesap Askıya Alma ve Kapatma',
  'Sorumluluk Sınırlaması',
  'Uygulanacak Hukuk ve Yetkili Mahkeme',
  'İletişim',
];

export default function KullanimSartlariPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Kullanım Şartları</h1>
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

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Taraflar ve Kapsam</h2>
              <p className="mb-4">
                Bu Kullanım Şartları (&quot;Şartlar&quot;), lalabits.art platformunu işleten
                Noesis Social / Burak OHRİLİ (&quot;Şirket&quot;) ile platformu kullanan
                gerçek veya tüzel kişiler (&quot;Kullanıcı&quot;) arasındaki ilişkiyi düzenler.
              </p>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <p className="font-semibold text-text-primary mb-2">Şirket bilgileri:</p>
                <p>Noesis Social / Burak OHRİLİ</p>
                <p>Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir</p>
                <p>Ege Vergi Dairesi | VKN: 35509755908</p>
              </div>
              <p className="mt-4">
                Platformu kullanarak bu Şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.
              </p>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Kullanıcı Türleri ve Tanımlar</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Üretici', 'Platformda içerik yayınlayan ve gelir elde eden kullanıcı.'],
                  ['Destekçi', 'Üreticileri ücretli üyelikle destekleyen kullanıcı.'],
                  ['Takipçi', 'Üreticileri ücretsiz olarak takip eden kullanıcı.'],
                  ['Kademe', 'Üreticinin belirlediği üyelik seviyesi ve fiyatı.'],
                  ['İçerik', 'Üreticinin platforma yüklediği her türlü materyal.'],
                ].map(([terim, tanim], i) => (
                  <div
                    key={terim}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== 4 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-24 flex-shrink-0 font-semibold text-text-primary">{terim}</span>
                    <span>{tanim}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Kayıt ve Hesap</h2>
              <ul className="space-y-2">
                {[
                  'Platforma kayıt için 18 yaşını doldurmuş olmak gerekir.',
                  'Kayıt sırasında verilen bilgiler doğru ve güncel olmalıdır.',
                  'Hesap güvenliğinden kullanıcı sorumludur.',
                  'Şüpheli aktivitede derhal iletisim@lalabits.art bildirilmelidir.',
                ].map((madde, i) => (
                  <li key={madde} className="flex items-start gap-2">
                    <span className="text-teal font-semibold flex-shrink-0">3.{i + 1}</span>
                    {madde}
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Üretici Yükümlülükleri</h2>
              <ul className="space-y-2">
                {[
                  'Yayınlanan tüm içerik Türkiye Cumhuriyeti yasalarına uygun olmalıdır.',
                  'Telif hakkı ihlali içeren materyal kesinlikle yayınlanamaz.',
                  'Nefret söylemi, şiddet içeren ve pornografik içerik yasaktır.',
                  'Yanıltıcı, aldatıcı veya sahte içerik yayınlanamaz.',
                  'Üreticiler kendi vergi yükümlülüklerinden tamamen sorumludur.',
                  'IBAN ve kimlik bilgileri doğru ve güncel tutulmalıdır.',
                  'Destekçilere vaat edilen kademelerdeki içerik sunulmalıdır.',
                ].map((madde, i) => (
                  <li key={madde} className="flex items-start gap-2">
                    <span className="text-teal font-semibold flex-shrink-0">4.{i + 1}</span>
                    {madde}
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Destekçi ve Takipçi Yükümlülükleri</h2>
              <ul className="space-y-2">
                {[
                  'Ödeme bilgileri doğru ve kendi adına olmalıdır.',
                  'Erişilen içerik, üçüncü taraflarla paylaşılamaz.',
                  'İptal, istedikleri zaman yapılabilir. İptal, ilgili ödeme döneminin sonuna kadar erişimi korur.',
                  'İade politikası için Madde 8\'e bakınız.',
                ].map((madde, i) => (
                  <li key={madde} className="flex items-start gap-2">
                    <span className="text-teal font-semibold flex-shrink-0">5.{i + 1}</span>
                    {madde}
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Komisyon ve Fiyatlandırma</h2>
              <p className="mb-4">
                Platform, üretici kazancından aşağıdaki komisyon oranlarını keser:
              </p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Başlangıç planı', '%8'],
                  ['Pro planı', '%6'],
                  ['Kurumsal plan', '%4'],
                ].map(([plan, oran], i) => (
                  <div
                    key={plan}
                    className={`flex items-center justify-between px-5 py-3 ${i !== 2 ? 'border-b border-border' : ''}`}
                  >
                    <span className="font-medium text-text-primary">{plan}</span>
                    <span className="font-bold text-teal">{oran}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                Ödeme işlem ücretleri ayrıca uygulanabilir.
                Güncel oran tablosu için{' '}
                <a href="/fiyatlar" className="text-teal hover:underline">/fiyatlar</a>{' '}
                sayfasına bakınız.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Fikri Mülkiyet</h2>
              <ul className="space-y-2">
                {[
                  'Üreticiler, platformda yayınladıkları içeriklerin telif hakkını elinde tutar.',
                  'Üreticiler, içeriklerini platformda gösterme ve dağıtma lisansını lalabits\'e vermektedir.',
                  'lalabits logosu, adı ve görsel kimliği Noesis Social\'a aittir. İzinsiz kullanılamaz.',
                ].map((madde, i) => (
                  <li key={madde} className="flex items-start gap-2">
                    <span className="text-teal font-semibold flex-shrink-0">7.{i + 1}</span>
                    {madde}
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. İade Politikası</h2>
              <ul className="space-y-2">
                {[
                  'Üyelik ücretleri kural olarak iade edilmez.',
                  'Teknik hata veya çifte tahsilat durumunda tam iade yapılır.',
                  'İade talebi için destek@lalabits.art adresine başvurulur. Talepler 5 iş günü içinde değerlendirilir.',
                ].map((madde, i) => (
                  <li key={madde} className="flex items-start gap-2">
                    <span className="text-teal font-semibold flex-shrink-0">8.{i + 1}</span>
                    {madde}
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-9">
              <h2 className="text-base font-bold text-text-primary mb-4">9. Hesap Askıya Alma ve Kapatma</h2>
              <p className="mb-4">
                Şirket, aşağıdaki durumlarda hesabı önceden bildirim yapmaksızın
                askıya alabilir veya kapatabilir:
              </p>
              <ul className="space-y-2">
                {[
                  'Bu Şartlar\'ın ihlali',
                  'Yasadışı faaliyet tespiti',
                  'Sahte hesap veya kimlik bilgisi',
                  'Üçüncü taraf haklarının ihlali',
                ].map((madde, i) => (
                  <li key={madde} className="flex items-start gap-2">
                    <span className="text-teal font-semibold flex-shrink-0">{String.fromCharCode(96 + i + 1)})</span>
                    {madde}
                  </li>
                ))}
              </ul>
            </section>

            <section id="bolum-10">
              <h2 className="text-base font-bold text-text-primary mb-4">10. Sorumluluk Sınırlaması</h2>
              <p className="mb-3">
                lalabits, üreticilerin yayınladığı içeriklerden sorumlu değildir.
              </p>
              <p>
                Platform, teknik kesintiler nedeniyle oluşan doğrudan olmayan
                zararlardan sorumlu tutulamaz.
              </p>
            </section>

            <section id="bolum-11">
              <h2 className="text-base font-bold text-text-primary mb-4">11. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
              <p className="mb-3">Bu Şartlar Türkiye Cumhuriyeti hukukuna tabidir.</p>
              <p>Uyuşmazlıklarda İzmir Mahkemeleri ve İcra Daireleri yetkilidir.</p>
            </section>

            <section id="bolum-12">
              <h2 className="text-base font-bold text-text-primary mb-4">12. İletişim</h2>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5 space-y-1">
                <p>
                  <a href="mailto:iletisim@lalabits.art" className="text-teal hover:underline font-medium">
                    iletisim@lalabits.art
                  </a>
                </p>
                <p>0532 744 94 34</p>
                <p>Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir</p>
              </div>
            </section>
          </article>

          {/* Sticky TOC */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 rounded-[16px] border border-border bg-white p-5">
              <p className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">İçindekiler</p>
              <ol className="space-y-2.5">
                {bolumler.map((baslik, i) => (
                  <li key={baslik}>
                    <a
                      href={`#bolum-${i + 1}`}
                      className="text-xs text-text-secondary hover:text-teal transition-colors leading-[1.5] block"
                    >
                      {i + 1}. {baslik}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
