import Link from 'next/link';

/* ── Mozaik SVG arka plan pattern ───────────────────────────── */
function MosaicPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="mosaic"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="19" height="19" rx="2" fill="#008080" opacity="0.04" />
          <rect x="21" y="21" width="19" height="19" rx="2" fill="#FF5722" opacity="0.03" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mosaic)" />
    </svg>
  );
}

/* ── Mock üretici kart ──────────────────────────────────────── */
function MockCreatorCard() {
  return (
    <div className="relative animate-[float_4s_ease-in-out_infinite]">
      {/* Kart */}
      <div className="w-80 rounded-[20px] bg-white border border-border shadow-[0_4px_12px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Cover */}
        <div
          className="h-28 w-full"
          style={{ background: 'linear-gradient(135deg, #008080 0%, #005f5f 100%)' }}
        />
        {/* Avatar */}
        <div className="px-5 -mt-8">
          <div className="h-16 w-16 rounded-full border-4 border-white bg-teal flex items-center justify-center text-white text-xl font-bold shadow-sm">
            A
          </div>
        </div>
        {/* Bilgi */}
        <div className="px-5 pt-2 pb-4">
          <p className="font-semibold text-text-primary text-base">Ayşe Demir</p>
          <span className="inline-block mt-1 rounded-full bg-teal-light text-teal text-xs font-medium px-2.5 py-0.5">
            Yazar
          </span>
          <div className="mt-3 flex items-center gap-4 text-sm text-text-secondary">
            <span>248 destekçi</span>
            <span className="text-text-muted">·</span>
            <span className="text-orange font-semibold">₺ 4.200 / ay</span>
          </div>
          {/* Kademeler */}
          <div className="mt-3 flex flex-col gap-2">
            {[
              { name: 'Temel', price: '₺49' },
              { name: 'Standart', price: '₺129' },
              { name: 'Premium', price: '₺299' },
            ].map((tier) => (
              <div
                key={tier.name}
                className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-xs"
              >
                <span className="font-medium text-text-primary">{tier.name}</span>
                <span className="text-teal font-semibold">{tier.price}/ay</span>
              </div>
            ))}
          </div>
          {/* CTA */}
          <button className="mt-4 w-full rounded-xl bg-orange py-2.5 text-sm font-semibold text-white">
            Destekle
          </button>
        </div>
      </div>
      {/* Floating bildirim */}
      <div className="absolute -top-3 -right-4 flex items-center gap-2 rounded-xl bg-white border border-border shadow-[0_4px_12px_rgba(0,0,0,0.12)] px-3 py-2">
        <span className="text-base">🎉</span>
        <div>
          <p className="text-xs font-semibold text-text-primary leading-none">Yeni destekçi</p>
          <p className="text-[11px] text-text-muted mt-0.5">@mehmet_ · az önce</p>
        </div>
      </div>
    </div>
  );
}

/* ── Hero section ───────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <MosaicPattern />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Sol — Metin */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text-secondary shadow-sm mb-6">
              <span>🇹🇷</span>
              <span>Türkiye&apos;nin İçerik Üreticisi Platformu</span>
            </div>
            {/* H1 */}
            <h1
              className="text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-text-primary sm:text-5xl lg:text-[56px]"
            >
              Üretenin Kazandığı,
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #008080 0%, #FF5722 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Destekleyenin Yakınlaştığı Yer
              </span>
            </h1>
            {/* Subheadline */}
            <p className="mt-6 text-lg leading-[1.7] text-text-secondary max-w-xl mx-auto lg:mx-0">
              İçerik üreticileri için üyelik, dijital ürün ve topluluk.
              Hayranlar için yakınlık, özel içerik ve Türk lirası ile doğrudan destek.
            </p>
            {/* CTA çifti */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/auth/kayit/yaratici"
                className="rounded-xl bg-orange px-8 py-4 text-base font-semibold text-white hover:bg-orange-dark transition-colors duration-150 shadow-sm"
              >
                Üretici hesabı aç
              </Link>
              <Link
                href="/kesfet"
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-8 py-4 text-base font-semibold text-teal hover:bg-teal-light transition-colors duration-150"
              >
                Üreticileri keşfet
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Sağ — Mock kart */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <MockCreatorCard />
          </div>
        </div>
      </div>

      {/* Float animasyon keyframe */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
