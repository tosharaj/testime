'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Exam } from '@/types';
import { ArrowRight, BookOpen, BrainCircuit, FileText, GraduationCap } from 'lucide-react';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    api.getExams().then(res => setExams(res.data)).catch(console.error);
  }, []);

  return (
    <div className="py-16 lg:py-24 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-brand-200/60 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 mb-6">
            <GraduationCap className="h-4 w-4" />
            Browse Exams
          </div>
          <h1 className="section-heading text-surface-900 mb-4">All Exams</h1>
          <p className="section-subheading">Browse exam categories and access curated study material</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Link key={exam.id} href={`/exams/${exam.slug}`} className="group">
              <Card className="h-full card-hover border-2 border-transparent hover:border-brand-200/60">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{exam.icon || '📚'}</span>
                      <div>
                        <h3 className="text-lg font-bold text-surface-900 group-hover:text-brand-600 transition-colors">{exam.name}</h3>
                        {exam.shortName && <p className="text-sm text-surface-400">{exam.shortName}</p>}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-surface-300 group-hover:text-brand-400 transition-colors shrink-0" />
                  </div>
                  {exam.description && <p className="text-sm text-surface-500 mb-4 leading-relaxed">{exam.description}</p>}
                  <div className="flex items-center gap-4 text-sm text-surface-400">
                    <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> Notes</span>
                    <span className="flex items-center gap-1.5"><BrainCircuit className="h-4 w-4" /> Tests</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {exams.length === 0 && (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-surface-300" />
            </div>
            <p className="text-lg font-semibold text-surface-900 mb-2">No exams available</p>
            <p className="text-sm text-surface-500">Check back soon for new exam categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}
