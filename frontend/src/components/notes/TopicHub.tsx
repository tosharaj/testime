'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, BookOpen, FolderOpen, School } from 'lucide-react';
import { getLibrary } from '@/lib/notesStore';
import ResourceCard from '@/components/notes/ResourceCard';
import Badge from '@/components/ui/Badge';

interface TopicContentProps {
  topicSlug: string;
}

export default function TopicContent({ topicSlug }: TopicContentProps) {
  const data = getLibrary();
  const [activeSubtopic, setActiveSubtopic] = useState<string>('all');

  const realTopic = data.topics.find(t => t.slug === topicSlug);
  const subject = realTopic ? data.subjects.find(s => s.id === realTopic.subjectId) : undefined;
  const unit = realTopic?.unitId ? data.units.find(u => u.id === realTopic.unitId) : undefined;

  const resources = useMemo(() => {
    const list = data.resources.filter(r => r.isPublished && r.status === 'published' && (r.topicId === realTopic?.id || r.unitId === realTopic?.unitId || r.subjectId === realTopic?.subjectId));
    if (activeSubtopic !== 'all') return list.filter(r => r.topicId === activeSubtopic);
    return list;
  }, [data, realTopic, activeSubtopic]);

  if (!realTopic || !subject) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg font-semibold text-surface-900">Topic not found</p>
        <a href="/notes" className="text-sm font-semibold text-brand-600 hover:underline">Back to Notes</a>
      </div>
    );
  }

  const exam = subject.examId ? data.exams.find(e => e.id === subject.examId) : undefined;
  const category = exam ? data.examCategories.find(c => c.id === exam.categoryId) : undefined;
  const siblingTopics = data.topics.filter(t => t.subjectId === subject.id && t.id !== realTopic.id);

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
          {exam && (
            <>
              <Link href={`/notes/subject/${subject.slug}`} className="hover:text-brand-600 transition-colors">{exam.shortName || exam.name}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          {unit && (
            <>
              <Link href={`/notes/subject/${subject.slug}`} className="hover:text-brand-600 transition-colors">{unit.name}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="font-medium text-surface-600">{realTopic.name}</span>
        </nav>

        <div className="mb-8 rounded-3xl bg-gradient-mint border border-mint-200/60 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-30" />
          <div className="relative">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {category && <Badge variant="info">{category.name}</Badge>}
              {exam && <Badge variant="success">{exam.shortName || exam.name}</Badge>}
              {subject && <Badge variant="default">{subject.name}</Badge>}
              {unit && <Badge variant="warning">{unit.name}</Badge>}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">{realTopic.name}</h1>
            {realTopic.description && <p className="mt-1 max-w-2xl text-sm text-surface-500">{realTopic.description}</p>}
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-mint-200 px-3 py-1.5 font-semibold text-mint-700 shadow-sm">
                <BookOpen className="h-4 w-4" /> {resources.length} resources
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-mint-200 px-3 py-1.5 font-semibold text-surface-700 shadow-sm">
                <FolderOpen className="h-4 w-4" /> {siblingTopics.length} related topics
              </span>
            </div>
          </div>
        </div>

        {siblingTopics.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 font-display text-lg font-bold text-surface-900">Related topics</h2>
            <div className="flex flex-wrap gap-2">
              {siblingTopics.map(t => (
                <Link key={t.id} href={`/notes/topic/${t.slug}`} className="rounded-full border border-surface-200 bg-white px-4 py-1.5 text-sm font-medium text-surface-600 transition-all hover:border-mint-300 hover:text-mint-700">
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-200 py-16 text-center">
            <School className="mx-auto mb-3 h-10 w-10 text-surface-300" />
            <p className="text-surface-500">No published resources for this topic yet.</p>
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
