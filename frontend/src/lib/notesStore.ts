import type {
  ExamCategory, Exam, ExamStage, Institution, Course, Major, Semester,
  Subject, SubjectUnit, Topic, Resource, UserNoteProfile, Contribution,
  ResourceRequest, ResourceReport, HomepageSection, RevisionCampaign,
  ResourceTypeDef, LanguageDef, FormatDef, FilterState, ResourceStatus,
  ContributionStatus,
} from '@/types/notes';

const STORAGE_KEY = 'testime_notes_library';

export function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── LOOKUP HELPERS (shared by public pages) ───────────────────────────────

export function findExamCategory(data: NotesLibrary, slug: string) {
  return data.examCategories.find(c => c.slug === slug) || null;
}
export function findExam(data: NotesLibrary, slug: string) {
  return data.exams.find(e => e.slug === slug) || null;
}
export function findStage(data: NotesLibrary, slug: string) {
  return data.examStages.find(s => s.slug === slug) || null;
}
export function findSubject(data: NotesLibrary, slug: string) {
  return data.subjects.find(s => s.slug === slug) || null;
}
export function findTopic(data: NotesLibrary, slug: string) {
  return data.topics.find(t => t.slug === slug) || null;
}
export function findInstitution(data: NotesLibrary, slug: string) {
  return data.institutions.find(i => i.slug === slug) || null;
}
export function findCourse(data: NotesLibrary, slug: string) {
  return data.courses.find(c => c.slug === slug) || null;
}
export function findSemester(data: NotesLibrary, slug: string) {
  return data.semesters.find(s => s.slug === slug) || null;
}
export function findResource(data: NotesLibrary, slug: string) {
  return data.resources.find(r => r.slug === slug) || null;
}

export function resourceTypeName(data: NotesLibrary, type: string) {
  return data.resourceTypes.find(t => t.slug === type.toLowerCase())?.name || type;
}
export function languageName(code: string) {
  const map: Record<string, string> = { en: 'English', hi: 'Hindi', or: 'Odia', bn: 'Bengali', te: 'Telugu', ta: 'Tamil', ml: 'Malayalam' };
  return map[code] || code;
}
export function formatBytes(bytes: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface HierarchyNode {
  resource: Resource;
  examCategory?: ExamCategory;
  exam?: Exam;
  stage?: ExamStage;
  subject?: Subject;
  unit?: SubjectUnit;
  topic?: Topic;
  institution?: Institution;
  course?: Course;
  major?: Major;
  semester?: Semester;
}

export function resolveHierarchy(data: NotesLibrary, resource: Resource): HierarchyNode {
  return {
    resource,
    examCategory: resource.examCategoryId ? data.examCategories.find(c => c.id === resource.examCategoryId) : undefined,
    exam: resource.examId ? data.exams.find(e => e.id === resource.examId) : undefined,
    stage: resource.stageId ? data.examStages.find(s => s.id === resource.stageId) : undefined,
    subject: resource.subjectId ? data.subjects.find(s => s.id === resource.subjectId) : undefined,
    unit: resource.unitId ? data.units.find(u => u.id === resource.unitId) : undefined,
    topic: resource.topicId ? data.topics.find(t => t.id === resource.topicId) : undefined,
    institution: resource.institutionId ? data.institutions.find(i => i.id === resource.institutionId) : undefined,
    course: resource.courseId ? data.courses.find(c => c.id === resource.courseId) : undefined,
    major: resource.majorId ? data.majors.find(m => m.id === resource.majorId) : undefined,
    semester: resource.semesterId ? data.semesters.find(s => s.id === resource.semesterId) : undefined,
  };
}

// ─── SEED DATA ─────────────────────────────────────────────────────────────

function seedLibrary(): NotesLibrary {
  const cats: ExamCategory[] = [
    { id: 'cat-odisha', name: 'Odisha Exams', slug: 'odisha-exams', description: 'All Odisha state-level competitive examinations', icon: 'Landmark', sortOrder: 1, isActive: true },
    { id: 'cat-ssc', name: 'SSC', slug: 'ssc', description: 'Staff Selection Commission examinations', icon: 'Users', sortOrder: 2, isActive: true },
  ];

  const exams: Exam[] = [
    { id: 'ex-ossc', categoryId: 'cat-odisha', name: 'OSSC Combined Graduate Level', slug: 'ossc-cgl', shortName: 'OSSC CGL', description: 'Odisha Staff Selection Commission Combined Graduate Level examination', icon: 'FileText', color: 'brand', isActive: true, sortOrder: 1 },
    { id: 'ex-ssc-cgl', categoryId: 'cat-ssc', name: 'SSC Combined Graduate Level', slug: 'ssc-cgl', shortName: 'SSC CGL', description: 'Staff Selection Commission Combined Graduate Level examination', icon: 'Users', color: 'ocean', isActive: true, sortOrder: 1 },
  ];

  const stages: ExamStage[] = [
    { id: 'st-ossc-prelims', examId: 'ex-ossc', name: 'Prelims', slug: 'prelims', description: 'Preliminary examination (Prelims Paper)', order: 1 },
    { id: 'st-ssc-tier1', examId: 'ex-ssc-cgl', name: 'Tier 1', slug: 'tier-1', description: 'Computer Based Examination Tier 1', order: 1 },
  ];

  const subjects: Subject[] = [
    { id: 'sub-odisha-gk', name: 'Odisha GK', slug: 'odisha-gk', description: 'Odisha general knowledge — history, geography, culture and polity of Odisha', icon: 'Map', color: 'brand', examId: 'ex-ossc', isActive: true },
    { id: 'sub-ga', name: 'General Awareness', slug: 'general-awareness', description: 'General awareness section for SSC examinations', icon: 'Globe', color: 'ocean', examId: 'ex-ssc-cgl', isActive: true },
    { id: 'sub-plant-phys', name: 'Plant Physiology', slug: 'plant-physiology', description: 'Plant physiology — water relations, transport and mineral nutrition', icon: 'Leaf', color: 'mint', majorId: 'mj-botany', isActive: true },
  ];

  const units: SubjectUnit[] = [
    { id: 'u-odisha-history', subjectId: 'sub-odisha-gk', name: 'History of Odisha', slug: 'history-of-odisha', description: 'Ancient, medieval and modern history of Odisha', order: 1 },
    { id: 'u-polity', subjectId: 'sub-ga', name: 'Indian Polity', slug: 'indian-polity', description: 'Indian constitution and polity', order: 1 },
    { id: 'u-water-relations', subjectId: 'sub-plant-phys', name: 'Water Relations', slug: 'water-relations', description: 'Water uptake, movement and loss in plants', order: 1 },
  ];

  const topics: Topic[] = [
    { id: 'tp-ancient-odisha', subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history', name: 'Ancient Odisha', slug: 'ancient-odisha', description: 'Kalinga, Kharavela and ancient kingdoms of Odisha', order: 1 },
    { id: 'tp-kalinga-war', subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history', name: 'Kalinga War', slug: 'kalinga-war', description: 'The Kalinga War and its impact on Ashoka', order: 2 },
    { id: 'tp-ganga-dynasty', subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history', name: 'Ganga Dynasty', slug: 'ganga-dynasty', description: 'The Eastern Ganga dynasty of Odisha', order: 3 },
    { id: 'tp-freedom-movement', subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history', name: 'Freedom Movement', slug: 'freedom-movement', description: 'Odisha contribution to the Indian freedom struggle', order: 4 },
    { id: 'tp-constitution', subjectId: 'sub-ga', unitId: 'u-polity', name: 'Constitution Overview', slug: 'constitution-overview', description: 'Salient features and preamble of the Constitution', order: 1 },
    { id: 'tp-fr', subjectId: 'sub-ga', unitId: 'u-polity', name: 'Fundamental Rights', slug: 'fundamental-rights', description: 'Fundamental Rights under Part III', order: 2 },
    { id: 'tp-dpsp', subjectId: 'sub-ga', unitId: 'u-polity', name: 'Directive Principles', slug: 'directive-principles', description: 'Directive Principles of State Policy', order: 3 },
    { id: 'tp-parliament', subjectId: 'sub-ga', unitId: 'u-polity', name: 'Parliament', slug: 'parliament', description: 'Structure, functions and sessions of Parliament', order: 4 },
    { id: 'tp-judiciary', subjectId: 'sub-ga', unitId: 'u-polity', name: 'Judiciary', slug: 'judiciary', description: 'Supreme Court, High Courts and subordinate courts', order: 5 },
    { id: 'tp-diffusion-osmosis', subjectId: 'sub-plant-phys', unitId: 'u-water-relations', name: 'Diffusion and Osmosis', slug: 'diffusion-and-osmosis', description: 'Diffusion, osmosis and their significance', order: 1 },
    { id: 'tp-water-potential', subjectId: 'sub-plant-phys', unitId: 'u-water-relations', name: 'Water Potential', slug: 'water-potential', description: 'Water potential, solute potential and pressure potential', order: 2 },
    { id: 'tp-plasmolysis', subjectId: 'sub-plant-phys', unitId: 'u-water-relations', name: 'Plasmolysis', slug: 'plasmolysis', description: 'Plasmolysis — mechanism, types and experiments', order: 3 },
  ];

  const institutions: Institution[] = [
    { id: 'inst-sambalpur', name: 'Sambalpur University', slug: 'sambalpur-university', description: 'State university located at Jyoti Vihar, Burla, Sambalpur, Odisha', icon: 'School', isActive: true, sortOrder: 1 },
  ];
  const courses: Course[] = [
    { id: 'cr-bsc', institutionId: 'inst-sambalpur', name: 'Bachelor of Science', slug: 'bsc', description: 'Undergraduate science programme', isActive: true, sortOrder: 1 },
  ];
  const majors: Major[] = [
    { id: 'mj-botany', courseId: 'cr-bsc', name: 'Botany Honours', slug: 'botany-honours', description: 'BSc Botany Honours course', isActive: true, sortOrder: 1 },
  ];
  const semesters: Semester[] = [
    { id: 'sm-3', majorId: 'mj-botany', name: 'Semester 3', slug: 'semester-3', displayName: 'Semester III', order: 3, isActive: true },
  ];

  const resourceTypes: ResourceTypeDef[] = [
    { id: 'rt-notes', name: 'Notes', slug: 'notes', description: 'Comprehensive study notes', sortOrder: 1 },
    { id: 'rt-book', name: 'Book', slug: 'book', description: 'Full books and ebooks', sortOrder: 2 },
    { id: 'rt-pyq', name: 'PYQ', slug: 'pyq', description: 'Previous year questions', sortOrder: 3 },
    { id: 'rt-solved-paper', name: 'Solved Paper', slug: 'solved-paper', description: 'Fully solved question papers', sortOrder: 4 },
    { id: 'rt-syllabus', name: 'Syllabus', slug: 'syllabus', description: 'Syllabus documents', sortOrder: 5 },
    { id: 'rt-important-questions', name: 'Important Questions', slug: 'important-questions', description: 'Exam-important question banks', sortOrder: 6 },
    { id: 'rt-short-notes', name: 'Short Notes', slug: 'short-notes', description: 'Quick revision short notes', sortOrder: 7 },
    { id: 'rt-mind-map', name: 'Mind Map', slug: 'mind-map', description: 'Visual mind maps for revision', sortOrder: 8 },
    { id: 'rt-current-affairs', name: 'Current Affairs', slug: 'current-affairs', description: 'Current affairs compilations', sortOrder: 9 },
    { id: 'rt-pdf', name: 'PDF', slug: 'pdf', description: 'General PDF documents', sortOrder: 10 },
    { id: 'rt-other', name: 'Other', slug: 'other', description: 'Other resource types', sortOrder: 11 },
  ];

  const languages: LanguageDef[] = [
    { id: 'lang-en', name: 'English', code: 'en' },
    { id: 'lang-hi', name: 'Hindi', code: 'hi' },
    { id: 'lang-or', name: 'Odia', code: 'or' },
    { id: 'lang-bn', name: 'Bengali', code: 'bn' },
    { id: 'lang-te', name: 'Telugu', code: 'te' },
    { id: 'lang-ta', name: 'Tamil', code: 'ta' },
    { id: 'lang-ml', name: 'Malayalam', code: 'ml' },
  ];

  const formats: FormatDef[] = [
    { id: 'fmt-pdf', name: 'PDF', slug: 'pdf' },
    { id: 'fmt-doc', name: 'DOC', slug: 'doc' },
    { id: 'fmt-docx', name: 'DOCX', slug: 'docx' },
    { id: 'fmt-ppt', name: 'PPT', slug: 'ppt' },
    { id: 'fmt-pptx', name: 'PPTX', slug: 'pptx' },
    { id: 'fmt-image', name: 'Image', slug: 'image' },
  ];

  const now = (d: string) => new Date(d).toISOString();
  const r = (
    id: string, title: string, slug: string, type: Resource['type'], pageCount: number,
    opts: Partial<Resource> & { createdAt: string },
  ): Resource => ({
    id, title, slug, type, language: 'en', format: 'PDF', pageCount, fileSize: pageCount * 180000,
    permissionStatus: 'owned', visibility: 'public', accessType: 'free', downloadAllowed: true,
    featured: false, isVerified: false, status: 'published', isPublished: true,
    stats: { views: 0, downloads: 0, saves: 0, shares: 0 }, tags: [], printAvailable: false,
    updatedAt: opts.createdAt, ...opts,
  });

  const resources: Resource[] = [
    r('res-1', 'Ancient Odisha — Complete Notes', 'ancient-odisha-complete-notes', 'NOTES', 42, {
      shortDesc: 'Comprehensive exam-ready notes covering ancient Odisha — Kalinga, Kharavela, maritime trade and early kingdoms.',
      longDesc: '<p>Detailed notes on the ancient history of Odisha covering the megalithic cultures, the Kalinga kingdom, Kharavela and the Kalinganagar, maritime trade with Southeast Asia and the decline of ancient kingdoms.</p>',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history', topicId: 'tp-ancient-odisha',
      contributorName: 'Testime Content Team', sourceAttribution: 'Based on public domain sources', isVerified: true,
      stats: { views: 3280, downloads: 1410, saves: 310, shares: 95 }, tags: ['odisha', 'ancient-history', 'ossc'],
      createdAt: now('2026-05-02T09:00:00Z'), publishedAt: now('2026-05-04T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-2', 'Kalinga War — Facts & Exam Points', 'kalinga-war-facts-exam-points', 'SHORT_NOTES', 14, {
      shortDesc: 'One-page revision sheet on the Kalinga War — causes, aftermath and Ashoka\u2019s transformation.',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history', topicId: 'tp-kalinga-war',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 2450, downloads: 1180, saves: 260, shares: 80 }, tags: ['kalinga-war', 'ashoka', 'quick-revision'],
      createdAt: now('2026-05-10T09:00:00Z'), publishedAt: now('2026-05-12T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-3', 'Ganga Dynasty of Odisha — Study Notes', 'ganga-dynasty-odisha-study-notes', 'NOTES', 36, {
      shortDesc: 'Eastern Ganga dynasty — Anantavarman Chodaganga, Konark Sun Temple and administration.',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history', topicId: 'tp-ganga-dynasty',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 1890, downloads: 860, saves: 170, shares: 42 }, tags: ['ganga-dynasty', 'konark', 'odisha-history'],
      createdAt: now('2026-05-18T09:00:00Z'), publishedAt: now('2026-05-20T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-4', 'Odisha Freedom Movement — Timeline Notes', 'odisha-freedom-movement-timeline-notes', 'NOTES', 28, {
      shortDesc: 'Chronological notes on Odisha\u2019s role in the freedom struggle — Paika Rebellion, Non-Cooperation, Quit India.',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history', topicId: 'tp-freedom-movement',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 2120, downloads: 990, saves: 210, shares: 55 }, tags: ['freedom-movement', 'paika-rebellion', 'odisha'],
      createdAt: now('2026-05-26T09:00:00Z'), publishedAt: now('2026-05-28T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-5', 'Odisha GK Previous Year Questions (PYQ)', 'odisha-gk-previous-year-questions', 'PYQ', 60, {
      shortDesc: '300+ previous year questions on Odisha GK with answer keys, arranged topic-wise.',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 4210, downloads: 2200, saves: 480, shares: 160 }, tags: ['pyq', 'ossc', 'odisha-gk'],
      createdAt: now('2026-06-03T09:00:00Z'), publishedAt: now('2026-06-05T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-6', 'OSSC CGL Prelims 2026 — Syllabus & Exam Pattern', 'ossc-cgl-prelims-syllabus-2026', 'SYLLABUS', 12, {
      shortDesc: 'Official-syllabus-mirror document for OSSC CGL Prelims with paper pattern and marking scheme.',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      subjectId: 'sub-odisha-gk',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 5120, downloads: 3110, saves: 620, shares: 240 }, tags: ['syllabus', 'ossc-cgl', 'exam-pattern'],
      createdAt: now('2026-01-12T09:00:00Z'), publishedAt: now('2026-01-15T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-7', 'Odisha GK Mind Map — Quick Revision Wall', 'odisha-gk-mind-map-quick-revision', 'MIND_MAP', 8, {
      shortDesc: 'A visual mind-map poster summarising the entire Odisha GK syllabus for last-minute revision.',
      format: 'IMAGE', mimeType: 'image/png',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      subjectId: 'sub-odisha-gk',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 1560, downloads: 720, saves: 190, shares: 60 }, tags: ['mind-map', 'revision'],
      createdAt: now('2026-06-12T09:00:00Z'), publishedAt: now('2026-06-14T09:00:00Z'),
    }),
    r('res-8', 'Ancient Odisha — Hindi Medium Notes', 'ancient-odisha-hindi-medium-notes', 'NOTES', 40, {
      shortDesc: 'प्राचीन ओडिशा की विस्तृत नोट्स हिंदी माध्यम में।',
      language: 'hi',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      subjectId: 'sub-odisha-gk', unitId: 'u-odisha-history', topicId: 'tp-ancient-odisha',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 890, downloads: 430, saves: 95, shares: 22 }, tags: ['hindi', 'ancient-odisha'],
      createdAt: now('2026-06-18T09:00:00Z'), publishedAt: now('2026-06-20T09:00:00Z'),
    }),
    r('res-9', 'Constitution Overview — General Awareness Notes', 'constitution-overview-ga-notes', 'NOTES', 32, {
      shortDesc: 'Salient features, Preamble and key facts about the Indian Constitution for SSC CGL Tier 1.',
      examCategoryId: 'cat-ssc', examId: 'ex-ssc-cgl', stageId: 'st-ssc-tier1',
      subjectId: 'sub-ga', unitId: 'u-polity', topicId: 'tp-constitution',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 3850, downloads: 1720, saves: 350, shares: 110 }, tags: ['constitution', 'preamble', 'ssc-cgl'],
      createdAt: now('2026-04-15T09:00:00Z'), publishedAt: now('2026-04-17T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-10', 'Fundamental Rights — Articles 12 to 35', 'fundamental-rights-articles-12-35', 'SHORT_NOTES', 18, {
      shortDesc: 'All Fundamental Rights condensed into crisp exam points with landmark cases.',
      examCategoryId: 'cat-ssc', examId: 'ex-ssc-cgl', stageId: 'st-ssc-tier1',
      subjectId: 'sub-ga', unitId: 'u-polity', topicId: 'tp-fr',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 2980, downloads: 1310, saves: 280, shares: 90 }, tags: ['fundamental-rights', 'part-iii'],
      createdAt: now('2026-04-22T09:00:00Z'), publishedAt: now('2026-04-24T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-11', 'Directive Principles of State Policy — Notes', 'directive-principles-state-policy-notes', 'NOTES', 22, {
      shortDesc: 'DPSPs — classification, key articles and comparison with Fundamental Rights.',
      examCategoryId: 'cat-ssc', examId: 'ex-ssc-cgl', stageId: 'st-ssc-tier1',
      subjectId: 'sub-ga', unitId: 'u-polity', topicId: 'tp-dpsp',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 2210, downloads: 940, saves: 200, shares: 48 }, tags: ['dpsp', 'part-iv'],
      createdAt: now('2026-04-30T09:00:00Z'), publishedAt: now('2026-05-02T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-12', 'Parliament of India — Structure & Functions', 'parliament-of-india-structure-functions', 'NOTES', 34, {
      shortDesc: 'Lok Sabha, Rajya Sabha, legislative procedure and parliamentary committees.',
      examCategoryId: 'cat-ssc', examId: 'ex-ssc-cgl', stageId: 'st-ssc-tier1',
      subjectId: 'sub-ga', unitId: 'u-polity', topicId: 'tp-parliament',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 2640, downloads: 1180, saves: 250, shares: 70 }, tags: ['parliament', 'lok-sabha', 'rajya-sabha'],
      createdAt: now('2026-05-06T09:00:00Z'), publishedAt: now('2026-05-08T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-13', 'Judiciary in India — SC, HC & Subordinate Courts', 'judiciary-in-india-sc-hc-notes', 'NOTES', 30, {
      shortDesc: 'Supreme Court, High Courts, judicial review and writs — exam-ready notes.',
      examCategoryId: 'cat-ssc', examId: 'ex-ssc-cgl', stageId: 'st-ssc-tier1',
      subjectId: 'sub-ga', unitId: 'u-polity', topicId: 'tp-judiciary',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 1970, downloads: 890, saves: 180, shares: 38 }, tags: ['judiciary', 'supreme-court', 'writs'],
      createdAt: now('2026-05-14T09:00:00Z'), publishedAt: now('2026-05-16T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-14', 'Indian Polity PYQ Bank — SSC CGL Tier 1', 'indian-polity-pyq-bank-ssc-cgl', 'PYQ', 80, {
      shortDesc: '400+ previous year polity questions with explanations, tagged to topics.',
      examCategoryId: 'cat-ssc', examId: 'ex-ssc-cgl', stageId: 'st-ssc-tier1',
      subjectId: 'sub-ga', unitId: 'u-polity',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 3410, downloads: 1620, saves: 390, shares: 120 }, tags: ['pyq', 'polity', 'ssc-cgl'],
      createdAt: now('2026-05-20T09:00:00Z'), publishedAt: now('2026-05-22T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-15', 'SSC CGL Tier 1 General Awareness Syllabus', 'ssc-cgl-tier1-ga-syllabus', 'SYLLABUS', 10, {
      shortDesc: 'Topic-wise General Awareness syllabus for SSC CGL Tier 1 with weightage.',
      examCategoryId: 'cat-ssc', examId: 'ex-ssc-cgl', stageId: 'st-ssc-tier1',
      subjectId: 'sub-ga',
      contributorName: 'Testime Content Team', isVerified: true,
      stats: { views: 3890, downloads: 2050, saves: 420, shares: 150 }, tags: ['syllabus', 'ssc-cgl', 'ga'],
      createdAt: now('2026-01-20T09:00:00Z'), publishedAt: now('2026-01-22T09:00:00Z'), syllabusYear: '2026',
    }),
    r('res-16', 'Diffusion & Osmosis — Plant Physiology', 'diffusion-osmosis-plant-physiology', 'NOTES', 26, {
      shortDesc: 'Diffusion, facilitated diffusion, osmosis, osmotic pressure and their biological significance.',
      institutionId: 'inst-sambalpur', courseId: 'cr-bsc', majorId: 'mj-botany', semesterId: 'sm-3',
      subjectId: 'sub-plant-phys', unitId: 'u-water-relations', topicId: 'tp-diffusion-osmosis',
      contributorName: 'Dr. S. Patnaik', sourceAttribution: 'Department of Botany, Sambalpur University', isVerified: true,
      stats: { views: 1420, downloads: 610, saves: 130, shares: 30 }, tags: ['plant-physiology', 'osmosis', 'semester-3'],
      createdAt: now('2026-06-08T09:00:00Z'), publishedAt: now('2026-06-10T09:00:00Z'), syllabusYear: '2025-26',
    }),
    r('res-17', 'Water Potential — Concepts & Solved Problems', 'water-potential-concepts-solved-problems', 'NOTES', 20, {
      shortDesc: 'Water potential, solute potential, pressure potential and matric potential with solved numeric problems.',
      institutionId: 'inst-sambalpur', courseId: 'cr-bsc', majorId: 'mj-botany', semesterId: 'sm-3',
      subjectId: 'sub-plant-phys', unitId: 'u-water-relations', topicId: 'tp-water-potential',
      contributorName: 'Dr. S. Patnaik', sourceAttribution: 'Department of Botany, Sambalpur University', isVerified: true,
      stats: { views: 1150, downloads: 500, saves: 105, shares: 25 }, tags: ['water-potential', 'solved-problems'],
      createdAt: now('2026-06-16T09:00:00Z'), publishedAt: now('2026-06-18T09:00:00Z'), syllabusYear: '2025-26',
    }),
    r('res-18', 'Plasmolysis — Mechanism & Experiments', 'plasmolysis-mechanism-experiments', 'NOTES', 16, {
      shortDesc: 'Plasmolysis types, mechanism, experimental demonstration with Rhoeo leaves.',
      institutionId: 'inst-sambalpur', courseId: 'cr-bsc', majorId: 'mj-botany', semesterId: 'sm-3',
      subjectId: 'sub-plant-phys', unitId: 'u-water-relations', topicId: 'tp-plasmolysis',
      contributorName: 'Dr. S. Patnaik', sourceAttribution: 'Department of Botany, Sambalpur University', isVerified: true,
      stats: { views: 980, downloads: 420, saves: 90, shares: 18 }, tags: ['plasmolysis', 'experiment'],
      createdAt: now('2026-06-22T09:00:00Z'), publishedAt: now('2026-06-24T09:00:00Z'), syllabusYear: '2025-26',
    }),
    r('res-19', 'Plant Physiology Lab Manual — Water Relations', 'plant-physiology-lab-manual-water-relations', 'BOOK', 48, {
      shortDesc: 'Complete lab manual with experiments, observation tables and viva questions on water relations.',
      institutionId: 'inst-sambalpur', courseId: 'cr-bsc', majorId: 'mj-botany', semesterId: 'sm-3',
      subjectId: 'sub-plant-phys', unitId: 'u-water-relations',
      contributorName: 'Department of Botany, Sambalpur University', sourceAttribution: 'Sambalpur University lab manual', isVerified: true,
      stats: { views: 760, downloads: 330, saves: 80, shares: 12 }, tags: ['lab-manual', 'practical'],
      createdAt: now('2026-06-28T09:00:00Z'), publishedAt: now('2026-06-30T09:00:00Z'), syllabusYear: '2025-26',
    }),
    r('res-20', 'Current Affairs Compilation — July 2026', 'current-affairs-compilation-july-2026', 'CURRENT_AFFAIRS', 40, {
      shortDesc: 'Monthly current affairs compilation covering national and Odisha-specific news.',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      status: 'draft', isPublished: false, visibility: 'signed_in',
      contributorName: 'Testime Content Team',
      stats: { views: 0, downloads: 0, saves: 0, shares: 0 }, tags: ['current-affairs', 'july-2026'],
      createdAt: now('2026-07-28T09:00:00Z'),
    }),
    r('res-21', 'Important Questions — Odisha GK (Unit-wise)', 'important-questions-odisha-gk-unitwise', 'IMPORTANT_QUESTIONS', 36, {
      shortDesc: 'Unit-wise important questions list for quick revision before the OSSC CGL Prelims.',
      examCategoryId: 'cat-odisha', examId: 'ex-ossc', stageId: 'st-ossc-prelims',
      subjectId: 'sub-odisha-gk',
      status: 'needs_update', isPublished: false, visibility: 'public',
      contributorName: 'Testime Content Team',
      stats: { views: 540, downloads: 0, saves: 0, shares: 0 }, tags: ['important-questions', 'revision'],
      createdAt: now('2026-07-10T09:00:00Z'), updatedAt: now('2026-07-20T09:00:00Z'),
    }),
  ];

  const homepageSections: HomepageSection[] = [
    { id: 'hs-1', title: 'Freshly Published', subtitle: 'Latest study material added to the library', source: 'latest', limit: 6, sortOrder: 1, isActive: true, createdAt: now('2026-06-01T09:00:00Z') },
    { id: 'hs-2', title: 'Most Saved', subtitle: 'Resources students are bookmarking the most', source: 'most_saved', limit: 6, sortOrder: 2, isActive: true, createdAt: now('2026-06-01T09:00:00Z') },
    { id: 'hs-3', title: 'Popular Downloads', subtitle: 'High-demand PDFs and notes', source: 'most_downloaded', limit: 6, sortOrder: 3, isActive: true, createdAt: now('2026-06-01T09:00:00Z') },
    { id: 'hs-4', title: 'Featured Resources', subtitle: 'Editor-picked essentials', source: 'featured', limit: 4, sortOrder: 4, isActive: true, createdAt: now('2026-06-01T09:00:00Z') },
  ];

  const revisionCampaigns: RevisionCampaign[] = [
    {
      id: 'rc-1', title: 'OSSC CGL Prelims — Odisha GK Crash Revision', description: '5-day rapid revision plan covering all Odisha GK topics.',
      examId: 'ex-ossc', examCategoryId: 'cat-odisha', subjectId: 'sub-odisha-gk', status: 'active', sortOrder: 1,
      items: [
        { id: 'rc1-i1', resourceId: 'res-2', order: 1, estimatedMinutes: 20 },
        { id: 'rc1-i2', resourceId: 'res-1', order: 2, estimatedMinutes: 45 },
        { id: 'rc1-i3', resourceId: 'res-3', order: 3, estimatedMinutes: 35 },
        { id: 'rc1-i4', resourceId: 'res-4', order: 4, estimatedMinutes: 30 },
      ],
      createdAt: now('2026-07-01T09:00:00Z'), updatedAt: now('2026-07-01T09:00:00Z'),
    },
  ];

  const contributions: Contribution[] = [
    {
      id: 'con-1', contributorName: 'Priyanka Sahoo', contributorEmail: 'priyanka@example.com',
      resourceTitle: 'Odisha Temple Architecture — Notes', examCategory: 'Odisha Exams', examName: 'OSSC CGL',
      stageOrSemester: 'Prelims', subjectName: 'Odisha GK', unitChapter: 'History of Odisha',
      topicName: 'Temple Architecture', resourceType: 'NOTES', language: 'en',
      fileName: 'odisha-temple-architecture.pdf', description: 'Handwritten notes covering Kalinga architecture style.',
      sourceAttribution: 'Compiled from public sources', copyrightDeclaration: true,
      status: 'under_review', createdAt: now('2026-07-25T09:00:00Z'),
    },
  ];

  const requests: ResourceRequest[] = [
    {
      id: 'req-1', title: 'OSSC CGL Mains — Odia Language Model Papers', description: 'Please add model question papers for the Odia language paper of OSSC CGL Mains.',
      examCategory: 'Odisha Exams', examName: 'OSSC CGL', subjectName: 'Odia', resourceType: 'SOLVED_PAPER', language: 'or',
      requesterName: 'Abhisek Das', votes: 24, status: 'open', createdAt: now('2026-07-15T09:00:00Z'), updatedAt: now('2026-07-15T09:00:00Z'),
    },
    {
      id: 'req-2', title: 'SSC CGL Tier 1 — English Grammar Notes', description: 'Complete English grammar notes covering spotting errors and fill in the blanks.',
      examCategory: 'SSC', examName: 'SSC CGL', subjectName: 'English', resourceType: 'NOTES', language: 'en',
      requesterName: 'Rakesh Kumar', votes: 18, status: 'in_progress', createdAt: now('2026-07-18T09:00:00Z'), updatedAt: now('2026-07-21T09:00:00Z'),
    },
  ];

  const reports: ResourceReport[] = [
    {
      id: 'rep-1', resourceId: 'res-13', resourceSlug: 'judiciary-in-india-sc-hc-notes', resourceTitle: 'Judiciary in India — SC, HC & Subordinate Courts',
      reason: 'inaccurate', details: 'The article on judicial review states an outdated amendment number.', reporterName: 'Sneha Mohanty', status: 'open',
      createdAt: now('2026-07-26T09:00:00Z'),
    },
  ];

  const userProfile: UserNoteProfile = {
    savedResources: [
      { resourceId: 'res-2', savedAt: now('2026-07-24T09:00:00Z') },
      { resourceId: 'res-16', savedAt: now('2026-07-26T09:00:00Z') },
    ],
    progress: {
      'res-1': { resourceId: 'res-1', lastPage: 18, explored: true, completed: false, totalTimeMs: 1800000, lastReadAt: now('2026-07-27T09:00:00Z'), updatedAt: now('2026-07-27T09:00:00Z') },
      'res-2': { resourceId: 'res-2', lastPage: 14, explored: true, completed: true, totalTimeMs: 800000, lastReadAt: now('2026-07-28T09:00:00Z'), updatedAt: now('2026-07-28T09:00:00Z') },
    },
    examFollows: ['ex-ossc'],
    subjectFollows: ['sub-odisha-gk'],
    recentlyViewed: ['res-1', 'res-16'],
    pinnedResources: [],
  };

  const auditLog = [
    { id: 'aud-1', action: 'seed', entity: 'library', entityId: 'seed', by: 'system', at: now('2026-06-01T09:00:00Z') },
  ];

  return {
    examCategories: cats, exams, examStages: stages, institutions, courses, majors, semesters,
    subjects, units, topics, resources, resourceTypes, languages, formats,
    homepageSections, revisionCampaigns, contributions, requests, reports,
    userProfile, auditLog,
  };
}

// ─── STORE ─────────────────────────────────────────────────────────────────

export interface NotesLibrary {
  examCategories: ExamCategory[];
  exams: Exam[];
  examStages: ExamStage[];
  institutions: Institution[];
  courses: Course[];
  majors: Major[];
  semesters: Semester[];
  subjects: Subject[];
  units: SubjectUnit[];
  topics: Topic[];
  resources: Resource[];
  resourceTypes: ResourceTypeDef[];
  languages: LanguageDef[];
  formats: FormatDef[];
  homepageSections: HomepageSection[];
  revisionCampaigns: RevisionCampaign[];
  contributions: Contribution[];
  requests: ResourceRequest[];
  reports: ResourceReport[];
  userProfile: UserNoteProfile;
  auditLog: { id: string; action: string; entity: string; entityId: string; by: string; at: string }[];
}

let cached: NotesLibrary | null = null;

export function getNotesStoreKey() {
  return STORAGE_KEY;
}

function load(): NotesLibrary {
  if (cached) return cached;
  if (typeof window === 'undefined') {
    cached = seedLibrary();
    return cached;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const seed = seedLibrary();
      // merge seed defaults so new fields survive across versions
      cached = { ...seed, ...parsed, userProfile: { ...seed.userProfile, ...(parsed.userProfile || {}) } };
      return cached as NotesLibrary;
    }
  } catch { /* ignore */ }
  cached = seedLibrary();
  return cached;
}

function save(data: NotesLibrary) {
  cached = data;
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function mutate(fn: (data: NotesLibrary) => void) {
  const data = load();
  fn(data);
  save(data);
}

// ─── PUBLIC GETTERS ────────────────────────────────────────────────────────

export function getLibrary(): NotesLibrary {
  return load();
}

export function getResourceTypes() { return load().resourceTypes; }
export function getLanguages() { return load().languages; }
export function getFormats() { return load().formats; }

export function getPublishedResources(): Resource[] {
  return load().resources.filter(r => r.isPublished && r.status === 'published');
}

export function getResourceBySlug(slug: string): Resource | null {
  return findResource(load(), slug);
}

function matchFilters(resource: Resource, f: FilterState, data: NotesLibrary): boolean {
  if (f.query) {
    const q = f.query.toLowerCase().trim();
    const haystack = [resource.title, resource.shortDesc, resource.tags.join(' ')].join(' ').toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (f.type && f.type !== 'all' && resource.type !== f.type) return false;
  if (f.language && f.language !== 'all' && resource.language !== f.language) return false;
  if (f.format && f.format !== 'all' && resource.format !== f.format) return false;
  if (f.access && f.access !== 'all' && resource.accessType !== f.access) return false;
  if (f.examCategoryId && resource.examCategoryId !== f.examCategoryId) return false;
  if (f.examId && resource.examId !== f.examId) return false;
  if (f.stageId && resource.stageId !== f.stageId) return false;
  if (f.subjectId && resource.subjectId !== f.subjectId) return false;
  if (f.institutionId && resource.institutionId !== f.institutionId) return false;
  if (f.courseId && resource.courseId !== f.courseId) return false;
  if (f.semesterId && resource.semesterId !== f.semesterId) return false;
  return true;
}

function sortResources(list: Resource[], sort?: FilterState['sort']) {
  const s = sort || 'latest';
  return [...list].sort((a, b) => {
    if (s === 'popular') return b.stats.views - a.stats.views;
    if (s === 'downloads') return b.stats.downloads - a.stats.downloads;
    if (s === 'title') return a.title.localeCompare(b.title);
    return new Date(b.publishedAt || b.updatedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.updatedAt || a.createdAt).getTime();
  });
}

export function getResources(f: FilterState = {}): { data: Resource[]; total: number; page: number; totalPages: number } {
  const data = load();
  let filtered = getPublishedResources().filter(r => matchFilters(r, f, data));
  filtered = sortResources(filtered, f.sort);
  const page = f.page || 1;
  const perPage = f.perPage || 20;
  return {
    data: filtered.slice((page - 1) * perPage, page * perPage),
    total: filtered.length,
    page,
    totalPages: Math.max(1, Math.ceil(filtered.length / perPage)),
  };
}

export function getRelatedResources(resource: Resource, limit = 4): Resource[] {
  const data = load();
  return getPublishedResources().filter(r => r.id !== resource.id && (
    r.examId === resource.examId ||
    r.subjectId === resource.subjectId ||
    r.topicId === resource.topicId ||
    r.institutionId === resource.institutionId ||
    r.semesterId === resource.semesterId
  )).slice(0, limit);
}

export function getSectionResources(section: HomepageSection): Resource[] {
  const data = load();
  const list = getPublishedResources();
  let result: Resource[] = [];
  switch (section.source) {
    case 'latest':
      result = sortResources(list, 'latest');
      break;
    case 'recently_updated':
      result = sortResources(list, 'latest');
      break;
    case 'most_viewed':
      result = sortResources(list, 'popular');
      break;
    case 'most_downloaded':
      result = sortResources(list, 'downloads');
      break;
    case 'most_saved':
      result = sortResources(list, 'popular').sort((a, b) => b.stats.saves - a.stats.saves);
      break;
    case 'featured':
      result = list.filter(r => r.featured);
      break;
    case 'revision_mode':
      result = getRevisionCampaignResources().slice(0, section.limit);
      break;
    case 'pyqs':
      result = list.filter(r => r.type === 'PYQ' || r.type === 'SOLVED_PAPER');
      break;
    case 'important_questions':
      result = list.filter(r => r.type === 'IMPORTANT_QUESTIONS');
      break;
    case 'current_affairs':
      result = list.filter(r => r.type === 'CURRENT_AFFAIRS');
      break;
    case 'manual':
      result = section.resourceIds?.map(id => data.resources.find(r => r.id === id)).filter((x): x is Resource => !!x && x.isPublished) || [];
      break;
  }
  if (section.examId) result = result.filter(r => r.examId === section.examId);
  if (section.subjectId) result = result.filter(r => r.subjectId === section.subjectId);
  return result.slice(0, section.limit);
}

// ─── REVISION CAMPAIGNS ────────────────────────────────────────────────────

export function getActiveRevisionCampaigns(): RevisionCampaign[] {
  return load().revisionCampaigns.filter(c => c.status === 'active').sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getRevisionCampaignResources(): Resource[] {
  const data = load();
  const camp = data.revisionCampaigns.find(c => c.status === 'active');
  if (!camp) return [];
  const order = camp.items.map(i => i.resourceId);
  return order.map(id => data.resources.find(r => r.id === id)).filter((r): r is Resource => !!r);
}

// ─── ENGAGEMENT ────────────────────────────────────────────────────────────

export function toggleSaveResource(resourceId: string): boolean {
  let saved = false;
  mutate(data => {
    const p = data.userProfile;
    const idx = p.savedResources.findIndex(s => s.resourceId === resourceId);
    if (idx >= 0) {
      p.savedResources.splice(idx, 1);
      const res = data.resources.find(r => r.id === resourceId);
      if (res) res.stats.saves = Math.max(0, res.stats.saves - 1);
      saved = false;
    } else {
      p.savedResources.unshift({ resourceId, savedAt: new Date().toISOString() });
      const res = data.resources.find(r => r.id === resourceId);
      if (res) res.stats.saves += 1;
      saved = true;
    }
  });
  return saved;
}

export function isResourceSaved(resourceId: string): boolean {
  return load().userProfile.savedResources.some(s => s.resourceId === resourceId);
}

export function getSavedResources(): Resource[] {
  const data = load();
  return data.userProfile.savedResources
    .map(s => data.resources.find(r => r.id === s.resourceId))
    .filter((r): r is Resource => !!r && r.isPublished);
}

export function followExam(examId: string): boolean {
  let followed = false;
  mutate(data => {
    const p = data.userProfile;
    const idx = p.examFollows.indexOf(examId);
    if (idx >= 0) { p.examFollows.splice(idx, 1); followed = false; }
    else { p.examFollows.push(examId); followed = true; }
  });
  return followed;
}

export function followSubject(subjectId: string): boolean {
  let followed = false;
  mutate(data => {
    const p = data.userProfile;
    const idx = p.subjectFollows.indexOf(subjectId);
    if (idx >= 0) { p.subjectFollows.splice(idx, 1); followed = false; }
    else { p.subjectFollows.push(subjectId); followed = true; }
  });
  return followed;
}

export function recordResourceActivity(resourceId: string, page: number, totalPages: number) {
  mutate(data => {
    const p = data.userProfile;
    const prev = p.progress[resourceId];
    const explored = !!prev?.explored || page > 1;
    const completed = !!prev?.completed || (page >= totalPages - 1);
    const updated = {
      resourceId,
      lastPage: Math.max(prev?.lastPage || 0, page),
      explored,
      completed,
      totalTimeMs: (prev?.totalTimeMs || 0) + 30000,
      lastReadAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    p.progress[resourceId] = updated;
    const viewed = p.recentlyViewed.filter(id => id !== resourceId);
    viewed.unshift(resourceId);
    p.recentlyViewed = viewed.slice(0, 12);
    const res = data.resources.find(r => r.id === resourceId);
    if (res) res.stats.views += 1;
  });
}

export function recordDownload(resourceId: string) {
  mutate(data => {
    const res = data.resources.find(r => r.id === resourceId);
    if (res) res.stats.downloads += 1;
  });
}

export function recordShare(resourceId: string) {
  mutate(data => {
    const res = data.resources.find(r => r.id === resourceId);
    if (res) res.stats.shares += 1;
  });
}

export function getUserProgress(): UserNoteProfile {
  return load().userProfile;
}

export function getContinueStudying(limit = 6): { resource: Resource; progress: UserNoteProfile['progress'][string] }[] {
  const data = load();
  const p = data.userProfile;
  const items = Object.values(p.progress)
    .filter(pr => pr.explored || pr.completed)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const result: { resource: Resource; progress: UserNoteProfile['progress'][string] }[] = [];
  for (const pr of items) {
    const res = data.resources.find(r => r.id === pr.resourceId);
    if (res && res.isPublished) result.push({ resource: res, progress: pr });
    if (result.length >= limit) break;
  }
  return result;
}

// ─── CONTRIBUTIONS ─────────────────────────────────────────────────────────

export function submitContribution(input: Omit<Contribution, 'id' | 'status' | 'createdAt'>): Contribution {
  const contribution: Contribution = { ...input, id: `con-${Date.now()}`, status: 'submitted', createdAt: new Date().toISOString() };
  mutate(data => { data.contributions.unshift(contribution); });
  return contribution;
}

export function setContributionStatus(id: string, status: ContributionStatus) {
  mutate(data => {
    const c = data.contributions.find(x => x.id === id);
    if (c) {
      c.status = status;
      c.reviewedAt = new Date().toISOString();
      if (status === 'published' && c.copyrightDeclaration) {
        const res: Resource = {
          id: `res-${Date.now()}`,
          title: c.resourceTitle,
          slug: `${slugify(c.resourceTitle)}-${Date.now()}`,
          shortDesc: c.description,
          type: c.resourceType || 'PDF',
          language: c.language || 'en',
          format: 'PDF',
          pageCount: 0,
          fileSize: 0,
          contributorName: c.contributorName,
          contributorEmail: c.contributorEmail,
          sourceAttribution: c.sourceAttribution,
          permissionStatus: c.permissionStatus || 'granted',
          visibility: 'public',
          accessType: 'free',
          downloadAllowed: true,
          featured: false,
          isVerified: false,
          status: 'published',
          isPublished: true,
          publishedAt: new Date().toISOString(),
          stats: { views: 0, downloads: 0, saves: 0, shares: 0 },
          tags: [],
          printAvailable: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        data.resources.unshift(res);
      }
    }
  });
}

// ─── REQUESTS ──────────────────────────────────────────────────────────────

export function getRequests(): ResourceRequest[] {
  return load().requests;
}

export function submitRequest(input: Omit<ResourceRequest, 'id' | 'votes' | 'status' | 'createdAt' | 'updatedAt'>): ResourceRequest {
  const request: ResourceRequest = { ...input, id: `req-${Date.now()}`, votes: 0, status: 'open', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  mutate(data => { data.requests.unshift(request); });
  return request;
}

export function voteRequest(id: string) {
  mutate(data => {
    const req = data.requests.find(x => x.id === id);
    if (req) req.votes += 1;
  });
}

export function setRequestStatus(id: string, status: ResourceRequest['status']) {
  mutate(data => {
    const req = data.requests.find(x => x.id === id);
    if (req) { req.status = status; req.updatedAt = new Date().toISOString(); }
  });
}

// ─── REPORTS ───────────────────────────────────────────────────────────────

export function submitReport(input: Omit<ResourceReport, 'id' | 'status' | 'createdAt'>): ResourceReport {
  const report: ResourceReport = { ...input, id: `rep-${Date.now()}`, status: 'open', createdAt: new Date().toISOString() };
  mutate(data => { data.reports.unshift(report); });
  return report;
}

export function setReportStatus(id: string, status: ResourceReport['status']) {
  mutate(data => {
    const rep = data.reports.find(x => x.id === id);
    if (rep) { rep.status = status; rep.resolvedAt = new Date().toISOString(); }
  });
}

// ─── ADMIN CRUD ────────────────────────────────────────────────────────────

export function saveResource(resource: Resource) {
  mutate(data => {
    const idx = data.resources.findIndex(r => r.id === resource.id);
    if (idx >= 0) data.resources[idx] = resource;
    else data.resources.unshift(resource);
    logAudit(data, idx >= 0 ? 'update_resource' : 'create_resource', resource.title, resource.id);
  });
  return resource;
}

export function deleteResource(id: string) {
  mutate(data => {
    const res = data.resources.find(r => r.id === id);
    data.resources = data.resources.filter(r => r.id !== id);
    logAudit(data, 'delete_resource', res?.title || id, id);
  });
}

export function saveHomepageSection(section: HomepageSection) {
  mutate(data => {
    const idx = data.homepageSections.findIndex(s => s.id === section.id);
    if (idx >= 0) data.homepageSections[idx] = section;
    else data.homepageSections.push(section);
  });
}

export function saveRevisionCampaign(campaign: RevisionCampaign) {
  mutate(data => {
    const idx = data.revisionCampaigns.findIndex(c => c.id === campaign.id);
    if (idx >= 0) data.revisionCampaigns[idx] = campaign;
    else data.revisionCampaigns.push(campaign);
  });
}

export function deleteRevisionCampaign(id: string) {
  mutate(data => { data.revisionCampaigns = data.revisionCampaigns.filter(c => c.id !== id); });
}

// Taxonomy CRUD
export function saveExam(exam: Exam) {
  mutate(data => {
    const idx = data.exams.findIndex(e => e.id === exam.id);
    if (idx >= 0) data.exams[idx] = exam;
    else data.exams.push(exam);
    logAudit(data, 'save_exam', exam.name, exam.id);
  });
}
export function saveExamCategory(cat: ExamCategory) {
  mutate(data => {
    const idx = data.examCategories.findIndex(c => c.id === cat.id);
    if (idx >= 0) data.examCategories[idx] = cat;
    else data.examCategories.push(cat);
  });
}
export function saveStage(stage: ExamStage) {
  mutate(data => {
    const idx = data.examStages.findIndex(s => s.id === stage.id);
    if (idx >= 0) data.examStages[idx] = stage;
    else data.examStages.push(stage);
  });
}
export function saveSubject(subject: Subject) {
  mutate(data => {
    const idx = data.subjects.findIndex(s => s.id === subject.id);
    if (idx >= 0) data.subjects[idx] = subject;
    else data.subjects.push(subject);
  });
}
export function saveUnit(unit: SubjectUnit) {
  mutate(data => {
    const idx = data.units.findIndex(u => u.id === unit.id);
    if (idx >= 0) data.units[idx] = unit;
    else data.units.push(unit);
  });
}
export function saveTopic(topic: Topic) {
  mutate(data => {
    const idx = data.topics.findIndex(t => t.id === topic.id);
    if (idx >= 0) data.topics[idx] = topic;
    else data.topics.push(topic);
  });
}
export function saveInstitution(inst: Institution) {
  mutate(data => {
    const idx = data.institutions.findIndex(i => i.id === inst.id);
    if (idx >= 0) data.institutions[idx] = inst;
    else data.institutions.push(inst);
  });
}
export function saveCourse(course: Course) {
  mutate(data => {
    const idx = data.courses.findIndex(c => c.id === course.id);
    if (idx >= 0) data.courses[idx] = course;
    else data.courses.push(course);
  });
}
export function saveMajor(major: Major) {
  mutate(data => {
    const idx = data.majors.findIndex(m => m.id === major.id);
    if (idx >= 0) data.majors[idx] = major;
    else data.majors.push(major);
  });
}
export function saveSemester(semester: Semester) {
  mutate(data => {
    const idx = data.semesters.findIndex(s => s.id === semester.id);
    if (idx >= 0) data.semesters[idx] = semester;
    else data.semesters.push(semester);
  });
}

export function getAllResources(): Resource[] {
  return load().resources;
}

export function resetLibrary() {
  cached = seedLibrary();
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }
}

function logAudit(data: NotesLibrary, action: string, entity: string, entityId: string) {
  data.auditLog.unshift({ id: `aud-${Date.now()}`, action, entity, entityId, by: 'admin', at: new Date().toISOString() });
  data.auditLog = data.auditLog.slice(0, 200);
}
