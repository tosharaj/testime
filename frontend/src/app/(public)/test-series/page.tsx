'use client';
import { useState, useEffect } from 'react';
import { Search, Loader2, BrainCircuit, Trophy } from 'lucide-react';
import Input from '@/components/ui/Input';
import TestSeriesCard from '@/components/test-series/TestSeriesCard';
import { api } from '@/lib/api';
import { examCategories } from '@/lib/examCategories';
import CrayonStick from '@/components/ui/CrayonStick';
import { crayon } from '@/lib/crayon';

const previewMap: Record<string, string[]> = {
  ossc: ['Full Mock Tests (OSSC CGL, CHSL)', 'Sectional Tests (Arithmetic, Reasoning)', 'Topic-wise Tests (Current Affairs Revision)', 'PYQ Tests (2021–2024)'],
  osssc: ['Full Mock Tests (RI, ARI, Amin)', 'Sectional Tests (Odia Language)', 'Topic-wise Assessments', 'PYQ Papers with Solutions'],
  opsc: ['GS Prelims Full Mocks', 'CSAT Sectional Tests', 'OPSC OCS Mock Series', 'Current Affairs Revision Tests'],
  ssb: ['Teacher Eligibility Mocks', 'Pedagogy Sectional Tests', 'Subject-wise Assessments', 'OTET & CTET Pattern Tests'],
  'odisha-police': ['SI & Constable Mocks', 'GK & Law Sectionals', 'Physical Test Guides', 'Previous Year Papers'],
  'odisha-teaching': ['OTET Full Mocks', 'Teaching Aptitude Tests', 'B.Ed Entrance Papers', 'Subject Pedagogy Tests'],
  'odisha-universities': ['PG Entrance Mocks (Utkal, OUAT)', 'University-specific Papers', 'Subject-wise Assessments', 'Previous Year Questions'],
  other: ['Forest Guard & JE Mocks', 'CTET & DSC Papers', 'Nursing & Paramedical Tests', 'Secretariat Exam Papers'],
};

const userCounts: Record<string, string> = {
  ossc: '245.6k',
  osssc: '187.3k',
  opsc: '134.2k',
  ssb: '98.7k',
  'odisha-police': '312.5k',
  'odisha-teaching': '76.4k',
  'odisha-universities': '45.8k',
  other: '112.9k',
};

export default function TestSeriesPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getTests({}).then((res) => {
      setTests(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const examTestCounts: Record<string, { total: number; free: number }> = {};
  tests.forEach((t: any) => {
    const key = t.examId || 'general';
    if (!examTestCounts[key]) examTestCounts[key] = { total: 0, free: 0 };
    examTestCounts[key].total++;
    if (t.isFree) examTestCounts[key].free++;
  });

  const categories = examCategories.map(cat => {
    const slug = cat.slug.toLowerCase().replace(/\s+/g, '-');
    const counts = examTestCounts[slug] || { total: 0, free: 0 };
    return { ...cat, total: counts.total, free: counts.free, slug };
  });

  const filtered = categories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-surface-50/30 animate-fade-in min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12">
        <div className="relative mb-10 overflow-hidden rounded-4xl bg-[#FFFBFA] border-2 border-surface-200/70 p-8 lg:p-10">
          <div
            className="absolute inset-0 opacity-60"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(53,179,126,0.12) 0.6px, transparent 0.6px)', backgroundSize: '22px 22px' }}
          />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-mint-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-lavender-200/40 blur-3xl" />
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 items-end gap-2 lg:flex xl:right-12">
            <CrayonStick c={crayon(3)} height={84} tilt={-8} delay={0} />
            <CrayonStick c={crayon(4)} height={104} tilt={6} delay={0.4} />
            <CrayonStick c={crayon(2)} height={80} tilt={-4} delay={0.8} />
            <CrayonStick c={crayon(5)} height={112} tilt={9} delay={1.2} />
            <CrayonStick c={crayon(0)} height={68} tilt={-10} delay={0.6} />
          </div>
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white/80 px-3 py-1 text-xs font-bold text-mint-700 mb-4 shadow-sm">
              <Trophy className="h-3.5 w-3.5" />
              Practice &amp; Rank
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-surface-900 mb-3 leading-tight">
              Test <span className="bg-gradient-to-r from-mint-500 via-brand-500 to-lavender-500 bg-clip-text text-transparent">Series</span>
            </h1>
            <p className="text-surface-500 text-base lg:text-lg leading-relaxed">
              Choose your examination and start practicing with realistic mock tests, sectional quizzes, and topic-wise assessments designed for Odisha exams.
            </p>
          </div>
        </div>

        <div className="max-w-md mb-10">
          <Input
            placeholder="Search for an exam..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
            <span className="ml-2 text-sm text-surface-400">Loading tests...</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(cat => (
              <TestSeriesCard
                key={cat.slug}
                name={cat.name}
                fullName={cat.fullName}
                slug={cat.slug}
                totalTests={cat.total}
                freeTests={cat.free}
                userCount={userCounts[cat.slug] || '0'}
                languages={['English', 'Odia']}
                previewTests={previewMap[cat.slug] || []}
                extraTestCount={Math.max(0, cat.total - 4)}
                tintColor={
                  cat.slug === 'ossc' ? '#e0f2fe' :
                  cat.slug === 'osssc' ? '#f0fdf4' :
                  cat.slug === 'opsc' ? '#fefce8' :
                  cat.slug === 'ssb' ? '#fdf2f8' :
                  cat.slug === 'odisha-police' ? '#eff6ff' :
                  cat.slug === 'odisha-teaching' ? '#f5f3ff' :
                  cat.slug === 'odisha-universities' ? '#fefce8' :
                  '#f8fafc'
                }
              />
            ))}
          </div>
        )}

        {!loading && tests.length === 0 && (
          <div className="text-center py-20">
            <BrainCircuit className="h-12 w-12 text-surface-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-surface-900 mb-2">No tests available yet</p>
            <p className="text-sm text-surface-500">Tests are being added. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
