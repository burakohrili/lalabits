import Link from 'next/link';

const reasons = [
  {
    icon: (
      <svg className="h-9 w-9" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="14" fill="var(--color-teal)" fillOpacity="0.08" />
        <path
          d="M12 18c0-3.3 2.7-6 6-6s6 2.7 6 6"
          stroke="var(--color-teal)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="18" cy="18" r="3" fill="var(--color-teal)" fillOpacity="0.5" />
        <path
          d="M18 10V8M10 18H8M26 18h2M21.5 12.5l1.5-1.5M12.5 12.5 11 11"
          stroke="var(--color-teal)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Daha Yakın Olmak',
    desc: 'Herkesle aynı kanalda takipçi olmak yerine, gerçekten önemli olan içeriklere ve üreticiye doğrudan ulaş.',
    accent: 'border-teal/20',
  },
  {
    icon: (
      <svg className="h-9 w-9" viewBox="0 0 36 36" fill="none">
        <rect x="6" y="8" width="24" height="20" rx="4" fill="var(--color-teal)" fillOpacity="0.08" />
        <rect x="6" y="8" width="24" height="20" rx="4" stroke="var(--color-teal)" strokeWidth="1.8" />
        <path
          d="M12 16h12M12 20h8"
          stroke="var(--color-teal)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M26 6v4M28 8h-4"
          stroke="var(--color-orange)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Özel İçeriklere Eriş',
    desc: 'Arşiv, erken erişim, üyelere özel yazılar, ses dosyaları ve dosyalar — herkese değil, sana özel.',
    accent: 'border-teal/20',
  },
  {
    icon: (
      <svg className="h-9 w-9" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="14" fill="var(--color-teal)" fillOpacity="0.08" />
        <circle cx="12" cy="18" r="3" stroke="var(--color-teal)" strokeWidth="1.6" />
        <circle cx="24" cy="18" r="3" stroke="var(--color-teal)" strokeWidth="1.6" />
        <circle cx="18" cy="11" r="3" stroke="var(--color-teal)" strokeWidth="1.6" />
        <path
          d="M14.8 16.6 16.4 13M21.2 16.6 19.6 13M15 19.5l2 1.5 2-1.5"
          stroke="var(--color-teal)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Topluluğun İçine Gir',
    desc: 'Aynı ilgi alanını paylaşan insanlarla ve üreticiyle aynı alanda ol. Kademe bazlı özel sohbet kanalları.',
    accent: 'border-teal/20',
  },
  {
    icon: (
      <svg className="h-9 w-9" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="14" fill="var(--color-orange)" fillOpacity="0.07" />
        <path
          d="M18 10v8l5 3"
          stroke="var(--color-orange)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="18" r="10" stroke="var(--color-orange)" strokeWidth="1.6" strokeDasharray="3 2" />
      </svg>
    ),
    title: 'Üretimin Devamını Sağla',
    desc: 'Destek, üreticinin bağımsız çalışmasını mümkün kılar. Reklamlara değil, sana bağlı üretim sürdürülebilir olur.',
    accent: 'border-orange/20',
  },
];

export default function HayraNeden() {
  return (
    <section className="py-20 sm:py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-2">
            Destekçi İçin
          </p>
          <h2 className="text-[28px] font-bold tracking-[-0.01em] text-text-primary sm:text-[36px]">
            Neden Üye Olunur?
          </h2>
          <p className="mt-3 text-lg text-text-secondary max-w-2xl mx-auto">
            Takip etmek yeterli değil. Sevdiğin içerik üreticisine daha yakın olmanın, özel içeriklere erişmenin ve üretimin devam etmesini sağlamanın yolu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`rounded-[20px] border bg-white p-7 flex flex-col gap-4 ${r.accent}`}
            >
              {r.icon}
              <div>
                <h3 className="text-[17px] font-bold text-text-primary mb-2">{r.title}</h3>
                <p className="text-sm text-text-secondary leading-[1.7]">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/kesfet"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-teal px-7 py-3.5 text-sm font-semibold text-teal hover:bg-teal hover:text-white transition-colors duration-150"
          >
            Üreticileri keşfet
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
