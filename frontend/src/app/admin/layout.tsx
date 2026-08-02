'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ADMIN_EMAIL } from '@/lib/admin';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';

type GateState = 'loading' | 'authed' | 'denied';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<GateState>('loading');

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const user = data.session?.user;
      if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setState('authed');
        if (isLoginPage) router.replace('/admin/dashboard');
      } else {
        setState('denied');
        if (!isLoginPage) router.replace('/admin/login');
      }
    });
    return () => { active = false; };
  }, [router, isLoginPage]);

  if (isLoginPage) {
    if (state === 'authed') return null;
    return <>{children}</>;
  }

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFBFA]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-surface-200 border-t-brand-500" />
      </div>
    );
  }

  if (state !== 'authed') return null;

  return (
    <div className="flex min-h-screen bg-[#FFFBFA]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
