'use client';
import { useState } from 'react';
import { Layout, Plus, ArrowUp, ArrowDown, Eye, EyeOff, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getLibrary, saveHomepageSection } from '@/lib/notesStore';
import type { HomepageSection, HomepageSectionSource } from '@/types/notes';

const sources: HomepageSectionSource[] = ['latest', 'recently_updated', 'most_viewed', 'most_downloaded', 'most_saved', 'featured', 'revision_mode', 'current_affairs', 'pyqs', 'important_questions', 'manual'];

const sourceLabels: Record<HomepageSectionSource, string> = {
  latest: 'Latest', recently_updated: 'Recently Updated', most_viewed: 'Most Viewed',
  most_downloaded: 'Most Downloaded', most_saved: 'Most Saved', featured: 'Featured',
  revision_mode: 'Revision Mode', current_affairs: 'Current Affairs', pyqs: 'PYQs',
  important_questions: 'Important Questions', manual: 'Manual Selection',
};

export default function AdminHomepagePage() {
  const data = getLibrary();
  const [sections, setSections] = useState(() => [...data.homepageSections].sort((a, b) => a.sortOrder - b.sortOrder));
  const [editing, setEditing] = useState<HomepageSection | null>(null);
  const [manualIds, setManualIds] = useState<string[]>([]);

  const refresh = () => setSections([...getLibrary().homepageSections].sort((a, b) => a.sortOrder - b.sortOrder));

  const openNew = () => {
    setEditing({
      id: `hs-${Date.now()}`,
      title: '',
      subtitle: '',
      source: 'latest',
      resourceIds: [],
      limit: 6,
      sortOrder: sections.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    setManualIds([]);
  };

  const openEdit = (s: HomepageSection) => {
    setEditing({ ...s });
    setManualIds(s.resourceIds || []);
  };

  const handleSave = () => {
    if (!editing || !editing.title.trim()) return;
    saveHomepageSection({ ...editing, title: editing.title.trim(), resourceIds: editing.source === 'manual' ? manualIds : undefined });
    refresh();
    setEditing(null);
  };

  const toggleActive = (s: HomepageSection) => {
    saveHomepageSection({ ...s, isActive: !s.isActive });
    refresh();
  };

  const move = (idx: number, dir: -1 | 1) => {
    const arr = [...sections];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    const reordered = arr.map((s, i) => ({ ...s, sortOrder: i + 1 }));
    reordered.forEach(s => saveHomepageSection(s));
    setSections(reordered);
  };

  const toggleManual = (id: string) => {
    setManualIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const published = data.resources.filter(r => r.isPublished && r.status === 'published');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-500">Sections appear in order on the public /notes page. Disabled sections are hidden.</p>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New Section</Button>
      </div>

      {editing && (
        <Card className="border-brand-200">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-surface-900">{editing.id.startsWith('hs-') && !data.homepageSections.find(s => s.id === editing.id) ? 'New section' : 'Edit section'}</h3>
              <Badge variant={editing.isActive ? 'success' : 'default'} size="sm">{editing.isActive ? 'Active' : 'Disabled'}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Title *</label>
                <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="input-base" placeholder="e.g. Freshly Published" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Subtitle</label>
                <input value={editing.subtitle || ''} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} className="input-base" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Source</label>
                <select value={editing.source} onChange={e => setEditing({ ...editing, source: e.target.value as HomepageSectionSource })} className="input-base">
                  {sources.map(s => <option key={s} value={s}>{sourceLabels[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Limit</label>
                <input type="number" value={editing.limit} onChange={e => setEditing({ ...editing, limit: Number(e.target.value) || 6 })} className="input-base" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.isActive} onChange={e => setEditing({ ...editing, isActive: e.target.checked })} className="h-4 w-4 rounded border-surface-300 text-brand-500" />
              <span className="text-sm text-surface-700">Active (visible on /notes)</span>
            </label>

            {editing.source === 'manual' && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-500">Select resources ({manualIds.length} selected)</label>
                <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-xl border border-surface-200 p-2">
                  {published.map(r => (
                    <label key={r.id} className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${manualIds.includes(r.id) ? 'bg-brand-50 text-brand-800' : 'hover:bg-surface-50'}`}>
                      <input type="checkbox" checked={manualIds.includes(r.id)} onChange={() => toggleManual(r.id)} className="h-4 w-4 rounded border-surface-300 text-brand-500" />
                      <span className="truncate">{r.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={handleSave}>Save Section</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Section</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Limit</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((s, i) => (
                  <tr key={s.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-surface-400 hover:text-brand-600 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                        <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="p-1 text-surface-400 hover:text-brand-600 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                        <span className="ml-1 text-surface-400">{s.sortOrder}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-surface-900">{s.title}</p>
                      {s.subtitle && <p className="text-xs text-surface-400">{s.subtitle}</p>}
                    </td>
                    <td className="px-5 py-3"><Badge variant="info" size="sm">{sourceLabels[s.source]}</Badge></td>
                    <td className="px-5 py-3 text-surface-600">{s.source === 'manual' ? (s.resourceIds?.length || 0) : s.limit}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleActive(s)}>
                        <Badge variant={s.isActive ? 'success' : 'default'} size="sm">{s.isActive ? 'Active' : 'Disabled'}</Badge>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-surface-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => toggleActive(s)} className="p-1.5 text-surface-400 hover:text-brand-600 rounded-lg hover:bg-brand-50">
                        {s.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
                {sections.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-16 text-center">
                    <Layout className="h-10 w-10 text-surface-300 mx-auto mb-3" />
                    <p className="text-surface-500 font-medium">No homepage sections yet</p>
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
