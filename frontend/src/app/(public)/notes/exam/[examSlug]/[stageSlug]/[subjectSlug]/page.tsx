'use client';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import SubjectHub from '@/components/notes/SubjectHub';
import { getLibrary, findExam, findStage, findSubject } from '@/lib/notesStore';

function ExamSubjectContent() {
  const { examSlug, stageSlug, subjectSlug } = useParams<{ examSlug: string; stageSlug: string; subjectSlug: string }>();
  const data = getLibrary();
  const exam = findExam(data, examSlug);
  const stage = findStage(data, stageSlug);
  const subject = findSubject(data, subjectSlug);

  if (!subject) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg font-semibold text-surface-900">Subject not found</p>
        <a href="/notes" className="text-sm font-semibold text-brand-600 hover:underline">Back to Notes</a>
      </div>
    );
  }

  const category = exam ? data.examCategories.find(c => c.id === exam.categoryId) : undefined;
  const crumbs: { label: string; href?: string }[] = [];
  if (category) crumbs.push({ label: category.name, href: `/notes/category/${category.slug}` });
  if (exam) crumbs.push({ label: exam.shortName || exam.name, href: `/notes/subject/${exam.slug}` });
  if (stage) crumbs.push({ label: stage.name });

  return <SubjectHub subject={subject} crumbs={crumbs} />;
}

export default function ExamSubjectPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <ExamSubjectContent />
    </Suspense>
  );
}
