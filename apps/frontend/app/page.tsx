import type { Metadata } from 'next';
import Hero from './_sections/Hero';
import DestekModeli from './_sections/DestekModeli';
import HayraNeden from './_sections/HayraNeden';
import NasilCalisir from './_sections/NasilCalisir';
import OzellikOzeti from './_sections/OzellikOzeti';
import Kategoriler from './_sections/Kategoriler';
import GuvenSeridi from './_sections/GuvenSeridi';
import FinalCTA from './_sections/FinalCTA';

export const metadata: Metadata = {
  title: "lalabits.art — Türkiye'nin İçerik Üreticisi Platformu",
  description:
    "Üyelik, dijital ürün ve içerik ile destekçilerinden doğrudan Türk lirası kazanmaya başla. Hayranlar için yakınlık, özel içerik ve topluluk.",
  openGraph: {
    title: "lalabits.art — Türkiye'nin İçerik Üreticisi Platformu",
    description:
      "İçerik üreticileri için üyelik ve dijital ürün platformu. Hayranlar için özel içerik ve topluluk erişimi.",
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <DestekModeli />
      <HayraNeden />
      <NasilCalisir />
      <OzellikOzeti />
      <Kategoriler />
      <GuvenSeridi />
      <FinalCTA />
    </main>
  );
}
