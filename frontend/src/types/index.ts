export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'STUDENT' | 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'QUESTION_MANAGER' | 'TEST_MANAGER' | 'SUPPORT_EXECUTIVE' | 'FINANCE_ADMIN' | 'ANALYST';
  targetExam?: string;
  language: string;
  emailVerified: boolean;
  createdAt: string;
}

// ─── LAYER 1: EXAM TAXONOMY ──────────────────────────────────────────────

export type ExamFamily = 'OPSC' | 'OSSC' | 'OSSSC' | 'OdishaPolice' | 'Railway' | 'SSC' | 'Banking' | 'Other';
export type ExamStage = 'PRELIMS' | 'MAINS' | 'INTERVIEW' | 'SKILL_TEST' | 'PET' | 'DOCUMENT_VERIFICATION';

export interface Exam {
  id: string;
  name: string;
  slug: string;
  shortName?: string;
  description?: string;
  icon?: string;
  color?: string;
  family: ExamFamily;
  stage?: ExamStage;
  subjects?: Subject[];
}

// ─── LAYER 2: TEST TAXONOMY ──────────────────────────────────────────────

export type TestType = 'FULL_MOCK' | 'SECTIONAL' | 'TOPIC_WISE' | 'PYQ_TEST' | 'DAILY_QUIZ' | 'WEEKLY_REVISION' | 'MONTHLY_GRAND_TEST' | 'NCERT_BASED_TEST' | 'STATIC_GK_TEST' | 'CURRENT_AFFAIRS_TEST';
export type TestMode = 'PRACTICE' | 'TIMED' | 'LEARNING';
export type AccessType = 'FREE' | 'PREMIUM' | 'PAID';

// ─── LAYER 3: SUBJECT TAXONOMY ──────────────────────────────────────────

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  examId: string;
  papers?: Paper[];
  chapters?: Chapter[];
  topics?: Topic[];
}

export interface Paper {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subjectId: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  slug: string;
  description?: string;
  paperId?: string;
  subjectId?: string;
  topics?: Topic[];
  notes?: Note[];
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  subjectId: string;
  chapterId?: string;
  subTopics?: Subtopic[];
}

export interface Subtopic {
  id: string;
  name: string;
  slug: string;
  topicId: string;
}

// ─── LAYER 4: SOURCE TAXONOMY ───────────────────────────────────────────

export type SourceType = 'NCERT' | 'PYQ' | 'CURRENT_AFFAIRS' | 'STANDARD_BOOK' | 'MIXED';

// ─── NCERT ──────────────────────────────────────────────────────────────

export interface NcertBook {
  id: string;
  class: number;
  subject: string;
  name: string;
  slug: string;
  description?: string;
  chapters?: NcertChapter[];
}

export interface NcertChapter {
  id: string;
  bookId: string;
  book?: NcertBook;
  name: string;
  slug: string;
  summary?: string;
  content?: string;
  order: number;
}

// ─── NOTE ────────────────────────────────────────────────────────────────────

export interface Note {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  isPremium: boolean;
  isPublished?: boolean;
  viewCount: number;
  thumbnail?: string;
  downloadUrl?: string;
  tags?: string;
  exam?: { name: string; slug: string };
  subject?: { name: string; slug: string };
  chapter?: { name: string; slug: string };
  topic?: { name: string; slug: string };
  createdAt: string;
}

// ─── QUESTION ────────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  text: string;
  options?: string;
  correctAns?: string;
  explanation?: string;
  questionType: string;
  difficulty: string;
  year?: number;
  source?: string;
  sourceType: SourceType;
  exam?: { name: string };
  subject?: { name: string };
  chapter?: { name: string };
  topic?: { name: string };
  subtopic?: { name: string };
}

// ─── TEST ────────────────────────────────────────────────────────────────────

export interface Test {
  id: string;
  title: string;
  slug: string;
  description?: string;
  testType: TestType;
  testMode: TestMode;
  accessType: AccessType;
  duration: number;
  totalMarks: number;
  passingMarks?: number;
  negativeMark?: number;
  isFree: boolean;
  price?: number;
  exam?: { name: string; slug: string };
  ncertChapter?: { name: string; slug: string };
  questions?: TestQuestion[];
  scheduledAt?: string;
  createdAt: string;
}

export interface TestQuestion {
  id: string;
  question: Question;
  marks: number;
  order: number;
}

export interface Attempt {
  id: string;
  userId: string;
  testId: string;
  test: Test;
  answers?: string;
  score?: number;
  totalMarks?: number;
  accuracy?: number;
  percentile?: number;
  rank?: number;
  timeTaken?: number;
  status: string;
  startedAt: string;
  submittedAt?: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  durationDays: number;
  features?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  plan: Plan;
  createdAt: string;
}

export interface DashboardStats {
  totalAttempts: number;
  avgAccuracy: number;
  totalBookmarks: number;
}
