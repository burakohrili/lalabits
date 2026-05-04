'use client';

import { useRef, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface ExternalLink {
  id: string; // client-only
  url: string;
  title: string;
}

export interface SavedAttachment {
  id: string;
  original_filename: string;
  file_size_bytes: string;
  content_type: string;
  is_downloadable: boolean;
  sort_order: number;
}

export interface PostFormValues {
  title: string;
  body: string;
  access_level: 'public' | 'member_only';
  content_type: 'text' | 'checklist';
  checklist_items: ChecklistItem[];
  links: ExternalLink[];
}

interface Props {
  initial?: Partial<PostFormValues> & { attachments?: SavedAttachment[] };
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onSubmit: (values: PostFormValues) => void;
  /** When provided, file attachments can be uploaded immediately */
  postId?: string;
  accessToken?: string;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatBytes(bytes: string | number): string {
  const n = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_MIME =
  'video/*,audio/*,application/pdf,application/zip,application/x-zip-compressed,model/stl,model/obj,application/octet-stream';

const MAX_FILE_BYTES = 1024 * 1024 * 1024; // 1 GB (video için)
const MAX_FILE_BYTES_STANDARD = 200 * 1024 * 1024; // 200 MB (ses, zip, diğer)

export default function PostForm({
  initial,
  submitLabel,
  busy,
  error,
  onSubmit,
  postId,
  accessToken,
}: Props) {
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

  // ── External links ────────────────────────────────────────────────────────
  const [links, setLinks] = useState<ExternalLink[]>(initial?.links ?? []);

  function addLink() {
    setLinks((prev) => [...prev, { id: generateId(), url: '', title: '' }]);
  }
  function updateLink(id: string, field: 'url' | 'title', value: string) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }
  function removeLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  // ── File attachments ──────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<SavedAttachment[]>(initial?.attachments ?? []);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !postId || !accessToken) return;

    const limit = file.type.startsWith('video/') ? MAX_FILE_BYTES : MAX_FILE_BYTES_STANDARD;
    const limitLabel = file.type.startsWith('video/') ? '1 GB' : '200 MB';
    if (file.size > limit) {
      setUploadError(`Dosya ${limitLabel} sınırını aşıyor.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setUploadError(null);

    try {
      // 1. Get presigned PUT URL
      const urlRes = await fetch(`${API}/dashboard/posts/${postId}/attachments/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content_type: file.type || 'application/octet-stream',
          original_filename: file.name,
        }),
      });

      if (!urlRes.ok) throw new Error('Upload URL alınamadı.');

      const { upload_url, storage_key } = (await urlRes.json()) as {
        upload_url: string;
        storage_key: string;
      };

      // 2. PUT directly to R2
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', upload_url);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload başarısız: ${xhr.status}`));
        };

        xhr.onerror = () => reject(new Error('Ağ hatası.'));
        xhr.send(file);
      });

      // 3. Register attachment in DB
      const addRes = await fetch(`${API}/dashboard/posts/${postId}/attachments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          storage_key,
          original_filename: file.name,
          file_size_bytes: file.size,
          content_type: file.type || 'application/octet-stream',
          is_downloadable: true,
        }),
      });

      if (!addRes.ok) throw new Error('Ek kaydedilemedi.');

      const saved = (await addRes.json()) as SavedAttachment;
      setAttachments((prev) => [...prev, saved]);
      setUploadStatus('idle');
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setUploadStatus('idle');
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadError(err instanceof Error ? err.message : 'Dosya yüklenemedi.');
    }
  }

  async function handleRemoveAttachment(attachmentId: string) {
    if (!postId || !accessToken) return;
    try {
      await fetch(`${API}/dashboard/posts/${postId}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    } catch {
      // silent — attachment stays in list until page reload
    }
  }

  // ── Checklist helpers ─────────────────────────────────────────────────────
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
      links: links.filter((l) => l.url.trim().startsWith('http')),
    });
  }

  const validChecklist = checklistItems.some((it) => it.text.trim().length > 0);
  const canSubmit = title.trim().length > 0 && (contentType === 'text' || validChecklist);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Title */}
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

      {/* Content type */}
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

      {/* Body / Checklist */}
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

      {/* External links */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Bağlantılar</span>
          <button
            type="button"
            onClick={addLink}
            disabled={busy}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            + Bağlantı ekle
          </button>
        </div>

        {links.length === 0 && (
          <p className="text-xs text-muted">
            YouTube, Google Drive, Spotify vb. bağlantı ekleyebilirsiniz.
          </p>
        )}

        {links.map((link) => (
          <div key={link.id} className="flex flex-col gap-1.5 rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                disabled={busy}
                placeholder="https://..."
                className="flex-1 rounded-md border border-border bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => removeLink(link.id)}
                disabled={busy}
                className="text-muted hover:text-red-500 disabled:opacity-30 text-lg leading-none shrink-0"
                aria-label="Bağlantıyı kaldır"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={link.title}
              onChange={(e) => updateLink(link.id, 'title', e.target.value)}
              disabled={busy}
              placeholder="Bağlantı başlığı (opsiyonel)"
              maxLength={200}
              className="rounded-md border border-border bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            />
          </div>
        ))}
      </div>

      {/* File attachments */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Dosya Ekleri</span>

        {!postId ? (
          <p className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted">
            Dosya eklemek için önce taslağı kaydedin, ardından düzenleme sayfasından ekleyebilirsiniz.
          </p>
        ) : (
          <>
            {/* Uploaded list */}
            {attachments.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {attachments.map((att) => (
                  <li
                    key={att.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <span className="flex-1 truncate text-foreground">{att.original_filename}</span>
                    <span className="shrink-0 text-xs text-muted">{formatBytes(att.file_size_bytes)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      disabled={uploadStatus === 'uploading'}
                      className="text-muted hover:text-red-500 disabled:opacity-30 text-lg leading-none shrink-0"
                      aria-label="Eki kaldır"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Upload progress */}
            {uploadStatus === 'uploading' && (
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="mb-1.5 text-xs text-muted">Yükleniyor… {uploadProgress}%</p>
                <div className="h-1.5 w-full rounded-full bg-border">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-red-600">{uploadError}</p>
            )}

            {/* File picker */}
            <label
              className={[
                'flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-4 text-center text-sm transition-colors',
                uploadStatus === 'uploading'
                  ? 'cursor-not-allowed border-border bg-background opacity-50'
                  : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5',
              ].join(' ')}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_MIME}
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploadStatus === 'uploading'}
              />
              <span className="text-muted">
                Video (1 GB), Ses · PDF · ZIP · STL/OBJ (200 MB)
                <span className="ml-1 text-primary font-medium">Dosya seç</span>
              </span>
            </label>
          </>
        )}
      </div>

      {/* Access level */}
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
