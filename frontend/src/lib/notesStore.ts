export interface NoteItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  isPremium: boolean;
  viewCount: number;
  thumbnail?: string;
  downloadUrl?: string;
  tags?: string;
  exam: { name: string; slug: string };
  subject: { name: string; slug: string };
  topic?: { name: string; slug: string };
  createdAt: string;
}

const STORAGE_KEY = 'testime_notes';

const seedNotes: NoteItem[] = [
  {
    id: 'n1',
    title: 'Ancient Indian History — Complete Notes',
    slug: 'ancient-india-history-notes',
    summary: 'Comprehensive study notes covering the Indus Valley Civilisation, Vedic period, Maurya and Gupta empires with exam-oriented points.',
    content: `<h2>Indus Valley Civilisation</h2>
    <p>The Indus Valley Civilisation (c. 2500–1900 BCE) was one of the world's earliest urban civilisations, spread across the Indus and Ghaggar-Hakra river systems.</p>
    <ul><li>Major sites: Harappa (Punjab), Mohenjo-daro (Sindh), Lothal (Gujarat, dockyard), Dholavira (Gujarat), Rakhigarhi (Haryana)</li><li>Known for planned grid cities, drainage systems, and standardised brick sizes</li><li>Seals with the unicorn motif and the Pashupati seal were significant finds</li><li>Agriculture, trade with Mesopotamia, and bronze working were key economic activities</li></ul>
    <h2>Vedic Period</h2>
    <p>The Vedic period is divided into Early Vedic (1500–1000 BCE) and Later Vedic (1000–600 BCE) phases based on the composition of the Vedas.</p>
    <ul><li>Rigveda is the oldest text, containing 1,028 hymns</li><li>Later Vedic period saw the rise of iron (black and red ware), territorial states (Janapadas), and social stratification</li></ul>
    <h2>Mauryan Empire</h2>
    <p>Founded by Chandragupta Maurya (321 BCE) with the guidance of Chanakya, the Mauryan Empire was the first pan-Indian empire.</p>
    <ul><li>Ashoka the Great propagated Dhamma and adopted Buddhism after the Kalinga War</li><li>Arthashastra by Chanakya outlined statecraft and administration</li><li>Rock and pillar edicts spread Ashoka's policies</li></ul>
    <h2>Gupta Empire</h2>
    <p>Often called the "Golden Age of India", the Gupta Empire (c. 320–550 CE) witnessed remarkable achievements in science, art, and literature.</p>
    <ul><li>Aryabhata propounded that the Earth rotates on its axis; Varahamihira wrote on astronomy</li><li>Nalanda University became a major centre of learning</li><li>Kalidasa composed Abhijnanasakuntalam</li></ul>`,
    isPremium: false,
    viewCount: 1250,
    exam: { name: 'OPSC', slug: 'opsc' },
    subject: { name: 'History', slug: 'history' },
    topic: { name: 'Ancient India', slug: 'ancient-india' },
    createdAt: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'n2',
    title: 'Geography of Odisha — Rivers, Forests & Resources',
    slug: 'odisha-geography-notes',
    summary: 'Detailed notes on Odisha geography including major rivers, mineral resources, forests, and physiographic divisions for all state exams.',
    content: `<h2>Physiographic Divisions</h2>
    <p>Odisha can be divided into four physiographic regions — the Coastal Plains, the Middle Mountainous and Highland Region, the Central Plateaus, and the Lower Plains.</p>
    <h2>Major Rivers</h2>
    <ul><li>Mahanadi — originates in Chhattisgarh, flows through Cuttack, empties into the Bay of Bengal</li><li>Brahmani — formed by the confluence of Sankh and Koel rivers</li><li>Baitarani — important river of northern Odisha</li><li>Subarnarekha — borders Odisha and Jharkhand</li><li>Rushikulya — southern Odisha river</li></ul>
    <h2>Mineral Resources</h2>
    <p>Odisha is a mineral-rich state producing nearly all of India's chromite, and significant shares of bauxite, iron ore, and manganese. Hirakud Dam on the Mahanadi is one of the longest dams in the world.</p>
    <h2>Forests & Biodiversity</h2>
    <p>About one-third of Odisha is under forest cover. The state is home to the Simlipal National Park, Bhitarkanika Mangroves, Chilika Lake (Asia's largest brackish lagoon), and the Olive Ridley turtles at Gahirmatha.</p>`,
    isPremium: false,
    viewCount: 980,
    exam: { name: 'OSSSC', slug: 'osssc' },
    subject: { name: 'Geography', slug: 'geography' },
    topic: { name: 'Odisha Geography', slug: 'odisha-geography' },
    createdAt: '2026-06-05T09:00:00.000Z',
  },
  {
    id: 'n3',
    title: 'Indian Polity — Constitution & Union Executive',
    slug: 'indian-polity-constitution-notes',
    summary: 'Exam-ready polity notes covering the salient features of the Constitution, fundamental rights, DPSPs, and the Union Executive.',
    content: `<h2>Salient Features of the Constitution</h2>
    <ul><li>Written and lengthiest constitution in the world</li><li>Federal structure with unitary bias</li><li>Parliamentary form of government</li><li>Independent judiciary with judicial review</li><li>Single citizenship and universal adult franchise</li></ul>
    <h2>Fundamental Rights (Part III)</h2>
    <ul><li>Article 14: Equality before law</li><li>Article 19: Six freedoms</li><li>Article 21: Protection of life and personal liberty</li><li>Articles 25–28: Religious freedom</li><li>Article 32: Right to constitutional remedies</li></ul>
    <h2>Directive Principles (Part IV)</h2>
    <p>Directive Principles of State Policy are borrowed from the Irish Constitution and are non-justiciable guidelines for the state to ensure social and economic democracy.</p>
    <h2>Union Executive</h2>
    <ul><li>President — constitutional head, elected by an electoral college</li><li>Vice-President — ex-officio Chairman of Rajya Sabha</li><li>Prime Minister and Council of Ministers — real executive</li></ul>`,
    isPremium: false,
    viewCount: 1570,
    exam: { name: 'OSSC', slug: 'ossc' },
    subject: { name: 'Polity', slug: 'polity' },
    topic: { name: 'Constitution', slug: 'constitution' },
    createdAt: '2026-06-10T09:00:00.000Z',
  },
  {
    id: 'n4',
    title: 'Arithmetic & Data Interpretation — Speed Tricks',
    slug: 'arithmetic-data-interpretation-notes',
    summary: 'Time-saving methods for percentages, profit & loss, ratio, averages, and data interpretation with solved examples.',
    content: `<h2>Percentage Shortcuts</h2>
    <p>Convert common fractions to percentages for instant calculations. For example, 1/2 = 50%, 1/4 = 25%, 1/8 = 12.5%, 1/3 = 33.33%.</p>
    <h2>Profit & Loss</h2>
    <p>Always calculate profit/loss on the cost price. Use the formula: Selling Price = CP × (1 + Profit%/100).</p>
    <h2>Ratio & Proportion</h2>
    <p>When comparing two ratios, cross-multiply: a/b vs c/d — compare ad and bc. This avoids decimal conversions.</p>
    <h2>Data Interpretation</h2>
    <ul><li>Read the title, units, and note the base year before solving</li><li>Use approximation for percentages to eliminate options</li><li>Practise bar graphs, line charts, pie charts, and tables regularly</li></ul>
    <blockquote>Speed comes from practice, not tricks alone. Solve 20 DI questions daily to build accuracy.</blockquote>`,
    isPremium: true,
    viewCount: 860,
    exam: { name: 'OSSC', slug: 'ossc' },
    subject: { name: 'Mathematics', slug: 'mathematics' },
    topic: { name: 'Arithmetic', slug: 'arithmetic' },
    createdAt: '2026-06-15T09:00:00.000Z',
  },
  {
    id: 'n5',
    title: 'Odia Language & Grammar Essentials',
    slug: 'odia-language-grammar-notes',
    summary: 'Key grammar rules, idioms, and comprehension strategies for the Odia language paper in OSSC and OSSSC exams.',
    content: `<h2>Why Odia Paper Matters</h2>
    <p>The Odia language paper is a qualifying yet scoring section in most Odisha state exams. Mastering basic grammar secures easy marks.</p>
    <h2>Key Topics to Cover</h2>
    <ul><li>Sandhi (সন্ধি) rules</li><li>Samasa (ସମାସ) — compound word formation</li><li>Biparitartha Sabda (opposite words)</li><li>Paryayabachi Sabda (synonyms)</li><li>Sentence correction and comprehension passages</li></ul>
    <h2>Study Strategy</h2>
    <p>Practise one comprehension passage daily and memorise 20 new synonyms and antonyms each week. Previous year questions are the best guide.</p>`,
    isPremium: false,
    viewCount: 720,
    exam: { name: 'OSSSC', slug: 'osssc' },
    subject: { name: 'Odia', slug: 'odia' },
    createdAt: '2026-06-20T09:00:00.000Z',
  },
  {
    id: 'n6',
    title: 'NCERT Science — Physics & Chemistry for Exams',
    slug: 'ncert-science-physics-chemistry-notes',
    summary: 'Concise NCERT-based notes on electricity, motion, acids & bases, and periodic classification, mapped to competitive exam questions.',
    content: `<h2>Physics Essentials</h2>
    <ul><li>Newton's three laws of motion</li><li>Work, energy, and power formulas</li><li>Electricity: Ohm's law V = IR, series and parallel circuits</li><li>Light: reflection, refraction, and mirrors/lenses</li></ul>
    <h2>Chemistry Essentials</h2>
    <ul><li>States of matter and changes of state</li><li>Acids, bases, and salts with pH scale</li><li>Metals and non-metals properties</li><li>Periodic table trends</li></ul>
    <p>These NCERT fundamentals appear across OSSC, OSSSC, and OPSC exams. Link every concept to a solved example to retain better.</p>`,
    isPremium: false,
    viewCount: 540,
    exam: { name: 'Odisha Teaching', slug: 'odisha-teaching' },
    subject: { name: 'Science', slug: 'science' },
    createdAt: '2026-06-25T09:00:00.000Z',
  },
];

function load(): NoteItem[] {
  if (typeof window === 'undefined') return seedNotes;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return seedNotes;
}

function save(notes: NoteItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function getNotes(params?: { examId?: string; subjectId?: string; topicId?: string; search?: string; page?: number }): { data: NoteItem[]; total: number; page: number; totalPages: number } {
  let filtered = load();
  if (params?.examId) filtered = filtered.filter(n => n.exam.slug === params.examId);
  if (params?.subjectId) filtered = filtered.filter(n => n.subject.slug === params.subjectId);
  if (params?.topicId) filtered = filtered.filter(n => n.topic?.slug === params.topicId);
  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.summary?.toLowerCase().includes(q) || n.tags?.toLowerCase().includes(q));
  }
  filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const page = params?.page || 1;
  const limit = 20;
  return { data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, totalPages: Math.ceil(filtered.length / limit) };
}

export function getNoteBySlug(slug: string): NoteItem | null {
  return load().find(n => n.slug === slug) || null;
}

export function getAllNotes(): NoteItem[] {
  return load();
}

export function incrementNoteViews(slug: string) {
  const notes = load();
  const idx = notes.findIndex(n => n.slug === slug);
  if (idx >= 0) {
    notes[idx] = { ...notes[idx], viewCount: notes[idx].viewCount + 1 };
    save(notes);
  }
}
