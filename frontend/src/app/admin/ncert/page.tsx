'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import {
  BookOpen, Plus, Edit2, Trash2, Search, GraduationCap, Link2, BrainCircuit,
  CheckCircle, AlertCircle, Unlink, ChevronLeft, RefreshCw, ServerOff, Layers, ListChecks,
  ClipboardList, FileText, Clock, Upload, FileDown, FileUp
} from 'lucide-react';
import { ncertApi, slugify, NcertBook, NcertChapter, NcertQuestion, NcertTest, NcertNote, ImportResult } from '@/lib/ncertApi';

const CLASSES = [6, 7, 8, 9, 10, 11, 12];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

interface BookForm { subject: string; name: string; slug: string; description: string; }
interface ChapterForm { name: string; slug: string; summary: string; order: string; }
interface QuestionForm { text: string; options: string[]; correctIndex: number; explanation: string; difficulty: string; }
interface QuizForm { title: string; duration: string; totalMarks: string; passingMarks: string; negativeMark: string; instructions: string; isFree: boolean; questionIds: string[]; }
interface NoteForm { title: string; summary: string; content: string; }

const emptyBookForm: BookForm = { subject: '', name: '', slug: '', description: '' };
const emptyChapterForm: ChapterForm = { name: '', slug: '', summary: '', order: '' };
const emptyQuestionForm: QuestionForm = { text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', difficulty: 'medium' };
const emptyQuizForm: QuizForm = { title: '', duration: '', totalMarks: '', passingMarks: '', negativeMark: '', instructions: '', isFree: true, questionIds: [] };
const emptyNoteForm: NoteForm = { title: '', summary: '', content: '' };

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

  const [testsByChapter, setTestsByChapter] = useState<Record<string, NcertTest[]>>({});
  const [quizModal, setQuizModal] = useState<{ open: boolean; chapter?: NcertChapter }>({ open: false });
  const [quizForm, setQuizForm] = useState<QuizForm>(emptyQuizForm);
  const [notesModal, setNotesModal] = useState<{ chapter: NcertChapter; linkedNoteIds: string[] } | null>(null);
  const [notesList, setNotesList] = useState<NcertNote[]>([]);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [noteForm, setNoteForm] = useState<NoteForm>(emptyNoteForm);
  const [noteSearch, setNoteSearch] = useState('');

  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importBusy, setImportBusy] = useState(false);

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

  const refreshTests = useCallback(async () => {
    if (!activeBookId) {
      setTestsByChapter({});
      return;
    }
    const chapters = books.find((b) => b.id === activeBookId)?.chapters ?? [];
    const results = await Promise.all(
      chapters.map(async (ch) => {
        try {
          return { id: ch.id, tests: await ncertApi.getTestsByChapter(ch.id) };
        } catch {
          return { id: ch.id, tests: [] as NcertTest[] };
        }
      })
    );
    const map: Record<string, NcertTest[]> = {};
    results.forEach((r) => {
      map[r.id] = r.tests;
    });
    setTestsByChapter(map);
  }, [activeBookId, books]);

  useEffect(() => {
    refreshTests();
  }, [refreshTests]);

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
  const linkedNoteCount = (chapter: NcertChapter) =>
    chapter.links?.filter((l) => l.noteId).length ?? 0;
  const quizCount = (chapterId: string) => testsByChapter[chapterId]?.length ?? 0;

  // ─── QUIZ ────────────────────────────────────────────────────────────────
  const openQuizModal = (chapter: NcertChapter) => {
    const linked = (chapter.links ?? []).filter((l) => l.questionId).map((l) => l.questionId as string);
    setQuizForm({ ...emptyQuizForm, questionIds: linked });
    setQuizModal({ open: true, chapter });
  };

  const handleSaveQuiz = async () => {
    const chapter = quizModal.chapter;
    if (!chapter) return;
    const duration = parseInt(quizForm.duration, 10);
    const totalMarks = parseInt(quizForm.totalMarks, 10);
    if (!quizForm.title.trim() || isNaN(duration) || isNaN(totalMarks)) {
      showNotice('Quiz title, duration and total marks are required.', true);
      return;
    }
    if (quizForm.questionIds.length === 0) {
      showNotice('Select at least one question for the quiz.', true);
      return;
    }
    setBusy(true);
    try {
      await ncertApi.createTest({
        title: quizForm.title.trim(),
        testType: 'NCERT_BASED_TEST',
        testMode: 'PRACTICE',
        accessType: quizForm.isFree ? 'FREE' : 'PREMIUM',
        duration,
        totalMarks,
        passingMarks: quizForm.passingMarks ? parseInt(quizForm.passingMarks, 10) : undefined,
        negativeMark: quizForm.negativeMark ? parseFloat(quizForm.negativeMark) : undefined,
        isFree: quizForm.isFree,
        instructions: quizForm.instructions.trim() || undefined,
        ncertChapterId: chapter.id,
        questionIds: quizForm.questionIds,
      });
      setQuizModal({ open: false });
      await refreshTests();
      showNotice('Quiz created and linked to the chapter.');
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteQuiz = async (test: NcertTest, chapter: NcertChapter) => {
    if (!window.confirm(`Delete quiz "${test.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await ncertApi.deleteTest(test.id);
      await refreshTests();
      showNotice('Quiz deleted.');
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  // ─── NOTES ───────────────────────────────────────────────────────────────
  const openNotesModal = async (chapter: NcertChapter) => {
    setBusy(true);
    setNoteForm(emptyNoteForm);
    setNoteSearch('');
    try {
      if (!notesLoaded) {
        const res = await ncertApi.getNotes();
        setNotesList(res?.data ?? []);
        setNotesLoaded(true);
      }
      const links = await ncertApi.getChapterLinks(chapter.id);
      setNotesModal({ chapter, linkedNoteIds: links.noteIds });
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  const toggleNoteLink = async (noteId: string) => {
    if (!notesModal) return;
    const exists = notesModal.linkedNoteIds.includes(noteId);
    const updated = exists
      ? notesModal.linkedNoteIds.filter((id) => id !== noteId)
      : [...notesModal.linkedNoteIds, noteId];
    const prev = notesModal.linkedNoteIds;
    setNotesModal({ ...notesModal, linkedNoteIds: updated });
    try {
      await ncertApi.setChapterLinks(notesModal.chapter.id, { noteIds: updated });
      await load(activeClass);
    } catch (e: any) {
      setNotesModal({ ...notesModal, linkedNoteIds: prev });
      showNotice(e.message, true);
    }
  };

  const handleCreateNote = async () => {
    const chapter = notesModal?.chapter;
    if (!chapter) return;
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      showNotice('Note title and content are required.', true);
      return;
    }
    setBusy(true);
    try {
      const created = await ncertApi.createNote({
        title: noteForm.title.trim(),
        summary: noteForm.summary.trim() || undefined,
        content: noteForm.content,
        contentType: 'markdown',
        tags: 'NCERT',
        isPublished: true,
      });
      setNotesList((prev) => (prev.some((n) => n.id === created.id) ? prev : [created, ...prev]));
      const updated = [...(notesModal?.linkedNoteIds ?? []), created.id];
      await ncertApi.setChapterLinks(chapter.id, { noteIds: updated });
      setNotesModal({ ...notesModal!, linkedNoteIds: updated });
      setNoteForm(emptyNoteForm);
      await load(activeClass);
      showNotice('Note created and linked to the chapter.');
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  // ─── BULK IMPORT ────────────────────────────────────────────────────────
  const IMPORT_TEMPLATE_HEADER =
    'class,subject,book,chapter,question,option_a,option_b,option_c,option_d,correct,explanation,difficulty';

  const downloadImportTemplate = () => {
    const sample = [
      '6,History,Our Pasts I,What Where How and When?,What did early people use to make tools?,Stone and wood,Copper,Iron,Bronze,A,Explanation text,medium',
      '11,Polity,Indian Constitution at Work,Constitution: Why and How?,Which date marks the adoption of the Constitution?,26 January 1950,15 August 1947,26 November 1949,2 October 1948,C,,easy',
      '6,History,Our Pasts I,From Hunting-Gathering to Growing Food,,,,,,,',
    ].join('\n');
    const blob = new Blob(['\uFEFF' + IMPORT_TEMPLATE_HEADER + '\n' + sample + '\n'], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ncert-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportFile(e.target.files?.[0] || null);
    setImportResult(null);
  };

  const handleRunImport = async () => {
    if (!importFile) {
      showNotice('Choose a CSV file first.', true);
      return;
    }
    setImportBusy(true);
    setImportResult(null);
    try {
      const text = await importFile.text();
      const result = await ncertApi.importNcertCsv(text.replace(/^\uFEFF/, ''));
      setImportResult(result);
      await load(activeClass);
      if (result.errors.length) showNotice(`Import finished with ${result.errors.length} row error(s).`, true);
      else showNotice('Import completed successfully.');
    } catch (e: any) {
      showNotice(e.message, true);
    } finally {
      setImportBusy(false);
    }
  };

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
                    <th className="px-5 py-3 max-w-[260px]">Summary</th>
                    <th className="px-5 py-3 text-center">MCQs</th>
                    <th className="px-5 py-3 text-center">Quizzes</th>
                    <th className="px-5 py-3 text-center">Notes</th>
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
                      <td className="px-5 py-4 text-center">
                        <Badge variant={quizCount(ch.id) > 0 ? 'success' : 'default'} size="sm">
                          <ClipboardList className="h-3 w-3 mr-0.5" />{quizCount(ch.id)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge variant={linkedNoteCount(ch) > 0 ? 'success' : 'default'} size="sm">
                          <FileText className="h-3 w-3 mr-0.5" />{linkedNoteCount(ch)}
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
                            onClick={() => openQuizModal(ch)}
                            className="p-2 text-surface-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
                            title="Create Quiz"
                          >
                            <ClipboardList className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openNotesModal(ch)}
                            className="p-2 text-surface-400 hover:text-violet-600 rounded-xl hover:bg-violet-50 transition-colors"
                            title="Notes & Materials"
                          >
                            <FileText className="h-4 w-4" />
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
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setImportOpen(true)} disabled={!backendOk || busy}>
                  <Upload className="h-4 w-4 mr-1" /> Bulk Import
                </Button>
                <Button size="sm" onClick={() => openBookModal()} disabled={!backendOk || busy}>
                  <Plus className="h-4 w-4 mr-1" /> Add Book
                </Button>
              </div>
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

      {/* ── QUIZ MODAL ──────────────────────────────────────────────────── */}
      <Modal isOpen={quizModal.open} onClose={() => setQuizModal({ open: false })} title={`Create Quiz — ${quizModal.chapter?.name ?? ''}`} size="lg">
        {quizModal.chapter && (
          <div className="space-y-4">
            <p className="text-sm text-surface-500">
              Build a chapter quiz from its linked MCQs. It will appear as a "Take Test" option for students.
            </p>
            <div className={fieldCls}>
              <label className="block text-sm font-medium text-surface-700">Quiz title</label>
              <Input value={quizForm.title} onChange={(e) => setQuizForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. The French Revolution — Quiz" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className={fieldCls}>
                <label className="block text-sm font-medium text-surface-700">Duration (min)</label>
                <Input type="number" value={quizForm.duration} onChange={(e) => setQuizForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 10" />
              </div>
              <div className={fieldCls}>
                <label className="block text-sm font-medium text-surface-700">Total marks</label>
                <Input type="number" value={quizForm.totalMarks} onChange={(e) => setQuizForm((f) => ({ ...f, totalMarks: e.target.value }))} placeholder="e.g. 20" />
              </div>
              <div className={fieldCls}>
                <label className="block text-sm font-medium text-surface-700">Negative mark</label>
                <Input type="number" step="0.25" value={quizForm.negativeMark} onChange={(e) => setQuizForm((f) => ({ ...f, negativeMark: e.target.value }))} placeholder="0.25 (blank = none)" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={fieldCls}>
                <label className="block text-sm font-medium text-surface-700">Passing marks (optional)</label>
                <Input type="number" value={quizForm.passingMarks} onChange={(e) => setQuizForm((f) => ({ ...f, passingMarks: e.target.value }))} placeholder="e.g. 8" />
              </div>
              <div className={fieldCls}>
                <label className="block text-sm font-medium text-surface-700">Access</label>
                <select
                  value={quizForm.isFree ? 'FREE' : 'PREMIUM'}
                  onChange={(e) => setQuizForm((f) => ({ ...f, isFree: e.target.value === 'FREE' }))}
                  className={inputCls}
                >
                  <option value="FREE">Free</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>
            </div>
            <div className={fieldCls}>
              <label className="block text-sm font-medium text-surface-700">Instructions</label>
              <textarea value={quizForm.instructions} onChange={(e) => setQuizForm((f) => ({ ...f, instructions: e.target.value }))} rows={2} className={inputCls} placeholder="Optional instructions shown before the quiz starts" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-700 mb-2">Questions ({quizForm.questionIds.length} selected)</p>
              <div className="max-h-[30vh] overflow-y-auto space-y-2 rounded-xl border border-surface-200 p-3">
                {(quizModal.chapter.links ?? []).filter((l) => l.question).map((l) => {
                  const q = l.question!;
                  const selected = quizForm.questionIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() =>
                        setQuizForm((f) => ({
                          ...f,
                          questionIds: selected ? f.questionIds.filter((id) => id !== q.id) : [...f.questionIds, q.id],
                        }))
                      }
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                        selected ? 'border-indigo-200 bg-indigo-50/50' : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <div className="mt-0.5">
                        {selected ? (
                          <CheckCircle className="h-5 w-5 text-indigo-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-surface-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-900">{q.text}</p>
                        <Badge size="sm">{q.difficulty ?? 'medium'}</Badge>
                      </div>
                    </div>
                  );
                })}
                {(quizModal.chapter.links ?? []).filter((l) => l.question).length === 0 && (
                  <p className="text-center text-sm text-surface-400 py-6">
                    No linked MCQs yet. Link or add questions to this chapter first.
                  </p>
                )}
              </div>
            </div>
            {quizCount(quizModal.chapter.id) > 0 && (
              <div>
                <p className="text-sm font-medium text-surface-700 mb-2">Existing quizzes</p>
                <div className="space-y-2">
                  {(testsByChapter[quizModal.chapter.id] ?? []).map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-surface-200">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-900 truncate">{t.title}</p>
                        <p className="text-xs text-surface-400">
                          <Clock className="h-3 w-3 inline mr-0.5" />{t.duration} min · {t._count?.questions ?? 0} Qs · {t.totalMarks} marks · {t.isFree ? 'Free' : 'Premium'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteQuiz(t, quizModal.chapter!)}
                        className="p-2 text-surface-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors shrink-0"
                        title="Delete Quiz"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setQuizModal({ open: false })}>Cancel</Button>
              <Button onClick={handleSaveQuiz} disabled={busy}>{busy ? 'Creating…' : 'Create Quiz'}</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── NOTES MODAL ─────────────────────────────────────────────────── */}
      <Modal isOpen={!!notesModal} onClose={() => setNotesModal(null)} title="Notes & Materials" size="lg">
        {notesModal && (
          <div className="space-y-5">
            <p className="text-sm text-surface-500">
              {notesModal.chapter.name} · {notesModal.linkedNoteIds.length} linked
            </p>

            <div className="rounded-2xl border border-surface-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-surface-700">Create a new note</p>
              <div className={fieldCls}>
                <label className="block text-sm font-medium text-surface-700">Title</label>
                <Input value={noteForm.title} onChange={(e) => setNoteForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. The French Revolution — Key Facts" />
              </div>
              <div className={fieldCls}>
                <label className="block text-sm font-medium text-surface-700">Summary</label>
                <Input value={noteForm.summary} onChange={(e) => setNoteForm((f) => ({ ...f, summary: e.target.value }))} placeholder="One-line summary shown on the chapter page" />
              </div>
              <div className={fieldCls}>
                <label className="block text-sm font-medium text-surface-700">Content</label>
                <textarea value={noteForm.content} onChange={(e) => setNoteForm((f) => ({ ...f, content: e.target.value }))} rows={4} className={inputCls} placeholder="Write the material. Plain text / Markdown supported." />
              </div>
              <div className="flex items-center justify-end">
                <Button size="sm" onClick={handleCreateNote} disabled={busy}>{busy ? 'Saving…' : 'Create & Link'}</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-surface-700 mb-2">Link existing notes</p>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
                <input
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  placeholder="Search notes…"
                  className="w-full rounded-xl border-2 border-surface-200 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
              <div className="max-h-[30vh] overflow-y-auto space-y-2 rounded-xl border border-surface-200 p-3">
                {notesList
                  .filter((n) => !noteSearch || n.title.toLowerCase().includes(noteSearch.toLowerCase()))
                  .map((n) => {
                    const linked = notesModal.linkedNoteIds.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => toggleNoteLink(n.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                          linked ? 'border-violet-200 bg-violet-50/50' : 'border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <div className="mt-0.5">
                          {linked ? (
                            <CheckCircle className="h-5 w-5 text-violet-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-surface-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-900">{n.title}</p>
                          {n.summary && <p className="text-xs text-surface-400 mt-0.5 truncate">{n.summary}</p>}
                        </div>
                      </div>
                    );
                  })}
                {notesList.length === 0 && (
                  <p className="text-center text-sm text-surface-400 py-6">No notes yet. Create one above.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-500">{notesModal.linkedNoteIds.length} linked to this chapter</span>
              <Button onClick={() => setNotesModal(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── IMPORT MODAL ────────────────────────────────────────────────── */}
      <Modal isOpen={importOpen} onClose={() => setImportOpen(false)} title="Bulk Import (CSV)" size="lg">
        <div className="space-y-4">
          <div className="rounded-2xl border border-surface-200 p-4 space-y-2">
            <p className="text-sm font-semibold text-surface-700">How it works</p>
            <p className="text-xs text-surface-500 leading-relaxed">
              Upload a CSV with one row per question. Books and chapters are created automatically if they don't exist.
              Rows without a question only create the book/chapter. Questions already linked to a chapter are skipped.
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={downloadImportTemplate}>
                <FileDown className="h-4 w-4 mr-1" /> Download Template
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-surface-300 bg-surface-50 p-4 text-center">
            <FileUp className="h-8 w-8 text-surface-400 mx-auto mb-2" />
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleImportFileChange}
              className="mx-auto text-sm text-surface-600 file:mr-3 file:rounded-xl file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600"
            />
            {importFile && (
              <p className="mt-2 text-xs text-surface-500">
                {importFile.name} · {(importFile.size / 1024).toFixed(1)} KB
              </p>
            )}
          </div>

          {importResult && (
            <div className="rounded-2xl border border-mint-200 bg-mint-50 p-4 text-sm space-y-2">
              <p className="font-semibold text-mint-700">Import complete</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="rounded-xl bg-white p-2">
                  <p className="text-lg font-bold text-surface-900">{importResult.booksCreated}</p>
                  <p className="text-xs text-surface-500">Books</p>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <p className="text-lg font-bold text-surface-900">{importResult.chaptersCreated}</p>
                  <p className="text-xs text-surface-500">Chapters</p>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <p className="text-lg font-bold text-surface-900">{importResult.questionsCreated}</p>
                  <p className="text-xs text-surface-500">Questions</p>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <p className="text-lg font-bold text-surface-900">{importResult.questionsSkipped}</p>
                  <p className="text-xs text-surface-500">Skipped</p>
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-xl bg-white p-3">
                  <p className="text-xs font-semibold text-coral-700 mb-1">
                    {importResult.errors.length} row error(s):
                  </p>
                  <ul className="space-y-1">
                    {importResult.errors.map((e, idx) => (
                      <li key={idx} className="text-xs text-surface-600">
                        Row {e.row}: {e.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setImportOpen(false)}>Close</Button>
            <Button onClick={handleRunImport} disabled={!importFile || importBusy}>
              {importBusy ? 'Importing…' : 'Import CSV'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
