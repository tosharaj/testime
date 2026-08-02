'use client';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowRight, PlayCircle, FileText, Layers, Sparkles, GraduationCap, Search } from 'lucide-react';
import CrayonStick from '@/components/ui/CrayonStick';
import { crayon } from '@/lib/crayon';
import Button from '@/components/ui/Button';
import PracticePlayer from '@/components/pyq/PracticePlayer';
import {
  pyqCategories, getPyqCategoryById, getPyqCategoryBySlug, getCategoryStats, getPracticeQuestions,
  type PyqCategory, type PyqSubExam, type PyqPracticeSet,
} from '@/lib/pyqData';

type Section = 'papers' | 'practice';

function PYQContent() {
  const searchParams = useSearchParams();
  const preselect = searchParams.get('exam') || searchParams.get('examId') || 'all';

  const [section, setSection] = useState<Section>('papers');
  const [papersCat, setPapersCat] = useState<string>(() => {
    if (preselect !== 'all' && (getPyqCategoryById(preselect) || getPyqCategoryBySlug(preselect))) return preselect;
    return 'all';
  });
  const [practiceCat, setPracticeCat] = useState<string>(() => {
    if (preselect !== 'all' && (getPyqCategoryById(preselect) || getPyqCategoryBySlug(preselect))) return preselect;
    return 'all';
  });
  const [activeSet, setActiveSet] = useState<{ exam: PyqSubExam; set: PyqPracticeSet; questions: ReturnType<typeof getPracticeQuestions> } | null>(null);
  const [examQuery, setExamQuery] = useState('');

  const activePapersCat: PyqCategory | null = papersCat === 'all' ? null : getPyqCategoryById(papersCat) || getPyqCategoryBySlug(papersCat) || null;
  const activePracticeCat: PyqCategory | null = practiceCat === 'all' ? null : getPyqCategoryById(practiceCat) || getPyqCategoryBySlug(practiceCat) || null;

  const papersExams = useMemo(() => {
    let exams = activePapersCat ? activePapersCat.exams : pyqCategories.flatMap((c) => c.exams);
    const q = examQuery.trim().toLowerCase();
    if (q) exams = exams.filter((e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    return exams;
  }, [activePapersCat, examQuery]);

  const practiceExams = useMemo(() => {
    return activePracticeCat ? activePracticeCat.exams : pyqCategories.flatMap((c) => c.exams);
  }, [activePracticeCat]);

  const startPractice = (exam: PyqSubExam, set: PyqPracticeSet) => {
    setActiveSet({ exam, set, questions: getPracticeQuestions(exam.slug, set.subject, set.questionCount) });
    setSection('practice');
  };

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">Previous Year Questions (PYQ)</span>
        </nav>

        {/* Hero */}
        <section className="relative mb-10 overflow-hidden rounded-4xl border-2 border-surface-200/70 bg-[#FFFBFA] p-6 sm:p-10 lg:p-12">
          <div
            className="absolute inset-0 opacity-60"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(239,97,80,0.14) 0.6px, transparent 0.6px)', backgroundSize: '22px 22px' }}
          />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-lavender-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sunny-200/40 blur-3xl" />
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 items-end gap-2 lg:flex xl:right-12">
            <CrayonStick c={crayon(5)} height={80} tilt={-8} delay={0} />
            <CrayonStick c={crayon(2)} height={100} tilt={6} delay={0.4} />
            <CrayonStick c={crayon(4)} height={88} tilt={-4} delay={0.8} />
            <CrayonStick c={crayon(3)} height={112} tilt={9} delay={1.2} />
          </div>
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white/80 px-3 py-1 text-xs font-bold text-brand-600 mb-5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Previous Year Questions
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-surface-900 mb-4 leading-tight">
              Real papers, <span className="bg-gradient-to-r from-coral-500 via-sunny-500 to-mint-500 bg-clip-text text-transparent">every exam</span>
            </h1>
            <p className="text-surface-500 text-base lg:text-lg leading-relaxed max-w-xl">
              Browse previous year question papers for all examinations — from OPSC and OSSC to SSC, Banking, Railways and more. Practice topic-wise PYQs interactively with instant solutions.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={() => setSection('papers')} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition-all hover:bg-brand-600">
                <FileText className="h-4 w-4" /> Browse Papers
              </button>
              <button onClick={() => setSection('practice')} className="inline-flex items-center gap-2 rounded-xl border-2 border-surface-200 bg-white px-5 py-2.5 text-sm font-bold text-surface-700 transition-all hover:border-brand-300 hover:text-brand-600">
                <PlayCircle className="h-4 w-4" /> Practice PYQs
              </button>
            </div>
          </div>
        </section>

        {/* Section tabs */}
        <div className="mb-8 flex rounded-2xl border-2 border-surface-200 bg-white p-1.5 max-w-md">
          {([
            { key: 'papers' as Section, label: 'PYQ Papers by Exam', icon: FileText },
            { key: 'practice' as Section, label: 'Practice PYQs', icon: PlayCircle },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setSection(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                section === t.key ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* ───────────── PAPERS SECTION ───────────── */}
        {section === 'papers' && (
          <div>
            {/* Search */}
            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 pointer-events-none" />
              <input
                value={examQuery}
                onChange={(e) => setExamQuery(e.target.value)}
                placeholder="Search an exam, e.g. OCS, CGL, SSC..."
                className="w-full rounded-2xl border-2 border-surface-200 bg-white pl-12 pr-4 py-3 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-300 transition-all"
              />
            </div>

            {/* Category chips */}
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setPapersCat('all')}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  papersCat === 'all' ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'border-surface-200 bg-white text-surface-600 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                <Layers className="h-4 w-4" /> All Exams
              </button>
              {pyqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setPapersCat(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                    papersCat === cat.id ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'border-surface-200 bg-white text-surface-600 hover:border-brand-300 hover:text-brand-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Exam cards */}
            {papersExams.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-surface-200 bg-surface-50 p-10 text-center">
                <p className="text-surface-400 text-sm">No exams found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {papersExams.map((exam) => {
                  const count = exam.papers.length;
                  const prelims = exam.papers.filter((p) => p.stage === 'Prelims').length;
                  const mains = exam.papers.filter((p) => p.stage === 'Mains').length;
                  const years = exam.papers.map((p) => p.year);
                  const latest = Math.max(...years);
                  const earliest = Math.min(...years);
                  return (
                    <Link
                      key={exam.slug}
                      href={`/questions/${exam.slug}`}
                      className="group flex flex-col rounded-2xl border-2 border-surface-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                          {exam.icon}
                        </div>
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-600">
                          {count} Papers
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-surface-900 mb-1 group-hover:text-brand-600 transition-colors">
                        {exam.name}
                      </h3>
                      <p className="text-sm text-surface-500 leading-relaxed line-clamp-2 mb-4">{exam.description}</p>
                      <div className="mt-auto flex items-center justify-between text-xs text-surface-400">
                        <span>{prelims} Prelims · {mains} Mains</span>
                        <span>{earliest} – {latest}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                        View Papers <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ───────────── PRACTICE SECTION ───────────── */}
        {section === 'practice' && (
          <div>
            {activeSet && (
              <div className="mb-8">
                <PracticePlayer
                  title={`${activeSet.exam.name} — ${activeSet.set.subject} PYQs`}
                  questions={activeSet.questions}
                  onClose={() => setActiveSet(null)}
                />
              </div>
            )}

            {/* Category chips */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setPracticeCat('all')}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  practiceCat === 'all' ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'border-surface-200 bg-white text-surface-600 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                <Layers className="h-4 w-4" /> All Exams
              </button>
              {pyqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setPracticeCat(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                    practiceCat === cat.id ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'border-surface-200 bg-white text-surface-600 hover:border-brand-300 hover:text-brand-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Practice set cards grouped by exam */}
            <div className="space-y-8">
              {practiceExams.map((exam) => (
                <div key={exam.slug}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-100 text-xl">{exam.icon}</span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-surface-900">{exam.name}</h3>
                      <p className="text-xs text-surface-400">{exam.practiceSets.length} practice sets</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {exam.practiceSets.map((set) => (
                      <div key={set.id} className="flex flex-col rounded-2xl border-2 border-surface-200 bg-white p-5 shadow-card transition-all hover:border-mint-300 hover:shadow-card-hover">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-50 px-2.5 py-1 text-[11px] font-bold text-mint-700">
                            <GraduationCap className="h-3.5 w-3.5" /> {set.difficulty}
                          </span>
                          <span className="text-xs font-semibold text-surface-400">{set.questionCount} Questions</span>
                        </div>
                        <h4 className="text-base font-bold text-surface-900 mb-1">{set.subject}</h4>
                        <p className="text-sm text-surface-500 leading-relaxed mb-4">
                          Practice previous year questions on {set.subject.toLowerCase()} with instant answers and explanations.
                        </p>
                        <Button className="mt-auto w-full" size="sm" onClick={() => startPractice(exam, set)}>
                          <PlayCircle className="h-4 w-4 mr-1.5" /> Start Practice
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center bg-white">
        <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <FileText className="h-5 w-5 text-brand-500" />
        </div>
        <p className="text-surface-400">Loading...</p>
      </div>
    }>
      <PYQContent />
    </Suspense>
  );
}
