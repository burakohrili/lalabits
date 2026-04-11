const features = [
  {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 4l2.5 7.5H26l-6.5 4.5 2.5 7.5L16 19l-6 4.5 2.5-7.5L6 11.5h7.5z"
          fill="#008080"
          opacity="0.15"
          stroke="#008080"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bg: 'bg-teal-light',
    badge: 'Üyelik',
    title: 'Kademeli Üyelik',
    desc: 'Ücretsizden Premium\'a birden fazla kademe. Her kademede farklı içerik, farklı avantaj.',
    large: true,
    visual: (
      <div className="mt-5 flex flex-col gap-2">
        {[
          { name: 'Temel', price: '₺49', color: 'bg-teal/10 border-teal/20' },
          { name: 'Standart', price: '₺129', color: 'bg-teal/20 border-teal/30' },
          { name: 'Premium', price: '₺299', color: 'bg-teal border-teal shadow-sm' },
        ].map((tier, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 ${tier.color} ${i === 2 ? 'text-white' : ''}`}
          >
            <span className={`text-sm font-semibold ${i === 2 ? 'text-white' : 'text-text-primary'}`}>
              {tier.name}
            </span>
            <span className={`text-sm font-bold ${i === 2 ? 'text-white' : 'text-teal'}`}>
              {tier.price}/ay
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="18" rx="3" stroke="#FF5722" strokeWidth="1.5" />
        <path d="M9 12h10M9 16h6" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    bg: 'bg-orange-light',
    badge: 'Mağaza',
    title: 'Dijital Mağaza',
    desc: 'PDF, ses dosyası, video, şablon — tek seferlik satış veya üyelik dahil.',
    large: false,
  },
  {
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path
          d="M4 8h20v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"
          stroke="#7C3AED"
          strokeWidth="1.5"
        />
        <path d="M4 8l10-4 10 4" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 14h8M10 18h5" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    bg: 'bg-violet-50',
    badge: 'Topluluk',
    title: 'Topluluk Sohbeti',
    desc: 'Destekçilerinle sohbet et. Kademe bazlı özel sohbet kanalları.',
    large: false,
  },
  {
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path
          d="M4 20h3v-8H4v8zm5 0h3V8H9v12zm5 0h3v-5h-3v5zm5 0h3v-10h-3v10z"
          fill="#008080"
          opacity="0.2"
        />
        <path
          d="M4 20h3v-8H4v8zm5 0h3V8H9v12zm5 0h3v-5h-3v5zm5 0h3v-10h-3v10z"
          stroke="#008080"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bg: 'bg-teal-light',
    badge: 'Analitik',
    title: 'Gerçek Zamanlı Analitik',
    desc: 'Kazanç, abone, içerik performansı — anlık verilerle karar al.',
    large: false,
  },
];

export default function OzellikOzeti() {
  return (
    <section className="py-24 sm:py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-[28px] font-bold tracking-[-0.01em] text-text-primary sm:text-[40px]">
            Her Şey Bir Yerde
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            İçerik üreticileri için ihtiyacınız olan tüm araçlar
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Büyük kart — Üyelik */}
          <div className={`${features[0].bg} rounded-[20px] p-8 border border-teal/10 md:row-span-2 flex flex-col`}>
            <div className="flex items-center gap-3">
              {features[0].icon}
              <span className="text-xs font-semibold text-teal uppercase tracking-wider">
                {features[0].badge}
              </span>
            </div>
            <h3 className="mt-4 text-[22px] font-bold text-text-primary">{features[0].title}</h3>
            <p className="mt-2 text-base text-text-secondary leading-[1.7]">{features[0].desc}</p>
            {features[0].visual}
          </div>

          {/* Sağ üst — Dijital Mağaza */}
          <div className={`${features[1].bg} rounded-[20px] p-8 border border-orange/10 flex flex-col`}>
            <div className="flex items-center gap-3">
              {features[1].icon}
              <span className="text-xs font-semibold text-orange uppercase tracking-wider">
                {features[1].badge}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-text-primary">{features[1].title}</h3>
            <p className="mt-2 text-sm text-text-secondary leading-[1.7]">{features[1].desc}</p>
          </div>

          {/* Sağ orta — Topluluk */}
          <div className={`${features[2].bg} rounded-[20px] p-8 border border-violet-100 flex flex-col`}>
            <div className="flex items-center gap-3">
              {features[2].icon}
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
                {features[2].badge}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-text-primary">{features[2].title}</h3>
            <p className="mt-2 text-sm text-text-secondary leading-[1.7]">{features[2].desc}</p>
          </div>

          {/* Alt — Analitik (2 col) */}
          <div className={`${features[3].bg} rounded-[20px] p-8 border border-teal/10 flex flex-col lg:col-span-2`}>
            <div className="flex items-center gap-3">
              {features[3].icon}
              <span className="text-xs font-semibold text-teal uppercase tracking-wider">
                {features[3].badge}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-text-primary">{features[3].title}</h3>
            <p className="mt-2 text-sm text-text-secondary leading-[1.7]">{features[3].desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
