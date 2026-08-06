'use client';
import { API_BASE } from '@/lib/apiBase';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/exams`).then(r => r.json()).then(setExams).catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Exam Categories</h1>
        <Button><Plus className="h-4 w-4 mr-1" /> New Exam</Button>
      </div>

      {exams.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No exams created yet.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{exam.icon || '📚'}</span>
                  <div>
                    <h3 className="font-semibold text-surface-900">{exam.name}</h3>
                    <p className="text-xs text-surface-500">{exam.subjects?.length || 0} subjects</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 text-surface-400 hover:text-brand-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                  <button className="p-1.5 text-surface-400 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
