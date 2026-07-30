'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Edit2, Trash2, Search, BookOpen, BarChart3, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const defaultSeries = [
  { id: 'ossc', name: 'OSSC', fullName: 'Odisha Staff Selection Commission', slug: 'ossc', description: 'OSSC conducts various recruitment exams for Group B and Group C posts.', icon: 'Building2', isActive: true, testCount: 10, freeCount: 7 },
  { id: 'osssc', name: 'OSSSC', fullName: 'Odisha Sub-ordinate Staff Selection Commission', slug: 'osssc', description: 'OSSSC conducts recruitment for various subordinate posts.', icon: 'Users', isActive: true, testCount: 3, freeCount: 2 },
  { id: 'opsc', name: 'OPSC', fullName: 'Odisha Public Service Commission', slug: 'opsc', description: 'OPSC conducts civil services and other gazetted posts exams.', icon: 'Shield', isActive: true, testCount: 3, freeCount: 1 },
  { id: 'ssb', name: 'SSB Odisha', fullName: 'Odisha School Education & Teacher Eligibility Boards', slug: 'ssb', description: 'SSB Odisha manages teacher recruitment.', icon: 'GraduationCap', isActive: true, testCount: 2, freeCount: 2 },
  { id: 'odisha-police', name: 'Odisha Police', fullName: 'Odisha Police Recruitment', slug: 'odisha-police', description: 'Police constable, SI and other departmental exams.', icon: 'Shield', isActive: true, testCount: 3, freeCount: 3 },
  { id: 'odisha-teaching', name: 'Odisha Teaching', fullName: 'Odisha Teaching Recruitment', slug: 'odisha-teaching', description: 'Teaching recruitment exams across Odisha.', icon: 'BookOpen', isActive: true, testCount: 1, freeCount: 1 },
  { id: 'odisha-universities', name: 'Odisha Universities', fullName: 'Odisha University Entrance Exams', slug: 'odisha-universities', description: 'University entrance exams in Odisha.', icon: 'University', isActive: true, testCount: 2, freeCount: 1 },
  { id: 'other', name: 'Other Competitive', fullName: 'Other Competitive Exams in Odisha', slug: 'other', description: 'Other competitive exams relevant to Odisha.', icon: 'Award', isActive: true, testCount: 2, freeCount: 1 },
];

const iconOptions = ['Building2', 'Users', 'Shield', 'GraduationCap', 'BookOpen', 'University', 'Award', 'Target', 'BrainCircuit', 'BarChart3'];

const initialForm = { name: '', fullName: '', slug: '', description: '', icon: 'BookOpen', isActive: true };

export default function AdminTestSeriesPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('admin_test_series');
    if (stored) { setSeries(JSON.parse(stored)); setLoading(false); return; }
    setSeries(defaultSeries);
    localStorage.setItem('admin_test_series', JSON.stringify(defaultSeries));
    setLoading(false);
  }, []);

  const persist = (data: any[]) => {
    setSeries(data);
    localStorage.setItem('admin_test_series', JSON.stringify(data));
  };

  const resetForm = () => { setForm(initialForm); setEditId(null); setShowForm(false); };

  const handleEdit = (item: any) => {
    setForm({ name: item.name, fullName: item.fullName, slug: item.slug, description: item.description, icon: item.icon || 'BookOpen', isActive: item.isActive !== false });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, '-');
    if (editId) {
      persist(series.map(s => s.id === editId ? { ...s, ...form, slug } : s));
    } else {
      const id = slug;
      if (series.some(s => s.id === id)) { alert('A series with this slug already exists.'); return; }
      persist([{ id, ...form, slug, testCount: 0, freeCount: 0 }, ...series]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    persist(series.filter(s => s.id !== id));
    setConfirmDelete(null);
  };

  const toggleActive = (id: string) => {
    persist(series.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const filtered = series.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Test Series</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage exam categories and test series metadata</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Series
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 border-brand-200">
          <CardContent className="p-5 space-y-4">
            <h2 className="font-bold text-surface-900">{editId ? 'Edit Series' : 'New Test Series'}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Name *</label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: editId ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g. OSSC" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Full Name</label>
                <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Odisha Staff Selection Commission" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Slug</label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated from name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Icon</label>
                <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  {iconOptions.map(ico => <option key={ico} value={ico}>{ico}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-surface-500 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 placeholder-surface-400" placeholder="Describe this exam series..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
                <label htmlFor="isActive" className="text-sm text-surface-600">Active</label>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSubmit}>{editId ? 'Update' : 'Create'} Series</Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="max-w-sm mb-4">
        <Input placeholder="Search series..." value={search} onChange={e => setSearch(e.target.value)} icon={<Search className="h-4 w-4" />} />
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
                    <th className="px-5 py-3">Series</th>
                    <th className="px-5 py-3">Slug</th>
                    <th className="px-5 py-3 text-center">Tests</th>
                    <th className="px-5 py-3 text-center">Free</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center text-sm font-bold text-brand-600 shrink-0">
                            {s.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-surface-900">{s.name}</p>
                            <p className="text-xs text-surface-400">{s.fullName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-surface-500 font-mono text-xs">{s.slug}</td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-surface-900"><BarChart3 className="h-3.5 w-3.5 text-brand-500" />{s.testCount}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-mint-600"><CheckCircle className="h-3.5 w-3.5" />{s.freeCount}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => toggleActive(s.id)}>
                          <Badge variant={s.isActive ? 'success' : 'default'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(s)} className="p-1.5 text-surface-400 hover:text-amber-600 transition-colors rounded-lg hover:bg-amber-50"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => setConfirmDelete(s.id)} className="p-1.5 text-surface-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12"><BookOpen className="h-10 w-10 text-surface-300 mx-auto mb-3" /><p className="text-surface-500 font-medium">No series found</p></div>
            )}
          </CardContent>
        </Card>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-surface-900 mb-2">Delete Series?</h3>
            <p className="text-sm text-surface-500 mb-5">This will remove &ldquo;{series.find(s => s.id === confirmDelete)?.name}&rdquo;. Tests under this series will not be deleted.</p>
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
