'use client';
import { useMemo } from 'react';
import { BarChart3, Eye, Download, Bookmark, Share2, TrendingUp, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { getLibrary } from '@/lib/notesStore';
import { typeLabel } from '@/lib/resourceStyles';

export default function AdminAnalyticsPage() {
  const data = getLibrary();

  const published = useMemo(() => data.resources.filter(r => r.isPublished && r.status === 'published'), [data]);

  const totals = useMemo(() => published.reduce(
    (acc, r) => ({ views: acc.views + r.stats.views, downloads: acc.downloads + r.stats.downloads, saves: acc.saves + r.stats.saves, shares: acc.shares + r.stats.shares }),
    { views: 0, downloads: 0, saves: 0, shares: 0 }
  ), [published]);

  const topResources = useMemo(() => [...published].sort((a, b) => b.stats.views - a.stats.views).slice(0, 8), [published]);

  const byType = useMemo(() => {
    const m: Record<string, { count: number; views: number }> = {};
    published.forEach(r => {
      m[r.type] = m[r.type] || { count: 0, views: 0 };
      m[r.type].count++;
      m[r.type].views += r.stats.views;
    });
    return Object.entries(m).sort((a, b) => b[1].views - a[1].views);
  }, [published]);

  const byExam = useMemo(() => {
    const m: Record<string, { count: number; views: number }> = {};
    published.forEach(r => {
      const name = r.examId ? (data.exams.find(e => e.id === r.examId)?.shortName || 'Exam') : 'Academic';
      m[name] = m[name] || { count: 0, views: 0 };
      m[name].count++;
      m[name].views += r.stats.views;
    });
    return Object.entries(m).sort((a, b) => b[1].views - a[1].views);
  }, [published, data]);

  const byLanguage = useMemo(() => {
    const m: Record<string, number> = {};
    published.forEach(r => { m[r.language] = (m[r.language] || 0) + 1; });
    return m;
  }, [published]);

  const maxViews = Math.max(1, ...byType.map(([, v]) => v.views));
  const maxExam = Math.max(1, ...byExam.map(([, v]) => v.views));

  const statCards = [
    { label: 'Total Views', value: totals.views.toLocaleString(), icon: Eye, tone: 'bg-ocean-50 text-ocean-600' },
    { label: 'Total Downloads', value: totals.downloads.toLocaleString(), icon: Download, tone: 'bg-lavender-50 text-lavender-600' },
    { label: 'Total Saves', value: totals.saves.toLocaleString(), icon: Bookmark, tone: 'bg-accent-50 text-accent-600' },
    { label: 'Total Shares', value: totals.shares.toLocaleString(), icon: Share2, tone: 'bg-mint-50 text-mint-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(c => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${c.tone}`}><c.icon className="h-4.5 w-4.5" /></div>
              <p className="text-2xl font-bold text-surface-900">{c.value}</p>
              <p className="text-xs text-surface-400">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-surface-900">
              <BarChart3 className="h-4 w-4 text-brand-600" /> Engagement by resource type
            </h2>
            <div className="space-y-3">
              {byType.map(([type, v]) => (
                <div key={type}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-surface-700">{typeLabel(type)}</span>
                    <span className="text-xs text-surface-400">{v.count} resources · {v.views.toLocaleString()} views</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-surface-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-500" style={{ width: `${(v.views / maxViews) * 100}%` }} />
                  </div>
                </div>
              ))}
              {byType.length === 0 && <p className="py-6 text-center text-sm text-surface-400">No published resources yet.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-surface-900">
              <TrendingUp className="h-4 w-4 text-brand-600" /> Engagement by exam
            </h2>
            <div className="space-y-3">
              {byExam.map(([exam, v]) => (
                <div key={exam}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-surface-700">{exam}</span>
                    <span className="text-xs text-surface-400">{v.count} resources · {v.views.toLocaleString()} views</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-surface-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-lavender-500 to-ocean-500" style={{ width: `${(v.views / maxExam) * 100}%` }} />
                  </div>
                </div>
              ))}
              {byExam.length === 0 && <p className="py-6 text-center text-sm text-surface-400">No engagement data yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-surface-900">
              <Eye className="h-4 w-4 text-brand-600" /> Top resources by views
            </h2>
            <div className="space-y-2">
              {topResources.map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl bg-surface-50 px-3 py-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-surface-800">{r.title}</span>
                  <span className="shrink-0 text-xs text-surface-400">{r.stats.views.toLocaleString()} views</span>
                </div>
              ))}
              {topResources.length === 0 && <p className="py-6 text-center text-sm text-surface-400">No data yet.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-surface-900">
              <FileText className="h-4 w-4 text-brand-600" /> Languages
            </h2>
            <div className="space-y-2">
              {Object.entries(byLanguage).sort((a, b) => b[1] - a[1]).map(([lang, count]) => (
                <div key={lang} className="flex items-center justify-between rounded-xl bg-surface-50 px-3 py-2.5">
                  <span className="font-medium uppercase text-surface-700">{lang}</span>
                  <span className="text-sm font-bold text-surface-900">{count}</span>
                </div>
              ))}
              {Object.keys(byLanguage).length === 0 && <p className="py-6 text-center text-sm text-surface-400">No data yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
