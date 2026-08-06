'use client';
import { API_BASE } from '@/lib/apiBase';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ChevronRight, BookOpen, Clock, CheckCircle, ArrowRight, Target, BarChart3, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PrelimsPage() {
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/questions?limit=500`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => {
      setAllQuestions(d.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const prelimQuestions = allQuestions.filter(q => q.questionType !== 'mains');

  const allYears = prelimQuestions.map(q => q.year).filter(Boolean) as number[];
  const years = allYears.filter((y, i) => allYears.indexOf(y) === i).sort((a, b) => b - a);
  const yearsOption = years.length > 0 ? years : [];

  const subjectCounts: Record<string, number> = {};
  prelimQuestions.forEach(q => {
    const s = q.subjectId || q.subject?.name || 'General';
    subjectCounts[s] = (subjectCounts[s] || 0) + 1;
  });
  const subjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

  const filtered = prelimQuestions.filter(q => {
    const mYear = !activeYear || q.year === activeYear;
    const mSubject = !activeSubject || (q.subjectId === activeSubject || q.subject?.name === activeSubject);
    return mYear && mSubject;
  });

  const totalSubjects = subjects.length;
  const totalYears = years.length;
  const totalQuestions = prelimQuestions.length;

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/questions" className="hover:text-brand-600 transition-colors">Previous Year Questions</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">Prelims</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Main — 70% */}
          <div className="w-full lg:w-[70%] min-w-0">
            {/* Heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-medium text-brand-700 mb-3">
                <Target className="h-3.5 w-3.5" />
                Objective / MCQ Based
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-3">Prelims Previous Year Questions</h1>
              <p className="text-surface-500 leading-relaxed max-w-2xl">
                Practice subject-wise and year-wise prelims questions with detailed explanations. Track your accuracy and improve speed.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Total Questions', value: loading ? '...' : totalQuestions.toLocaleString(), icon: BookOpen },
                { label: 'Subjects Covered', value: loading ? '...' : totalSubjects.toString(), icon: BarChart3 },
                { label: 'Years Available', value: loading ? '...' : totalYears.toString(), icon: Clock },
                { label: 'Avg Accuracy', value: '—', icon: Target },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="p-4 rounded-lg border border-surface-200 bg-white text-center">
                    <Icon className="h-4 w-4 text-brand-500 mx-auto mb-1.5" />
                    <p className="text-xl font-bold text-surface-900">{s.value}</p>
                    <p className="text-xs text-surface-400">{s.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
                <span className="ml-2 text-sm text-surface-400">Loading questions...</span>
              </div>
            )}

            {!loading && (
              <>
                {/* Year Filter */}
                {yearsOption.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-surface-900 mb-3">Select Year</h3>
                    <div className="flex flex-wrap gap-2">
                      {yearsOption.map((year) => (
                        <button
                          key={year}
                          onClick={() => setActiveYear(year === activeYear ? null : year)}
                          className={`px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            activeYear === year
                              ? 'bg-brand-500 text-white border-brand-500'
                              : 'bg-white text-surface-600 border-surface-200 hover:border-brand-300 hover:text-brand-600'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject Chips */}
                {subjects.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-surface-900 mb-3">Filter by Subject</h3>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((s) => (
                        <button
                          key={s.name}
                          onClick={() => setActiveSubject(s.name === activeSubject ? null : s.name)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm transition-colors ${
                            activeSubject === s.name
                              ? 'bg-brand-50 text-brand-700 border-brand-200'
                              : 'bg-white text-surface-600 border-surface-200 hover:border-brand-200 hover:bg-brand-50/50 hover:text-brand-600'
                          }`}
                        >
                          {s.name}
                          <span className={`text-xs font-medium ${activeSubject === s.name ? 'text-brand-500' : 'text-surface-400'}`}>({s.count})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions */}
                <div className="space-y-4 mb-10">
                  {filtered.map((q, idx) => (
                    <Card key={q.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="default" size="sm">{q.subjectId || q.subject?.name || 'General'}</Badge>
                          {q.year && <span className="text-xs text-surface-400">PYQ {q.year}</span>}
                        </div>
                        <p className="text-surface-900 font-medium leading-relaxed mb-5">
                          <span className="text-brand-500 font-semibold mr-2">Q{idx + 1}.</span>
                          {q.text}
                        </p>
                        {Array.isArray(q.options) && q.options.length > 0 && (
                          <div className="space-y-2 mb-5">
                            {q.options.map((opt: string, i: number) => (
                              opt ? (
                                <div
                                  key={i}
                                  className="flex items-start gap-3 p-3 rounded-lg border border-surface-200 hover:border-brand-200 hover:bg-brand-50/30 cursor-pointer transition-colors"
                                >
                                  <span className="w-6 h-6 rounded-md bg-surface-100 flex items-center justify-center text-xs font-semibold text-surface-500 shrink-0 mt-0.5">
                                    {String.fromCharCode(65 + i)}
                                  </span>
                                  <span className="text-sm text-surface-700">{opt}</span>
                                </div>
                              ) : null
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <Button variant="primary" size="sm">Show Answer</Button>
                          <Button variant="outline" size="sm" onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>
                            {expandedId === q.id ? 'Hide Explanation' : 'View Explanation'}
                          </Button>
                        </div>
                        {expandedId === q.id && q.explanation && (
                          <div className="mt-4 p-4 rounded-lg bg-mint-50 border border-mint-200 animate-fade-in">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-mint-600 mt-0.5 shrink-0" />
                              <div>
                                {q.correctAns && <p className="text-sm font-semibold text-mint-800 mb-1">Answer: {q.correctAns}</p>}
                                <p className="text-sm text-mint-700 leading-relaxed">{q.explanation}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-16">
                      <Search className="h-8 w-8 text-surface-300 mx-auto mb-3" />
                      <p className="text-surface-500">No questions match your filters. Try a different year or subject.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar — 30% */}
          <aside className="w-full lg:w-[30%]">
            <div className="lg:sticky lg:top-20 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-base font-bold text-surface-900 mb-1">Quick Practice</h3>
                  <p className="text-sm text-surface-500 mb-4">Attempt a custom quiz based on your selected filters.</p>
                  <Button className="w-full" size="lg">
                    Start Quiz
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              {totalQuestions > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-base font-bold text-surface-900 mb-3">Prelims Tips</h3>
                    <ul className="space-y-2.5">
                      {[
                        'Focus on NCERTs for conceptual clarity',
                        'Practice at least 10 years of PYQs',
                        'Analyze mistakes with explanations',
                        'Work on speed with timed quizzes',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600">
                          <CheckCircle className="h-4 w-4 text-mint-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
