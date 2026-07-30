'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { BookCheck, Plus, Edit2, Trash2, Search, GraduationCap, BookOpen, Link2, BarChart3, BrainCircuit, ListChecks, ExternalLink, X, CheckCircle, AlertCircle, Unlink } from 'lucide-react';

const classes = [6, 7, 8, 9, 10, 11, 12];

const mockNcertData: Record<number, {
  subjects: { name: string; books: { name: string; chapters: { id: string; name: string; summary: string; linkedMcqs: any[]; linkedTests: number; linkedPyqs: number; linkedNotes: boolean }[] }[] }[]
}> = {
  6: { subjects: [{ name: 'History', books: [{ name: 'Our Pasts I', chapters: [{ id: 'nc6-h-1', name: 'What, Where, How and When?', summary: 'Introduction to history - sources and methods.', linkedMcqs: [], linkedTests: 0, linkedPyqs: 0, linkedNotes: false }] }] }] },
  11: { subjects: [{ name: 'Polity', books: [{ name: 'Indian Constitution at Work', chapters: [
    { id: 'nc11-p-1', name: 'Constitution: Why and How?', summary: 'Need for a constitution, framing of the Indian Constitution.', linkedMcqs: [], linkedTests: 0, linkedPyqs: 0, linkedNotes: false },
    { id: 'nc11-p-2', name: 'Fundamental Rights', summary: 'Fundamental Rights - Articles 12 to 35.', linkedMcqs: [], linkedTests: 0, linkedPyqs: 0, linkedNotes: false },
    { id: 'nc11-p-3', name: 'Directive Principles of State Policy', summary: 'DPSP - Articles 36 to 51.', linkedMcqs: [], linkedTests: 0, linkedPyqs: 0, linkedNotes: false },
  ] }] }] },
};

const mockQuestions = [
  { id: 'q1', text: 'Who is known as the Father of the Indian Constitution?', category: 'Polity', exam: 'SSC', difficulty: 'easy' },
  { id: 'q2', text: 'The Indian Constitution was adopted on which date?', category: 'Polity', exam: 'SSC', difficulty: 'easy' },
  { id: 'q3', text: 'Which of the following is NOT a Fundamental Right?', category: 'Polity', exam: 'SSC', difficulty: 'medium' },
  { id: 'q4', text: 'How many schedules does the Indian Constitution have?', category: 'Polity', exam: 'UPSC', difficulty: 'medium' },
  { id: 'q5', text: 'Article 32 of the Indian Constitution deals with?', category: 'Polity', exam: 'SSC', difficulty: 'hard' },
  { id: 'q6', text: 'The concept of Judicial Review is borrowed from which country?', category: 'Polity', exam: 'UPSC', difficulty: 'hard' },
];

export default function AdminNcertPage() {
  const [activeClass, setActiveClass] = useState<number>(11);
  const [activeSubject, setActiveSubject] = useState<string>('Polity');
  const [activeBook, setActiveBook] = useState<string>('');
  const [linkModal, setLinkModal] = useState<{ chapterId: string; chapterName: string; linkedIds: string[] } | null>(null);
  const [linkSearch, setLinkSearch] = useState('');

  const classData = mockNcertData[activeClass];
  const subjectData = classData?.subjects.find(s => s.name === activeSubject);
  const bookData = subjectData?.books[0];

  const chapters = bookData?.chapters || [];

  const openLinkModal = (ch: typeof chapters[0]) => {
    const stored = localStorage.getItem(`ncert_chapter_links_${ch.id}`);
    const linkedIds: string[] = stored ? JSON.parse(stored) : [];
    setLinkModal({ chapterId: ch.id, chapterName: ch.name, linkedIds });
    setLinkSearch('');
  };

  const toggleLink = (qId: string) => {
    if (!linkModal) return;
    const updated = linkModal.linkedIds.includes(qId)
      ? linkModal.linkedIds.filter(id => id !== qId)
      : [...linkModal.linkedIds, qId];
    const newModal = { ...linkModal, linkedIds: updated };
    setLinkModal(newModal);
    localStorage.setItem(`ncert_chapter_links_${linkModal.chapterId}`, JSON.stringify(updated));
  };

  const searchableQuestions = mockQuestions.filter(q =>
    !linkSearch || q.text.toLowerCase().includes(linkSearch.toLowerCase()) || q.category.toLowerCase().includes(linkSearch.toLowerCase())
  );

  const getLinkedCount = (chId: string) => {
    const stored = localStorage.getItem(`ncert_chapter_links_${chId}`);
    return stored ? JSON.parse(stored).length : 0;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">NCERT Management</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage NCERT books, chapters, and link questions/tests/notes to each chapter</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> Add NCERT Book</Button>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {classes.map(c => (
          <button key={c} onClick={() => setActiveClass(c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeClass === c ? 'bg-brand-500 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>
            Class {c}
          </button>
        ))}
      </div>

      {classData && (
        <div className="flex items-center gap-2 mb-6">
          {classData.subjects.map(s => (
            <button key={s.name} onClick={() => setActiveSubject(s.name)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeSubject === s.name ? 'bg-ocean-500 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>
              {s.name}
            </button>
          ))}
        </div>
      )}

      {bookData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-500" />
                {bookData.name}
                <Badge variant="info" size="sm">Class {activeClass}</Badge>
              </CardTitle>
              <Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5 mr-1" /> Add Chapter</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Chapter</th>
                    <th className="px-5 py-3 max-w-[250px]">Summary</th>
                    <th className="px-5 py-3 text-center">Linked MCQs</th>
                    <th className="px-5 py-3 text-center">Tests</th>
                    <th className="px-5 py-3 text-center">PYQs</th>
                    <th className="px-5 py-3 text-center">Notes</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map(ch => {
                    const linkedCount = getLinkedCount(ch.id);
                    return (
                      <tr key={ch.id} className="border-b border-surface-100 hover:bg-surface-50/50">
                        <td className="px-5 py-4 font-medium text-surface-900">{ch.name}</td>
                        <td className="px-5 py-4 text-xs text-surface-500 truncate max-w-[250px]">{ch.summary}</td>
                        <td className="px-5 py-4 text-center">
                          <button onClick={() => openLinkModal(ch)} className="inline-flex items-center gap-1">
                            <Badge variant={linkedCount > 0 ? 'success' : 'default'} size="sm">
                              <BrainCircuit className="h-3 w-3 mr-0.5" />{linkedCount}
                            </Badge>
                          </button>
                        </td>
                        <td className="px-5 py-4 text-center"><Badge variant={ch.linkedTests > 0 ? 'info' : 'default'} size="sm">{ch.linkedTests}</Badge></td>
                        <td className="px-5 py-4 text-center"><Badge variant={ch.linkedPyqs > 0 ? 'warning' : 'default'} size="sm">{ch.linkedPyqs}</Badge></td>
                        <td className="px-5 py-4 text-center">{ch.linkedNotes ? <Badge variant="success" size="sm">Linked</Badge> : <span className="text-xs text-surface-400">-</span>}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openLinkModal(ch)} className="p-1.5 text-surface-400 hover:text-brand-600 rounded-lg hover:bg-brand-50" title="Link Questions">
                              <Link2 className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 text-surface-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"><Edit2 className="h-4 w-4" /></button>
                            <button className="p-1.5 text-surface-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {chapters.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-10 w-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 font-medium">No chapters yet</p>
                <p className="text-xs text-surface-400 mt-1">Add chapters to start linking content.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!classData && (
        <div className="text-center py-20">
          <GraduationCap className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 font-medium">No NCERT data for Class {activeClass}</p>
        </div>
      )}

      {/* Link Questions Modal */}
      {linkModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={() => setLinkModal(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-surface-200">
              <div>
                <h3 className="text-lg font-bold text-surface-900">Link Questions</h3>
                <p className="text-sm text-surface-500 mt-0.5">{linkModal.chapterName}</p>
              </div>
              <button onClick={() => setLinkModal(null)} className="p-1.5 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 border-b border-surface-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
                <input value={linkSearch} onChange={e => setLinkSearch(e.target.value)} placeholder="Search questions by text or category..." className="w-full rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <p className="text-xs text-surface-400 mb-2">{linkModal.linkedIds.length} linked · {searchableQuestions.length} available</p>
              {searchableQuestions.map(q => {
                const isLinked = linkModal.linkedIds.includes(q.id);
                return (
                  <div key={q.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${isLinked ? 'border-brand-200 bg-brand-50/50' : 'border-surface-200 hover:border-surface-300'}`} onClick={() => toggleLink(q.id)}>
                    <div className="mt-0.5">
                      {isLinked ? <CheckCircle className="h-5 w-5 text-brand-500" /> : <div className="h-5 w-5 rounded-full border-2 border-surface-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900">{q.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default" size="sm">{q.category}</Badge>
                        <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'} size="sm">{q.difficulty}</Badge>
                        <span className="text-xs text-surface-400">{q.exam}</span>
                      </div>
                    </div>
                    {isLinked && (
                      <button onClick={(e) => { e.stopPropagation(); toggleLink(q.id); }} className="p-1 text-surface-400 hover:text-red-500">
                        <Unlink className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
              {searchableQuestions.length === 0 && (
                <div className="text-center py-8 text-surface-400 text-sm">No questions match your search.</div>
              )}
            </div>

            <div className="p-4 border-t border-surface-200 flex items-center justify-between">
              <span className="text-sm text-surface-500">{linkModal.linkedIds.length} question(s) linked to this chapter</span>
              <Button onClick={() => setLinkModal(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
