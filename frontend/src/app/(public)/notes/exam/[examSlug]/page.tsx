'use client';
import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, GraduationCap, BookOpen, ArrowRight, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import ResourceCard from '@/components/notes/ResourceCard';
import { getLibrary, findExam } from '@/lib/notesStore';

function ExamHubContent() {
  const { examSlug } = useParams<{ examSlug: string }>();
  const data = getLibrary();
  const exam = findExam(data, examSlug);

  const category = exam ? data.examCategories.find(c => c.id === exam.categoryId) : undefined;
  const stages = useMemo(() => data.examStages.filter(s => s.examId === exam?.id).sort((a, b) => a.order - b.order), [data, exam]);
  const subjects = useMemo(() => data.subjects.filter(s => s.examId === exam?.id && s.isActive), [data, exam]);
  const resources = useMemo(() => data.resources.filter(r => r.isPublished && r.status === 'published' && r.examId === exam?.id), [data, exam]);

  if (!exam) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg font-semibold text-surface-900">Exam not found</p>
        <a href="/notes" className="text-sm font-semibold text-brand-600 hover:underline">Back to Notes</a>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {category && (
            <>
              <Link href={`/notes/category/${category.slug}`} className="hover:text-brand-600 transition-colors">{category.name}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="font-medium text-surface-600">{exam.name}</span>
        </nav>

        <div className="mb-8 rounded-3xl bg-gradient-hero border border-surface-200/60 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="relative flex flex-wrap items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-brand-500/25">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">{exam.name}</h1>
              {exam.description && <p className="mt-1 max-w-2xl text-sm text-surface-500">{exam.description}</p>}
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-brand-700 shadow-sm"><BookOpen className="h-4 w-4" /> {resources.length} resources</span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-mint-700 shadow-sm"><Layers className="h-4 w-4" /> {subjects.length} subjects</span>
            </div>
          </div>
        </div>

        {stages.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 font-display text-lg font-bold text-surface-900">Exam Stages</h2>
            <div className="flex flex-wrap gap-3">
              {stages.map(s => {
                const stageResources = resources.filter(r => r.stageId === s.id);
                const stageSubjects = subjects;
                return (
                  <Link key={s.id} href={`/notes/exam/${exam.slug}/${s.slug}/${stageSubjects[0]?.slug || ''}`} className="group">
                    <div className="rounded-2xl border border-surface-200 bg-white px-5 py-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                      <p className="font-display font-bold text-surface-900 group-hover:text-brand-600">{s.name}</p>
                      <p className="mt-1 text-xs text-surface-400">{stageResources.length} resources · {s.description || 'Exam stage'}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {subjects.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 font-display text-lg font-bold text-surface-900">Subjects</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map(s => {
                const count = resources.filter(r => r.subjectId === s.id).length;
                return (
                  <Link key={s.id} href={`/notes/subject/${s.slug}`} className="group">
                    <div className="flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                        <BookOpen className="h-5 w-5 text-brand-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-surface-900 group-hover:text-brand-600">{s.name}</p>
                        <p className="truncate text-xs text-surface-400">{count} resources</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-surface-300 group-hover:text-brand-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="mb-4 font-display text-lg font-bold text-surface-900">All Resources</h2>
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-200 py-16 text-center text-surface-500">No published resources for this exam yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExamHubPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <ExamHubContent />
    </Suspense>
  );
}
