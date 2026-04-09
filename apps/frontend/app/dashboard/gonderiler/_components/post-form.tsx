'use client';

import { useState } from 'react';

export interface PostFormValues {
  title: string;
  body: string;
  access_level: 'public' | 'member_only';
}

interface Props {
  initial?: Partial<PostFormValues>;
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onSubmit: (values: PostFormValues) => void;
}

export default function PostForm({ initial, submitLabel, busy, error, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [accessLevel, setAccessLevel] = useState<'public' | 'member_only'>(
    initial?.access_level ?? 'public',
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, body, access_level: accessLevel });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="post-title" className="text-sm font-medium text-foreground">
          Başlık <span className="text-red-500">*</span>
        </label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          required
          disabled={busy}
          placeholder="Gönderi başlığı"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="post-body" className="text-sm font-medium text-foreground">
          İçerik
        </label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          disabled={busy}
          placeholder="Gönderi içeriğini buraya yazın…"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 resize-y"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="post-access" className="text-sm font-medium text-foreground">
          Erişim seviyesi
        </label>
        <select
          id="post-access"
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value as 'public' | 'member_only')}
          disabled={busy}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        >
          <option value="public">Herkese açık</option>
          <option value="member_only">Yalnızca üyeler</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy || !title.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? 'Kaydediliyor…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
