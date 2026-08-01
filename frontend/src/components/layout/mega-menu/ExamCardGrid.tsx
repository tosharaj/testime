'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, ChevronRight } from 'lucide-react';
import { ExamMenuCategory } from '@/lib/examMenuData';

interface ExamCardGridProps {
  category: ExamMenuCategory;
}

const PAGE_SIZE = 12;

export default function ExamCardGrid({ category }: ExamCardGridProps) {
  const [seen, setSeen] = useState(PAGE_SIZE);

  const visible = category.exams.slice(0, seen);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} text-white shadow-sm`}>
            <category.menuIcon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-surface-900 leading-tight">{category.name}</h3>
            <p className="text-[11px] text-surface-400">{category.fullName}</p>
          </div>
        </div>
        <Link
          href={`/exams/${category.slug}`}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-brand-600 transition-colors hover:bg-brand-50"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Popular label */}
      <div className="px-5 pb-2">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3 text-coral-400" />
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-surface-400">Popular Exams</p>
        </div>
      </div>

      {/* Compact exam card grid — inline logo + name, 1/3 height */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="grid grid-cols-2 gap-1.5">
          {visible.map((exam) => (
            <Link
              key={exam.slug}
              href={`/exams/${exam.slug}`}
              title={exam.description}
              className="group flex items-center gap-2 rounded-lg border border-surface-100 bg-white px-2.5 py-1.5 transition-all duration-150 hover:border-brand-100 hover:shadow-sm hover:-translate-y-px"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} text-sm shadow-sm transition-transform group-hover:scale-110`}>
                <span className="drop-shadow-sm">{exam.icon || '📁'}</span>
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-surface-800 transition-colors group-hover:text-brand-600">
                {exam.name}
              </span>
              <ChevronRight className="h-3 w-3 shrink-0 text-surface-200 transition-colors group-hover:text-brand-400" />
            </Link>
          ))}
        </div>

        {category.exams.length > seen && (
          <button
            type="button"
            onClick={() => setSeen((s) => s + PAGE_SIZE)}
            className="mt-3 w-full rounded-lg border border-dashed border-surface-200 py-1.5 text-[11px] font-semibold text-surface-500 transition-colors hover:border-brand-200 hover:text-brand-600"
          >
            Show {Math.min(PAGE_SIZE, category.exams.length - seen)} more exams
          </button>
        )}
      </div>
    </div>
  );
}
