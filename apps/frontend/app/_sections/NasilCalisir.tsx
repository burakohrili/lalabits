'use client';

import { useState } from 'react';

const ureticiSteps = [
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
        <path d="M11 12h10M11 16h6" stroke="#008080" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Sayfanı Oluştur',
    desc: 'Profilini kur, üyelik kademelerini ve fiyatlarını belirle. Türkçe arayüz, 5 dakikada hazır.',
  },
  {
    number: '2',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="7" width="22" height="18" rx="3" stroke="#008080" strokeWidth="2" />
        <path d="M11 14h10M11 18h6" stroke="#008080" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M24 4l4 4-4 4"
          stroke="#FF5722"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'İçeriğini Yayınla',
    desc: 'Yazı, ses, video, PDF — üyelere özel veya herkese açık içerik yayınla. Her format destekleniyor.',
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
        <circle cx="16" cy="8" r="3" fill="#FF5722" fillOpacity="0.8" />
        <path d="M16 26v-6" stroke="#008080" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Türk Lirası ile Kazan',
    desc: 'IBAN\'ına doğrudan transfer. Döviz kaybı yok, aracı yok, her ay düzenli tahsilat.',
  },
];

const destekciSteps = [
  {
    number: '1',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="#008080" strokeWidth="2" />
        <path d="M12 16h8M16 12v8" stroke="#008080" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M22 8l3-3M10 8 7 5M22 24l3 3M10 24l-3 3"
          stroke="#FF5722"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Üreticiyi Keşfet',
    desc: 'Yazar, podcaster, müzisyen, eğitimci — kategoriye göre filtrele, ilgini çeken üreticiyi bul.',
  },
  {
    number: '2',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke="#008080" strokeWidth="2" />
        <path
          d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10"
          stroke="#008080"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M22 20l2 2 4-4"
          stroke="#FF5722"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Üye Ol ya da Takip Et',
    desc: 'Ücretsiz takip et veya tercih ettiğin kademeye Türk lirası ile abone ol. İstediğin zaman iptal.',
  },
  {
    number: '3',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="18" rx="3" stroke="#008080" strokeWidth="2" />
        <path
          d="M10 17l4 4 8-8"
          stroke="#FF5722"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 8V6M22 8V6" stroke="#008080" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Özel İçeriklere Eriş',
    desc: 'Üyelik kademene göre özel içerikler, arşiv ve topluluk sohbeti — hepsi tek bir yerde.',
  },
];

export default function NasilCalisir() {
  const [active, setActive] = useState<'uretici' | 'destekci'>('uretici');
  const steps = active === 'uretici' ? ureticiSteps : destekciSteps;

  return (
    <section id="nasil-calisir" className="bg-teal-light py-24 lg:py-24 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Başlık */}
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-bold tracking-[-0.01em] text-text-primary sm:text-[40px]">
            Nasıl Çalışır?
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Hem üreticiler hem destekçiler için 3 adımda başlangıç.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl bg-white border border-teal/20 p-1 shadow-sm">
            <button
              onClick={() => setActive('uretici')}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                active === 'uretici'
                  ? 'bg-teal text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              İçerik Üreticisi İçin
            </button>
            <button
              onClick={() => setActive('destekci')}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                active === 'destekci'
                  ? 'bg-teal text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Destekçi İçin
            </button>
          </div>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-[52px] left-[calc(33.333%+0px)] right-[calc(33.333%+0px)] h-px bg-teal/20" />

          {steps.map((step, i) => (
            <div key={i} className="relative bg-white rounded-[20px] p-8 border border-teal/10 shadow-sm text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-teal flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {step.number}
              </div>
              <div className="flex justify-center mt-4 mb-5">{step.icon}</div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">{step.title}</h3>
              <p className="text-base text-text-secondary leading-[1.7]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
