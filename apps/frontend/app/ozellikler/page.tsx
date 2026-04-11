import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Özellikler — lalabits.art",
  description:
    "lalabits.art'ın tüm özellikleri: üyelik sistemi, dijital mağaza, akış ve yazılar, topluluk sohbeti, analitik ve daha fazlası.",
};

const features = [
  {
    id: 'uyelik',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <path d="M16 4l2.5 7.5H26l-6.5 4.5 2.5 7.5L16 19l-6 4.5 2.5-7.5L6 11.5h7.5z" stroke="#008080" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    color: 'bg-teal-light border-teal/10',
    badge: 'Üyelik',
    badgeColor: 'text-teal',
    title: 'Kademeli Üyelik Sistemi',
    desc: 'Üreticiler birden fazla ücretli kademe oluşturabilir. Her kademede farklı içerik erişimi, farklı avantajlar. Destekçiler dilediği kademedeki üyeliğe abone olur, aylık veya yıllık ödeme seçer.',
    items: [
      'Sınırsız kademe oluşturma',
      'Aylık ve yıllık abonelik seçeneği',
      'Kademe bazlı içerik erişim kontrolü',
      'Otomatik yenileme ve iptal yönetimi',
      'Ücretsiz takip / ücretsiz üyelik desteği',
    ],
  },
  {
    id: 'magaza',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="20" rx="3" stroke="#FF5722" strokeWidth="1.5" />
        <path d="M11 8V6a5 5 0 0 1 10 0v2" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 16h10M11 20h6" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: 'bg-orange-light border-orange/10',
    badge: 'Mağaza',
    badgeColor: 'text-orange',
    title: 'Dijital Ürün Mağazası',
    desc: 'PDF, e-kitap, ses dosyası, video, şablon, kaynak paketi — her türde dijital ürünü listele ve sat. Tek seferlik satın alma veya üyelik kapsamında ücretsiz erişim seçenekleri sunabilirsin.',
    items: [
      'PDF, ZIP, ses, video, görsel dosya desteği',
      'Tek seferlik satış veya üyelik dahil seçeneği',
      'Güvenli dosya teslimi',
      'Satın alma sonrası otomatik erişim',
      'Ürün koleksiyonları oluşturma',
    ],
  },
  {
    id: 'akis',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="4" rx="2" fill="#008080" opacity="0.15" stroke="#008080" strokeWidth="1.5" />
        <rect x="4" y="14" width="24" height="4" rx="2" fill="#008080" opacity="0.10" stroke="#008080" strokeWidth="1.5" />
        <rect x="4" y="22" width="16" height="4" rx="2" fill="#008080" opacity="0.08" stroke="#008080" strokeWidth="1.5" />
      </svg>
    ),
    color: 'bg-teal-light border-teal/10',
    badge: 'Akış',
    badgeColor: 'text-teal',
    title: 'Akış ve Yazılar',
    desc: 'Herkese açık, üyelere özel veya belirli kademeye özel yazılar yayınla. Destekçilerin özel içeriklerine erişir, takipçiler ise herkese açık yazıları görebilir.',
    items: [
      'Zengin metin editörü',
      'Görsel, video, ses embed desteği',
      'Tier bazlı erişim kontrolü',
      'Zamanlanmış yayın',
      'Yorum ve beğeni sistemi',
    ],
  },
  {
    id: 'koleksiyonlar',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="11" height="11" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
        <rect x="17" y="4" width="11" height="11" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
        <rect x="4" y="17" width="11" height="11" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
        <rect x="17" y="17" width="11" height="11" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
      </svg>
    ),
    color: 'bg-violet-50 border-violet-100',
    badge: 'Koleksiyonlar',
    badgeColor: 'text-violet-600',
    title: 'İçerik Koleksiyonları',
    desc: 'Yazıları, dosyaları ve dijital ürünleri anlamlı koleksiyonlar halinde bir araya getir. Destekçiler koleksiyona tek bir ödeme ile erişebilir.',
    items: [
      'Yazı ve ürün karışımı koleksiyonlar',
      'Tek seferlik koleksiyon satışı',
      'Üyelik kapsamında ücretsiz erişim',
      'Sıralı veya serbest içerik düzeni',
    ],
  },
  {
    id: 'topluluk',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <path d="M8 20H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4l-8 6-8-6z" stroke="#008080" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 12h12M10 16h7" stroke="#008080" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: 'bg-teal-light border-teal/10',
    badge: 'Topluluk',
    badgeColor: 'text-teal',
    title: 'Topluluk Sohbeti',
    desc: 'Destekçilerinle gerçek zamanlı iletişim kur. Kademe bazlı özel sohbet kanalları oluştur. Premium destekçilerin için ayrı bir topluluk alanı sun.',
    items: [
      'Genel ve özel sohbet kanalları',
      'Kademe bazlı kanal erişimi',
      'Dosya ve görsel paylaşımı',
      'Birebir mesajlaşma',
      'Sohbet geçmişi',
    ],
  },
  {
    id: 'bildirimler',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <path d="M16 4a10 10 0 0 0-10 10v6l-2 4h24l-2-4v-6A10 10 0 0 0 16 4z" stroke="#FF5722" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 26a3 3 0 0 0 6 0" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: 'bg-orange-light border-orange/10',
    badge: 'Bildirimler',
    badgeColor: 'text-orange',
    title: 'Bildirimler',
    desc: 'Yeni destekçi, yorum, mesaj ve ödeme bildirimlerini anında al. Destekçilerine yeni içerik yayınladığında otomatik bildirim gider.',
    items: [
      'Gerçek zamanlı uygulama bildirimleri',
      'E-posta bildirimleri',
      'Yeni destekçi ve iptal bildirimleri',
      'Yeni içerik bildirimleri',
    ],
  },
];

export default function OzelliklerPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-border py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-block rounded-full bg-teal-light text-teal text-sm font-semibold px-4 py-1.5 mb-6">
            Platform Özellikleri
          </span>
          <h1 className="text-[36px] font-bold tracking-[-0.02em] text-text-primary sm:text-[48px] lg:text-[56px]">
            İçerik Üreticileri İçin
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #008080 0%, #FF5722 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Her Şey Hazır
            </span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto leading-[1.7]">
            Üyelik, dijital mağaza, akış, topluluk ve analitik — Türkiye'ye özel
            ödeme altyapısıyla tek platformda.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kayit/uretici"
              className="rounded-xl bg-orange px-8 py-4 text-base font-semibold text-white hover:bg-orange-dark transition-colors"
            >
              Üretici hesabı aç
            </Link>
            <Link
              href="/fiyatlar"
              className="rounded-xl border border-border px-8 py-4 text-base font-semibold text-text-primary hover:bg-teal-light hover:border-teal hover:text-teal transition-colors"
            >
              Fiyatları gör
            </Link>
          </div>
        </div>
      </section>

      {/* Özellik kartları */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f) => (
              <div
                key={f.id}
                id={f.id}
                className={`rounded-[20px] border p-8 ${f.color}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  {f.icon}
                  <span className={`text-xs font-semibold uppercase tracking-wider ${f.badgeColor}`}>
                    {f.badge}
                  </span>
                </div>
                <h2 className="text-[22px] font-bold text-text-primary mb-3">{f.title}</h2>
                <p className="text-base text-text-secondary leading-[1.7] mb-6">{f.desc}</p>
                <ul className="flex flex-col gap-2.5">
                  {f.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-light">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[28px] font-bold text-text-primary sm:text-[36px]">
            Bugün Başla, Yarın Kazan
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Ücretsiz kurulum — kredi kartı gerekmez.
          </p>
          <Link
            href="/kayit/uretici"
            className="mt-8 inline-block rounded-xl bg-orange px-10 py-4 text-base font-semibold text-white hover:bg-orange-dark transition-colors"
          >
            Üretici hesabı aç
          </Link>
        </div>
      </section>
    </main>
  );
}
