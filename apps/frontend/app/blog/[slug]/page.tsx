import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  published_at: string | null;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as BlogPost;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Blog — lalabits.art' };
  return {
    title: `${post.title} — lalabits.art`,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors mb-8 inline-block">
          ← Blog
        </Link>

        {post.cover_image_url && (
          <div className="mb-8 overflow-hidden rounded-2xl aspect-video bg-gray-100 relative">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-foreground mb-4">{post.title}</h1>

        <div className="flex items-center gap-2 text-sm text-muted mb-8">
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

        {post.excerpt && (
          <p className="text-base text-muted italic leading-relaxed mb-8 border-l-2 border-primary pl-4">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>
    </main>
  );
}
