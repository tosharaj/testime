'use client';
import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, Layers, GraduationCap, BookOpen, Landmark, Users, School,
  ChevronRight, Sparkles, ArrowRight, FilePlus2, HelpCircle, Library,
  BookMarked, FileText,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ContinueStudying, SectionRow } from '@/components/notes/NotesSections';
import { getLibrary } from '@/lib/notesStore';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark, Users, School, FileText, BookOpen,
};

function NotesHomeContent() {
  const router = useRouter();
  const data = getLibrary();
  const [tab, setTab] = useState<'exam' | 'academic'>('exam');
  const [query, setQuery] = useState('');

  const activeHomepageSections = useMemo(
    () => data.homepageSections.filter(s => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [data],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/notes/search?q=${encodeURIComponent(query.trim())}`);
  };

  const stats = useMemo(() => {
    const published = data.resources.filter(r => r.isPublished && r.status === 'published');
    return {
      total: published.length,
      free: published.filter(r => r.accessType === 'free').length,
      exams: data.exams.filter(e => e.isActive).length,
      topics: data.topics.length,
    };
  }, [data]);

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">Notes &amp; PDFs</span>
        </nav>

        {/* Hero */}
        <div className="relative mb-10 overflow-hidden rounded-4xl bg-gradient-hero border border-surface-200/60 p-8 lg:p-12">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-mint-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-lavender-200/40 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-surface-200 px-3 py-1 text-xs font-semibold text-brand-600 shadow-sm">
              <Layers className="h-3.5 w-3.5" />
              Notes &amp; PDF Resource Library
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-surface-900 mb-4 leading-tight text-balance">
              Every note you need, <span className="bg-gradient-to-r from-brand-500 to-mint-500 bg-clip-text text-transparent">one search away</span>
            </h1>
            <p className="text-surface-500 text-base lg:text-lg leading-relaxed max-w-xl">
              Search thousands of exam notes, books, PYQs and study PDFs — or academic material for your degree.
            </p>
          </div>
          <form onSubmit={handleSearch} className="relative mt-6 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search notes, PYQs, books by title or topic..."
              className="w-full rounded-2xl border border-surface-200 bg-white pl-12 pr-32 py-4 text-base text-surface-700 shadow-lg shadow-brand-500/5 placeholder:text-surface-400 focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-300 transition-all"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition-all hover:bg-brand-600">
              Search
            </button>
          </form>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <StatChip value={stats.total} label="Resources" />
            <StatChip value={stats.free} label="Free" tone="mint" />
            <StatChip value={stats.exams} label="Exams" tone="ocean" />
            <StatChip value={stats.topics} label="Topics" tone="lavender" />
          </div>
        </div>

        {/* Quick tabs */}
        <div className="mb-10">
          <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-md">
            <button
              onClick={() => setTab('exam')}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${tab === 'exam' ? 'border-brand-300 bg-brand-50 text-brand-700 shadow-sm' : 'border-surface-200 bg-white text-surface-500 hover:border-surface-300'}`}
            >
              <GraduationCap className="h-4 w-4" /> Exam Resources
            </button>
            <button
              onClick={() => setTab('academic')}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${tab === 'academic' ? 'border-lavender-300 bg-lavender-50 text-lavender-700 shadow-sm' : 'border-surface-200 bg-white text-surface-500 hover:border-surface-300'}`}
            >
              <School className="h-4 w-4" /> Academic Resources
            </button>
          </div>

          {tab === 'exam' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.examCategories.filter(c => c.isActive).map(cat => {
                const Icon = categoryIcons[cat.icon || 'FileText'] || BookOpen;
                const exams = data.exams.filter(e => e.categoryId === cat.id && e.isActive);
                return (
                  <Link key={cat.id} href={`/notes/category/${cat.slug}`} className="group">
                    <Card className="h-full card-hover overflow-hidden">
                      <CardContent className="p-5">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-md shadow-brand-500/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-display font-bold text-surface-900 group-hover:text-brand-600 transition-colors">{cat.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-surface-500">{cat.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {exams.slice(0, 3).map(e => (
                            <span key={e.id} className="rounded-lg bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-600">{e.shortName || e.name}</span>
                          ))}
                          {exams.length > 3 && <span className="rounded-lg bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-400">+{exams.length - 3}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.institutions.filter(i => i.isActive).map(inst => {
                const courses = data.courses.filter(c => c.institutionId === inst.id);
                return (
                  <Link key={inst.id} href={`/notes/academic/${inst.slug}`} className="group">
                    <Card className="h-full card-hover overflow-hidden">
                      <CardContent className="p-5">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-mint text-white shadow-md shadow-mint-500/20">
                          <School className="h-5 w-5" />
                        </div>
                        <h3 className="font-display font-bold text-surface-900 group-hover:text-mint-600 transition-colors">{inst.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-surface-500">{inst.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {courses.slice(0, 3).map(c => (
                            <span key={c.id} className="rounded-lg bg-lavender-50 px-2 py-0.5 text-[11px] font-medium text-lavender-700">{c.name}</span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Continue studying */}
        <ContinueStudying />

        {/* Homepage sections (admin-configurable) */}
        {activeHomepageSections.map(section => <SectionRow key={section.id} section={section} />)}

        {/* CTAs */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Link href="/notes/contribute" className="group">
            <div className="flex items-center gap-4 rounded-3xl bg-gradient-brand p-6 text-white shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5 hover:shadow-brand-500/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <FilePlus2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-display text-lg font-bold">Contribute your notes</p>
                <p className="text-sm text-white/80">Share study material with thousands of aspirants and get recognised.</p>
              </div>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
          <Link href="/notes/request" className="group">
            <div className="flex items-center gap-4 rounded-3xl bg-gradient-accent p-6 text-white shadow-lg shadow-accent-500/20 transition-all hover:-translate-y-0.5 hover:shadow-accent-500/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-display text-lg font-bold">Request a resource</p>
                <p className="text-sm text-white/80">Can't find a PDF or notes? Ask and we'll source it for you.</p>
              </div>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <TrustItem icon={Sparkles} title="Verified content" text="Contributions reviewed before publishing" />
          <TrustItem icon={Library} title="Organised taxonomy" text="Exam & academic hierarchy with topics" />
          <TrustItem icon={BookMarked} title="Track progress" text="Save, resume and complete resources" />
          <TrustItem icon={Layers} title="Multiple formats" text="PDFs, books, PYQs, mind maps & more" />
        </div>
      </div>
    </div>
  );
}

function StatChip({ value, label, tone = 'brand' }: { value: number; label: string; tone?: 'brand' | 'mint' | 'ocean' | 'lavender' }) {
  const colors: Record<string, string> = {
    brand: 'text-brand-600', mint: 'text-mint-600', ocean: 'text-ocean-600', lavender: 'text-lavender-600',
  };
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-surface-200 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur">
      <span className={`text-2xl font-bold ${colors[tone]}`}>{value}</span>
      <span className="text-sm text-surface-500">{label}</span>
    </div>
  );
}

function TrustItem({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-surface-50/50 p-4">
      <Icon className="mb-2 h-5 w-5 text-brand-600" />
      <p className="text-sm font-bold text-surface-900">{title}</p>
      <p className="mt-0.5 text-xs text-surface-500">{text}</p>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <NotesHomeContent />
    </Suspense>
  );
}
