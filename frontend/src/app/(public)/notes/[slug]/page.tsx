'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Note } from '@/types';
import { BookOpen, Download, ArrowLeft, Lock, Eye, Calendar, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function NoteDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNoteBySlug(slug).then(setNote).catch(console.error).finally(() => setLoading(false));
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
    <div className="py-16 lg:py-24 animate-fade-in">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-400 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Notes
        </Link>

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

        <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4 leading-tight">{note.title}</h1>
        {note.summary && <p className="text-lg text-surface-500 mb-8 leading-relaxed">{note.summary}</p>}

        <div className="flex flex-wrap gap-2 mb-10">
          {note.exam && (
            <Link href={`/exams/${note.exam.slug}`}
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

        <div className="bg-white rounded-2xl border border-surface-200/60 p-6 sm:p-10 shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: note.content || '' }} />
        </div>

        {note.downloadUrl && !note.isPremium && (
          <div className="mt-8 flex justify-center">
            <Button>
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
