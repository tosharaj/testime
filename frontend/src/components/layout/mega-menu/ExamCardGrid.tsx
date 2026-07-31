'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { ExamMenuCategory } from '@/lib/examMenuData';

interface ExamCardGridProps {
  category: ExamMenuCategory;
}

export default function ExamCardGrid({ category }: ExamCardGridProps) {
  const [seen, setSeen] = useState(9);

  const visible = category.exams.slice(0, seen);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} text-white shadow-sm`}>
            <category.menuIcon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-surface-900 leading-tight">{category.name}</h3>
            <p className="text-xs text-surface-400">{category.fullName}</p>
          </div>
        </div>
        <Link
          href={`/exams/${category.slug}`}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Popular label */}
      <div className="px-6 pb-2">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-coral-400" />
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-surface-400">Popular Exams</p>
        </div>
      </div>

      {/* 3-column exam card grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-5">
        <div className="grid grid-cols-3 gap-2.5">
          {visible.map((exam) => (
            <Link
              key={exam.slug}
              href={`/exams/${category.slug}`}
              className="group flex flex-col gap-2 rounded-xl border border-surface-100 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-md"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} text-base shadow-sm transition-transform group-hover:scale-110`}>
                <span className="drop-shadow-sm">{exam.icon || '📁'}</span>
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-surface-800 transition-colors group-hover:text-brand-600">
                  {exam.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-surface-400">{exam.description}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand-500 opacity-0 transition-opacity group-hover:opacity-100">
                Explore <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        {category.exams.length > seen && (
          <button
            type="button"
            onClick={() => setSeen((s) => s + 9)}
            className="mt-4 w-full rounded-xl border border-dashed border-surface-200 py-2 text-xs font-semibold text-surface-500 transition-colors hover:border-brand-200 hover:text-brand-600"
          >
            Show {Math.min(9, category.exams.length - seen)} more exams
          </button>
        )}
      </div>
    </div>
  );
}
