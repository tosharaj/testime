'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { BarChart3, Target, TrendingUp, Clock, BrainCircuit, Award } from 'lucide-react';

export default function ResultsPage() {
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    api.getMyAttempts().then((res) => setAttempts(res.data.filter((a: any) => a.status === 'completed'))).catch(console.error);
  }, []);

  const avgAccuracy = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + (a.accuracy || 0), 0) / attempts.length) : 0;
  const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length) : 0;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">Performance Analytics</h1>
      <p className="text-surface-500 mb-8">Track your progress and improve your performance</p>

      {attempts.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-surface-300" />
          </div>
          <p className="text-lg font-semibold text-surface-900 mb-2">No data yet</p>
          <p className="text-sm text-surface-500">Complete some tests to see your analytics here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Target, label: 'Avg Accuracy', value: `${avgAccuracy}%`, color: 'bg-brand-500' },
              { icon: TrendingUp, label: 'Avg Score', value: avgScore, color: 'bg-emerald-500' },
              { icon: BrainCircuit, label: 'Total Tests', value: attempts.length, color: 'bg-purple-500' },
            ].map((s) => (
              <Card key={s.label} className="card-hover">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${s.color} text-white shadow-lg mb-3`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold text-surface-900">{s.value}</p>
                  <p className="text-sm text-surface-500 mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attempts.slice(0, 10).map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3.5 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center">
                        <Award className="h-4 w-4 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{a.test?.title}</p>
                        <p className="text-xs text-surface-400">{formatDate(a.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-surface-900">{a.score}/{a.totalMarks}</p>
                      <div className="flex items-center gap-2 text-xs text-surface-400">
                        <span>{Math.round(a.accuracy || 0)}% acc</span>
                        <span>&bull;</span>
                        <span>{a.timeTaken ? `${Math.round(a.timeTaken / 60)}m` : '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
