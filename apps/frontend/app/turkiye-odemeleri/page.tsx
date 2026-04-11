import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Türkiye Ödemeleri | lalabits.art',
  description:
    'lalabits ile Türk lirası üzerinden kazan. IBAN, Türk banka kartı ve yerel ödeme yöntemleriyle destekçilerinden doğrudan tahsilat yap.',
  keywords:
    'türk lirası creator ödeme, iban üretici tahsilat, türk banka kartı içerik geliri, türkiye ödeme platformu',
};

const sss = [
  {
    soru: 'Yurt dışı kart ile destekçi olunabilir mi?',
    cevap: 'Evet. Destekçi tarafında uluslararası kart kabul edilir.',
  },
  {
    soru: 'Tahsilatımı TRY dışında alabilir miyim?',
    cevap: 'Şu an yalnızca Türk lirası destekleniyor.',
  },
  {
    soru: 'Ödeme transferim gecikirse?',
    cevap: 'destek@lalabits.art adresine yaz. 3 iş günü içinde geri dönüş garantisi.',
  },
  {
    soru: 'Komisyon ne zaman kesilir?',
    cevap:
      'Brüt tahsilattan hemen sonra net tutar hesaplanır. IBAN\'ına gelen tutar komisyon düşülmüş halidir.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: sss.map((s) => ({
    '@type': 'Question',
    name: s.soru,
    acceptedAnswer: { '@type': 'Answer', text: s.cevap },
  })),
};

export default function TurkiyeOdemeelriPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="bg-background min-h-screen">
        {/* Hero */}
        <section className="bg-white border-b border-border py-24 text-center">
          <div className="mx-auto max-w-3xl px-6">
            <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.02em] text-text-primary mb-6 leading-[1.15]">
              Türkiye&apos;de Üret,
              <br />
              <span className="text-teal">Türkiye&apos;den Kazan</span>
            </h1>
            <p className="text-lg text-text-secondary leading-[1.7] max-w-2xl mx-auto">
              Döviz çevirme yok. Uluslararası transfer ücreti yok.
              Para kaybı yok. Türk lirası, Türk bankası, Türk hukuku.
              Kazancın doğrudan IBAN&apos;ına.
            </p>
          </div>
        </section>

        {/* Tahsilat Yöntemleri */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-[28px] font-bold text-text-primary mb-10 text-center">
              Destekçiler Nasıl Ödüyor?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  baslik: 'Türk Banka Kartı',
                  metin:
                    'Tüm Türk bankaları desteklenir. Visa, Mastercard, Troy. Taksitli ödeme seçeneği mevcut.',
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  ),
                  badge: null,
                },
                {
                  baslik: 'Kredi Kartı',
                  metin:
                    'Bireysel ve kurumsal kredi kartları. Otomatik yenileme ile sorunsuz abonelik.',
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" />
                      <path d="M1 10h22M7 15h2m5 0h4" />
                    </svg>
                  ),
                  badge: null,
                },
                {
                  baslik: 'Havale / EFT',
                  metin:
                    'Destekçi banka havalesiyle ödeyebilir. Otomatik abonelik için kart gereklidir.',
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 1l4 4-4 4" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <path d="M7 23l-4-4 4-4" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                  ),
                  badge: null,
                },
                {
                  baslik: 'Papara',
                  metin: 'Papara entegrasyonu geliyor. Bildirimlere abone ol.',
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  ),
                  badge: 'Yakında',
                },
              ].map((kart) => (
                <div key={kart.baslik} className="rounded-[20px] bg-white border border-border p-7 relative">
                  {kart.badge && (
                    <span className="absolute top-4 right-4 rounded-full bg-orange-light text-orange text-[11px] font-semibold px-2.5 py-0.5">
                      {kart.badge}
                    </span>
                  )}
                  <div className="w-11 h-11 rounded-full bg-teal-light text-teal flex items-center justify-center mb-5">
                    {kart.ikon}
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-3">{kart.baslik}</h3>
                  <p className="text-sm text-text-secondary leading-[1.7]">{kart.metin}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ödeme Takvimi */}
        <section className="py-20 bg-teal-light">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-[28px] font-bold text-text-primary mb-10 text-center">
              Kazancın Ne Zaman Gelir?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
              {[
                { tarih: 'Ayın 15\'i', adim: 'Tahsilat dönemi kapanır' },
                { tarih: 'Ayın 20\'si', adim: 'Net tutarlar hesaplanır' },
                { tarih: 'Ayın 25\'i', adim: 'IBAN\'ına transfer başlar' },
                { tarih: '3–5 iş günü', adim: 'Hesabında görünür' },
              ].map((item, i) => (
                <div key={item.tarih} className="relative">
                  <div className="rounded-[16px] bg-white border border-teal/10 p-5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal text-white text-sm font-bold mb-3">
                      {i + 1}
                    </span>
                    <p className="text-sm font-bold text-teal mb-1">{item.tarih}</p>
                    <p className="text-xs text-text-secondary">{item.adim}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden sm:block absolute top-1/2 -right-2 w-4 text-teal text-center text-lg leading-none z-10">→</div>
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-[16px] bg-white border border-teal/10 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-text-muted mb-1">Minimum çekim</p>
                  <p className="text-lg font-bold text-text-primary">₺100</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Maksimum</p>
                  <p className="text-lg font-bold text-text-primary">Sınır yok</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Ödeme yöntemi</p>
                  <p className="text-lg font-bold text-text-primary">IBAN</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vergi ve Fatura */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-[28px] font-bold text-text-primary mb-8 text-center">Vergi ve Fatura</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  baslik: 'Platform',
                  metin: 'lalabits, Türk vergi mevzuatına uygun faaliyet gösterir. Platform KDV dahil fatura düzenler.',
                },
                {
                  baslik: 'Serbest Çalışan',
                  metin: 'Makbuz veya serbest meslek makbuzu yeterlidir.',
                },
                {
                  baslik: 'Şirketli Üretici',
                  metin: 'Fatura kesilir, KDV iade sürecine dahil edilebilir.',
                },
              ].map((item) => (
                <div key={item.baslik} className="rounded-[16px] bg-white border border-border p-6">
                  <h3 className="text-sm font-bold text-text-primary mb-3">{item.baslik}</h3>
                  <p className="text-sm text-text-secondary leading-[1.7]">{item.metin}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-text-muted text-center">
              Kendi vergi yükümlülüklerin için mali müşavirinize danışın. lalabits vergi danışmanlığı hizmeti vermez.
            </p>
          </div>
        </section>

        {/* Güvenlik */}
        <section className="py-20 bg-[#1a1a1a]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-[28px] font-bold text-white mb-10 text-center">Ödeme Güvenliği</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'SSL/TLS şifreleme — tüm işlemler şifrelidir',
                'PCI DSS uyumlu ödeme altyapısı',
                'Kart bilgileri lalabits sunucularında saklanmaz',
                '3D Secure zorunlu doğrulama',
                'KVKK uyumlu veri işleme',
              ].map((madde) => (
                <div key={madde} className="flex items-center gap-3 rounded-[16px] bg-white/5 border border-white/10 px-5 py-4">
                  <span className="w-5 h-5 rounded-full bg-teal text-white text-xs flex items-center justify-center font-bold flex-shrink-0">✓</span>
                  <p className="text-sm text-white/80">{madde}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SSS */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-[28px] font-bold text-text-primary mb-8">Ödeme SSS</h2>
            <div className="space-y-4">
              {sss.map((item) => (
                <details key={item.soru} className="group rounded-[16px] border border-border bg-white overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 text-sm font-semibold text-text-primary list-none">
                    {item.soru}
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-light text-teal text-xs flex items-center justify-center group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-text-secondary leading-[1.7]">
                    {item.cevap}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-teal-light text-center">
          <div className="mx-auto max-w-2xl px-6">
            <p className="text-base text-text-secondary mb-6">Bugün başla, bu ay kazan.</p>
            <Link
              href="/kayit/uretici"
              className="inline-block rounded-xl bg-orange px-10 py-4 text-sm font-semibold text-white hover:bg-orange-dark transition-colors"
            >
              Üretici hesabı aç
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
