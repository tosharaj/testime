'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles } from 'lucide-react';
import { examMenuCategories } from '@/lib/examMenuData';

interface MobileExamsAccordionProps {
  onNavigate?: () => void;
}

export default function MobileExamsAccordion({ onNavigate }: MobileExamsAccordionProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(examMenuCategories[0].slug);

  const selected = examMenuCategories.find((c) => c.slug === activeCategory) || examMenuCategories[0];

  return (
    <div className="border-b border-surface-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-exams-accordion"
        className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-surface-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
      >
        <span>Exams</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div id="mobile-exams-accordion" className="ml-4 mt-0.5 space-y-0.5 border-l border-brand-200 pl-2">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <Sparkles className="h-3 w-3 text-sunny-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-surface-400">Categories</p>
          </div>

          <div className="flex flex-wrap gap-1.5 px-3 py-1">
            {examMenuCategories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  activeCategory === cat.slug
                    ? 'bg-brand-50 text-brand-700 ring-2 ring-brand-200'
                    : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                }`}
              >
                <cat.menuIcon className="h-3.5 w-3.5" />
                {cat.name}
              </button>
            ))}
          </div>

          <div className="mt-1 space-y-0.5">
            {selected.exams.map((exam) => (
              <Link
                key={exam.slug}
                href={`/exams/${selected.slug}`}
                onClick={onNavigate}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-surface-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
              >
                <span>{exam.icon || '📁'}</span>
                <span className="truncate">{exam.name}</span>
              </Link>
            ))}
          </div>

          <Link
            href={`/exams/${selected.slug}`}
            onClick={onNavigate}
            className="block px-3 py-2.5 text-sm font-bold text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
          >
            View all {selected.name} →
          </Link>
        </div>
      )}
    </div>
  );
}
