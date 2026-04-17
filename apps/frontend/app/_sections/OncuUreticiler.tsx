import Link from 'next/link';

interface CreatorItem {
  username: string | null;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  writer: 'Yazar',
  illustrator: 'Çizer / İllüstratör',
  educator: 'Eğitimci',
  podcaster: 'Podcastçı',
  musician: 'Müzisyen',
  designer: 'Tasarımcı',
  developer: 'Geliştirici',
  video_creator: 'Video Üreticisi',
  ai_creator: 'Yapay Zekâ Üreticisi',
  game_developer: 'Oyun Geliştirici',
  designer_3d: '3D Tasarımcı',
  other: 'Diğer',
};

async function fetchCreators(): Promise<CreatorItem[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return [];
    const res = await fetch(`${api}/creators?sort=newest&limit=6`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: CreatorItem[] };
    return data.items;
  } catch {
    return [];
  }
}

function UreticiKart({ item }: { item: CreatorItem }) {
  const href = item.username ? `/u/${item.username}` : '#';
  const label = CATEGORY_LABELS[item.category] ?? item.category;
  const initial = item.display_name.charAt(0).toUpperCase();

  return (
    <div className="group relative flex flex-col bg-white border border-border rounded-[20px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:scale-[1.01] transition-all duration-300">
      {/* Cover */}
      <div className="h-[200px] bg-gradient-to-br from-teal-light to-teal/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg viewBox="0 0 100 100" className="h-32 w-32">
            <rect x="10" y="10" width="35" height="35" rx="4" fill="#008080" />
            <rect x="55" y="55" width="35" height="35" rx="4" fill="#FF5722" />
            <rect x="55" y="10" width="35" height="35" rx="4" fill="#008080" opacity="0.5" />
          </svg>
        </div>
      </div>
      {/* Avatar */}
      <div className="px-5 -mt-8">
        {item.avatar_url ? (
          <img
            src={item.avatar_url}
            alt={item.display_name}
            className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-sm"
          />
        ) : (
          <div className="h-16 w-16 rounded-full border-4 border-white bg-teal flex items-center justify-center text-white text-xl font-bold shadow-sm">
            {initial}
          </div>
        )}
      </div>
      {/* İçerik */}
      <div className="flex flex-col flex-1 px-5 pt-3 pb-5">
        <div className="flex items-start gap-2 justify-between">
          <p className="font-semibold text-text-primary text-base leading-tight">{item.display_name}</p>
          <span className="shrink-0 rounded-full bg-teal-light text-teal text-xs font-medium px-2.5 py-0.5">
            {label}
          </span>
        </div>
        {item.bio && (
          <p className="mt-2 text-sm text-text-secondary line-clamp-2 leading-[1.6]">{item.bio}</p>
        )}
        <Link
          href={href}
          className="mt-4 rounded-xl border border-border py-2.5 text-center text-sm font-semibold text-text-primary hover:border-teal hover:text-teal transition-colors duration-150 opacity-0 group-hover:opacity-100"
        >
          Keşfet
        </Link>
      </div>
    </div>
  );
}

export default async function OncuUreticiler() {
  const creators = await fetchCreators();

  if (creators.length === 0) return null;

  return (
    <section className="py-24 sm:py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        {/* Başlık */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-[28px] font-bold tracking-[-0.01em] text-text-primary sm:text-[40px]">
              Türkiye&apos;nin İçerik Üreticileri
            </h2>
            <p className="mt-2 text-lg text-text-secondary">
              Platformdaki yetenekli üreticileri keşfet
            </p>
          </div>
          <Link
            href="/kesfet"
            className="shrink-0 text-sm font-semibold text-teal hover:underline"
          >
            Tüm üreticileri keşfet →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((c) => (
            <UreticiKart key={c.username ?? c.display_name} item={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
