import { API_BASE } from '@/lib/apiBase';

export function getBackendToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('backendToken');
}

export function setBackendToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('backendToken', token);
  else localStorage.removeItem('backendToken');
}

function toQuery(params?: Record<string, any>): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export interface ApiError extends Error {
  status?: number;
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getBackendToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    const err: ApiError = new Error('Backend is not reachable. Make sure the backend server is running.');
    err.status = 0;
    throw err;
  }

  if (res.status === 401 || res.status === 403) {
    const err: ApiError = new Error('You are not authorized for this action. Sign in again.');
    err.status = res.status;
    throw err;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = body?.message || body?.error || `Request failed (${res.status})`;
    const err: ApiError = new Error(Array.isArray(msg) ? msg.join(', ') : msg);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface NcertBook {
  id: string;
  class: number;
  subject: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  chapters?: NcertChapter[];
}

export interface NcertLinkedQuestion {
  id: string;
  text: string;
  options?: string | null;
  correctAns?: string | null;
  explanation?: string | null;
  difficulty?: string | null;
  sourceType?: string | null;
  isPublished?: boolean;
}

export interface NcertLinkedNote {
  id: string;
  title: string;
  summary?: string | null;
}

export interface NcertNote {
  id: string;
  title: string;
  slug?: string;
  summary?: string | null;
  content?: string;
  isPublished?: boolean;
  createdAt?: string;
}

export interface NcertTest {
  id: string;
  title: string;
  slug: string;
  testType?: string | null;
  testMode?: string | null;
  accessType?: string | null;
  duration: number;
  totalMarks: number;
  passingMarks?: number | null;
  negativeMark?: number | null;
  isFree?: boolean;
  isPublished?: boolean;
  status?: string | null;
  instructions?: string | null;
  createdAt?: string;
  _count?: { questions: number };
}

export interface NcertChapterLink {
  id: string;
  questionId?: string | null;
  noteId?: string | null;
  chapterId?: string | null;
  question?: NcertLinkedQuestion | null;
}

export interface NcertChapter {
  id: string;
  bookId: string;
  name: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  order: number;
  book?: { id: string; class: number; subject: string; name: string };
  links?: NcertChapterLink[];
}

export interface NcertQuestion {
  id: string;
  text: string;
  options?: string | null;
  correctAns?: string | null;
  explanation?: string | null;
  difficulty?: string | null;
  sourceType?: string | null;
  isPublished?: boolean;
  createdAt?: string;
}

export interface ChapterLinks {
  chapterId: string;
  questionIds: string[];
  noteIds: string[];
  chapterIds: string[];
  count: number;
  questions?: NcertLinkedQuestion[];
  notes?: NcertLinkedNote[];
}

export interface ImportResult {
  booksCreated: number;
  chaptersCreated: number;
  questionsCreated: number;
  questionsSkipped: number;
  errors: { row: number; message: string }[];
}

export interface PracticeQuestion {
  id: string;
  text: string;
  options: string[];
  correctAns: string;
  explanation?: string | null;
  difficulty?: string | null;
}

export interface ChapterTest {
  id: string;
  slug: string;
  title: string;
  duration: number;
  totalMarks: number;
  questionCount: number;
}

export interface ChapterQuiz {
  chapter: {
    id: string;
    name: string;
    slug: string;
    summary?: string | null;
    book: { name: string; slug: string; class: number; subject: string };
  };
  questions: PracticeQuestion[];
  tests: ChapterTest[];
}

export const ncertApi = {
  getBooks: (params?: { class?: number; includeChapters?: boolean }) =>
    request<NcertBook[]>(`/ncert/books${toQuery(params)}`),
  createBook: (body: Partial<NcertBook>) =>
    request<NcertBook>('/ncert/books', { method: 'POST', body: JSON.stringify(body) }),
  updateBook: (id: string, body: Partial<NcertBook>) =>
    request<NcertBook>(`/ncert/books/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteBook: (id: string) => request(`/ncert/books/${id}`, { method: 'DELETE' }),

  getChapters: (bookId?: string) =>
    request<NcertChapter[]>(`/ncert/chapters${bookId ? `?bookId=${bookId}` : ''}`),
  createChapter: (body: any) =>
    request<NcertChapter>('/ncert/chapters', { method: 'POST', body: JSON.stringify(body) }),
  updateChapter: (id: string, body: any) =>
    request<NcertChapter>(`/ncert/chapters/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteChapter: (id: string) => request(`/ncert/chapters/${id}`, { method: 'DELETE' }),

  getChapterLinks: (id: string) => request<ChapterLinks>(`/ncert/chapters/${id}/links`),
  setChapterLinks: (id: string, body: Partial<ChapterLinks>) =>
    request<ChapterLinks>(`/ncert/chapters/${id}/links`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  importNcertCsv: (csv: string) =>
    request<ImportResult>('/ncert/import', {
      method: 'POST',
      body: JSON.stringify({ csv }),
    }),

  getChapterQuiz: (bookSlug: string, chapterSlug: string) =>
    request<ChapterQuiz>(`/ncert/books/${bookSlug}/chapters/${chapterSlug}/quiz`),
  getTest: (id: string) => request<any>(`/tests/${id}`),

  getQuestions: (params?: { limit?: number; search?: string }) =>
    request<{ data?: NcertQuestion[] }>(`/questions${toQuery({ limit: 500, ...params })}`),
  createQuestion: (body: any) =>
    request<NcertQuestion>('/questions', { method: 'POST', body: JSON.stringify(body) }),
  updateQuestion: (id: string, body: any) =>
    request<NcertQuestion>(`/questions/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteQuestion: (id: string) => request(`/questions/${id}`, { method: 'DELETE' }),

  getTestsByChapter: (chapterId: string) => request<NcertTest[]>(`/tests/by-chapter/${chapterId}`),
  createTest: (body: any) => request<NcertTest>('/tests', { method: 'POST', body: JSON.stringify(body) }),
  deleteTest: (id: string) => request(`/tests/${id}`, { method: 'DELETE' }),

  getNotes: (params?: { limit?: number; search?: string }) =>
    request<{ data?: NcertNote[] }>(`/notes${toQuery({ limit: 100, ...params })}`),
  createNote: (body: any) =>
    request<NcertNote>('/notes', { method: 'POST', body: JSON.stringify(body) }),

  backendLogin: async (email: string, password: string) =>
    request<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
