'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { examMenuCategories } from '@/lib/examMenuData';
import { ArrowRight, GraduationCap, ChevronRight, Search, Sparkles } from 'lucide-react';

export default function ExamsPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return examMenuCategories.map(cat => ({
      ...cat,
      exams: q
        ? cat.exams.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
        : cat.exams,
    })).filter(cat => cat.exams.length > 0);
  }, [query]);

  const totalExams = examMenuCategories.reduce((s, c) => s + c.exams.length, 0);

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">Exams</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-4xl bg-gradient-hero border border-surface-200/60 p-8 lg:p-12 mb-8">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-surface-200 px-3 py-1 text-xs font-semibold text-brand-600 mb-5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              All Examination Boards
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-surface-900 mb-4 leading-tight">
              Choose Your <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">Exam Board</span>
            </h1>
            <p className="text-surface-500 text-base lg:text-lg leading-relaxed max-w-xl">
              {examMenuCategories.length} boards, {totalExams}+ examinations — OPSC, OSSC, OSSSC, SSB, Odisha Police and national exams, all in one place.
            </p>
          </div>
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for an exam, e.g. CGL, OCS, Constable..."
              className="w-full max-w-md rounded-2xl border border-surface-200 bg-white/90 backdrop-blur pl-11 pr-4 py-3 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-300 transition-all shadow-sm"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-surface-300" />
            </div>
            <p className="text-lg font-semibold text-surface-900 mb-2">No exams found</p>
            <p className="text-sm text-surface-500">Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map(cat => (
              <section key={cat.slug}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} text-white shadow-sm`}>
                    <cat.menuIcon className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-xl font-bold text-surface-900 leading-tight">{cat.name}</h2>
                    <p className="text-xs text-surface-400 truncate">{cat.fullName}</p>
                  </div>
                  <Link
                    href={`/exams/${cat.slug}`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    View Board <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cat.exams.map(exam => (
                    <Link
                      key={exam.slug}
                      href={`/exams/${exam.slug}`}
                      title={exam.description}
                      className="group flex items-center gap-2.5 rounded-xl border border-surface-200 bg-white px-3 py-2.5 transition-all duration-150 hover:border-brand-200 hover:shadow-card-hover hover:-translate-y-0.5"
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} text-sm shadow-sm transition-transform group-hover:scale-110`}>
                        <span className="drop-shadow-sm">{exam.icon || '📁'}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-surface-800 group-hover:text-brand-600 transition-colors">{exam.name}</span>
                        <span className="block truncate text-[11px] text-surface-400">{exam.description}</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-surface-200 group-hover:text-brand-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
