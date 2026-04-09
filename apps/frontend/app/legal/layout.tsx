import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 justify-center px-4 py-12">
      <div className="w-full max-w-2xl">{children}</div>
    </main>
  );
}
