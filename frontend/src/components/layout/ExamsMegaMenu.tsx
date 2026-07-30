'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ArrowRight, BookOpen, FileText, BrainCircuit, TrendingUp, Sparkles } from 'lucide-react';
import ExamCategoryIcon from '@/components/icons/ExamCategoryIcon';
import { examCategories } from '@/lib/examCategories';

const categoryAccents: Record<string, { header: string; light: string; border: string }> = {
  ossc:               { header: 'bg-indigo-500',  light: 'bg-indigo-50/70',  border: 'border-indigo-200' },
  osssc:              { header: 'bg-emerald-500', light: 'bg-emerald-50/70', border: 'border-emerald-200' },
  opsc:               { header: 'bg-blue-500',    light: 'bg-blue-50/70',    border: 'border-blue-200' },
  ssb:                { header: 'bg-purple-500',  light: 'bg-purple-50/70',  border: 'border-purple-200' },
  'odisha-police':    { header: 'bg-red-500',     light: 'bg-red-50/70',     border: 'border-red-200' },
  'odisha-teaching':  { header: 'bg-amber-500',   light: 'bg-amber-50/70',   border: 'border-amber-200' },
  'odisha-universities': { header: 'bg-teal-500', light: 'bg-teal-50/70',    border: 'border-teal-200' },
  other:              { header: 'bg-slate-500',   light: 'bg-slate-50/70',   border: 'border-slate-200' },
};

export default function ExamsMegaMenu() {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<string>(examCategories[0].slug);
  const rightRef = useRef<HTMLDivElement>(null);
  const selected = examCategories.find((c) => c.slug === activeCategory) || examCategories[0];
  const accent = categoryAccents[selected.slug] || categoryAccents.other;

  useEffect(() => {
    rightRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  return (
    <div className="flex rounded-3xl bg-white border-2 border-surface-100 shadow-2xl shadow-brand-500/10 overflow-hidden w-[820px] max-h-[580px]">
      {/* Left Panel */}
      <div className="w-56 shrink-0 border-r-2 border-surface-100 bg-surface-50/80 overflow-y-auto p-3 space-y-1">
        <div className="px-2.5 pb-2 mb-2 border-b-2 border-surface-100">
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-surface-400 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-sunny-500" />
            Categories
          </p>
        </div>
        {examCategories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const catAccent = categoryAccents[cat.slug] || categoryAccents.other;
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              onMouseEnter={() => setActiveCategory(cat.slug)}
              className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-2xl text-left transition-all duration-150 relative ${
                isActive
                  ? 'bg-white shadow-md ring-2 ring-surface-200/80'
                  : 'text-surface-600 hover:bg-white/70 hover:text-surface-800'
              }`}
            >
              {isActive && (
                <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${catAccent.header}`} />
              )}
              <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl">
                <ExamCategoryIcon exam={cat.slug} />
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-extrabold truncate leading-tight ${isActive ? 'text-surface-900' : ''}`}>
                  {cat.name}
                </p>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-xl shrink-0 border-2 ${
                isActive
                  ? `${catAccent.light} ${catAccent.border} text-surface-700`
                  : 'bg-surface-100 border-surface-200 text-surface-400'
              }`}>
                {cat.examCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Panel */}
      <div ref={rightRef} className="flex-1 overflow-y-auto">
        {/* Gradient Header */}
        <div className={`sticky top-0 z-10 ${accent.header} px-6 py-5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                <ExamCategoryIcon exam={selected.slug} />
              </span>
              <div className="text-white">
                <h3 className="text-base font-extrabold">{selected.name}</h3>
                <p className="text-xs text-white/80 mt-0.5 font-semibold">{selected.fullName}</p>
              </div>
            </div>
            <Link
              href={`/exams/${selected.slug}`}
              className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-2xl transition-all hover:scale-105"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Popular Exams */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-coral-500" />
              <p className="text-xs font-black uppercase tracking-wider text-surface-400">Popular</p>
              <Sparkles className="h-3 w-3 text-sunny-500" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {selected.exams.slice(0, 6).map((exam) => (
                <Link
                  key={exam.slug}
                  href={`/exams/${selected.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-2xl border-2 border-surface-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                  onMouseEnter={(e) => {
                    const ac = categoryAccents[activeCategory] || categoryAccents.other;
                    e.currentTarget.style.borderColor = ac.border.replace('border-', '');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e4e4e7';
                  }}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-surface-50 shrink-0 overflow-hidden group-hover:scale-110 group-hover:-rotate-3 transition-all duration-200">
                    <ExamCategoryIcon exam={selected.slug} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-surface-800 group-hover:text-brand-600 transition-colors truncate">
                      {exam.name}
                    </p>
                    <p className="text-xs text-surface-400 truncate font-medium">{exam.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-surface-300 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* All Exams */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-wider text-surface-400">All Exams</p>
              <span className="text-[11px] font-bold text-surface-400 bg-surface-100 px-2.5 py-1 rounded-xl">{selected.exams.length} exams</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {selected.exams.map((exam) => (
                <Link
                  key={exam.slug}
                  href={`/exams/${selected.slug}`}
                  className="group flex items-center gap-2.5 p-2.5 rounded-2xl border-2 border-surface-100 bg-surface-50/50 hover:bg-white hover:border-surface-200 hover:shadow-md transition-all duration-200"
                >
                  <span className="flex items-center justify-center h-8 w-8 rounded-xl bg-white shrink-0 overflow-hidden">
                    <span className="text-sm">{exam.icon || '📁'}</span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-surface-700 group-hover:text-brand-600 transition-colors truncate">
                      {exam.name}
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-surface-300 group-hover:text-brand-400 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Footer */}
          <div className="pt-1">
            <Link
              href={`/exams/${selected.slug}`}
                className="flex items-center justify-center gap-2.5 text-sm font-extrabold text-white bg-brand-500 hover:bg-brand-600 py-3.5 rounded-2xl shadow-sm shadow-brand-500/15 hover:shadow-md hover:shadow-brand-500/20 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Browse all {selected.name} resources
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
