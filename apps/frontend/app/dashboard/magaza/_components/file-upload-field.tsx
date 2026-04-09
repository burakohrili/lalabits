'use client';

import { useRef, useState } from 'react';

export interface UploadedFile {
  storage_key: string;
  original_filename: string;
  file_size_bytes: number;
  content_type: string;
}

interface Props {
  accessToken: string;
  onUploaded: (file: UploadedFile) => void;
  onError: (msg: string) => void;
  disabled?: boolean;
}

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function FileUploadField({ accessToken, onUploaded, onError, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [filename, setFilename] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setFilename(file.name);
    setProgress(0);
    onError('');

    try {
      // 1. Get presigned PUT URL
      const urlRes = await fetch(`${API}/dashboard/products/upload-url`, {
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

      if (!urlRes.ok) {
        throw new Error('Upload URL alınamadı.');
      }

      const { upload_url, storage_key } = (await urlRes.json()) as {
        upload_url: string;
        storage_key: string;
      };

      // 2. PUT file directly to S3
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', upload_url);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Upload ağ hatası.'));
        xhr.send(file);
      });

      setStatus('done');
      setProgress(100);

      onUploaded({
        storage_key,
        original_filename: file.name,
        file_size_bytes: file.size,
        content_type: file.type || 'application/octet-stream',
      });
    } catch (err) {
      setStatus('idle');
      setFilename(null);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
      onError(err instanceof Error ? err.message : 'Dosya yüklenemedi.');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        Dosya <span className="text-red-500">*</span>
      </label>

      <label
        className={[
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
          disabled || status === 'uploading'
            ? 'cursor-not-allowed border-border bg-background opacity-50'
            : 'cursor-pointer border-border bg-background hover:border-primary/50 hover:bg-primary/5',
          status === 'done' ? 'border-green-300 bg-green-50' : '',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          disabled={disabled || status === 'uploading'}
        />

        {status === 'idle' && (
          <>
            <p className="text-sm text-muted">Dosyayı buraya sürükleyin veya tıklayın</p>
            <p className="mt-1 text-xs text-muted">PDF, ZIP, görsel, ses — maks 500 MB</p>
          </>
        )}

        {status === 'uploading' && (
          <div className="w-full max-w-xs">
            <p className="mb-2 text-sm text-muted">Yükleniyor… {progress}%</p>
            <div className="h-1.5 w-full rounded-full bg-border">
              <div
                className="h-1.5 rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === 'done' && (
          <p className="text-sm text-green-700">
            ✓ {filename}
          </p>
        )}
      </label>
    </div>
  );
}
