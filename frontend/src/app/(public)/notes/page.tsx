'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { Note } from '@/types';
import { BookOpen, Eye, Lock, ArrowRight, Search, FileText } from 'lucide-react';

function NotesContent() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params: any = { page };
    const examId = searchParams.get('examId');
    const subjectId = searchParams.get('subjectId');
    const topicId = searchParams.get('topicId');
    if (examId) params.examId = examId;
    if (subjectId) params.subjectId = subjectId;
    if (topicId) params.topicId = topicId;
    api.getNotes(params).then((res) => { setNotes(res.data); setTotal(res.total); }).catch(console.error);
  }, [searchParams, page]);

  return (
    <div className="py-16 lg:py-24 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-brand-200/60 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 mb-6">
            <FileText className="h-4 w-4" />
            Study Material
          </div>
          <h1 className="section-heading text-surface-900 mb-4">Study Notes</h1>
          <p className="section-subheading">Browse through our collection of exam-specific study notes</p>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-surface-300" />
            </div>
            <p className="text-lg font-semibold text-surface-900 mb-2">No notes found</p>
            <p className="text-sm text-surface-500">Try a different category or search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Link key={note.id} href={`/notes/${note.slug}`}>
                <Card className="card-hover h-full group">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={note.isPremium ? 'premium' : 'success'} size="sm">
                        {note.isPremium ? 'Premium' : 'Free'}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-surface-400">
                        <Eye className="h-3 w-3" />
                        {note.viewCount}
                      </span>
                    </div>
                    <h3 className="font-bold text-surface-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {note.title}
                    </h3>
                    {note.summary && (
                      <p className="text-sm text-surface-500 mb-3 line-clamp-2 leading-relaxed flex-1">{note.summary}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-surface-400">
                      {note.exam && <span className="bg-surface-100 px-2.5 py-1 rounded-lg font-medium">{note.exam.name}</span>}
                      {note.subject && <span className="bg-surface-100 px-2.5 py-1 rounded-lg font-medium">{note.subject.name}</span>}
                    </div>
                    {note.isPremium && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent-600">
                        <Lock className="h-3 w-3" /> Premium content
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {total > 20 && (
          <div className="mt-10 flex justify-center items-center gap-3">
            {page > 1 && (
              <button
                onClick={() => setPage(p => p - 1)}
                className="px-5 py-2.5 text-sm font-medium rounded-xl border-2 border-surface-200 bg-white text-surface-600 hover:border-brand-300 hover:text-brand-600 transition-all"
              >
                Previous
              </button>
            )}
            <span className="px-4 py-2.5 text-sm text-surface-500 font-medium">
              Page {page} of {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-5 py-2.5 text-sm font-medium rounded-xl border-2 border-surface-200 bg-white text-surface-600 hover:border-brand-300 hover:text-brand-600 transition-all"
            >
              Next
            </button>
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
          <BookOpen className="h-6 w-6 text-brand-600" />
        </div>
        <p className="text-surface-400 animate-pulse-soft">Loading...</p>
      </div>
    }>
      <NotesContent />
    </Suspense>
  );
}
