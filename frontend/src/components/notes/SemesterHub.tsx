'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, BookOpen, School, Layers, GraduationCap } from 'lucide-react';
import type { Semester } from '@/types/notes';
import { getLibrary } from '@/lib/notesStore';
import ResourceCard from '@/components/notes/ResourceCard';
import Badge from '@/components/ui/Badge';

export default function SemesterHub({ semester, crumbs }: { semester: Semester; crumbs: { label: string; href?: string }[] }) {
  const data = getLibrary();
  const [activeSubject, setActiveSubject] = useState<string>('all');

  const major = data.majors.find(m => m.id === semester.majorId);
  const course = major ? data.courses.find(c => c.id === major.courseId) : undefined;
  const institution = course ? data.institutions.find(i => i.id === course.institutionId) : undefined;

  const subjects = useMemo(() => data.subjects.filter(s => s.majorId === major?.id && s.isActive), [data, major]);
  const resources = useMemo(() => {
    const list = data.resources.filter(r => r.isPublished && r.status === 'published' && r.semesterId === semester.id);
    if (activeSubject !== 'all') return list.filter(r => r.subjectId === activeSubject);
    return list;
  }, [data, semester, activeSubject]);

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.href ? <Link href={c.href} className="hover:text-brand-600 transition-colors">{c.label}</Link> : <span className="font-medium text-surface-600">{c.label}</span>}
            </span>
          ))}
        </nav>

        <div className="mb-8 rounded-3xl bg-gradient-hero border border-surface-200/60 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="relative">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {institution && <Badge variant="info">{institution.name}</Badge>}
              {course && <Badge variant="default">{course.name}</Badge>}
              {major && <Badge variant="warning">{major.name}</Badge>}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-mint text-white shadow-lg shadow-mint-500/25">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">{semester.displayName || semester.name}</h1>
                {course && <p className="mt-1 text-sm text-surface-500">{course.name} · {major?.name}</p>}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-lavender-700 shadow-sm">
                <Layers className="h-4 w-4" /> {subjects.length} subjects
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-brand-700 shadow-sm">
                <BookOpen className="h-4 w-4" /> {resources.length} resources
              </span>
            </div>
          </div>
        </div>

        {subjects.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 font-display text-lg font-bold text-surface-900">Subjects</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map(s => (
                <Link key={s.id} href={`/notes/subject/${s.slug}`} className="group">
                  <div className="flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-50">
                      <School className="h-5 w-5 text-mint-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-surface-900 group-hover:text-mint-600">{s.name}</p>
                      <p className="truncate text-xs text-surface-400">{data.topics.filter(t => t.subjectId === s.id).length} topics</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-surface-300 group-hover:text-mint-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubject('all')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeSubject === 'all' ? 'bg-surface-900 text-white shadow-sm' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}
          >
            All
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSubject(activeSubject === s.id ? 'all' : s.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeSubject === s.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-200 py-16 text-center">
            <School className="mx-auto mb-3 h-10 w-10 text-surface-300" />
            <p className="text-surface-500">No published resources for {semester.displayName || semester.name} yet.</p>
            <Link href="/notes/request" className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline">Request this resource</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
