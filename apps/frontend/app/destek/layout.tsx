import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destek Merkezi — lalabits.art',
  description: 'Sık sorulan sorular, rehberler ve destek ekibine ulaşma yolları.',
};

export default function DestekLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
