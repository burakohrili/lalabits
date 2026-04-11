import type { Metadata } from 'next';
import Hero from './_sections/Hero';
import NasilCalisir from './_sections/NasilCalisir';
import OncuUreticiler from './_sections/OncuUreticiler';
import OzellikOzeti from './_sections/OzellikOzeti';
import Rakamlar from './_sections/Rakamlar';
import Kategoriler from './_sections/Kategoriler';
import FinalCTA from './_sections/FinalCTA';

export const metadata: Metadata = {
  title: "lalabits.art — Türkiye'nin İçerik Platformu",
  description:
    "Üyelik, dijital ürün ve içerik ile Türk destekçilerinden doğrudan kazan. Türkiye'nin içerik üreticisi platformu.",
  openGraph: {
    title: "lalabits.art — Türkiye'nin İçerik Platformu",
    description:
      "Üyelik, dijital ürün ve içerik ile Türk destekçilerinden doğrudan kazan.",
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <NasilCalisir />
      <OncuUreticiler />
      <OzellikOzeti />
      <Rakamlar />
      <Kategoriler />
      <FinalCTA />
    </main>
  );
}
