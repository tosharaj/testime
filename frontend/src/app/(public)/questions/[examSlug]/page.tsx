'use client';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, ArrowRight, PlayCircle, FileText, Calendar, Layers, GraduationCap, Sparkles } from 'lucide-react';
import CrayonStick from '@/components/ui/CrayonStick';
import { crayon } from '@/lib/crayon';
import Button from '@/components/ui/Button';
import PracticePlayer from '@/components/pyq/PracticePlayer';
import {
  findPyqExam, findPyqCategoryForExam, getPyqCategoryBySlug, getPracticeQuestions,
  type PyqSubExam, type PyqPracticeSet, type PyqCategory,
} from '@/lib/pyqData';

type Stage = 'Prelims' | 'Mains';

export default function PyqExamPage() {
  const params = useParams();
  const slug = Array.isArray(params.examSlug) ? params.examSlug[0] : params.examSlug;

  const exam = useMemo(() => findPyqExam(slug), [slug]);
  const category = useMemo(() => (exam ? findPyqCategoryForExam(slug) : getPyqCategoryBySlug(slug)), [slug, exam]);

  const [stage, setStage] = useState<Stage>('Prelims');
  const [activeSet, setActiveSet] = useState<{ set: PyqPracticeSet; questions: ReturnType<typeof getPracticeQuestions> } | null>(null);

  // If the slug is a category, render a category overview grid instead.
  if (!exam && category) {
    return <CategoryOverview category={category} />;
  }

  if (!exam) {
    return (
      <div className="bg-white py-24 text-center">
        <p className="text-surface-400 mb-4">Exam not found.</p>
        <Link href="/questions" className="text-sm font-semibold text-brand-600 hover:underline">← Back to all PYQs</Link>
      </div>
    );
  }

  const papers = exam.papers.filter((p) => p.stage === stage);
  const years = papers.map((p) => p.year);
  const latest = Math.max(...years);
  const earliest = Math.min(...years);

  const startPractice = (set: PyqPracticeSet) => {
    setActiveSet({ set, questions: getPracticeQuestions(exam.slug, set.subject, set.questionCount) });
  };

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400 flex-wrap">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/questions" className="hover:text-brand-600 transition-colors">PYQ</Link>
          {category && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={`/questions/${category.slug}`} className="hover:text-brand-600 transition-colors">{category.name}</Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">{exam.name}</span>
        </nav>

        {/* Exam header */}
        <section className="relative mb-8 overflow-hidden rounded-4xl border-2 border-surface-200/70 bg-[#FFFBFA] p-6 sm:p-10">
          <div
            className="absolute inset-0 opacity-60"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(239,97,80,0.14) 0.6px, transparent 0.6px)', backgroundSize: '22px 22px' }}
          />
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 items-end gap-2 lg:flex">
            <CrayonStick c={crayon(5)} height={72} tilt={-8} delay={0} />
            <CrayonStick c={crayon(3)} height={96} tilt={6} delay={0.4} />
            <CrayonStick c={crayon(1)} height={80} tilt={-4} delay={0.8} />
          </div>
          <div className="relative max-w-2xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm border-2 border-surface-200">
              {exam.icon}
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-surface-900 mb-2">
              {exam.name} Previous Year Papers
            </h1>
            <p className="text-surface-500 leading-relaxed max-w-xl mb-5">{exam.description}</p>
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white px-3 py-1.5 text-xs font-bold text-surface-600">
                <FileText className="h-3.5 w-3.5" /> {exam.papers.length} Papers
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white px-3 py-1.5 text-xs font-bold text-surface-600">
                <Calendar className="h-3.5 w-3.5" /> {earliest} – {latest}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white px-3 py-1.5 text-xs font-bold text-surface-600">
                <Layers className="h-3.5 w-3.5" /> {exam.practiceSets.length} Practice Sets
              </span>
            </div>
          </div>
        </section>

        {/* Papers */}
        <div className="mb-10">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-display text-xl font-bold text-surface-900">Previous Year Papers</h2>
            <div className="flex rounded-xl border-2 border-surface-200 bg-white p-1">
              {(['Prelims', 'Mains'] as Stage[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                    stage === s ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {papers.map((paper) => (
              <div key={`${paper.stage}-${paper.year}`} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border-2 border-surface-200 bg-white p-4 sm:p-5 shadow-card transition-all hover:border-brand-300 hover:shadow-card-hover">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-600">
                  {paper.year}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-surface-900">{exam.name} {paper.stage} Paper — {paper.year}</p>
                  <p className="text-xs text-surface-400 mt-0.5">
                    {paper.subjects.length} subjects · {paper.totalQuestions} questions · {paper.marks} marks
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1.5" /> View Paper
                  </Button>
                  <Button size="sm" onClick={() => startPractice(exam.practiceSets[0])}>
                    <PlayCircle className="h-4 w-4 mr-1.5" /> Practice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice */}
        <div className="mb-10">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-surface-900 mb-1">Practice {exam.name} PYQs</h2>
            <p className="text-sm text-surface-500">Attempt previous year questions interactively, subject by subject.</p>
          </div>

          {activeSet && (
            <div className="mb-8">
              <PracticePlayer
                title={`${exam.name} — ${activeSet.set.subject} PYQs`}
                questions={activeSet.questions}
                onClose={() => setActiveSet(null)}
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exam.practiceSets.map((set) => (
              <div key={set.id} className="flex flex-col rounded-2xl border-2 border-surface-200 bg-white p-5 shadow-card transition-all hover:border-mint-300 hover:shadow-card-hover">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-50 px-2.5 py-1 text-[11px] font-bold text-mint-700">
                    <GraduationCap className="h-3.5 w-3.5" /> {set.difficulty}
                  </span>
                  <span className="text-xs font-semibold text-surface-400">{set.questionCount} Questions</span>
                </div>
                <h3 className="text-base font-bold text-surface-900 mb-1">{set.subject}</h3>
                <p className="text-sm text-surface-500 leading-relaxed mb-4">Practice {set.subject.toLowerCase()} PYQs with instant answers and explanations.</p>
                <Button className="mt-auto w-full" size="sm" onClick={() => startPractice(set)}>
                  <PlayCircle className="h-4 w-4 mr-1.5" /> Start Practice
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Link href="/questions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
          <ArrowLeft className="h-4 w-4" /> Back to all exams
        </Link>
      </div>
    </div>
  );
}

function CategoryOverview({ category }: { category: PyqCategory }) {
  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/questions" className="hover:text-brand-600 transition-colors">PYQ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">{category.name}</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white px-3 py-1 text-xs font-bold text-brand-600 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> {category.name}
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-surface-900 mb-3">
            {category.name} Previous Year Papers
          </h1>
          <p className="text-surface-500 leading-relaxed max-w-2xl">
            Browse previous year question papers for every {category.name} examination.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {category.exams.map((exam) => {
            const years = exam.papers.map((p) => p.year);
            return (
              <Link
                key={exam.slug}
                href={`/questions/${exam.slug}`}
                className="group flex flex-col rounded-2xl border-2 border-surface-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                  {exam.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-surface-900 mb-1 group-hover:text-brand-600 transition-colors">
                  {exam.name}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed line-clamp-2 mb-4">{exam.description}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-surface-400">
                  <span>{exam.papers.length} papers</span>
                  <span>{Math.min(...years)} – {Math.max(...years)}</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  View Papers <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
