import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hakkımızda | lalabits.art',
  description:
    'lalabits.art kimdir, neden kuruldu, neye inanıyor? Türkiye\'nin ilk yerli içerik üreticisi platformunun hikayesi.',
};

export default function HakkimizdaPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero — dark */}
      <section className="bg-[#1a1a1a] py-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <span className="inline-block rounded-full bg-white/10 text-white/80 text-sm font-semibold px-4 py-1.5 mb-8">
            Biz kimiz?
          </span>
          <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-0.02em] text-white mb-6 leading-[1.15]">
            Sanatı Bugüne Taşımak İçin
            <br />
            Buradayız
          </h1>
          <p className="text-lg text-white/60 leading-[1.7] max-w-2xl mx-auto">
            Yüzyıllar önce &apos;lala&apos;, genç yetenekleri keşfeder,
            büyütür ve korudu. Bugün lalabits, Türkiye&apos;nin
            içerik üreticisinin yanında aynı niyetle duruyor.
          </p>
        </div>
      </section>

      {/* Hikaye */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <span className="text-xs font-semibold text-teal uppercase tracking-wider">Nereden Geldik?</span>
          <h2 className="mt-3 text-[28px] font-bold text-text-primary mb-8">Hikayemiz</h2>
          <div className="space-y-4 text-base text-text-secondary leading-[1.8]">
            <p>
              Türkiye&apos;de içerik üretmek hiç bu kadar aktif olmamıştı.
              Ama gelir elde etmek hâlâ çözülmemiş bir problemdi.
            </p>
            <p>
              Uluslararası platformlar Türkçe değil.
              Ödeme sistemleri Türk lirası ile çalışmıyor.
              Hukuki çerçeve Türk mevzuatına uygun değil.
              Üretici, kendi ülkesinde yabancı platform kurallarıyla çalışmak zorunda kalıyor.
            </p>
            <p>
              lalabits bu boşluğu kapatmak için 2024&apos;te İzmir&apos;de kuruldu.
              Fikir basitti: Türkiye&apos;nin üreticileri,
              kendi dilinde, kendi parasıyla, kendi hukuk sistemiyle
              çalışan bir platforma hak kazanıyor.
            </p>
          </div>
        </div>
      </section>

      {/* Marka Anlamı — 2 sütun */}
      <section className="py-20 bg-teal-light">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-[28px] font-bold text-text-primary mb-10 text-center">Neden lalabits?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[20px] bg-white border border-teal/10 p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-light mb-5">
                <span className="text-2xl font-bold text-teal">L</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Lala</h3>
              <p className="text-sm text-text-secondary leading-[1.8]">
                Osmanlı ve Türk geleneğinde &apos;lala&apos;,
                genç yeteneklerin yanında duran,
                onları keşfeden ve büyüten kılavuz figürdür.
                Tarihsel derinlik, kültürel miras,
                himaye ve güven anlamı taşır.
              </p>
            </div>
            <div className="rounded-[20px] bg-white border border-teal/10 p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-light mb-5">
                <span className="text-2xl font-bold text-orange">B</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Bits</h3>
              <p className="text-sm text-text-secondary leading-[1.8]">
                Dijital dünyanın en küçük yapı taşı &apos;bit&apos;,
                bir içerik üreticisinin çıktısının —
                bir gönderi, ses dosyası, video ya da fikrin —
                en saf birimidir.
                Küçük ama anlam dolu.
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-text-secondary leading-[1.7] max-w-2xl mx-auto">
            <strong className="text-text-primary">lalabits:</strong> Tarihin koruyucu geleneğini dijital üretimle buluşturan platform.
            Her üreticinin ürettiği her &apos;bit&apos;in değer gördüğü yer.
          </p>
        </div>
      </section>

      {/* Değerler — 4 kart */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-[28px] font-bold text-text-primary mb-10 text-center">Ne&apos;ye İnanıyoruz?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                no: '01',
                baslik: 'Üretici Önce',
                metin:
                  'Platformdaki her karar, üreticinin çıkarı gözetilerek alınır. Komisyon oranları, özellikler, tasarım — hepsi üretici odaklı.',
              },
              {
                no: '02',
                baslik: 'Türkiye\'ye Özgü',
                metin:
                  'Türk lirası, Türk ödeme yöntemleri, KVKK uyumu, Türkçe destek ekibi. Yerelde kurulan, yerelde büyüyen.',
              },
              {
                no: '03',
                baslik: 'Şeffaf Gelir',
                metin:
                  'Komisyon oranlarımız açık, sabit ve sürprizsiz. Ne alacağını önceden bilirsin.',
              },
              {
                no: '04',
                baslik: 'Uzun Vade',
                metin:
                  'Viral içerik değil, sürdürülebilir gelir. Üreticinin yıllarca güvenebileceği altyapı.',
              },
            ].map((deger) => (
              <div
                key={deger.no}
                className="rounded-[20px] border border-border bg-white p-8"
              >
                <span className="text-3xl font-black text-teal/20">{deger.no}</span>
                <h3 className="mt-3 text-lg font-bold text-text-primary mb-3">{deger.baslik}</h3>
                <p className="text-sm text-text-secondary leading-[1.7]">{deger.metin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurucu */}
      <section className="py-20 bg-[#f4fafa]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-[28px] font-bold text-text-primary mb-10 text-center">Arkamızdaki İnsan</h2>
          <div className="rounded-[24px] bg-white border border-border p-8 flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-teal flex items-center justify-center text-white text-2xl font-bold">
              B
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">Burak OHRİLİ</p>
              <p className="text-sm text-teal font-semibold mb-1">Kurucu &amp; CEO · Noesis Social</p>
              <p className="text-xs text-text-muted mb-4">Bornova, İzmir</p>
              <p className="text-sm text-text-secondary leading-[1.7]">
                Türkiye&apos;nin dijital üretici ekonomisine inanıyor.
                lalabits&apos;i bu inancı somut bir platforma dönüştürmek için kurdu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rakamlar */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-[28px] font-bold text-white mb-12 text-center">Bugüne Kadar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { rakam: '2.400+', etiket: 'Aktif Üretici' },
              { rakam: '₺18.5M+', etiket: 'Toplam Kazanıldı' },
              { rakam: '47.000+', etiket: 'Mutlu Destekçi' },
            ].map((item) => (
              <div key={item.etiket}>
                <p className="text-[48px] font-black text-orange leading-none mb-2">{item.rakam}</p>
                <p className="text-sm text-white/60">{item.etiket}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-teal-light text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-[28px] font-bold text-text-primary mb-4">Bir Parçası Ol</h2>
          <p className="text-base text-text-secondary mb-8 leading-[1.7]">
            Türkiye&apos;nin içerik üreticilerine özel platformuna katıl.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kayit/uretici"
              className="rounded-xl bg-orange px-8 py-3.5 text-sm font-semibold text-white hover:bg-orange-dark transition-colors"
            >
              Üretici olarak başla
            </Link>
            <a
              href="mailto:iletisim@lalabits.art"
              className="rounded-xl border border-teal text-teal px-8 py-3.5 text-sm font-semibold hover:bg-teal hover:text-white transition-colors"
            >
              İletişime geç
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
