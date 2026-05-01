import Link from 'next/link';

export const metadata = { title: 'Kayıt Ol — lalabits.art' };

export default function RegisterSelectPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Nasıl katılmak istiyorsun?</h1>
          <p className="mt-2 text-sm text-muted">
            Hesap türünü seç ve kayıt ol.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/auth/kayit/fan"
            className="flex flex-col gap-1 rounded-2xl border border-border bg-surface px-6 py-5 hover:border-primary/50 hover:shadow-sm transition-shadow"
          >
            <span className="text-base font-medium text-foreground">Fan olarak katıl</span>
            <span className="text-sm text-muted">
              İçeriklere eriş, üreticilere destek ol, üyelik al.
            </span>
          </Link>

          <Link
            href="/auth/kayit/yaratici"
            className="flex flex-col gap-1 rounded-2xl border border-border bg-surface px-6 py-5 hover:border-primary/50 hover:shadow-sm transition-shadow"
          >
            <span className="text-base font-medium text-foreground">Üretici olarak katıl</span>
            <span className="text-sm text-muted">
              İçerik yayınla, üyelik planı oluştur, kazan.
            </span>
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Zaten hesabın var mı?{' '}
          <Link href="/auth/giris" className="text-primary hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </main>
  );
}
