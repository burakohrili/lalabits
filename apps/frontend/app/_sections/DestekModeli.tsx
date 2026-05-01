const modes = [
  {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 28C16 28 4 20.5 4 12a6 6 0 0 1 12-1.2A6 6 0 0 1 28 12c0 8.5-12 16-12 16z"
          stroke="var(--color-teal)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="var(--color-teal)"
          fillOpacity="0.12"
        />
      </svg>
    ),
    color: 'border-teal/20 bg-teal-light',
    badgeColor: 'text-teal bg-teal/10',
    badge: 'Ücretsiz',
    title: 'Ücretsiz Takip',
    desc: 'Kaydol, üreticileri takip et. Herkese açık içerikleri hiçbir ücret ödemeden oku ve izle.',
  },
  {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" stroke="var(--color-teal)" strokeWidth="1.8" fill="var(--color-teal)" fillOpacity="0.08" />
        <path
          d="M16 9l1.8 5.5H23l-4.6 3.3 1.8 5.5L16 20l-4.2 3.3 1.8-5.5L9 14.5h5.2z"
          stroke="var(--color-teal)"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="var(--color-teal)"
          fillOpacity="0.3"
        />
      </svg>
    ),
    color: 'border-teal/30 bg-white',
    badgeColor: 'text-teal bg-teal/10',
    badge: 'Aylık / Yıllık',
    title: 'Üyelik',
    desc: 'Tercih ettiğin kademeye abone ol. Üyelere özel içeriklere, arşive ve topluluğa eriş.',
  },
  {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="10" width="24" height="16" rx="3" stroke="var(--color-orange)" strokeWidth="1.8" fill="var(--color-orange)" fillOpacity="0.08" />
        <path
          d="M10 10V8a6 6 0 0 1 12 0v2"
          stroke="var(--color-orange)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="16" cy="18" r="2.5" fill="var(--color-orange)" fillOpacity="0.6" />
      </svg>
    ),
    color: 'border-orange/20 bg-orange-light',
    badgeColor: 'text-orange bg-orange/10',
    badge: 'Tek Seferlik',
    title: 'Doğrudan Destek',
    desc: 'Abonelik bağlamadan istediğin an üreticini destekle. Bağlılık gerektirmez.',
  },
  {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="7" width="22" height="18" rx="3" stroke="var(--color-teal)" strokeWidth="1.8" fill="var(--color-teal)" fillOpacity="0.08" />
        <path
          d="M11 20l3-4 3 3 3-5"
          stroke="var(--color-teal)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M20 14h3M20 17h2" stroke="var(--color-teal)" strokeWidth="1.4" strokeLinecap="round" />
        <path
          d="M22 25v-4M24 23l-2 2-2-2"
          stroke="var(--color-orange)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: 'border-border bg-white',
    badgeColor: 'text-text-secondary bg-background',
    badge: 'Tek Seferlik',
    title: 'Dijital Ürün',
    desc: 'PDF, ses dosyası, şablon, kaynak paketi — satın al, indir, sonsuza kadar sende.',
  },
];

export default function DestekModeli() {
  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-2">
            Destek Modeli
          </p>
          <h2 className="text-[24px] font-bold tracking-[-0.01em] text-text-primary sm:text-[32px]">
            Destekçi Olarak Neler Yapabilirsin?
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            Bağlılık seviyeni sen belirle. Ücretsiz takipten premium üyeliğe kadar her seçenek burada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((mode, i) => (
            <div
              key={i}
              className={`rounded-[18px] border p-6 flex flex-col gap-3 ${mode.color}`}
            >
              {mode.icon}
              <div>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${mode.badgeColor}`}>
                  {mode.badge}
                </span>
                <h3 className="text-base font-bold text-text-primary">{mode.title}</h3>
                <p className="mt-1 text-sm text-text-secondary leading-[1.6]">{mode.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
