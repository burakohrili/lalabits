'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import PostForm, { type PostFormValues, type SavedAttachment } from '../_components/post-form';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface ChecklistItem {
  id: string;
  text: string;
}

interface PostDetail {
  id: string;
  title: string;
  content: {
    type: string;
    body?: string;
    items?: ChecklistItem[];
    links?: Array<{ url: string; title?: string }>;
  } | null;
  access_level: 'public' | 'member_only';
  publish_status: 'draft' | 'published' | 'archived';
  cover_image_url?: string | null;
  attachments: SavedAttachment[];
}

export default function EditGonderiPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !postId) return;

    async function load() {
      try {
        const res = await fetch(`${API}/dashboard/posts/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { code?: string };
          if (res.status === 404 || res.status === 403) {
            router.replace('/dashboard/gonderiler');
            return;
          }
          throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
        }
        const data = (await res.json()) as PostDetail;
        setPost(data);
      } catch {
        setLoadError('Gönderi yüklenemedi.');
      }
    }

    void load();
  }, [accessToken, postId, router]);

  async function handleSubmit(values: PostFormValues) {
    if (!accessToken || !post) return;

    setBusy(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API}/dashboard/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: values.title,
          content:
            values.content_type === 'checklist'
              ? {
                  type: 'checklist',
                  items: values.checklist_items.filter((it) => it.text.trim()),
                  links: values.links.length > 0
                    ? values.links.map(({ url, title }) => ({ url, title: title || undefined }))
                    : undefined,
                }
              : {
                  type: 'plain',
                  body: values.body || undefined,
                  links: values.links.length > 0
                    ? values.links.map(({ url, title }) => ({ url, title: title || undefined }))
                    : undefined,
                },
          access_level: values.access_level,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }

      router.push('/dashboard/gonderiler');
    } catch {
      setSubmitError('Değişiklikler kaydedilemedi. Tekrar deneyin.');
      setBusy(false);
    }
  }

  return (
    <div className="px-6 py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard/gonderiler"
          className="text-sm text-muted hover:text-foreground"
        >
          ← Gönderiler
        </Link>
        <span className="text-muted">/</span>
        <h1 className="text-xl font-semibold text-foreground">Gönderiyi Düzenle</h1>
      </div>

      {loadError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{loadError}</p>
      )}

      {!post && !loadError && (
        <div className="rounded-2xl border border-border bg-surface p-6 animate-pulse">
          <div className="h-4 w-48 rounded bg-border mb-4" />
          <div className="h-32 rounded bg-border mb-4" />
          <div className="h-4 w-32 rounded bg-border" />
        </div>
      )}

      {post && post.publish_status === 'archived' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-5">
          Bu gönderi arşivlenmiştir ve düzenlenemez.
        </div>
      )}

      {post && post.publish_status !== 'archived' && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <PostForm
            initial={{
              title: post.title,
              body: post.content?.type === 'plain' ? (post.content.body ?? '') : '',
              access_level: post.access_level,
              content_type: post.content?.type === 'checklist' ? 'checklist' : 'text',
              checklist_items:
                post.content?.type === 'checklist' && post.content.items
                  ? post.content.items
                  : [{ id: 'init', text: '' }],
              links:
                post.content?.links?.map((l) => ({
                  id: Math.random().toString(36).slice(2),
                  url: l.url,
                  title: l.title ?? '',
                })) ?? [],
              attachments: post.attachments,
              cover_image_url: post.cover_image_url,
            }}
            submitLabel="Değişiklikleri kaydet"
            busy={busy}
            error={submitError}
            onSubmit={handleSubmit}
            postId={post.id}
            accessToken={accessToken ?? undefined}
          />
        </div>
      )}
    </div>
  );
}
