'use client';
import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, School, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import ResourceCard from '@/components/notes/ResourceCard';
import { getLibrary, findInstitution } from '@/lib/notesStore';

function InstitutionHubContent() {
  const { institutionSlug } = useParams<{ institutionSlug: string }>();
  const data = getLibrary();
  const institution = findInstitution(data, institutionSlug);

  const courses = useMemo(() => data.courses.filter(c => c.institutionId === institution?.id && c.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [data, institution]);
  const resources = useMemo(() => data.resources.filter(r => r.isPublished && r.status === 'published' && r.institutionId === institution?.id), [data, institution]);

  if (!institution) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg font-semibold text-surface-900">Institution not found</p>
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
          <span className="font-medium text-surface-600">{institution.name}</span>
        </nav>

        <div className="mb-8 rounded-3xl bg-gradient-hero border border-surface-200/60 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="relative flex flex-wrap items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-mint text-white shadow-lg shadow-mint-500/25">
              <School className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">{institution.name}</h1>
              {institution.description && <p className="mt-1 max-w-2xl text-sm text-surface-500">{institution.description}</p>}
            </div>
            <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-surface-200 px-3 py-1.5 text-sm font-semibold text-brand-700 shadow-sm"><BookOpen className="h-4 w-4" /> {resources.length} resources</span>
          </div>
        </div>

        <h2 className="mb-4 font-display text-lg font-bold text-surface-900">Courses</h2>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(c => {
            const majors = data.majors.filter(m => m.courseId === c.id);
            return (
              <Link key={c.id} href={`/notes/academic/${institution.slug}/${c.slug}`} className="group">
                <Card className="h-full card-hover">
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-surface-900 group-hover:text-mint-600">{c.name}</h3>
                      <ArrowRight className="h-4 w-4 shrink-0 text-surface-300 group-hover:text-mint-500" />
                    </div>
                    {c.description && <p className="mb-3 line-clamp-2 text-sm text-surface-500">{c.description}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {majors.slice(0, 3).map(m => (
                        <span key={m.id} className="rounded-lg bg-lavender-50 px-2 py-0.5 text-[11px] font-medium text-lavender-700">{m.name}</span>
                      ))}
                      {majors.length > 3 && <span className="rounded-lg bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-400">+{majors.length - 3}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <h2 className="mb-4 font-display text-lg font-bold text-surface-900">Resources</h2>
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-200 py-16 text-center text-surface-500">No published resources for this institution yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstitutionHubPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <InstitutionHubContent />
    </Suspense>
  );
}
