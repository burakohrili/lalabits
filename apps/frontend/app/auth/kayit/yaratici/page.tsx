import { Suspense } from 'react';
import CreatorRegisterForm from './form';

export const metadata = { title: 'Yaratıcı Olarak Kayıt Ol — lalabits.art' };

export default function CreatorRegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Yaratıcı Olarak Kayıt Ol</h1>
          <p className="mt-2 text-sm text-muted">
            İçerik yayınla, üyelik planı oluştur, kazan.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <Suspense fallback={null}>
            <CreatorRegisterForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
