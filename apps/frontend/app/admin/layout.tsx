import type { ReactNode } from 'react';
import { AdminAuthProvider } from '@/lib/admin-auth';

export const metadata = { title: 'Admin — lalabits.art' };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
