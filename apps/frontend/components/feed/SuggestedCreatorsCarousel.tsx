'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL!;

const CATEGORY_LABEL: Record<string, string> = {
  writer: 'Yazar',
  illustrator: 'İllüstratör',
  educator: 'Eğitimci',
  podcaster: 'Podcaster',
  musician: 'Müzisyen',
  designer: 'Tasarımcı',
  developer: 'Geliştirici',
  video_creator: 'Video',
  ai_creator: 'Yapay Zeka',
  game_developer: 'Oyun Geliştiricisi',
  designer_3d: '3D Tasarımcı',
  other: 'Diğer',
};

interface SuggestedCreator {
  username: string;
  display_name: string;
  avatar_url: string | null;
  category: string | null;
}

export default function SuggestedCreatorsCarousel() {
  const [creators, setCreators] = useState<SuggestedCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/creators?limit=8`)
      .then((r) => r.json())
      .then((d: { items?: SuggestedCreator[] }) => {
        setCreators(d.items ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && creators.length === 0) return null;

  return (
    <div className="mb-8 rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Keşfedebileceğin Üreticiler</p>
        <Link href="/kesfet" className="text-xs font-medium text-primary hover:underline">
          Tümünü Gör →
        </Link>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex shrink-0 w-28 flex-col items-center gap-2 rounded-xl p-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
                <div className="h-2.5 w-14 rounded bg-gray-100 animate-pulse" />
              </div>
            ))
          : creators.map((c) => (
              <Link
                key={c.username}
                href={`/u/${c.username}`}
                className="flex shrink-0 w-28 flex-col items-center gap-1.5 rounded-xl p-3 transition-colors hover:bg-background"
              >
                <div className="h-12 w-12 overflow-hidden rounded-full border border-border bg-background">
                  {c.avatar_url ? (
                    <Image
                      src={c.avatar_url}
                      alt={c.display_name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted">
                      {c.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="w-full truncate text-center text-xs font-semibold text-foreground">
                  {c.display_name}
                </p>
                {c.category && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                    {CATEGORY_LABEL[c.category] ?? c.category}
                  </span>
                )}
              </Link>
            ))}
      </div>
    </div>
  );
}
