'use client';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ChevronRight, BookOpen, ArrowLeft, GraduationCap, FileText, BrainCircuit, ListChecks, BookCheck, ExternalLink, BarChart3 } from 'lucide-react';

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
  const classData = classes[slug];

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
            <div className="h-10 w-10 rounded-xl bg-ocean-50 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-ocean-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">NCERT {classData.name}</h1>
              <p className="text-sm text-surface-500">{classData.subjects.length} subjects</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {classData.subjects.map(subject => (
            <div key={subject.name}>
              <h2 className="text-lg font-bold text-surface-900 mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-500" />
                {subject.name}
              </h2>
              <div className="space-y-4">
                {subject.books.map(book => (
                  <Card key={book.slug}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-surface-900 mb-1">{book.name}</h3>
                      <p className="text-xs text-surface-500 mb-3">{book.chapters.length} chapters</p>
                      <div className="space-y-2">
                        {book.chapters.map(ch => (
                          <div key={ch.slug} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 hover:bg-surface-100 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <FileText className="h-3.5 w-3.5 text-ocean-500 shrink-0" />
                                <span className="text-sm font-medium text-surface-900">{ch.name}</span>
                              </div>
                              <p className="text-xs text-surface-500 mt-0.5">{ch.summary}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 mt-0.5">
                              <span className="inline-flex items-center gap-1 text-xs text-mint-600"><BrainCircuit className="h-3 w-3" />{ch.mcqCount}</span>
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600"><BarChart3 className="h-3 w-3" />{ch.pyqCount}</span>
                              <span className="inline-flex items-center gap-1 text-xs text-brand-600"><ListChecks className="h-3 w-3" />{ch.testCount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100">
                        <Button variant="ghost" size="sm"><BrainCircuit className="h-3.5 w-3.5 mr-1" /> Practice MCQs</Button>
                        <Button variant="ghost" size="sm"><BookCheck className="h-3.5 w-3.5 mr-1" /> View Notes</Button>
                        <Button variant="ghost" size="sm"><ListChecks className="h-3.5 w-3.5 mr-1" /> Take Test</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
