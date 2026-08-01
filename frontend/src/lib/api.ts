import { supabase } from './supabase';
import { mockTests, mockQuestions, mockExams } from './mockData';
import { examMenuCategories } from './examMenuData';

function generateAttemptQuestionSet(testId: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `q_${testId}_${i}`,
    text: `Sample question #${i + 1}. ${['Which of the following is correct?', 'Choose the best option:', 'Identify the correct statement:'][i % 3]}`,
    options: [`Option A`, `Option B`, `Option C`, `Option D`],
    answer: `Option A`,
    subjectId: 'general',
    difficulty: 'medium',
  }));
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    localStorage.setItem('token', data.session?.access_token || '');
    return { token: data.session?.access_token, user: data.user };
  },

  register: async (data: { email: string; password: string; name: string; phone?: string }) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    });
    if (error) throw new Error(error.message);
    if (authData.session?.access_token) localStorage.setItem('token', authData.session.access_token);
    return { token: authData.session?.access_token, user: authData.user };
  },

  getProfile: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return { id: user.id, email: user.email, name: profile?.name || user.user_metadata?.name || user.email, role: profile?.role || 'student', phone: profile?.phone || '' };
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  },

  sendPhoneOtp: async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw new Error(error.message);
  },

  verifyPhoneOtp: async (phone: string, otp: string) => {
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    if (error) throw new Error(error.message);
  },

  googleLogin: async (idToken: string) => {
    const { data, error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
    if (error) throw new Error(error.message);
    return { token: data.session?.access_token, user: data.user };
  },

  // Exams
  getExams: async (category?: string) => {
    let query = supabase.from('exams').select('*');
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    if (error || !data?.length) return { data: category ? mockExams.filter(e => e.category === category) : mockExams, total: mockExams.length };
    return { data, total: data.length };
  },

  getExam: async (id: string) => {
    const { data, error } = await supabase.from('exams').select('*').eq('id', id).single();
    if (error || !data) return mockExams.find(e => e.id === id);
    return data;
  },

  getExamBySlug: async (slug: string) => {
    const { data, error } = await supabase.from('exams').select('*').eq('slug', slug).single();
    if (error || !data) {
      const mock = mockExams.find(e => e.slug === slug);
      if (mock) return mock;
      const menuCat = examMenuCategories.find(c => c.slug === slug);
      if (menuCat) {
        return {
          id: menuCat.slug,
          name: menuCat.name,
          shortName: menuCat.shortName,
          slug: menuCat.slug,
          description: menuCat.description,
          icon: '📘',
          color: menuCat.color,
          family: 'Other' as const,
          subjects: [],
          category: menuCat,
        };
      }
      for (const cat of examMenuCategories) {
        const sub = cat.exams.find(e => e.slug === slug);
        if (sub) {
          return {
            id: sub.slug,
            name: sub.name,
            shortName: sub.name,
            slug: sub.slug,
            description: sub.description,
            icon: sub.icon || '📘',
            color: cat.color,
            family: 'Other' as const,
            subjects: [],
            category: cat,
          };
        }
      }
      return undefined;
    }
    return data;
  },

  // Subjects
  getSubjects: async (examId: string) => {
    const { data, error } = await supabase.from('subjects').select('*').eq('exam_id', examId);
    if (error) return [];
    return data;
  },

  // Topics
  getTopics: async (subjectId: string) => {
    return [];
  },

  // Notes
  getNotes: async (params?: { examId?: string; subjectId?: string; topicId?: string; search?: string; page?: number }) => {
    return { data: [], total: 0, page: 1, totalPages: 1 };
  },

  getNote: async (id: string) => null,
  getNoteBySlug: async (slug: string) => null,

  // Questions
  getQuestions: async (params?: { examId?: string; subjectId?: string; topicId?: string; difficulty?: string; year?: number; page?: number }) => {
    let filtered = [...mockQuestions];
    if (params?.examId) filtered = filtered.filter(q => q.examId === params.examId);
    if (params?.difficulty) filtered = filtered.filter(q => q.difficulty === params.difficulty);
    if (params?.year) filtered = filtered.filter(q => q.year === params.year);
    const page = params?.page || 1;
    const limit = 50;
    return { data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, totalPages: Math.ceil(filtered.length / limit) };
  },

  getQuestion: async (id: string) => mockQuestions.find(q => q.id === id),

  // Tests
  getTests: async (params?: { examId?: string; type?: string; isFree?: boolean; page?: number }) => {
    let filtered = [...mockTests];
    if (params?.examId) filtered = filtered.filter(t => t.examId === params.examId);
    if (params?.type) filtered = filtered.filter(t => t.test_type === params.type);
    if (params?.isFree !== undefined) filtered = filtered.filter(t => t.isFree === params.isFree);
    const page = params?.page || 1;
    const limit = 50;
    return { data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, totalPages: Math.ceil(filtered.length / limit) };
  },

  getTest: async (id: string) => {
    const { data, error } = await supabase.from('tests').select('*').eq('id', id).single();
    if (error || !data) return mockTests.find(t => t.id === id);
    return data;
  },

  getTestBySlug: async (slug: string) => {
    const { data, error } = await supabase.from('tests').select('*').eq('slug', slug).single();
    if (error || !data) return mockTests.find(t => t.slug === slug);
    return data;
  },

  // Attempts
  startAttempt: async (testId: string) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');

    const test = mockTests.find(t => t.id === testId);
    if (!test) throw new Error('Test not found');

    const attemptId = `attempt_${Date.now()}`;
    const count = test.question_count || 10;
    const questions = generateAttemptQuestionSet(testId, count);

    const { error } = await supabase.from('attempts').insert({
      id: attemptId,
      user_id: user.id,
      test_id: testId,
      answers: [],
      status: 'in_progress',
      total_marks: test.totalMarks,
    });

    if (error) throw new Error(error.message);

    return { id: attemptId, testId, test: { ...test, questions }, status: 'in_progress', startedAt: new Date().toISOString(), answers: [] };
  },

  submitAttempt: async (attemptId: string, data: { answers: any[]; timeTaken?: number }) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');

    const { error } = await supabase.from('attempts').update({
      answers: data.answers,
      status: 'completed',
      submitted_at: new Date().toISOString(),
      time_taken: data.timeTaken,
    }).eq('id', attemptId).eq('user_id', user.id);

    if (error) throw new Error(error.message);
    return { status: 'completed', submittedAt: new Date().toISOString() };
  },

  getMyAttempts: async (page?: number) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { data: [], total: 0 };
    const { data, error } = await supabase.from('attempts').select('*').eq('user_id', user.id).order('started_at', { ascending: false });
    if (error) return { data: [], total: 0 };
    return { data, total: data.length };
  },

  getAttempt: async (id: string) => {
    const { data, error } = await supabase.from('attempts').select('*').eq('id', id).single();
    if (error || !data) {
      const testId = id.replace('attempt_', '');
      const t = mockTests.find(t => t.id === testId);
      if (!t) throw new Error('Attempt not found');
      const count = t.question_count || 10;
      return { id, testId, test: { ...t, questions: generateAttemptQuestionSet(testId, count) }, status: 'in_progress', startedAt: new Date().toISOString(), answers: [] };
    }
    const test = mockTests.find(t => t.id === data.test_id);
    const count = test?.question_count || 10;
    return { ...data, test: { ...test, questions: generateAttemptQuestionSet(data.test_id, count) } };
  },

  // Plans
  getPlans: async () => {
    const { data, error } = await supabase.from('plans').select('*');
    if (error || !data?.length) return { data: [{ id: '1', name: 'Free', price: 0, duration: 30, features: ['10 tests/month', 'Basic analytics'] }, { id: '2', name: 'Pro Monthly', price: 249, duration: 30, features: ['Unlimited tests', 'Detailed analytics', 'All mock tests', 'Priority support'] }] };
    return { data };
  },

  // Orders
  createOrder: async (planId: string, couponCode?: string) => {
    return { id: 'mock-order', status: 'completed' };
  },

  getMyOrders: async () => [],

  // Bookmarks
  getBookmarks: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };
    const { data } = await supabase.from('bookmarks').select('*').eq('user_id', user.id);
    return { data: data || [] };
  },

  addBookmark: async (data: { noteId?: string; questionId?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase.from('bookmarks').insert({ user_id: user.id, note_id: data.noteId, question_id: data.questionId });
    if (error) throw new Error(error.message);
  },

  removeBookmark: async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // Notifications
  getNotifications: async () => [],
  markNotificationRead: async (id: string) => {},
  markAllNotificationsRead: async () => {},

  // Dashboard
  getStudentDashboard: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let myAttempts: any[] = [];
    if (user) {
      const { data } = await supabase.from('attempts').select('*').eq('user_id', user.id);
      if (data) myAttempts = data;
    }

    const weeklyProgress = days.map((day, i) => ({
      day, tests: i < 3 ? Math.floor(Math.random() * 3) + 1 : 0,
      accuracy: i < 3 ? Math.floor(60 + Math.random() * 35) : 0,
    }));

    const subjectPerformance = [
      { subject: 'General Studies', base: 82 },
      { subject: 'Arithmetic', base: 65 },
      { subject: 'Reasoning', base: 74 },
      { subject: 'Current Affairs', base: 88 },
      { subject: 'Odisha GK', base: 71 },
      { subject: 'Science & Tech', base: 79 },
    ].map(s => ({ ...s, accuracy: s.base + Math.floor(Math.random() * 8 - 4), testsTaken: Math.floor(3 + Math.random() * 8) }));

    const weakAreas = [...subjectPerformance.filter(s => s.accuracy < 72).map(s => s.subject), 'Time & Work', 'Data Interpretation'].slice(0, 3);
    const strongAreas = [...subjectPerformance.filter(s => s.accuracy >= 78).map(s => s.subject), 'History', 'Geography'].slice(0, 3);

    const monthlyTrend = ['Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, i) => ({
      month, accuracy: 56 + i * 4 + Math.floor(Math.random() * 6),
      tests: 3 + Math.floor(Math.random() * 5),
    }));

    const recommendations = mockTests.filter(t => t.isFree).sort(() => Math.random() - 0.5).slice(0, 3).map(t => ({ id: t.id, title: t.title, duration: t.duration }));

    const totalThisWeek = weeklyProgress.reduce((sum, d) => sum + d.tests, 0);
    const avgAccuracy = myAttempts.length ? Math.round(myAttempts.reduce((s, a) => s + (a.accuracy || 0), 0) / myAttempts.length) : 0;

    const suggestions = [];
    const lowSubjects = subjectPerformance.filter(s => s.accuracy < 70);
    if (lowSubjects.length > 0) {
      suggestions.push({ type: 'warning', icon: 'Target', message: `Focus on ${lowSubjects[0].subject} — your accuracy (${lowSubjects[0].accuracy}%) needs improvement.`, action: 'Practice Now', link: '/my-tests' });
    }
    suggestions.push({ type: 'tip', icon: 'Lightbulb', message: 'You perform best in the morning. Schedule your mock tests before noon for sharper focus.', action: null, link: null });
    suggestions.push({ type: 'achievement', icon: 'Award', message: `${totalThisWeek} tests this week! Consistency is key.`, action: 'Keep Going', link: null });

    return {
      stats: { totalAttempts: myAttempts.length || monthlyTrend.reduce((s, m) => s + m.tests, 0), avgAccuracy: avgAccuracy || Math.round(monthlyTrend.reduce((s, m) => s + m.accuracy, 0) / monthlyTrend.length), totalBookmarks: 12, bestRank: 1 },
      recentAttempts: mockTests.sort(() => Math.random() - 0.5).slice(0, 5).map((t, i) => ({ id: `a${i}`, test: { title: t.title }, submittedAt: new Date(now.getTime() - i * 86400000 * 2).toISOString(), score: Math.floor(40 + Math.random() * 50), totalMarks: t.totalMarks || 100, accuracy: Math.round((Math.floor(40 + Math.random() * 50) / (t.totalMarks || 100)) * 100) })),
      recommendedTests: recommendations,
      upcomingTests: [{ title: 'Weekly Revision Test', scheduledAt: new Date(now.getTime() + 86400000 * 2).toISOString() }, { title: 'Full Mock Weekend Challenge', scheduledAt: new Date(now.getTime() + 86400000 * 4).toISOString() }],
      progress: { thisWeek: totalThisWeek, lastWeek: Math.max(1, totalThisWeek - Math.floor(Math.random() * 3)), streak: 5 + Math.floor(Math.random() * 8) },
      analytics: { weeklyProgress, subjectPerformance, weakAreas, strongAreas, monthlyTrend },
      suggestions,
    };
  },

  getAdminDashboard: async () => {
    return { stats: { totalUsers: 1000, totalTests: 29, totalAttempts: 45000, revenue: 25000 }, recentOrders: [], popularTests: mockTests.slice(0, 5) };
  },

  // Support
  createTicket: async (subject: string, message: string) => ({ id: 'mock-ticket', status: 'open' }),
  getMyTickets: async () => [],
  getTicket: async (id: string) => null,
  replyTicket: async (id: string, message: string) => {},

  // Blog
  getBlogPosts: async (page?: number) => ({ data: [], total: 0 }),
  getBlogPost: async (slug: string) => null,
};
