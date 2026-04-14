'use client';

import { useState } from 'react';

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface PostFormValues {
  title: string;
  body: string;
  access_level: 'public' | 'member_only';
  content_type: 'text' | 'checklist';
  checklist_items: ChecklistItem[];
}

interface Props {
  initial?: Partial<PostFormValues>;
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onSubmit: (values: PostFormValues) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function PostForm({ initial, submitLabel, busy, error, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [accessLevel, setAccessLevel] = useState<'public' | 'member_only'>(
    initial?.access_level ?? 'public',
  );
  const [contentType, setContentType] = useState<'text' | 'checklist'>(
    initial?.content_type ?? 'text',
  );
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    initial?.checklist_items ?? [{ id: generateId(), text: '' }],
  );

  function addItem() {
    setChecklistItems((prev) => [...prev, { id: generateId(), text: '' }]);
  }

  function updateItem(id: string, text: string) {
    setChecklistItems((prev) => prev.map((it) => (it.id === id ? { ...it, text } : it)));
  }

  function removeItem(id: string) {
    setChecklistItems((prev) => prev.filter((it) => it.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      title,
      body,
      access_level: accessLevel,
      content_type: contentType,
      checklist_items: checklistItems,
    });
  }

  const validChecklist = checklistItems.some((it) => it.text.trim().length > 0);
  const canSubmit = title.trim().length > 0 && (contentType === 'text' || validChecklist);

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
        <span className="text-sm font-medium text-foreground">İçerik türü</span>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="content_type"
              value="text"
              checked={contentType === 'text'}
              onChange={() => setContentType('text')}
              disabled={busy}
            />
            <span className="text-sm text-foreground">Metin</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="content_type"
              value="checklist"
              checked={contentType === 'checklist'}
              onChange={() => setContentType('checklist')}
              disabled={busy}
            />
            <span className="text-sm text-foreground">Kontrol Listesi</span>
          </label>
        </div>
      </div>

      {contentType === 'text' ? (
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
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Kontrol Listesi Maddeleri</span>
          {checklistItems.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="text-xs text-muted w-5 text-right shrink-0">{idx + 1}.</span>
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(item.id, e.target.value)}
                disabled={busy}
                placeholder={`Madde ${idx + 1}`}
                maxLength={500}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={busy || checklistItems.length <= 1}
                className="text-muted hover:text-red-500 disabled:opacity-30 text-lg leading-none"
                aria-label="Maddeyi kaldır"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            disabled={busy}
            className="self-start text-xs text-primary hover:underline disabled:opacity-50 mt-1"
          >
            + Madde ekle
          </button>
        </div>
      )}

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
          disabled={busy || !canSubmit}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? 'Kaydediliyor…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
