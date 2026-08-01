'use client';
import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, GraduationCap, ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import ResourceCard from '@/components/notes/ResourceCard';
import { getLibrary, findExamCategory } from '@/lib/notesStore';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark: GraduationCap,
  Users: FileText,
  School: FileText,
  BookOpen: FileText,
};

function CategoryContent() {
  const { slug } = useParams<{ slug: string }>();
  const data = getLibrary();
  const cat = findExamCategory(data, slug);

  const exams = useMemo(() => data.exams.filter(e => e.categoryId === cat?.id && e.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [data, cat]);
  const resources = useMemo(() => data.resources.filter(r => r.isPublished && r.status === 'published' && r.examCategoryId === cat?.id), [data, cat]);

  if (!cat) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg font-semibold text-surface-900">Category not found</p>
        <Link href="/notes" className="text-sm font-semibold text-brand-600 hover:underline">Back to Notes</Link>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">{cat.name}</span>
        </nav>

        <div className="mb-8 rounded-3xl bg-gradient-hero border border-surface-200/60 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-brand-500/25">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">{cat.name}</h1>
              {cat.description && <p className="mt-1 text-sm text-surface-500">{cat.description}</p>}
            </div>
          </div>
        </div>

        <h2 className="mb-4 font-display text-lg font-bold text-surface-900">Exams in this category</h2>
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map(e => {
            const examResources = resources.filter(r => r.examId === e.id);
            const examSubjects = data.subjects.filter(s => s.examId === e.id);
            return (
              <Link key={e.id} href={`/notes/subject/${e.slug}`} className="group">
                <Card className="h-full card-hover">
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-surface-900 group-hover:text-brand-600 transition-colors">{e.name}</h3>
                      <ArrowRight className="h-4 w-4 shrink-0 text-surface-300 group-hover:text-brand-400 transition-colors" />
                    </div>
                    {e.description && <p className="mb-3 line-clamp-2 text-sm text-surface-500">{e.description}</p>}
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="font-semibold text-brand-600">{examResources.length} resources</span>
                      <span className="text-surface-400">·</span>
                      <span className="font-medium text-surface-500">{examSubjects.length} subjects</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <h2 className="mb-4 font-display text-lg font-bold text-surface-900">Resources</h2>
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-200 py-16 text-center text-surface-500">
            No resources published under this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
