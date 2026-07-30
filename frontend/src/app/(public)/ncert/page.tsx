'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { BookOpen, ArrowRight, ChevronRight, GraduationCap, Library, BookText, BarChart3 } from 'lucide-react';

const classes = [
  { id: 6, name: 'Class 6', slug: 'class-6', subjects: ['History', 'Geography', 'Civics', 'Science', 'Mathematics'], bookCount: 5 },
  { id: 7, name: 'Class 7', slug: 'class-7', subjects: ['History', 'Geography', 'Civics', 'Science', 'Mathematics'], bookCount: 5 },
  { id: 8, name: 'Class 8', slug: 'class-8', subjects: ['History', 'Geography', 'Civics', 'Science', 'Mathematics'], bookCount: 5 },
  { id: 9, name: 'Class 9', slug: 'class-9', subjects: ['History', 'Geography', 'Economics', 'Political Science', 'Science', 'Mathematics'], bookCount: 6 },
  { id: 10, name: 'Class 10', slug: 'class-10', subjects: ['History', 'Geography', 'Economics', 'Political Science', 'Science', 'Mathematics'], bookCount: 6 },
  { id: 11, name: 'Class 11', slug: 'class-11', subjects: ['History', 'Geography', 'Polity', 'Economics', 'Physics', 'Chemistry', 'Biology', 'Mathematics'], bookCount: 8 },
  { id: 12, name: 'Class 12', slug: 'class-12', subjects: ['History', 'Geography', 'Polity', 'Economics', 'Physics', 'Chemistry', 'Biology', 'Mathematics'], bookCount: 8 },
];

const stats = [
  { label: 'NCERT Books', value: '43+', icon: Library },
  { label: 'Chapters', value: '500+', icon: BookText },
  { label: 'Linked MCQs', value: '10,000+', icon: BarChart3 },
  { label: 'Classes', value: '7', icon: GraduationCap },
];

export default function NcertPage() {
  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">NCERT</span>
        </nav>

        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-mint-50 border border-mint-200 px-3 py-1 text-xs font-medium text-mint-700 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            Content Foundation
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-3">NCERT Based Learning</h1>
          <p className="text-surface-500 text-lg max-w-2xl leading-relaxed">
            NCERT textbooks form the foundation for all competitive exams. Each chapter is linked to notes, MCQs, tests, and previous year questions for integrated learning.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-surface-900">{s.value}</p>
                    <p className="text-xs text-surface-500">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <h2 className="text-xl font-bold text-surface-900 mb-5">Browse by Class</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {classes.map(c => (
            <Link key={c.id} href={`/ncert/${c.slug}`}>
              <Card className="hover:shadow-card-hover transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-ocean-50 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-ocean-600" />
                    </div>
                    <Badge variant="default" size="sm">{c.bookCount} books</Badge>
                  </div>
                  <h3 className="font-bold text-surface-900 mb-1">{c.name}</h3>
                  <p className="text-xs text-surface-500 mb-3">{c.subjects.join(', ')}</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-brand-600">
                    Browse Chapters <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-mint-50 to-ocean-50 border border-mint-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <h3 className="font-bold text-surface-900 text-lg mb-1">Why NCERT First?</h3>
              <p className="text-sm text-surface-500">85% of competitive exam questions are directly or indirectly based on NCERT concepts. Master the foundation first.</p>
            </div>
            <Link href="/current-affairs">
              <Button variant="outline">Explore Current Affairs <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
