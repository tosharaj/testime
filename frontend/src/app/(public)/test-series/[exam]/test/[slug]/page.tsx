'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ChevronRight, BrainCircuit, Clock, Target, BookOpen, CheckCircle, AlertCircle, BarChart3, Users, Star, Loader2, ArrowRight, Lock, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { getCategoryBySlug } from '@/lib/examCategories';

export default function TestDetailPage() {
  const params = useParams();
  const examSlug = params.exam as string;
  const testSlug = params.slug as string;

  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const exam = getCategoryBySlug(examSlug);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    api.getTestBySlug(testSlug).then(setTest).catch(() => setLoading(false));
  }, [testSlug]);

  useEffect(() => {
    if (test) setLoading(false);
  }, [test]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center"><Loader2 className="h-8 w-8 text-brand-500 animate-spin mx-auto mb-3" /><p className="text-sm text-surface-400">Loading test...</p></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center"><BrainCircuit className="h-12 w-12 text-surface-300 mx-auto mb-4" /><p className="text-lg font-semibold text-surface-900 mb-2">Test Not Found</p><p className="text-sm text-surface-500">The test you are looking for does not exist.</p><Link href={`/test-series/${examSlug}`}><Button variant="outline" className="mt-4">← Back to Tests</Button></Link></div>
      </div>
    );
  }

  const details = [
    { icon: Clock, label: 'Duration', value: `${test.duration || 0} minutes` },
    { icon: Target, label: 'Total Marks', value: `${test.totalMarks || 0} marks` },
    { icon: BookOpen, label: 'Questions', value: `${test.question_count || 0} questions` },
    { icon: BarChart3, label: 'Attempts', value: `${test.attempt_count || 0}` },
    { icon: AlertCircle, label: 'Negative Marking', value: test.negativeMark ? `${test.negativeMark}` : 'No' },
    { icon: Star, label: 'Difficulty', value: test.difficulty ? test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1) : 'N/A' },
  ];

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/test-series" className="hover:text-brand-600">Test Series</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/test-series/${examSlug}`} className="hover:text-brand-600">{exam?.name || examSlug}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium truncate max-w-[200px]">{test.title}</span>
        </nav>

        {/* Test Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={test.isFree ? 'success' : 'premium'} size="md">{test.isFree ? 'Free Test' : 'Premium Test'}</Badge>
            {test.stage && <Badge variant="info" size="md">{test.stage}</Badge>}
            {test.test_type && <Badge variant="warning" size="md">{test.test_type.replace('-', ' ')}</Badge>}
            {test.difficulty && <Badge variant={test.difficulty === 'easy' ? 'success' : test.difficulty === 'hard' ? 'danger' : 'warning'} size="md">{test.difficulty}</Badge>}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-3">{test.title}</h1>
          {test.description && <p className="text-surface-500 leading-relaxed max-w-2xl">{test.description}</p>}
        </div>

        {/* Test Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {details.map(d => {
            const Icon = d.icon;
            return (
              <div key={d.label} className="p-4 rounded-lg border border-surface-200 bg-surface-50/50">
                <Icon className="h-4 w-4 text-brand-500 mb-1.5" />
                <p className="text-sm font-semibold text-surface-900">{d.value}</p>
                <p className="text-xs text-surface-400">{d.label}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Card className="mb-8 border-brand-200">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-surface-900 mb-1">
                  {test.isFree ? 'Ready to Start?' : 'Unlock This Test'}
                </h3>
                <p className="text-sm text-surface-500">
                  {test.isFree
                    ? `This free test contains ${test.question_count || 0} questions to be answered in ${test.duration || 0} minutes.`
                    : 'Subscribe to a plan to access this premium test along with all other tests.'}
                </p>
              </div>
              <div className="shrink-0">
                {test.isFree ? (
                  <Button size="lg" onClick={() => {
                    if (!isLoggedIn) { window.location.href = '/login'; return; }
                    api.startAttempt(test.id).then((res) => { window.location.href = `/test/${res.id}`; }).catch(console.error);
                  }}>
                    <FileText className="h-4 w-4 mr-1.5" /> Start Test
                  </Button>
                ) : (
                  <Link href="/pricing"><Button size="lg"><Lock className="h-4 w-4 mr-1.5" /> View Plans</Button></Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-surface-900 mb-3">Instructions</h3>
            <ul className="space-y-2">
              {[
                'Read each question carefully before answering.',
                'You can navigate between questions using the sidebar.',
                'Mark questions for review and come back to them later.',
                'The test will auto-submit when the timer runs out.',
                'Results and detailed analytics will be available after submission.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600">
                  <CheckCircle className="h-4 w-4 text-mint-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
