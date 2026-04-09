import Link from 'next/link';

export const metadata = { title: 'Email Doğrulama — lalabits.art' };

type VerifyResult =
  | { status: 'success' }
  | { status: 'already_verified' }
  | { status: 'invalid' }
  | { status: 'no_token' };

async function verifyToken(token: string): Promise<VerifyResult> {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  try {
    const res = await fetch(`${API}/auth/email-verify/${encodeURIComponent(token)}`, {
      cache: 'no-store',
    });
    if (res.ok) return { status: 'success' };
    const body = await res.json().catch(() => ({})) as { code?: string };
    if (body.code === 'ALREADY_VERIFIED') return { status: 'already_verified' };
    return { status: 'invalid' };
  } catch {
    return { status: 'invalid' };
  }
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const result: VerifyResult = token
    ? await verifyToken(token)
    : { status: 'no_token' };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm text-center flex flex-col gap-6">
          {result.status === 'success' && (
            <>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Email Doğrulandı</h1>
                <p className="text-sm text-muted">
                  Email adresin başarıyla doğrulandı. Artık giriş yapabilirsin.
                </p>
              </div>
              <Link
                href="/auth/giris"
                className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90"
              >
                Giriş Yap
              </Link>
            </>
          )}

          {result.status === 'already_verified' && (
            <>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Zaten Doğrulandı</h1>
                <p className="text-sm text-muted">
                  Bu email adresi daha önce doğrulanmış.
                </p>
              </div>
              <Link
                href="/auth/giris"
                className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90"
              >
                Giriş Yap
              </Link>
            </>
          )}

          {(result.status === 'invalid' || result.status === 'no_token') && (
            <>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Geçersiz Bağlantı</h1>
                <p className="text-sm text-muted">
                  Bu doğrulama bağlantısı geçersiz veya süresi dolmuş.
                  Yeni bir bağlantı talep edebilirsin.
                </p>
              </div>
              <Link
                href="/auth/emaili-dogrula"
                className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90"
              >
                Yeni Bağlantı İste
              </Link>
              <Link href="/auth/giris" className="text-sm text-primary hover:underline">
                Giriş sayfasına dön
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
