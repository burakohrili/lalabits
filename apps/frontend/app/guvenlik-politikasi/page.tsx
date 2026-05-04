import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Güvenlik Politikası | lalabits.art',
  description:
    'lalabits.art ödeme güvenliği, SSL şifreleme, 3D Secure ve kart verisi politikası.',
};

const bolumler = [
  'SSL Şifreleme',
  '3D Secure',
  'Kart Verisi Güvenliği',
  'Hesap Güvenliği',
  'Güvenlik Açığı Bildirimi',
  'İletişim',
];

export default function GuvenlikPolitikasiPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-[32px] font-bold text-text-primary mb-2">Güvenlik Politikası</h1>
          <div className="flex gap-6 text-xs text-text-muted">
            <span>Ödeme ve veri güvenliği</span>
            <span>Yürürlük: Ocak 2025</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex gap-12 items-start">
          <article className="flex-1 min-w-0 space-y-10 text-sm text-text-secondary leading-[1.8]">

            <section id="bolum-1">
              <h2 className="text-base font-bold text-text-primary mb-4">1. SSL Şifreleme</h2>
              <p>
                lalabits.art, tüm sayfalarda 256-bit SSL (Secure Socket Layer) şifreleme kullanmaktadır.
                Tarayıcı adres çubuğundaki kilit simgesi ve <strong>https://</strong> öneki,
                bağlantınızın şifreli olduğunu gösterir.
              </p>
              <p className="mt-3">
                Kullanıcı adı, şifre ve ödeme bilgileri dahil tüm veriler, sunucumuz ile
                tarayıcınız arasında şifreli olarak iletilir. Açık metin aktarımı yapılmaz.
              </p>
            </section>

            <section id="bolum-2">
              <h2 className="text-base font-bold text-text-primary mb-4">2. 3D Secure</h2>
              <p>
                Platforma entegre tüm kredi ve banka kartı işlemleri, kartı veren kuruluşun
                doğrulama sistemi olan <strong>3D Secure</strong> ile güvence altına alınmaktadır.
                Ödeme adımında kart sahibinin kimliği; SMS doğrulama kodu veya banka mobil uygulaması
                üzerinden ayrıca onaylanır.
              </p>
              <p className="mt-3">
                3D Secure, kart sahibi onayı olmadan gerçekleştirilen yetkisiz işlemlere karşı
                ek koruma sağlar ve kartı veren bankanın sorumluluk güvencesine tabidir.
              </p>
            </section>

            <section id="bolum-3">
              <h2 className="text-base font-bold text-text-primary mb-4">3. Kart Verisi Güvenliği</h2>
              <p>
                lalabits.art, kart numarası (PAN), son kullanma tarihi veya CVV gibi hassas kart
                bilgilerini <strong>kendi sunucularında saklamaz</strong>. Ödeme işlemleri, BDDK
                lisanslı ve PCI-DSS sertifikalı ödeme altyapısı sağlayıcıları üzerinden yürütülür.
              </p>
              <p className="mt-3">
                Tekrarlı abonelik ödemelerinde kart tokenizasyonu, ödeme sağlayıcısının güvenli
                kasasında tutulur; lalabits.art bu token dışında kart bilgisine erişemez.
              </p>
            </section>

            <section id="bolum-4">
              <h2 className="text-base font-bold text-text-primary mb-4">4. Hesap Güvenliği</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Şifreler, bcrypt algoritmasıyla hashlenerek saklanır; asla düz metin olarak tutulmaz.</li>
                <li>Oturum jetonları (JWT) sınırlı geçerlilik süresiyle üretilir ve yenileme mekanizmasına tabidir.</li>
                <li>Şüpheli giriş denemelerinde otomatik kısıtlama (rate limiting) uygulanır.</li>
                <li>Kullanıcılar, hesap şifrelerini istedikleri zaman <Link href="/hesabim/sifre" className="text-teal hover:underline">Hesabım &gt; Şifre Değiştir</Link> bölümünden güncelleyebilir.</li>
              </ul>
            </section>

            <section id="bolum-5">
              <h2 className="text-base font-bold text-text-primary mb-4">5. Güvenlik Açığı Bildirimi</h2>
              <p>
                Platformda bir güvenlik açığı keşfettiyseniz lütfen bunu kamuoyuyla paylaşmadan
                önce <a href="mailto:guvenlik@lalabits.art" className="text-teal hover:underline">guvenlik@lalabits.art</a> adresine bildirin.
                Sorumlu açıklama (responsible disclosure) ilkesine uygun bildirimlere en kısa sürede
                yanıt verilecektir.
              </p>
            </section>

            <section id="bolum-6">
              <h2 className="text-base font-bold text-text-primary mb-4">6. İletişim</h2>
              <p>
                Güvenlik politikasına ilişkin sorularınız için{' '}
                <a href="mailto:destek@lalabits.art" className="text-teal hover:underline">destek@lalabits.art</a>{' '}
                adresine yazabilirsiniz.
              </p>
            </section>

          </article>

          {/* Bölüm navigasyonu */}
          <aside className="hidden lg:block w-52 shrink-0 sticky top-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">Bu Sayfada</p>
            <nav className="flex flex-col gap-1.5">
              {bolumler.map((b, i) => (
                <a
                  key={b}
                  href={`#bolum-${i + 1}`}
                  className="text-sm text-text-secondary hover:text-teal transition-colors"
                >
                  {i + 1}. {b}
                </a>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-2">
              <Link href="/gizlilik" className="text-xs text-text-muted hover:text-teal transition-colors">Gizlilik Politikası</Link>
              <Link href="/kvkk" className="text-xs text-text-muted hover:text-teal transition-colors">KVKK</Link>
              <Link href="/kullanim-sartlari" className="text-xs text-text-muted hover:text-teal transition-colors">Kullanım Şartları</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
