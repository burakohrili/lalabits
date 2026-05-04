'use client';

import Link from 'next/link';
import Image from 'next/image';
import { relativeDate } from '@/lib/date-utils';
import type { FeedPost, FeedPostAttachment } from './types';

const ACCESS_LABEL: Record<string, string> = {
  public: 'Herkese Açık',
  member_only: 'Üyelere Özel',
  tier_gated: 'Katmana Özel',
};

function attachmentIcon(contentType: string): string {
  if (contentType.startsWith('audio/')) return 'Ses';
  if (contentType.startsWith('video/')) return 'Video';
  if (contentType === 'application/pdf') return 'PDF';
  if (contentType === 'application/zip' || contentType === 'application/x-zip-compressed') return 'ZIP';
  return 'Dosya';
}

function AttachmentBadge({ attachment }: { attachment: FeedPostAttachment }) {
  const label = attachmentIcon(attachment.content_type);
  const sizeKb = Math.round(Number(attachment.file_size_bytes) / 1024);
  const sizeLabel = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-muted">
      <svg className="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.5 9.5l-5 5a3.5 3.5 0 0 1-4.95-4.95l6-6a2 2 0 0 1 2.83 2.83l-5.5 5.5a.5.5 0 0 1-.71-.71l4.5-4.5" />
      </svg>
      {label} · {attachment.original_filename.length > 20 ? attachment.original_filename.slice(0, 18) + '…' : attachment.original_filename} · {sizeLabel}
    </span>
  );
}

interface FeedPostCardProps {
  post: FeedPost;
  featured?: boolean;
}

export default function FeedPostCard({ post, featured = false }: FeedPostCardProps) {
  const preview = post.teaser ?? (typeof post.content === 'object' && post.content !== null ? null : post.content) ?? null;
  const firstAttachment = post.attachments?.[0];

  return (
    <Link
      href={`/post/${post.id}`}
      className="group block rounded-2xl border border-border bg-surface transition-colors hover:border-primary/40 overflow-hidden"
    >
      {/* Cover image */}
      {post.cover_image_url && (
        <div className={['relative w-full overflow-hidden bg-background', featured ? 'h-48' : 'h-36'].join(' ')}>
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes={featured ? '(max-width: 768px) 100vw, 672px' : '(max-width: 768px) 50vw, 336px'}
          />
        </div>
      )}
      <div className={featured ? 'p-6' : 'p-4'}>
      {/* Creator row */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border bg-background">
          {post.creator_avatar_url ? (
            <Image
              src={post.creator_avatar_url}
              alt={post.creator_display_name}
              width={28}
              height={28}
              className="h-full w-full object-cover"
              sizes="28px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted">
              {post.creator_display_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-muted">@{post.creator_username}</span>
        <span className="text-muted">·</span>
        <span className="text-xs text-muted">{relativeDate(post.published_at)}</span>
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          {ACCESS_LABEL[post.access_level] ?? post.access_level}
        </span>
      </div>

      {/* Title */}
      <p className={[
        'font-semibold text-foreground leading-snug',
        featured ? 'text-base' : 'text-sm',
      ].join(' ')}>
        {post.title}
      </p>

      {/* Attachment badge */}
      {firstAttachment && !post.locked && (
        <div className="mt-2">
          <AttachmentBadge attachment={firstAttachment} />
          {(post.attachments?.length ?? 0) > 1 && (
            <span className="ml-1.5 text-[11px] text-muted">+{(post.attachments?.length ?? 1) - 1} dosya</span>
          )}
        </div>
      )}

      {/* Locked footer */}
      {post.locked ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
          <p className="line-clamp-1 text-xs italic text-muted">
            {post.teaser ?? 'Bu içerik üyelere özeldir.'}
          </p>
          <Link
            href={`/u/${post.creator_username}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 rounded-lg bg-primary px-3 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Üye Ol
          </Link>
        </div>
      ) : (
        preview && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{preview}</p>
        )
      )}
      </div>
    </Link>
  );
}
