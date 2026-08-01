'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, Layers, GraduationCap, School, Landmark, Users, FileText, BookOpen,
  ChevronRight, Sparkles, ArrowRight, FilePlus2, HelpCircle, Library,
  BookMarked, Clock, TrendingUp, Palette, Compass,
} from 'lucide-react';
import { ContinueStudying, SectionRow, SectionHeading } from '@/components/notes/NotesSections';
import CrayonStick from '@/components/ui/CrayonStick';
import { crayon, type Crayon } from '@/lib/crayon';
import { getLibrary, getContinueStudying } from '@/lib/notesStore';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark, Users, School, FileText, BookOpen,
};

function StatChip({ value, label, c }: { value: number; label: string; c: Crayon }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border-2 border-surface-200 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur">
      <span className={`h-9 w-1.5 rounded-full ${c.body}`} />
      <span className={`font-display text-2xl font-bold ${c.text}`}>{value}</span>
      <span className="text-sm font-medium text-surface-500">{label}</span>
    </div>
  );
}

function TrustItem({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="rounded-2xl border-2 border-surface-200 bg-surface-50/50 p-4 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
      <Icon className="mb-2 h-5 w-5 text-brand-600" />
      <p className="text-sm font-bold text-surface-900">{title}</p>
      <p className="mt-0.5 text-xs text-surface-500">{text}</p>
    </div>
  );
}

function CategoryCard({ name, description, exams, href, Icon, c }: {
  name: string; description?: string; exams: { id: string; name: string; shortName?: string }[];
  href: string; Icon: React.ComponentType<{ className?: string }>; c: Crayon;
}) {
  return (
    <Link href={href} className="group block h-full">
      <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border-2 ${c.border} bg-white p-5 shadow-card transition-all group-hover:-translate-y-1.5 ${c.hoverBorder} hover:shadow-lg ${c.hoverShadow}`}>
        <div className={`absolute inset-x-0 top-0 h-2 ${c.body}`} />
        <div className="mb-4 mt-1 flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.body} text-white shadow-md`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className={`rounded-full ${c.chip} px-2.5 py-1 text-[11px] font-bold ${c.chipText}`}>
            {exams.length} {exams.length === 1 ? 'exam' : 'exams'}
          </span>
        </div>
        <h3 className={`font-display text-lg font-bold text-surface-900 ${c.hoverText}`}>{name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-surface-500">{description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {exams.slice(0, 3).map(e => (
            <span key={e.id} className={`rounded-lg ${c.chip} px-2 py-0.5 text-[11px] font-semibold ${c.chipText}`}>{e.shortName || e.name}</span>
          ))}
          {exams.length > 3 && <span className="rounded-lg bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-400">+{exams.length - 3}</span>}
        </div>
        <div className={`mt-4 flex items-center gap-1 text-sm font-bold ${c.text}`}>
          Explore
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function NotesHomeContent() {
  const router = useRouter();
  const data = getLibrary();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('browse-exams');

  const activeHomepageSections = useMemo(
    () => data.homepageSections.filter(s => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [data],
  );

  const examCategories = useMemo(() => data.examCategories.filter(c => c.isActive), [data]);
  const institutions = useMemo(() => data.institutions.filter(i => i.isActive), [data]);
  const continueItems = useMemo(() => getContinueStudying(1), []);

  const navSections = useMemo(() => {
    const list: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; color: Crayon }[] = [
      { id: 'browse-exams', label: 'Browse Exams', icon: GraduationCap, color: crayon(0) },
      { id: 'browse-academic', label: 'Browse Academic', icon: School, color: crayon(3) },
    ];
    if (continueItems.length > 0) list.push({ id: 'continue-studying', label: 'Continue', icon: Clock, color: crayon(5) });
    activeHomepageSections.forEach((s, i) => list.push({ id: `section-${s.id}`, label: s.title, icon: TrendingUp, color: crayon(i) }));
    list.push({ id: 'ctas', label: 'Contribute', icon: FilePlus2, color: crayon(2) });
    return list;
  }, [continueItems, activeHomepageSections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-30% 0px -60% 0px' },
    );
    navSections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [navSections]);

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
    <div className="bg-white animate-fade-in scroll-smooth">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">Notes &amp; PDFs</span>
        </nav>

        {/* Hero — crayon box */}
        <section className="relative mb-12 overflow-hidden rounded-4xl border-2 border-surface-200/70 bg-[#FFFBFA] p-6 sm:p-10 lg:p-12">
          <div
            className="absolute inset-0 opacity-60"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(239,97,80,0.14) 0.6px, transparent 0.6px)', backgroundSize: '22px 22px' }}
          />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-coral-200/40 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sunny-200/40 blur-3xl" />
          <div className="absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-lavender-200/40 blur-3xl" />

          {/* crayon cluster */}
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 items-end gap-2 lg:flex xl:right-12">
            <CrayonStick c={crayon(0)} height={72} tilt={-8} delay={0} />
            <CrayonStick c={crayon(1)} height={96} tilt={6} delay={0.4} />
            <CrayonStick c={crayon(2)} height={80} tilt={-4} delay={0.8} />
            <CrayonStick c={crayon(3)} height={110} tilt={9} delay={1.2} />
            <CrayonStick c={crayon(4)} height={64} tilt={-10} delay={0.6} />
          </div>

          <div className="relative max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white/80 px-3 py-1 text-xs font-bold text-brand-600 shadow-sm backdrop-blur">
              <Layers className="h-3.5 w-3.5" />
              Notes &amp; PDF Resource Library
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-surface-900 mb-4 leading-tight text-balance">
              Every note you need, <span className="bg-gradient-to-r from-coral-500 via-sunny-500 to-mint-500 bg-clip-text text-transparent">one search away</span>
            </h1>
            <p className="text-surface-500 text-base lg:text-lg leading-relaxed max-w-xl">
              Search thousands of exam notes, books, PYQs and study PDFs — or academic material for your degree. Everything organised, nothing missed.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative mt-6 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search notes, PYQs, books by title or topic..."
              className="w-full rounded-2xl border-2 border-surface-200 bg-white pl-12 pr-32 py-4 text-base text-surface-700 shadow-lg placeholder:text-surface-400 focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-300 transition-all"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition-all hover:bg-brand-600">
              Search
            </button>
          </form>

          <div className="relative mt-8 flex flex-wrap gap-3">
            <StatChip value={stats.total} label="Resources" c={crayon(0)} />
            <StatChip value={stats.free} label="Free" c={crayon(3)} />
            <StatChip value={stats.exams} label="Exams" c={crayon(1)} />
            <StatChip value={stats.topics} label="Topics" c={crayon(4)} />
          </div>
        </section>

        {/* Sticky palette quick-nav */}
        <nav className="sticky top-16 z-30 -mx-4 mb-12 border-y-2 border-surface-200/70 bg-white/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="mr-1 hidden shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-surface-400 sm:flex">
              <Palette className="h-4 w-4" /> Jump to
            </span>
            {navSections.map(s => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-all ${
                    isActive ? `${s.color.body} border-transparent text-white shadow-md` : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300 hover:text-surface-800'
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Step 01 — Browse exams */}
        <section id="browse-exams" className="mb-14 scroll-mt-28">
          <SectionHeading
            number="01"
            title="Browse by Exam"
            subtitle="Choose an exam category and dive straight into its syllabus, PYQs, notes and solved papers."
            icon={GraduationCap}
            color={crayon(0)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examCategories.map((cat, i) => {
              const c = crayon(i);
              const Icon = categoryIcons[cat.icon || 'FileText'] || BookOpen;
              const exams = data.exams.filter(e => e.categoryId === cat.id && e.isActive);
              return (
                <CategoryCard
                  key={cat.id}
                  name={cat.name}
                  description={cat.description}
                  exams={exams}
                  href={`/notes/category/${cat.slug}`}
                  Icon={Icon}
                  c={c}
                />
              );
            })}
          </div>
        </section>

        {/* Step 02 — Browse academic */}
        <section id="browse-academic" className="mb-14 scroll-mt-28">
          <SectionHeading
            number="02"
            title="Browse Academic"
            subtitle="Degree-wise material organised by institution, course, major and semester."
            icon={School}
            color={crayon(3)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.map((inst, i) => {
              const c = crayon(3 + i);
              const courses = data.courses.filter(cr => cr.institutionId === inst.id);
              return (
                <CategoryCard
                  key={inst.id}
                  name={inst.name}
                  description={inst.description}
                  exams={courses.map(cr => ({ id: cr.id, name: cr.name }))}
                  href={`/notes/academic/${inst.slug}`}
                  Icon={School}
                  c={c}
                />
              );
            })}
          </div>
        </section>

        {/* Step 03 — Continue studying */}
        <ContinueStudying color={crayon(5)} />

        {/* Step 04 — Admin sections */}
        {activeHomepageSections.map((section, i) => (
          <SectionRow key={section.id} section={section} color={crayon(i)} />
        ))}

        {/* Step 05 — Contribute & request */}
        <section id="ctas" className="mb-14 scroll-mt-28">
          <SectionHeading
            number="05"
            title="Be part of the library"
            subtitle="Share what you know or tell us what you're missing — the library grows with you."
            icon={Compass}
            color={crayon(2)}
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Link href="/notes/contribute" className="group">
              <div className="relative flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-brand p-6 text-white shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5 hover:shadow-brand-500/30">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
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
              <div className="relative flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-accent p-6 text-white shadow-lg shadow-accent-500/20 transition-all hover:-translate-y-0.5 hover:shadow-accent-500/30">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
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
        </section>

        {/* Trust strip */}
        <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <TrustItem icon={Sparkles} title="Verified content" text="Contributions reviewed before publishing" />
          <TrustItem icon={Library} title="Organised taxonomy" text="Exam & academic hierarchy with topics" />
          <TrustItem icon={BookMarked} title="Track progress" text="Save, resume and complete resources" />
          <TrustItem icon={Layers} title="Multiple formats" text="PDFs, books, PYQs, mind maps & more" />
        </div>
      </div>
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
