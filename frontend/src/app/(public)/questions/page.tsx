'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ChevronRight, ChevronDown, ArrowRight, CheckCircle, Sparkles, BookOpen, Star } from 'lucide-react';

type Tab = 'prelims' | 'mains' | 'optional' | 'csat';
type YearGroup = 'last5' | '2017-2021' | 'older';

const tabs: { key: Tab; label: string }[] = [
  { key: 'prelims', label: 'Prelims' },
  { key: 'mains', label: 'Mains' },
  { key: 'optional', label: 'Optional Papers' },
  { key: 'csat', label: 'CSAT / Aptitude' },
];

const yearGroups: { key: YearGroup; label: string; years: number[] }[] = [
  { key: 'last5', label: 'Last 5 Years', years: [2026, 2025, 2024, 2023, 2022] },
  { key: '2017-2021', label: '2017 – 2021', years: [2021, 2020, 2019, 2018, 2017] },
  { key: 'older', label: 'Older Papers', years: [2016, 2015, 2014, 2013, 2012] },
];

const subjects = [
  { name: 'History', count: 245 },
  { name: 'Polity', count: 198 },
  { name: 'Geography', count: 187 },
  { name: 'Economy', count: 156 },
  { name: 'Science & Tech', count: 134 },
  { name: 'Environment', count: 112 },
  { name: 'Art & Culture', count: 89 },
  { name: 'Current Affairs', count: 267 },
];

const sampleQuestions = [
  {
    id: 1,
    subject: 'History',
    text: 'Which of the following statements about the Harappan civilization is/are correct?',
    options: ['They had a script which is yet to be deciphered', 'They were primarily urban dwellers', 'They worshipped Mother Goddess', 'All of the above'],
    answer: 'All of the above',
    explanation: 'The Harappan civilization had a script that remains undeciphered. They were primarily urban dwellers with advanced city planning. Archaeological evidence suggests worship of a Mother Goddess figure.',
  },
  {
    id: 2,
    subject: 'Polity',
    text: 'The concept of "Basic Structure" of the Indian Constitution was propounded in which landmark case?',
    options: ['Kesavananda Bharati v. State of Kerala', 'Golaknath v. State of Punjab', 'Minerva Mills v. Union of India', 'A.K. Gopalan v. State of Madras'],
    answer: 'Kesavananda Bharati v. State of Kerala',
    explanation: 'The Basic Structure doctrine was first propounded by the Supreme Court in the landmark case of Kesavananda Bharati v. State of Kerala (1973). It held that while Parliament has the power to amend the Constitution, it cannot alter its basic structure.',
  },
  {
    id: 3,
    subject: 'Geography',
    text: 'Which of the following is/are correctly matched? 1. Mahanadi – Odisha 2. Godavari – Maharashtra 3. Kaveri – Karnataka',
    options: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
    answer: '1, 2 and 3',
    explanation: 'All three are correctly matched. The Mahanadi originates in Chhattisgarh and flows through Odisha. The Godavari originates in Maharashtra. The Kaveri originates in Karnataka.',
  },
];

function PYQuestionsContent() {
  const searchParams = useSearchParams();
  const exam = searchParams.get('exam') || 'opsc';
  const tabParam = searchParams.get('tab') as Tab | null;
  const examName = exam.toUpperCase();
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || 'prelims');
  const [activeYear, setActiveYear] = useState<number | null>(2025);
  const [activeSubject, setActiveSubject] = useState('History');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const toggleExplanation = (id: number) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/exams/${exam}`} className="hover:text-brand-600 transition-colors">{examName}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">Previous Year Questions</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Main Content — 70% */}
          <div className="w-full lg:w-[70%] min-w-0">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-3">
                {examName} Previous Year Questions
              </h1>
              <p className="text-surface-500 leading-relaxed max-w-2xl">
                Practice {examName} previous year papers with explanations, year-wise grouping, and subject-wise filters.
              </p>
            </div>

            {/* Primary Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    activeTab === tab.key
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white text-surface-600 border-surface-200 hover:border-brand-300 hover:text-brand-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Year Groups */}
            <div className="space-y-6 mb-8">
              {yearGroups.map((group) => (
                <div key={group.key}>
                  <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">{group.label}</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {group.years.map((year) => (
                      <button
                        key={year}
                        onClick={() => setActiveYear(year)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          activeYear === year
                            ? 'bg-brand-500 text-white border-brand-500'
                            : 'bg-white text-surface-700 border-surface-200 hover:border-brand-300 hover:text-brand-600'
                        }`}
                      >
                        {year}
                        <ChevronRight className={`h-3.5 w-3.5 ${activeYear === year ? 'text-white' : 'text-surface-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Subject/Topic Chips */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-surface-900 mb-3">Filter by Subject</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setActiveSubject(s.name)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm transition-colors ${
                      activeSubject === s.name
                        ? 'bg-brand-50 text-brand-700 border-brand-200'
                        : 'bg-white text-surface-600 border-surface-200 hover:border-brand-200 hover:bg-brand-50/50 hover:text-brand-600'
                    }`}
                  >
                    {s.name}
                    <span className={`text-xs font-medium ${activeSubject === s.name ? 'text-brand-500' : 'text-surface-400'}`}>
                      ({s.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Cards */}
            <div className="space-y-4 mb-10">
              {sampleQuestions.map((q, idx) => (
                <Card key={q.id}>
                  <CardContent className="p-6 lg:p-8">
                    {/* Subject Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="default" size="sm">{q.subject}</Badge>
                      <span className="text-xs text-surface-400">PYQ {activeYear}</span>
                    </div>

                    {/* Question Text */}
                    <p className="text-surface-900 font-medium leading-relaxed mb-5">
                      <span className="text-brand-500 font-semibold mr-2">Q{idx + 1}.</span>
                      {q.text}
                    </p>

                    {/* Options */}
                    <div className="space-y-2 mb-5">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg border border-surface-200 hover:border-brand-200 hover:bg-brand-50/30 cursor-pointer transition-colors"
                        >
                          <span className="w-6 h-6 rounded-md bg-surface-100 flex items-center justify-center text-xs font-semibold text-surface-500 shrink-0 mt-0.5">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-sm text-surface-700">{opt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-0">
                      <Button variant="primary" size="sm">Show Answer</Button>
                      <Button variant="outline" size="sm" onClick={() => toggleExplanation(q.id)}>
                        {expandedQuestions.has(q.id) ? 'Hide Explanation' : 'View Explanation'}
                      </Button>
                      <Button variant="ghost" size="sm">Practice Similar</Button>
                    </div>

                    {/* Expandable Explanation */}
                    {expandedQuestions.has(q.id) && (
                      <div className="mt-4 p-4 rounded-lg bg-mint-50 border border-mint-200 animate-fade-in">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-mint-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-mint-800 mb-1">Answer: {q.answer}</p>
                            <p className="text-sm text-mint-700 leading-relaxed">{q.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar — 30% */}
          <aside className="w-full lg:w-[30%]">
            <div className="lg:sticky lg:top-20 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-4 w-4 fill-sunny-400 text-sunny-400" />
                    <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Trusted by 10L+ Students</span>
                  </div>
                  <h3 className="text-lg font-bold text-surface-900 mb-2">Unlock Unlimited PYQ Practice</h3>
                  <p className="text-sm text-surface-500 mb-4">
                    Get access to 25,000+ previous year questions with detailed explanations, topic-wise filters, and performance analytics.
                  </p>
                  <ul className="space-y-2.5 mb-6">
                    {[
                      'All previous year papers in one place',
                      'Step-by-step explanations for every question',
                      'Topic-wise and year-wise filtering',
                      'Track your accuracy and progress',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600">
                        <CheckCircle className="h-4 w-4 text-mint-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" size="lg">
                    Start Free Practice
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-surface-400 text-center mt-3">No credit card required</p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center bg-white">
        <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-5 w-5 text-brand-500" />
        </div>
        <p className="text-surface-400">Loading...</p>
      </div>
    }>
      <PYQuestionsContent />
    </Suspense>
  );
}
