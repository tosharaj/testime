'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { ExamMenuCategory } from '@/lib/examMenuData';
import {
  BookOpen, BrainCircuit, ChevronRight, FileText, ArrowRight, GraduationCap,
  CalendarClock, BarChart3, ClipboardList, Target, Sparkles, ChevronLeft,
} from 'lucide-react';

interface ExamWithCategory {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  family: string;
  subjects?: any[];
  category?: ExamMenuCategory;
}

export default function ExamDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [exam, setExam] = useState<ExamWithCategory | null>(null);
  const [category, setCategory] = useState<ExamMenuCategory | undefined>(undefined);

  useEffect(() => {
    api.getExamBySlug(slug).then((data: any) => {
      setExam(data || null);
      setCategory(data?.category);
    }).catch(console.error);
  }, [slug]);

  if (!exam) {
    return (
      <div className="py-24 text-center">
        <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
          <GraduationCap className="h-6 w-6 text-brand-600" />
        </div>
        <p className="text-surface-400 animate-pulse-soft">Loading...</p>
      </div>
    );
  }

  const grad = category ? `${category.gradientFrom} ${category.gradientTo}` : 'from-brand-600 to-brand-500';

  const stats = category?.stats || [
    { label: 'Notes', value: '40+' },
    { label: 'Questions', value: '3,000+' },
    { label: 'Tests', value: '25+' },
    { label: 'Updates', value: '120+' },
  ];

  const sections = [
    { id: 'test-series', title: 'Test Series', desc: 'Full-length and sectional mock tests with analysis', icon: BrainCircuit, href: `/test-series?examId=${exam.id}`, color: 'bg-ocean-50 text-ocean-600 border-ocean-200' },
    { id: 'notes', title: 'Study Notes', desc: 'Topic-wise notes for every subject in the syllabus', icon: BookOpen, href: `/notes?examId=${exam.id}`, color: 'bg-brand-50 text-brand-600 border-brand-200' },
    { id: 'questions', title: 'Question Bank', desc: 'PYQs and practice questions with solutions', icon: FileText, href: `/questions?examId=${exam.id}`, color: 'bg-coral-50 text-coral-600 border-coral-200' },
    { id: 'current-affairs', title: 'Current Affairs', desc: 'Daily national & Odisha news for exams', icon: CalendarClock, href: '/current-affairs', color: 'bg-mint-50 text-mint-600 border-mint-200' },
  ];

  const related = category?.exams.filter(e => e.slug !== exam.slug).slice(0, 6) || [];

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/exams" className="hover:text-brand-600 transition-colors">Exams</Link>
          {category && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={`/exams/${category.slug}`} className="hover:text-brand-600 transition-colors">{category.name}</Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium truncate max-w-[220px]">{exam.name}</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-4xl bg-gradient-hero border border-surface-200/60 p-6 lg:p-10 mb-8">
          <div className="absolute inset-0 bg-dot-grid opacity-30" />
          <div className={`absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br ${grad} opacity-10 blur-3xl`} />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} text-4xl shadow-lg`}>
              <span className="drop-shadow-sm">{exam.icon || '📚'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {category && (
                  <Link
                    href={`/exams/${category.slug}`}
                    className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-surface-200 px-3 py-1 text-[11px] font-bold text-surface-600 shadow-sm hover:text-brand-600 transition-colors"
                  >
                    <GraduationCap className="h-3 w-3" /> {category.name}
                  </Link>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-surface-200 px-3 py-1 text-[11px] font-bold text-surface-600 shadow-sm">
                  <ClipboardList className="h-3 w-3" /> Prelims + Mains
                </span>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-surface-900 leading-tight">{exam.name}</h1>
              <p className="text-surface-500 mt-2 leading-relaxed max-w-2xl">
                {exam.description || category?.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
              <Link href={`/test-series?examId=${exam.id}`}>
                <Button variant="primary-gradient" className="w-full">
                  <BrainCircuit className="h-4 w-4" /> Start Test Series
                </Button>
              </Link>
              <Link href={`/notes?examId=${exam.id}`}>
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4" /> Browse Notes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <Card key={s.label} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-black text-surface-900">{s.value}</p>
                <p className="text-sm font-semibold text-surface-400 mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resource sections */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold text-surface-900 mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-500" /> Everything for {exam.name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <Link key={s.id} href={s.href}>
                  <Card className="card-hover h-full group">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className={`h-11 w-11 rounded-xl border ${s.color} flex items-center justify-center mb-3`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-surface-900 mb-1 group-hover:text-brand-600 transition-colors">{s.title}</h3>
                      <p className="text-sm text-surface-500 mb-4 leading-relaxed flex-1">{s.desc}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-1.5 transition-all">
                        Explore <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Exam highlights */}
        {category?.highlights && category.highlights.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-surface-900 mb-5 flex items-center gap-2">
              <Target className="h-5 w-5 text-coral-500" /> Key Exams in {category.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {category.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-surface-200 bg-surface-50/60 px-4 py-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${grad} text-xs font-black text-white`}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-surface-700">{h}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related exams */}
        {related.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-surface-900">More {category?.name} Exams</h2>
              <Link href={`/exams/${category?.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {related.map(ex => (
                <Link
                  key={ex.slug}
                  href={`/exams/${ex.slug}`}
                  title={ex.description}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-surface-200 bg-white px-3 py-4 text-center transition-all duration-150 hover:border-brand-200 hover:shadow-card-hover hover:-translate-y-0.5"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${grad} text-lg shadow-sm transition-transform group-hover:scale-110`}>
                    <span className="drop-shadow-sm">{ex.icon || '📁'}</span>
                  </span>
                  <span className="text-xs font-semibold text-surface-800 group-hover:text-brand-600 transition-colors leading-tight">{ex.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to exams */}
        <div className="flex justify-center">
          <Link href="/exams">
            <Button variant="ghost">
              <ChevronLeft className="h-4 w-4 mr-1" /> Browse all exam boards
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
