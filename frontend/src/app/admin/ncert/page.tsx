'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import {
  BookOpen, Plus, Edit2, Trash2, Search, GraduationCap, Link2, BrainCircuit,
  CheckCircle, AlertCircle, Unlink, ChevronLeft, RefreshCw, ServerOff, Layers, ListChecks
} from 'lucide-react';
import { ncertApi, slugify, NcertBook, NcertChapter, NcertQuestion } from '@/lib/ncertApi';

const CLASSES = [6, 7, 8, 9, 10, 11, 12];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

interface BookForm { subject: string; name: string; slug: string; description: string; }
interface ChapterForm { name: string; slug: string; summary: string; order: string; }
interface QuestionForm { text: string; options: string[]; correctIndex: number; explanation: string; difficulty: string; }

const emptyBookForm: BookForm = { subject: '', name: '', slug: '', description: '' };
const emptyChapterForm: ChapterForm = { name: '', slug: '', summary: '', order: '' };
const emptyQuestionForm: QuestionForm = { text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', difficulty: 'medium' };

const inputCls = 'flex h-10 w-full rounded-xl border-2 border-surface-200 bg-white px-3 py-2 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400';

export default function AdminNcertPage() {
  const [activeClass, setActiveClass] = useState<number>(6);
  const [activeSubject, setActiveSubject] = useState<string>('');
  const [activeBookId, setActiveBookId] = useState<string>('');
  const [books, setBooks] = useState<NcertBook[]>([]);
  const [questions, setQuestions] = useState<NcertQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendOk, setBackendOk] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  const [bookModal, setBookModal] = useState<{ open: boolean; edit?: NcertBook }>({ open: false });
  const [bookForm, setBookForm] = useState<BookForm>(emptyBookForm);
  const [chapterModal, setChapterModal] = useState<{ open: boolean; edit?: NcertChapter }>({ open: false });
  const [chapterForm, setChapterForm] = useState<ChapterForm>(emptyChapterForm);
  const [questionModal, setQuestionModal] = useState<{ open: boolean; chapter?: NcertChapter }>({ open: false });
  const [questionForm, setQuestionForm] = useState<QuestionForm>(emptyQuestionForm);
  const [linkModal, setLinkModal] = useState<{ chapter: NcertChapter; questionIds: string[] } | null>(null);
  const [linkSearch, setLinkSearch] = useState('');

  const showNotice = (text: string, error = false) => {
    setNotice({ text, error });
    window.setTimeout(() => setNotice(null), 5000);
  };

  const load = useCallback(async (cls: number) => {
    setLoading(true);
    try {
      const [b, q] = await Promise.all([
        ncertApi.getBooks({ class: cls, includeChapters: true }),
        ncertApi.getQuestions({ limit: 500 }),
      ]);
      setBooks(b);
      setQuestions(q?.data ?? []);
      setBackendOk(true);
    } catch {
      setBooks([]);
      setBackendOk(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(activeClass);
    setActiveSubject('');
    setActiveBookId('');
  }, [activeClass, load]);

  useEffect(() => {
    if (activeBookId && !books.some((b) => b.id === activeBookId)) setActiveBookId('');
  }, [books, activeBookId]);

  const subjects = useMemo(() => Array.from(new Set(books.map((b) => b.subject))).sort(), [books]);
  const filteredBooks = useMemo(
    () => (activeSubject ? books.filter((b) => b.subject === activeSubject) : books),
    [books, activeSubject]
  );
  const activeBook = useMemo(() => books.find((b) => b.id === activeBookId), [books, activeBookId]);
  const chapters = activeBook?.chapters ?? [];

  // ─── BOOK CRUD ────────────────────────────────────────────────────────────
  const openBookModal = (edit?: NcertBook) => {
    setBookModal({ open: true, edit });
    setBookForm(
      edit
        ? { subject: edit.subject, name: edit.name, slug: edit.slug, description: edit.description ?? '' }
        : emptyBookForm
    );
  };

  const handleBookFormChange = (patch: Partial<BookForm>) => {
    setBookForm((f) => {
      const next = { ...f, ...patch };
      if (!bookModal.edit && !patch.slug && patch.name) next.slug = slugify(patch.name);
      return next;
    });
  };

  const handleSaveBook = async () => {
    if (!bookForm.subject.trim() || !bookForm.name.trim() || !bookForm.slug.trim()) {
      showNotice('Subject, name and slug are required.', true);
      return;
    }
    setBusy(true);
    try {
      const payload = {
        subject: bookForm.subject.trim(),
        name: bookForm.name.trim(),
        slug: slugify(bookForm.slug),
        description: bookForm.description.trim() || undefined,
      };
      if (bookModal.edit) {
        await ncertApi.updateBook(bookModal.edit.id, payload);
        showNotice('Book updated.');
      } else {
        await ncertApi.createBook({ ...payload, class: activeClass });
        showNotice('Book added.');
      }
      setBookModal({ open: false });
      await load(activeClass);
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteBook = async (book: NcertBook) => {
    if (!window.confirm(`Delete "${book.name}" and all its chapters?`)) return;
    setBusy(true);
    try {
      await ncertApi.deleteBook(book.id);
      showNotice('Book deleted.');
      await load(activeClass);
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  // ─── CHAPTER CRUD ─────────────────────────────────────────────────────────
  const openChapterModal = (edit?: NcertChapter) => {
    setChapterModal({ open: true, edit });
    setChapterForm(
      edit
        ? { name: edit.name, slug: edit.slug, summary: edit.summary ?? '', order: String(edit.order ?? '') }
        : emptyChapterForm
    );
  };

  const handleChapterFormChange = (patch: Partial<ChapterForm>) => {
    setChapterForm((f) => {
      const next = { ...f, ...patch };
      if (!chapterModal.edit && !patch.slug && patch.name) next.slug = slugify(patch.name);
      return next;
    });
  };

  const handleSaveChapter = async () => {
    if (!activeBook) return;
    if (!chapterForm.name.trim() || !chapterForm.slug.trim()) {
      showNotice('Chapter name and slug are required.', true);
      return;
    }
    setBusy(true);
    try {
      const payload = {
        name: chapterForm.name.trim(),
        slug: slugify(chapterForm.slug),
        summary: chapterForm.summary.trim() || undefined,
        order: chapterForm.order ? parseInt(chapterForm.order, 10) : undefined,
      };
      if (chapterModal.edit) {
        await ncertApi.updateChapter(chapterModal.edit.id, payload);
        showNotice('Chapter updated.');
      } else {
        await ncertApi.createChapter({ ...payload, bookId: activeBook.id });
        showNotice('Chapter added.');
      }
      setChapterModal({ open: false });
      await load(activeClass);
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteChapter = async (chapter: NcertChapter) => {
    if (!window.confirm(`Delete chapter "${chapter.name}"?`)) return;
    setBusy(true);
    try {
      await ncertApi.deleteChapter(chapter.id);
      showNotice('Chapter deleted.');
      await load(activeClass);
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  // ─── QUESTION ─────────────────────────────────────────────────────────────
  const openQuestionModal = (chapter: NcertChapter) => {
    setQuestionModal({ open: true, chapter });
    setQuestionForm(emptyQuestionForm);
  };

  const handleSaveQuestion = async () => {
    const chapter = questionModal.chapter;
    if (!chapter) return;
    if (!questionForm.text.trim() || questionForm.options.some((o) => !o.trim())) {
      showNotice('Question text and all four options are required.', true);
      return;
    }
    setBusy(true);
    try {
      const options = questionForm.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o.trim()}`);
      const created = await ncertApi.createQuestion({
        text: questionForm.text.trim(),
        options: JSON.stringify(options),
        correctAns: options[questionForm.correctIndex],
        explanation: questionForm.explanation.trim() || undefined,
        difficulty: questionForm.difficulty,
        sourceType: 'NCERT',
        isPublished: true,
      });
      const links = await ncertApi.getChapterLinks(chapter.id);
      await ncertApi.setChapterLinks(chapter.id, { questionIds: [...links.questionIds, created.id] });
      await load(activeClass);
      setQuestions((prev) => (prev.some((q) => q.id === created.id) ? prev : [created, ...prev]));
      setQuestionModal({ open: false });
      showNotice('Question created and linked to the chapter.');
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  // ─── LINK QUESTIONS ───────────────────────────────────────────────────────
  const openLinkModal = async (chapter: NcertChapter) => {
    setBusy(true);
    try {
      const links = await ncertApi.getChapterLinks(chapter.id);
      setLinkModal({ chapter, questionIds: links.questionIds });
      setLinkSearch('');
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  const toggleQuestionLink = async (qId: string) => {
    if (!linkModal) return;
    const exists = linkModal.questionIds.includes(qId);
    const updated = exists ? linkModal.questionIds.filter((id) => id !== qId) : [...linkModal.questionIds, qId];
    const prev = linkModal.questionIds;
    setLinkModal({ ...linkModal, questionIds: updated });
    try {
      await ncertApi.setChapterLinks(linkModal.chapter.id, { questionIds: updated });
      await load(activeClass);
    } catch (e: any) {
      setLinkModal({ ...linkModal, questionIds: prev });
      showNotice(e.message, true);
    }
  };

  const linkedCount = (chapter: NcertChapter) =>
    chapter.links?.filter((l) => l.questionId).length ?? 0;

  const searchableQuestions = useMemo(
    () =>
      questions.filter(
        (q) =>
          !linkSearch ||
          q.text.toLowerCase().includes(linkSearch.toLowerCase()) ||
          (q.difficulty ?? '').toLowerCase().includes(linkSearch.toLowerCase())
      ),
    [questions, linkSearch]
  );

  const fieldCls = 'space-y-1.5';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">NCERT Management</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Manage NCERT books, chapters and MCQs that appear on the public NCERT pages
          </p>
        </div>
        <div className="flex items-center gap-2">
          {backendOk ? (
            <Badge variant="success" size="sm">
              <CheckCircle className="h-3 w-3 mr-1" /> Connected
            </Badge>
          ) : (
            <Badge variant="danger" size="sm">
              <ServerOff className="h-3 w-3 mr-1" /> Backend offline
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => load(activeClass)}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {!backendOk && (
        <div className="flex items-start gap-3 rounded-2xl border border-coral-200 bg-coral-50 p-4 text-sm text-coral-700">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Backend not reachable.</p>
            <p className="mt-0.5">
              Start it with <code className="font-mono text-xs bg-coral-100 px-1.5 py-0.5 rounded">npm run dev</code> in the{' '}
              <code className="font-mono text-xs bg-coral-100 px-1.5 py-0.5 rounded">/backend</code> folder, then sign out and sign
              back in so changes can be saved.
            </p>
          </div>
        </div>
      )}

      {notice && (
        <div
          className={`rounded-2xl border p-4 text-sm font-medium ${
            notice.error ? 'border-coral-200 bg-coral-50 text-coral-700' : 'border-mint-200 bg-mint-50 text-mint-700'
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Class tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CLASSES.map((c) => (
          <button
            key={c}
            onClick={() => setActiveClass(c)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
              activeClass === c ? 'bg-brand-500 text-white shadow-sm' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            Class {c}
          </button>
        ))}
      </div>

      {activeBook ? (
        /* ── CHAPTERS PANEL ─────────────────────────────────────────────── */
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveBookId('')}
                  className="p-2 rounded-xl text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
                  title="Back to books"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-brand-500" />
                    {activeBook.name}
                  </CardTitle>
                  <p className="text-xs text-surface-400 mt-0.5">
                    Class {activeClass} · {activeBook.subject}
                  </p>
                </div>
                <Badge variant="info" size="sm">{chapters.length} chapters</Badge>
              </div>
              <Button size="sm" onClick={() => openChapterModal()} disabled={!backendOk || busy}>
                <Plus className="h-4 w-4 mr-1" /> Add Chapter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Chapter</th>
                    <th className="px-5 py-3 max-w-[300px]">Summary</th>
                    <th className="px-5 py-3 text-center">Linked MCQs</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((ch) => (
                    <tr key={ch.id} className="border-b border-surface-100 hover:bg-surface-50/50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-surface-900">{ch.name}</p>
                        <p className="text-xs text-surface-400 mt-0.5">#{ch.order ?? '-'} · /{ch.slug}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-surface-500 truncate max-w-[300px]">{ch.summary || '—'}</td>
                      <td className="px-5 py-4 text-center">
                        <Badge variant={linkedCount(ch) > 0 ? 'success' : 'default'} size="sm">
                          <BrainCircuit className="h-3 w-3 mr-0.5" />{linkedCount(ch)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openLinkModal(ch)}
                            className="p-2 text-surface-400 hover:text-brand-600 rounded-xl hover:bg-brand-50 transition-colors"
                            title="Link Questions"
                          >
                            <Link2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openQuestionModal(ch)}
                            className="p-2 text-surface-400 hover:text-mint-600 rounded-xl hover:bg-mint-50 transition-colors"
                            title="Add Question"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openChapterModal(ch)}
                            className="p-2 text-surface-400 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition-colors"
                            title="Edit Chapter"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(ch)}
                            className="p-2 text-surface-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                            title="Delete Chapter"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {chapters.length === 0 && (
              <div className="text-center py-12">
                <Layers className="h-10 w-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 font-medium">No chapters yet</p>
                <p className="text-xs text-surface-400 mt-1">Add chapters, then link MCQs to each one.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* ── BOOKS LIST ──────────────────────────────────────────────────── */
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-500" />
                Class {activeClass} Books
                <Badge variant="info" size="sm">{books.length}</Badge>
              </CardTitle>
              <Button size="sm" onClick={() => openBookModal()} disabled={!backendOk || busy}>
                <Plus className="h-4 w-4 mr-1" /> Add Book
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {subjects.length > 0 && (
              <div className="flex items-center gap-2 px-5 pt-4 pb-1 overflow-x-auto">
                <button
                  onClick={() => setActiveSubject('')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeSubject === '' ? 'bg-surface-900 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  All
                </button>
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSubject(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeSubject === s ? 'bg-ocean-500 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Book</th>
                    <th className="px-5 py-3">Subject</th>
                    <th className="px-5 py-3 text-center">Chapters</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((b) => (
                    <tr key={b.id} className="border-b border-surface-100 hover:bg-surface-50/50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-surface-900">{b.name}</p>
                        <p className="text-xs text-surface-400 mt-0.5">/{b.slug}</p>
                      </td>
                      <td className="px-5 py-4"><Badge size="sm">{b.subject}</Badge></td>
                      <td className="px-5 py-4 text-center">
                        <Badge variant="info" size="sm">{b.chapters?.length ?? 0}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => setActiveBookId(b.id)}>
                            <ListChecks className="h-4 w-4 mr-1" /> Chapters
                          </Button>
                          <button
                            onClick={() => openBookModal(b)}
                            className="p-2 text-surface-400 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition-colors"
                            title="Edit Book"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(b)}
                            className="p-2 text-surface-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                            title="Delete Book"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!loading && books.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-10 w-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 font-medium">No books for Class {activeClass}</p>
                <p className="text-xs text-surface-400 mt-1">Add a book to start building chapters and MCQs.</p>
                <Button size="sm" className="mt-4" onClick={() => openBookModal()} disabled={!backendOk}>
                  <Plus className="h-4 w-4 mr-1" /> Add Book
                </Button>
              </div>
            )}
            {loading && (
              <div className="text-center py-12 text-sm text-surface-400">Loading…</div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── BOOK MODAL ───────────────────────────────────────────────────── */}
      <Modal isOpen={bookModal.open} onClose={() => setBookModal({ open: false })} title={bookModal.edit ? 'Edit Book' : `Add Book — Class ${activeClass}`}>
        <div className="space-y-4">
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Subject</label>
            <Input value={bookForm.subject} onChange={(e) => handleBookFormChange({ subject: e.target.value })} placeholder="e.g. History" />
          </div>
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Book name</label>
            <Input value={bookForm.name} onChange={(e) => handleBookFormChange({ name: e.target.value })} placeholder="e.g. Our Pasts I" />
          </div>
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Slug</label>
            <Input value={bookForm.slug} onChange={(e) => handleBookFormChange({ slug: e.target.value })} placeholder="e.g. our-pasts-i" />
          </div>
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Description</label>
            <textarea value={bookForm.description} onChange={(e) => handleBookFormChange({ description: e.target.value })} rows={2} className={inputCls} placeholder="Optional short description" />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setBookModal({ open: false })}>Cancel</Button>
            <Button onClick={handleSaveBook} disabled={busy}>{busy ? 'Saving…' : 'Save Book'}</Button>
          </div>
        </div>
      </Modal>

      {/* ── CHAPTER MODAL ────────────────────────────────────────────────── */}
      <Modal isOpen={chapterModal.open} onClose={() => setChapterModal({ open: false })} title={chapterModal.edit ? 'Edit Chapter' : 'Add Chapter'}>
        <div className="space-y-4">
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Chapter name</label>
            <Input value={chapterForm.name} onChange={(e) => handleChapterFormChange({ name: e.target.value })} placeholder="e.g. The French Revolution" />
          </div>
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Slug</label>
            <Input value={chapterForm.slug} onChange={(e) => handleChapterFormChange({ slug: e.target.value })} placeholder="e.g. french-revolution" />
          </div>
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Summary</label>
            <textarea value={chapterForm.summary} onChange={(e) => handleChapterFormChange({ summary: e.target.value })} rows={3} className={inputCls} placeholder="Short description shown on the class page" />
          </div>
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Order</label>
            <Input type="number" value={chapterForm.order} onChange={(e) => handleChapterFormChange({ order: e.target.value })} placeholder="Auto (next in sequence)" />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setChapterModal({ open: false })}>Cancel</Button>
            <Button onClick={handleSaveChapter} disabled={busy}>{busy ? 'Saving…' : 'Save Chapter'}</Button>
          </div>
        </div>
      </Modal>

      {/* ── QUESTION MODAL ───────────────────────────────────────────────── */}
      <Modal isOpen={questionModal.open} onClose={() => setQuestionModal({ open: false })} title={`Add MCQ — ${questionModal.chapter?.name ?? ''}`} size="lg">
        <div className="space-y-4">
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Question</label>
            <textarea value={questionForm.text} onChange={(e) => setQuestionForm((f) => ({ ...f, text: e.target.value }))} rows={3} className={inputCls} placeholder="Type the question…" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {questionForm.options.map((opt, i) => (
              <div key={i} className={fieldCls}>
                <label className="block text-sm font-medium text-surface-700">Option {String.fromCharCode(65 + i)}</label>
                <Input
                  value={opt}
                  onChange={(e) => setQuestionForm((f) => ({ ...f, options: f.options.map((o, j) => (j === i ? e.target.value : o)) }))}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                />
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className={fieldCls}>
              <label className="block text-sm font-medium text-surface-700">Correct answer</label>
              <select
                value={questionForm.correctIndex}
                onChange={(e) => setQuestionForm((f) => ({ ...f, correctIndex: parseInt(e.target.value, 10) }))}
                className={inputCls}
              >
                {questionForm.options.map((_, i) => (
                  <option key={i} value={i}>Option {String.fromCharCode(65 + i)}</option>
                ))}
              </select>
            </div>
            <div className={fieldCls}>
              <label className="block text-sm font-medium text-surface-700">Difficulty</label>
              <select
                value={questionForm.difficulty}
                onChange={(e) => setQuestionForm((f) => ({ ...f, difficulty: e.target.value }))}
                className={inputCls}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={fieldCls}>
            <label className="block text-sm font-medium text-surface-700">Explanation</label>
            <textarea value={questionForm.explanation} onChange={(e) => setQuestionForm((f) => ({ ...f, explanation: e.target.value }))} rows={3} className={inputCls} placeholder="Optional explanation shown after answering" />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setQuestionModal({ open: false })}>Cancel</Button>
            <Button onClick={handleSaveQuestion} disabled={busy}>{busy ? 'Saving…' : 'Create & Link'}</Button>
          </div>
        </div>
      </Modal>

      {/* ── LINK MODAL ───────────────────────────────────────────────────── */}
      <Modal isOpen={!!linkModal} onClose={() => setLinkModal(null)} title="Link Questions" size="lg">
        {linkModal && (
          <div className="space-y-4">
            <p className="text-sm text-surface-500">{linkModal.chapter.name} · {linkModal.questionIds.length} linked</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
              <input
                value={linkSearch}
                onChange={(e) => setLinkSearch(e.target.value)}
                placeholder="Search questions…"
                className="w-full rounded-xl border-2 border-surface-200 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <div className="max-h-[50vh] overflow-y-auto space-y-2 rounded-xl border border-surface-200 p-3">
              {searchableQuestions.map((q) => {
                const linked = linkModal.questionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestionLink(q.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                      linked ? 'border-brand-200 bg-brand-50/50' : 'border-surface-200 hover:border-surface-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {linked ? (
                        <CheckCircle className="h-5 w-5 text-brand-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-surface-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900">{q.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge size="sm">{q.difficulty ?? 'medium'}</Badge>
                        <span className="text-xs text-surface-400">{q.sourceType ?? 'NCERT'}</span>
                      </div>
                    </div>
                    {linked && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleQuestionLink(q.id); }}
                        className="p-1 text-surface-400 hover:text-red-500"
                      >
                        <Unlink className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
              {searchableQuestions.length === 0 && (
                <div className="text-center py-8 text-sm text-surface-400">
                  {questions.length === 0 ? 'No questions yet. Use the + button on a chapter to create one.' : 'No questions match your search.'}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-500">{linkModal.questionIds.length} linked to this chapter</span>
              <Button onClick={() => setLinkModal(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
