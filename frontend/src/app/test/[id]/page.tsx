'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ChevronLeft, ChevronRight, Flag, Clock, CheckCircle, XCircle, AlertTriangle, Send, Bookmark } from 'lucide-react';

export default function TestTakingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!id) return;
    import('@/lib/api').then(({ api }) => {
      const attemptId = Array.isArray(id) ? id[0] : id;
      api.getAttempt(attemptId)
        .then((data: any) => {
          setAttempt(data);
          const a: Record<string, string> = {};
          if (data.answers) data.answers.forEach((ans: any) => { a[ans.questionId] = ans.selectedOption; });
          setAnswers(a);
          setTimeLeft((data.test?.duration || 60) * 60);
          setLoading(false);
        })
        .catch(() => { setError('Failed to load test'); setLoading(false); });
    });
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft, submitted]);

  useEffect(() => {
    if (timeLeft <= 0 && !submitted && attempt) handleSubmit();
  }, [timeLeft]);

  const questions = attempt?.test?.questions || [];
  const testInfo = attempt?.test || {};

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const toggleReview = (questionId: string) => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const { api } = await import('@/lib/api');
      const attemptId = Array.isArray(id) ? id[0] : id;
      const ansList = Object.entries(answers).map(([questionId, selectedOption]) => ({ questionId, selectedOption }));
      await api.submitAttempt(attemptId, { answers: ansList, timeTaken: (testInfo.duration || 60) * 60 - timeLeft });
      const correctCount = questions.filter((q: any) => answers[q.id] === q.answer).length;
      setResult({
        total: questions.length,
        answered: Object.keys(answers).length,
        correct: correctCount,
        incorrect: Object.keys(answers).filter(qid => answers[qid] !== questions.find((q: any) => q.id === qid)?.answer).length,
        unanswered: questions.length - Object.keys(answers).length,
        score: correctCount * (testInfo.totalMarks / questions.length) || 0,
      });
      setSubmitted(true);
    } catch {
      setError('Failed to submit');
    }
    setSubmitting(false);
  }, [answers, questions, testInfo, timeLeft, id, submitting, submitted]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center"><Loader2 className="h-8 w-8 text-brand-500 animate-spin mx-auto mb-3" /><p className="text-sm text-surface-400">Loading test...</p></div>
      </div>
    );
  }

  if (error && !attempt) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center"><XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" /><p className="text-lg font-semibold text-surface-900 mb-1">Error</p><p className="text-sm text-surface-500 mb-4">{error}</p><button onClick={() => router.push('/')} className="text-sm text-brand-600 hover:underline">Go Home</button></div>
      </div>
    );
  }

  if (submitted && result) {
    const pct = Math.round((result.correct / result.total) * 100);
    return (
      <div className="min-h-screen bg-surface-50 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
            <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 ${pct >= 60 ? 'bg-emerald-50' : pct >= 35 ? 'bg-amber-50' : 'bg-red-50'}`}>
              {pct >= 60 ? <CheckCircle className="h-10 w-10 text-emerald-500" /> : <AlertTriangle className="h-10 w-10 text-amber-500" />}
            </div>
            <h1 className="text-2xl font-bold text-surface-900 mb-2">Test Submitted</h1>
            <p className="text-surface-500 mb-6">{testInfo.title}</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              <div className="p-3 rounded-lg bg-surface-50"><p className="text-lg font-bold text-surface-900">{result.score.toFixed(0)}</p><p className="text-xs text-surface-400">Score</p></div>
              <div className="p-3 rounded-lg bg-surface-50"><p className="text-lg font-bold text-surface-900">{pct}%</p><p className="text-xs text-surface-400">Accuracy</p></div>
              <div className="p-3 rounded-lg bg-emerald-50"><p className="text-lg font-bold text-emerald-700">{result.correct}</p><p className="text-xs text-emerald-600">Correct</p></div>
              <div className="p-3 rounded-lg bg-red-50"><p className="text-lg font-bold text-red-700">{result.incorrect}</p><p className="text-xs text-red-600">Wrong</p></div>
              <div className="p-3 rounded-lg bg-surface-50"><p className="text-lg font-bold text-surface-900">{result.unanswered}</p><p className="text-xs text-surface-400">Skipped</p></div>
            </div>
            <button onClick={() => router.push('/dashboard')} className="rounded-xl bg-brand-500 text-white px-6 py-2.5 text-sm font-semibold hover:bg-brand-600 transition-colors">View Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const reviewCount = markedForReview.size;

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-surface-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => { if (confirm('Leave test? Progress will be lost.')) router.push('/'); }} className="text-surface-400 hover:text-surface-600"><ChevronLeft className="h-5 w-5" /></button>
          <div>
            <h1 className="text-sm font-semibold text-surface-900 truncate max-w-[300px]">{testInfo.title}</h1>
            <p className="text-xs text-surface-400">Question {currentIdx + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-emerald-500" /><span className="text-surface-500">{answeredCount}</span>
            <Flag className="h-4 w-4 text-amber-500 ml-2" /><span className="text-surface-500">{reviewCount}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${timeLeft < 120 ? 'bg-red-50 text-red-600' : 'bg-surface-100 text-surface-700'}`}>
            <Clock className="h-4 w-4" />{formatTime(timeLeft)}
          </div>
          <button onClick={handleSubmit} disabled={submitting} className="rounded-lg bg-brand-500 text-white px-4 py-1.5 text-sm font-semibold hover:bg-brand-600 disabled:opacity-50 transition-colors flex items-center gap-1.5">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question nav sidebar */}
        <div className="hidden sm:flex flex-col w-48 lg:w-56 bg-white border-r border-surface-200 p-3 overflow-y-auto shrink-0">
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((_: any, i: number) => {
              const qid = questions[i].id;
              const isAnswered = answers[qid];
              const isMarked = markedForReview.has(qid);
              const isActive = i === currentIdx;
              return (
                <button key={qid} onClick={() => setCurrentIdx(i)} className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${isActive ? 'ring-2 ring-brand-500' : ''} ${isAnswered ? 'bg-emerald-100 text-emerald-700' : isMarked ? 'bg-amber-100 text-amber-700' : 'bg-surface-100 text-surface-500 hover:bg-surface-200'}`}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-surface-500">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-100" /> Answered</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-amber-100" /> Review</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-surface-100" /> Unanswered</div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
            {q && (
              <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <p className="text-xs text-surface-400 font-medium mb-2">Question {currentIdx + 1} of {questions.length}</p>
                    <p className="text-surface-900 font-medium leading-relaxed">{q.text}</p>
                  </div>
                  <button onClick={() => toggleReview(q.id)} className={`ml-4 p-2 rounded-lg shrink-0 transition-colors ${markedForReview.has(q.id) ? 'bg-amber-100 text-amber-600' : 'text-surface-300 hover:text-surface-500 hover:bg-surface-100'}`}>
                    <Flag className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {q.options.map((opt: string, oi: number) => {
                    const isSelected = answers[q.id] === opt;
                    return (
                      <button key={oi} onClick={() => handleAnswer(q.id, opt)} className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${isSelected ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-surface-200 bg-white text-surface-700 hover:border-surface-300 hover:bg-surface-50'}`}>
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border text-xs mr-3 font-bold shrink-0 ${isSelected ? 'border-brand-400 bg-brand-500 text-white' : 'border-surface-300 text-surface-500'}">{String.fromCharCode(65 + oi)}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-4">
              <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0} className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 disabled:opacity-30 px-3 py-2">
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1} className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 disabled:opacity-30 px-3 py-2">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
