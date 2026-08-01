'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getNotes, getAllNotes, NoteItem } from '@/lib/notesStore';
import { BookOpen, Eye, Lock, ArrowRight, Search, FileText, ChevronRight, Layers, GraduationCap } from 'lucide-react';

function NotesContent() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [query, setQuery] = useState('');
  const [examSlug, setExamSlug] = useState('all');
  const [subjectSlug, setSubjectSlug] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const all = useMemo(() => getAllNotes(), []);

  const exams = useMemo(() => {
    const map = new Map<string, string>();
    all.forEach(n => map.set(n.exam.slug, n.exam.name));
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [all]);

  const subjects = useMemo(() => {
    const map = new Map<string, string>();
    all.forEach(n => map.set(n.subject.slug, n.subject.name));
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [all]);

  useEffect(() => {
    const examId = searchParams.get('examId');
    if (examId) setExamSlug(examId);
  }, [searchParams]);

  useEffect(() => {
    setNotes(getNotes({ examId: examSlug !== 'all' ? examSlug : undefined, subjectId: subjectSlug !== 'all' ? subjectSlug : undefined, search: query || undefined }).data);
  }, [examSlug, subjectSlug, query]);

  const counts = useMemo(() => ({
    free: all.filter(n => !n.isPremium).length,
    premium: all.filter(n => n.isPremium).length,
  }), [all]);

  const subjectCounts = useMemo(() => {
    const map: Record<string, number> = {};
    all.forEach(n => { map[n.subject.slug] = (map[n.subject.slug] || 0) + 1; });
    return map;
  }, [all]);

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">Notes</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-4xl bg-gradient-hero border border-surface-200/60 p-8 lg:p-12 mb-8">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-mint-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-lavender-200/40 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-surface-200 px-3 py-1 text-xs font-semibold text-mint-600 mb-5 shadow-sm">
              <Layers className="h-3.5 w-3.5" />
              Exam-Focused Study Notes
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-surface-900 mb-4 leading-tight">
              Study Notes, <span className="bg-gradient-to-r from-mint-500 to-brand-500 bg-clip-text text-transparent">Organised &amp; Exam-Ready</span>
            </h1>
            <p className="text-surface-500 text-base lg:text-lg leading-relaxed max-w-xl">
              Topic-wise notes for every Odisha exam — search by exam, filter by subject, and read instantly.
            </p>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-surface-200 px-4 py-2.5 flex items-center gap-2 shadow-sm">
              <span className="text-2xl font-bold text-surface-900">{all.length}</span>
              <span className="text-sm text-surface-500">Notes</span>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-surface-200 px-4 py-2.5 flex items-center gap-2 shadow-sm">
              <span className="text-2xl font-bold text-mint-600">{counts.free}</span>
              <span className="text-sm text-surface-500">Free</span>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-surface-200 px-4 py-2.5 flex items-center gap-2 shadow-sm">
              <span className="text-2xl font-bold text-accent-600">{counts.premium}</span>
              <span className="text-sm text-surface-500">Premium</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search notes by title or topic..."
              className="w-full rounded-xl border border-surface-200 bg-surface-50 pl-10 pr-4 py-2.5 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-300 transition-all"
            />
          </div>
          <select
            value={examSlug}
            onChange={e => { setExamSlug(e.target.value); setSubjectSlug('all'); }}
            className="rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
          >
            <option value="all">All Exams</option>
            {exams.map(e => <option key={e.slug} value={e.slug}>{e.name}</option>)}
          </select>
          <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-xl w-fit">
            <button onClick={() => setView('grid')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'grid' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
              Grid
            </button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
              List
            </button>
          </div>
        </div>

        {/* Subject chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSubjectSlug('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${subjectSlug === 'all' ? 'bg-surface-900 text-white shadow-sm' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}
          >
            All Subjects
          </button>
          {subjects.map(s => (
            <button
              key={s.slug}
              onClick={() => setSubjectSlug(s.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${subjectSlug === s.slug ? 'bg-brand-600 text-white shadow-sm' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}
            >
              {s.name} <span className="opacity-60 ml-1">{subjectCounts[s.slug]}</span>
            </button>
          ))}
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-surface-300" />
            </div>
            <p className="text-lg font-semibold text-surface-900 mb-2">No notes found</p>
            <p className="text-sm text-surface-500">Try clearing filters or a different search.</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map(note => (
              <Link key={note.id} href={`/notes/${note.slug}`}>
                <Card className="card-hover h-full group overflow-hidden">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={note.isPremium ? 'premium' : 'success'} size="sm">
                        {note.isPremium ? 'Premium' : 'Free'}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-surface-400">
                        <Eye className="h-3 w-3" /> {note.viewCount}
                      </span>
                    </div>
                    <h3 className="font-bold text-surface-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {note.title}
                    </h3>
                    {note.summary && (
                      <p className="text-sm text-surface-500 mb-4 line-clamp-2 leading-relaxed flex-1">{note.summary}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                      {note.exam && <span className="bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg font-medium">{note.exam.name}</span>}
                      {note.subject && <span className="bg-accent-50 text-accent-700 px-2.5 py-1 rounded-lg font-medium">{note.subject.name}</span>}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-1.5 transition-all">
                      Read Notes <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map(note => (
              <Link key={note.id} href={`/notes/${note.slug}`}>
                <Card className="card-hover group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={note.isPremium ? 'premium' : 'success'} size="sm">{note.isPremium ? 'Premium' : 'Free'}</Badge>
                          <span className="inline-flex items-center gap-1 text-xs text-surface-400"><Eye className="h-3 w-3" /> {note.viewCount}</span>
                        </div>
                        <h3 className="font-bold text-surface-900 group-hover:text-brand-600 transition-colors">{note.title}</h3>
                        {note.summary && <p className="text-sm text-surface-500 mt-1 line-clamp-1">{note.summary}</p>}
                      </div>
                      <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <span className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg font-medium">{note.exam.name}</span>
                        <ArrowRight className="h-4 w-4 text-surface-300 group-hover:text-brand-400 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center">
        <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
          <GraduationCap className="h-6 w-6 text-brand-600" />
        </div>
        <p className="text-surface-400 animate-pulse-soft">Loading...</p>
      </div>
    }>
      <NotesContent />
    </Suspense>
  );
}
