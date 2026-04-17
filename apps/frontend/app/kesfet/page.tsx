import type { Metadata } from 'next';
import KesfetClient from './_components/kesfet-client';

export const metadata: Metadata = {
  title: "İçerik Üreticilerini Keşfet — lalabits.art",
  description:
    "Türkiye'nin içerik üreticilerini keşfet. Yazarlar, çizerler, eğitimciler, podcastçılar ve daha fazlası.",
};

const API = process.env.NEXT_PUBLIC_API_URL!;

const VALID_CATEGORIES = [
  'writer', 'illustrator', 'educator', 'podcaster',
  'musician', 'designer', 'developer',
  'video_creator', 'ai_creator', 'game_developer', 'other',
];

interface PageProps {
  searchParams: Promise<{ kategori?: string }>;
}

interface UreticilerResponse {
  items: {
    username: string | null;
    display_name: string;
    bio: string | null;
    avatar_url: string | null;
    category: string;
  }[];
  total: number;
  page: number;
  limit: number;
}

async function fetchInitial(category?: string): Promise<UreticilerResponse> {
  const fallback: UreticilerResponse = { items: [], total: 0, page: 1, limit: 20 };
  try {
    const params = new URLSearchParams({ page: '1', limit: '20' });
    if (category) params.set('category', category);
    const res = await fetch(`${API}/creators?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as UreticilerResponse;
  } catch {
    return fallback;
  }
}

export default async function KesfetPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category =
    params.kategori && VALID_CATEGORIES.includes(params.kategori)
      ? params.kategori
      : undefined;

  const initialData = await fetchInitial(category);

  return (
    <main className="bg-background min-h-screen">
      <section className="bg-white border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-[36px] font-bold tracking-[-0.02em] text-text-primary sm:text-[48px]">
            İçerik Üreticilerini Keşfet
          </h1>
          <p className="mt-3 text-lg text-text-secondary max-w-xl">
            Türkiye&apos;nin içerik üreticilerini keşfet, destekle ve topluluğun parçası ol.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <KesfetClient initialData={initialData} initialCategory={category} />
      </div>
    </main>
  );
}
