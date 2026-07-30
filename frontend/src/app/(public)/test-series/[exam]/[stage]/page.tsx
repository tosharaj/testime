'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ChevronRight, BrainCircuit, Clock, Target, BookOpen, Search, Loader2, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { getCategoryBySlug } from '@/lib/examCategories';
import { examStageMap } from '@/lib/examStages';
const typeOptions = ['full-mock', 'sectional', 'topic-wise', 'pyq-test', 'daily-challenge'];
const typeLabels: Record<string, string> = {
  'full-mock': 'Full Mock Tests', 'sectional': 'Sectional Tests', 'topic-wise': 'Topic-wise Tests',
  'pyq-test': 'PYQ Tests', 'daily-challenge': 'Daily Challenges',
};

export default function StageOrTypePage() {
  const params = useParams();
  const examSlug = params.exam as string;
  const slug = params.stage as string;

  const exam = getCategoryBySlug(examSlug);
  const stages = examStageMap[exam?.id || ''] || ['Prelims', 'Mains', 'Interview'];

  const isStage = stages.map(s => s.toLowerCase()).includes(slug);
  const isType = typeOptions.includes(slug);

  const label = isStage ? stages.find(s => s.toLowerCase() === slug) || slug : typeLabels[slug] || slug;
  const stageFilter = isStage ? slug.charAt(0).toUpperCase() + slug.slice(1) : '';
  const typeFilter = isType ? slug : '';

  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getTests({ examId: examSlug }).then((res) => {
      setTests(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [examSlug]);

  const filtered = tests.filter(t => {
    const mStage = !stageFilter || t.stage === stageFilter;
    const mType = !typeFilter || t.test_type === typeFilter;
    const mSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return mStage && mType && mSearch;
  });

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-8">
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/test-series" className="hover:text-brand-600">Test Series</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/test-series/${examSlug}`} className="hover:text-brand-600">{exam?.name || examSlug}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">{label}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 mb-2">{label}</h1>
          <p className="text-surface-500">{isStage ? `Browse ${label} tests for ${exam?.name || examSlug}.` : `${typeLabels[slug] || 'Tests'} for ${exam?.name || examSlug}.`}</p>
        </div>

        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tests..." className="w-full rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 placeholder-surface-400" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-brand-500 animate-spin" /><span className="ml-2 text-sm text-surface-400">Loading...</span></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(t => (
              <Link key={t.id} href={`/test-series/${examSlug}/test/${t.slug}`}>
                <Card className="hover:shadow-card-hover transition-shadow h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={t.isFree ? 'success' : 'premium'} size="sm">{t.isFree ? 'Free' : 'Premium'}</Badge>
                      <div className="flex gap-1">
                        {t.stage && <Badge variant="info" size="sm">{t.stage}</Badge>}
                        {t.difficulty && <Badge variant={t.difficulty === 'easy' ? 'success' : 'danger'} size="sm">{t.difficulty}</Badge>}
                      </div>
                    </div>
                    <h3 className="font-semibold text-surface-900 mb-2">{t.title}</h3>
                    {t.description && <p className="text-xs text-surface-500 mb-3 line-clamp-2 flex-1">{t.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-surface-500 mb-3 flex-wrap">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration || 0} min</span>
                      <span className="flex items-center gap-1"><Target className="h-3 w-3" />{t.totalMarks || 0}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{t.question_count || 0} Qs</span>
                      {t.attempt_count > 0 && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{t.attempt_count}</span>}
                    </div>
                    <Button variant={t.isFree ? 'primary' : 'outline'} size="sm" className="w-full">{t.isFree ? 'Start' : 'Unlock'}</Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {filtered.length === 0 && <div className="col-span-full text-center py-20"><BrainCircuit className="h-10 w-10 text-surface-300 mx-auto mb-3" /><p className="text-surface-500">No tests found.</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}
