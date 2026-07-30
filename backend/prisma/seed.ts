import { PrismaClient } from '@prisma/client';
import { UserRole, ExamFamily, TestType, TestMode, AccessType, SourceType } from '../src/common/enums';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@testtime.in' },
    update: {},
    create: {
      email: 'admin@testtime.in',
      password: adminPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@testtime.in' },
    update: {},
    create: {
      email: 'editor@testtime.in',
      password: adminPassword,
      name: 'Content Editor',
      role: UserRole.CONTENT_EDITOR,
      emailVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      password: userPassword,
      name: 'Test Student',
      role: UserRole.STUDENT,
      emailVerified: true,
    },
  });

  // ─── LAYER 1: EXAM TAXONOMY ──────────────────────────────────────────────
  // exam_family / exam_name / exam_stage

  const ssc = await prisma.exam.upsert({
    where: { slug: 'ssc' },
    update: {},
    create: { name: 'SSC Exams', slug: 'ssc', shortName: 'SSC', description: 'Staff Selection Commission Exams', family: ExamFamily.SSC, icon: '📋', color: '#2563eb', order: 1 },
  });

  const sscCgl = await prisma.exam.upsert({
    where: { slug: 'ssc-cgl' },
    update: {},
    create: { name: 'SSC CGL', slug: 'ssc-cgl', shortName: 'CGL', description: 'Combined Graduate Level Exam', family: ExamFamily.SSC, stage: 'PRELIMS', icon: '📋', color: '#2563eb', order: 2 },
  });

  const sscChsl = await prisma.exam.upsert({
    where: { slug: 'ssc-chsl' },
    update: {},
    create: { name: 'SSC CHSL', slug: 'ssc-chsl', shortName: 'CHSL', description: 'Combined Higher Secondary Level Exam', family: ExamFamily.SSC, stage: 'PRELIMS', icon: '📋', color: '#3b82f6', order: 3 },
  });

  const banking = await prisma.exam.upsert({
    where: { slug: 'banking' },
    update: {},
    create: { name: 'Banking Exams', slug: 'banking', shortName: 'Banking', description: 'IBPS, SBI, RBI Exams', family: ExamFamily.Banking, icon: '🏦', color: '#dc2626', order: 4 },
  });

  const upsc = await prisma.exam.upsert({
    where: { slug: 'upsc' },
    update: {},
    create: { name: 'UPSC Exams', slug: 'upsc', shortName: 'UPSC', description: 'Union Public Service Commission Exams', family: ExamFamily.Other, icon: '🏛️', color: '#059669', order: 5 },
  });

  const railways = await prisma.exam.upsert({
    where: { slug: 'railways' },
    update: {},
    create: { name: 'Railways Exams', slug: 'railways', shortName: 'Railways', description: 'RRB Exams', family: ExamFamily.Railway, icon: '🚂', color: '#ca8a04', order: 6 },
  });

  const opsc = await prisma.exam.upsert({
    where: { slug: 'opsc' },
    update: {},
    create: { name: 'OPSC', slug: 'opsc', shortName: 'OPSC', description: 'Odisha Public Service Commission', family: ExamFamily.OPSC, stage: 'PRELIMS', icon: '🏛️', color: '#7c3aed', order: 7 },
  });

  const ossc = await prisma.exam.upsert({
    where: { slug: 'ossc' },
    update: {},
    create: { name: 'OSSC', slug: 'ossc', shortName: 'OSSC', description: 'Odisha Staff Selection Commission', family: ExamFamily.OSSC, stage: 'PRELIMS', icon: '📋', color: '#0891b2', order: 8 },
  });

  const osssc = await prisma.exam.upsert({
    where: { slug: 'osssc' },
    update: {},
    create: { name: 'OSSSC', slug: 'osssc', shortName: 'OSSSC', description: 'Odisha Subordinate Staff Selection Commission', family: ExamFamily.OSSSC, stage: 'PRELIMS', icon: '👥', color: '#d97706', order: 9 },
  });

  const odishaPolice = await prisma.exam.upsert({
    where: { slug: 'odisha-police' },
    update: {},
    create: { name: 'Odisha Police', slug: 'odisha-police', shortName: 'Police', description: 'Odisha Police Recruitment', family: ExamFamily.OdishaPolice, stage: 'PRELIMS', icon: '👮', color: '#1e40af', order: 10 },
  });

  // ─── LAYER 3: SUBJECT TAXONOMY ──────────────────────────────────────────
  // Subject → Paper → Chapter → Topic → Subtopic

  // SSC General Knowledge subject with paper/chapter/topic structure
  const sscGk = await prisma.subject.upsert({
    where: { examId_name: { examId: ssc.id, name: 'General Knowledge' } },
    update: {},
    create: { name: 'General Knowledge', slug: 'general-knowledge', examId: ssc.id, order: 1, description: 'Current affairs, history, geography, polity' },
  });

  // Paper level
  const polityPaper = await prisma.paper.upsert({
    where: { subjectId_name: { subjectId: sscGk.id, name: 'Polity & Governance' } },
    update: {},
    create: { name: 'Polity & Governance', slug: 'polity-governance', subjectId: sscGk.id, description: 'Indian Constitution, governance, political system' },
  });

  const historyPaper = await prisma.paper.upsert({
    where: { subjectId_name: { subjectId: sscGk.id, name: 'History' } },
    update: {},
    create: { name: 'History', slug: 'history', subjectId: sscGk.id, description: 'Indian history from ancient to modern' },
  });

  // Chapter level under Paper
  const constitutionChapter = await prisma.chapter.upsert({
    where: { id: 'chapter-constitution' },
    update: {},
    create: { id: 'chapter-constitution', name: 'Indian Constitution', slug: 'indian-constitution', description: 'Constitution of India - key features, preamble, fundamental rights', paperId: polityPaper.id, subjectId: sscGk.id },
  });

  const ammendmentsChapter = await prisma.chapter.upsert({
    where: { id: 'chapter-amendments' },
    update: {},
    create: { id: 'chapter-amendments', name: 'Constitutional Amendments', slug: 'constitutional-amendments', description: 'Major amendments including 42nd, 44th, 73rd, 74th, 101st', paperId: polityPaper.id, subjectId: sscGk.id },
  });

  const ancientChapter = await prisma.chapter.upsert({
    where: { id: 'chapter-ancient' },
    update: {},
    create: { id: 'chapter-ancient', name: 'Ancient India', slug: 'ancient-india', description: 'Indus Valley Civilization, Vedic Period, Mauryan Empire', paperId: historyPaper.id, subjectId: sscGk.id },
  });

  // Topic level under Chapter
  const fundamentalRights = await prisma.topic.upsert({
    where: { subjectId_name: { subjectId: sscGk.id, name: 'Fundamental Rights' } },
    update: {},
    create: { name: 'Fundamental Rights', slug: 'fundamental-rights', subjectId: sscGk.id, chapterId: constitutionChapter.id, description: 'Articles 12-35, Right to Equality, Freedom, etc.' },
  });

  const dpsp = await prisma.topic.upsert({
    where: { subjectId_name: { subjectId: sscGk.id, name: 'Directive Principles' } },
    update: {},
    create: { name: 'Directive Principles', slug: 'directive-principles', subjectId: sscGk.id, chapterId: constitutionChapter.id, description: 'DPSP Articles 36-51, welfare state provisions' },
  });

  // Subtopic level
  await prisma.subtopic.upsert({
    where: { topicId_name: { topicId: fundamentalRights.id, name: 'Right to Equality (Art 14-18)' } },
    update: {},
    create: { name: 'Right to Equality (Art 14-18)', slug: 'right-to-equality', topicId: fundamentalRights.id },
  });

  await prisma.subtopic.upsert({
    where: { topicId_name: { topicId: fundamentalRights.id, name: 'Right to Freedom (Art 19-22)' } },
    update: {},
    create: { name: 'Right to Freedom (Art 19-22)', slug: 'right-to-freedom', topicId: fundamentalRights.id },
  });

  const reasoning = await prisma.subject.upsert({
    where: { examId_name: { examId: ssc.id, name: 'Reasoning' } },
    update: {},
    create: { name: 'Reasoning', slug: 'reasoning', examId: ssc.id, order: 2, description: 'Logical reasoning, puzzles, coding-decoding' },
  });

  const quant = await prisma.subject.upsert({
    where: { examId_name: { examId: ssc.id, name: 'Quantitative Aptitude' } },
    update: {},
    create: { name: 'Quantitative Aptitude', slug: 'quantitative-aptitude', examId: ssc.id, order: 3, description: 'Math, arithmetic, algebra' },
  });

  // ─── LAYER 4: SOURCE TAXONOMY ──────────────────────────────────────────
  // Questions tagged with sourceType

  await prisma.question.upsert({
    where: { id: 'q001' },
    update: {},
    create: {
      id: 'q001',
      text: 'Who is known as the Father of the Indian Constitution?',
      options: JSON.stringify(['A. Mahatma Gandhi', 'B. Jawaharlal Nehru', 'C. B.R. Ambedkar', 'D. Sardar Patel']),
      correctAns: 'C. B.R. Ambedkar',
      explanation: 'Dr. B.R. Ambedkar was the Chairman of the Drafting Committee of the Indian Constitution.',
      difficulty: 'easy',
      sourceType: SourceType.NCERT,
      isPublished: true,
      examId: ssc.id,
      subjectId: sscGk.id,
      chapterId: constitutionChapter.id,
      topicId: fundamentalRights.id,
      createdById: admin.id,
    },
  });

  await prisma.question.upsert({
    where: { id: 'q002' },
    update: {},
    create: {
      id: 'q002',
      text: 'The Indian Constitution was adopted on which date?',
      options: JSON.stringify(['A. 26 January 1950', 'B. 26 November 1949', 'C. 15 August 1947', 'D. 26 January 1949']),
      correctAns: 'B. 26 November 1949',
      explanation: 'The Constituent Assembly adopted the Constitution on 26 November 1949. It came into effect on 26 January 1950.',
      difficulty: 'easy',
      sourceType: SourceType.NCERT,
      isPublished: true,
      examId: ssc.id,
      subjectId: sscGk.id,
      chapterId: constitutionChapter.id,
      topicId: fundamentalRights.id,
      createdById: admin.id,
    },
  });

  await prisma.question.upsert({
    where: { id: 'q003' },
    update: {},
    create: {
      id: 'q003',
      text: 'Which of the following is NOT a Fundamental Right?',
      options: JSON.stringify(['A. Right to Equality', 'B. Right to Freedom', 'C. Right to Property', 'D. Right to Constitutional Remedies']),
      correctAns: 'C. Right to Property',
      explanation: 'Right to Property was originally a Fundamental Right but was removed by the 44th Amendment Act, 1978.',
      difficulty: 'medium',
      sourceType: SourceType.PYQ,
      isPublished: true,
      examId: ssc.id,
      subjectId: sscGk.id,
      chapterId: ammendmentsChapter.id,
      topicId: dpsp.id,
      createdById: admin.id,
    },
  });

  // ─── NCERT (content foundation) ──────────────────────────────────────────

  const ncertPolity11 = await prisma.ncertBook.upsert({
    where: { slug: 'ncert-polity-class-11' },
    update: {},
    create: { class: 11, subject: 'Polity', name: 'Indian Constitution at Work', slug: 'ncert-polity-class-11', description: 'NCERT Class 11 Political Science - Indian Constitution at Work' },
  });

  const ncertHistory6 = await prisma.ncertBook.upsert({
    where: { slug: 'ncert-history-class-6' },
    update: {},
    create: { class: 6, subject: 'History', name: 'Our Pasts I', slug: 'ncert-history-class-6', description: 'NCERT Class 6 History - Our Pasts I' },
  });

  // NCERT Chapters
  await prisma.ncertChapter.upsert({
    where: { id: 'ncert-ch-constitution' },
    update: {},
    create: { id: 'ncert-ch-constitution', bookId: ncertPolity11.id, name: 'Constitution: Why and How?', slug: 'constitution-why-how', summary: 'This chapter explains the need for a constitution, how the Indian Constitution was framed, and its key features.', order: 1 },
  });

  await prisma.ncertChapter.upsert({
    where: { id: 'ncert-ch-fr' },
    update: {},
    create: { id: 'ncert-ch-fr', bookId: ncertPolity11.id, name: 'Fundamental Rights', slug: 'fundamental-rights-ncert', summary: 'Detailed coverage of Fundamental Rights in the Indian Constitution - Articles 12 to 35.', order: 3 },
  });

  await prisma.ncertChapter.upsert({
    where: { id: 'ncert-ch-what-history' },
    update: {},
    create: { id: 'ncert-ch-what-history', bookId: ncertHistory6.id, name: 'What, Where, How and When?', slug: 'what-where-how-when', summary: 'Introduction to history - how we study the past, sources of history.', order: 1 },
  });

  // NCERT Chapter → Chapter links (integration with subject taxonomy)
  await prisma.ncertChapterLink.upsert({
    where: { id: 'nlink-1' },
    update: {},
    create: { id: 'nlink-1', ncertChapterId: 'ncert-ch-constitution', chapterId: constitutionChapter.id },
  });

  await prisma.ncertChapterLink.upsert({
    where: { id: 'nlink-2' },
    update: {},
    create: { id: 'nlink-2', ncertChapterId: 'ncert-ch-fr', chapterId: constitutionChapter.id },
  });

  // ─── NOTES ────────────────────────────────────────────────────────────────

  await prisma.note.upsert({
    where: { slug: 'indian-constitution-basics' },
    update: {},
    create: {
      title: 'Indian Constitution Basics',
      slug: 'indian-constitution-basics',
      summary: 'A comprehensive guide to the Indian Constitution for competitive exams.',
      content: '<h2>Indian Constitution: Key Features</h2><p>The Constitution of India is the supreme law of India. It was adopted on 26 November 1949 and came into effect on 26 January 1950.</p><h3>Key Features:</h3><ul><li>Lengthiest written constitution</li><li>Preamble</li><li>Fundamental Rights (Articles 12-35)</li><li>Directive Principles of State Policy (Articles 36-51)</li><li>Fundamental Duties (Article 51A)</li><li>Federal system with unitary bias</li><li>Parliamentary form of government</li><li>Independent judiciary</li></ul><p>Important amendments: 42nd (Mini Constitution), 44th, 73rd, 74th, 101st (GST).</p>',
      isPublished: true,
      publishedAt: new Date(),
      examId: ssc.id,
      subjectId: sscGk.id,
      chapterId: constitutionChapter.id,
      topicId: fundamentalRights.id,
      authorId: admin.id,
      viewCount: 1200,
      tags: 'constitution,polity,ssc,upsc',
    },
  });

  await prisma.note.upsert({
    where: { slug: 'ancient-india-history-notes' },
    update: {},
    create: {
      title: 'Ancient India History Notes',
      slug: 'ancient-india-history-notes',
      summary: 'Complete notes on Ancient Indian history for SSC and UPSC exams.',
      content: '<h2>Ancient India: Indus Valley to Mauryas</h2><p>Ancient Indian history spans from the Indus Valley Civilization to the end of the Gupta Empire.</p><h3>Indus Valley Civilization (2500-1750 BCE)</h3><p>Major sites: Harappa, Mohenjo-Daro, Dholavira, Lothal. Known for urban planning, drainage systems, and trade.</p><h3>Vedic Period (1500-500 BCE)</h3><p>Rig Veda, Yajur Veda, Sama Veda, Atharva Veda. Development of caste system and early kingdoms.</p><h3>Mauryan Empire (322-185 BCE)</h3><p>Chandragupta Maurya, Ashoka the Great. Spread of Buddhism. Kalinga War.</p>',
      isPublished: true,
      publishedAt: new Date(),
      examId: ssc.id,
      subjectId: sscGk.id,
      chapterId: ancientChapter.id,
      authorId: admin.id,
      viewCount: 980,
      tags: 'history,ancient india,ssc,upsc',
    },
  });

  // ─── PLANS ────────────────────────────────────────────────────────────────

  await prisma.plan.upsert({
    where: { slug: 'monthly-plan' },
    update: {},
    create: {
      name: 'Monthly Plan',
      slug: 'monthly-plan',
      description: 'Access all test series and premium notes for one month',
      price: 299,
      discountedPrice: 199,
      durationDays: 30,
      features: JSON.stringify(['Full test series access', 'Premium notes', 'Detailed solutions', 'Performance analytics', 'All-India ranking']),
    },
  });

  await prisma.plan.upsert({
    where: { slug: 'quarterly-plan' },
    update: {},
    create: {
      name: 'Quarterly Plan',
      slug: 'quarterly-plan',
      description: 'Access all test series and premium notes for three months',
      price: 699,
      discountedPrice: 499,
      durationDays: 90,
      features: JSON.stringify(['Everything in Monthly', 'Priority support', '2x more tests', 'Custom practice sets']),
    },
  });

  await prisma.plan.upsert({
    where: { slug: 'yearly-plan' },
    update: {},
    create: {
      name: 'Yearly Plan',
      slug: 'yearly-plan',
      description: 'Full year access to all content and features',
      price: 1999,
      discountedPrice: 1499,
      durationDays: 365,
      features: JSON.stringify(['Everything in Quarterly', 'Live doubt sessions', 'Mock interview prep', 'Study planner access']),
    },
  });

  // ─── COUPONS ──────────────────────────────────────────────────────────────

  await prisma.coupon.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: {
      code: 'WELCOME50',
      discountPct: 50,
      maxUses: 100,
      maxDiscount: 500,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FLAT30' },
    update: {},
    create: {
      code: 'FLAT30',
      discountPct: 30,
      maxUses: 500,
      maxDiscount: 300,
    },
  });

  // ─── TEST ────────────────────────────────────────────────────────────────

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  await prisma.test.upsert({
    where: { id: 'test-ssc-gk-1' },
    update: {},
    create: {
      id: 'test-ssc-gk-1',
      title: 'SSC GK Practice Test 1',
      slug: 'ssc-gk-practice-test-1',
      description: 'Test your General Knowledge for SSC CGL and CHSL exams',
      testType: TestType.FULL_MOCK,
      testMode: TestMode.TIMED,
      accessType: AccessType.FREE,
      duration: 30,
      totalMarks: 50,
      passingMarks: 20,
      negativeMark: 0.25,
      isFree: true,
      isPublished: true,
      examId: ssc.id,
      maxAttempts: 3,
      instructions: 'Read each question carefully. There is negative marking for wrong answers.',
      status: 'PUBLISHED',
      scheduledAt: tomorrow,
    },
  });

  // Create an NCERT-linked test
  await prisma.test.upsert({
    where: { id: 'test-ncert-polity' },
    update: {},
    create: {
      id: 'test-ncert-polity',
      title: 'NCERT Polity Class 11 - Constitution Quiz',
      slug: 'ncert-polity-class-11-constitution-quiz',
      description: 'Test your understanding of the Indian Constitution based on NCERT Class 11 textbook.',
      testType: TestType.NCERT_BASED_TEST,
      testMode: TestMode.PRACTICE,
      accessType: AccessType.FREE,
      duration: 20,
      totalMarks: 25,
      passingMarks: 10,
      isFree: true,
      isPublished: true,
      examId: ssc.id,
      ncertChapterId: 'ncert-ch-constitution',
      maxAttempts: 5,
      instructions: 'Answer all questions. No negative marking.',
      status: 'PUBLISHED',
      scheduledAt: tomorrow,
    },
  });

  console.log('Seed data created successfully');
  console.log(`Admin: admin@testtime.in / admin123`);
  console.log(`Editor: editor@testtime.in / admin123`);
  console.log(`Student: student@test.com / user123`);
  console.log('Taxonomy seeded: ExamFamily, ExamStage, Paper, Chapter, Topic, Subtopic, NcertBook, NcertChapter');
  console.log('Questions tagged with SourceType (NCERT, PYQ, MIXED)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
