import type { Metadata } from 'next';
import CreatorsClient from './_components/creators-client';
import type { CreatorCardItem } from '@/app/_components/creator-card';

export const metadata: Metadata = {
  title: 'Kreatörler — lalabits.art',
  description: 'Türkiye\'nin yaratıcılarını keşfet. Sanatçılar, yazarlar, eğitimciler ve daha fazlası.',
};

const API = process.env.NEXT_PUBLIC_API_URL!;

const VALID_CATEGORIES = [
  'writer', 'illustrator', 'educator', 'podcaster',
  'musician', 'designer', 'developer', 'other',
];

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

interface CreatorsResponse {
  items: CreatorCardItem[];
  total: number;
  page: number;
  limit: number;
}

async function fetchInitialCreators(category?: string): Promise<CreatorsResponse> {
  const fallback: CreatorsResponse = { items: [], total: 0, page: 1, limit: 20 };
  try {
    const params = new URLSearchParams({ page: '1', limit: '20' });
    if (category) params.set('category', category);
    const res = await fetch(`${API}/creators?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as CreatorsResponse;
  } catch {
    return fallback;
  }
}

export default async function KreatorlerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category =
    params.category && VALID_CATEGORIES.includes(params.category)
      ? params.category
      : undefined;

  const initialData = await fetchInitialCreators(category);

  return (
    <main className="px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-8">Kreatörler</h1>
      <CreatorsClient initialData={initialData} initialCategory={category} />
    </main>
  );
}
