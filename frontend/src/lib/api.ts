const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

import { mockTests, mockQuestions, mockExams } from './mockData';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const isClient = typeof window !== 'undefined';

  // Mock interceptor (returns mock data instead of fetching from dead backend)
  const url = endpoint.split('?')[0];
  const params = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');

  if (url === '/tests' && (!options.method || options.method === 'GET')) {
    const slug = params.get('slug');
    const id = params.get('id');
    const examId = params.get('examId');
    const type = params.get('type');
    const isFree = params.get('isFree');
    const page = parseInt(params.get('page') || '1', 10);
    const limit = 50;
    if (slug) { const t = mockTests.find(t => t.slug === slug); if (t) return t; }
    if (id) { const t = mockTests.find(t => t.id === id); if (t) return t; }
    let filtered = [...mockTests];
    if (examId) filtered = filtered.filter(t => t.examId === examId);
    if (type) filtered = filtered.filter(t => t.test_type === type);
    if (isFree !== null) filtered = filtered.filter(t => t.isFree === (isFree === 'true'));
    return { data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, totalPages: Math.ceil(filtered.length / limit) };
  }

  if (url === '/exams' && (!options.method || options.method === 'GET')) {
    const category = params.get('category');
    let data = category ? mockExams.filter(e => e.category === category) : mockExams;
    return { data, total: data.length };
  }

  if (url === '/attempts/start' && options.method === 'POST') {
    const body = JSON.parse(options.body as string);
    const test = mockTests.find(t => t.id === body.testId);
    if (!test) throw new Error('Test not found');
    const count = test.question_count || 10;
    const questions = Array.from({ length: count }, (_, i) => ({
      id: `q_${body.testId}_${i}`,
      text: `Sample question #${i + 1} for "${test.title}". ${['Which of the following is correct?', 'Choose the best option:', 'Identify the correct statement:'][i % 3]}`,
      options: [
        `Option A for question ${i + 1}`,
        `Option B for question ${i + 1}`,
        `Option C for question ${i + 1}`,
        `Option D for question ${i + 1}`,
      ],
      answer: `Option A for question ${i + 1}`,
      subjectId: 'general',
      difficulty: test.difficulty || 'medium',
    }));
    return {
      id: `attempt_${Date.now()}`,
      testId: test.id,
      test: { ...test, questions },
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      answers: [],
    };
  }

  if (url === '/attempts' && params.get('id')) {
    const attemptId = params.get('id');
    const t = mockTests.find(t => t.id === attemptId?.replace('attempt_', ''));
    if (t) {
      const count = t.question_count || 10;
      const questions = Array.from({ length: count }, (_, i) => ({
        id: `q_${t.id}_${i}`,
        text: `Sample question #${i + 1} for "${t.title}". ${['Which of the following is correct?', 'Choose the best option:', 'Identify the correct statement:'][i % 3]}`,
        options: [
          `Option A for question ${i + 1}`,
          `Option B for question ${i + 1}`,
          `Option C for question ${i + 1}`,
          `Option D for question ${i + 1}`,
        ],
        answer: `Option A for question ${i + 1}`,
        subjectId: 'general',
        difficulty: t.difficulty || 'medium',
      }));
      return {
        id: attemptId,
        testId: t.id,
        test: { ...t, questions },
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        answers: [],
      };
    }
  }

  if (url.startsWith('/attempts/') && url.endsWith('/submit') && options.method === 'POST') {
    return { status: 'completed', submittedAt: new Date().toISOString() };
  }

  // Handle getAttempt by path e.g. /attempts/attempt_123
  if (url.startsWith('/attempts/') && url.split('/').length === 3 && (!options.method || options.method === 'GET')) {
    const attemptId = url.split('/')[2];
    const testId = attemptId.replace('attempt_', '');
    const t = mockTests.find(t => t.id === testId);
    if (t) {
      const count = t.question_count || 10;
      const questions = Array.from({ length: count }, (_, i) => ({
        id: `q_${t.id}_${i}`,
        text: `Sample question #${i + 1} for "${t.title}". ${['Which of the following is correct?', 'Choose the best option:', 'Identify the correct statement:'][i % 3]}`,
        options: [`Option A for question ${i + 1}`, `Option B for question ${i + 1}`, `Option C for question ${i + 1}`, `Option D for question ${i + 1}`],
        answer: `Option A for question ${i + 1}`,
        subjectId: 'general',
        difficulty: t.difficulty || 'medium',
      }));
      return { id: attemptId, testId, test: { ...t, questions }, status: 'in_progress', startedAt: new Date().toISOString(), answers: [] };
    }
  }

  if (url === '/questions' && (!options.method || options.method === 'GET')) {
    const examId = params.get('examId');
    const difficulty = params.get('difficulty');
    const year = params.get('year');
    const page = parseInt(params.get('page') || '1', 10);
    const limit = 50;
    let filtered = [...mockQuestions];
    if (examId) filtered = filtered.filter(q => q.examId === examId);
    if (difficulty) filtered = filtered.filter(q => q.difficulty === difficulty);
    if (year) filtered = filtered.filter(q => q.year === parseInt(year, 10));
    return { data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, totalPages: Math.ceil(filtered.length / limit) };
  }

  if (url === '/plans' && (!options.method || options.method === 'GET')) {
    return { data: [
      { id: '1', name: 'Free', price: 0, duration: 30, features: ['10 tests/month', 'Basic analytics'] },
      { id: '2', name: 'Pro Monthly', price: 299, duration: 30, features: ['Unlimited tests', 'Detailed analytics', 'All mock tests'] },
      { id: '3', name: 'Pro Yearly', price: 1999, duration: 365, features: ['All Pro features', 'Priority support', 'Premium content'] },
    ]};
  }

  if (url === '/auth/login' && options.method === 'POST') {
    const body = JSON.parse(options.body as string);
    if (body.email === 'admin@testime.com' && body.password === 'password') {
      return { token: 'mock-token-admin', user: { id: '1', name: 'Admin', email: 'admin@testime.com', role: 'admin' } };
    }
    if (body.email && body.password) {
      return { token: 'mock-token-user', user: { id: '2', name: body.email.split('@')[0], email: body.email, role: 'student' } };
    }
    throw new Error('Invalid credentials');
  }

  if (url === '/auth/register' && options.method === 'POST') {
    const body = JSON.parse(options.body as string);
    return { token: 'mock-token-new', user: { id: '3', name: body.name || 'User', email: body.email, role: 'student' } };
  }

  if (url === '/auth/profile') {
    return { id: '2', name: 'Test User', email: 'user@testime.com', role: 'student', phone: '9876543210' };
  }

  if (url === '/dashboard/student') {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weeklyProgress = days.map((day, i) => {
      const r = Math.random();
      return {
        day,
        tests: r > 0.5 ? Math.floor(r * 3) + 1 : 0,
        accuracy: r > 0.5 ? Math.floor(60 + r * 35) : 0,
      };
    });

    const subjectPerformance = [
      { subject: 'General Studies', base: 82 },
      { subject: 'Arithmetic', base: 65 },
      { subject: 'Reasoning', base: 74 },
      { subject: 'Current Affairs', base: 88 },
      { subject: 'Odisha GK', base: 71 },
      { subject: 'Science & Tech', base: 79 },
    ].map(s => ({ ...s, accuracy: s.base + Math.floor(Math.random() * 8 - 4), testsTaken: Math.floor(3 + Math.random() * 8) }));

    const weakAreas = [
      ...subjectPerformance.filter(s => s.accuracy < 72).map(s => s.subject),
      'Time & Work', 'Data Interpretation',
    ].slice(0, 3);

    const strongAreas = [
      ...subjectPerformance.filter(s => s.accuracy >= 78).map(s => s.subject),
      'History', 'Geography',
    ].slice(0, 3);

    const monthlyTrend = ['Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, i) => ({
      month,
      accuracy: 56 + i * 4 + Math.floor(Math.random() * 6),
      tests: 3 + Math.floor(Math.random() * 5),
    }));

    const recommendations = mockTests
      .filter(t => t.isFree)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(t => ({ id: t.id, title: t.title, duration: t.duration }));

    const suggestions = [];

    const lowSubjects = subjectPerformance.filter(s => s.accuracy < 70);
    if (lowSubjects.length > 0) {
      suggestions.push({
        type: 'warning', icon: 'Target',
        message: `Focus on ${lowSubjects[0].subject} — your accuracy (${lowSubjects[0].accuracy}%) needs improvement. Try sectional tests.`,
        action: 'Practice Now', link: '/my-tests',
      });
    }

    suggestions.push({
      type: 'tip', icon: 'Lightbulb',
      message: 'You perform best in the morning. Schedule your mock tests before noon for sharper focus.',
      action: null, link: null,
    });

    const totalThisWeek = weeklyProgress.reduce((sum, d) => sum + d.tests, 0);
    suggestions.push({
      type: 'achievement', icon: 'Award',
      message: `${totalThisWeek} tests this week! Consistency is key. Keep building momentum.`,
      action: 'Keep Going', link: null,
    });

    const staleSubject = subjectPerformance.sort(() => Math.random() - 0.5).find(s => s.testsTaken < 4);
    if (staleSubject) {
      suggestions.push({
        type: 'info', icon: 'BookOpen',
        message: `You haven't revised ${staleSubject.subject} recently. Spend 20 mins on it today.`,
        action: 'Open Notes', link: '/my-notes',
      });
    }

    return {
      stats: {
        totalAttempts: monthlyTrend.reduce((s, m) => s + m.tests, 0),
        avgAccuracy: Math.round(monthlyTrend.reduce((s, m) => s + m.accuracy, 0) / monthlyTrend.length),
        totalBookmarks: 12 + Math.floor(Math.random() * 6),
        bestRank: Math.floor(Math.random() * 8) + 1,
      },
      recentAttempts: mockTests
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map((t, i) => {
          const score = Math.floor(40 + Math.random() * 50);
          const total = t.totalMarks || 100;
          return {
            id: `a${i}`,
            test: { title: t.title },
            submittedAt: new Date(now.getTime() - i * 86400000 * 2).toISOString(),
            score,
            totalMarks: total,
            accuracy: Math.round((score / total) * 100),
          };
        }),
      recommendedTests: recommendations,
      upcomingTests: [
        { title: 'Weekly Revision Test', scheduledAt: new Date(now.getTime() + 86400000 * 2).toISOString() },
        { title: 'Full Mock Weekend Challenge', scheduledAt: new Date(now.getTime() + 86400000 * 4).toISOString() },
      ],
      progress: { thisWeek: totalThisWeek, lastWeek: Math.max(1, totalThisWeek - Math.floor(Math.random() * 3)), streak: 5 + Math.floor(Math.random() * 8) },
      analytics: { weeklyProgress, subjectPerformance, weakAreas, strongAreas, monthlyTrend },
      suggestions,
    };
  }

  // Fallback to real fetch
  const token = isClient ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API Error');
  }
  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => fetchAPI('/auth/profile'),
  changePassword: (oldPassword: string, newPassword: string) =>
    fetchAPI('/auth/change-password', { method: 'POST', body: JSON.stringify({ oldPassword, newPassword }) }),

  // Mobile OTP Auth
  sendPhoneOtp: (phone: string) =>
    fetchAPI('/auth/send-phone-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyPhoneOtp: (phone: string, otp: string) =>
    fetchAPI('/auth/verify-phone-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),

  // Google Auth
  googleLogin: (idToken: string) =>
    fetchAPI('/auth/google-login', { method: 'POST', body: JSON.stringify({ idToken }) }),

  // Exams
  getExams: (category?: string) => fetchAPI(`/exams${category ? `?category=${category}` : ''}`),
  getExam: (id: string) => fetchAPI(`/exams/${id}`),
  getExamBySlug: (slug: string) => fetchAPI(`/exams/slug/${slug}`),

  // Subjects
  getSubjects: (examId: string) => fetchAPI(`/subjects/exam/${examId}`),

  // Topics
  getTopics: (subjectId: string) => fetchAPI(`/topics/subject/${subjectId}`),

  // Notes
  getNotes: (params?: { examId?: string; subjectId?: string; topicId?: string; search?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.examId) q.set('examId', params.examId);
    if (params?.subjectId) q.set('subjectId', params.subjectId);
    if (params?.topicId) q.set('topicId', params.topicId);
    if (params?.search) q.set('search', params.search);
    if (params?.page) q.set('page', params.page.toString());
    return fetchAPI(`/notes?${q}`);
  },
  getNote: (id: string) => fetchAPI(`/notes/${id}`),
  getNoteBySlug: (slug: string) => fetchAPI(`/notes/slug/${slug}`),

  // Questions
  getQuestions: (params?: { examId?: string; subjectId?: string; topicId?: string; difficulty?: string; year?: number; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.examId) q.set('examId', params.examId);
    if (params?.subjectId) q.set('subjectId', params.subjectId);
    if (params?.topicId) q.set('topicId', params.topicId);
    if (params?.difficulty) q.set('difficulty', params.difficulty);
    if (params?.year) q.set('year', params.year.toString());
    if (params?.page) q.set('page', params.page.toString());
    return fetchAPI(`/questions?${q}`);
  },
  getQuestion: (id: string) => fetchAPI(`/questions/${id}`),

  // Tests
  getTests: (params?: { examId?: string; type?: string; isFree?: boolean; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.examId) q.set('examId', params.examId);
    if (params?.type) q.set('type', params.type);
    if (params?.isFree !== undefined) q.set('isFree', params.isFree.toString());
    if (params?.page) q.set('page', params.page.toString());
    return fetchAPI(`/tests?${q}`);
  },
  getTest: (id: string) => fetchAPI(`/tests?id=${id}`),
  getTestBySlug: (slug: string) => fetchAPI(`/tests?slug=${slug}`),

  // Attempts
  startAttempt: (testId: string) =>
    fetchAPI('/attempts/start', { method: 'POST', body: JSON.stringify({ testId }) }),
  submitAttempt: (attemptId: string, data: { answers: any[]; timeTaken?: number }) =>
    fetchAPI(`/attempts/${attemptId}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  getMyAttempts: (page?: number) => fetchAPI(`/attempts?page=${page || 1}`),
  getAttempt: (id: string) => fetchAPI(`/attempts/${id}`),

  // Plans
  getPlans: () => fetchAPI('/plans'),

  // Orders
  createOrder: (planId: string, couponCode?: string) =>
    fetchAPI('/orders/create', { method: 'POST', body: JSON.stringify({ planId, couponCode }) }),
  getMyOrders: () => fetchAPI('/orders/my'),

  // Bookmarks
  getBookmarks: () => fetchAPI('/bookmarks'),
  addBookmark: (data: { noteId?: string; questionId?: string }) =>
    fetchAPI('/bookmarks', { method: 'POST', body: JSON.stringify(data) }),
  removeBookmark: (id: string) => fetchAPI(`/bookmarks/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => fetchAPI('/notifications'),
  markNotificationRead: (id: string) => fetchAPI(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => fetchAPI('/notifications/read-all', { method: 'POST' }),

  // Dashboard
  getStudentDashboard: () => fetchAPI('/dashboard/student'),
  getAdminDashboard: () => fetchAPI('/dashboard/admin'),

  // Support
  createTicket: (subject: string, message: string) =>
    fetchAPI('/support/tickets', { method: 'POST', body: JSON.stringify({ subject, message }) }),
  getMyTickets: () => fetchAPI('/support/tickets/my'),
  getTicket: (id: string) => fetchAPI(`/support/tickets/${id}`),
  replyTicket: (id: string, message: string) =>
    fetchAPI(`/support/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify({ message }) }),

  // Blog
  getBlogPosts: (page?: number) => fetchAPI(`/blog?page=${page || 1}`),
  getBlogPost: (slug: string) => fetchAPI(`/blog/slug/${slug}`),
};
