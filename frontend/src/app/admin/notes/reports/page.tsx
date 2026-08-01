'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Flag, Search, Eye, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getLibrary, setReportStatus, getResourceBySlug } from '@/lib/notesStore';
import type { ResourceReport } from '@/types/notes';
import { formatDate } from '@/lib/utils';

const reasonLabels: Record<string, string> = {
  copyright: 'Copyright', inaccurate: 'Inaccurate', outdated: 'Outdated',
  broken_file: 'Broken file', offensive: 'Offensive', spam: 'Spam', other: 'Other',
};

export default function AdminReportsPage() {
  const data = getLibrary();
  const [reports, setReports] = useState(() => [...data.reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const refresh = () => setReports([...getLibrary().reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  const updateStatus = (id: string, status: ResourceReport['status']) => {
    setReportStatus(id, status);
    refresh();
  };

  const openReports = reports.filter(r => r.status === 'open' || r.status === 'reviewing').length;

  const filtered = reports.filter(r => {
    const q = search.toLowerCase().trim();
    const matchQ = !q || (r.resourceTitle || '').toLowerCase().includes(q) || (r.reporterName || '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || r.status === filter;
    return matchQ && matchFilter;
  });

  const tone: Record<ResourceReport['status'], 'default' | 'success' | 'warning' | 'danger'> = {
    open: 'danger', reviewing: 'warning', resolved: 'success', dismissed: 'default',
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..." className="w-72 rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30">
          <option value="all">All statuses</option>
          {['open', 'reviewing', 'resolved', 'dismissed'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {openReports > 0 && <Badge variant="danger">{openReports} open</Badge>}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Reported resource</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Reporter</th>
                  <th className="px-5 py-3">Reported</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                    <td className="px-5 py-3 max-w-md">
                      <p className="font-medium text-surface-900 truncate">{r.resourceTitle || 'Takedown request'}</p>
                      {r.resourceSlug && <p className="text-xs text-surface-400 truncate">{r.resourceSlug}</p>}
                      {r.details && <p className="mt-1 line-clamp-1 text-xs text-surface-500">{r.details}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={r.reason === 'copyright' ? 'warning' : 'danger'} size="sm">{reasonLabels[r.reason]}</Badge>
                    </td>
                    <td className="px-5 py-3 text-xs text-surface-500">{r.reporterName || 'Anonymous'}</td>
                    <td className="px-5 py-3 text-surface-500 text-xs">{formatDate(r.createdAt)}</td>
                    <td className="px-5 py-3"><Badge variant={tone[r.status]} size="sm">{r.status}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.resourceSlug && getResourceBySlug(r.resourceSlug) && (
                          <Link href={`/notes/resource/${r.resourceSlug}`} target="_blank" className="rounded-lg p-1.5 text-surface-400 hover:text-brand-600 hover:bg-brand-50">
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, 'reviewing')}>
                          <AlertTriangle className="h-4 w-4" /> Reviewing
                        </Button>
                        {r.status !== 'resolved' && (
                          <Button size="sm" variant="cta" onClick={() => updateStatus(r.id, 'resolved')}>
                            <CheckCircle2 className="h-4 w-4" /> Resolve
                          </Button>
                        )}
                        {r.status !== 'dismissed' && (
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(r.id, 'dismissed')}>
                            <XCircle className="h-4 w-4" /> Dismiss
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-16 text-center">
                    <Flag className="h-10 w-10 text-surface-300 mx-auto mb-3" />
                    <p className="text-surface-500 font-medium">No reports found</p>
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
