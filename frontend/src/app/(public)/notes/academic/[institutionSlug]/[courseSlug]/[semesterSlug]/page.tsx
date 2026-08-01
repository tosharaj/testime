'use client';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import SemesterHub from '@/components/notes/SemesterHub';
import { getLibrary, findInstitution, findCourse, findSemester } from '@/lib/notesStore';

function AcademicSemesterContent() {
  const { institutionSlug, courseSlug, semesterSlug } = useParams<{ institutionSlug: string; courseSlug: string; semesterSlug: string }>();
  const data = getLibrary();
  const institution = findInstitution(data, institutionSlug);
  const course = findCourse(data, courseSlug);
  const semester = findSemester(data, semesterSlug);

  if (!semester) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg font-semibold text-surface-900">Semester not found</p>
        <a href="/notes" className="text-sm font-semibold text-brand-600 hover:underline">Back to Notes</a>
      </div>
    );
  }

  const crumbs: { label: string; href?: string }[] = [];
  if (institution) crumbs.push({ label: institution.name, href: `/notes/academic/${institution.slug}` });
  if (course) crumbs.push({ label: course.name });

  return <SemesterHub semester={semester} crumbs={crumbs} />;
}

export default function AcademicSemesterPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <AcademicSemesterContent />
    </Suspense>
  );
}
