import Link from 'next/link';
import type { Metadata } from 'next';
import CreatorCard, { type CreatorCardItem } from './_components/creator-card';
import HeroSecondaryCTA from './_components/hero-secondary-cta';

export const metadata: Metadata = {
  title: 'lalabits.art — Yaratıcılarını Destekle',
  description:
    "Türkiye'nin yaratıcı platformu. Sanatçıları, yazarları, eğitimcileri ve müzisyenleri destekle; içeriklerine ve ürünlerine eriş.",
};

const API = process.env.NEXT_PUBLIC_API_URL!;

const CATEGORY_LABELS: Record<string, string> = {
  writer: 'Yazar',
  illustrator: 'Çizer',
  educator: 'Eğitimci',
  podcaster: 'Podcastçı',
  musician: 'Müzisyen',
  designer: 'Tasarımcı',
  developer: 'Geliştirici',
  other: 'Diğer',
};

const CATEGORIES = Object.entries(CATEGORY_LABELS);

async function fetchNewestCreators(): Promise<CreatorCardItem[]> {
  try {
    const res = await fetch(`${API}/creators?sort=newest&limit=8`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: CreatorCardItem[] };
    return data.items;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const creators = await fetchNewestCreators();

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="px-4 py-20 text-center max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-foreground leading-tight sm:text-5xl">
          Yaratıcılarını<br />Destekle
        </h1>
        <p className="mt-4 text-base text-muted max-w-lg mx-auto">
          Türkiye&apos;nin yaratıcılarına doğrudan destek ver. Üyelik planlarına abone ol,
          dijital içeriklere eriş, sanatçılarla birlikte büy.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/kreatorler"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Kreatörleri Keşfet
          </Link>
          <HeroSecondaryCTA />
        </div>
      </section>

      {/* Creator showcase */}
      {creators.length > 0 && (
        <section className="px-4 pb-16 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Yeni Katılanlar</h2>
            <Link
              href="/kreatorler"
              className="text-sm font-medium text-primary hover:underline"
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creators.map((c) => (
              <CreatorCard key={c.username} item={c} />
            ))}
          </div>
        </section>
      )}

      {/* Category quick links */}
      <section className="px-4 pb-20 max-w-6xl mx-auto w-full">
        <h2 className="text-lg font-semibold text-foreground mb-6">Kategoriye Göre Keşfet</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(([value, label]) => (
            <Link
              key={value}
              href={`/kreatorler?category=${value}`}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 text-center text-xs text-muted">
        <p>
          © {new Date().getFullYear()} lalabits.art
          {' · '}
          <Link href="/legal/gizlilik" className="hover:underline">Gizlilik</Link>
          {' · '}
          <Link href="/legal/kullanim-kosullari" className="hover:underline">Kullanım Koşulları</Link>
        </p>
      </footer>
    </main>
  );
}
