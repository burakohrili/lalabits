import Link from 'next/link';

export const metadata = {
  title: 'Kaynaklar — lalabits.art',
  description: 'İçerik üreticileri için rehberler, başarı hikayeleri ve ipuçları.',
};

const GUIDES = [
  {
    title: 'Üretici Olarak Başlarken',
    description: 'Profilini kur, ilk üyelik planını oluştur ve ilk destekçini kazan.',
    href: '/blog/uretici-olarak-baslarken',
  },
  {
    title: 'Üyelik Planlarını Ayarlama',
    description: 'Farklı fiyat ve erişim seviyelerinde planlar nasıl oluşturulur?',
    href: '/blog/uyelik-planlari-rehberi',
  },
  {
    title: 'Premium İçerik Paylaşma',
    description: 'Tier\'lara özel gönderiler, koleksiyonlar ve ürünler nasıl yönetilir?',
    href: '/blog/premium-icerik-rehberi',
  },
  {
    title: 'Topluluğunu Büyütme',
    description: 'Destekçi sayını artırmak için kanıtlanmış stratejiler.',
    href: '/blog/topluluk-buyutme',
  },
];

const SUCCESS_STORIES = [
  {
    name: 'Elif K.',
    category: 'Illüstratör',
    highlight: '6 ayda 200 destekçiye ulaştı',
    href: '/blog/elif-basari-hikayesi',
  },
  {
    name: 'Mert A.',
    category: 'Podcast Üreticisi',
    highlight: 'Aylık gelirini dijital içerikle ikiye katladı',
    href: '/blog/mert-basari-hikayesi',
  },
  {
    name: 'Selin B.',
    category: 'Fotoğrafçı',
    highlight: 'Ücretsiz takipçilerini ücretli üyelere dönüştürdü',
    href: '/blog/selin-basari-hikayesi',
  },
];

export default function KaynaklatPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-foreground">Kaynaklar</h1>
        <p className="mt-3 text-base text-muted max-w-lg mx-auto">
          İçerik üreticileri için rehberler, ipuçları ve başarı hikayeleri.
        </p>
      </div>

      {/* Rehberler */}
      <section className="mb-12">
        <h2 className="mb-5 text-lg font-bold text-foreground">Rehberler</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="rounded-2xl border border-border bg-surface p-5 hover:border-primary/40 transition-colors"
            >
              <p className="text-sm font-semibold text-foreground">{guide.title}</p>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">{guide.description}</p>
              <p className="mt-3 text-xs font-medium text-primary">Okumaya devam et →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Başarı hikayeleri */}
      <section className="mb-12">
        <h2 className="mb-5 text-lg font-bold text-foreground">Başarı Hikayeleri</h2>
        <div className="flex flex-col gap-3">
          {SUCCESS_STORIES.map((story) => (
            <Link
              key={story.href}
              href={story.href}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 hover:border-primary/40 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{story.name}</p>
                <p className="text-xs text-muted">{story.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-primary">{story.highlight}</p>
                <p className="mt-0.5 text-xs text-muted">Hikayeyi oku →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-primary/5 border border-primary/20 px-8 py-10 text-center">
        <h2 className="text-lg font-bold text-foreground mb-2">Hazır mısın?</h2>
        <p className="text-sm text-muted mb-6">
          Üretici hesabı oluştur ve destekçilerinden gelir kazanmaya başla.
        </p>
        <Link
          href="/auth/kayit?rol=uretici"
          className="inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Üretici Ol
        </Link>
      </section>
    </main>
  );
}
