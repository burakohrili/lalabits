import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Basın Kiti | lalabits.art',
  description:
    'lalabits.art basın kiti: platform özeti, logo dosyaları, renk rehberi ve medya iletişim bilgileri.',
};

const renkler = [
  { ad: 'Lala Turkuaz', hex: '#008080', bg: 'bg-teal', metin: 'text-white', aciklama: 'Birincil sistem rengi' },
  { ad: 'Bit Turuncu', hex: '#FF5722', bg: 'bg-orange', metin: 'text-white', aciklama: 'Aksan ve CTA rengi' },
  { ad: 'İnci Beyaz', hex: '#F8F9FA', bg: 'bg-[#F8F9FA] border border-border', metin: 'text-text-primary', aciklama: 'Arka plan' },
  { ad: 'Kömür Siyah', hex: '#212121', bg: 'bg-[#212121]', metin: 'text-white', aciklama: 'Ana metin' },
];

export default function BasinPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero — dark */}
      <section className="bg-[#1a1a1a] py-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <span className="inline-block rounded-full bg-white/10 text-white/80 text-sm font-semibold px-4 py-1.5 mb-8">
            Medya &amp; Basın
          </span>
          <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.02em] text-white mb-6 leading-[1.15]">
            Basın Kiti
          </h1>
          <p className="text-lg text-white/60 leading-[1.7] max-w-xl mx-auto">
            Medya ve basın için ihtiyacınız olan her şey bu sayfada.
          </p>
        </div>
      </section>

      {/* Platform Özeti */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-[24px] font-bold text-text-primary mb-4">Tek Paragrafta lalabits</h2>
          <div className="rounded-[20px] bg-teal-light border border-teal/10 p-8 mb-8">
            <p className="text-base text-text-secondary leading-[1.8]">
              lalabits.art, Türkiye&apos;deki içerik üreticilerinin takipçilerinden doğrudan,
              Türk lirası ile gelir elde etmesini sağlayan yerli üyelik ve dijital içerik platformudur.
              İzmir merkezli Noesis Social tarafından 2024&apos;te kurulan platform,
              tamamen Türkçe arayüz ve Türkiye&apos;ye özgü ödeme altyapısıyla çalışmaktadır.
            </p>
          </div>

          <h3 className="text-base font-semibold text-text-primary mb-4">Özet Bilgiler</h3>
          <div className="rounded-[16px] border border-border bg-white overflow-hidden">
            {[
              ['Kategori', 'İçerik Teknolojisi / Üretici Ekonomisi'],
              ['Kuruluş', '2024, İzmir'],
              ['Şirket', 'Noesis Social'],
              ['Yetkili', 'Burak OHRİLİ'],
              ['Hedef pazar', 'Türkiye'],
              ['Web', 'https://lalabits.art'],
            ].map(([alan, deger], i) => (
              <div
                key={alan}
                className={`flex items-start gap-4 px-6 py-4 ${i !== 5 ? 'border-b border-border' : ''}`}
              >
                <span className="w-36 flex-shrink-0 text-sm font-semibold text-text-primary">{alan}</span>
                <span className="text-sm text-text-secondary">{deger}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo & Görseller */}
      <section className="py-20 bg-[#f4fafa]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-[24px] font-bold text-text-primary mb-4">Logo ve Görsel Dosyalar</h2>

          <div className="rounded-[20px] bg-white border border-border p-8 mb-8">
            <p className="text-sm text-text-secondary leading-[1.8] mb-6">
              lalabits logosu, Türk mozaik sanat geleneğinden ilham alır.
              Dikdörtgen form içindeki hat motifi, &apos;lala&apos; kültürel mirasını;
              sağ üst köşeden dağılan turuncu pikseller &apos;bits&apos; dijital çıktısını temsil eder.
              İkisi birleşince hem geçmişe hem geleceğe bakan bir marka kimliği ortaya çıkar.
            </p>

            {/* Logo önizleme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-[16px] bg-white border border-border p-8 flex items-center justify-center">
                <span className="text-[28px] font-sans">
                  <span style={{ fontWeight: 400, color: '#212121' }}>lala</span>
                  <span style={{ fontWeight: 700, color: '#FF5722' }}>bits</span>
                  <span style={{ fontWeight: 400, color: '#212121' }}>.art</span>
                </span>
              </div>
              <div className="rounded-[16px] bg-[#1a1a1a] p-8 flex items-center justify-center">
                <span className="text-[28px] font-sans">
                  <span style={{ fontWeight: 400, color: '#FFFFFF' }}>lala</span>
                  <span style={{ fontWeight: 700, color: '#FF5722' }}>bits</span>
                  <span style={{ fontWeight: 400, color: '#FFFFFF' }}>.art</span>
                </span>
              </div>
            </div>

            {/* İndirme butonları */}
            <div className="flex flex-wrap gap-3">
              {[
                'PNG — Şeffaf arka plan (2000px)',
                'SVG — Vektör dosyası',
                'Wordmark yatay — Koyu zemin',
                'Wordmark yatay — Açık zemin',
                'Favicon / App ikonu — 512×512px',
              ].map((dosya) => (
                <div
                  key={dosya}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-xs text-text-muted cursor-not-allowed select-none"
                  title="Yakında"
                >
                  ↓ {dosya}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-text-muted">Logo dosyaları hazırlanıyor. Talep için iletisim@lalabits.art</p>
          </div>

          {/* Renk Paleti */}
          <h3 className="text-base font-semibold text-text-primary mb-4">Renk Paleti</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {renkler.map((r) => (
              <div key={r.hex} className="rounded-[16px] overflow-hidden border border-border">
                <div className={`h-16 ${r.bg} flex items-center justify-center`}>
                  <span className={`text-xs font-mono font-semibold ${r.metin}`}>{r.hex}</span>
                </div>
                <div className="bg-white p-3">
                  <p className="text-xs font-semibold text-text-primary">{r.ad}</p>
                  <p className="text-[11px] text-text-muted">{r.aciklama}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Kullanım Kuralları */}
          <h3 className="text-base font-semibold text-text-primary mb-3">Kullanım Kuralları</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            {[
              'Logo rengi değiştirilemez.',
              'Logo üzerine metin yerleştirilemez.',
              'Minimum kullanım boyutu: 120px genişlik.',
              'Çevresinde en az logo yüksekliği kadar boşluk bırakılmalı.',
            ].map((kural) => (
              <li key={kural} className="flex items-start gap-2">
                <span className="mt-1 text-teal text-xs">·</span>
                {kural}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Basın Bültenleri */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-[24px] font-bold text-text-primary mb-6">Basın Bültenleri</h2>
          <div className="rounded-[20px] border border-dashed border-border bg-white p-12 text-center">
            <p className="text-base text-text-secondary mb-2">Henüz yayınlanmış basın bülteni bulunmuyor.</p>
            <p className="text-sm text-text-muted">
              Bülten listemize eklenmek için{' '}
              <a href="mailto:iletisim@lalabits.art" className="text-teal hover:underline">
                iletisim@lalabits.art
              </a>{' '}
              adresine yazabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Basın İletişimi */}
      <section className="py-20 bg-teal-light">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-[24px] font-bold text-text-primary mb-8">Basın İletişimi</h2>
          <div className="rounded-[20px] bg-white border border-border p-8">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-teal flex items-center justify-center text-white text-xl font-bold">
                B
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-text-primary">Burak OHRİLİ</p>
                <p className="text-sm text-teal font-semibold mb-4">Kurucu</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-muted w-20">E-posta</span>
                    <a href="mailto:iletisim@lalabits.art" className="text-sm text-teal hover:underline">
                      iletisim@lalabits.art
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-muted w-20">Telefon</span>
                    <span className="text-sm text-text-secondary">0532 744 94 34</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-text-muted">
                  Basın taleplerine 24 saat içinde yanıt veririz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
