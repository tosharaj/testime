'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { BookOpen, Trash2, Lock, Bookmark } from 'lucide-react';

export default function MyNotesPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    api.getBookmarks().then(res => setBookmarks(res.data)).catch(console.error);
  }, []);

  const handleRemove = async (id: string) => {
    await api.removeBookmark(id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">My Notes</h1>
      <p className="text-surface-500 mb-8">Notes you&apos;ve bookmarked for quick access</p>

      {bookmarks.filter(b => b.note).length === 0 ? (
        <div className="text-center py-20">
          <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-surface-300" />
          </div>
          <p className="text-lg font-semibold text-surface-900 mb-2">No saved notes yet</p>
          <p className="text-sm text-surface-500 mb-6">Browse notes and bookmark them for quick access</p>
          <Link href="/notes"><Button>Browse Notes</Button></Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.filter(b => b.note).map((b) => (
            <Card key={b.id} className="card-hover group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={b.note?.isPremium ? 'premium' : 'success'} size="sm">
                    {b.note?.isPremium ? 'Premium' : 'Free'}
                  </Badge>
                  <button
                    onClick={() => handleRemove(b.id)}
                    className="p-1.5 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Link href={`/notes/${b.note?.slug}`}>
                  <h3 className="font-bold text-surface-900 mb-1.5 line-clamp-2 hover:text-brand-600 transition-colors">
                    {b.note?.title}
                  </h3>
                </Link>
                {b.note?.summary && (
                  <p className="text-xs text-surface-500 line-clamp-2 leading-relaxed">{b.note.summary}</p>
                )}
                {b.note?.isPremium && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent-600">
                    <Lock className="h-3 w-3" /> Premium content
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
