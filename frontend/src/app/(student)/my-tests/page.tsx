'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { BrainCircuit, Clock, Target, ArrowRight, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function MyTestsPage() {
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    api.getMyAttempts().then((res) => setAttempts(res.data)).catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">My Tests</h1>
      <p className="text-surface-500 mb-8">Track all your test attempts and progress</p>

      {attempts.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <BrainCircuit className="h-8 w-8 text-surface-300" />
          </div>
          <p className="text-lg font-semibold text-surface-900 mb-2">No tests attempted yet</p>
          <p className="text-sm text-surface-500 mb-6">Start with a free practice test</p>
          <Link href="/test-series">
            <Button>Browse Tests <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((a) => (
            <Card key={a.id} className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center">
                        <BrainCircuit className="h-4 w-4 text-brand-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-900">{a.test?.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-surface-400 mt-0.5">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.test?.duration} min</span>
                          <span>&bull;</span>
                          <span>{formatDate(a.startedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {a.status === 'completed' ? (
                      <div>
                        <p className="text-xl font-bold text-surface-900">{a.score}/{a.totalMarks}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-surface-400">{Math.round(a.accuracy || 0)}% accuracy</span>
                          <Badge variant="success" size="sm">Completed</Badge>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Badge variant="warning" size="sm">In Progress</Badge>
                        <div className="mt-2">
                          <Link href={`/test-series`}>
                            <Button size="sm">Continue</Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
