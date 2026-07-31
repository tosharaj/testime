'use client';
import { Sparkles } from 'lucide-react';
import { ExamMenuCategory } from '@/lib/examMenuData';

interface ExamCategoryListProps {
  categories: ExamMenuCategory[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  registerButton: (slug: string, el: HTMLButtonElement | null) => void;
}

export default function ExamCategoryList({ categories, activeSlug, onSelect, registerButton }: ExamCategoryListProps) {
  return (
    <div className="w-64 shrink-0 space-y-1 overflow-y-auto border-r border-surface-100 bg-[#F8FAFE] p-3">
      <div className="mb-2 flex items-center gap-1.5 px-3 pb-2">
        <Sparkles className="h-3 w-3 text-sunny-500" />
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-surface-400">Categories</p>
      </div>

      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <button
            key={cat.slug}
            type="button"
            role="menuitemradio"
            aria-checked={isActive}
            ref={(el) => registerButton(cat.slug, el)}
            onClick={() => onSelect(cat.slug)}
            onMouseEnter={() => onSelect(cat.slug)}
            onFocus={() => onSelect(cat.slug)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
              isActive
                ? 'bg-white shadow-sm ring-1 ring-brand-100'
                : 'text-surface-600 hover:bg-white/80'
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} text-white shadow-sm transition-transform group-hover:scale-105 ${
                isActive ? '' : 'opacity-90'
              }`}
            >
              <cat.menuIcon className="h-4 w-4" />
            </span>
            <span className={`truncate text-sm font-semibold leading-tight ${isActive ? 'text-brand-700' : 'text-surface-700'}`}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
