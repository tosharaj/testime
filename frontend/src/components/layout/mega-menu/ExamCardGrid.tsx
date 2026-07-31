'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { ExamMenuCategory } from '@/lib/examMenuData';

interface ExamCardGridProps {
  category: ExamMenuCategory;
}

export default function ExamCardGrid({ category }: ExamCardGridProps) {
  const [seen, setSeen] = useState(9);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSeen(9);
    gridRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category.slug]);

  const visible = category.exams.slice(0, seen);

  return (
    <div className="flex h-full flex-col">
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 ring-2 ring-white/30 backdrop-blur-sm">
              <category.menuIcon className="h-5 w-5 text-white" />
            </span>
            <div className="text-white">
              <h3 className="text-base font-extrabold leading-tight">{category.name}</h3>
              <p className="text-xs font-semibold text-white/80">{category.fullName}</p>
            </div>
          </div>
          <Link
            href={`/exams/${category.slug}`}
            className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3.5 py-2 text-xs font-extrabold text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* 3-column exam card grid */}
      <div ref={gridRef} className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-coral-500" />
          <p className="text-xs font-black uppercase tracking-wider text-surface-400">Popular Exams</p>
          <Sparkles className="h-3 w-3 text-sunny-500" />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {visible.map((exam) => (
            <Link
              key={exam.slug}
              href={`/exams/${category.slug}`}
              className="group flex flex-col gap-2 rounded-xl border-2 border-surface-100 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-50 text-base transition-all duration-200 group-hover:scale-110">
                {exam.icon || '📁'}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-surface-800 transition-colors group-hover:text-brand-600">
                  {exam.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-surface-400">{exam.description}</p>
              </div>
              <span className="mt-auto flex items-center gap-0.5 text-[11px] font-bold text-surface-400 transition-colors group-hover:text-brand-500">
                Explore <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        {category.exams.length > seen && (
          <button
            type="button"
            onClick={() => setSeen((s) => s + 9)}
            className="mt-4 w-full rounded-xl border-2 border-dashed border-surface-200 py-2 text-xs font-bold text-surface-500 transition-colors hover:border-brand-300 hover:text-brand-600"
          >
            Show {Math.min(9, category.exams.length - seen)} more
          </button>
        )}
      </div>
    </div>
  );
}
