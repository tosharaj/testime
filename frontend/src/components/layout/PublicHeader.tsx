'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import ExamsMegaMenu from './mega-menu/ExamsMegaMenu';
import MobileExamsAccordion from './mega-menu/MobileExamsAccordion';

const navItems = [
  { label: 'Exams', href: '/exams' },
  { label: 'Test Series', href: '/test-series' },
  { label: 'Notes & Resources', href: '/notes' },
  { label: 'Books', href: '/notes/search?type=BOOK' },
  { label: 'PYQ', href: '/questions' },
  { label: 'Pricing', href: '/pricing' },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    setIsLoggedIn(!!localStorage.getItem('token'));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isExamsActive = pathname === '/exams' || pathname.startsWith('/exams/');

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-[#FBFBFE]/90 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white text-sm font-bold shadow-sm shadow-brand-200">
            T
          </div>
          <span className="font-display text-lg font-bold text-surface-900">Testime</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href.split('?')[0] + '/');
            if (item.label === 'Exams') {
              return (
                <ExamsMegaMenu
                  key={item.href}
                  className={isExamsActive ? 'text-brand-600' : undefined}
                />
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-surface-600 hover:text-brand-600 hover:bg-brand-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center justify-center h-9 w-9 rounded-xl text-surface-300 cursor-not-allowed">
            <Search className="h-4 w-4" />
          </span>
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-brand-500 text-white px-4 py-2 text-sm font-medium hover:bg-brand-600 shadow-sm shadow-brand-200 transition-colors"
              >
                <User className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-surface-500 hover:text-coral-500 hover:bg-coral-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-surface-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-brand-400 to-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-200 hover:shadow-md transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-surface-100 bg-white animate-fade-in">
          <nav className="px-4 py-2 space-y-0.5">
            {navItems.map((item) => {
              if (item.label === 'Exams') {
                return (
                  <MobileExamsAccordion
                    key={item.href}
                    onNavigate={() => setMobileOpen(false)}
                  />
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-surface-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
