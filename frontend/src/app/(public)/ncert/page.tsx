'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { BookOpen, ArrowRight, ChevronRight, GraduationCap, Library, BookText, BarChart3 } from 'lucide-react';
import CrayonStick from '@/components/ui/CrayonStick';
import { crayon } from '@/lib/crayon';

const classes = [
  { id: 6, name: 'Class 6', slug: 'class-6', subjects: ['History', 'Geography', 'Civics', 'Science', 'Mathematics'], bookCount: 5 },
  { id: 7, name: 'Class 7', slug: 'class-7', subjects: ['History', 'Geography', 'Civics', 'Science', 'Mathematics'], bookCount: 5 },
  { id: 8, name: 'Class 8', slug: 'class-8', subjects: ['History', 'Geography', 'Civics', 'Science', 'Mathematics'], bookCount: 5 },
  { id: 9, name: 'Class 9', slug: 'class-9', subjects: ['History', 'Geography', 'Economics', 'Political Science', 'Science', 'Mathematics'], bookCount: 6 },
  { id: 10, name: 'Class 10', slug: 'class-10', subjects: ['History', 'Geography', 'Economics', 'Political Science', 'Science', 'Mathematics'], bookCount: 6 },
  { id: 11, name: 'Class 11', slug: 'class-11', subjects: ['History', 'Geography', 'Polity', 'Economics', 'Physics', 'Chemistry', 'Biology', 'Mathematics'], bookCount: 8 },
  { id: 12, name: 'Class 12', slug: 'class-12', subjects: ['History', 'Geography', 'Polity', 'Economics', 'Physics', 'Chemistry', 'Biology', 'Mathematics'], bookCount: 8 },
];

const classThemes: Record<number, { gradient: string; chip: string; icon: string; badge: string; gradText: string; glow: string }> = {
  6: { gradient: 'from-mint-100 to-brand-50', chip: 'bg-mint-50 text-mint-700', icon: 'bg-white/80 text-mint-700', badge: 'bg-mint-100 text-mint-700', gradText: 'from-mint-500 to-brand-500', glow: 'bg-mint-200/40' },
  7: { gradient: 'from-ocean-100 to-brand-50', chip: 'bg-ocean-50 text-ocean-700', icon: 'bg-white/80 text-ocean-700', badge: 'bg-ocean-100 text-ocean-700', gradText: 'from-ocean-500 to-brand-500', glow: 'bg-ocean-200/40' },
  8: { gradient: 'from-lavender-100 to-brand-50', chip: 'bg-lavender-50 text-lavender-700', icon: 'bg-white/80 text-lavender-700', badge: 'bg-lavender-100 text-lavender-700', gradText: 'from-lavender-500 to-brand-500', glow: 'bg-lavender-200/40' },
  9: { gradient: 'from-accent-100 to-brand-50', chip: 'bg-accent-50 text-accent-700', icon: 'bg-white/80 text-accent-700', badge: 'bg-accent-100 text-accent-700', gradText: 'from-accent-500 to-brand-500', glow: 'bg-accent-200/40' },
  10: { gradient: 'from-mint-100 to-ocean-50', chip: 'bg-mint-50 text-mint-700', icon: 'bg-white/80 text-mint-700', badge: 'bg-mint-100 text-mint-700', gradText: 'from-mint-500 to-ocean-500', glow: 'bg-mint-200/40' },
  11: { gradient: 'from-lavender-100 to-ocean-50', chip: 'bg-lavender-50 text-lavender-700', icon: 'bg-white/80 text-lavender-700', badge: 'bg-lavender-100 text-lavender-700', gradText: 'from-lavender-500 to-ocean-500', glow: 'bg-lavender-200/40' },
  12: { gradient: 'from-accent-100 to-ocean-50', chip: 'bg-accent-50 text-accent-700', icon: 'bg-white/80 text-accent-700', badge: 'bg-accent-100 text-accent-700', gradText: 'from-accent-500 to-ocean-500', glow: 'bg-accent-200/40' },
};

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

        <div className="relative mb-10 overflow-hidden rounded-4xl bg-[#FFFBFA] border-2 border-surface-200/70 p-8 lg:p-10">
          <div
            className="absolute inset-0 opacity-60"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(76,139,235,0.12) 0.6px, transparent 0.6px)', backgroundSize: '22px 22px' }}
          />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-mint-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-ocean-200/40 blur-3xl" />
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 items-end gap-2 lg:flex xl:right-12">
            <CrayonStick c={crayon(3)} height={84} tilt={-8} delay={0} />
            <CrayonStick c={crayon(1)} height={104} tilt={6} delay={0.4} />
            <CrayonStick c={crayon(2)} height={76} tilt={-4} delay={0.8} />
            <CrayonStick c={crayon(5)} height={112} tilt={9} delay={1.2} />
          </div>
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white/80 px-3 py-1 text-xs font-bold text-mint-700 mb-4 shadow-sm">
              <BookOpen className="h-3.5 w-3.5" />
              Content Foundation
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-surface-900 mb-3 leading-tight">
              NCERT Based <span className="bg-gradient-to-r from-mint-500 via-ocean-500 to-brand-500 bg-clip-text text-transparent">Learning</span>
            </h1>
            <p className="text-surface-500 text-base lg:text-lg max-w-2xl leading-relaxed">
              NCERT textbooks form the foundation for all competitive exams. Each chapter is linked to notes, MCQs, tests, and previous year questions for integrated learning.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => {
            const c = crayon(i);
            const Icon = s.icon;
            return (
              <Card key={s.label} color={c.name}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${c.body} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-surface-900">{s.value}</p>
                    <p className="text-xs text-surface-500">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <h2 className="font-display text-2xl font-bold text-surface-900 mb-5">Browse by Class</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {classes.map(c => {
            const theme = classThemes[c.id];
            return (
              <Link key={c.id} href={`/ncert/${c.slug}`} className="group h-full">
                <Card className="h-full overflow-hidden border-surface-200 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer transition-all duration-300">
                  <div className={`h-2 bg-gradient-to-r ${theme.gradient}`} />
                  <CardContent className="relative p-5 overflow-hidden">
                    <div className={`pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full ${theme.glow} blur-2xl opacity-70 transition-opacity group-hover:opacity-100`} />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-5">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ring-2 ring-white/70 ${theme.icon} transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}>
                          <img src="/images/ncert_logo.png" alt="NCERT" className="h-4/5 w-4/5 object-contain" />
                        </div>
                        <Badge className={theme.badge} size="sm">{c.bookCount} books</Badge>
                      </div>
                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className={`font-display text-4xl font-bold bg-gradient-to-r ${theme.gradText} bg-clip-text text-transparent`}>{c.id}</span>
                        <span className="font-display text-base font-semibold text-surface-400">th</span>
                        <span className="ml-auto text-xs font-bold text-surface-300 uppercase tracking-widest">Class</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {c.subjects.map(s => (
                          <span key={s} className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${theme.chip} transition-colors`}>{s}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-surface-100 pt-4">
                        <span className="text-xs font-medium text-surface-400">Chapter-wise learning</span>
                        <span className="flex items-center gap-1 text-sm font-semibold text-brand-600 transition-all duration-200 group-hover:gap-2">
                          Browse Chapters <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-mint-50 to-ocean-50 border border-mint-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <h3 className="font-bold text-surface-900 text-lg mb-1">Why NCERT First?</h3>
              <p className="text-sm text-surface-500">85% of competitive exam questions are directly or indirectly based on NCERT concepts. Master the foundation first.</p>
            </div>
            <Link href="/notes">
              <Button variant="outline">Explore Notes & Resources <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
