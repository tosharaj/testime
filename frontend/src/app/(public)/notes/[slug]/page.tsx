'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getNoteBySlug, incrementNoteViews, getNotes, NoteItem } from '@/lib/notesStore';
import { BookOpen, Download, ArrowLeft, Lock, Eye, Calendar, FileText, ChevronRight, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function NoteDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [note, setNote] = useState<NoteItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<NoteItem[]>([]);

  useEffect(() => {
    const n = getNoteBySlug(slug);
    setNote(n || null);
    if (n) {
      incrementNoteViews(slug);
      setNote({ ...n, viewCount: n.viewCount + 1 });
      setRelated(getNotes({ examId: n.exam.slug }).data.filter(r => r.id !== n.id).slice(0, 3));
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
          <FileText className="h-6 w-6 text-brand-600" />
        </div>
        <p className="text-surface-400 animate-pulse-soft">Loading...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="py-24 text-center">
        <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-surface-300" />
        </div>
        <p className="text-lg font-semibold text-surface-900 mb-2">Note not found</p>
        <Link href="/notes"><Button variant="outline">Back to Notes</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium truncate max-w-[240px]">{note.title}</span>
        </nav>

        <div className="flex items-center gap-3 mb-4">
          <Badge variant={note.isPremium ? 'premium' : 'success'} size="md">
            {note.isPremium ? 'Premium' : 'Free'}
          </Badge>
          <span className="flex items-center gap-1.5 text-sm text-surface-400">
            <Eye className="h-4 w-4" />{note.viewCount} views
          </span>
          <span className="flex items-center gap-1.5 text-sm text-surface-400">
            <Calendar className="h-4 w-4" />{formatDate(note.createdAt)}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-surface-900 mb-4 leading-tight">{note.title}</h1>
        {note.summary && <p className="text-lg text-surface-500 mb-8 leading-relaxed">{note.summary}</p>}

        <div className="flex flex-wrap gap-2 mb-10">
          {note.exam && (
            <Link href={`/notes?examId=${note.exam.slug}`}
              className="text-sm font-medium px-4 py-1.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors">
              {note.exam.name}
            </Link>
          )}
          {note.subject && (
            <Link href={`/notes?subjectId=${note.subject.slug}`}
              className="text-sm font-medium px-4 py-1.5 rounded-xl bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors">
              {note.subject.name}
            </Link>
          )}
          {note.topic && (
            <span className="text-sm font-medium px-4 py-1.5 rounded-xl bg-surface-100 text-surface-600">
              {note.topic.name}
            </span>
          )}
        </div>

        {note.isPremium && (
          <Card className="mb-10 border-accent-200 bg-amber-50 overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
                <Lock className="h-6 w-6 text-accent-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-accent-800">Premium Content</p>
                <p className="text-sm text-accent-600">Subscribe to unlock this note and download PDF</p>
              </div>
              <Link href="/pricing">
                <Button variant="accent" size="sm">View Plans</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="bg-white rounded-3xl border border-surface-200/60 p-6 sm:p-10 shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: note.content || '' }} />
        </div>

        {note.downloadUrl && !note.isPremium && (
          <div className="mt-8 flex justify-center">
            <Button>
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-surface-100">
            <h2 className="font-display text-xl font-bold text-surface-900 mb-6">More {note.exam.name} Notes</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/notes/${r.slug}`} className="group">
                  <div className="rounded-2xl border border-surface-200 p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all h-full bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={r.isPremium ? 'premium' : 'success'} size="sm">{r.isPremium ? 'Premium' : 'Free'}</Badge>
                    </div>
                    <h3 className="font-bold text-surface-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {r.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-1.5 transition-all">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
