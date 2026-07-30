'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Exam } from '@/types';
import { BookOpen, BrainCircuit, ChevronRight, FileText, ArrowRight, GraduationCap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ExamDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [exam, setExam] = useState<Exam | null>(null);

  useEffect(() => {
    api.getExamBySlug(slug).then(setExam).catch(console.error);
  }, [slug]);

  if (!exam) {
    return (
      <div className="py-24 text-center">
        <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
          <GraduationCap className="h-6 w-6 text-brand-600" />
        </div>
        <p className="text-surface-400 animate-pulse-soft">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-16 lg:py-24 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-5 mb-12 p-6 bg-white rounded-2xl border border-surface-200/60 shadow-sm">
          <span className="text-5xl">{exam.icon || '📚'}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">{exam.name}</h1>
            <p className="text-surface-500 mt-1">{exam.description}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-surface-900 mb-5 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-brand-600" />
                Subjects
              </h2>
              <div className="space-y-3">
                {exam.subjects?.map((subject) => (
                  <Card key={subject.id} className="hover:border-brand-200/60 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-surface-900">{subject.name}</h3>
                          {subject.description && <p className="text-sm text-surface-500 mt-0.5">{subject.description}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/notes?subjectId=${subject.id}`}>
                            <Button variant="ghost" size="sm"><BookOpen className="h-4 w-4 mr-1.5" /> Notes</Button>
                          </Link>
                          <Link href={`/questions?subjectId=${subject.id}`}>
                            <Button variant="ghost" size="sm"><FileText className="h-4 w-4 mr-1.5" /> Questions</Button>
                          </Link>
                        </div>
                      </div>
                      {subject.topics && subject.topics.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-surface-100 flex flex-wrap gap-2">
                          {subject.topics.map((topic) => (
                            <Link
                              key={topic.id}
                              href={`/notes?topicId=${topic.id}`}
                              className="text-xs px-3 py-1.5 rounded-xl bg-surface-100 text-surface-600 hover:bg-brand-50 hover:text-brand-700 font-medium transition-all"
                            >
                              {topic.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="bg-brand-600 border-0 text-white">
              <CardContent className="p-6 text-center">
                <BrainCircuit className="h-10 w-10 mx-auto text-white/70 mb-3" />
                <h3 className="font-bold text-lg mb-2">Test Series</h3>
                <p className="text-sm text-white/70 mb-5">Practice with exam-specific mock tests</p>
                <Link href={`/test-series?examId=${exam.id}`}>
                  <Button variant="primary" className="w-full bg-white text-brand-700 hover:bg-brand-50 hover:text-brand-700">
                    View Tests <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-10 w-10 mx-auto text-brand-600 mb-3" />
                <h3 className="font-bold text-lg text-surface-900 mb-2">Study Notes</h3>
                <p className="text-sm text-surface-500 mb-5">Access curated notes for every topic</p>
                <Link href={`/notes?examId=${exam.id}`}>
                  <Button variant="outline" className="w-full">
                    Browse Notes <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
