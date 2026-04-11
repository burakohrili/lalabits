import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function KreatorlerRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const qs = params.category ? `?kategori=${params.category}` : '';
  redirect(`/ureticilere${qs}`);
}
