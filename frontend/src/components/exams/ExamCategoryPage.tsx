'use client';
import Link from 'next/link';
import { ExamCategory } from '@/lib/examCategories';
import ExamCategoryIcon from '@/components/icons/ExamCategoryIcon';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  BookOpen, BrainCircuit, FileText, ArrowRight, GraduationCap,
  Newspaper, Clock, BarChart3, Target, Sparkles, ChevronRight, Award
} from 'lucide-react';

interface Props {
  category: ExamCategory;
}

const sections = [
  {
    id: 'notes', title: 'Study Notes', icon: BookOpen,
    color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200',
    description: 'Comprehensive topic-wise notes curated by subject matter experts.',
  },
  {
    id: 'questions', title: 'Question Banks', icon: FileText,
    color: 'text-coral-600', bg: 'bg-coral-50', border: 'border-coral-200',
    description: 'Practice with thousands of exam-specific questions and previous year papers.',
  },
  {
    id: 'test-series', title: 'Test Series', icon: BrainCircuit,
    color: 'text-ocean-600', bg: 'bg-ocean-50', border: 'border-ocean-200',
    description: 'Full-length and subject-wise mock tests with detailed performance analysis.',
  },
  {
    id: 'updates', title: 'Updates & Notifications', icon: Newspaper,
    color: 'text-sunny-600', bg: 'bg-sunny-50', border: 'border-sunny-200',
    description: 'Stay informed with the latest exam notifications, syllabus changes, and results.',
  },
];

const resources = [
  { title: 'Previous Year Papers', icon: Clock, count: '12+ Papers', color: 'bg-brand-500', description: 'Solve past exam papers to understand the pattern and difficulty level.' },
  { title: 'Topic-wise MCQs', icon: Target, count: '2,500+ MCQs', color: 'bg-coral-500', description: 'Master each topic with focused MCQ practice sets.' },
  { title: 'Performance Analytics', icon: BarChart3, count: 'Smart Reports', color: 'bg-ocean-500', description: 'Track your progress with detailed reports and insights.' },
  { title: 'Expert Guidance', icon: Sparkles, count: 'Expert Tips', color: 'bg-sunny-500', description: 'Learn from top educators with years of experience.' },
];

export default function ExamCategoryPage({ category }: Props) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-100/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-coral-100/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-sunny-300/30" />
          <div className="absolute bottom-1/4 right-1/3 w-6 h-6 rounded-full bg-ocean-300/20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <div className="relative">
                <ExamCategoryIcon exam={category.slug} />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-coral-500 animate-pulse-soft" />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-extrabold text-brand-700 mb-4">
                <GraduationCap className="h-4 w-4" />
                {category.fullName}
              </div>
              <h1 className="section-heading text-surface-900 mb-4">{category.name}</h1>
              <p className="text-lg text-surface-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
                <Link href={`/notes?exam=${category.slug}`}>
                  <Button variant="primary">
                    <BookOpen className="h-4 w-4" /> Browse Notes <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/questions?exam=${category.slug}`}>
                  <Button variant="outline">
                    <FileText className="h-4 w-4" /> Practice Questions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y-2 border-surface-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {category.stats.map((stat) => (
              <div key={stat.label} className="text-center relative">
                <p className="text-3xl font-black text-surface-900">{stat.value}</p>
                <p className="text-sm font-bold text-surface-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-sunny-200 bg-sunny-50 px-4 py-1.5 text-xs font-extrabold text-sunny-700 mb-4">
              <Sparkles className="h-4 w-4" />
              Highlights
            </span>
            <h2 className="section-heading text-surface-900 mb-4">Exam Highlights</h2>
            <p className="section-subheading">Key exams conducted under {category.fullName}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {category.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white border-2 border-surface-100 hover:border-brand-200 hover:shadow-lg hover:-translate-y-0.5 transition-all animate-stagger-1">
                <div className="h-9 w-9 rounded-xl bg-brand-500 flex items-center justify-center text-white text-sm font-black shadow-md shrink-0">
                  {i + 1}
                </div>
                <span className="font-bold text-surface-700 text-sm">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Exams */}
      {category.exams && category.exams.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-extrabold text-brand-700 mb-4">
                <Target className="h-4 w-4" />
                Exams under {category.name}
              </span>
              <h2 className="section-heading text-surface-900 mb-4">Choose your exam</h2>
              <p className="section-subheading">Select a specific exam to access targeted resources</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {category.exams.map((exam) => (
                <Link
                  key={exam.slug}
                  href={`/test-series?exam=${category.slug}`}
                  className="group flex items-center gap-4 p-5 rounded-2xl bg-white border-2 border-surface-100 hover:border-brand-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <span className="flex items-center justify-center h-12 w-12 rounded-xl bg-surface-50 text-xl shrink-0 group-hover:scale-110 transition-transform">
                    {exam.icon || '📁'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-surface-900 group-hover:text-brand-600 transition-colors">{exam.name}</h3>
                    <p className="text-xs text-surface-400 mt-0.5">{exam.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Resources <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-surface-300 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sections Grid */}
      <section className="py-16 lg:py-20 bg-surface-50/80 border-y-2 border-surface-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-heading text-surface-900 mb-4">Everything you need to crack {category.name}</h2>
            <p className="section-subheading">Comprehensive resources designed for exam success</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <Card key={section.id}>
                  <CardContent className="p-6 text-center">
                    <div className={`h-14 w-14 rounded-xl ${section.bg} border flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-7 w-7 ${section.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">{section.title}</h3>
                    <p className="text-sm text-surface-500 mb-4">{section.description}</p>
                    <Link href={`/${section.id}?exam=${category.slug}`}>
                      <Button variant="ghost" size="sm">
                        Explore <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-ocean-200 bg-ocean-50 px-4 py-1.5 text-xs font-extrabold text-ocean-700 mb-4">
              <Award className="h-4 w-4" />
              Resources
            </span>
            <h2 className="section-heading text-surface-900 mb-4">Additional Resources</h2>
            <p className="section-subheading">Tools and materials to boost your preparation</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div key={resource.title} className="p-6 rounded-3xl bg-white border-2 border-surface-100 hover:shadow-xl hover:border-brand-200 hover:-translate-y-1.5 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-11 w-11 rounded-2xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-brand-600" />
                    </div>
                    <span className="text-xs font-extrabold text-brand-600 bg-brand-50 border-2 border-brand-200 px-3 py-1 rounded-2xl">{resource.count}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-surface-900 mb-1.5">{resource.title}</h3>
                  <p className="text-sm text-surface-500 font-medium">{resource.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-16 lg:py-20 bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-heading text-surface-900 mb-4">Other Exam Categories</h2>
            <p className="section-subheading">Explore more Odisha exam boards</p>
          </div>
          <OtherCategories current={category.slug} />
        </div>
      </section>
    </div>
  );
}

import { examCategories } from '@/lib/examCategories';

function OtherCategories({ current }: { current: string }) {
  const others = examCategories.filter((c) => c.slug !== current);
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {others.map((cat) => (
        <Link key={cat.slug} href={`/exams/${cat.slug}`} className="group block">
          <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border-2 border-surface-100 hover:border-brand-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <ExamCategoryIcon exam={cat.slug} />
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-surface-900 group-hover:text-brand-600 transition-colors">{cat.name}</h3>
              <p className="text-xs text-surface-400 mt-0.5 font-medium">{cat.fullName}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-surface-300 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
}
