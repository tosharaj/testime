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
    <div className="w-60 shrink-0 space-y-1 overflow-y-auto border-r-2 border-surface-100 bg-surface-50/80 p-3">
      <div className="mb-2 border-b-2 border-surface-100 px-2.5 pb-2">
        <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-surface-400">
          <Sparkles className="h-3 w-3 text-sunny-500" />
          Categories
        </p>
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
            className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-all duration-150 ${
              isActive
                ? 'bg-white shadow-md ring-2 ring-surface-200/80'
                : 'text-surface-600 hover:bg-white/70 hover:text-surface-800'
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} text-white shadow-sm`}
            >
              <cat.menuIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-extrabold leading-tight ${isActive ? 'text-surface-900' : ''}`}>
                {cat.name}
              </p>
              <p className="truncate text-[11px] font-medium text-surface-400">{cat.fullName}</p>
            </div>
            <span
              className={`shrink-0 rounded-lg border-2 px-2 py-0.5 text-[11px] font-bold ${
                isActive
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-surface-200 bg-surface-100 text-surface-400'
              }`}
            >
              {cat.examCount}
            </span>
          </button>
        );
      })}
    </div>
  );
}
