'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Repeat, Plus, Trash2, ArrowUp, ArrowDown, Play, Pause, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getLibrary, saveRevisionCampaign, deleteRevisionCampaign } from '@/lib/notesStore';
import type { RevisionCampaign } from '@/types/notes';
import { formatDate } from '@/lib/utils';

export default function AdminRevisionPage() {
  const data = getLibrary();
  const [campaigns, setCampaigns] = useState(() => [...data.revisionCampaigns].sort((a, b) => a.sortOrder - b.sortOrder));
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', examId: '', subjectId: '', status: 'active' as RevisionCampaign['status'] });
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);

  const refresh = () => setCampaigns([...getLibrary().revisionCampaigns].sort((a, b) => a.sortOrder - b.sortOrder));

  const reset = () => {
    setForm({ title: '', description: '', examId: '', subjectId: '', status: 'active' });
    setSelectedResourceIds([]);
    setEditId(null);
    setEditorOpen(false);
  };

  const openNew = () => { reset(); setEditorOpen(true); };

  const openEdit = (c: RevisionCampaign) => {
    setForm({ title: c.title, description: c.description || '', examId: c.examId || '', subjectId: c.subjectId || '', status: c.status });
    setSelectedResourceIds(c.items.map(i => i.resourceId));
    setEditId(c.id);
    setEditorOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const campaign: RevisionCampaign = {
      id: editId || `rc-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      examId: form.examId || undefined,
      examCategoryId: undefined,
      subjectId: form.subjectId || undefined,
      items: selectedResourceIds.map((rid, i) => ({ id: `rc-i-${rid}-${i}`, resourceId: rid, order: i + 1, estimatedMinutes: 30 })),
      status: form.status,
      sortOrder: 1,
      createdAt: editId ? (data.revisionCampaigns.find(c => c.id === editId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveRevisionCampaign(campaign);
    refresh();
    reset();
  };

  const handleDelete = (id: string) => {
    deleteRevisionCampaign(id);
    refresh();
  };

  const toggleStatus = (c: RevisionCampaign) => {
    saveRevisionCampaign({ ...c, status: c.status === 'active' ? 'archived' : 'active' });
    refresh();
  };

  const toggleResource = (id: string) => {
    setSelectedResourceIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const move = (idx: number, dir: -1 | 1) => {
    setSelectedResourceIds(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  // ─── Editor ─────────────────────────────────────────────────────────
  if (editorOpen) {
    const published = data.resources.filter(r => r.isPublished && r.status === 'published');
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-surface-900 text-sm">Campaign details</h3>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-base" placeholder="e.g. OSSC Prelims — 5 day crash plan" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="input-base" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Exam</label>
                  <select value={form.examId} onChange={e => setForm({ ...form, examId: e.target.value })} className="input-base">
                    <option value="">None</option>
                    {data.exams.map(e => <option key={e.id} value={e.id}>{e.shortName || e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Subject</label>
                  <select value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })} className="input-base">
                    <option value="">None</option>
                    {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as RevisionCampaign['status'] })} className="input-base">
                  {['draft', 'active', 'completed', 'archived'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 font-bold text-surface-900 text-sm">Add resources to plan</h3>
              <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {published.map(r => (
                  <label key={r.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${selectedResourceIds.includes(r.id) ? 'border-brand-400 bg-brand-50' : 'border-surface-200 hover:border-surface-300'}`}>
                    <input type="checkbox" checked={selectedResourceIds.includes(r.id)} onChange={() => toggleResource(r.id)} className="h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
                    <span className="min-w-0 flex-1 truncate font-medium text-surface-700">{r.title}</span>
                    <span className="text-xs text-surface-400">{r.pageCount}p</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 font-bold text-surface-900 text-sm">Plan order ({selectedResourceIds.length} items)</h3>
              {selectedResourceIds.length === 0 ? (
                <p className="py-6 text-center text-sm text-surface-400">Select resources from the list to build your plan.</p>
              ) : (
                <div className="space-y-2">
                  {selectedResourceIds.map((rid, i) => {
                    const res = data.resources.find(r => r.id === rid);
                    return (
                      <div key={rid} className="flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 py-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-surface-700">{res?.title || '—'}</span>
                        <button onClick={() => move(i, -1)} className="p-1 text-surface-400 hover:text-brand-600"><ArrowUp className="h-4 w-4" /></button>
                        <button onClick={() => move(i, 1)} className="p-1 text-surface-400 hover:text-brand-600"><ArrowDown className="h-4 w-4" /></button>
                        <button onClick={() => toggleResource(rid)} className="p-1 text-surface-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={reset}>Cancel</Button>
                <Button onClick={handleSave}><Play className="h-4 w-4" /> {editId ? 'Update Campaign' : 'Save Campaign'}</Button>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-5 text-sm text-brand-800">
            <p className="font-bold">How revision mode works</p>
            <p className="mt-1 text-brand-700/80">The active campaign powers the "Revision Mode" section on the public library. Students follow the ordered plan and their progress is tracked on each resource.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── List view ──────────────────────────────────────────────────────
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-surface-500">{campaigns.filter(c => c.status === 'active').length} active campaign(s)</p>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New Campaign</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {campaigns.map(c => {
          const exam = c.examId ? data.exams.find(e => e.id === c.examId) : undefined;
          const totalMin = c.items.reduce((s, i) => s + (i.estimatedMinutes || 0), 0);
          return (
            <Card key={c.id} className="h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                    <Repeat className="h-5 w-5 text-brand-600" />
                  </div>
                  <Badge variant={c.status === 'active' ? 'success' : c.status === 'completed' ? 'info' : 'default'} size="sm">{c.status}</Badge>
                </div>
                <h3 className="mt-3 font-display font-bold text-surface-900">{c.title}</h3>
                {c.description && <p className="mt-1 line-clamp-2 text-sm text-surface-500">{c.description}</p>}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {exam && <span className="rounded-lg bg-brand-50 px-2 py-1 font-medium text-brand-700">{exam.shortName || exam.name}</span>}
                  <span className="flex items-center gap-1 rounded-lg bg-surface-100 px-2 py-1 font-medium text-surface-600"><BookOpen className="h-3 w-3" /> {c.items.length} resources</span>
                  <span className="flex items-center gap-1 rounded-lg bg-surface-100 px-2 py-1 font-medium text-surface-600"><Clock className="h-3 w-3" /> {totalMin} min</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-3">
                  <span className="text-xs text-surface-400">Updated {formatDate(c.updatedAt)}</span>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}>Edit</Button>
                    <Button size="sm" variant={c.status === 'active' ? 'ghost' : 'cta'} onClick={() => toggleStatus(c)}>
                      {c.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {campaigns.length === 0 && (
          <div className="lg:col-span-2 rounded-2xl border border-dashed border-surface-200 py-16 text-center">
            <Repeat className="mx-auto mb-3 h-10 w-10 text-surface-300" />
            <p className="text-surface-500 font-medium">No revision campaigns yet</p>
            <Button size="sm" className="mt-3" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Create one</Button>
          </div>
        )}
      </div>
    </div>
  );
}
