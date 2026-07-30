'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Edit2, Trash2, HelpCircle, Search, X, Save, Upload, CheckCircle, Target, PenTool } from 'lucide-react';
import BulkImport from '@/components/admin/BulkImport';

const years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);
const examOptions = ['OPSC', 'OSSC', 'OSSSC', 'SSB', 'Odisha Police', 'Odisha Teaching'];
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

const tabs = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'prelim', label: 'Prelim', icon: Target },
  { id: 'mains', label: 'Mains', icon: PenTool },
];

const paperOptions = ['GS Paper 1', 'GS Paper 2', 'GS Paper 3', 'GS Paper 4', 'Essay', 'Optional - Odia', 'Optional - History', 'Optional - Geography'];

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState<number | ''>('');
  const [filterExam, setFilterExam] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');

  const [form, setForm] = useState({
    questionType: 'prelim', examId: '', subjectId: '', subCategory: '', paper: '',
    year: new Date().getFullYear(), difficulty: 'medium',
    text: '', options: ['', '', '', ''], correctAns: '', explanation: '',
    marks: 15, answerCues: ['', '', '', ''], isPublished: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/questions?limit=200', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setQuestions(d.data || [])).catch(console.error);
  }, []);

  const resetForm = () => {
    setForm({ questionType: 'prelim', examId: '', subjectId: '', subCategory: '', paper: '',
      year: new Date().getFullYear(), difficulty: 'medium', text: '', options: ['', '', '', ''],
      correctAns: '', explanation: '', marks: 15, answerCues: ['', '', '', ''], isPublished: true });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (editId) {
      setQuestions(prev => prev.map(q => q.id === editId ? { ...q, ...form } : q));
    } else {
      setQuestions(prev => [{ id: Date.now().toString(), ...form }, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (q: any) => {
    const isMains = q.questionType === 'mains' || q.paper;
    setForm({
      questionType: q.questionType || (isMains ? 'mains' : 'prelim'),
      examId: q.examId || q.exam?.name || '',
      subjectId: q.subjectId || q.subject?.name || '',
      subCategory: q.subCategory || '',
      paper: q.paper || '',
      year: q.year || new Date().getFullYear(),
      difficulty: q.difficulty || 'medium',
      text: q.text || '',
      options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
      correctAns: q.correctAns || '',
      explanation: q.explanation || '',
      marks: q.marks || 15,
      answerCues: Array.isArray(q.answerCues) ? q.answerCues : ['', '', '', ''],
      isPublished: q.isPublished ?? true,
    });
    setEditId(q.id);
    setShowForm(true);
    setShowBulkImport(false);
  };

  const handleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const bulkColumns = [
    { key: 'questiontype', label: 'Type (prelim/mains)', default: 'prelim' },
    { key: 'examid', label: 'Exam ID' },
    { key: 'subjectid', label: 'Subject ID' },
    { key: 'subcategory', label: 'Sub-Category' },
    { key: 'paper', label: 'Paper (mains only)' },
    { key: 'year', label: 'Year', required: true },
    { key: 'difficulty', label: 'Difficulty', default: 'medium' },
    { key: 'text', label: 'Question Text', required: true },
    { key: 'optiona', label: 'Option A (prelim)' },
    { key: 'optionb', label: 'Option B (prelim)' },
    { key: 'optionc', label: 'Option C (prelim)' },
    { key: 'optiond', label: 'Option D (prelim)' },
    { key: 'correctans', label: 'Correct Answer (prelim)' },
    { key: 'marks', label: 'Marks (mains)', default: '15' },
    { key: 'answercue1', label: 'Answer Cue 1 (mains)' },
    { key: 'answercue2', label: 'Answer Cue 2 (mains)' },
    { key: 'answercue3', label: 'Answer Cue 3 (mains)' },
    { key: 'answercue4', label: 'Answer Cue 4 (mains)' },
    { key: 'explanation', label: 'Explanation' },
  ];

  const handleBulkImport = (records: Record<string, string>[]) => {
    const imported = records.map((r, idx) => {
      const isMains = r.questiontype === 'mains';
      return {
        id: `bulk-${Date.now()}-${idx}`,
        questionType: r.questiontype || 'prelim',
        examId: r.examid || '', subjectId: r.subjectid || '', subCategory: r.subcategory || '',
        paper: isMains ? (r.paper || '') : '',
        year: r.year ? Number(r.year) : new Date().getFullYear(),
        difficulty: r.difficulty || 'medium', text: r.text || '',
        options: isMains ? [] : [r.optiona || '', r.optionb || '', r.optionc || '', r.optiond || ''],
        correctAns: isMains ? '' : (r.correctans || ''),
        marks: isMains ? (r.marks ? Number(r.marks) : 15) : 0,
        answerCues: isMains ? [r.answercue1 || '', r.answercue2 || '', r.answercue3 || '', r.answercue4 || ''] : [],
        explanation: r.explanation || '',
        isPublished: true,
      };
    });
    setQuestions(prev => [...imported, ...prev]);
  };

  const filtered = questions.filter(q => {
    const mTab = activeTab === 'all' || q.questionType === activeTab;
    const mSearch = !search || q.text?.toLowerCase().includes(search.toLowerCase());
    const mYear = !filterYear || q.year === filterYear;
    const mExam = !filterExam || (q.examId === filterExam || q.exam?.name === filterExam);
    const mSub = !filterSubCategory || q.subCategory === filterSubCategory;
    return mTab && mSearch && mYear && mExam && mSub;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Question Bank</h1>
          <p className="text-sm text-surface-500 mt-1">Manage all prelim and mains questions in one place</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setShowBulkImport(true); setShowForm(false); }}>
            <Upload className="h-4 w-4 mr-1" /> Bulk Import
          </Button>
          <Button onClick={() => { resetForm(); setShowForm(true); setShowBulkImport(false); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Question
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-surface-100 rounded-lg w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6 border-brand-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-brand-500" />
                {editId ? 'Edit Question' : 'Add New Question'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-surface-400">Type:</span>
                {['prelim', 'mains'].map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(f => ({ ...f, questionType: t }))}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      form.questionType === t
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white text-surface-600 border-surface-200 hover:border-brand-300'
                    }`}
                  >
                    {t === 'prelim' ? 'Prelim' : 'Mains'}
                  </button>
                ))}
              </div>
            </div>
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
              <select
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={form.difficulty}
                onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                className="rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {form.questionType === 'mains' && (
                <select
                  value={form.paper}
                  onChange={e => setForm(f => ({ ...f, paper: e.target.value }))}
                  className="rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                >
                  <option value="">Select Paper</option>
                  {paperOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )}
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">Question Text</label>
              <textarea
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                placeholder="Enter the question text here..."
              />
            </div>

            {/* Prelim fields */}
            {form.questionType === 'prelim' && (
              <>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {form.options.map((opt, i) => (
                    <Input
                      key={i}
                      label={`Option ${String.fromCharCode(65 + i)}`}
                      value={opt}
                      onChange={e => {
                        const newOpts = [...form.options];
                        newOpts[i] = e.target.value;
                        setForm(f => ({ ...f, options: newOpts }));
                      }}
                      icon={<span className="text-xs font-bold text-surface-400">{String.fromCharCode(65 + i)}</span>}
                    />
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-surface-700 mb-1.5 block">Correct Answer</label>
                    <select
                      value={form.correctAns}
                      onChange={e => setForm(f => ({ ...f, correctAns: e.target.value }))}
                      className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    >
                      <option value="">Select correct option</option>
                      {form.options.filter(o => o.trim()).map((opt, i) => (
                        <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Mains fields */}
            {form.questionType === 'mains' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Marks"
                    type="number"
                    value={form.marks}
                    onChange={e => setForm(f => ({ ...f, marks: Number(e.target.value) }))}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">Answer Cues</label>
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
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Explanation / Model Answer</label>
                <textarea
                  value={form.explanation}
                  onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
                  rows={2}
                  className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                  placeholder={form.questionType === 'prelim' ? 'Explain why this answer is correct...' : 'Provide a model answer...'}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Status</label>
                <select
                  value={form.isPublished ? 'published' : 'draft'}
                  onChange={e => setForm(f => ({ ...f, isPublished: e.target.value === 'published' }))}
                  className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
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
          templateFilename="question-bank-template.csv"
          templateRows={[
            ['prelim', 'OSSC', 'History', 'Ancient India', '', '2025', 'medium', 'Which dynasty ruled?', 'Maurya', 'Gupta', 'Chola', 'Pandya', 'Maurya', '', '', '', '', '', 'The Maurya dynasty...'],
            ['mains', 'OPSC', 'History', 'Modern India', 'GS Paper 1', '2025', 'hard', 'Discuss the role of...', '', '', '', '', '', '15', 'Background', 'Key events', 'Outcomes', 'Significance', 'The role was...'],
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
          value={filterExam}
          onChange={e => setFilterExam(e.target.value)}
          className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          <option value="">All Exams</option>
          {examOptions.map(e => <option key={e} value={e}>{e}</option>)}
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
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Question</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Year</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Exam</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Subject</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Sub-Category</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Difficulty</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-surface-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <tr key={q.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3 text-surface-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Badge variant={q.questionType === 'mains' ? 'warning' : 'info'} size="sm">
                        {q.questionType === 'mains' ? 'Mains' : 'Prelim'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-1 text-surface-900 font-medium">{q.text?.replace(/<[^>]*>/g, '')}</p>
                      {q.correctAns && (
                        <p className="text-xs text-mint-600 flex items-center gap-1 mt-0.5">
                          <CheckCircle className="h-3 w-3" /> Ans: {q.correctAns}
                        </p>
                      )}
                      {q.marks && (
                        <p className="text-xs text-amber-600 mt-0.5">{q.marks} marks</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-surface-600">{q.year || '-'}</td>
                    <td className="px-4 py-3 text-surface-600">{q.examId || q.exam?.name || '-'}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info" size="sm">{q.subjectId || q.subject?.name || 'General'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-surface-500">{q.subCategory || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'danger'} size="sm">{q.difficulty || 'N/A'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={q.isPublished ? 'success' : 'default'} size="sm">{q.isPublished ? 'Published' : 'Draft'}</Badge>
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
          <HelpCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No questions found.</p>
          <Button variant="outline" className="mt-3" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Your First
          </Button>
        </div>
      )}
    </div>
  );
}
