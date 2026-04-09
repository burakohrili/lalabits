'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import PostForm, { type PostFormValues } from '../_components/post-form';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function YeniGonderiPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: PostFormValues) {
    if (!accessToken) return;

    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`${API}/dashboard/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: values.title,
          content: values.body.trim() ? { type: 'plain', body: values.body } : null,
          access_level: values.access_level,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', '');
      }

      router.push('/dashboard/gonderiler');
    } catch {
      setError('Gönderi oluşturulamadı. Tekrar deneyin.');
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
        <h1 className="text-xl font-semibold text-foreground">Yeni Gönderi</h1>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <PostForm
          submitLabel="Taslak olarak kaydet"
          busy={busy}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
