'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ChevronRight, BrainCircuit, Clock, Target, BarChart3, BookOpen, Search, SlidersHorizontal, Lock, CheckCircle, Star, Sparkles, TrendingUp, Users, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { getCategoryBySlug, examCategories } from '@/lib/examCategories';
import { examStageMap } from '@/lib/examStages';
const typeOptions = ['full-mock', 'sectional', 'topic-wise', 'pyq-test', 'daily-challenge'];
const typeLabels: Record<string, string> = {
  'full-mock': 'Full Mock Tests', 'sectional': 'Sectional Tests', 'topic-wise': 'Topic-wise Tests',
  'pyq-test': 'PYQ Tests', 'daily-challenge': 'Daily Challenges',
};

export default function ExamTestSeriesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const examSlug = params.exam as string;

  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState('All');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const category = getCategoryBySlug(examSlug);
  const exam = category || examCategories.flatMap(c => c.exams).find(e => e.slug === examSlug);
  const stages = ['All', ...(examStageMap[category?.id || ''] || ['Prelims', 'Mains', 'Interview'])];

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    api.getTests({ examId: examSlug }).then((res) => {
      setTests(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [examSlug]);

  const groupedByType: Record<string, any[]> = {};
  const filtered = tests.filter(t => {
    const mStage = stage === 'All' || t.stage === stage;
    const mType = !typeFilter || t.test_type === typeFilter;
    const mSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    return mStage && mType && mSearch;
  });

  filtered.forEach(t => {
    const key = t.test_type || 'full-mock';
    if (!groupedByType[key]) groupedByType[key] = [];
    groupedByType[key].push(t);
  });

  const sortedGroups = Object.entries(groupedByType).sort(([a], [b]) => {
    const order = typeOptions.indexOf(a);
    const orderB = typeOptions.indexOf(b);
    return (order === -1 ? 99 : order) - (orderB === -1 ? 99 : orderB);
  });

  const continueTests = filtered.filter(t => t.attempt_count > 0);
  const freeTests = filtered.filter(t => t.isFree);
  const stats = {
    total: tests.length,
    free: tests.filter(t => t.isFree).length,
    fullMock: tests.filter(t => t.test_type === 'full-mock').length,
    pyq: tests.filter(t => t.test_type === 'pyq-test').length,
  };

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/test-series" className="hover:text-brand-600">Test Series</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">{exam?.name || examSlug}</span>
        </nav>

        {/* Exam Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-lg">{'📘'}</div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-surface-900">{exam?.name || examSlug}</h1>
              {category && <p className="text-sm text-surface-400">{category.name}</p>}
            </div>
          </div>
          <p className="text-surface-500 leading-relaxed max-w-2xl">
            Practice with exam-specific mock tests, sectional quizzes, and topic-wise assessments.
          </p>
        </div>

        {/* Stats Row */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Tests', value: stats.total, icon: BrainCircuit },
              { label: 'Free Tests', value: stats.free, icon: CheckCircle },
              { label: 'Full Mocks', value: stats.fullMock, icon: Target },
              { label: 'PYQs', value: stats.pyq, icon: BookOpen },
            ].map(s => {
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
        )}

        {/* Stage Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-lg w-fit mb-6 flex-wrap">
          {stages.map(s => (
            <button
              key={s} onClick={() => setStage(s)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${stage === s ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search + Filter + Sort */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tests..." className="w-full rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 placeholder-surface-400" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <option value="">All Types</option>
            {typeOptions.map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="difficulty">Difficulty</option>
          </select>
          <span className="text-sm text-surface-400">{filtered.length} tests</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-brand-500 animate-spin" /><span className="ml-2 text-sm text-surface-400">Loading tests...</span></div>
        ) : (
          <>
            {/* Continue Section */}
            {isLoggedIn && continueTests.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-brand-500" /> Continue Where You Left</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {continueTests.slice(0, 3).map(t => (
                    <Link key={t.id} href={`/test-series/${examSlug}/test/${t.slug}`}>
                      <Card className="border-brand-200 hover:shadow-card-hover"><CardContent className="p-4"><p className="font-medium text-surface-900">{t.title}</p><p className="text-xs text-surface-400 mt-1">{t.question_count || 0} questions</p></CardContent></Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Test Groups */}
            {sortedGroups.map(([type, group]) => (
              <div key={type} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-surface-900">{typeLabels[type] || type}</h2>
                  <Link href={`/test-series/${examSlug}/${type}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All →</Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.map(t => (
                    <Link key={t.id} href={`/test-series/${examSlug}/test/${t.slug}`}>
                      <Card className="hover:shadow-card-hover transition-shadow h-full">
                        <CardContent className="p-5 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant={t.isFree ? 'success' : 'premium'} size="sm">{t.isFree ? 'Free' : 'Premium'}</Badge>
                            <div className="flex gap-1">
                              {t.stage && <Badge variant="info" size="sm">{t.stage}</Badge>}
                              {t.difficulty && <Badge variant={t.difficulty === 'easy' ? 'success' : t.difficulty === 'hard' ? 'danger' : 'warning'} size="sm">{t.difficulty}</Badge>}
                            </div>
                          </div>
                          <h3 className="font-semibold text-surface-900 mb-2">{t.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-surface-500 mb-3 flex-1 flex-wrap">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration || 0} min</span>
                            <span className="flex items-center gap-1"><Target className="h-3 w-3" />{t.totalMarks || 0} marks</span>
                            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{t.question_count || 0} Qs</span>
                            {t.attempt_count > 0 && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{t.attempt_count}</span>}
                          </div>
                          <Button variant={t.isFree ? 'primary' : 'outline'} size="sm" className="w-full">
                            {t.isFree ? 'Start Free Test' : 'Unlock Test'}
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-20"><BrainCircuit className="h-10 w-10 text-surface-300 mx-auto mb-3" /><p className="text-surface-500">No tests match your filters.</p></div>
            )}

            {/* Premium Upsell */}
            {filtered.filter(t => !t.isFree).length > 0 && (
              <div className="mt-8 p-6 rounded-xl bg-surface-900 text-white text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-sunny-400" />
                <h3 className="text-xl font-bold mb-2">Unlock All Premium Tests</h3>
                <p className="text-sm text-surface-300 mb-4">Get access to all {stats.total} tests including full mocks, PYQs, and detailed analytics.</p>
                <Link href="/pricing"><Button variant="cta" size="lg">View Plans <Star className="h-4 w-4" /></Button></Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
