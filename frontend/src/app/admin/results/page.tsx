'use client';
import { API_BASE } from '@/lib/apiBase';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export default function AdminResultsPage() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/tests?limit=20`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then((d: any) => setResults(d.data || [])).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Test Results</h1>
      <p className="text-surface-500 mb-6">View results and leaderboards for published tests</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((test) => (
          <Card key={test.id} className="hover:shadow-card-hover transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-surface-900">{test.title}</h3>
                <Badge variant={test.isFree ? 'success' : 'warning'}>{test.isFree ? 'Free' : 'Premium'}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-surface-500">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> -- attempts</span>
                <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> -- avg</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-20">
          <BarChart3 className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No test results available yet.</p>
        </div>
      )}
    </div>
  );
}