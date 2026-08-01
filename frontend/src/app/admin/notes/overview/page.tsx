'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import {
  FileText, Eye, Download, Inbox, ListChecks, Flag, TrendingUp,
  Repeat, ArrowRight, CheckCircle2, AlertTriangle, Bookmark,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getLibrary } from '@/lib/notesStore';
import { statusBadge } from '@/lib/resourceStyles';
import { formatDate } from '@/lib/utils';

export default function AdminNotesOverview() {
  const data = getLibrary();

  const stats = useMemo(() => {
    const published = data.resources.filter(r => r.isPublished && r.status === 'published');
    return {
      total: data.resources.length,
      published: published.length,
      drafts: data.resources.filter(r => r.status === 'draft' || r.status === 'needs_update').length,
      views: published.reduce((s, r) => s + r.stats.views, 0),
      downloads: published.reduce((s, r) => s + r.stats.downloads, 0),
      saves: published.reduce((s, r) => s + r.stats.saves, 0),
      contributionsPending: data.contributions.filter(c => c.status === 'submitted' || c.status === 'under_review').length,
      openRequests: data.requests.filter(r => r.status === 'open' || r.status === 'in_progress').length,
      openReports: data.reports.filter(r => r.status === 'open' || r.status === 'reviewing').length,
      activeCampaigns: data.revisionCampaigns.filter(c => c.status === 'active').length,
      activeHomepageSections: data.homepageSections.filter(s => s.isActive).length,
      examCategories: data.examCategories.filter(c => c.isActive).length,
      subjects: data.subjects.filter(s => s.isActive).length,
      topics: data.topics.length,
    };
  }, [data]);

  const statusBreakdown = useMemo(() => {
    const m: Record<string, number> = {};
    data.resources.forEach(r => { m[r.status] = (m[r.status] || 0) + 1; });
    return m;
  }, [data]);

  const cards = [
    { label: 'Total Resources', value: stats.total, icon: FileText, tone: 'bg-brand-50 text-brand-600' },
    { label: 'Published', value: stats.published, icon: CheckCircle2, tone: 'bg-mint-50 text-mint-600' },
    { label: 'Drafts / Needs Update', value: stats.drafts, icon: AlertTriangle, tone: 'bg-sunny-50 text-sunny-600' },
    { label: 'Total Views', value: stats.views.toLocaleString(), icon: Eye, tone: 'bg-ocean-50 text-ocean-600' },
    { label: 'Total Downloads', value: stats.downloads.toLocaleString(), icon: Download, tone: 'bg-lavender-50 text-lavender-600' },
    { label: 'Total Saves', value: stats.saves.toLocaleString(), icon: Bookmark, tone: 'bg-accent-50 text-accent-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(c => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${c.tone}`}>
                <c.icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-2xl font-bold text-surface-900">{c.value}</p>
              <p className="text-xs text-surface-400">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Status breakdown */}
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-surface-900">
              <TrendingUp className="h-4 w-4 text-brand-600" /> Resources by status
            </h2>
            <div className="space-y-2.5">
              {Object.entries(statusBreakdown).map(([status, count]) => {
                const b = statusBadge(status);
                return (
                  <div key={status} className="flex items-center justify-between rounded-xl bg-surface-50 px-3 py-2.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${b.cls}`}>{b.label}</span>
                    <span className="text-sm font-bold text-surface-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pending actions */}
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-surface-900">
              <Inbox className="h-4 w-4 text-brand-600" /> Pending actions
            </h2>
            <div className="space-y-3">
              <ActionLink href="/admin/notes/contributions" icon={Inbox} label="Contributions to review" count={stats.contributionsPending} tone="bg-sunny-50 text-sunny-600" />
              <ActionLink href="/admin/notes/requests" icon={ListChecks} label="Open resource requests" count={stats.openRequests} tone="bg-ocean-50 text-ocean-600" />
              <ActionLink href="/admin/notes/reports" icon={Flag} label="Open reports" count={stats.openReports} tone="bg-coral-50 text-coral-600" />
              <ActionLink href="/admin/notes/resources" icon={FileText} label="Unpublished resources" count={stats.drafts} tone="bg-lavender-50 text-lavender-600" />
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-surface-900">
              <Repeat className="h-4 w-4 text-brand-600" /> Library health
            </h2>
            <div className="space-y-3 text-sm">
              <HealthRow label="Active revision campaigns" value={stats.activeCampaigns} />
              <HealthRow label="Active homepage sections" value={stats.activeHomepageSections} />
              <HealthRow label="Exam categories" value={stats.examCategories} />
              <HealthRow label="Subjects" value={stats.subjects} />
              <HealthRow label="Topics" value={stats.topics} />
              <HealthRow label="Institutions (academic)" value={data.institutions.filter(i => i.isActive).length} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent contributions & requests */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-surface-900">Recent contributions</h2>
              <Link href="/admin/notes/contributions" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                Review all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {data.contributions.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-50 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-surface-900">{c.resourceTitle}</p>
                    <p className="text-xs text-surface-400">{c.contributorName} · {formatDate(c.createdAt)}</p>
                  </div>
                  <Badge variant={c.status === 'published' ? 'success' : c.status === 'rejected' ? 'danger' : 'warning'} size="sm">{c.status.replace(/_/g, ' ')}</Badge>
                </div>
              ))}
              {data.contributions.length === 0 && <p className="py-6 text-center text-sm text-surface-400">No contributions yet.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-surface-900">Top requests</h2>
              <Link href="/admin/notes/requests" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {data.requests.sort((a, b) => b.votes - a.votes).slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-50 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-surface-900">{r.title}</p>
                    <p className="text-xs text-surface-400">{r.examName || 'General'} · {r.subjectName || '—'}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="info" size="sm">{r.votes} votes</Badge>
                    <Badge variant={r.status === 'fulfilled' ? 'success' : r.status === 'open' ? 'default' : 'warning'} size="sm">{r.status.replace(/_/g, ' ')}</Badge>
                  </div>
                </div>
              ))}
              {data.requests.length === 0 && <p className="py-6 text-center text-sm text-surface-400">No requests yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActionLink({ href, icon: Icon, label, count, tone }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; count: number; tone: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl border border-surface-200 px-3 py-2.5 transition-all hover:border-brand-300 hover:bg-brand-50/40">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="flex-1 text-sm font-medium text-surface-700">{label}</span>
      {count > 0 ? (
        <span className="rounded-full bg-coral-50 px-2.5 py-0.5 text-xs font-bold text-coral-600">{count}</span>
      ) : (
        <span className="text-xs font-semibold text-mint-600">Clear</span>
      )}
    </Link>
  );
}

function HealthRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-surface-500">{label}</span>
      <span className="rounded-lg bg-surface-100 px-2.5 py-0.5 text-sm font-bold text-surface-800">{value}</span>
    </div>
  );
}
