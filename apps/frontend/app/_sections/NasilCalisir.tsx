const steps = [
  {
    number: '1',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <path
          d="M6 26V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v18l-10-4-10 4z"
          stroke="#008080"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 12h10M11 16h6"
          stroke="#008080"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Sayfanı Oluştur',
    desc: 'Profilini oluştur, kademe ve fiyatlarını belirle. Türkçe arayüz, 5 dakikada hazır.',
  },
  {
    number: '2',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="#008080" strokeWidth="2" />
        <path
          d="M16 10v6l4 4"
          stroke="#008080"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 4l4 4-4 4"
          stroke="#FF5722"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'İçeriğini Paylaş',
    desc: 'Yazı, ses, video, dosya — her formatta üyelere özel içerik yayınla.',
  },
  {
    number: '3',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <path
          d="M8 20h16M12 16h8M10 12h12"
          stroke="#008080"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="8" r="3" fill="#FF5722" opacity="0.8" />
        <path
          d="M16 26v-6"
          stroke="#008080"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Türkiye'den Kazan",
    desc: 'IBAN, Papara, Türk kartı ile doğrudan tahsilat. Döviz kaybı yok.',
  },
];

export default function NasilCalisir() {
  return (
    <section className="bg-teal-light py-24 lg:py-24 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-[28px] font-bold tracking-[-0.01em] text-text-primary sm:text-[40px]">
            3 Adımda Başla
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Dakikalar içinde kurulum, ömür boyu kazanç
          </p>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Bağlantı çizgileri (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(33.333%+0px)] right-[calc(33.333%+0px)] h-px bg-teal/20" />

          {steps.map((step, i) => (
            <div key={i} className="relative bg-white rounded-[20px] p-8 border border-teal/10 shadow-sm text-center">
              {/* Numara */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-teal flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {step.number}
              </div>
              {/* İkon */}
              <div className="flex justify-center mt-4 mb-5">
                {step.icon}
              </div>
              {/* Metin */}
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-base text-text-secondary leading-[1.7]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
