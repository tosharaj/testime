'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, BookOpen, Layers, FolderOpen, GraduationCap, School } from 'lucide-react';
import type { Subject } from '@/types/notes';
import { getLibrary } from '@/lib/notesStore';
import ResourceCard from '@/components/notes/ResourceCard';
import Badge from '@/components/ui/Badge';

interface Crumb { label: string; href?: string }

export default function SubjectHub({ subject, crumbs }: { subject: Subject; crumbs: Crumb[] }) {
  const data = getLibrary();
  const [activeTopic, setActiveTopic] = useState<string>('all');

  const units = useMemo(() => data.units.filter(u => u.subjectId === subject.id).sort((a, b) => a.order - b.order), [data, subject]);
  const topics = useMemo(() => data.topics.filter(t => t.subjectId === subject.id).sort((a, b) => a.order - b.order), [data, subject]);

  const resources = useMemo(() => {
    const list = data.resources.filter(r => r.isPublished && r.status === 'published' && r.subjectId === subject.id);
    if (activeTopic !== 'all') return list.filter(r => r.topicId === activeTopic);
    return list;
  }, [data, subject, activeTopic]);

  const exam = subject.examId ? data.exams.find(e => e.id === subject.examId) : undefined;
  const category = exam ? data.examCategories.find(c => c.id === exam.categoryId) : undefined;
  const major = subject.majorId ? data.majors.find(m => m.id === subject.majorId) : undefined;
  const course = major ? data.courses.find(c => c.id === major.courseId) : undefined;
  const institution = course ? data.institutions.find(i => i.id === course.institutionId) : undefined;

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
              {c.href ? (
                <Link href={c.href} className="hover:text-brand-600 transition-colors">{c.label}</Link>
              ) : (
                <span className="font-medium text-surface-600">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <div className="mb-8 rounded-3xl bg-gradient-hero border border-surface-200/60 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="relative">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {category && (
                <Link href={`/notes/category/${category.slug}`}><Badge variant="info">{category.name}</Badge></Link>
              )}
              {exam && <Badge variant="success">{exam.shortName || exam.name}</Badge>}
              {institution && <Badge variant="info">{institution.name}</Badge>}
              {course && <Badge variant="default">{course.name}</Badge>}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-brand-500/25">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">{subject.name}</h1>
                {subject.description && <p className="mt-1 max-w-2xl text-sm text-surface-500">{subject.description}</p>}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-brand-700 shadow-sm">
                <Layers className="h-4 w-4" /> {units.length} units
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-mint-700 shadow-sm">
                <FolderOpen className="h-4 w-4" /> {topics.length} topics
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 font-semibold text-accent-700 shadow-sm">
                <BookOpen className="h-4 w-4" /> {resources.length} resources
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar nav */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-2xl border border-surface-200 bg-white p-4 shadow-card">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-surface-400">Units</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTopic('all')}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all ${activeTopic === 'all' ? 'bg-brand-600 font-medium text-white' : 'text-surface-600 hover:bg-surface-100'}`}
                  >
                    <Layers className="h-3.5 w-3.5" /> All Units
                  </button>
                  {units.map(u => (
                    <button
                      key={u.id}
                      onClick={() => setActiveTopic('all')}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-surface-600 hover:bg-surface-100"
                    >
                      <FolderOpen className="h-3.5 w-3.5 text-brand-500" /> {u.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-surface-200 bg-white p-4 shadow-card">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-surface-400">Topics</p>
                <div className="space-y-1">
                  {topics.map(t => (
                    <Link
                      key={t.id}
                      href={`/notes/topic/${t.slug}`}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-surface-600 hover:bg-surface-100 hover:text-brand-600"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-surface-300" /> {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Resources */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTopic('all')}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeTopic === 'all' ? 'bg-surface-900 text-white shadow-sm' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}
              >
                All
              </button>
              {topics.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTopic(activeTopic === t.id ? 'all' : t.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeTopic === t.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {resources.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-surface-200 py-16 text-center">
                <GraduationCap className="mx-auto mb-3 h-10 w-10 text-surface-300" />
                <p className="text-surface-500">No published resources under this subject yet.</p>
                <Link href="/notes/request" className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline">Request this resource</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
