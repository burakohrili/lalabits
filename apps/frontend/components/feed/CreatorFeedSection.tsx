'use client';

import Link from 'next/link';
import Image from 'next/image';
import FeedPostCard from './FeedPostCard';
import type { FeedPost } from './types';

interface Creator {
  username: string;
  display_name: string;
  avatar_url: string | null;
}

interface CreatorFeedSectionProps {
  creator: Creator;
  posts: FeedPost[];
}

export default function CreatorFeedSection({ creator, posts }: CreatorFeedSectionProps) {
  if (posts.length === 0) return null;

  const [first, ...rest] = posts;
  const secondary = rest.slice(0, 2);

  return (
    <section className="mb-8">
      {/* Creator header */}
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-background">
          {creator.avatar_url ? (
            <Image
              src={creator.avatar_url}
              alt={creator.display_name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
              sizes="40px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted">
              {creator.display_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{creator.display_name}</p>
          <p className="text-xs text-muted">@{creator.username}</p>
        </div>
        <Link
          href={`/u/${creator.username}`}
          className="shrink-0 text-xs font-medium text-primary hover:underline"
        >
          Tümünü Gör →
        </Link>
      </div>

      {/* Post grid */}
      {posts.length === 1 && (
        <FeedPostCard post={first} featured={false} />
      )}

      {posts.length === 2 && (
        <div className="grid grid-cols-2 gap-3">
          <FeedPostCard post={first} />
          <FeedPostCard post={rest[0]} />
        </div>
      )}

      {posts.length >= 3 && (
        <div className="flex flex-col gap-3">
          <FeedPostCard post={first} featured={true} />
          <div className="grid grid-cols-2 gap-3">
            {secondary.map((p) => (
              <FeedPostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
