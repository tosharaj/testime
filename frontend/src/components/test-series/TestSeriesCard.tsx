'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Users, BookOpen, FileText, BarChart3, Globe, Zap } from 'lucide-react';

interface TestSeriesCardProps {
  name: string;
  fullName: string;
  slug: string;
  totalTests: number;
  freeTests: number;
  userCount?: string;
  languages?: string[];
  previewTests?: string[];
  extraTestCount?: number;
  tintColor?: string;
}

export default function TestSeriesCard({
  name,
  fullName,
  slug,
  totalTests,
  freeTests,
  userCount = '0',
  languages = ['English', 'Odia'],
  previewTests = [],
  extraTestCount = 0,
  tintColor = '#e0f2fe',
}: TestSeriesCardProps) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const topTint = tintColor;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-surface-200/60 shadow-sm hover:shadow-md transition-all duration-200 h-full">
      {/* 1. Soft tinted top header zone */}
      <div className="h-10 rounded-t-2xl" style={{ backgroundColor: topTint }} />

      <div className="flex flex-col flex-1 p-5 pt-4">
        {/* 2. Top row: logo left, pill right */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center text-sm font-bold text-brand-600 shrink-0">
            {initials}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-600">
            <Zap className="h-3 w-3 text-sunny-500" />
            {(parseInt(userCount.replace(/[^0-9.]/g, '')) || 0) >= 1000
              ? `${(parseInt(userCount.replace(/[^0-9.]/g, '')) / 1000).toFixed(1)}k`
              : userCount}{' '}
            Users
          </div>
        </div>

        {/* 3. Multi-line title */}
        <h3 className="text-[17px] font-semibold text-surface-900 leading-snug mb-3 line-clamp-2 min-h-[2.75rem]">
          {name}: {fullName}
        </h3>

        {/* 4. Meta info rows */}
        <div className="space-y-1.5 mb-3 text-sm">
          <div className="flex items-center gap-4 text-surface-500">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-surface-400" />
              {totalTests} Tests
            </span>
            {freeTests > 0 && (
              <span className="flex items-center gap-1.5 text-mint-600 font-medium">
                <BarChart3 className="h-3.5 w-3.5" />
                {freeTests} Free
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-surface-500">
            <Globe className="h-3.5 w-3.5 text-surface-400 shrink-0" />
            <span className="text-xs">
              Available in{' '}
              <span className="text-brand-600 font-medium">
                {languages.join(', ')}
              </span>
            </span>
          </div>
        </div>

        {/* Subtle divider */}
        <div className="border-t border-surface-100 mb-3" />

        {/* 5. Preview bullet list */}
        <div className="space-y-1.5 min-h-[5.5rem] mb-4 flex-1">
          {previewTests.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-surface-500">
              <BookOpen className="h-3.5 w-3.5 text-surface-300 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
          {extraTestCount > 0 && (
            <div className="flex items-start gap-2 text-xs text-mint-600 font-medium">
              <BookOpen className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>+{extraTestCount} more tests</span>
            </div>
          )}
        </div>

        {/* 6. Full-width CTA button */}
        <Link
          href={`/test-series/${slug}`}
          className={cn(
            'block w-full h-11 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold',
            'flex items-center justify-center gap-2 transition-colors mt-auto'
          )}
        >
          View Test Series
        </Link>
      </div>
    </div>
  );
}
