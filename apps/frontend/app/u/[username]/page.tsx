'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Product {
  id: string;
  title: string;
  description: string;
  price_try: number;
  original_filename: string;
  content_type: string;
}

interface Collection {
  id: string;
  title: string;
  description: string;
  access_type: 'purchase' | 'tier_gated';
  price_try: number | null;
  item_count: number;
}

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price_monthly_try: number;
  tier_rank: number;
  perks: string[];
}

interface SocialLinks {
  youtube?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  discord?: string | null;
  tiktok?: string | null;
  website?: string | null;
}

interface CreatorPublicProfile {
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  category: string;
  content_format_tags: string[];
  social_links: SocialLinks | null;
  products: Product[];
  collections: Collection[];
  plans: Plan[];
}

interface MembershipStatus {
  subscribed: boolean;
  subscription_id?: string;
  plan_id?: string;
  plan_name?: string;
  status?: string;
  current_period_end?: string;
}

interface PostFeedItem {
  id: string;
  title: string;
  access_level: 'public' | 'member_only' | 'tier_gated';
  required_tier_id: string | null;
  cta_plan_id: string | null;
  published_at: string | null;
  locked: boolean;
  teaser: string | null;
  content: { type: string; body: string } | null;
}

export default function CreatorPublicPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user, accessToken, status: authStatus } = useAuth();

  const [profile, setProfile] = useState<CreatorPublicProfile | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
  const [posts, setPosts] = useState<PostFeedItem[]>([]);

  useEffect(() => {
    if (!username) return;
    async function load() {
      try {
        const res = await fetch(`${API}/creators/${username}`);
        if (!res.ok) { setNotFoundState(true); return; }
        const data = (await res.json()) as CreatorPublicProfile;
        setProfile(data);
      } catch {
        setNotFoundState(true);
      }
    }
    void load();
  }, [username]);

  // Fetch feed once profile is loaded and auth is resolved
  useEffect(() => {
    if (!username || authStatus === 'loading') return;
    async function loadFeed() {
      const headers: Record<string, string> = {};
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
      try {
        const res = await fetch(`${API}/feed/${username}`, { headers });
        if (res.ok) {
          const data = (await res.json()) as { items: PostFeedItem[] };
          setPosts(data.items);
        }
      } catch {
        // Feed errors are non-fatal — silently ignore
      }
    }
    void loadFeed();
  }, [username, authStatus, accessToken]);

  // Fetch purchase status + membership status once profile + auth are ready
  useEffect(() => {
    if (!profile || authStatus === 'loading' || !accessToken) return;

    const purchasableProductIds = profile.products.map((p) => p.id);
    const purchasableCollectionIds = profile.collections
      .filter((c) => c.access_type === 'purchase' && c.price_try != null)
      .map((c) => c.id);

    const allItems = [
      ...purchasableProductIds.map((id) => ({ id, param: `product_id=${id}` })),
      ...purchasableCollectionIds.map((id) => ({ id, param: `collection_id=${id}` })),
    ];

    async function fetchStatuses() {
      const promises: Promise<void>[] = [];

      if (allItems.length > 0) {
        promises.push(
          Promise.allSettled(
            allItems.map(({ param }) =>
              fetch(`${API}/checkout/status?${param}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              }).then((r) => (r.ok ? (r.json() as Promise<{ purchased: boolean }>) : { purchased: false }))
            )
          ).then((results) => {
            const purchased = new Set<string>();
            results.forEach((result, i) => {
              if (result.status === 'fulfilled' && result.value.purchased) {
                purchased.add(allItems[i].id);
              }
            });
            setPurchasedIds(purchased);
          })
        );
      }

      // Membership status — only if plans exist and viewer is not the creator
      const isOwn = !!user?.creator_profile?.username && user.creator_profile.username === username;
      if ((profile?.plans?.length ?? 0) > 0 && !isOwn) {
        promises.push(
          fetch(`${API}/membership/status?creator_username=${username}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
            .then((r) => (r.ok ? (r.json() as Promise<MembershipStatus>) : null))
            .then((data) => { if (data) setMembershipStatus(data); })
            .catch(() => {})
        );
      }

      await Promise.allSettled(promises);
    }

    void fetchStatuses();
  }, [profile, authStatus, accessToken, username, user]);

  const isOwnPage =
    !!user?.creator_profile?.username && user.creator_profile.username === username;

  function ProductCta({ productId }: { productId: string }) {
    if (isOwnPage) return null;
    if (purchasedIds.has(productId)) {
      return (
        <span className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted">
          Zaten Sahipsiniz
        </span>
      );
    }
    return (
      <Link
        href={`/satin-al/urun/${productId}`}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
      >
        Satın Al
      </Link>
    );
  }

  function CollectionCta({ collection }: { collection: Collection }) {
    if (collection.access_type !== 'purchase' || collection.price_try == null) return null;
    if (isOwnPage) return null;
    if (purchasedIds.has(collection.id)) {
      return (
        <span className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted">
          Zaten Sahipsiniz
        </span>
      );
    }
    return (
      <Link
        href={`/satin-al/koleksiyon/${collection.id}`}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
      >
        Satın Al
      </Link>
    );
  }

  function PlanCta({ plan }: { plan: Plan }) {
    if (isOwnPage) return null;
    if (membershipStatus?.subscribed && membershipStatus.plan_id === plan.id) {
      return (
        <span className="rounded-lg border border-primary/40 px-4 py-2 text-sm text-primary">
          Üyesiniz
        </span>
      );
    }
    if (membershipStatus?.subscribed) {
      return (
        <span className="rounded-lg border border-border px-4 py-2 text-sm text-muted">
          Farklı Plana Üyesiniz
        </span>
      );
    }
    function handleSubscribeClick() {
      router.push(`/abonelik/${plan.id}`);
    }
    return (
      <button
        type="button"
        onClick={handleSubscribeClick}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        Abone Ol
      </button>
    );
  }

  function PostCard({ post }: { post: PostFeedItem }) {
    const date = post.published_at
      ? new Date(post.published_at).toLocaleDateString('tr-TR')
      : null;

    if (!post.locked) {
      return (
        <Link
          href={`/post/${post.id}`}
          className="block rounded-2xl border border-border bg-surface p-5 hover:border-primary/40 transition-colors"
        >
          <p className="text-sm font-semibold text-foreground">{post.title}</p>
          {post.content?.body && (
            <p className="mt-1 text-xs text-muted line-clamp-3 leading-relaxed">
              {post.content.body}
            </p>
          )}
          {date && <p className="mt-2 text-xs text-muted">{date}</p>}
        </Link>
      );
    }

    // Locked — teaser state
    const ctaHref = post.cta_plan_id
      ? (accessToken ? `/abonelik/${post.cta_plan_id}` : `/auth/giris?next=/@${username}`)
      : `/auth/giris?next=/@${username}`;

    const lockLabel =
      post.access_level === 'tier_gated' ? 'Belirli Üyelik Gerekli' : 'Üyelik Gerekli';

    return (
      <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">{post.title}</p>
          <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-surface border border-border text-muted">
            🔒 {lockLabel}
          </span>
        </div>
        {post.teaser && (
          <p className="text-xs text-muted leading-relaxed line-clamp-3">
            {post.teaser}
          </p>
        )}
        <div className="flex items-center justify-between">
          {date && <p className="text-xs text-muted">{date}</p>}
          {!isOwnPage && (
            <Link
              href={ctaHref}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
            >
              Abone Ol
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (notFoundState) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">@{username}</p>
          <p className="mt-2 text-sm text-muted">Bu profil bulunamadı.</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <main className="px-4 py-10 max-w-3xl mx-auto">
      {/* Profile header */}
      <div className="flex items-start gap-5 mb-10">
        <div className="h-20 w-20 shrink-0 rounded-full bg-background border border-border overflow-hidden">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-muted">
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground">{profile.display_name}</h1>
          <p className="text-sm text-muted">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-2 text-sm text-foreground leading-relaxed">{profile.bio}</p>
          )}
          <p className="mt-2 text-xs text-muted capitalize">{profile.category?.replace(/_/g, ' ')}</p>
          {profile.social_links && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {profile.social_links.youtube && (
                <a href={profile.social_links.youtube} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/40 transition-colors">
                  YouTube
                </a>
              )}
              {profile.social_links.instagram && (
                <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/40 transition-colors">
                  Instagram
                </a>
              )}
              {profile.social_links.twitter && (
                <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/40 transition-colors">
                  Twitter / X
                </a>
              )}
              {profile.social_links.discord && (
                <a href={profile.social_links.discord} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/40 transition-colors">
                  Discord
                </a>
              )}
              {profile.social_links.tiktok && (
                <a href={profile.social_links.tiktok} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/40 transition-colors">
                  TikTok
                </a>
              )}
              {profile.social_links.website && (
                <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/40 transition-colors">
                  Web Site
                </a>
              )}
            </div>
          )}
          {(isOwnPage || membershipStatus?.subscribed) && (
            <div className="mt-3">
              <Link
                href={`/u/${profile.username}/topluluk`}
                className="inline-flex items-center gap-1 rounded-lg border border-primary/30 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                Topluluk
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Membership Plans */}
      {profile.plans.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Üyelik Planları</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                  {plan.description && (
                    <p className="mt-1 text-xs text-muted line-clamp-2">{plan.description}</p>
                  )}
                  {plan.perks.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-1">
                      {plan.perks.map((perk, i) => (
                        <li key={i} className="text-xs text-muted flex items-start gap-1">
                          <span className="text-primary mt-px">✓</span> {perk}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">
                    {(plan.price_monthly_try / 100).toFixed(2)} ₺
                    <span className="text-xs font-normal text-muted"> / ay</span>
                  </p>
                  <PlanCta plan={plan} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Feed */}
      {posts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Postlar</h2>
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      {profile.products.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Ürünler</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{product.title}</p>
                  <p className="mt-1 text-xs text-muted line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-sm font-medium text-foreground">
                    {(product.price_try / 100).toFixed(2)} ₺
                  </p>
                  <ProductCta productId={product.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Collections */}
      {profile.collections.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Koleksiyonlar</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.collections.map((collection) => (
              <div
                key={collection.id}
                className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{collection.title}</p>
                  <p className="mt-1 text-xs text-muted line-clamp-2">{collection.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {collection.access_type === 'purchase' && collection.price_try != null
                        ? `${(collection.price_try / 100).toFixed(2)} ₺`
                        : 'Üyelik'}
                    </p>
                    <p className="text-xs text-muted">{collection.item_count} öğe</p>
                  </div>
                  <CollectionCta collection={collection} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.products.length === 0 && profile.collections.length === 0 && profile.plans.length === 0 && posts.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted">Henüz içerik yok.</p>
        </div>
      )}
    </main>
  );
}
