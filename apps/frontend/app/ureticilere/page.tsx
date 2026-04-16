import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function UreticilereRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const qs = params.kategori ? `?kategori=${params.kategori}` : '';
  redirect(`/kesfet${qs}`);
}
