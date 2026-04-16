import Link from 'next/link';

const items = [
  {
    icon: (
      <svg className="h-7 w-7 shrink-0" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 3l9 4v7c0 5.5-3.9 10.6-9 12C8.9 24.6 5 19.5 5 14V7l9-4z"
          stroke="#008080"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="#008080"
          fillOpacity="0.08"
        />
        <path
          d="M9 14l3 3 6-6"
          stroke="#008080"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Türk Lirası ile Tahsilat',
    desc: 'IBAN\'ına doğrudan transfer. Döviz çevirme yok, dolar kaybı yok.',
  },
  {
    icon: (
      <svg className="h-7 w-7 shrink-0" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="20" height="14" rx="3" stroke="#008080" strokeWidth="1.6" fill="#008080" fillOpacity="0.08" />
        <path d="M4 12h20" stroke="#008080" strokeWidth="1.6" />
        <path d="M8 17h4M8 19.5h2" stroke="#008080" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M14 6V4M18 8V5M10 8V5" stroke="#FF5722" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Şeffaf Komisyon',
    desc: 'Oranlar sabit ve açık. Yalnızca kazandığında komisyon kesilir, başka ücret yok.',
  },
  {
    icon: (
      <svg className="h-7 w-7 shrink-0" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="4" width="18" height="22" rx="3" stroke="#008080" strokeWidth="1.6" fill="#008080" fillOpacity="0.08" />
        <path d="M9 10h10M9 14h10M9 18h6" stroke="#008080" strokeWidth="1.4" strokeLinecap="round" />
        <path
          d="M19 19l2 2 3-3"
          stroke="#FF5722"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'KVKK Uyumu',
    desc: 'Kişisel veriler Türkiye mevzuatına göre korunuyor. Şeffaf gizlilik politikası.',
  },
  {
    icon: (
      <svg className="h-7 w-7 shrink-0" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="5" stroke="#008080" strokeWidth="1.6" fill="#008080" fillOpacity="0.08" />
        <path
          d="M5 24c0-5 4-9 9-9s9 4 9 9"
          stroke="#008080"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M22 16l1.5 1.5L26 15"
          stroke="#FF5722"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Türkçe Destek',
    desc: 'Tüm sorularınız için Türkçe yanıt. Yabancı platformlarda kaybolmak yok.',
  },
];

export default function GuvenSeridi() {
  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-2">
            Türkiye için inşa edildi
          </p>
          <h2 className="text-[22px] font-bold tracking-[-0.01em] text-text-primary sm:text-[30px]">
            Güven ve Şeffaflık
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 rounded-[16px] bg-white border border-border p-5">
              {item.icon}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-[1.6]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-text-muted">
          Komisyon oranları ve fiyatlandırma hakkında detaylar için{' '}
          <Link href="/fiyatlar" className="text-teal underline underline-offset-2 hover:text-teal/80">
            Fiyatlar
          </Link>{' '}
          sayfasını incele.
        </p>
      </div>
    </section>
  );
}
