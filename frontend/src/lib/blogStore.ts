export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags?: string;
  category?: string;
  author?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

const STORAGE_KEY = 'testime_blog_posts';

export const blogCategories = ['Exam Tips', 'Study Material', 'Notifications', 'Success Stories'];

const seedPosts: BlogPost[] = [
  {
    id: 'p1',
    title: 'OSSC CGL 2026: Complete Preparation Strategy for Prelims',
    slug: 'ossc-cgl-2026-preparation-strategy',
    excerpt: 'A step-by-step 90-day plan to crack OSSC CGL Prelims with subject-wise weightage, daily routine, and the best resources for each section.',
    category: 'Exam Tips',
    tags: 'OSSC,Strategy,Preparation',
    author: 'Testime Team',
    content: `<h2>Understanding the OSSC CGL Exam Pattern</h2>
    <p>The OSSC Combined Graduate Level examination is one of the most competitive exams in Odisha. With thousands of aspirants appearing every year, a structured preparation plan is non-negotiable.</p>
    <p>The prelims paper consists of four sections — Arithmetic, Data Interpretation, Reasoning, and Odia Language. Each section carries equal weightage, and there is negative marking of 0.25 marks per wrong answer.</p>
    <h2>The 90-Day Plan</h2>
    <h3>Days 1–30: Foundation Phase</h3>
    <p>Focus on building your basics. Spend 2 hours on Arithmetic, 1.5 hours on Reasoning, and 1 hour on Odia language daily. Take one sectional test every weekend.</p>
    <h3>Days 31–60: Practice Phase</h3>
    <p>Solve previous year questions and attempt at least two full-length mock tests per week. Analyse every mistake and maintain an error log.</p>
    <h3>Days 61–90: Revision Phase</h3>
    <p>Revise formulas and shortcuts. Attempt daily quizzes and reduce your attempt time. Take one mock test every alternate day under timed conditions.</p>
    <h2>Key Resources</h2>
    <ul><li>NCERT Mathematics for fundamentals</li><li>R.S. Aggarwal for Reasoning</li><li>Previous 10 years OSSC question papers</li><li>Odisha monthly current affairs compilations</li></ul>
    <blockquote>Consistency beats intensity. Study 5 hours daily for 90 days rather than 10 hours for 30 days.</blockquote>`,
    isPublished: true,
    publishedAt: '2026-07-20T09:00:00.000Z',
    createdAt: '2026-07-18T09:00:00.000Z',
  },
  {
    id: 'p2',
    title: 'OPSC Civil Services Mains 2026: Answer Writing Guide',
    slug: 'opsc-mains-answer-writing-guide',
    excerpt: 'Master the art of answer writing for OPSC Mains with proven frameworks, common mistakes to avoid, and how to structure GS papers.',
    category: 'Exam Tips',
    tags: 'OPSC,Mains,Answer Writing',
    author: 'Testime Team',
    content: `<h2>Why Answer Writing Matters</h2>
    <p>In OPSC Mains, it is not just what you know but how you present it that earns you marks. A well-structured answer can convert average knowledge into a high score.</p>
    <h2>The Introduction–Body–Conclusion Framework</h2>
    <p>Every answer should follow a clear structure. Start with a crisp definition or context, develop your arguments with facts and examples, and end with a balanced conclusion.</p>
    <h2>Common Mistakes to Avoid</h2>
    <ul><li>Writing without planning — always allocate 2 minutes to outline your answer</li><li>Ignoring the word limit — a 150-word question needs a 150-word answer</li><li>Poor presentation — use headings, subheadings, and diagrams where relevant</li><li>Lack of data — support arguments with current statistics and schemes</li></ul>
    <h2>Practice Strategy</h2>
    <p>Write at least two full GS papers every week and get them evaluated. Focus on improving presentation, not just content.</p>`,
    isPublished: true,
    publishedAt: '2026-07-15T09:00:00.000Z',
    createdAt: '2026-07-14T09:00:00.000Z',
  },
  {
    id: 'p3',
    title: 'How to Revise Current Affairs with Monthly PDFs',
    slug: 'revise-current-affairs-monthly-pdfs',
    excerpt: 'A practical revision plan using monthly current affairs compilations, static GK sheets and topic-wise CA resources instead of daily news.',
    category: 'Exam Tips',
    tags: 'Current Affairs,Revision',
    author: 'Testime Team',
    content: `<h2>Odisha-Specific Focus</h2>
    <p>State-level current affairs carry significant weightage in Odisha competitive exams. Focus on cabinet decisions, budget allocations, and new schemes in your monthly compilations.</p>
    <ul><li>Odisha Cabinet approved 15 major infrastructure projects worth ₹8,500 crore</li><li>Odisha State Climate Action Plan 2.0 launched with a 40% emission cut target by 2035</li><li>New medical colleges announced in four underserved districts</li></ul>
    <h2>National News</h2>
    <ul><li>India and ASEAN signed a comprehensive economic partnership agreement</li><li>Supreme Court expanded fundamental rights to include digital privacy</li><li>RBI kept repo rate unchanged at 6.25%</li></ul>
    <h2>How to Revise Effectively</h2>
    <p>Read the monthly current affairs PDF from the Notes &amp; Resources library, make 5-point notes, and revise them every Sunday. Follow the Current Affairs Revision section for static GK, government schemes, reports &amp; indexes, and awards &amp; appointments.</p>`,
    isPublished: true,
    publishedAt: '2026-07-10T09:00:00.000Z',
    createdAt: '2026-07-09T09:00:00.000Z',
  },
  {
    id: 'p4',
    title: 'NCERT-Based Learning: Why It Is Your Exam Foundation',
    slug: 'ncert-based-learning-foundation',
    excerpt: 'Understanding why NCERT textbooks are the undisputed foundation for every Odisha competitive exam and how to study them the right way.',
    category: 'Study Material',
    tags: 'NCERT,Foundation',
    author: 'Testime Team',
    content: `<h2>The NCERT Advantage</h2>
    <p>More than 85% of questions in competitive exams are directly or indirectly based on NCERT concepts. Yet, most aspirants skip these books in favour of dense reference material.</p>
    <h2>How to Study NCERT Effectively</h2>
    <ol><li>Read each chapter at least twice — first for understanding, then for noting key facts</li><li>Create one-page summaries for every chapter</li><li>Solve the questions at the end of each chapter</li><li>Link each chapter to current affairs and previous year questions</li></ol>
    <p>On Testime, every NCERT chapter is linked to notes, MCQs, tests, and previous year questions for integrated learning.</p>
    <blockquote>Master the basics first. Advanced books build on NCERT, never replace it.</blockquote>`,
    isPublished: true,
    publishedAt: '2026-07-05T09:00:00.000Z',
    createdAt: '2026-07-04T09:00:00.000Z',
  },
  {
    id: 'p5',
    title: 'How One Aspirant Cracked OSSSC RI in First Attempt',
    slug: 'osssc-ri-first-attempt-success-story',
    excerpt: 'A real journey of discipline, smart time management, and strategic mock test practice that landed an OSSSC Revenue Inspector selection.',
    category: 'Success Stories',
    tags: 'OSSSC,Success Story',
    author: 'Testime Team',
    content: `<h2>The Starting Point</h2>
    <p>Rakesh, a final-year graduate from Cuttack, began his OSSSC RI preparation with just six months to go. His journey proves that a focused strategy beats a long-drawn one.</p>
    <h2>His Strategy</h2>
    <ul><li>Dedicated 3 hours to Arithmetic and Data Interpretation daily</li><li>Practiced Odia language comprehension every evening</li><li>Took 25 full-length mock tests — one every alternate day in the final month</li><li>Maintained a 200-page handwritten error notebook</li></ul>
    <h2>Lessons for Aspirants</h2>
    <p>Mock tests are the single biggest differentiator. They build speed, reveal weak areas, and simulate exam pressure. Analyse every question you got wrong — that is where the real learning happens.</p>`,
    isPublished: true,
    publishedAt: '2026-06-28T09:00:00.000Z',
    createdAt: '2026-06-27T09:00:00.000Z',
  },
  {
    id: 'p6',
    title: 'Odisha Teachers Recruitment 2026: Eligibility & Syllabus Guide',
    slug: 'odisha-teachers-recruitment-2026-guide',
    excerpt: 'Everything you need to know about the Odisha Teacher Eligibility Test — eligibility criteria, syllabus breakdown, and a preparation roadmap.',
    category: 'Notifications',
    tags: 'Teaching,OTET,Notification',
    author: 'Testime Team',
    content: `<h2>Eligibility Criteria</h2>
    <p>Candidates must hold a graduation degree with at least 50% marks along with a valid teacher training qualification such as D.El.Ed or B.Ed, depending on the level they are applying for.</p>
    <h2>Syllabus Breakdown</h2>
    <p>The OTET consists of two papers. Paper 1 is for primary level teachers and Paper 2 for upper primary. Both papers include Child Development & Pedagogy, Language subjects, Mathematics, and Environmental Studies or Science.</p>
    <h2>Preparation Roadmap</h2>
    <ol><li>Cover the full syllabus from the official handbook</li><li>Solve previous year OTET papers</li><li>Practice pedagogy-based MCQs daily</li><li>Take sectional and full-length mock tests</li></ol>`,
    isPublished: false,
    createdAt: '2026-06-25T09:00:00.000Z',
  },
];

export function getBlogStoreKey() {
  return STORAGE_KEY;
}

function load(): BlogPost[] {
  if (typeof window === 'undefined') return seedPosts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return seedPosts;
}

function save(posts: BlogPost[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getBlogPosts(): BlogPost[] {
  return load().filter(p => p.isPublished).sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return db - da;
  });
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return load().find(p => p.slug === slug) || null;
}

export function getAdminBlogPosts(): BlogPost[] {
  return load().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveBlogPost(post: BlogPost): BlogPost {
  const posts = load();
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx >= 0) posts[idx] = post;
  else posts.unshift(post);
  save(posts);
  return post;
}

export function deleteBlogPost(id: string) {
  save(load().filter(p => p.id !== id));
}

export function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
