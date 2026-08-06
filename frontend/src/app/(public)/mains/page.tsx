'use client';
import { API_BASE } from '@/lib/apiBase';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ChevronRight, PenTool, Clock, BookOpen, CheckCircle, ArrowRight, FileText, UserCheck, Lightbulb, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MainsPage() {
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePaper, setActivePaper] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/questions?limit=500`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => {
      setAllQuestions(d.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const mainsQuestions = allQuestions.filter(q => q.questionType === 'mains' || q.paper);
  const allPapers = mainsQuestions.map(q => q.paper).filter(Boolean) as string[];
  const papers = allPapers.filter((p, i) => allPapers.indexOf(p) === i).sort();
  const activePaperName = activePaper || papers[0] || '';
  if (!activePaper && papers.length > 0) setActivePaper(papers[0]);

  const paperCounts: Record<string, number> = {};
  mainsQuestions.forEach(q => {
    const p = q.paper || 'General';
    paperCounts[p] = (paperCounts[p] || 0) + 1;
  });

  const filtered = mainsQuestions.filter(q => q.paper === activePaperName);

  const totalPapers = papers.length;
  const allYears = mainsQuestions.map(q => q.year).filter(Boolean) as number[];
  const totalYears = allYears.filter((y, i) => allYears.indexOf(y) === i).length;
  const totalQuestions = mainsQuestions.length;
  const currentCount = paperCounts[activePaperName] || 0;

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/questions" className="hover:text-brand-600 transition-colors">Previous Year Questions</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">Mains</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Main — 70% */}
          <div className="w-full lg:w-[70%] min-w-0">
            {/* Heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-medium text-brand-700 mb-3">
                <PenTool className="h-3.5 w-3.5" />
                Descriptive / Answer Writing
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-3">Mains Previous Year Questions</h1>
              <p className="text-surface-500 leading-relaxed max-w-2xl">
                Practice paper-wise and year-wise mains questions. Each card includes answer cues and marking scheme insights.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Total Questions', value: loading ? '...' : totalQuestions.toLocaleString(), icon: BookOpen },
                { label: 'Papers Covered', value: loading ? '...' : totalPapers.toString(), icon: FileText },
                { label: 'Years Available', value: loading ? '...' : totalYears.toString(), icon: Clock },
                { label: 'Optional Subjects', value: loading ? '...' : papers.filter(p => p.startsWith('Optional')).length.toString(), icon: UserCheck },
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

            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
                <span className="ml-2 text-sm text-surface-400">Loading questions...</span>
              </div>
            )}

            {!loading && (
              <>
                {/* Paper Tabs */}
                {papers.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-surface-900 mb-3">Select Paper</h3>
                    <div className="flex flex-wrap gap-2">
                      {papers.map((p) => (
                        <button
                          key={p}
                          onClick={() => setActivePaper(p)}
                          className={`px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            activePaperName === p
                              ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                              : 'bg-white text-surface-600 border-surface-200 hover:border-brand-300 hover:text-brand-600'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paper info strip */}
                {activePaperName && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-surface-50 border border-surface-200 mb-6">
                    <FileText className="h-5 w-5 text-brand-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-surface-900">{activePaperName}</p>
                      <p className="text-xs text-surface-500">{currentCount} questions</p>
                    </div>
                  </div>
                )}

                {/* Questions */}
                <div className="space-y-5 mb-10">
                  {filtered.map((q, idx) => (
                    <Card key={q.id} className="hover:shadow-card-hover transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {q.year && <Badge variant="default" size="sm">{q.year}</Badge>}
                            <span className="text-xs text-surface-400">{q.paper}</span>
                          </div>
                          {q.marks && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-amber-600 border border-amber-200 bg-amber-50">
                              {q.marks} marks
                            </span>
                          )}
                        </div>
                        <p className="text-surface-900 font-medium leading-relaxed mb-4">
                          <span className="text-brand-500 font-semibold mr-2">Q{idx + 1}.</span>
                          {q.text}
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <Button variant="primary" size="sm" onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>
                            <Lightbulb className="h-3.5 w-3.5" />
                            {expandedId === q.id ? 'Hide Answer Cues' : 'View Answer Cues'}
                          </Button>
                          <Button variant="outline" size="sm">Write Answer</Button>
                        </div>
                        {expandedId === q.id && (
                          <div className="mt-4 p-4 rounded-lg bg-mint-50 border border-mint-200 animate-fade-in">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-mint-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-mint-800 mb-2">Answer Cues</p>
                                <ul className="space-y-1.5">
                                  {Array.isArray(q.answerCues) && q.answerCues.filter(Boolean).map((cue: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-mint-700">
                                      <CheckCircle className="h-3.5 w-3.5 text-mint-500 shrink-0" />
                                      {cue}
                                    </li>
                                  ))}
                                  {(!q.answerCues || !Array.isArray(q.answerCues) || q.answerCues.filter(Boolean).length === 0) && (
                                    <li className="text-sm text-mint-600">{q.explanation || 'No answer cues available.'}</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-16">
                      <PenTool className="h-8 w-8 text-surface-300 mx-auto mb-3" />
                      <p className="text-surface-500">No questions yet for this paper.</p>
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
                  <h3 className="text-base font-bold text-surface-900 mb-1">Answer Writing Practice</h3>
                  <p className="text-sm text-surface-500 mb-4">Write, submit, and get your answers evaluated by experts.</p>
                  <Button className="w-full" size="lg">
                    Start Writing
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              {papers.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-base font-bold text-surface-900 mb-3">Paper-wise Coverage</h3>
                    <ul className="space-y-2.5">
                      {papers.map((p) => (
                        <li key={p} className="flex items-center justify-between text-sm">
                          <span className="text-surface-600">{p}</span>
                          <span className="text-surface-400 font-medium">{paperCounts[p] || 0} Qs</span>
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
