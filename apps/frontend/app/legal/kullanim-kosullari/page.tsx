export const metadata = { title: 'Kullanım Koşulları — lalabits.art' };

interface LegalMeta {
  document_type: string;
  version_identifier: string;
  effective_date: string;
  is_current: boolean;
}

async function fetchMeta(): Promise<LegalMeta | null> {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  try {
    const res = await fetch(`${API}/legal/terms-of-service`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<LegalMeta>;
  } catch {
    return null;
  }
}

export default async function KullanimKosullariPage() {
  const meta = await fetchMeta();

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-foreground">Kullanım Koşulları</h1>
        {meta ? (
          <p className="text-sm text-muted">
            Sürüm {meta.version_identifier} — Yürürlük tarihi:{' '}
            {new Date(meta.effective_date).toLocaleDateString('tr-TR')}
          </p>
        ) : (
          <p className="text-sm text-muted">Sürüm bilgisi yüklenemedi.</p>
        )}
      </header>
      <p className="text-sm text-muted">İçerik yakında eklenecek.</p>
    </article>
  );
}
