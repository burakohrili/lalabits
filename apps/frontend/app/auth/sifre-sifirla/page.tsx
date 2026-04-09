import { RequestForm, ConfirmForm } from './forms';

export const metadata = { title: 'Şifre Sıfırla — lalabits.art' };

export default async function PasswordResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const title = token ? 'Yeni Şifre Belirle' : 'Şifreni Mi Unuttun?';
  const subtitle = token
    ? 'Hesabın için yeni bir şifre belirle.'
    : 'Email adresine şifre sıfırlama linki gönderelim.';

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {token ? <ConfirmForm token={token} /> : <RequestForm />}
        </div>
      </div>
    </main>
  );
}
