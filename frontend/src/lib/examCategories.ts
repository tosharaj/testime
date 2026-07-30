export interface SubExam {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface ExamCategory {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  fullName: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  examCount: number;
  stats: { label: string; value: string }[];
  highlights: string[];
  exams: SubExam[];
}

export const examCategories: ExamCategory[] = [
  {
    id: 'ossc',
    slug: 'ossc',
    name: 'OSSC',
    shortName: 'OSSC',
    fullName: 'Odisha Staff Selection Commission',
    description:
      'OSSC conducts various recruitment exams for Group B and Group C posts in Odisha government departments. Prepare with curated notes, practice questions, and mock tests.',
    color: '#4338ca',
    gradientFrom: 'from-indigo-600',
    gradientTo: 'to-indigo-500',
    examCount: 8,
    stats: [
      { label: 'Notes', value: '45+' },
      { label: 'Questions', value: '3,200+' },
      { label: 'Tests', value: '28+' },
      { label: 'Updates', value: '150+' },
    ],
    highlights: [
      'Combined Graduate Level (CGL) Exam',
      'Combined Higher Secondary Level (CHSL)',
      'Junior Assistant (JA) Recruitment',
      'Combined Recruitment Examination',
    ],
    exams: [
      { name: 'CGL', slug: 'ossc-cgl', icon: '🎯', description: 'Combined Graduate Level' },
      { name: 'CHSL', slug: 'ossc-chsl', icon: '📋', description: 'Combined Higher Secondary Level' },
      { name: 'Junior Assistant', slug: 'ossc-ja', icon: '📝', description: 'Junior Assistant Recruitment' },
      { name: 'Combined Recruitment', slug: 'ossc-cre', icon: '📊', description: 'Combined Recruitment Examination' },
      { name: 'Statistical Field Surveyor', slug: 'ossc-sfs', icon: '📐', description: 'Statistical Field Surveyor' },
      { name: 'Combined Technical Exam', slug: 'ossc-cte', icon: '⚙️', description: 'Combined Technical & Non-Technical' },
      { name: 'Excise Constable', slug: 'ossc-excise', icon: '🛡️', description: 'Excise Constable Recruitment' },
      { name: 'Other OSSC Exams', slug: 'ossc-other', icon: '📁', description: 'Other OSSC examinations' },
    ],
  },
  {
    id: 'osssc',
    slug: 'osssc',
    name: 'OSSSC',
    shortName: 'OSSSC',
    fullName: 'Odisha Sub-Ordinate Staff Selection Commission',
    description:
      'OSSSC handles recruitment for Class-III and Class-IV posts across Odisha government departments. Access comprehensive study material and practice resources.',
    color: '#059669',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-emerald-500',
    examCount: 7,
    stats: [
      { label: 'Notes', value: '60+' },
      { label: 'Questions', value: '4,500+' },
      { label: 'Tests', value: '35+' },
      { label: 'Updates', value: '200+' },
    ],
    highlights: [
      'Revenue Inspector (RI) Recruitment',
      'Panchayat Executive Officer (PEO)',
      'Junior Clerk & Assistant Exams',
      'Amin & Various Class-III Posts',
    ],
    exams: [
      { name: 'RI', slug: 'osssc-ri', icon: '🏛️', description: 'Revenue Inspector' },
      { name: 'ARI', slug: 'osssc-ari', icon: '📐', description: 'Assistant Revenue Inspector' },
      { name: 'Amin', slug: 'osssc-amin', icon: '📏', description: 'Amin Recruitment' },
      { name: 'ICDS Supervisor', slug: 'osssc-icds', icon: '👩‍🏫', description: 'ICDS Supervisor' },
      { name: 'Panchayat Executive Officer', slug: 'osssc-peo', icon: '📋', description: 'Panchayat Executive Officer' },
      { name: 'Junior Clerk', slug: 'osssc-clerk', icon: '📑', description: 'Junior Clerk Recruitment' },
      { name: 'Other OSSSC Exams', slug: 'osssc-other', icon: '📁', description: 'Other OSSSC examinations' },
    ],
  },
  {
    id: 'opsc',
    slug: 'opsc',
    name: 'OPSC',
    shortName: 'OPSC',
    fullName: 'Odisha Public Service Commission',
    description:
      'OPSC conducts prestigious state civil services examinations for Group A and Group B gazetted posts. Get expert guidance, comprehensive notes, and rigorous test series.',
    color: '#2563eb',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-blue-500',
    examCount: 6,
    stats: [
      { label: 'Notes', value: '80+' },
      { label: 'Questions', value: '6,800+' },
      { label: 'Tests', value: '42+' },
      { label: 'Updates', value: '180+' },
    ],
    highlights: [
      'Odisha Civil Services (OCS) Exam',
      'Assistant Section Officer (ASO)',
      'Odisha Forest Service (OFS)',
      'Various Gazetted Officer Posts',
    ],
    exams: [
      { name: 'OCS', slug: 'opsc-ocs', icon: '⚖️', description: 'Odisha Civil Services' },
      { name: 'ASO', slug: 'opsc-aso', icon: '📑', description: 'Assistant Section Officer' },
      { name: 'Medical Officer', slug: 'opsc-mo', icon: '🩺', description: 'Medical Officer Recruitment' },
      { name: 'Odisha Forest Service', slug: 'opsc-ofs', icon: '🌲', description: 'Odisha Forest Service' },
      { name: 'Odisha Police Service', slug: 'opsc-ops', icon: '👮', description: 'Odisha Police Service' },
      { name: 'Other OPSC Exams', slug: 'opsc-other', icon: '📁', description: 'Other OPSC examinations' },
    ],
  },
  {
    id: 'ssb',
    slug: 'ssb',
    name: 'SSB',
    shortName: 'SSB',
    fullName: 'Odisha State Selection Board',
    description:
      'SSB Odisha manages recruitment for teachers and education-related posts in the state. Access subject-wise notes, previous year papers, and mock tests tailored for SSB exams.',
    color: '#7c3aed',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-purple-500',
    examCount: 5,
    stats: [
      { label: 'Notes', value: '55+' },
      { label: 'Questions', value: '3,800+' },
      { label: 'Tests', value: '30+' },
      { label: 'Updates', value: '120+' },
    ],
    highlights: [
      'Lecturer Recruitment',
      'Junior Lecturer Recruitment',
      'TGT, PGT & Assistant Teacher',
      'CHSE & BSE Odisha Teaching Posts',
    ],
    exams: [
      { name: 'Lecturer', slug: 'ssb-lecturer', icon: '👨‍🏫', description: 'College Lecturer Recruitment' },
      { name: 'Junior Lecturer', slug: 'ssb-jl', icon: '📚', description: 'Junior Lecturer' },
      { name: 'TGT Recruitment', slug: 'ssb-tgt', icon: '📖', description: 'Trained Graduate Teacher' },
      { name: 'PGT Recruitment', slug: 'ssb-pgt', icon: '🧑‍🏫', description: 'Post Graduate Teacher' },
      { name: 'Other SSB Exams', slug: 'ssb-other', icon: '📁', description: 'Other SSB examinations' },
    ],
  },
  {
    id: 'odisha-police',
    slug: 'odisha-police',
    name: 'Odisha Police',
    shortName: 'Police',
    fullName: 'Odisha Police Recruitment Exams',
    description:
      'Complete preparation for Odisha Police constable, SI, ASI, and other departmental recruitment examinations with mock tests and study materials.',
    color: '#dc2626',
    gradientFrom: 'from-red-600',
    gradientTo: 'to-red-500',
    examCount: 6,
    stats: [
      { label: 'Notes', value: '40+' },
      { label: 'Questions', value: '3,000+' },
      { label: 'Tests', value: '25+' },
      { label: 'Updates', value: '130+' },
    ],
    highlights: [
      'Odisha Police Constable Recruitment',
      'Odisha Police SI (Sub-Inspector)',
      'ASI & Sepoy Recruitment',
      'Special Armed Police Exams',
    ],
    exams: [
      { name: 'Police Constable', slug: 'odisha-constable', icon: '👮', description: 'Odisha Police Constable' },
      { name: 'Sub-Inspector', slug: 'odisha-si', icon: '🕵️', description: 'Police Sub-Inspector' },
      { name: 'ASI', slug: 'odisha-asi', icon: '📋', description: 'Assistant Sub-Inspector' },
      { name: 'Sepoy', slug: 'odisha-sepoy', icon: '🛡️', description: 'Police Sepoy Recruitment' },
      { name: 'Fireman', slug: 'odisha-fireman', icon: '🔥', description: 'Odisha Fireman Recruitment' },
      { name: 'Other Police Exams', slug: 'odisha-police-other', icon: '📁', description: 'Other police exams' },
    ],
  },
  {
    id: 'odisha-teaching',
    slug: 'odisha-teaching',
    name: 'Odisha Teaching',
    shortName: 'Teaching',
    fullName: 'Odisha Teaching & Education Exams',
    description:
      'Comprehensive preparation for teaching eligibility tests and education entrance exams across Odisha including OTET, CT, B.Ed and more.',
    color: '#d97706',
    gradientFrom: 'from-amber-600',
    gradientTo: 'to-amber-500',
    examCount: 7,
    stats: [
      { label: 'Notes', value: '50+' },
      { label: 'Questions', value: '4,000+' },
      { label: 'Tests', value: '32+' },
      { label: 'Updates', value: '160+' },
    ],
    highlights: [
      'OTET (Odisha Teacher Eligibility Test)',
      'CT Entrance Examination',
      'B.Ed Entrance Exams',
      'TGT & PGT Recruitment',
    ],
    exams: [
      { name: 'OTET', slug: 'otet', icon: '📜', description: 'Odisha Teacher Eligibility Test' },
      { name: 'CT Exam', slug: 'ct-exam', icon: '🎓', description: 'Certificate in Teaching Entrance' },
      { name: 'B.Ed Entrance', slug: 'bed-entrance', icon: '📖', description: 'Bachelor of Education Entrance' },
      { name: 'TGT', slug: 'odisha-tgt', icon: '👨‍🏫', description: 'Trained Graduate Teacher' },
      { name: 'PGT', slug: 'odisha-pgt', icon: '🧑‍🏫', description: 'Post Graduate Teacher' },
      { name: 'D.El.Ed', slug: 'odisha-ded', icon: '📚', description: 'Diploma in Elementary Education' },
      { name: 'Other Teaching', slug: 'odisha-teaching-other', icon: '📁', description: 'Other teaching exams' },
    ],
  },
  {
    id: 'odisha-universities',
    slug: 'odisha-universities',
    name: 'Odisha Universities',
    shortName: 'Universities',
    fullName: 'Odisha University & College Entrance Exams',
    description:
      'Preparation resources for university entrance examinations, semester exams, and recruitment tests conducted by Odisha-based universities and colleges.',
    color: '#0d9488',
    gradientFrom: 'from-teal-600',
    gradientTo: 'to-teal-500',
    examCount: 5,
    stats: [
      { label: 'Notes', value: '35+' },
      { label: 'Questions', value: '2,800+' },
      { label: 'Tests', value: '20+' },
      { label: 'Updates', value: '100+' },
    ],
    highlights: [
      'Utkal University Entrance Exams',
      'OUAT Entrance (Agriculture)',
      'Sambalpur University Exams',
      'Biju Patnaik University Courses',
    ],
    exams: [
      { name: 'Utkal University', slug: 'utkal-university', icon: '🏛️', description: 'Utkal University Entrance' },
      { name: 'OUAT', slug: 'ouat', icon: '🌾', description: 'Odisha University of Agriculture & Technology' },
      { name: 'Sambalpur University', slug: 'sambalpur-uni', icon: '📚', description: 'Sambalpur University Exams' },
      { name: 'BPUT', slug: 'bput', icon: '⚙️', description: 'Biju Patnaik University of Technology' },
      { name: 'Other University Exams', slug: 'odisha-uni-other', icon: '📁', description: 'Other Odisha university exams' },
    ],
  },
  {
    id: 'other',
    slug: 'other',
    name: 'Other Competitive',
    shortName: 'Other',
    fullName: 'Other Odisha Competitive Exams',
    description:
      'Preparation resources for other competitive examinations in Odisha including forest guard, CTET, DSC, and various state-level recruitment tests.',
    color: '#64748b',
    gradientFrom: 'from-slate-600',
    gradientTo: 'to-slate-500',
    examCount: 8,
    stats: [
      { label: 'Notes', value: '70+' },
      { label: 'Questions', value: '5,500+' },
      { label: 'Tests', value: '38+' },
      { label: 'Updates', value: '200+' },
    ],
    highlights: [
      'Forest Guard & Forester Recruitment',
      'CTET (Central Teacher Eligibility Test)',
      'DSC (District Selection Committee)',
      'State Level Competitive Exams',
    ],
    exams: [
      { name: 'Forest Guard', slug: 'forest-guard', icon: '🌲', description: 'Forest Guard & Forester' },
      { name: 'CTET', slug: 'ctet', icon: '📜', description: 'Central Teacher Eligibility Test' },
      { name: 'DSC', slug: 'dsc', icon: '📋', description: 'District Selection Committee' },
      { name: 'Nursing Exams', slug: 'odisha-nursing', icon: '🩺', description: 'Nursing & Paramedical Exams' },
      { name: 'JE & AE Exams', slug: 'odisha-je', icon: '🏗️', description: 'Junior Engineer & Assistant Engineer' },
      { name: 'Secretariat Exams', slug: 'odisha-secretariat', icon: '🏢', description: 'Odisha Secretariat Recruitment' },
      { name: 'Welfare Dept. Exams', slug: 'odisha-welfare', icon: '🤝', description: 'Social Welfare Department Exams' },
      { name: 'Other State Exams', slug: 'other-state', icon: '📁', description: 'Other Odisha state-level exams' },
    ],
  },
];

export function getCategoryBySlug(slug: string): ExamCategory | undefined {
  return examCategories.find((c) => c.slug === slug);
}
