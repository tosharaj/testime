const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

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
  difficulty?: string | null;
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

  getQuestions: (params?: { limit?: number; search?: string }) =>
    request<{ data?: NcertQuestion[] }>(`/questions${toQuery({ limit: 500, ...params })}`),
  createQuestion: (body: any) =>
    request<NcertQuestion>('/questions', { method: 'POST', body: JSON.stringify(body) }),
  updateQuestion: (id: string, body: any) =>
    request<NcertQuestion>(`/questions/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteQuestion: (id: string) => request(`/questions/${id}`, { method: 'DELETE' }),

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
