'use client';
import { useState } from 'react';
import { ListChecks, ThumbsUp, Search, CheckCircle2, Clock, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getLibrary, setRequestStatus } from '@/lib/notesStore';
import type { ResourceRequest } from '@/types/notes';
import { formatDate } from '@/lib/utils';

export default function AdminRequestsPage() {
  const data = getLibrary();
  const [requests, setRequests] = useState(() => [...data.requests].sort((a, b) => b.votes - a.votes));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const refresh = () => setRequests([...getLibrary().requests].sort((a, b) => b.votes - a.votes));

  const updateStatus = (id: string, status: ResourceRequest['status']) => {
    setRequestStatus(id, status);
    refresh();
  };

  const filtered = requests.filter(r => {
    const q = search.toLowerCase().trim();
    const matchQ = !q || r.title.toLowerCase().includes(q) || (r.subjectName || '').toLowerCase().includes(q) || (r.examName || '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || r.status === filter;
    return matchQ && matchFilter;
  });

  const tone: Record<ResourceRequest['status'], 'default' | 'success' | 'warning' | 'danger'> = {
    open: 'default', in_progress: 'warning', fulfilled: 'success', closed: 'danger',
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..." className="w-72 rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30">
          <option value="all">All statuses</option>
          {['open', 'in_progress', 'fulfilled', 'closed'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Request</th>
                  <th className="px-5 py-3">Votes</th>
                  <th className="px-5 py-3">Context</th>
                  <th className="px-5 py-3">Requested</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                    <td className="px-5 py-3 max-w-md">
                      <p className="font-medium text-surface-900 truncate">{r.title}</p>
                      {r.description && <p className="text-xs text-surface-400 truncate mt-0.5">{r.description}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 font-semibold text-surface-700"><ThumbsUp className="h-3.5 w-3.5 text-brand-600" /> {r.votes}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-surface-500">
                      {[r.examName, r.subjectName, r.resourceType].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td className="px-5 py-3 text-surface-500 text-xs">{formatDate(r.createdAt)}</td>
                    <td className="px-5 py-3"><Badge variant={tone[r.status]} size="sm">{r.status.replace(/_/g, ' ')}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, 'in_progress')}>
                          <Clock className="h-4 w-4" /> In Progress
                        </Button>
                        <Button size="sm" variant="cta" onClick={() => updateStatus(r.id, 'fulfilled')}>
                          <CheckCircle2 className="h-4 w-4" /> Fulfilled
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => updateStatus(r.id, 'closed')}>
                          <X className="h-4 w-4" /> Close
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-16 text-center">
                    <ListChecks className="h-10 w-10 text-surface-300 mx-auto mb-3" />
                    <p className="text-surface-500 font-medium">No requests found</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
