'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BulkImport from '@/components/admin/BulkImport';
import { Plus, Edit2, Trash2, Search, BrainCircuit, Clock, Target, BookOpen, Users, Loader2, Upload } from 'lucide-react';
import { getStagesForExam, examStageMap } from '@/lib/examStages';

const defaultTests = [
  { id: '1', title: 'OSSC CGL Prelims Full Mock 1', slug: 'ossc-cgl-prelims-full-mock-1', description: '', examId: 'ossc', stage: 'Prelims', test_type: 'full-mock', duration: 120, totalMarks: 200, question_count: 100, difficulty: 'medium', isFree: true, negativeMark: null, attempt_count: 1245, position: 1, isActive: true },
  { id: '2', title: 'OSSC CGL Prelims Full Mock 2', slug: 'ossc-cgl-prelims-full-mock-2', description: '', examId: 'ossc', stage: 'Prelims', test_type: 'full-mock', duration: 120, totalMarks: 200, question_count: 100, difficulty: 'hard', isFree: true, negativeMark: 0.25, attempt_count: 987, position: 2, isActive: true },
  { id: '3', title: 'OSSC CGL Mains Full Mock 1', slug: 'ossc-cgl-mains-full-mock-1', description: '', examId: 'ossc', stage: 'Mains', test_type: 'full-mock', duration: 180, totalMarks: 300, question_count: 120, difficulty: 'hard', isFree: false, negativeMark: null, attempt_count: 654, position: 1, isActive: true },
  { id: '11', title: 'OSSSC Prelims Full Mock 1', slug: 'osssc-prelims-full-mock-1', description: '', examId: 'osssc', stage: 'Prelims', test_type: 'full-mock', duration: 120, totalMarks: 200, question_count: 100, difficulty: 'medium', isFree: true, negativeMark: 0.25, attempt_count: 876, position: 1, isActive: true },
  { id: '14', title: 'OPSC Prelims GS Full Mock 1', slug: 'opsc-prelims-gs-mock-1', description: '', examId: 'opsc', stage: 'Prelims', test_type: 'full-mock', duration: 120, totalMarks: 200, question_count: 100, difficulty: 'hard', isFree: false, negativeMark: 0.33, attempt_count: 1234, position: 1, isActive: true },
  { id: '19', title: 'Odisha Police SI Prelims Mock', slug: 'odisha-police-si-prelims-mock', description: '', examId: 'odisha-police', stage: 'Prelims', test_type: 'full-mock', duration: 90, totalMarks: 150, question_count: 100, difficulty: 'medium', isFree: true, negativeMark: 0.25, attempt_count: 3100, position: 1, isActive: true },
  { id: '17', title: 'SSB Odisha Prelims Mock', slug: 'ssb-odisha-prelims-mock', description: '', examId: 'ssb', stage: 'Prelims', test_type: 'full-mock', duration: 120, totalMarks: 150, question_count: 75, difficulty: 'medium', isFree: true, negativeMark: 0.25, attempt_count: 2345, position: 1, isActive: true },
  { id: '22', title: 'Teaching Aptitude Mock', slug: 'teaching-aptitude-mock', description: '', examId: 'odisha-teaching', stage: 'Prelims', test_type: 'full-mock', duration: 90, totalMarks: 100, question_count: 50, difficulty: 'medium', isFree: true, negativeMark: null, attempt_count: 1200, position: 1, isActive: true },
  { id: '23', title: 'Utkal University PG Entrance Mock', slug: 'utkal-university-pg-mock', description: '', examId: 'odisha-universities', stage: 'Prelims', test_type: 'full-mock', duration: 120, totalMarks: 150, question_count: 75, difficulty: 'hard', isFree: false, negativeMark: 0.25, attempt_count: 456, position: 1, isActive: true },
  { id: '26', title: 'CTET Odisha Mock', slug: 'ctet-odisha-mock', description: '', examId: 'other', stage: 'Prelims', test_type: 'full-mock', duration: 150, totalMarks: 150, question_count: 90, difficulty: 'medium', isFree: true, negativeMark: null, attempt_count: 2100, position: 1, isActive: true },
];

const examOptions = [
  { id: 'ossc', name: 'OSSC' }, { id: 'osssc', name: 'OSSSC' }, { id: 'opsc', name: 'OPSC' },
  { id: 'ssb', name: 'SSB Odisha' }, { id: 'odisha-police', name: 'Odisha Police' },
  { id: 'odisha-teaching', name: 'Odisha Teaching' }, { id: 'odisha-universities', name: 'Odisha Universities' },
  { id: 'other', name: 'Other Competitive' },
];

const getStageOptions = (examId: string) => getStagesForExam(examId);
const typeOptions = [
  { value: 'full-mock', label: 'Full Mock Test' },
  { value: 'sectional', label: 'Sectional Test' },
  { value: 'topic-wise', label: 'Topic-wise Test' },
  { value: 'pyq-test', label: 'PYQ Test' },
  { value: 'daily-challenge', label: 'Daily Challenge' },
];
const difficultyOptions = ['easy', 'medium', 'hard'];

const initialForm = {
  title: '', slug: '', description: '', examId: 'ossc', stage: 'Prelims',
  test_type: 'full-mock', duration: 60, totalMarks: 100, question_count: 25,
  difficulty: 'medium', isFree: true, negativeMark: '', position: 1, isActive: true,
};

export default function AdminTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [filterExam, setFilterExam] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterType, setFilterType] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('admin_tests');
    if (stored) { setTests(JSON.parse(stored)); setLoading(false); return; }
    setTests(defaultTests);
    localStorage.setItem('admin_tests', JSON.stringify(defaultTests));
    setLoading(false);
  }, []);

  const persist = (data: any[]) => {
    setTests(data);
    localStorage.setItem('admin_tests', JSON.stringify(data));
  };

  const resetForm = () => { setForm(initialForm); setEditId(null); setShowForm(false); };

  const handleEdit = (t: any) => {
    setForm({
      title: t.title, slug: t.slug, description: t.description || '', examId: t.examId,
      stage: t.stage, test_type: t.test_type, duration: t.duration, totalMarks: t.totalMarks,
      question_count: t.question_count, difficulty: t.difficulty, isFree: t.isFree,
      negativeMark: t.negativeMark !== null && t.negativeMark !== undefined ? String(t.negativeMark) : '',
      position: t.position || 1, isActive: t.isActive !== false,
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const slug = form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const entry = {
      title: form.title, slug, description: form.description, examId: form.examId,
      stage: form.stage, test_type: form.test_type, duration: Number(form.duration),
      totalMarks: Number(form.totalMarks), question_count: Number(form.question_count),
      difficulty: form.difficulty, isFree: form.isFree,
      negativeMark: form.negativeMark ? Number(form.negativeMark) : null,
      position: Number(form.position), isActive: form.isActive, attempt_count: 0,
    };

    if (editId) {
      persist(tests.map(t => t.id === editId ? { ...t, ...entry } : t));
    } else {
      const id = Date.now().toString();
      persist([{ id, ...entry, attempt_count: 0 }, ...tests]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    persist(tests.filter(t => t.id !== id));
    setConfirmDelete(null);
  };

  const handleBulkImport = (records: Record<string, string>[]) => {
    const imported = records.map((r, i) => ({
      id: `bulk-${Date.now()}-${i}`,
      title: r.title || r.Title || '',
      slug: (r.slug || r.Slug || (r.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')),
      description: r.description || r.Description || '',
      examId: r.examId || r.Exam || 'ossc',
      stage: r.stage || r.Stage || 'Prelims',
      test_type: r.test_type || r.Type || 'full-mock',
      duration: Number(r.duration || r.Duration || 60),
      totalMarks: Number(r.totalMarks || r['Total Marks'] || 100),
      question_count: Number(r.question_count || r.Questions || 25),
      difficulty: r.difficulty || r.Difficulty || 'medium',
      isFree: (r.isFree || r['Is Free'] || 'true').toLowerCase() === 'true',
      negativeMark: r.negativeMark ? Number(r.negativeMark) : null,
      position: 1, isActive: true, attempt_count: 0,
    }));
    persist([...imported, ...tests]);
  };

  const filtered = tests.filter(t => {
    const mSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const mExam = !filterExam || t.examId === filterExam;
    const mStage = !filterStage || t.stage === filterStage;
    const mType = !filterType || t.test_type === filterType;
    return mSearch && mExam && mStage && mType;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Tests Management</h1>
          <p className="text-sm text-surface-500 mt-0.5">Create and manage mock tests, sectionals, and PYQ tests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setShowBulk(!showBulk); if (showBulk) setShowBulk(false); }}>
            <Upload className="h-4 w-4 mr-1" /> Bulk Import
          </Button>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Create Test
          </Button>
        </div>
      </div>

      {showBulk && (
        <BulkImport
          columns={[
            { key: 'title', label: 'Title', required: true },
            { key: 'examId', label: 'Exam ID', default: 'ossc' },
            { key: 'stage', label: 'Stage', default: 'Prelims' },
            { key: 'test_type', label: 'Test Type', default: 'full-mock' },
            { key: 'duration', label: 'Duration (min)', default: '60' },
            { key: 'totalMarks', label: 'Total Marks', default: '100' },
            { key: 'question_count', label: 'Questions', default: '25' },
            { key: 'difficulty', label: 'Difficulty', default: 'medium' },
            { key: 'isFree', label: 'Is Free (true/false)', default: 'true' },
          ]}
          templateFilename="test-import-template.csv"
          templateRows={[['OSSC Prelims Mock 3', 'ossc', 'Prelims', 'full-mock', '120', '200', '100', 'medium', 'true']]}
          onImport={handleBulkImport}
          onClose={() => setShowBulk(false)}
        />
      )}

      {showForm && (
        <Card className="mb-6 border-brand-200">
          <CardContent className="p-5 space-y-4">
            <h2 className="font-bold text-surface-900">{editId ? 'Edit Test' : 'Create New Test'}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-surface-500 mb-1">Title *</label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: editId ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} placeholder="e.g. OSSC CGL Prelims Full Mock 3" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Slug</label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Exam Series</label>
                <select value={form.examId} onChange={e => {
                  const next = e.target.value;
                  const stages = getStageOptions(next);
                  setForm({ ...form, examId: next, stage: stages.includes(form.stage) ? form.stage : stages[0] });
                }} className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  {examOptions.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Stage</label>
                <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })} className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  {getStageOptions(form.examId).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Test Type</label>
                <select value={form.test_type} onChange={e => setForm({ ...form, test_type: e.target.value })} className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  {typeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  {difficultyOptions.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Duration (minutes)</label>
                <Input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} min={1} />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Total Marks</label>
                <Input type="number" value={form.totalMarks} onChange={e => setForm({ ...form, totalMarks: Number(e.target.value) })} min={1} />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Question Count</label>
                <Input type="number" value={form.question_count} onChange={e => setForm({ ...form, question_count: Number(e.target.value) })} min={1} />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Position</label>
                <Input type="number" value={form.position} onChange={e => setForm({ ...form, position: Number(e.target.value) })} min={1} />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Negative Mark (leave blank for none)</label>
                <Input type="number" step="0.01" value={form.negativeMark} onChange={e => setForm({ ...form, negativeMark: e.target.value })} placeholder="e.g. 0.25" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-surface-500 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 placeholder-surface-400" placeholder="Optional description..." />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isFree" checked={form.isFree} onChange={e => setForm({ ...form, isFree: e.target.checked })} className="rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
                  <label htmlFor="isFree" className="text-sm text-surface-600">Free Test</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
                  <label htmlFor="isActive" className="text-sm text-surface-600">Active</label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSubmit}>{editId ? 'Update' : 'Create'} Test</Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tests..." className="w-full rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 placeholder-surface-400" />
        </div>
        <select value={filterExam} onChange={e => setFilterExam(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
          <option value="">All Exams</option>
          {examOptions.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
          <option value="">All Stages</option>
          {(filterExam ? getStageOptions(filterExam) : Array.from(new Set(Object.values(examStageMap).flat()))).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
          <option value="">All Types</option>
          {typeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <span className="text-sm text-surface-400">{filtered.length} tests</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-brand-500 animate-spin" /><span className="ml-2 text-sm text-surface-400">Loading...</span></div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Test</th>
                    <th className="px-5 py-3">Exam</th>
                    <th className="px-5 py-3">Stage</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3 text-center">Duration</th>
                    <th className="px-5 py-3 text-center">Marks</th>
                    <th className="px-5 py-3 text-center">Qns</th>
                    <th className="px-5 py-3 text-center">Free</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-ocean-50 flex items-center justify-center text-sm shrink-0">
                            <BrainCircuit className="h-4 w-4 text-ocean-600" />
                          </div>
                          <div className="max-w-[240px]">
                            <p className="font-medium text-surface-900 truncate">{t.title}</p>
                            {t.attempt_count > 0 && <p className="text-xs text-surface-400 flex items-center gap-1 mt-0.5"><Users className="h-3 w-3" />{t.attempt_count} attempts</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-surface-600 text-xs font-medium">{examOptions.find(e => e.id === t.examId)?.name || t.examId}</td>
                      <td className="px-5 py-4"><Badge variant={t.stage === 'Prelims' ? 'info' : 'warning'} size="sm">{t.stage}</Badge></td>
                      <td className="px-5 py-4 text-xs text-surface-500">{typeOptions.find(tp => tp.value === t.test_type)?.label || t.test_type}</td>
                      <td className="px-5 py-4 text-center text-surface-600"><span className="flex items-center justify-center gap-1 text-xs"><Clock className="h-3 w-3" />{t.duration}m</span></td>
                      <td className="px-5 py-4 text-center text-surface-600"><span className="flex items-center justify-center gap-1 text-xs"><Target className="h-3 w-3" />{t.totalMarks}</span></td>
                      <td className="px-5 py-4 text-center text-surface-600"><span className="flex items-center justify-center gap-1 text-xs"><BookOpen className="h-3 w-3" />{t.question_count}</span></td>
                      <td className="px-5 py-4 text-center"><Badge variant={t.isFree ? 'success' : 'premium'} size="sm">{t.isFree ? 'Free' : 'Paid'}</Badge></td>
                      <td className="px-5 py-4 text-center">
                        {t.isActive ? <span className="inline-flex items-center gap-1 text-xs text-mint-600"><span className="h-1.5 w-1.5 rounded-full bg-mint-500" /> Active</span> : <span className="inline-flex items-center gap-1 text-xs text-surface-400"><span className="h-1.5 w-1.5 rounded-full bg-surface-300" /> Inactive</span>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(t)} className="p-1.5 text-surface-400 hover:text-amber-600 transition-colors rounded-lg hover:bg-amber-50"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => setConfirmDelete(t.id)} className="p-1.5 text-surface-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12"><BrainCircuit className="h-10 w-10 text-surface-300 mx-auto mb-3" /><p className="text-surface-500 font-medium">No tests found</p><p className="text-xs text-surface-400 mt-1">Try adjusting your filters or create a new test.</p></div>
            )}
          </CardContent>
        </Card>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-surface-900 mb-2">Delete Test?</h3>
            <p className="text-sm text-surface-500 mb-5">Are you sure you want to delete &ldquo;{tests.find(t => t.id === confirmDelete)?.title}&rdquo;? This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleDelete(confirmDelete)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
