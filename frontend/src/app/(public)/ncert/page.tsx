'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { BookOpen, ArrowRight, ChevronRight, GraduationCap, Library, BookText, BarChart3, Globe2, Pencil, AlarmClock, Atom, Bookmark, ShieldCheck, type LucideIcon } from 'lucide-react';
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

const classThemes: Record<number, {
  hex: string;
  topBg: string;
  chip: string;
  number: string;
  pill: string;
  blob: string;
  cta: string;
  book: string;
  bookCard: string;
  icon: string;
  heroIcon: LucideIcon;
}> = {
  6: { hex: '#35B37E', topBg: 'bg-mint-50', chip: 'bg-mint-50 text-mint-700', number: 'text-mint-600', pill: 'border-mint-500 text-mint-700', blob: 'bg-mint-500', cta: 'text-mint-600', book: 'bg-mint-500', bookCard: 'border-mint-500', icon: 'text-mint-500', heroIcon: Globe2 },
  7: { hex: '#4BA7E0', topBg: 'bg-ocean-50', chip: 'bg-ocean-50 text-ocean-700', number: 'text-ocean-600', pill: 'border-ocean-500 text-ocean-700', blob: 'bg-ocean-500', cta: 'text-ocean-600', book: 'bg-ocean-500', bookCard: 'border-ocean-500', icon: 'text-ocean-500', heroIcon: Pencil },
  8: { hex: '#8A70DB', topBg: 'bg-lavender-50', chip: 'bg-lavender-50 text-lavender-700', number: 'text-lavender-600', pill: 'border-lavender-500 text-lavender-700', blob: 'bg-lavender-500', cta: 'text-lavender-600', book: 'bg-lavender-500', bookCard: 'border-lavender-500', icon: 'text-lavender-500', heroIcon: AlarmClock },
  9: { hex: '#EF6150', topBg: 'bg-coral-50', chip: 'bg-coral-50 text-coral-700', number: 'text-coral-600', pill: 'border-coral-500 text-coral-700', blob: 'bg-coral-500', cta: 'text-coral-600', book: 'bg-coral-500', bookCard: 'border-coral-500', icon: 'text-coral-500', heroIcon: BookText },
  10: { hex: '#4C8BEB', topBg: 'bg-brand-50', chip: 'bg-brand-50 text-brand-700', number: 'text-brand-600', pill: 'border-brand-500 text-brand-700', blob: 'bg-brand-500', cta: 'text-brand-600', book: 'bg-brand-500', bookCard: 'border-brand-500', icon: 'text-brand-500', heroIcon: Library },
  11: { hex: '#F7A928', topBg: 'bg-sunny-50', chip: 'bg-sunny-50 text-sunny-700', number: 'text-sunny-600', pill: 'border-sunny-500 text-sunny-700', blob: 'bg-sunny-500', cta: 'text-sunny-600', book: 'bg-sunny-500', bookCard: 'border-sunny-500', icon: 'text-sunny-500', heroIcon: Atom },
  12: { hex: '#EF5A87', topBg: 'bg-accent-50', chip: 'bg-accent-50 text-accent-700', number: 'text-accent-600', pill: 'border-accent-500 text-accent-700', blob: 'bg-accent-500', cta: 'text-accent-600', book: 'bg-accent-500', bookCard: 'border-accent-500', icon: 'text-accent-500', heroIcon: GraduationCap },
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {classes.map(c => {
            const theme = classThemes[c.id];
            const HeroIcon = theme.heroIcon;
            return (
              <Link key={c.id} href={`/ncert/${c.slug}`} className="group h-full">
                <Card
                  className="h-full flex flex-col overflow-hidden rounded-2xl border-b-4 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer transition-all duration-300"
                  style={{ borderBottomColor: theme.hex }}
                >
                  {/* Illustration area */}
                  <div className={`h-48 relative overflow-hidden p-5 ${theme.topBg}`}>
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-surface-900 shadow-sm">
                        <BookOpen className="h-5 w-5 text-surface-800" />
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-full bg-white border-2 px-3 py-1.5 text-sm font-semibold shadow-sm ${theme.pill}`}>
                        <BookOpen className="h-4 w-4" /> {c.bookCount} books
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-end gap-2.5">
                      <HeroIcon className={`h-14 w-14 ${theme.icon}`} strokeWidth={1.75} />
                      <div className="flex flex-col gap-1.5">
                        <div className={`h-4 w-16 rounded-md ${theme.book} border border-surface-900`} />
                        <div className={`h-5 w-20 rounded-md bg-white border-2 ${theme.bookCard}`} />
                        <div className={`h-4 w-16 rounded-md ${theme.book} border border-surface-900`} />
                      </div>
                    </div>
                    <div className={`absolute -bottom-4 -left-6 h-14 w-40 rounded-full ${theme.blob} opacity-90`} />
                    <div className="absolute -bottom-6 right-0 h-16 w-40 rounded-full bg-white opacity-90" />
                  </div>
                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-end justify-between border-b border-surface-200 pb-3">
                      <div className="flex items-baseline gap-1">
                        <span className={`font-display text-5xl font-bold ${theme.number}`}>{c.id}</span>
                        <span className="text-lg font-semibold text-surface-400">th</span>
                      </div>
                      <span className="text-xs font-bold tracking-widest text-surface-400">CLASS</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4">
                      {c.subjects.map(s => (
                        <span key={s} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${theme.chip}`}>{s}</span>
                      ))}
                    </div>
                    <div className="mt-auto pt-10">
                      <p className="mb-2 text-xs text-surface-400">Chapter-wise learning</p>
                      <span className={`flex items-center gap-2 text-sm font-bold ${theme.cta} transition-all duration-200 group-hover:gap-3`}>
                        Browse Chapters <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Feature strip */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 rounded-2xl border border-surface-200 bg-white p-5 shadow-card">
          {[
            { icon: BookOpen, title: 'Chapter-wise Learning', desc: 'Learn step by step', tile: 'bg-mint-50 text-mint-600' },
            { icon: Bookmark, title: 'Curriculum Aligned', desc: 'Based on latest syllabus', tile: 'bg-ocean-50 text-ocean-600' },
            { icon: BarChart3, title: 'Track Progress', desc: 'Monitor your growth', tile: 'bg-lavender-50 text-lavender-600' },
            { icon: ShieldCheck, title: 'Expert Content', desc: 'Curated by subject experts', tile: 'bg-coral-50 text-coral-600' },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${f.tile}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-surface-900">{f.title}</h3>
                  <p className="mt-1 text-xs text-surface-500">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
