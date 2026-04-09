import { Suspense } from 'react';
import LoginForm from './form';

export const metadata = { title: 'Giriş Yap — lalabits.art' };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Giriş Yap</h1>
          <p className="mt-2 text-sm text-muted">lalabits.art hesabına giriş yap</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
