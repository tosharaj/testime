'use client';
import { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, RotateCcw, Send, Sparkles,
} from 'lucide-react';
import type { PyqQuestion } from '@/lib/pyqData';
import Button from '@/components/ui/Button';

interface PracticePlayerProps {
  title: string;
  questions: PyqQuestion[];
  onClose?: () => void;
}

export default function PracticePlayer({ title, questions, onClose }: PracticePlayerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  const q = questions[index];
  const answeredCount = Object.keys(answers).length;

  const select = (optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
  };

  const toggleFlag = () => {
    if (submitted) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      return next;
    });
  };

  const submit = () => {
    setSubmitted(true);
    setReviewIdx(0);
  };

  const retry = () => {
    setAnswers({});
    setFlagged(new Set());
    setSubmitted(false);
    setIndex(0);
    setReviewIdx(0);
  };

  // ── Results view ──────────────────────────────────────────────────────────
  if (submitted) {
    const correct = questions.filter((question) => answers[question.id] === question.answer).length;
    const skipped = questions.filter((question) => answers[question.id] === undefined).length;
    const incorrect = questions.length - correct - skipped;
    const pct = Math.round((correct / questions.length) * 100);
    const reviewQ = questions[reviewIdx];

    return (
      <div className="rounded-3xl border-2 border-surface-200 bg-white shadow-card overflow-hidden animate-fade-in">
        {/* Score header */}
        <div className="bg-[#FFFBFA] border-b border-surface-200 px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-1">Practice Result</p>
              <h3 className="font-display text-2xl font-bold text-surface-900">{title}</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold ${pct >= 60 ? 'bg-mint-100 text-mint-700' : pct >= 35 ? 'bg-sunny-100 text-sunny-700' : 'bg-coral-100 text-coral-700'}`}>
                {pct}%
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-mint-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-mint-700">{correct}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-mint-600">Correct</p>
                </div>
                <div className="rounded-xl bg-coral-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-coral-700">{incorrect}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-coral-600">Wrong</p>
                </div>
                <div className="rounded-xl bg-surface-100 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-surface-700">{skipped}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-surface-500">Skipped</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review */}
        <div className="px-6 py-6 sm:px-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-surface-700">
              Review Question {reviewIdx + 1} of {questions.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setReviewIdx((i) => Math.max(0, i - 1))} disabled={reviewIdx === 0} className="rounded-lg border border-surface-200 p-2 text-surface-500 hover:text-brand-600 disabled:opacity-30 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setReviewIdx((i) => Math.min(questions.length - 1, i + 1))} disabled={reviewIdx === questions.length - 1} className="rounded-lg border border-surface-200 p-2 text-surface-500 hover:text-brand-600 disabled:opacity-30 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200 p-5 sm:p-6">
            <div className="flex items-start gap-2 mb-4">
              <span className={`mt-0.5 shrink-0 ${answers[reviewQ.id] === reviewQ.answer ? 'text-mint-600' : 'text-coral-600'}`}>
                {answers[reviewQ.id] === reviewQ.answer ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              </span>
              <p className="text-surface-900 font-medium leading-relaxed">{reviewQ.text}</p>
            </div>
            <div className="space-y-2 mb-4">
              {reviewQ.options.map((opt, oi) => {
                const isCorrect = oi === reviewQ.answer;
                const isPicked = answers[reviewQ.id] === oi;
                return (
                  <div
                    key={oi}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-sm transition-colors ${
                      isCorrect
                        ? 'border-mint-300 bg-mint-50'
                        : isPicked
                          ? 'border-coral-300 bg-coral-50'
                          : 'border-surface-200 bg-white'
                    }`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold shrink-0 ${isCorrect ? 'bg-mint-500 text-white' : isPicked ? 'bg-coral-500 text-white' : 'bg-surface-100 text-surface-500'}`}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="text-surface-700">{opt}</span>
                    {isPicked && <span className="ml-auto shrink-0 text-xs font-bold text-surface-400">Your answer</span>}
                  </div>
                );
              })}
            </div>
            <div className="rounded-xl bg-brand-50 border border-brand-100 p-4">
              <p className="text-sm font-semibold text-brand-800 mb-1">
                Answer: {String.fromCharCode(65 + reviewQ.answer)}. {reviewQ.options[reviewQ.answer]}
              </p>
              <p className="text-sm text-brand-700 leading-relaxed">{reviewQ.explanation}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-surface-500">{answeredCount} of {questions.length} answered</p>
            <div className="flex items-center gap-3">
              {onClose && (
                <Button variant="ghost" onClick={onClose}>Back to Sets</Button>
              )}
              <Button onClick={retry}>
                <RotateCcw className="h-4 w-4 mr-1.5" /> Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Question view ─────────────────────────────────────────────────────────
  return (
    <div className="rounded-3xl border-2 border-surface-200 bg-white shadow-card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-surface-200 px-6 py-4">
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold text-surface-900 truncate">{title}</h3>
          <p className="text-xs text-surface-400">Question {index + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-mint-600"><CheckCircle className="h-4 w-4" /> {answeredCount}</span>
          <span className="flex items-center gap-1.5 text-sunny-600"><Flag className="h-4 w-4" /> {flagged.size}</span>
          <button onClick={() => setFlagged((prev) => { const n = new Set(prev); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; })} className={`rounded-lg p-2 transition-colors ${flagged.has(q.id) ? 'bg-sunny-50 text-sunny-600' : 'text-surface-300 hover:text-surface-500 hover:bg-surface-100'}`} aria-label="Mark for review">
            <Flag className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="px-6 py-6 sm:px-8">
        <p className="text-surface-900 font-medium leading-relaxed mb-6">{q.text}</p>
        <div className="space-y-2.5">
          {q.options.map((opt, oi) => {
            const isSelected = answers[q.id] === oi;
            return (
              <button
                key={oi}
                onClick={() => select(oi)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-surface-200 bg-white text-surface-700 hover:border-surface-300 hover:bg-surface-50'
                }`}
              >
                <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full border text-xs mr-3 font-bold ${isSelected ? 'border-brand-400 bg-brand-500 text-white' : 'border-surface-300 text-surface-500'}`}>
                  {String.fromCharCode(65 + oi)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Nav */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 disabled:opacity-30 px-3 py-2 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="flex items-center gap-3">
            {onClose && <Button variant="ghost" onClick={onClose}>Exit</Button>}
            {index < questions.length - 1 ? (
              <Button onClick={() => setIndex((i) => i + 1)}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
            ) : (
              <Button onClick={submit} disabled={answeredCount === 0}>
                <Send className="h-4 w-4 mr-1.5" /> Submit
              </Button>
            )}
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-surface-400">
          <Sparkles className="h-3.5 w-3.5" /> Mark questions with the flag to review them later.
        </p>
      </div>
    </div>
  );
}
