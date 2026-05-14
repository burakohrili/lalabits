import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Telif Hakkı Şikâyeti | lalabits.art',
  description:
    'lalabits.art telif hakkı ihlali bildirimi. 5846 sayılı FSEK kapsamında içerik kaldırma talebi nasıl yapılır.',
};

const bolumler = [
  'Genel Bilgi',
  'Şikâyet Başvurusu',
  'Gerekli Bilgiler',
  'Değerlendirme Süreci',
  'Karşı İtiraz Hakkı',
  'Tekrarlı İhlaller',
  'Kötüye Kullanım',
  'İletişim',
];

export default function TelifSikayetiPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Telif Hakkı Şikâyeti</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Son güncelleme: Ocak 2025</span>
            <span>5846 sayılı FSEK kapsamında</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-4">
              <p className="text-sm text-text-primary">
                lalabits.art, 5846 sayılı Fikir ve Sanat Eserleri Kanunu ve Türkiye&apos;nin
                uluslararası anlaşmalar kapsamındaki yükümlülükleri uyarınca telif hakkı
                şikâyetlerini ciddiye alır ve gerekli işlemleri zamanında gerçekleştirir.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Genel Bilgi</h2>
              <p className="mb-4">
                Eserinizin izniniz olmaksızın lalabits.art&apos;ta yayımlandığını düşünüyorsanız,
                bu sayfadaki prosedürü takip ederek içerik kaldırma talebinde bulunabilirsiniz.
              </p>
              <p className="mb-4">
                Şikâyet başvurusu yapmadan önce lütfen aşağıdakileri göz önünde bulundurun:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Yalnızca hak sahibi veya yetkili temsilcileri başvuru yapabilir</li>
                <li>Yanlış veya asılsız şikâyet hukuki sorumluluğa yol açabilir</li>
                <li>Alıntı, eğitim veya eleştiri amaçlı kullanım yasal sayılabilir</li>
              </ul>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Şikâyet Başvurusu</h2>
              <p className="mb-4">
                Telif hakkı şikâyetlerinizi aşağıdaki adrese iletiniz:
              </p>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5 mb-4">
                <p className="font-semibold text-text-primary mb-1">Telif Hakkı Bildirimi</p>
                <p>
                  E-posta:{' '}
                  <a href="mailto:telif@lalabits.art" className="text-primary hover:underline">
                    telif@lalabits.art
                  </a>
                </p>
                <p className="mt-1">Konu: &quot;Telif Şikâyeti — [ihlal edilen eser adı]&quot;</p>
              </div>
              <p>
                Posta yoluyla da başvuru yapılabilir; posta adresi için{' '}
                <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                  destek@lalabits.art
                </a>
                {' '}adresine sorabilirsiniz.
              </p>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Gerekli Bilgiler</h2>
              <p className="mb-4">
                Başvurunuzun geçerli sayılması için aşağıdaki bilgilerin eksiksiz sunulması
                zorunludur:
              </p>
              <ol className="list-decimal list-inside space-y-3 mb-4">
                <li>
                  <strong>Hak sahibi bilgisi:</strong> Tam ad, iletişim bilgileri ve hak sahipliğini
                  kanıtlayan bilgi (eser tescil belgesi, sözleşme vb.)
                </li>
                <li>
                  <strong>Korunan eser tanımı:</strong> Şikâyete konu eserinizin açık tanımı ve
                  varsa özgün URL&apos;si
                </li>
                <li>
                  <strong>İhlal edilen içerik URL&apos;si:</strong> lalabits.art üzerindeki ihlal
                  içeren sayfanın tam adresi
                </li>
                <li>
                  <strong>İhlal açıklaması:</strong> Eserin nasıl ihlal edildiğine dair kısa açıklama
                </li>
                <li>
                  <strong>İyi niyet beyanı:</strong> &quot;Söz konusu kullanımın telif hakkı sahibi,
                  temsilcisi veya kanun tarafından yetkilendirilmediğine inanıyorum.&quot; ifadesini içermelidir
                </li>
                <li>
                  <strong>Doğruluk beyanı:</strong> &quot;Bu bildirimdeki bilgilerin doğru olduğunu
                  ve hak sahibi adına hareket etmeye yetkili olduğumu beyan ederim.&quot;
                </li>
                <li>
                  <strong>İmza:</strong> Elektronik veya fiziksel imza
                </li>
              </ol>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Değerlendirme Süreci</h2>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Başvuru alındı', 'Anında otomatik onay e-postası gönderilir'],
                  ['Ön inceleme', '2 iş günü içinde tamamlanır'],
                  ['İçerik kaldırma / erişim engeli', 'Geçerli başvurularda 5 iş günü içinde'],
                  ['Üreticiye bildirim', 'İçerik kaldırılmadan önce üretici bilgilendirilir'],
                  ['Karar bildirimi', 'Başvuru sahibi e-posta ile bilgilendirilir'],
                ].map(([adim, detay], i, arr) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-48 flex-shrink-0 font-semibold text-text-primary">{adim}</span>
                    <span>{detay}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Karşı İtiraz Hakkı</h2>
              <p className="mb-4">
                İçeriği kaldırılan üretici, kaldırma kararına itiraz edebilir. İtiraz bildiriminde
                şunlar yer almalıdır:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>İçeriği yayımlama hakkına sahip olduğuna ilişkin gerekçe</li>
                <li>İçeriğin kanun veya izin çerçevesinde kullanıldığına dair açıklama</li>
                <li>İletişim bilgileri</li>
                <li>İyi niyet beyanı</li>
              </ul>
              <p>
                Karşı itiraz e-posta yoluyla yapılır:{' '}
                <a href="mailto:telif@lalabits.art" className="text-primary hover:underline">
                  telif@lalabits.art
                </a>
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Tekrarlı İhlaller</h2>
              <p className="mb-4">
                Birden fazla geçerli telif hakkı şikâyetine konu olan üreticilerin hesabı
                uyarı → geçici askı → kalıcı kapatma basamaklarıyla işleme alınır.
              </p>
              <p>
                Platform, aynı içeriği tekrar yükleyen veya sistematik ihlal sergileyen
                üreticiler için hızlandırılmış hesap kapatma prosedürü uygular.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Kötüye Kullanım</h2>
              <p className="mb-4">
                Gerçeğe aykırı veya kötü niyetle yapılan telif hakkı bildirimleri hukuki
                sorumluluk doğurabilir. Asılsız bildirimler reddedilir ve tekrarlı
                asılsız bildirimlerde başvuru sahibinin erişimi kısıtlanabilir.
              </p>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. İletişim</h2>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <p className="font-semibold text-text-primary mb-1">Telif ve Hukuk Birimi</p>
                <p>
                  E-posta:{' '}
                  <a href="mailto:telif@lalabits.art" className="text-primary hover:underline">
                    telif@lalabits.art
                  </a>
                </p>
                <p className="mt-1">
                  Genel destek:{' '}
                  <a href="mailto:destek@lalabits.art" className="text-primary hover:underline">
                    destek@lalabits.art
                  </a>
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  Yanıt süresi: 2 iş günü (Pazartesi–Cuma, 09:00–18:00 TSİ)
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
