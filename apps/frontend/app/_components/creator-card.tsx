import Link from 'next/link';

export interface CreatorCardItem {
  username: string | null;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  category: string;
  content_format_tags: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  writer: 'Yazar',
  illustrator: 'Çizer',
  educator: 'Eğitimci',
  podcaster: 'Podcastçı',
  musician: 'Müzisyen',
  designer: 'Tasarımcı',
  developer: 'Geliştirici',
  other: 'Diğer',
};

export default function CreatorCard({ item }: { item: CreatorCardItem }) {
  const href = item.username ? `/u/${item.username}` : '#';
  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-5 gap-3">
      <div className="flex items-center gap-3">
        {item.avatar_url ? (
          <img
            src={item.avatar_url}
            alt={item.display_name}
            className="h-12 w-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-teal shrink-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-white">
              {item.display_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{item.display_name}</p>
          {item.username && (
            <p className="text-xs text-muted truncate">@{item.username}</p>
          )}
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-teal-light text-teal px-2.5 py-0.5 text-xs font-medium">
          {categoryLabel}
        </span>
      </div>

      {item.bio && (
        <p className="text-xs text-muted line-clamp-2">{item.bio}</p>
      )}

      <Link
        href={href}
        className="mt-auto rounded-lg border border-border px-4 py-2 text-center text-xs font-medium text-foreground hover:bg-background transition-colors"
      >
        Profilini Gör
      </Link>
    </div>
  );
}
