'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import FileUploadField, { type UploadedFile } from '../_components/file-upload-field';
import ProductForm, { type ProductFormValues } from '../_components/product-form';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function YeniUrunPage() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(values: ProductFormValues) {
    if (!accessToken || !uploadedFile) return;

    setBusy(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API}/dashboard/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          price_try: values.price_try,
          storage_key: uploadedFile.storage_key,
          original_filename: uploadedFile.original_filename,
          file_size_bytes: uploadedFile.file_size_bytes,
          content_type: uploadedFile.content_type,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }

      router.push('/dashboard/magaza');
    } catch {
      setSubmitError('Ürün oluşturulamadı. Tekrar deneyin.');
      setBusy(false);
    }
  }

  return (
    <div className="px-6 py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/magaza" className="text-sm text-muted hover:text-foreground">
          ← Mağaza
        </Link>
        <span className="text-muted">/</span>
        <h1 className="text-xl font-semibold text-foreground">Yeni Ürün</h1>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <FileUploadField
            accessToken={accessToken ?? ''}
            onUploaded={setUploadedFile}
            onError={setUploadError}
            disabled={busy}
          />
          {uploadError && (
            <p className="mt-2 text-xs text-red-600">{uploadError}</p>
          )}
        </div>

        {uploadedFile && (
          <div className="rounded-2xl border border-border bg-surface p-6">
            <ProductForm
              submitLabel="Taslak olarak kaydet"
              busy={busy}
              error={submitError}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {!uploadedFile && (
          <p className="text-xs text-muted text-center">
            Formu doldurmak için önce dosya yükleyin.
          </p>
        )}
      </div>
    </div>
  );
}
