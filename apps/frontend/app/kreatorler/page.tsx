import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ category?: string; kategori?: string }>;
}

export default async function KreatorlerRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const kategori = params.kategori ?? params.category;
  const qs = kategori ? `?kategori=${kategori}` : '';
  redirect(`/kesfet${qs}`);
}
