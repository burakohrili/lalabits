import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rehberler — lalabits.art',
  description:
    'İçerik üreticileri ve destekçiler için kapsamlı platform rehberi. Başlangıçtan kazanca, üyelikten içerik yayınlamaya tüm sorularının cevabı.',
};

export default function RehberlerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
