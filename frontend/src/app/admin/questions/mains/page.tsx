'use client';
import { API_BASE } from '@/lib/apiBase';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Edit2, Trash2, PenTool, Search, X, Save, Lightbulb, Upload } from 'lucide-react';
import BulkImport from '@/components/admin/BulkImport';

const years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

const examOptions = ['OPSC', 'OSSC', 'OSSSC', 'SSB', 'Odisha Police', 'Odisha Teaching'];
const paperOptions = ['GS Paper 1', 'GS Paper 2', 'GS Paper 3', 'GS Paper 4', 'Essay', 'Optional - Odia', 'Optional - History', 'Optional - Geography'];
const subjectOptions = ['History', 'Polity', 'Geography', 'Economy', 'Science & Tech', 'Environment', 'Art & Culture', 'Current Affairs'];

const topicMap: Record<string, string[]> = {
  History: ['Ancient India', 'Medieval India', 'Modern India', 'World History'],
  Polity: ['Constitution', 'Governance', 'Judiciary', 'Parliament & Legislatures'],
  Geography: ['Physical Geography', 'Indian Geography', 'World Geography', 'Climate & Monsoon'],
  Economy: ['Macroeconomics', 'Indian Economy', 'Budget & Taxation', 'Banking & Finance'],
  'Science & Tech': ['Physics', 'Chemistry', 'Biology', 'Space & Technology'],
  Environment: ['Ecology & Ecosystem', 'Biodiversity', 'Climate Change', 'Environmental Pollution'],
  'Art & Culture': ['Architecture & Sculpture', 'Paintings & Crafts', 'Music & Dance', 'Literature & Languages'],
  'Current Affairs': ['National Events', 'International Events', 'Odisha Specific', 'Awards & Honors'],
};
const allTopics = Object.values(topicMap).flat();

export default function AdminMainsPYQsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState<number | ''>('');
  const [filterPaper, setFilterPaper] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');

  const [form, setForm] = useState({
    examId: '', subjectId: '', subCategory: '', paper: '', year: new Date().getFullYear(), difficulty: 'medium',
    text: '', marks: 15, answerCues: ['', '', '', ''], explanation: '',
  });
  const [showBulkImport, setShowBulkImport] = useState(false);

  const bulkColumns = [
    { key: 'examid', label: 'Exam ID' },
    { key: 'subjectid', label: 'Subject ID' },
    { key: 'subcategory', label: 'Sub-Category' },
    { key: 'paper', label: 'Paper', required: true },
    { key: 'year', label: 'Year', required: true },
    { key: 'difficulty', label: 'Difficulty', default: 'medium' },
    { key: 'text', label: 'Question Text', required: true },
    { key: 'marks', label: 'Marks', required: true, default: '15' },
    { key: 'answercue1', label: 'Answer Cue 1' },
    { key: 'answercue2', label: 'Answer Cue 2' },
    { key: 'answercue3', label: 'Answer Cue 3' },
    { key: 'answercue4', label: 'Answer Cue 4' },
    { key: 'explanation', label: 'Model Answer' },
  ];

  const handleBulkImport = (records: Record<string, string>[]) => {
    const imported = records.map((r, idx) => ({
      id: `bulk-${Date.now()}-${idx}`,
      examId: r.examid || '',
      subjectId: r.subjectid || '',
      subCategory: r.subcategory || '',
      paper: r.paper || '',
      year: r.year ? Number(r.year) : new Date().getFullYear(),
      difficulty: r.difficulty || 'medium',
      text: r.text || '',
      marks: r.marks ? Number(r.marks) : 15,
      answerCues: [r.answercue1 || '', r.answercue2 || '', r.answercue3 || '', r.answercue4 || ''],
      explanation: r.explanation || '',
      isPublished: true,
    }));
    setQuestions(prev => [...imported, ...prev]);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/questions?limit=100`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setQuestions(d.data || [])).catch(console.error);
  }, []);

  const resetForm = () => {
    setForm({ examId: '', subjectId: '', subCategory: '', paper: '', year: new Date().getFullYear(), difficulty: 'medium', text: '', marks: 15, answerCues: ['', '', '', ''], explanation: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (editId) {
      setQuestions(prev => prev.map(q => q.id === editId ? { ...q, ...form } : q));
    } else {
      setQuestions(prev => [{ id: Date.now().toString(), ...form, isPublished: true }, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (q: any) => {
    setForm({
      examId: q.examId || '', subjectId: q.subjectId || '', subCategory: q.subCategory || '', paper: q.paper || '',
      year: q.year || new Date().getFullYear(), difficulty: q.difficulty || 'medium',
      text: q.text || '', marks: q.marks || 15,
      answerCues: Array.isArray(q.answerCues) ? q.answerCues : ['', '', '', ''],
      explanation: q.explanation || '',
    });
    setEditId(q.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const filtered = questions.filter(q => {
    const mSearch = !search || q.text?.toLowerCase().includes(search.toLowerCase());
    const mYear = !filterYear || q.year === filterYear;
    const mPaper = !filterPaper || q.paper === filterPaper;
    const mSub = !filterSubCategory || q.subCategory === filterSubCategory;
    return mSearch && mYear && mPaper && mSub;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Mains PYQs</h1>
          <p className="text-sm text-surface-500 mt-1">Manage descriptive / answer-writing previous year questions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setShowBulkImport(true); setShowForm(false); }}>
            <Upload className="h-4 w-4 mr-1" /> Bulk Import
          </Button>
          <Button onClick={() => { resetForm(); setShowForm(true); setShowBulkImport(false); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Mains PYQ
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-amber-500" />
              {editId ? 'Edit Mains Question' : 'Add New Mains Question'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <select
                value={form.examId}
                onChange={e => setForm(f => ({ ...f, examId: e.target.value }))}
                className="rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="">Select Exam</option>
                {examOptions.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <select
                value={form.paper}
                onChange={e => setForm(f => ({ ...f, paper: e.target.value }))}
                className="rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="">Select Paper</option>
                {paperOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <Input
                label="Marks"
                type="number"
                value={form.marks}
                onChange={e => setForm(f => ({ ...f, marks: Number(e.target.value) }))}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <select
                value={form.subjectId}
                onChange={e => setForm(f => ({ ...f, subjectId: e.target.value, subCategory: '' }))}
                className="rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="">Select Subject</option>
                {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={form.subCategory}
                onChange={e => setForm(f => ({ ...f, subCategory: e.target.value }))}
                className="rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="">Select Sub-Category</option>
                {(form.subjectId ? topicMap[form.subjectId] : allTopics).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">Question Text</label>
              <textarea
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                placeholder="Enter the mains question text here..."
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">Answer Cues (key points to include in answer)</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {form.answerCues.map((cue, i) => (
                  <Input
                    key={i}
                    label={`Cue ${i + 1}`}
                    value={cue}
                    onChange={e => {
                      const newCues = [...form.answerCues];
                      newCues[i] = e.target.value;
                      setForm(f => ({ ...f, answerCues: newCues }));
                    }}
                    placeholder="Enter a key point..."
                    icon={<Lightbulb className="h-3.5 w-3.5 text-amber-500" />}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">Model Answer / Explanation</label>
              <textarea
                value={form.explanation}
                onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                placeholder="Provide a model answer or detailed explanation..."
              />
            </div>
            <div className="flex items-center gap-2.5">
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-1" />
                {editId ? 'Update Question' : 'Save Question'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Import */}
      {showBulkImport && (
        <BulkImport
          columns={bulkColumns}
          templateFilename="mains-pyq-template.csv"
          templateRows={[
            ['OPSC', 'History', 'Modern India', 'GS Paper 1', '2025', 'medium', 'Discuss the role of...', '15', 'Background', 'Key events', 'Outcomes', 'Significance', 'The role was pivotal...'],
            ['OSSC', 'Polity', 'Constitution', 'GS Paper 2', '2024', 'hard', 'Analyze the impact...', '20', 'Introduction', 'Main arguments', 'Evidence', 'Conclusion', 'In conclusion...'],
          ]}
          onImport={handleBulkImport}
          onClose={() => setShowBulkImport(false)}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 placeholder-surface-400"
          />
        </div>
        <select
          value={filterYear}
          onChange={e => setFilterYear(e.target.value ? Number(e.target.value) : '')}
          className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          value={filterPaper}
          onChange={e => setFilterPaper(e.target.value)}
          className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          <option value="">All Papers</option>
          {paperOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filterSubCategory}
          onChange={e => setFilterSubCategory(e.target.value)}
          className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          <option value="">All Sub-Categories</option>
          {allTopics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className="text-sm text-surface-400">{filtered.length} questions</span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left px-4 py-3 font-medium text-surface-700 w-10">#</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Question</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Year</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Subject</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Sub-Category</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Paper</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Marks</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Cues</th>
                  <th className="text-right px-4 py-3 font-medium text-surface-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <tr key={q.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3 text-surface-400">{i + 1}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-1 text-surface-900 font-medium">{q.text?.replace(/<[^>]*>/g, '')}</p>
                      {q.explanation && (
                        <p className="text-xs text-surface-400 mt-0.5 line-clamp-1">{q.explanation}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-surface-600">{q.year}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info" size="sm">{q.subjectId || 'General'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-surface-500">{q.subCategory || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="warning" size="sm">{q.paper || '-'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-amber-600">{q.marks}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-surface-400">
                        {Array.isArray(q.answerCues) ? q.answerCues.filter(Boolean).length : 0} cues
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(q)} className="p-1.5 text-surface-400 hover:text-brand-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(q.id)} className="p-1.5 text-surface-400 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <PenTool className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No mains questions found.</p>
          <Button variant="outline" className="mt-3" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Your First
          </Button>
        </div>
      )}
    </div>
  );
}
