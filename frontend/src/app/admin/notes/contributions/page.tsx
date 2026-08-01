'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle, Inbox, Search, Eye, Calendar, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getLibrary, setContributionStatus } from '@/lib/notesStore';
import type { Contribution, ContributionStatus } from '@/types/notes';
import { formatDate } from '@/lib/utils';

const statusTone: Record<ContributionStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  submitted: 'info',
  under_review: 'warning',
  approved: 'success',
  rejected: 'danger',
  published: 'success',
};

export default function AdminContributionsPage() {
  const data = getLibrary();
  const [contributions, setContributions] = useState(() => [...data.contributions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [detail, setDetail] = useState<Contribution | null>(null);

  const refresh = () => setContributions([...getLibrary().contributions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  const applyStatus = (id: string, status: ContributionStatus) => {
    setContributionStatus(id, status);
    refresh();
  };

  const pendingCount = contributions.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const filtered = contributions.filter(c => {
    const q = search.toLowerCase().trim();
    const matchQ = !q || c.resourceTitle.toLowerCase().includes(q) || c.contributorName.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || c.status === filter;
    return matchQ && matchFilter;
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contributions..." className="w-72 rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30">
          <option value="all">All statuses</option>
          {Object.keys(statusTone).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        {pendingCount > 0 && <Badge variant="warning">{pendingCount} pending review</Badge>}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Resource</th>
                  <th className="px-5 py-3">Contributor</th>
                  <th className="px-5 py-3">Copyright</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                    <td className="px-5 py-3 max-w-md">
                      <p className="font-medium text-surface-900 truncate">{c.resourceTitle}</p>
                      <p className="text-xs text-surface-400 truncate mt-0.5">
                        {[c.examName, c.subjectName, c.unitChapter, c.topicName].filter(Boolean).join(' · ') || c.resourceType}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-surface-800">{c.contributorName}</p>
                      {c.contributorEmail && <p className="text-xs text-surface-400">{c.contributorEmail}</p>}
                    </td>
                    <td className="px-5 py-3">
                      {c.copyrightDeclaration ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-mint-700"><ShieldCheck className="h-3.5 w-3.5" /> Declared</span>
                      ) : (
                        <Badge variant="danger" size="sm">Missing</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-surface-500 text-xs">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={statusTone[c.status]} size="sm">{c.status.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setDetail(c)} className="rounded-lg p-1.5 text-surface-400 hover:text-brand-600 hover:bg-brand-50" title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                        {c.status !== 'published' && c.status !== 'approved' && (
                          <Button size="sm" variant="cta" onClick={() => applyStatus(c.id, 'approved')}>
                            <CheckCircle2 className="h-4 w-4" /> Approve
                          </Button>
                        )}
                        {c.status !== 'rejected' && (
                          <Button size="sm" variant="danger" onClick={() => applyStatus(c.id, 'rejected')}>
                            <XCircle className="h-4 w-4" /> Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-16 text-center">
                    <Inbox className="h-10 w-10 text-surface-300 mx-auto mb-3" />
                    <p className="text-surface-500 font-medium">No contributions found</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {detail && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-surface-900 mb-4">Contribution details</h3>
            <div className="space-y-3 text-sm">
              <DetailRow label="Title" value={detail.resourceTitle} />
              <DetailRow label="Contributor" value={`${detail.contributorName}${detail.contributorEmail ? ` (${detail.contributorEmail})` : ''}`} />
              <DetailRow label="Type" value={detail.resourceType} />
              <DetailRow label="Language" value={detail.language} />
              <DetailRow label="Exam" value={[detail.examCategory, detail.examName, detail.stageOrSemester].filter(Boolean).join(' · ') || '—'} />
              <DetailRow label="Subject / Unit / Topic" value={[detail.subjectName, detail.unitChapter, detail.topicName].filter(Boolean).join(' · ') || '—'} />
              <DetailRow label="File" value={detail.fileName || '—'} />
              <DetailRow label="Description" value={detail.description || '—'} />
              <DetailRow label="Source attribution" value={detail.sourceAttribution || '—'} />
              <DetailRow label="Copyright declared" value={detail.copyrightDeclaration ? 'Yes' : 'No'} />
              <DetailRow label="Submitted" value={formatDate(detail.createdAt)} />
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDetail(null)}>Close</Button>
              <Button variant="cta" onClick={() => { applyStatus(detail.id, 'approved'); setDetail(null); }}><CheckCircle2 className="h-4 w-4" /> Approve</Button>
              <Button variant="danger" onClick={() => { applyStatus(detail.id, 'rejected'); setDetail(null); }}><XCircle className="h-4 w-4" /> Reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{label}</p>
      <p className="text-surface-700">{value}</p>
    </div>
  );
}
