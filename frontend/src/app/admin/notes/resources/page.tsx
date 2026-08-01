'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit2, Trash2, Eye, FileText, ArrowLeft, CheckCircle2, Loader2,
  Globe, Tag, Calendar, ShieldCheck, Save, ListChecks, AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { getAllResources, saveResource, deleteResource, getLibrary, getResourceTypes, getLanguages, getFormats, slugify } from '@/lib/notesStore';
import type { Resource, ResourceStatus, AccessType, Visibility } from '@/types/notes';
import { typeLabel, statusBadge } from '@/lib/resourceStyles';
import { formatDate } from '@/lib/utils';

const emptyForm = {
  title: '',
  shortDesc: '',
  longDesc: '',
  type: 'NOTES',
  language: 'en',
  format: 'PDF',
  pageCount: 0,
  fileSize: 0,
  visibility: 'public',
  accessType: 'free',
  downloadAllowed: true,
  featured: false,
  isVerified: false,
  status: 'draft' as ResourceStatus,
  isPublished: false,
  tags: '',
  contributorName: '',
  sourceAttribution: '',
  permissionStatus: 'unknown',
  examId: '',
  stageId: '',
  subjectId: '',
  unitId: '',
  topicId: '',
  institutionId: '',
  courseId: '',
  semesterId: '',
};

export default function AdminResourcesPage() {
  const data = getLibrary();
  const [resources, setResources] = useState(() => getAllResources());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [publish, setPublish] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Resource | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const refresh = () => setResources(getAllResources());

  const resetForm = () => {
    setForm(emptyForm);
    setPublish(false);
    setEditId(null);
    setEditorOpen(false);
    setSaved(false);
    setErrors([]);
  };

  const openNew = () => { resetForm(); setEditorOpen(true); };

  const openEdit = (r: Resource) => {
    setForm({
      title: r.title,
      shortDesc: r.shortDesc || '',
      longDesc: r.longDesc || '',
      type: r.type,
      language: r.language,
      format: r.format,
      pageCount: r.pageCount,
      fileSize: r.fileSize,
      visibility: r.visibility,
      accessType: r.accessType,
      downloadAllowed: r.downloadAllowed,
      featured: r.featured,
      isVerified: r.isVerified,
      status: r.status,
      isPublished: r.isPublished,
      tags: r.tags.join(', '),
      contributorName: r.contributorName || '',
      sourceAttribution: r.sourceAttribution || '',
      permissionStatus: r.permissionStatus,
      examId: r.examId || '',
      stageId: r.stageId || '',
      subjectId: r.subjectId || '',
      unitId: r.unitId || '',
      topicId: r.topicId || '',
      institutionId: r.institutionId || '',
      courseId: r.courseId || '',
      semesterId: r.semesterId || '',
    });
    setPublish(r.isPublished);
    setEditId(r.id);
    setEditorOpen(true);
    setErrors([]);
  };

  const checklist = useMemo(() => {
    const items: { label: string; ok: boolean }[] = [
      { label: 'Title provided', ok: !!form.title.trim() },
      { label: 'Short description', ok: !!form.shortDesc.trim() },
      { label: 'Long description', ok: !!form.longDesc.trim() },
      { label: 'Page count set', ok: form.pageCount > 0 },
      { label: 'Taxonomy linked (exam or academic)', ok: !!(form.examId || form.subjectId || form.institutionId || form.courseId) },
      { label: 'Contributor / attribution', ok: !!(form.contributorName.trim() || form.sourceAttribution.trim()) },
      { label: 'Permission status resolved', ok: form.permissionStatus !== 'unknown' },
      { label: 'Tags provided', ok: !!form.tags.trim() },
    ];
    return items;
  }, [form]);

  const checklistPass = checklist.every(c => c.ok);

  const handleSave = () => {
    if (!form.title.trim()) { setErrors(['Title is required.']); return; }
    if (publish && !checklistPass) { setErrors(['Complete the publish checklist before publishing.']); return; }
    setSaving(true);
    const now = new Date().toISOString();
    if (editId) {
      const existing = resources.find(r => r.id === editId);
      const res: Resource = {
        ...existing!,
        title: form.title.trim(),
        shortDesc: form.shortDesc.trim() || undefined,
        longDesc: form.longDesc.trim() || undefined,
        type: form.type as Resource['type'],
        language: form.language as Resource['language'],
        format: form.format as Resource['format'],
        pageCount: Number(form.pageCount) || 0,
        fileSize: Number(form.fileSize) || 0,
        visibility: form.visibility as Visibility,
        accessType: form.accessType as AccessType,
        downloadAllowed: form.downloadAllowed,
        featured: form.featured,
        isVerified: form.isVerified,
        status: form.status,
        isPublished: publish,
        publishedAt: publish ? (existing?.publishedAt || now) : existing?.publishedAt,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        contributorName: form.contributorName.trim() || undefined,
        sourceAttribution: form.sourceAttribution.trim() || undefined,
        permissionStatus: form.permissionStatus as Resource['permissionStatus'],
        examId: form.examId || undefined,
        stageId: form.stageId || undefined,
        subjectId: form.subjectId || undefined,
        unitId: form.unitId || undefined,
        topicId: form.topicId || undefined,
        institutionId: form.institutionId || undefined,
        courseId: form.courseId || undefined,
        semesterId: form.semesterId || undefined,
        updatedAt: now,
      };
      saveResource(res);
    } else {
      const res: Resource = {
        id: `res-${Date.now()}`,
        title: form.title.trim(),
        slug: `${slugify(form.title)}-${Date.now()}`,
        shortDesc: form.shortDesc.trim() || undefined,
        longDesc: form.longDesc.trim() || undefined,
        type: form.type as Resource['type'],
        language: form.language as Resource['language'],
        format: form.format as Resource['format'],
        pageCount: Number(form.pageCount) || 0,
        fileSize: Number(form.fileSize) || 0,
        visibility: form.visibility as Visibility,
        accessType: form.accessType as AccessType,
        downloadAllowed: form.downloadAllowed,
        featured: form.featured,
        isVerified: form.isVerified,
        status: form.status,
        isPublished: publish,
        publishedAt: publish ? now : undefined,
        stats: { views: 0, downloads: 0, saves: 0, shares: 0 },
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        contributorName: form.contributorName.trim() || undefined,
        sourceAttribution: form.sourceAttribution.trim() || undefined,
        permissionStatus: form.permissionStatus as Resource['permissionStatus'],
        examId: form.examId || undefined,
        stageId: form.stageId || undefined,
        subjectId: form.subjectId || undefined,
        unitId: form.unitId || undefined,
        topicId: form.topicId || undefined,
        institutionId: form.institutionId || undefined,
        courseId: form.courseId || undefined,
        semesterId: form.semesterId || undefined,
        printAvailable: false,
        createdAt: now,
        updatedAt: now,
      };
      saveResource(res);
    }
    setTimeout(() => {
      setSaving(false);
      refresh();
      resetForm();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 400);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteResource(confirmDelete.id);
    refresh();
    setConfirmDelete(null);
  };

  const togglePublish = (r: Resource) => {
    saveResource({ ...r, isPublished: !r.isPublished, status: !r.isPublished ? 'published' : r.status, publishedAt: !r.isPublished ? (r.publishedAt || new Date().toISOString()) : r.publishedAt });
    refresh();
  };

  const filtered = resources.filter(r => {
    const q = search.toLowerCase().trim();
    const matchQ = !q || r.title.toLowerCase().includes(q) || r.tags.join(' ').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchQ && matchStatus;
  });

  // ─── Editor view ────────────────────────────────────────────────────
  if (editorOpen) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <button onClick={resetForm} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">{editId ? 'Edit Resource' : 'New Resource'}</h1>
            <p className="text-sm text-surface-500 mt-0.5">Publish checklist must pass before going live</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setPublish(v => !v)}>
              <Globe className="h-4 w-4 mr-1" /> {publish ? 'Save as Draft' : 'Publish'}
            </Button>
            <Button size="sm" disabled={saving} onClick={handleSave}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editId ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>

        {saved && (
          <div className="mb-6 rounded-xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm font-medium text-mint-700">
            {publish ? 'Resource published successfully!' : 'Resource saved as draft.'}
          </div>
        )}
        {errors.length > 0 && (
          <div className="mb-6 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm font-medium text-coral-700">
            {errors.map((e, i) => <p key={i}>{e}</p>)}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Title *</label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Resource title" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Short description</label>
                  <textarea value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} rows={2} placeholder="One-line summary shown on cards" className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">
                    <FileText className="h-3.5 w-3.5 inline mr-1" /> Long description (rich text)
                  </label>
                  <RichTextEditor value={form.longDesc} onChange={html => setForm({ ...form, longDesc: html })} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="font-bold text-surface-900 text-sm">File & content</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-base">
                      {getResourceTypes().map(t => <option key={t.id} value={t.slug.toUpperCase()}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Language</label>
                    <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className="input-base">
                      {getLanguages().map(l => <option key={l.id} value={l.code}>{l.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Format</label>
                    <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })} className="input-base">
                      {getFormats().map(f => <option key={f.id} value={f.slug.toUpperCase()}>{f.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Page count</label>
                    <Input type="number" value={form.pageCount} onChange={e => setForm({ ...form, pageCount: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">File size (bytes)</label>
                    <Input type="number" value={form.fileSize} onChange={e => setForm({ ...form, fileSize: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Tags (comma separated)</label>
                    <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="ossc, odisha-gk" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="font-bold text-surface-900 text-sm">Taxonomy links</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Exam</label>
                    <select value={form.examId} onChange={e => setForm({ ...form, examId: e.target.value })} className="input-base">
                      <option value="">None</option>
                      {data.exams.map(e => <option key={e.id} value={e.id}>{e.shortName || e.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Stage</label>
                    <select value={form.stageId} onChange={e => setForm({ ...form, stageId: e.target.value })} className="input-base">
                      <option value="">None</option>
                      {data.examStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Subject</label>
                    <select value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })} className="input-base">
                      <option value="">None</option>
                      {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Unit</label>
                    <select value={form.unitId} onChange={e => setForm({ ...form, unitId: e.target.value })} className="input-base">
                      <option value="">None</option>
                      {data.units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Topic</label>
                    <select value={form.topicId} onChange={e => setForm({ ...form, topicId: e.target.value })} className="input-base">
                      <option value="">None</option>
                      {data.topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Institution (academic)</label>
                    <select value={form.institutionId} onChange={e => setForm({ ...form, institutionId: e.target.value })} className="input-base">
                      <option value="">None</option>
                      {data.institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Course</label>
                    <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} className="input-base">
                      <option value="">None</option>
                      {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Semester</label>
                    <select value={form.semesterId} onChange={e => setForm({ ...form, semesterId: e.target.value })} className="input-base">
                      <option value="">None</option>
                      {data.semesters.map(s => <option key={s.id} value={s.id}>{s.displayName || s.name}</option>)}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-surface-900 text-sm">
                  <ListChecks className="h-4 w-4 text-brand-600" /> Publish checklist
                </h3>
                <div className="space-y-2">
                  {checklist.map((c, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm ${c.ok ? 'text-mint-700' : 'text-surface-500'}`}>
                      {c.ok ? <CheckCircle2 className="h-4 w-4 text-mint-500" /> : <AlertTriangle className="h-4 w-4 text-sunny-500" />}
                      {c.label}
                    </div>
                  ))}
                </div>
                <div className={`rounded-xl px-3 py-2.5 text-xs font-semibold ${checklistPass ? 'bg-mint-50 text-mint-700' : 'bg-sunny-50 text-sunny-700'}`}>
                  {checklistPass ? 'Ready to publish' : `${checklist.filter(c => !c.ok).length} item(s) remaining`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="font-bold text-surface-900 text-sm">Publication</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ResourceStatus })} className="input-base">
                      {['draft', 'submitted', 'under_review', 'published', 'needs_update', 'archived', 'rejected'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Visibility</label>
                    <select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value as Visibility })} className="input-base">
                      {['public', 'signed_in', 'restricted', 'premium_ready'].map(v => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Access</label>
                    <select value={form.accessType} onChange={e => setForm({ ...form, accessType: e.target.value as AccessType })} className="input-base">
                      {['free', 'restricted', 'premium'].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1.5">Permission</label>
                    <select value={form.permissionStatus} onChange={e => setForm({ ...form, permissionStatus: e.target.value })} className="input-base">
                      {['pending', 'granted', 'owned', 'unknown'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.downloadAllowed} onChange={e => setForm({ ...form, downloadAllowed: e.target.checked })} className="h-4 w-4 rounded border-surface-300 text-brand-500" />
                    <span className="text-sm text-surface-700">Allow download</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-surface-300 text-brand-500" />
                    <span className="text-sm text-surface-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isVerified} onChange={e => setForm({ ...form, isVerified: e.target.checked })} className="h-4 w-4 rounded border-surface-300 text-brand-500" />
                    <span className="flex items-center gap-1 text-sm text-surface-700"><ShieldCheck className="h-4 w-4 text-brand-600" /> Verified</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-surface-900 text-sm">
                  <Tag className="h-4 w-4 text-brand-600" /> Contributor
                </h3>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Contributor name</label>
                  <Input value={form.contributorName} onChange={e => setForm({ ...form, contributorName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Source attribution</label>
                  <Input value={form.sourceAttribution} onChange={e => setForm({ ...form, sourceAttribution: e.target.value })} />
                </div>
                <p className="text-xs text-surface-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {editId ? `Updated ${formatDate(new Date().toISOString())}` : 'Created now'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ─── List view ──────────────────────────────────────────────────────
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." className="w-72 rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
        </div>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <option value="all">All statuses</option>
            {['draft', 'submitted', 'under_review', 'published', 'needs_update', 'archived', 'rejected'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New Resource</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Resource</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Views</th>
                  <th className="px-5 py-3">Updated</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const b = statusBadge(r.status);
                  return (
                    <tr key={r.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                      <td className="px-5 py-3 max-w-md">
                        <p className="font-medium text-surface-900 truncate">{r.title}</p>
                        <p className="text-xs text-surface-400 truncate mt-0.5">{typeLabel(r.type)} · {r.language.toUpperCase()} · {r.format} · {r.pageCount}p</p>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="info" size="sm">{typeLabel(r.type)}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => togglePublish(r)} title="Toggle published">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.isPublished ? 'bg-mint-50 text-mint-700' : b.cls}`}>
                            {r.isPublished ? 'Published' : b.label}
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-3 text-surface-600">{r.stats.views}</td>
                      <td className="px-5 py-3 text-surface-500 text-xs">{formatDate(r.updatedAt)}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.isPublished && (
                            <Link href={`/notes/resource/${r.slug}`} target="_blank" className="p-1.5 text-surface-400 hover:text-brand-600 rounded-lg hover:bg-brand-50">
                              <Eye className="h-4 w-4" />
                            </Link>
                          )}
                          <button onClick={() => openEdit(r)} className="p-1.5 text-surface-400 hover:text-amber-600 rounded-lg hover:bg-amber-50">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => setConfirmDelete(r)} className="p-1.5 text-surface-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-16 text-center">
                    <FileText className="h-10 w-10 text-surface-300 mx-auto mb-3" />
                    <p className="text-surface-500 font-medium">No resources found</p>
                    <Button size="sm" className="mt-3" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New Resource</Button>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-surface-900 mb-2">Delete resource?</h3>
            <p className="text-sm text-surface-500 mb-5">"{confirmDelete.title}" will be permanently removed from the library.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
