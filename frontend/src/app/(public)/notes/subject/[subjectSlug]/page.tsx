'use client';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import SubjectHub from '@/components/notes/SubjectHub';
import { getLibrary, findSubject } from '@/lib/notesStore';

function SubjectContent() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>();
  const data = getLibrary();
  const subject = findSubject(data, subjectSlug);

  if (!subject) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg font-semibold text-surface-900">Subject not found</p>
        <a href="/notes" className="text-sm font-semibold text-brand-600 hover:underline">Back to Notes</a>
      </div>
    );
  }

  const exam = subject.examId ? data.exams.find(e => e.id === subject.examId) : undefined;
  const crumbs: { label: string; href?: string }[] = [];
  if (exam) {
    const cat = data.examCategories.find(c => c.id === exam.categoryId);
    if (cat) crumbs.push({ label: cat.name, href: `/notes/category/${cat.slug}` });
    crumbs.push({ label: exam.shortName || exam.name, href: `/notes/exam/${exam.slug}` });
  } else {
    const major = subject.majorId ? data.majors.find(m => m.id === subject.majorId) : undefined;
    const course = major ? data.courses.find(c => c.id === major.courseId) : undefined;
    const inst = course ? data.institutions.find(i => i.id === course.institutionId) : undefined;
    if (inst) crumbs.push({ label: inst.name, href: `/notes/academic/${inst.slug}` });
    if (course) crumbs.push({ label: course.name, href: `/notes/academic/${inst?.slug}/${course.slug}` });
    if (major) crumbs.push({ label: major.name });
  }

  return <SubjectHub subject={subject} crumbs={crumbs} />;
}

export default function SubjectPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <SubjectContent />
    </Suspense>
  );
}
