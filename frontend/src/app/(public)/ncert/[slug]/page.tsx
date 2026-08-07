'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { crayon } from '@/lib/crayon';
import { ncertApi } from '@/lib/ncertApi';
import { ChevronRight, BookOpen, ArrowLeft, GraduationCap, FileText, BrainCircuit, ListChecks, BookCheck, BarChart3, BookMarked, Sparkles } from 'lucide-react';

const classes: Record<string, {
  id: number; name: string; subjects: { name: string; books: { name: string; slug: string; chapters: { name: string; slug: string; summary: string; mcqCount: number; pyqCount: number; testCount: number }[] }[] }[]
}> = {
  'class-6': {
    id: 6, name: 'Class 6',
    subjects: [
      {
        name: 'History', books: [{
          name: 'Our Pasts I', slug: 'our-pasts-i',
          chapters: [
            { name: 'What, Where, How and When?', slug: 'what-where-how-when', summary: 'Introduction to history - sources and methods of studying the past.', mcqCount: 45, pyqCount: 12, testCount: 2 },
            { name: 'From Hunting-Gathering to Growing Food', slug: 'hunting-gathering-to-growing-food', summary: 'The Neolithic Revolution and the beginning of agriculture.', mcqCount: 52, pyqCount: 15, testCount: 2 },
          ]
        }]
      },
      {
        name: 'Geography', books: [{
          name: 'The Earth Our Habitat', slug: 'the-earth-our-habitat',
          chapters: [
            { name: 'The Earth in the Solar System', slug: 'earth-in-solar-system', summary: 'Our solar system, planets, and Earth\'s position.', mcqCount: 60, pyqCount: 18, testCount: 3 },
            { name: 'Globe: Latitudes and Longitudes', slug: 'globe-latitudes-longitudes', summary: 'Understanding latitudes, longitudes, and time zones.', mcqCount: 48, pyqCount: 14, testCount: 2 },
          ]
        }]
      },
    ]
  },
  'class-7': {
    id: 7, name: 'Class 7',
    subjects: [
      {
        name: 'History', books: [{
          name: 'Our Pasts II', slug: 'our-pasts-ii',
          chapters: [
            { name: 'Tracing Changes Through a Thousand Years', slug: 'tracing-changes', summary: 'Medieval India - political, social and economic changes.', mcqCount: 55, pyqCount: 16, testCount: 2 },
          ]
        }]
      },
    ]
  },
  'class-11': {
    id: 11, name: 'Class 11',
    subjects: [
      {
        name: 'Polity', books: [{
          name: 'Indian Constitution at Work', slug: 'indian-constitution-at-work',
          chapters: [
            { name: 'Constitution: Why and How?', slug: 'constitution-why-how', summary: 'Need for a constitution, framing of the Indian Constitution, key features.', mcqCount: 85, pyqCount: 32, testCount: 4 },
            { name: 'Fundamental Rights', slug: 'fundamental-rights-ncert', summary: 'Fundamental Rights under the Indian Constitution - Articles 12 to 35.', mcqCount: 120, pyqCount: 45, testCount: 6 },
            { name: 'Directive Principles of State Policy', slug: 'directive-principles-state-policy', summary: 'DPSP - Articles 36 to 51, welfare state provisions.', mcqCount: 65, pyqCount: 22, testCount: 3 },
            { name: 'Executive and Legislature', slug: 'executive-legislature', summary: 'President, Prime Minister, Parliament - composition and powers.', mcqCount: 95, pyqCount: 38, testCount: 5 },
          ]
        }]
      },
      {
        name: 'History', books: [{
          name: 'Themes in World History', slug: 'themes-world-history',
          chapters: [
            { name: 'From the Beginning of Time', slug: 'beginning-of-time', summary: 'Early human evolution and the Paleolithic Age.', mcqCount: 42, pyqCount: 10, testCount: 2 },
          ]
        }]
      },
      {
        name: 'Economics', books: [{
          name: 'Indian Economic Development', slug: 'indian-economic-development',
          chapters: [
            { name: 'Indian Economy on the Eve of Independence', slug: 'indian-economy-eve-independence', summary: 'State of Indian economy under colonial rule.', mcqCount: 58, pyqCount: 20, testCount: 3 },
          ]
        }]
      },
    ]
  },
  'class-12': {
    id: 12, name: 'Class 12',
    subjects: [
      {
        name: 'Polity', books: [{
          name: 'Contemporary World Politics', slug: 'contemporary-world-politics',
          chapters: [
            { name: 'The Cold War Era', slug: 'cold-war-era', summary: 'Cold War, NAM, bipolar world order.', mcqCount: 72, pyqCount: 25, testCount: 3 },
          ]
        }]
      },
    ]
  },
};

export default function NcertClassPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [liveData, setLiveData] = useState<typeof classes[string] | null>(null);

  useEffect(() => {
    let mounted = true;
    const num = parseInt(slug.replace(/[^0-9]/g, ''), 10);
    if (!num || Number.isNaN(num)) return;
    ncertApi
      .getBooks({ class: num, includeChapters: true })
      .then((books) => {
        if (!mounted || !books.length) return;
        const subjectMap = new Map<string, { name: string; books: any[] }>();
        books.forEach((b) => {
          const entry = subjectMap.get(b.subject) ?? { name: b.subject, books: [] };
          entry.books.push({
            name: b.name,
            slug: b.slug,
            chapters: (b.chapters ?? []).map((ch) => ({
              name: ch.name,
              slug: ch.slug,
              summary: ch.summary ?? '',
              mcqCount: ch.links?.filter((l) => l.questionId).length ?? 0,
              pyqCount: 0,
              testCount: 0,
            })),
          });
          subjectMap.set(b.subject, entry);
        });
        setLiveData({ id: num, name: `Class ${num}`, subjects: Array.from(subjectMap.values()) });
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [slug]);

  const classData = liveData ?? classes[slug];

  if (!classData) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-surface-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-surface-900 mb-2">Not Found</h1>
          <p className="text-sm text-surface-500 mb-4">This class does not exist. Available: Class 6-12.</p>
          <Link href="/ncert"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-1" /> Browse All Classes</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-8">
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/ncert" className="hover:text-brand-600 transition-colors">NCERT</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">{classData.name}</span>
        </nav>

        <Link href="/ncert" className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-brand-600 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> All Classes
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-500 to-brand-500 text-white shadow-md shadow-ocean-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-surface-900">NCERT {classData.name}</h1>
              <p className="text-sm text-surface-500">{classData.subjects.length} subjects · chapter-wise learning hub</p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {classData.subjects.map((subject, si) => {
            const sub = crayon(si);
            const bookTotal = subject.books.reduce((n, b) => n + b.chapters.length, 0);
            return (
            <div key={subject.name}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${sub.soft} ring-2 ring-white shadow-sm`}>
                  <BookOpen className={`h-5 w-5 ${sub.text}`} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-surface-900 leading-tight">{subject.name}</h2>
                  <p className="text-xs text-surface-400">{subject.books.length} {subject.books.length === 1 ? 'book' : 'books'} · {bookTotal} chapters</p>
                </div>
              </div>
              <div className="space-y-4">
                {subject.books.map(book => (
                  <Card key={book.slug} className="overflow-hidden border-surface-200">
                    <div className={`h-1.5 bg-gradient-to-r from-ocean-400 to-brand-400`} />
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${sub.body} text-white shadow-sm`}>
                          <BookMarked className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                          <h3 className="font-display text-lg font-bold text-surface-900 leading-tight">{book.name}</h3>
                          <p className="text-xs text-surface-400">{book.chapters.length} chapters</p>
                        </div>
                        <Badge className={sub.chip} size="sm"><BookOpen className="h-3 w-3 mr-1" /> NCERT</Badge>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {book.chapters.map(ch => (
                          <Link
                            key={ch.slug}
                            href={`/ncert/practice/${book.slug}/${ch.slug}`}
                            className="group flex items-start gap-3 rounded-xl border border-surface-100 bg-surface-50/60 p-3 transition-all hover:border-brand-200 hover:bg-white hover:shadow-sm"
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-surface-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-semibold text-surface-900 truncate group-hover:text-brand-600 transition-colors">{ch.name}</span>
                              </div>
                              <p className="text-xs text-surface-500 line-clamp-2">{ch.summary}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-mint-50 py-2 text-xs font-semibold text-mint-700"><BrainCircuit className="h-4 w-4" />{book.chapters.reduce((n, c) => n + c.mcqCount, 0)} MCQs</div>
                        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 py-2 text-xs font-semibold text-amber-700"><BarChart3 className="h-4 w-4" />{book.chapters.reduce((n, c) => n + c.pyqCount, 0)} PYQs</div>
                        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-50 py-2 text-xs font-semibold text-brand-700"><ListChecks className="h-4 w-4" />{book.chapters.reduce((n, c) => n + c.testCount, 0)} Tests</div>
                      </div>
                      {book.chapters[0] && (
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-surface-100 pt-4">
                          <Link href={`/ncert/practice/${book.slug}/${book.chapters[0].slug}`}>
                            <Button size="sm" variant="outline"><BrainCircuit className="h-4 w-4 mr-1" /> Practice MCQs</Button>
                          </Link>
                          <Link href={`/ncert/practice/${book.slug}/${book.chapters[0].slug}`}>
                            <Button size="sm" variant="outline"><BookCheck className="h-4 w-4 mr-1" /> View Notes</Button>
                          </Link>
                          <Link href={`/ncert/practice/${book.slug}/${book.chapters[0].slug}`}>
                            <Button size="sm"><Sparkles className="h-4 w-4 mr-1" /> Take Test</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
