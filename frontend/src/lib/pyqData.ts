import { examMenuCategories } from './examMenuData';

// ─── TYPES ─────────────────────────────────────────────────────────────────

export interface PyqPaper {
  year: number;
  stage: 'Prelims' | 'Mains';
  subjects: string[];
  totalQuestions: number;
  marks: number;
}

export interface PyqPracticeSet {
  id: string;
  subject: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PyqSubExam {
  slug: string;
  name: string;
  icon: string;
  description: string;
  papers: PyqPaper[];
  practiceSets: PyqPracticeSet[];
}

export interface PyqCategory {
  id: string;
  slug: string;
  name: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  exams: PyqSubExam[];
}

export interface PyqQuestion {
  id: string;
  subject: string;
  text: string;
  options: string[];
  answer: number;
  explanation: string;
  year?: number;
}

// ─── GENERATORS ─────────────────────────────────────────────────────────────

const PAPER_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

const DEFAULT_SUBJECTS = ['History', 'Polity', 'Geography', 'Economy', 'Science & Tech', 'Current Affairs'];

const PRACTICE_SUBJECTS: { subject: string; questionCount: number; difficulty: PyqPracticeSet['difficulty'] }[] = [
  { subject: 'History', questionCount: 10, difficulty: 'medium' },
  { subject: 'Polity', questionCount: 10, difficulty: 'medium' },
  { subject: 'Geography', questionCount: 10, difficulty: 'easy' },
  { subject: 'Economy', questionCount: 10, difficulty: 'hard' },
  { subject: 'General Science', questionCount: 10, difficulty: 'easy' },
  { subject: 'Current Affairs', questionCount: 10, difficulty: 'medium' },
];

function buildPapers(): PyqPaper[] {
  const papers: PyqPaper[] = [];
  for (const year of PAPER_YEARS) {
    for (const stage of ['Prelims', 'Mains'] as const) {
      papers.push({
        year,
        stage,
        subjects: DEFAULT_SUBJECTS,
        totalQuestions: stage === 'Prelims' ? 100 : 80,
        marks: stage === 'Prelims' ? 200 : 200,
      });
    }
  }
  return papers;
}

// ─── CATALOGUE ──────────────────────────────────────────────────────────────

export const pyqCategories: PyqCategory[] = examMenuCategories.map((cat) => ({
  id: cat.id,
  slug: cat.slug,
  name: cat.name,
  color: cat.color,
  gradientFrom: cat.gradientFrom,
  gradientTo: cat.gradientTo,
  exams: cat.exams.map((ex) => ({
    slug: ex.slug,
    name: ex.name,
    icon: ex.icon,
    description: ex.description,
    papers: buildPapers(),
    practiceSets: PRACTICE_SUBJECTS.map((ps, i) => ({
      id: `set-${ex.slug}-${i}`,
      subject: ps.subject,
      questionCount: ps.questionCount,
      difficulty: ps.difficulty,
    })),
  })),
}));

export function getPyqCategoryById(id: string): PyqCategory | undefined {
  return pyqCategories.find((c) => c.id === id);
}

export function getPyqCategoryBySlug(slug: string): PyqCategory | undefined {
  return pyqCategories.find((c) => c.slug === slug);
}

export function findPyqCategoryForExam(examSlug: string): PyqCategory | undefined {
  return pyqCategories.find((c) => c.exams.some((e) => e.slug === examSlug));
}

export function findPyqExam(examSlug: string): PyqSubExam | undefined {
  for (const cat of pyqCategories) {
    const exam = cat.exams.find((e) => e.slug === examSlug);
    if (exam) return exam;
  }
  return undefined;
}

// ─── PRACTICE QUESTION BANK ─────────────────────────────────────────────────

export const pyqQuestionBank: PyqQuestion[] = [
  // History
  { id: 'h1', subject: 'History', year: 2022, text: 'Which of the following statements about the Harappan civilization is/are correct?', options: ['They had a script which is yet to be deciphered', 'They were primarily urban dwellers', 'They worshipped Mother Goddess', 'All of the above'], answer: 3, explanation: 'The Harappan civilization had a script that remains undeciphered. They were primarily urban dwellers with advanced city planning, and archaeological evidence suggests worship of a Mother Goddess figure.' },
  { id: 'h2', subject: 'History', year: 2021, text: 'Who was the first Chief Minister of Odisha?', options: ['Harekrushna Mahatab', 'Biju Patnaik', 'Nandini Satpathy', 'Janaki Ballabh Patnaik'], answer: 0, explanation: 'Harekrushna Mahatab became the first Chief Minister of Odisha in 1946. He is also known as "Utkal Keshari".' },
  { id: 'h3', subject: 'History', year: 2023, text: 'The Sun Temple at Konark was built by which ruler of the Eastern Ganga dynasty?', options: ['Anantavarman Chodaganga', 'Narasimhadeva I', 'Bhanudeva II', 'Kapilendra Deva'], answer: 1, explanation: 'The Sun Temple at Konark was built around 1250 CE by King Narasimhadeva I of the Eastern Ganga dynasty.' },
  { id: 'h4', subject: 'History', year: 2020, text: 'The Kalinga War, which transformed Emperor Ashoka, was fought in which year?', options: ['261 BCE', '266 BCE', '251 BCE', '268 BCE'], answer: 0, explanation: 'The Kalinga War was fought in 261 BCE. The devastation caused Ashoka to embrace Buddhism and adopt the policy of Dhamma.' },
  { id: 'h5', subject: 'History', year: 2022, text: 'The ancient site of Golbai Sasan, associated with maritime trade, is located in which state?', options: ['West Bengal', 'Andhra Pradesh', 'Odisha', 'Tamil Nadu'], answer: 2, explanation: 'Golbai Sasan is an archaeological site in Odisha known for early maritime trade and pottery findings dating back to the Chalcolithic period.' },
  { id: 'h6', subject: 'History', year: 2021, text: 'Mahavira, the 24th Tirthankara of Jainism, was born in which place?', options: ['Kundagrama', 'Kapilavastu', 'Pataliputra', 'Vaishali'], answer: 0, explanation: 'Mahavira was born at Kundagrama near Vaishali (in present-day Bihar). His parents were from the Lichchhavi tribe.' },
  { id: 'h7', subject: 'History', year: 2023, text: 'The founder of the Ganga dynasty in Odisha was:', options: ['Anantavarman Chodaganga', 'Chola king Rajendra I', 'Vajrahasta V', 'Narasingha Deva II'], answer: 0, explanation: 'Anantavarman Chodaganga Deva founded the Eastern Ganga dynasty in Odisha around 1076 CE.' },
  { id: 'h8', subject: 'History', year: 2019, text: 'The Rath Yatra of Lord Jagannath at Puri is associated with which temple?', options: ['Lingaraj Temple', 'Jagannath Temple', 'Sun Temple', 'Mukteswar Temple'], answer: 1, explanation: 'The Rath Yatra is celebrated at the Jagannath Temple in Puri, one of the four Char Dham pilgrimage sites.' },

  // Polity
  { id: 'p1', subject: 'Polity', year: 2023, text: 'The concept of the "Basic Structure" of the Indian Constitution was propounded in which landmark case?', options: ['Kesavananda Bharati v. State of Kerala', 'Golaknath v. State of Punjab', 'Minerva Mills v. Union of India', 'A.K. Gopalan v. State of Madras'], answer: 0, explanation: 'The Basic Structure doctrine was propounded in Kesavananda Bharati v. State of Kerala (1973), holding that Parliament cannot alter the basic structure of the Constitution.' },
  { id: 'p2', subject: 'Polity', year: 2022, text: 'Right to protection of life and personal liberty is enshrined in which Article of the Constitution?', options: ['Article 19', 'Article 20', 'Article 21', 'Article 22'], answer: 2, explanation: 'Article 21 guarantees protection of life and personal liberty. It has been interpreted expansively by the Supreme Court.' },
  { id: 'p3', subject: 'Polity', year: 2021, text: 'A Money Bill is defined under which Article of the Constitution?', options: ['Article 108', 'Article 109', 'Article 110', 'Article 111'], answer: 2, explanation: 'Article 110 defines a Money Bill. A Money Bill can only be introduced in the Lok Sabha on the recommendation of the President.' },
  { id: 'p4', subject: 'Polity', year: 2023, text: 'The maximum strength of the Rajya Sabha is:', options: ['238', '245', '250', '260'], answer: 2, explanation: 'The Rajya Sabha can have a maximum of 250 members — 238 elected from states and union territories and 12 nominated by the President.' },
  { id: 'p5', subject: 'Polity', year: 2020, text: 'The words "Socialist" and "Secular" were added to the Preamble by which Amendment?', options: ['24th Amendment', '42nd Amendment', '44th Amendment', '52nd Amendment'], answer: 1, explanation: 'The 42nd Amendment (1976) inserted the words "Socialist" and "Secular" into the Preamble of the Constitution.' },
  { id: 'p6', subject: 'Polity', year: 2022, text: 'Panchayati Raj institutions received constitutional status through which Amendment?', options: ['61st Amendment', '73rd Amendment', '74th Amendment', '86th Amendment'], answer: 1, explanation: 'The 73rd Constitutional Amendment Act (1992) gave constitutional status to Panchayati Raj institutions through Part IX of the Constitution.' },
  { id: 'p7', subject: 'Polity', year: 2021, text: 'Who administers the oath of office to the Chief Justice of India?', options: ['The President', 'The Vice President', 'The outgoing Chief Justice', 'The Attorney General'], answer: 0, explanation: 'The President administers the oath of office to the Chief Justice of India under Article 124 of the Constitution.' },
  { id: 'p8', subject: 'Polity', year: 2023, text: 'The Directive Principles of State Policy are borrowed from the Constitution of which country?', options: ['USA', 'Ireland', 'Canada', 'Australia'], answer: 1, explanation: 'The Directive Principles of State Policy (Part IV) were borrowed from the Constitution of Ireland (Irish Free State).' },

  // Geography
  { id: 'g1', subject: 'Geography', year: 2022, text: 'Which of the following rivers is correctly matched? 1. Mahanadi – Odisha 2. Godavari – Maharashtra 3. Kaveri – Karnataka', options: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'], answer: 3, explanation: 'All are correctly matched. The Mahanadi flows through Odisha, the Godavari originates in Maharashtra, and the Kaveri originates in Karnataka.' },
  { id: 'g2', subject: 'Geography', year: 2021, text: 'Which river is known as the "Sorrow of Odisha"?', options: ['Mahanadi', 'Brahmani', 'Baitarani', 'Rushikulya'], answer: 2, explanation: 'The Baitarani river is called the "Sorrow of Odisha" because of frequent devastating floods in its basin.' },
  { id: 'g3', subject: 'Geography', year: 2023, text: 'The Hirakud Dam is built on which river?', options: ['Mahanadi', 'Brahmani', 'Godavari', 'Subarnarekha'], answer: 0, explanation: 'The Hirakud Dam, one of the longest earthen dams in the world, is built across the Mahanadi river near Sambalpur, Odisha.' },
  { id: 'g4', subject: 'Geography', year: 2020, text: 'Chilika Lake is the largest ________ in India.', options: ['Freshwater lake', 'Brackish water lagoon', 'Saltwater lake', 'Crater lake'], answer: 1, explanation: 'Chilika Lake is the largest brackish water lagoon in India and a Ramsar site known for migratory birds and Irrawaddy dolphins.' },
  { id: 'g5', subject: 'Geography', year: 2022, text: 'The major seaport of Odisha is:', options: ['Visakhapatnam', 'Paradip', 'Kolkata', 'Mangalore'], answer: 1, explanation: 'Paradip Port, located on the Bay of Bengal coast in Jagatsinghpur district, is the major seaport of Odisha.' },
  { id: 'g6', subject: 'Geography', year: 2021, text: 'Similipal National Park, famous for tigers and orchids, is located in which state?', options: ['West Bengal', 'Chhattisgarh', 'Odisha', 'Jharkhand'], answer: 2, explanation: 'Similipal National Park is in the Mayurbhanj district of Odisha. It is a tiger reserve and a UNESCO Biosphere Reserve.' },
  { id: 'g7', subject: 'Geography', year: 2023, text: 'The Tropic of Cancer passes through approximately how many districts of Odisha?', options: ['4', '6', '8', '10'], answer: 1, explanation: 'The Tropic of Cancer passes through about six districts of Odisha, running near Balasore, Mayurbhanj, and adjacent regions.' },
  { id: 'g8', subject: 'Geography', year: 2019, text: 'Which plateau covers most of the western part of Odisha?', options: ['Deccan Plateau', 'Chota Nagpur Plateau', 'Malwa Plateau', 'Bundelkhand Plateau'], answer: 1, explanation: 'The Chota Nagpur Plateau extends into the western parts of Odisha, contributing to its mineral-rich hilly terrain.' },

  // Economy
  { id: 'e1', subject: 'Economy', year: 2023, text: 'Inflation in India for retail prices is primarily measured by which index?', options: ['WPI', 'CPI', 'GDP Deflator', 'IIP'], answer: 1, explanation: 'Retail inflation in India is measured by the Consumer Price Index (CPI), which tracks price changes of goods and services consumed by households.' },
  { id: 'e2', subject: 'Economy', year: 2022, text: 'The authority responsible for the monetary policy of India is:', options: ['SEBI', 'RBI', 'SBI', 'Ministry of Finance'], answer: 1, explanation: 'The Reserve Bank of India (RBI) formulates and implements India\'s monetary policy through the Monetary Policy Committee (MPC).' },
  { id: 'e3', subject: 'Economy', year: 2021, text: 'GST (Goods and Services Tax) was introduced in India in which year?', options: ['2015', '2016', '2017', '2018'], answer: 2, explanation: 'GST came into effect on 1 July 2017, replacing multiple indirect taxes with a unified tax regime.' },
  { id: 'e4', subject: 'Economy', year: 2023, text: 'The NITI Aayog replaced which institution?', options: ['Planning Commission', 'Finance Commission', 'Election Commission', 'UGC'], answer: 0, explanation: 'The NITI Aayog replaced the Planning Commission on 1 January 2015, moving from the Five-Year-Plan model to a policy think tank approach.' },
  { id: 'e5', subject: 'Economy', year: 2020, text: 'GDP stands for:', options: ['Gross Domestic Product', 'Gross Development Product', 'General Domestic Product', 'Gross Domestic Progress'], answer: 0, explanation: 'GDP (Gross Domestic Product) is the total monetary value of all final goods and services produced within a country in a given period.' },
  { id: 'e6', subject: 'Economy', year: 2022, text: 'The repo rate is the rate at which:', options: ['Banks lend to customers', 'RBI lends to commercial banks', 'Commercial banks lend to RBI', 'Banks lend to each other'], answer: 1, explanation: 'The repo rate is the rate at which the RBI lends short-term funds to commercial banks against government securities.' },

  // General Science
  { id: 's1', subject: 'General Science', year: 2022, text: 'The chemical formula of water is:', options: ['CO2', 'H2O', 'O2', 'H2O2'], answer: 1, explanation: 'Water is a compound of hydrogen and oxygen with the chemical formula H2O.' },
  { id: 's2', subject: 'General Science', year: 2021, text: 'Which vitamin is synthesized by the human body in the presence of sunlight?', options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'], answer: 3, explanation: 'Vitamin D is synthesized in the skin on exposure to sunlight (ultraviolet-B radiation).' },
  { id: 's3', subject: 'General Science', year: 2023, text: 'The largest organ of the human body is:', options: ['Liver', 'Brain', 'Skin', 'Lungs'], answer: 2, explanation: 'The skin is the largest organ of the human body, covering an area of about 1.5–2 square metres in adults.' },
  { id: 's4', subject: 'General Science', year: 2020, text: 'The unit of force in the SI system is:', options: ['Joule', 'Watt', 'Newton', 'Pascal'], answer: 2, explanation: 'The SI unit of force is the Newton (N), named after Sir Isaac Newton.' },
  { id: 's5', subject: 'General Science', year: 2022, text: 'The normal pH range of human blood is approximately:', options: ['5.0 – 6.0', '7.35 – 7.45', '8.0 – 9.0', '4.5 – 5.5'], answer: 1, explanation: 'The normal pH of human blood is slightly alkaline, between 7.35 and 7.45.' },
  { id: 's6', subject: 'General Science', year: 2021, text: 'Which metal is the best conductor of electricity?', options: ['Copper', 'Gold', 'Aluminium', 'Silver'], answer: 3, explanation: 'Silver is the best conductor of electricity among metals, followed by copper and gold.' },

  // Current Affairs
  { id: 'c1', subject: 'Current Affairs', year: 2026, text: 'The RBI kept the repo rate unchanged at which level in its July 2026 policy review?', options: ['6.00%', '6.25%', '6.50%', '5.75%'], answer: 1, explanation: 'The RBI maintained the repo rate at 6.25% for the third consecutive review, keeping a "neutral" stance as retail inflation stayed within target.' },
  { id: 'c2', subject: 'Current Affairs', year: 2026, text: 'India and ASEAN signed a landmark economic partnership agreement in July 2026 to boost bilateral trade by how much over five years?', options: ['15%', '20%', '25%', '35%'], answer: 2, explanation: 'The India–ASEAN Comprehensive Economic Partnership Agreement aims to boost bilateral trade by 25% over five years with tariff reductions on 5,000+ products.' },
  { id: 'c3', subject: 'Current Affairs', year: 2026, text: 'ISRO\'s EOS-06 Earth Observation Satellite was launched by which launch vehicle?', options: ['GSLV Mk III', 'PSLV-C62', 'SSLV-D2', 'LVM-3'], answer: 1, explanation: 'EOS-06 was placed in a sun-synchronous orbit by the Polar Satellite Launch Vehicle (PSLV-C62) from Sriharikota.' },
  { id: 'c4', subject: 'Current Affairs', year: 2025, text: 'The Chandrayaan-3 landing site on the Moon is named:', options: ['Jawahar Point', 'Shiv Shakti Point', 'Tiranga Point', 'Bharat Point'], answer: 1, explanation: 'The Chandrayaan-3 landing site at the lunar south pole was named "Shiv Shakti Point" by the Government of India.' },
  { id: 'c5', subject: 'Current Affairs', year: 2025, text: 'Which Indian city hosted the G20 Summit in 2023?', options: ['Mumbai', 'New Delhi', 'Bengaluru', 'Hyderabad'], answer: 1, explanation: 'India hosted the G20 Summit in New Delhi in September 2023 under the theme "Vasudhaiva Kutumbakam".' },
  { id: 'c6', subject: 'Current Affairs', year: 2026, text: 'The headquarters of the Reserve Bank of India is located in:', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], answer: 0, explanation: 'The RBI was established in 1935 with its central office in Mumbai (moved from Kolkata in 1937).' },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function getPracticeQuestions(examSlug: string, subject: string, count: number): PyqQuestion[] {
  const pool = pyqQuestionBank.filter((q) => q.subject === subject);
  if (pool.length === 0) return [];
  const off = hashStr(examSlug) % pool.length;
  const out: PyqQuestion[] = [];
  for (let i = 0; i < pool.length && out.length < count; i++) {
    out.push(pool[(off + i) % pool.length]);
  }
  return out;
}

export function getCategoryStats(cat: PyqCategory) {
  const paperCount = cat.exams.reduce((sum, e) => sum + e.papers.length, 0);
  const setCount = cat.exams.reduce((sum, e) => sum + e.practiceSets.length, 0);
  return { paperCount, setCount, examCount: cat.exams.length };
}

export const totalPyqStats = pyqCategories.reduce(
  (acc, cat) => {
    const s = getCategoryStats(cat);
    acc.papers += s.paperCount;
    acc.sets += s.setCount;
    acc.exams += s.examCount;
    return acc;
  },
  { papers: 0, sets: 0, exams: 0 },
);
