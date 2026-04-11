import Link from 'next/link';

const categories = [
  {
    label: 'Yazar',
    slug: 'writer',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path
          d="M6 22l1.5-5L18 6.5a2.121 2.121 0 0 1 3 3L10 21l-4 1z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M15.5 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Çizer',
    slug: 'illustrator',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path
          d="M5 23c0-1.7 1.3-3 3-3h12c1.7 0 3 1.3 3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 5l1.5 4.5h4.5l-3.7 2.7 1.4 4.3L14 13.8l-3.7 2.7 1.4-4.3L8 9.5h4.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Podcaster',
    slug: 'podcaster',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <rect x="10" y="4" width="8" height="12" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6 16a8 8 0 0 0 16 0M14 24v-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Müzisyen',
    slug: 'musician',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path
          d="M10 20V8l14-3v12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="21" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'Tasarımcı',
    slug: 'designer',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9 14h10M14 9v10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Eğitimci',
    slug: 'educator',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path
          d="M4 9l10-5 10 5-10 5-10-5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M4 9v8M24 9v5a10 10 0 0 1-20 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Geliştirici',
    slug: 'developer',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <path
          d="M9 10l-4 4 4 4M19 10l4 4-4 4M16 7l-4 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Diğer',
    slug: '',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14 10v4l3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Kategoriler() {
  return (
    <section className="py-24 sm:py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-[28px] font-bold tracking-[-0.01em] text-text-primary sm:text-[40px]">
            Her İçerik Üreticisine Yer Var
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Kategoriye göre keşfet, ilham al
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const href = cat.slug
              ? `/ureticilere?kategori=${cat.slug}`
              : '/ureticilere';
            return (
              <Link
                key={cat.slug || 'diger'}
                href={href}
                className="group flex flex-col items-center gap-3 rounded-[20px] border border-border bg-white p-6 text-center transition-all duration-200 hover:border-teal hover:bg-teal hover:text-white cursor-pointer"
              >
                <div className="text-text-secondary group-hover:text-white transition-colors">
                  {cat.icon}
                </div>
                <span className="text-[15px] font-semibold text-text-primary group-hover:text-white transition-colors">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
