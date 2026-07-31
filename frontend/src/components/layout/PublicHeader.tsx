'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, User, ChevronDown, LogOut, BookOpen, PenTool } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import ExamsMegaMenu from './mega-menu/ExamsMegaMenu';
import MobileExamsAccordion from './mega-menu/MobileExamsAccordion';

const navItems = [
  { label: 'Exams', href: '/exams' },
  { label: 'Daily Current Affairs', href: '/current-affairs' },
  { label: 'Notes', href: '/notes' },
  { label: 'Previous Year Questions', href: '/questions' },
  { label: 'Test Series', href: '/test-series' },
  { label: 'Pricing', href: '/pricing' },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pyqOpen, setPyqOpen] = useState(false);
  const [mobilePyqOpen, setMobilePyqOpen] = useState(false);
  const pyqDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    setIsLoggedIn(!!localStorage.getItem('token'));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pyqDropdownRef.current && !pyqDropdownRef.current.contains(e.target as Node)) setPyqOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setPyqOpen(false);
    setMobilePyqOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isExamsActive = pathname === '/exams' || pathname.startsWith('/exams/');

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white text-xs font-bold">
            T
          </div>
          <span className="text-base font-bold text-surface-900">Testime</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            if (item.label === 'Exams') {
              return (
                <ExamsMegaMenu
                  key={item.href}
                  className={isExamsActive ? 'text-brand-600' : undefined}
                />
              );
            }
            if (item.label === 'Previous Year Questions') {
              const isPyqActive = pathname === '/questions' || pathname.startsWith('/questions/');
              return (
                <div key={item.href} className="relative" ref={pyqDropdownRef}>
                  <button
                    onClick={() => setPyqOpen(!pyqOpen)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isPyqActive
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-surface-600 hover:text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${pyqOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {pyqOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg border border-surface-200 shadow-card py-1 min-w-[170px] animate-fade-in origin-top-left">
                      <Link
                        href="/prelims"
                        onClick={() => setPyqOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-surface-700 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        Prelim
                      </Link>
                      <Link
                        href="/mains"
                        onClick={() => setPyqOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-surface-700 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <PenTool className="h-4 w-4" />
                        Mains
                      </Link>
                    </div>
                  )}
                </div>
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
          <span className="hidden sm:flex items-center justify-center h-9 w-9 rounded-lg text-surface-300 cursor-not-allowed">
            <Search className="h-4 w-4" />
          </span>
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-brand-500 text-white px-4 py-2 text-sm font-medium hover:bg-brand-600 transition-colors"
              >
                <User className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-surface-500 hover:text-coral-500 hover:bg-coral-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-surface-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
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
        <div className="lg:hidden border-t border-surface-200 bg-white animate-fade-in">
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
              if (item.label === 'Previous Year Questions') {
                return (
                  <div key={item.href}>
                    <button
                      onClick={() => setMobilePyqOpen(!mobilePyqOpen)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-surface-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                    >
                      <span>Previous Year Questions</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobilePyqOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobilePyqOpen && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l border-brand-200 pl-2">
                        <Link
                          href="/prelims"
                          onClick={() => { setMobileOpen(false); setMobilePyqOpen(false); }}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-surface-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                        >
                          <BookOpen className="h-4 w-4" />
                          Prelim
                        </Link>
                        <Link
                          href="/mains"
                          onClick={() => { setMobileOpen(false); setMobilePyqOpen(false); }}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-surface-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                        >
                          <PenTool className="h-4 w-4" />
                          Mains
                        </Link>
                      </div>
                    )}
                  </div>
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
