import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Topluluk Kuralları | lalabits.art',
  description:
    'lalabits.art topluluk kuralları. Üreticiler ve destekçiler için platform davranış standartları.',
};

const bolumler = [
  'Neden Kurallar Var?',
  'Üreticiler İçin Kurallar',
  'Destekçiler İçin Kurallar',
  'Yorumlar ve Mesajlar',
  'Yasak Davranışlar',
  'Kural İhlali Sonuçları',
  'Topluluk Değerleri',
  'Güncelleme',
];

export default function ToplulukKuralariPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Topluluk Kuralları</h1>
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
                lalabits.art, üreticilerin yaratıcı emeğini destekçileriyle buluşturduğu
                güvenli bir platformdur. Bu kurallar, her iki tarafın da sağlıklı ve saygılı
                bir ortamda deneyim yaşaması için oluşturulmuştur.
              </p>
            </div>

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. Neden Kurallar Var?</h2>
              <p className="mb-4">
                Kurallarımız üç temel hedef taşır:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Güven:</strong> Üreticilerin ve destekçilerin birbirlerine güvenebileceği bir ortam</li>
                <li><strong>Adalet:</strong> Her kullanıcıya eşit muamele</li>
                <li><strong>Sürdürülebilirlik:</strong> Platformun uzun vadeli sağlıklı işleyişi</li>
              </ul>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. Üreticiler İçin Kurallar</h2>
              <p className="mb-4 font-semibold text-text-primary">Yapabilirsiniz:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Kendi özgün içeriklerinizi yayımlayabilirsiniz</li>
                <li>Birden fazla üyelik planı ve fiyat seviyesi oluşturabilirsiniz</li>
                <li>Destekçilerinizle mesaj yoluyla iletişim kurabilirsiniz</li>
                <li>İçerik takvimizi ve yayın sıklığınızı kendiniz belirleyebilirsiniz</li>
              </ul>
              <p className="mb-4 font-semibold text-text-primary">Yapmamalısınız:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Üyelere vaat ettiğiniz içerikleri uzun süre yayımlamamak</li>
                <li>Destekçi bilgilerini onay almadan üçüncü taraflarla paylaşmak</li>
                <li>Yanıltıcı içerik açıklamaları veya sahte tanıtım yapmak</li>
                <li>Platform dışı ödeme yöntemlerine yönlendirmek</li>
                <li><a href="/yasakli-icerik-politikasi" className="text-primary hover:underline">Yasaklı İçerik Politikası</a>&apos;nda belirtilen içerik türlerini yayımlamak</li>
              </ul>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Destekçiler İçin Kurallar</h2>
              <p className="mb-4 font-semibold text-text-primary">Yapabilirsiniz:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Birden fazla üreticiye aynı anda destek verebilirsiniz</li>
                <li>Aboneliğinizi istediğiniz zaman iptal edebilirsiniz</li>
                <li>İçerik veya hesap sorunlarını bize bildirebilirsiniz</li>
                <li>Satın aldığınız dijital ürünleri kişisel kullanım için indirebilirsiniz</li>
              </ul>
              <p className="mb-4 font-semibold text-text-primary">Yapmamalısınız:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Satın alınan içerikleri başkalarıyla paylaşmak veya yeniden satmak</li>
                <li>Üretici hesabını taklit etmek veya sahteciliğe girişmek</li>
                <li>Üreticilere taciz, tehdit veya hakaret içerikli mesaj göndermek</li>
                <li>Geri ödeme sahteciliği yapmak (chargeback kötüye kullanımı)</li>
              </ul>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Yorumlar ve Mesajlar</h2>
              <p className="mb-4">
                Platform üzerindeki tüm iletişimlerde aşağıdaki standartlar geçerlidir:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Saygılı ve yapıcı dil kullanın</li>
                <li>Kişisel bilgi (adres, telefon) paylaşmayın</li>
                <li>Spam veya tekrarlı reklamlı mesaj göndermekten kaçının</li>
                <li>Nefret söylemi veya ayrımcı ifadeler kullanmayın</li>
              </ul>
              <p>
                Rahatsız edici bir mesaj veya yorum aldıysanız &quot;Bildir&quot; butonunu
                kullanabilir ya da{' '}
                <a href="mailto:guvenlik@lalabits.art" className="text-primary hover:underline">
                  guvenlik@lalabits.art
                </a>
                {' '}adresine yazabilirsiniz.
              </p>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Yasak Davranışlar</h2>
              <p className="mb-4">
                Aşağıdaki davranışlar platformda <strong>kesinlikle yasaktır:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Başkasının hesabını ele geçirmeye çalışmak</li>
                <li>Otomatik bot veya script ile içerik indirme</li>
                <li>Platform güvenlik açıklarını kötüye kullanmak</li>
                <li>Sahte üretici hesabı açmak</li>
                <li>Birden fazla hesapla kuralları ihlal etmek (çoklu hesap yasağı çevresini aşma)</li>
                <li>Başka kullanıcıları manipüle etmek veya baskı uygulamak</li>
              </ul>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. Kural İhlali Sonuçları</h2>
              <p className="mb-4">
                Kural ihlalleri ağırlığına göre değerlendirilir:
              </p>
              <div className="rounded-[16px] border border-border overflow-hidden">
                {[
                  ['Hafif ihlal', 'Uyarı mesajı; içerik kaldırılabilir'],
                  ['Orta ihlal', 'Hesap geçici olarak kısıtlanır (7–30 gün)'],
                  ['Ağır ihlal', 'Hesap kalıcı olarak kapatılır'],
                  ['Suç teşkil eden davranış', 'Yetkili makamlara bildirim yapılır'],
                ].map(([agirlik, sonuc], i, arr) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 px-5 py-3 ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="w-44 flex-shrink-0 font-semibold text-text-primary">{agirlik}</span>
                    <span>{sonuc}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                Ayrıntılar için{' '}
                <a href="/moderasyon-politikasi" className="text-primary hover:underline">Moderasyon Politikası</a>
                {' '}sayfamızı inceleyiniz.
              </p>
            </section>

            <section id="bolum-7">
              <h2 className="text-base font-bold text-text-primary mb-4">7. Topluluk Değerleri</h2>
              <p className="mb-4">
                lalabits.art olarak şu değerlere inanıyoruz:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ['Yaratıcılık', 'Üreticilerin özgün sesini destekliyoruz'],
                  ['Saygı', 'Her kullanıcıya eşit saygı gösteriyoruz'],
                  ['Şeffaflık', 'Kararlarımızı açık ve gerekçeli biçimde paylaşıyoruz'],
                  ['Güvenlik', 'Kullanıcı verilerini ve mahremiyetini koruyoruz'],
                ].map(([deger, aciklama]) => (
                  <div key={deger} className="rounded-[12px] border border-border p-4">
                    <p className="font-semibold text-text-primary mb-1">{deger}</p>
                    <p className="text-xs text-text-muted">{aciklama}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="bolum-8">
              <h2 className="text-base font-bold text-text-primary mb-4">8. Güncelleme</h2>
              <p className="mb-4">
                Bu kurallar zaman zaman güncellenebilir. Önemli değişiklikler e-posta
                yoluyla bildirilir. Platforma devam etmek, güncel kuralları kabul etmek
                anlamına gelir.
              </p>
              <div className="rounded-[16px] bg-teal-light border border-teal/10 px-6 py-5">
                <p className="font-semibold text-text-primary mb-1">Soru veya Bildirim</p>
                <p>
                  E-posta:{' '}
                  <a href="mailto:guvenlik@lalabits.art" className="text-primary hover:underline">
                    guvenlik@lalabits.art
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
