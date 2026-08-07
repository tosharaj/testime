'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ncertApi, ChapterQuiz, ChapterTest, PracticeQuestion } from '@/lib/ncertApi';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  ChevronLeft, BrainCircuit, ClipboardList, Clock, CheckCircle, XCircle,
  ArrowRight, RotateCcw, AlertCircle, BookOpen, ListChecks, Loader2
} from 'lucide-react';

type Mode = 'menu' | 'practice' | 'test';

interface TestRun {
  test: ChapterTest;
  questions: { id: string; text: string; options: string[]; answer: string; explanation?: string | null }[];
  idx: number;
  answers: Record<string, string>;
  timeLeft: number;
  submitted: boolean;
  result: null | { total: number; answered: number; correct: number; incorrect: number; unanswered: number; score: number };
}

const formatTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export default function NcertPracticePage() {
  const params = useParams();
  const bookSlug = params.book as string;
  const chapterSlug = params.chapter as string;

  const [data, setData] = useState<ChapterQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('menu');

  const [practice, setPractice] = useState<{ idx: number; answers: Record<string, string>; finished: boolean } | null>(null);
  const [test, setTest] = useState<TestRun | null>(null);
  const [startingTest, setStartingTest] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    ncertApi
      .getChapterQuiz(bookSlug, chapterSlug)
      .then((d) => {
        if (!mounted) return;
        setData(d);
        setLoading(false);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e.message);
        setLoading(false);
      });
    return () => {
      mounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [bookSlug, chapterSlug]);

  const finishTest = useCallback(() => {
    setTest((s) => {
      if (!s || s.submitted) return s;
      const answered = Object.keys(s.answers).length;
      const correct = s.questions.filter((qq) => s.answers[qq.id] === qq.answer).length;
      return {
        ...s,
        submitted: true,
        result: {
          total: s.questions.length,
          answered,
          correct,
          incorrect: answered - correct,
          unanswered: s.questions.length - answered,
          score: Math.round(correct * (s.test.totalMarks / Math.max(1, s.questions.length))),
        },
      };
    });
  }, []);

  useEffect(() => {
    if (!test || test.submitted) return;
    if (test.timeLeft <= 0) {
      finishTest();
      return;
    }
    timerRef.current = setInterval(() => {
      setTest((s) => (s ? { ...s, timeLeft: s.timeLeft - 1 } : s));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [test?.timeLeft, test?.submitted, finishTest]);

  const startPractice = () => {
    setMode('practice');
    setPractice({ idx: 0, answers: {}, finished: false });
  };

  const startTest = async (t: ChapterTest) => {
    setStartingTest(true);
    setError('');
    try {
      const full = await ncertApi.getTest(t.id);
      const questions = (full?.questions ?? [])
        .map((tq: any) => tq?.question)
        .filter(Boolean)
        .map((q: any) => {
          let options: string[] = [];
          try {
            options = JSON.parse(q.options);
          } catch {
            options = [];
          }
          return { id: q.id, text: q.text, options, answer: q.correctAns, explanation: q.explanation };
        });
      if (!questions.length) {
        setError('This test has no questions yet.');
        setStartingTest(false);
        return;
      }
      setTest({ test: t, questions, idx: 0, answers: {}, timeLeft: t.duration * 60, submitted: false, result: null });
      setMode('test');
      setStartingTest(false);
    } catch (e: any) {
      setError(e.message);
      setStartingTest(false);
    }
  };

  const questions = data?.questions ?? [];
  const practiceQ = practice ? questions[practice.idx] : null;
  const practiceCorrect = practice ? questions.filter((q) => practice.answers[q.id] === q.correctAns).length : 0;
  const practiceAnswered = practice ? Object.keys(practice.answers).length : 0;

  const testQ = test && !test.submitted ? test.questions[test.idx] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-surface-900 mb-2">Could not load this chapter</p>
          <p className="text-sm text-surface-500 mb-4">{error}</p>
          <Link href="/ncert"><Button variant="outline"><ChevronLeft className="h-4 w-4 mr-1" /> Back to NCERT</Button></Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const classSlug = `class-${data.chapter.book.class}`;

  const goMenu = () => {
    setMode('menu');
    setPractice(null);
    setTest(null);
  };

  const renderSummary = (
    correct: number,
    total: number,
    score?: number,
    onRestart?: () => void
  ) => {
    const pct = total ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
          <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 ${pct >= 60 ? 'bg-emerald-50' : pct >= 35 ? 'bg-amber-50' : 'bg-red-50'}`}>
            {pct >= 60 ? <CheckCircle className="h-10 w-10 text-emerald-500" /> : <XCircle className="h-10 w-10 text-amber-500" />}
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Practice Complete</h1>
          <p className="text-sm text-surface-500 mb-6">Accuracy {pct}%{typeof score === 'number' ? ` · Score ${score}` : ''}</p>
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-surface-50"><p className="text-lg font-bold text-surface-900">{correct}</p><p className="text-xs text-surface-400">Correct</p></div>
            <div className="p-3 rounded-lg bg-red-50"><p className="text-lg font-bold text-red-700">{total - correct}</p><p className="text-xs text-red-600">Wrong</p></div>
            <div className="p-3 rounded-lg bg-surface-50"><p className="text-lg font-bold text-surface-900">{total - Object.keys(practice?.answers ?? {}).length}</p><p className="text-xs text-surface-400">Skipped</p></div>
            <div className="p-3 rounded-lg bg-brand-50"><p className="text-lg font-bold text-brand-700">{total}</p><p className="text-xs text-brand-600">Total</p></div>
          </div>
          <div className="flex items-center justify-center gap-2">
            {onRestart && (
              <Button onClick={onRestart}><RotateCcw className="h-4 w-4 mr-1" /> Practice Again</Button>
            )}
            <Button variant="outline" onClick={goMenu}><ListChecks className="h-4 w-4 mr-1" /> Chapter Menu</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link href={`/ncert/${classSlug}`} className="p-2 rounded-xl text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-display text-xl lg:text-2xl font-bold text-surface-900">{data.chapter.name}</h1>
              </div>
              <p className="text-xs text-surface-400">
                {data.chapter.book.subject} · {data.chapter.book.name} · Class {data.chapter.book.class}
              </p>
            </div>
          </div>
          {mode !== 'menu' && (
            <Button variant="outline" size="sm" onClick={goMenu}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Menu
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-coral-200 bg-coral-50 p-4 text-sm text-coral-700">{error}</div>
        )}

        {/* ── MENU ─────────────────────────────────────────────────────── */}
        {mode === 'menu' && (
          <div className="space-y-6">
            {data.chapter.summary && (
              <div className="rounded-2xl border border-surface-200 p-4 text-sm text-surface-600 bg-surface-50/50">
                {data.chapter.summary}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-mint-50 py-2 text-xs font-semibold text-mint-700">
                <BrainCircuit className="h-4 w-4" /> {questions.length} MCQs
              </div>
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-50 py-2 text-xs font-semibold text-brand-700">
                <ClipboardList className="h-4 w-4" /> {data.tests.length} Quizzes
              </div>
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-surface-100 py-2 text-xs font-semibold text-surface-600">
                <Clock className="h-4 w-4" /> NCERT
              </div>
            </div>

            <div className="rounded-2xl border border-surface-200 overflow-hidden">
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-surface-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint-50 text-mint-700">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-surface-900">Practice MCQs</h2>
                    <p className="text-xs text-surface-400">Untimed practice with instant feedback</p>
                  </div>
                </div>
                <Button size="sm" onClick={startPractice} disabled={questions.length === 0}>
                  {questions.length === 0 ? 'No MCQs yet' : 'Start Practice'}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-surface-200 overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-surface-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-surface-900">Chapter Quizzes</h2>
                    <p className="text-xs text-surface-400">Timed tests created by admins</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-surface-100">
                {data.tests.length === 0 && (
                  <p className="p-5 text-sm text-surface-400">No quizzes created for this chapter yet.</p>
                )}
                {data.tests.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 p-4 sm:px-6">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{t.title}</p>
                      <p className="text-xs text-surface-400">
                        <Clock className="h-3 w-3 inline mr-0.5" />{t.duration} min · {t.questionCount} Qs · {t.totalMarks} marks
                      </p>
                    </div>
                    <Button size="sm" onClick={() => startTest(t)} disabled={startingTest}>
                      {startingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Take Test'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRACTICE ─────────────────────────────────────────────────── */}
        {mode === 'practice' && practice && (
          practice.finished ? (
            renderSummary(
              practiceCorrect,
              questions.length,
              undefined,
              () => setPractice({ idx: 0, answers: {}, finished: false })
            )
          ) : practiceQ ? (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-4 text-sm text-surface-400">
                <span>Question {practice.idx + 1} of {questions.length}</span>
                <span className="font-medium text-mint-600">{practiceAnswered} answered</span>
              </div>
              <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8">
                <p className="text-surface-900 font-medium leading-relaxed mb-5">{practiceQ.text}</p>
                <div className="space-y-2.5">
                  {practiceQ.options.map((opt, oi) => {
                    const selected = practice.answers[practiceQ.id] === opt;
                    const isCorrect = opt === practiceQ.correctAns;
                    const showState = selected || practice.answers[practiceQ.id] !== undefined;
                    let cls = 'border-surface-200 bg-white text-surface-700 hover:border-surface-300 hover:bg-surface-50';
                    if (showState && isCorrect) cls = 'border-emerald-300 bg-emerald-50 text-emerald-800';
                    else if (showState && selected) cls = 'border-red-300 bg-red-50 text-red-700';
                    return (
                      <button
                        key={oi}
                        onClick={() => {
                          if (practice.answers[practiceQ.id] !== undefined) return;
                          setPractice((s) => (s ? { ...s, answers: { ...s.answers, [practiceQ.id]: opt } } : s));
                        }}
                        disabled={practice.answers[practiceQ.id] !== undefined}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${cls}`}
                      >
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border text-xs mr-3 font-bold shrink-0 border-surface-300 text-surface-500">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {practice.answers[practiceQ.id] !== undefined && (
                  <div className={`mt-4 rounded-xl p-4 text-sm ${practice.answers[practiceQ.id] === practiceQ.correctAns ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
                    <p className="font-semibold mb-1">
                      {practice.answers[practiceQ.id] === practiceQ.correctAns ? 'Correct!' : `Incorrect. Correct: ${practiceQ.correctAns}`}
                    </p>
                    {practiceQ.explanation && <p className="text-xs leading-relaxed">{practiceQ.explanation}</p>}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPractice((s) => (s ? { ...s, idx: Math.max(0, s.idx - 1) } : s))}
                  disabled={practice.idx === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  size="sm"
                  onClick={() => setPractice((s) => {
                    if (!s) return s;
                    if (s.idx + 1 < questions.length) return { ...s, idx: s.idx + 1 };
                    return { ...s, finished: true };
                  })}
                >
                  {practice.idx + 1 < questions.length ? (<>Next <ArrowRight className="h-4 w-4 ml-1" /></>) : 'Finish'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <BrainCircuit className="h-12 w-12 text-surface-300 mx-auto mb-4" />
              <p className="text-surface-500 font-medium">No MCQs yet</p>
              <p className="text-xs text-surface-400 mt-1">Questions added in the admin will appear here.</p>
              <Button className="mt-4" variant="outline" onClick={goMenu}>Back to Menu</Button>
            </div>
          )
        )}

        {/* ── TEST ─────────────────────────────────────────────────────── */}
        {mode === 'test' && test && (
          test.submitted && test.result ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
                <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 ${test.result.correct / Math.max(1, test.result.total) >= 0.6 ? 'bg-emerald-50' : test.result.correct / Math.max(1, test.result.total) >= 0.35 ? 'bg-amber-50' : 'bg-red-50'}`}>
                  {test.result.correct / Math.max(1, test.result.total) >= 0.6
                    ? <CheckCircle className="h-10 w-10 text-emerald-500" />
                    : <XCircle className="h-10 w-10 text-amber-500" />}
                </div>
                <h1 className="text-2xl font-bold text-surface-900 mb-2">Test Submitted</h1>
                <p className="text-surface-500 mb-6">{test.test.title}</p>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-surface-50"><p className="text-lg font-bold text-surface-900">{test.result.score}</p><p className="text-xs text-surface-400">Score</p></div>
                  <div className="p-3 rounded-lg bg-emerald-50"><p className="text-lg font-bold text-emerald-700">{test.result.correct}</p><p className="text-xs text-emerald-600">Correct</p></div>
                  <div className="p-3 rounded-lg bg-red-50"><p className="text-lg font-bold text-red-700">{test.result.incorrect}</p><p className="text-xs text-red-600">Wrong</p></div>
                  <div className="p-3 rounded-lg bg-surface-50"><p className="text-lg font-bold text-surface-900">{test.result.unanswered}</p><p className="text-xs text-surface-400">Skipped</p></div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button onClick={() => startTest(test.test)}><RotateCcw className="h-4 w-4 mr-1" /> Retake</Button>
                  <Button variant="outline" onClick={goMenu}><ListChecks className="h-4 w-4 mr-1" /> Chapter Menu</Button>
                </div>
              </div>
            </div>
          ) : testQ ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-semibold text-surface-900">{test.test.title}</p>
                  <p className="text-xs text-surface-400">Question {test.idx + 1} of {test.questions.length}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${test.timeLeft < 120 ? 'bg-red-50 text-red-600' : 'bg-surface-100 text-surface-700'}`}>
                  <Clock className="h-4 w-4" /> {formatTime(test.timeLeft)}
                </div>
              </div>
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8">
                  <p className="text-surface-900 font-medium leading-relaxed mb-5">{testQ.text}</p>
                  <div className="space-y-2.5">
                    {testQ.options.map((opt, oi) => {
                      const selected = test.answers[testQ.id] === opt;
                      return (
                        <button
                          key={oi}
                          onClick={() => setTest((s) => (s ? { ...s, answers: { ...s.answers, [testQ.id]: opt } } : s))}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${selected ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-surface-200 bg-white text-surface-700 hover:border-surface-300 hover:bg-surface-50'}`}
                        >
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full border text-xs mr-3 font-bold shrink-0 ${selected ? 'border-brand-400 bg-brand-500 text-white' : 'border-surface-300 text-surface-500'}`}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm" onClick={() => setTest((s) => (s ? { ...s, idx: Math.max(0, s.idx - 1) } : s))} disabled={test.idx === 0}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button size="sm" onClick={finishTest}><CheckCircle className="h-4 w-4 mr-1" /> Submit Test</Button>
                  <Button
                    size="sm"
                    onClick={() => setTest((s) => (s ? { ...s, idx: Math.min(s.questions.length - 1, s.idx + 1) } : s))}
                    disabled={test.idx === test.questions.length - 1}
                  >
                    Next <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          ) : null
        )}
      </div>
    </div>
  );
}
