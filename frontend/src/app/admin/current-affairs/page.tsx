'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Edit2, Trash2, Search, Newspaper, CalendarDays, CheckCircle, Loader2, FileText, Upload } from 'lucide-react';
import BulkImport from '@/components/admin/BulkImport';

const categoryOptions = ['National', 'International', 'Odisha', 'Economy', 'Science & Tech', 'Environment', 'Sports', 'Awards & Honours', 'Polity & Governance', 'Schemes & Programs'];

// ---------- Articles ----------
const defaultArticles = [
  { id: 'a1', title: 'Odisha Cabinet Approves Major Infrastructure Projects', category: 'Odisha', date: '2026-07-27', excerpt: 'The Odisha Cabinet has approved 15 major infrastructure projects worth ₹8,500 crore across sectors including road, health, and education.', content: 'Full article content here...', readTime: '3 min', isActive: true },
  { id: 'a2', title: 'India and ASEAN Sign New Trade Agreement', category: 'International', date: '2026-07-26', excerpt: 'India and ASEAN nations have signed a comprehensive economic partnership agreement.', content: 'Full article content here...', readTime: '4 min', isActive: true },
  { id: 'a3', title: 'RBI Keeps Repo Rate Unchanged at 6.25%', category: 'Economy', date: '2026-07-25', excerpt: 'RBI has maintained the repo rate at 6.25% for the third consecutive policy review.', content: 'Full article content here...', readTime: '3 min', isActive: true },
  { id: 'a4', title: 'ISRO Successfully Launches Earth Observation Satellite', category: 'Science & Tech', date: '2026-07-24', excerpt: 'ISRO latest Earth observation satellite was successfully placed in orbit.', content: 'Full article content here...', readTime: '5 min', isActive: true },
  { id: 'a5', title: 'Odisha Launches State Climate Action Plan 2.0', category: 'Odisha', date: '2026-07-23', excerpt: 'The Odisha government has launched an updated climate action plan.', content: 'Full article content here...', readTime: '4 min', isActive: true },
  { id: 'a6', title: 'Supreme Court Issues Landmark Judgment on Fundamental Rights', category: 'National', date: '2026-07-22', excerpt: 'The Supreme Court has delivered a landmark judgment expanding fundamental rights.', content: 'Full article content here...', readTime: '6 min', isActive: true },
];

const initialArticleForm = { title: '', category: 'National', date: new Date().toISOString().split('T')[0], excerpt: '', content: '', readTime: '3 min', isActive: true };

// ---------- Quiz Questions ----------
const defaultQuizQuestions = [
  { id: '1', date: '2026-07-28', text: 'Which Indian state recently launched the "Mukhyamantri Karma Tatpara Yojana"?', options: ['Odisha', 'Bihar', 'Uttar Pradesh', 'Rajasthan'], answer: 'Odisha', explanation: 'The Odisha government launched this scheme to provide skill training and employment.', category: 'Odisha', isActive: true },
  { id: '2', date: '2026-07-28', text: 'What is the repo rate as per the latest RBI monetary policy review?', options: ['6.00%', '6.25%', '6.50%', '5.75%'], answer: '6.25%', explanation: 'RBI kept the repo rate unchanged at 6.25%.', category: 'Economy', isActive: true },
  { id: '3', date: '2026-07-27', text: 'Which city hosted the Global Maritime India Summit 2026?', options: ['Mumbai', 'Chennai', 'Visakhapatnam', 'Kochi'], answer: 'Visakhapatnam', category: 'National', isActive: true },
  { id: '4', date: '2026-07-27', text: 'Odisha KALIA scheme is primarily focused on which sector?', options: ['Education', 'Agriculture', 'Healthcare', 'Infrastructure'], answer: 'Agriculture', category: 'Odisha', isActive: true },
  { id: '5', date: '2026-07-26', text: 'India first indigenous aircraft carrier INS Vikrant is based on which class?', options: ['Shivalik Class', 'Kolkata Class', 'Vikrant Class', 'Nilgiri Class'], answer: 'Vikrant Class', category: 'Science & Tech', isActive: true },
  { id: '6', date: '2026-07-26', text: 'Which country hosted the 2026 Asian Games?', options: ['China', 'Japan', 'India', 'South Korea'], answer: 'India', category: 'Sports', isActive: true },
];

const initialQuizForm = { date: new Date().toISOString().split('T')[0], text: '', options: ['', '', '', ''], answer: '', explanation: '', category: 'National', isActive: true };

export default function AdminCurrentAffairsPage() {
  const [tab, setTab] = useState<'articles' | 'quiz'>('articles');

  // Articles state
  const [articles, setArticles] = useState<any[]>([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editArticleId, setEditArticleId] = useState<string | null>(null);
  const [articleForm, setArticleForm] = useState(initialArticleForm);
  const [articleSearch, setArticleSearch] = useState('');
  const [articleCatFilter, setArticleCatFilter] = useState('');

  // Quiz state
  const [quiz, setQuiz] = useState<any[]>([]);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editQuizId, setEditQuizId] = useState<string | null>(null);
  const [quizForm, setQuizForm] = useState(initialQuizForm);
  const [quizSearch, setQuizSearch] = useState('');
  const [quizCatFilter, setQuizCatFilter] = useState('');
  const [quizDateFilter, setQuizDateFilter] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);

  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);

  useEffect(() => {
    const storedArticles = localStorage.getItem('admin_ca_articles');
    const storedQuiz = localStorage.getItem('admin_ca_quiz');
    if (storedArticles) setArticles(JSON.parse(storedArticles)); else setArticles(defaultArticles);
    if (storedQuiz) setQuiz(JSON.parse(storedQuiz)); else setQuiz(defaultQuizQuestions);
    setLoading(false);
  }, []);

  const persistArticles = (data: any[]) => {
    setArticles(data);
    localStorage.setItem('admin_ca_articles', JSON.stringify(data));
  };

  const persistQuiz = (data: any[]) => {
    setQuiz(data);
    localStorage.setItem('admin_ca_quiz', JSON.stringify(data));
  };

  // Article handlers
  const resetArticleForm = () => { setArticleForm(initialArticleForm); setEditArticleId(null); setShowArticleForm(false); };

  const handleEditArticle = (a: any) => {
    setArticleForm({ title: a.title, category: a.category, date: a.date, excerpt: a.excerpt, content: a.content || '', readTime: a.readTime || '3 min', isActive: a.isActive !== false });
    setEditArticleId(a.id);
    setShowArticleForm(true);
  };

  const handleSubmitArticle = () => {
    if (!articleForm.title.trim()) return;
    const entry = { title: articleForm.title, category: articleForm.category, date: articleForm.date, excerpt: articleForm.excerpt, content: articleForm.content, readTime: articleForm.readTime, isActive: articleForm.isActive };
    if (editArticleId) {
      persistArticles(articles.map(a => a.id === editArticleId ? { ...a, ...entry } : a));
    } else {
      persistArticles([{ id: `a${Date.now()}`, ...entry }, ...articles]);
    }
    resetArticleForm();
  };

  const handleDeleteArticle = (id: string) => {
    persistArticles(articles.filter(a => a.id !== id));
    setConfirmDelete(null);
  };

  // Quiz handlers
  const resetQuizForm = () => { setQuizForm(initialQuizForm); setEditQuizId(null); setShowQuizForm(false); };

  const handleEditQuiz = (q: any) => {
    setQuizForm({ date: q.date, text: q.text, options: q.options || ['', '', '', ''], answer: q.answer, explanation: q.explanation || '', category: q.category || 'National', isActive: q.isActive !== false });
    setEditQuizId(q.id);
    setShowQuizForm(true);
  };

  const handleSubmitQuiz = () => {
    if (!quizForm.text.trim() || !quizForm.answer.trim()) return;
    const entry = { date: quizForm.date, text: quizForm.text, options: quizForm.options, answer: quizForm.answer, explanation: quizForm.explanation, category: quizForm.category, isActive: quizForm.isActive };
    if (editQuizId) {
      persistQuiz(quiz.map(q => q.id === editQuizId ? { ...q, ...entry } : q));
    } else {
      persistQuiz([{ id: Date.now().toString(), ...entry }, ...quiz]);
    }
    resetQuizForm();
  };

  const handleDeleteQuiz = (id: string) => {
    persistQuiz(quiz.filter(q => q.id !== id));
    setConfirmDelete(null);
  };

  const handleBulkImport = (records: Record<string, string>[]) => {
    const newQuestions = records.map((r, idx) => ({
      id: `q${Date.now()}_${idx}`,
      date: r.date || new Date().toISOString().split('T')[0],
      text: r.text || r.question || r.questions || '',
      options: [r.option1 || r.option_1 || '', r.option2 || r.option_2 || '', r.option3 || r.option_3 || '', r.option4 || r.option_4 || ''],
      answer: r.answer || r.correctanswer || r.correct_answer || r.correctans || '',
      explanation: r.explanation || '',
      category: r.category || 'National',
      isActive: true,
    })).filter(q => q.text.trim());
    persistQuiz([...newQuestions, ...quiz]);
    setShowBulkImport(false);
  };

  const bulkImportColumns = [
    { key: 'date', label: 'Date', required: false },
    { key: 'text', label: 'Question', required: true },
    { key: 'option1', label: 'Option 1', required: true },
    { key: 'option2', label: 'Option 2', required: true },
    { key: 'option3', label: 'Option 3', required: true },
    { key: 'option4', label: 'Option 4', required: true },
    { key: 'answer', label: 'Correct Answer', required: true },
    { key: 'explanation', label: 'Explanation', required: false },
    { key: 'category', label: 'Category', required: false },
  ];

  const filteredArticles = articles.filter(a => {
    const mSearch = !articleSearch || a.title.toLowerCase().includes(articleSearch.toLowerCase()) || a.excerpt?.toLowerCase().includes(articleSearch.toLowerCase());
    const mCat = !articleCatFilter || a.category === articleCatFilter;
    return mSearch && mCat;
  });

  const filteredQuiz = quiz.filter(q => {
    const mSearch = !quizSearch || q.text.toLowerCase().includes(quizSearch.toLowerCase());
    const mCat = !quizCatFilter || q.category === quizCatFilter;
    const mDate = !quizDateFilter || q.date === quizDateFilter;
    return mSearch && mCat && mDate;
  });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-brand-500 animate-spin" /><span className="ml-2 text-sm text-surface-400">Loading...</span></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Current Affairs</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage articles, categories, and daily quiz questions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-lg w-fit mb-6">
        <button onClick={() => setTab('articles')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'articles' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
          <FileText className="h-4 w-4 inline mr-1.5" />Articles
        </button>
        <button onClick={() => setTab('quiz')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'quiz' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
          <CheckCircle className="h-4 w-4 inline mr-1.5" />Quiz Questions
        </button>
      </div>

      {/* ====== ARTICLES TAB ====== */}
      {tab === 'articles' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
                <input value={articleSearch} onChange={e => setArticleSearch(e.target.value)} placeholder="Search articles..." className="w-full rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
              </div>
              <select value={articleCatFilter} onChange={e => setArticleCatFilter(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                <option value="">All Categories</option>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="text-sm text-surface-400">{filteredArticles.length} articles</span>
            </div>
            <Button onClick={() => { resetArticleForm(); setShowArticleForm(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Article
            </Button>
          </div>

          {showArticleForm && (
            <Card className="mb-6 border-brand-200">
              <CardContent className="p-5 space-y-4">
                <h2 className="font-bold text-surface-900">{editArticleId ? 'Edit Article' : 'New Article'}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-surface-500 mb-1">Title *</label>
                    <Input value={articleForm.title} onChange={e => setArticleForm({ ...articleForm, title: e.target.value })} placeholder="Article title..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Category</label>
                    <select value={articleForm.category} onChange={e => setArticleForm({ ...articleForm, category: e.target.value })} className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                      {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Date</label>
                    <Input type="date" value={articleForm.date} onChange={e => setArticleForm({ ...articleForm, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Read Time</label>
                    <Input value={articleForm.readTime} onChange={e => setArticleForm({ ...articleForm, readTime: e.target.value })} placeholder="e.g. 3 min" />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="articleActive" checked={articleForm.isActive} onChange={e => setArticleForm({ ...articleForm, isActive: e.target.checked })} className="rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
                    <label htmlFor="articleActive" className="text-sm text-surface-600">Active</label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-surface-500 mb-1">Excerpt</label>
                    <textarea value={articleForm.excerpt} onChange={e => setArticleForm({ ...articleForm, excerpt: e.target.value })} rows={2} className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" placeholder="Short summary..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-surface-500 mb-1">Full Content</label>
                    <textarea value={articleForm.content} onChange={e => setArticleForm({ ...articleForm, content: e.target.value })} rows={4} className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" placeholder="Full article content..." />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSubmitArticle}>{editArticleId ? 'Update' : 'Create'} Article</Button>
                  <Button variant="outline" onClick={resetArticleForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                      <th className="px-5 py-3">Title</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3 text-center">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map(a => (
                      <tr key={a.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                        <td className="px-5 py-4 max-w-sm">
                          <p className="font-medium text-surface-900 truncate">{a.title}</p>
                          <p className="text-xs text-surface-400 truncate mt-0.5">{a.excerpt}</p>
                        </td>
                        <td className="px-5 py-4"><Badge variant={a.category === 'Odisha' ? 'info' : 'default'} size="sm">{a.category}</Badge></td>
                        <td className="px-5 py-4 text-surface-500 text-xs">{a.date}</td>
                        <td className="px-5 py-4 text-center"><Badge variant={a.isActive ? 'success' : 'default'} size="sm">{a.isActive ? 'Active' : 'Inactive'}</Badge></td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleEditArticle(a)} className="p-1.5 text-surface-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => setConfirmDelete({ type: 'article', id: a.id })} className="p-1.5 text-surface-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredArticles.length === 0 && (
                <div className="text-center py-12"><Newspaper className="h-10 w-10 text-surface-300 mx-auto mb-3" /><p className="text-surface-500 font-medium">No articles found</p></div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ====== QUIZ TAB ====== */}
      {tab === 'quiz' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
                <input value={quizSearch} onChange={e => setQuizSearch(e.target.value)} placeholder="Search questions..." className="w-full rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
              </div>
              <select value={quizCatFilter} onChange={e => setQuizCatFilter(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                <option value="">All Categories</option>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div><input type="date" value={quizDateFilter} onChange={e => setQuizDateFilter(e.target.value)} className="rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" /></div>
              <span className="text-sm text-surface-400">{filteredQuiz.length} questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowBulkImport(true)}>
                <Upload className="h-4 w-4 mr-1" /> Bulk Import
              </Button>
              <Button onClick={() => { resetQuizForm(); setShowQuizForm(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Add Question
              </Button>
            </div>
          </div>

          {showBulkImport && (
            <BulkImport
              columns={bulkImportColumns}
              templateFilename="ca_quiz_template.csv"
              templateRows={[['2026-07-28', 'Which Indian state launched the Mukhyamantri Karma Tatpara Yojana?', 'Odisha', 'Bihar', 'Uttar Pradesh', 'Rajasthan', 'Odisha', 'The Odisha government launched this scheme...', 'Odisha']]}
              onImport={handleBulkImport}
              onClose={() => setShowBulkImport(false)}
            />
          )}

          {showQuizForm && (
            <Card className="mb-6 border-brand-200">
              <CardContent className="p-5 space-y-4">
                <h2 className="font-bold text-surface-900">{editQuizId ? 'Edit Question' : 'New Quiz Question'}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Date *</label>
                    <Input type="date" value={quizForm.date} onChange={e => setQuizForm({ ...quizForm, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Category</label>
                    <select value={quizForm.category} onChange={e => setQuizForm({ ...quizForm, category: e.target.value })} className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                      {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="quizActive" checked={quizForm.isActive} onChange={e => setQuizForm({ ...quizForm, isActive: e.target.checked })} className="rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
                    <label htmlFor="quizActive" className="text-sm text-surface-600">Active</label>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-medium text-surface-500 mb-1">Question *</label>
                    <textarea value={quizForm.text} onChange={e => setQuizForm({ ...quizForm, text: e.target.value })} rows={2} className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" placeholder="Enter the question..." />
                  </div>
                  {quizForm.options.map((opt, i) => (
                    <div key={i}>
                      <label className="block text-xs font-medium text-surface-500 mb-1">Option {i + 1}</label>
                      <Input value={opt} onChange={e => { const opts = [...quizForm.options]; opts[i] = e.target.value; setQuizForm({ ...quizForm, options: opts }); }} placeholder={`Option ${i + 1}`} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Correct Answer *</label>
                    <Input value={quizForm.answer} onChange={e => setQuizForm({ ...quizForm, answer: e.target.value })} placeholder="e.g. Odisha" />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-medium text-surface-500 mb-1">Explanation</label>
                    <textarea value={quizForm.explanation} onChange={e => setQuizForm({ ...quizForm, explanation: e.target.value })} rows={2} className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" placeholder="Explain the correct answer..." />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSubmitQuiz}>{editQuizId ? 'Update' : 'Add'} Question</Button>
                  <Button variant="outline" onClick={resetQuizForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Question</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Answer</th>
                      <th className="px-5 py-3 text-center">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuiz.map(q => (
                      <tr key={q.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                        <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-600"><CalendarDays className="h-3.5 w-3.5 text-surface-400" />{q.date}</span></td>
                        <td className="px-5 py-4 max-w-xs"><p className="text-surface-900 font-medium truncate">{q.text}</p></td>
                        <td className="px-5 py-4"><Badge variant={q.category === 'Odisha' ? 'info' : q.category === 'Economy' ? 'warning' : 'default'} size="sm">{q.category}</Badge></td>
                        <td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-xs font-medium text-mint-600"><CheckCircle className="h-3.5 w-3.5" />{q.answer}</span></td>
                        <td className="px-5 py-4 text-center"><Badge variant={q.isActive ? 'success' : 'default'} size="sm">{q.isActive ? 'Active' : 'Inactive'}</Badge></td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleEditQuiz(q)} className="p-1.5 text-surface-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => setConfirmDelete({ type: 'quiz', id: q.id })} className="p-1.5 text-surface-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredQuiz.length === 0 && (
                <div className="text-center py-12"><CheckCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" /><p className="text-surface-500 font-medium">No questions found</p></div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-surface-900 mb-2">Delete?</h3>
            <p className="text-sm text-surface-500 mb-5">This will permanently remove this {confirmDelete.type === 'article' ? 'article' : 'question'}.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => { if (confirmDelete.type === 'article') handleDeleteArticle(confirmDelete.id); else handleDeleteQuiz(confirmDelete.id); }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
