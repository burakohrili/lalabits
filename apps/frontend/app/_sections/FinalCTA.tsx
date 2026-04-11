import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section
      className="py-24 sm:py-16"
      style={{ background: 'linear-gradient(180deg, #e0f2f1 0%, #F8F9FA 100%)' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-[28px] font-bold tracking-[-0.01em] text-text-primary sm:text-[40px]">
            Hangi Yoldasın?
          </h2>
        </div>

        {/* 2 Kart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Kart A — Üretici */}
          <div className="flex flex-col bg-white border-2 border-teal rounded-[20px] p-8 shadow-sm">
            <h3 className="text-[22px] font-bold text-text-primary leading-tight">
              İçerik Üreticisi Olarak Başla
            </h3>
            <p className="mt-3 text-base text-text-secondary leading-[1.7]">
              Sayfanı oluştur, kademelerini belirle, Türk destekçilerinden kazanmaya başla.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                'Ücretsiz kurulum',
                'Türk ödeme yöntemleri',
                'Türkçe destek',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-light text-teal">
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/kayit/uretici"
              className="mt-8 w-full rounded-xl bg-orange py-3.5 text-center text-sm font-semibold text-white hover:bg-orange-dark transition-colors duration-150"
            >
              Üretici hesabı aç
            </Link>
          </div>

          {/* Kart B — Destekçi */}
          <div className="flex flex-col bg-teal-light border-2 border-teal/20 rounded-[20px] p-8">
            <h3 className="text-[22px] font-bold text-text-primary leading-tight">
              Favori Üreticini Destekle
            </h3>
            <p className="mt-3 text-base text-text-secondary leading-[1.7]">
              Türkiye&apos;nin en iyi içerik üreticilerini keşfet ve doğrudan destek ver.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                'Özel içeriklere eriş',
                'Topluluğun parçası ol',
                'Türk lirası ile öde',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/20 text-teal">
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/ureticilere"
              className="mt-8 w-full rounded-xl border-2 border-teal py-3.5 text-center text-sm font-semibold text-teal hover:bg-teal hover:text-white transition-colors duration-150"
            >
              Üreticileri keşfet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
