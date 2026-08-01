'use client';
import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, School, Layers, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import ResourceCard from '@/components/notes/ResourceCard';
import { getLibrary, findInstitution, findCourse } from '@/lib/notesStore';

function CourseHubContent() {
  const { institutionSlug, courseSlug } = useParams<{ institutionSlug: string; courseSlug: string }>();
  const data = getLibrary();
  const institution = findInstitution(data, institutionSlug);
  const course = findCourse(data, courseSlug);

  const majors = useMemo(() => data.majors.filter(m => m.courseId === course?.id && m.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [data, course]);
  const semesters = useMemo(() => data.semesters.filter(s => majors.some(m => m.id === s.majorId)).sort((a, b) => a.order - b.order), [data, majors]);
  const resources = useMemo(() => data.resources.filter(r => r.isPublished && r.status === 'published' && r.courseId === course?.id), [data, course]);

  if (!course) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg font-semibold text-surface-900">Course not found</p>
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
          {institution && (
            <>
              <Link href={`/notes/academic/${institution.slug}`} className="hover:text-brand-600 transition-colors">{institution.name}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="font-medium text-surface-600">{course.name}</span>
        </nav>

        <div className="mb-8 rounded-3xl bg-gradient-hero border border-surface-200/60 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="relative flex flex-wrap items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-mint text-white shadow-lg shadow-mint-500/25">
              <School className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">{course.name}</h1>
              {course.description && <p className="mt-1 max-w-2xl text-sm text-surface-500">{course.description}</p>}
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-lavender-700 shadow-sm"><Layers className="h-4 w-4" /> {majors.length} majors</span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-mint-700 shadow-sm"><Layers className="h-4 w-4" /> {semesters.length} semesters</span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-brand-700 shadow-sm"><School className="h-4 w-4" /> {resources.length} resources</span>
            </div>
          </div>
        </div>

        {semesters.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 font-display text-lg font-bold text-surface-900">Semesters</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {semesters.map(s => {
                const major = data.majors.find(m => m.id === s.majorId);
                const count = data.resources.filter(r => r.semesterId === s.id && r.isPublished).length;
                return (
                  <Link key={s.id} href={`/notes/academic/${institutionSlug}/${courseSlug}/${s.slug}`} className="group">
                    <div className="rounded-2xl border border-surface-200 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                      <p className="font-display font-bold text-surface-900 group-hover:text-mint-600">{s.displayName || s.name}</p>
                      <p className="mt-0.5 truncate text-xs text-surface-400">{major?.name || '—'} · {count} resources</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="mb-4 font-display text-lg font-bold text-surface-900">Resources</h2>
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-200 py-16 text-center text-surface-500">No published resources for this course yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CourseHubPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <CourseHubContent />
    </Suspense>
  );
}
