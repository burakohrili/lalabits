import Link from 'next/link';

const categories = [
  {
    label: 'Yazar',
    slug: 'writer',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path d="M6 22l1.5-5L18 6.5a2.121 2.121 0 0 1 3 3L10 21l-4 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M15.5 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    uyelik: 'Arşiv, haftalık yazılar, taslak okuma',
    tekSeferlik: 'E-kitap, şablon, yazı rehberi',
  },
  {
    label: 'Çizer',
    slug: 'illustrator',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path d="M5 23c0-1.7 1.3-3 3-3h12c1.7 0 3 1.3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 5l1.5 4.5h4.5l-3.7 2.7 1.4 4.3L14 13.8l-3.7 2.7 1.4-4.3L8 9.5h4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    uyelik: 'Çizim süreci, kaynak dosyalar, erken baskı',
    tekSeferlik: 'Dijital baskı, Procreate fırçaları',
  },
  {
    label: 'Podcaster',
    slug: 'podcaster',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <rect x="10" y="4" width="8" height="12" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 16a8 8 0 0 0 16 0M14 24v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    uyelik: 'Reklamsız bölümler, arşiv, erken erişim',
    tekSeferlik: 'Sezon paketi, özel ses içeriği',
  },
  {
    label: 'Müzisyen',
    slug: 'musician',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path d="M10 20V8l14-3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="21" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    uyelik: 'Demo bölümler, şarkı yazım süreci, erken dinleme',
    tekSeferlik: 'Albüm, nota paketi, ders videosu',
  },
  {
    label: 'Tasarımcı',
    slug: 'designer',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 14h10M14 9v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    uyelik: 'Şablon arşivi, tasarım dosyaları, süreç notları',
    tekSeferlik: 'UI kit, ikonlar, Figma kütüphanesi',
  },
  {
    label: 'Eğitimci',
    slug: 'educator',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path d="M4 9l10-5 10 5-10 5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 9v8M24 9v5a10 10 0 0 1-20 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    uyelik: 'Haftalık ders, soru-cevap, özel PDF',
    tekSeferlik: 'Ders modülü, soru bankası, özet kitapçık',
  },
  {
    label: 'Geliştirici',
    slug: 'developer',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path d="M9 10l-4 4 4 4M19 10l4 4-4 4M16 7l-4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    uyelik: 'Kaynak kodu, proje dosyaları, aylık paket',
    tekSeferlik: 'Şablon, plugin, araç seti',
  },
  {
    label: 'Oyun Geliştirici',
    slug: 'game_developer',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="9" width="22" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 16h4M11 14v4M18 15h2M18 17h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 5l4-2 4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    uyelik: 'Geliştirme günlüğü, beta erişim, varlık paketi',
    tekSeferlik: 'Oyun modu, varlık seti, kaynak kod parçası',
  },
  {
    label: 'Video Üreticisi',
    slug: 'video_creator',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="7" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 11l6-3v12l-6-3V11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    uyelik: 'Özel videolar, arşiv, seri içerikler',
    tekSeferlik: 'Eğitim videosu, masterclass, ders paketi',
  },
  {
    label: 'Yapay Zekâ Üreticisi',
    slug: 'ai_creator',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 4v3M14 21v3M4 14h3M21 14h3M7.05 7.05l2.12 2.12M18.83 18.83l2.12 2.12M7.05 20.95l2.12-2.12M18.83 9.17l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    uyelik: 'Prompt arşivi, haftalık AI rehberleri, araç incelemeleri',
    tekSeferlik: 'Prompt paketi, AI iş akışı kılavuzu, şablon seti',
  },
  {
    label: 'Diğer',
    slug: '',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 10v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    uyelik: 'Her içerik formatı destekleniyor',
    tekSeferlik: 'Dijital ürün, dosya, koleksiyon',
  },
];

export default function Kategoriler() {
  return (
    <section className="py-24 sm:py-16 bg-teal-light">
      <div className="mx-auto max-w-7xl px-6">
        {/* Başlık */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-2">
            Kategoriler
          </p>
          <h2 className="text-[28px] font-bold tracking-[-0.01em] text-text-primary sm:text-[40px]">
            Her İçerik Üreticisine Yer Var
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Hangi alanda üretirsen üret, lalabits&apos;te hayranlarına sunabileceğin şeyler var.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const href = cat.slug ? `/kesfet?kategori=${cat.slug}` : '/kesfet';
            return (
              <Link
                key={cat.slug || 'diger'}
                href={href}
                className="group relative rounded-[20px] border border-white/60 bg-white p-6 flex flex-col gap-3 transition-all duration-200 hover:border-teal hover:bg-teal hover:shadow-md cursor-pointer overflow-hidden"
              >
                {/* İkon + başlık */}
                <div className="flex items-center gap-3">
                  <div className="text-text-secondary group-hover:text-white transition-colors shrink-0">
                    {cat.icon}
                  </div>
                  <span className="text-[15px] font-semibold text-text-primary group-hover:text-white transition-colors">
                    {cat.label}
                  </span>
                </div>

                {/* Hover'da görünen teklif bilgisi */}
                <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-300">
                  <div className="border-t border-white/30 pt-3 flex flex-col gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">
                        Üyelik ile
                      </span>
                      <p className="text-xs text-white/90 mt-0.5 leading-[1.5]">{cat.uyelik}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">
                        Tek seferlik
                      </span>
                      <p className="text-xs text-white/90 mt-0.5 leading-[1.5]">{cat.tekSeferlik}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-center mt-8 text-sm text-text-secondary">
          Üzerine gel, her kategoride neler sunulabileceğini gör.
        </p>
      </div>
    </section>
  );
}
