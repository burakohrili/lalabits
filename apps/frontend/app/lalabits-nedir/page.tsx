import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'lalabits Nedir? | Türkiye\'nin İçerik Üreticisi Platformu',
  description:
    'lalabits; Türkiye\'deki içerik üreticilerinin, destekçilerinden Türk lirası ile doğrudan gelir elde ettiği yerli üyelik platformudur. Tamamen Türkçe, KVKK uyumlu.',
  keywords:
    'lalabits nedir, içerik üreticisi platform türkiye, üyelik sistemi türkiye, destekçi platformu, türk lirası gelir',
};

const sss = [
  {
    soru: 'lalabits ücretsiz mi?',
    cevap:
      'Kayıt tamamen ücretsiz. Yalnızca kazandığında seçtiğin plana göre komisyon kesilir.',
  },
  {
    soru: 'Üretici olmak için kaç takipçim olmalı?',
    cevap: 'Hiç. Sıfır takipçiyle bugün başlayabilirsin.',
  },
  {
    soru: 'Destekçilerden ne zaman ödeme alırım?',
    cevap:
      'Her ayın 25\'inde IBAN\'ına transfer başlar. 3–5 iş günü içinde hesabında görünür.',
  },
  {
    soru: 'İstediğim zaman bırakabilir miyim?',
    cevap:
      'Evet. Hesabını dondurabilir ya da silebilirsin. Aktif destekçilerin üyeliği dönem sonunda kapanır.',
  },
  {
    soru: 'Türkiye dışından destekçi olunabilir mi?',
    cevap:
      'Evet. Destekçi tarafında konum sınırlaması yok. Üretici tarafı şu an Türkiye merkezli çalışıyor.',
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

export default function LalabitsnedirPage() {
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
            <span className="inline-block rounded-full bg-teal-light text-teal text-sm font-semibold px-4 py-1.5 mb-8">
              Platform Tanıtımı
            </span>
            <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.02em] text-text-primary mb-6 leading-[1.15]">
              lalabits Nedir?
            </h1>
            <p className="text-lg text-text-secondary leading-[1.7] max-w-2xl mx-auto mb-10">
              Bir &apos;lala&apos; gibi sanatçının yanında durur.
              Bir &apos;bit&apos; kadar küçük, bir hayat kadar değerli.
              Türkiye&apos;nin içerik üreticileri için yerli, Türkçe
              ve Türk lirası ile çalışan üyelik platformu.
            </p>
            <Link
              href="/kayit/uretici"
              className="inline-block rounded-xl bg-orange px-10 py-4 text-sm font-semibold text-white hover:bg-orange-dark transition-colors"
            >
              Üretici olarak başla
            </Link>
          </div>
        </section>

        {/* Kısaca Anlatalım */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-[28px] font-bold text-text-primary mb-6">Kısaca Anlatalım</h2>
            <div className="rounded-[20px] bg-teal-light border border-teal/10 p-8 space-y-3 text-base text-text-secondary leading-[1.8]">
              <p>
                lalabits, içerik üreten kişilerin — yazar, çizer,
                podcaster, müzisyen, tasarımcı, eğitimci —
                takipçilerinden aylık üyelik ya da tek seferlik
                ödeme ile doğrudan gelir elde etmesini sağlar.
              </p>
              <ul className="space-y-1 text-text-primary font-medium">
                <li>✓ Reklam geliri yok.</li>
                <li>✓ Algoritma baskısı yok.</li>
                <li>✓ İzin almak zorunda değilsin.</li>
                <li>✓ Üretici ile destekçi arasında doğrudan bağlantı.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Üretici için — 3 kart */}
        <section className="py-20 bg-[#f4fafa]">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-[28px] font-bold text-text-primary mb-10 text-center">İçerik Üreticisi İçin</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  ),
                  baslik: 'Kademeli Üyelik Kur',
                  metin:
                    'Birden fazla üyelik kademesi oluştur. Ücretsiz takipçiden premium destekçiye farklı içerik seviyeleri sun.',
                },
                {
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  ),
                  baslik: 'Dijital Ürün Sat',
                  metin:
                    'PDF, ses, video, şablon — üyelik dışında tek seferlik satışla ek gelir kapısı aç.',
                },
                {
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  ),
                  baslik: 'Türk Lirası ile Tahsilat',
                  metin:
                    'IBAN havale, Türk banka kartı. Döviz kaybı yok, komisyon sadece kazandığında kesilir.',
                },
              ].map((kart) => (
                <div key={kart.baslik} className="rounded-[20px] bg-white border border-border p-7">
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

        {/* Destekçi için — 3 kart */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-[28px] font-bold text-text-primary mb-10 text-center">Destekçi İçin</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ),
                  baslik: 'Özel İçeriklere Eriş',
                  metin:
                    'Desteklediğin üreticinin herkese açık olmayan içeriklerine ve topluluğuna katıl.',
                },
                {
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  ),
                  baslik: 'Türk Lirası ile Öde',
                  metin:
                    'Dolar ya da euro kaybı yok. Kendi paran, kendi bankan.',
                },
                {
                  ikon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ),
                  baslik: 'Doğrudan Destekle',
                  metin:
                    'Ödemenin büyük kısmı üreticiye gidiyor. Platforma değil, içeriği üreten kişiye.',
                },
              ].map((kart) => (
                <div key={kart.baslik} className="rounded-[20px] bg-white border border-border p-7">
                  <div className="w-11 h-11 rounded-full bg-orange-light text-orange flex items-center justify-center mb-5">
                    {kart.ikon}
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-3">{kart.baslik}</h3>
                  <p className="text-sm text-text-secondary leading-[1.7]">{kart.metin}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Özellikleri */}
        <section className="py-20 bg-teal-light">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-[28px] font-bold text-text-primary mb-10 text-center">Neler Sunuyoruz?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Kademeli üyelik sistemi', 'Ücretsizden premium\'a birden fazla kademe.'],
                ['Dijital ürün mağazası', 'Tek seferlik satış ve koleksiyonlar.'],
                ['Özel gönderi ve içerik kilitleme', 'Kademe bazlı erişim kontrolü.'],
                ['Topluluk sohbeti', 'Üretici ve destekçi arasında doğrudan iletişim.'],
                ['Anlık gelir istatistikleri', 'Kazanç, abone büyümesi, içerik performansı.'],
                ['IBAN ile ödeme çıkışı', 'Her ay doğrudan banka hesabına.'],
                ['KVKK uyumlu veri yönetimi', 'Kişisel veriler Türkiye mevzuatına uygun korunur.'],
                ['Türkçe destek ekibi', 'Sorularınız için Türkçe yanıt garantisi.'],
              ].map(([baslik, aciklama]) => (
                <div key={baslik} className="flex items-start gap-4 rounded-[16px] bg-white border border-teal/10 p-5">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-teal text-white text-xs flex items-center justify-center font-bold">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{baslik}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{aciklama}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SSS */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-[28px] font-bold text-text-primary mb-8">Sık Sorulan Sorular</h2>
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

        {/* Final CTA */}
        <section className="py-20 bg-[#1a1a1a] text-center">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-[28px] font-bold text-white mb-4">Hazır mısın?</h2>
            <p className="text-base text-white/60 mb-8 leading-[1.7]">
              Ücretsiz hesap aç, sayfanı oluştur, kazanmaya başla.
            </p>
            <Link
              href="/kayit/uretici"
              className="inline-block rounded-xl bg-orange px-10 py-4 text-sm font-semibold text-white hover:bg-orange-dark transition-colors"
            >
              Şimdi başla
            </Link>
            <p className="mt-4 text-xs text-white/30">Kurulum ücretsiz · Kredi kartı gerekmez</p>
          </div>
        </section>
      </main>
    </>
  );
}
