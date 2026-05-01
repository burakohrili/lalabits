import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Blog — lalabits.art',
  description: 'lalabits.art blogu — içerik üreticileri için ipuçları, haberler ve ilham.',
};

const API = process.env.NEXT_PUBLIC_API_URL!;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string;
  published_at: string | null;
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API}/blog?limit=30`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: BlogPost[] };
    return data.items;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <main className="bg-background min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-light mb-8">
          <svg className="h-10 w-10 text-teal" viewBox="0 0 40 40" fill="none">
            <path d="M8 32V10a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v22l-12-5-12 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 16h12M14 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-[32px] font-bold text-text-primary tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-text-secondary max-w-md leading-[1.7] mb-8">
          İçerik üreticileri için ipuçları, platform haberleri ve ilham verici hikayeler yakında burada.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-teal px-8 py-3 text-sm font-semibold text-white hover:bg-teal-dark transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Blog</h1>
          <p className="text-muted text-lg">İçerik üreticileri için ipuçları, haberler ve ilham.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-primary/40 transition-colors"
            >
              {post.cover_image_url && (
                <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{post.author_name}</span>
                  {post.published_at && (
                    <>
                      <span>·</span>
                      <span>
                        {new Date(post.published_at).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
