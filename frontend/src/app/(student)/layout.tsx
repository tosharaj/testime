'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, BrainCircuit, BarChart3, ShoppingCart, User, LogOut, Bell, Menu, X, GraduationCap } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Notes', href: '/my-notes', icon: BookOpen },
  { label: 'My Tests', href: '/my-tests', icon: BrainCircuit },
  { label: 'Results', href: '/results', icon: BarChart3 },
  { label: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || 'bypass';
    if (!token) localStorage.setItem('token', 'bypass');
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    else setUser({ name: 'Demo User', email: 'demo@testime.com', role: 'student' });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <header className="sticky top-0 z-30 h-16 border-b border-surface-200/60 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2.5 text-surface-500 hover:bg-surface-100 rounded-xl transition-all"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white font-bold text-sm shadow-md">
              T
            </div>
            <span className="text-lg font-bold text-surface-900 hidden sm:inline">Testime</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-medium text-surface-400 hover:text-brand-600 transition-colors">
            Home
          </Link>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-semibold">
            <GraduationCap className="h-4 w-4" />
            {user?.name || 'Student'}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-20 w-64 bg-white/90 backdrop-blur-xl border-r border-surface-200/60 pt-16 transition-transform duration-300 lg:translate-x-0 lg:static lg:block',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm'
                      : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
