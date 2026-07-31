'use client';
import { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { examMenuCategories } from '@/lib/examMenuData';
import ExamsMegaMenuPanel from './ExamsMegaMenuPanel';

interface ExamsMegaMenuProps {
  label?: string;
  className?: string;
}

export default function ExamsMegaMenu({ label = 'Exams', className }: ExamsMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(examMenuCategories[0].slug);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  const isActive = pathname === '/exams' || pathname.startsWith('/exams/');

  const close = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const firstCategory = panelRef.current?.querySelector('[role="menuitemradio"]') as HTMLButtonElement | null;
    firstCategory?.focus();
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className || ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'text-brand-600 bg-brand-50'
            : 'text-surface-600 hover:text-brand-600 hover:bg-brand-50'
        }`}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 animate-fade-in origin-top">
          <ExamsMegaMenuPanel
            id={panelId}
            activeCategoryId={activeCategory}
            onCategoryChange={setActiveCategory}
            onClose={close}
            panelRef={panelRef}
          />
        </div>
      )}
    </div>
  );
}
