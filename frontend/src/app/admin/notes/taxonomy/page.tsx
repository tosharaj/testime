'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Save, X, Network, GraduationCap, School, BookOpen, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  getLibrary, saveExamCategory, saveExam, saveStage, saveSubject, saveUnit, saveTopic,
  saveInstitution, saveCourse, saveMajor, saveSemester, slugify,
} from '@/lib/notesStore';
import type { ExamCategory, Exam, ExamStage, Subject, SubjectUnit, Topic, Institution, Course, Major, Semester } from '@/types/notes';

type Entity = 'categories' | 'exams' | 'stages' | 'subjects' | 'units' | 'topics' | 'institutions' | 'courses' | 'majors' | 'semesters';

const entityMeta: Record<Entity, { label: string; parent?: Entity; icon: React.ComponentType<{ className?: string }> }> = {
  categories: { label: 'Exam Categories', icon: Network },
  exams: { label: 'Exams', parent: 'categories', icon: GraduationCap },
  stages: { label: 'Exam Stages', parent: 'exams', icon: BookOpen },
  subjects: { label: 'Subjects', icon: BookOpen },
  units: { label: 'Units', parent: 'subjects', icon: FolderOpen },
  topics: { label: 'Topics', parent: 'units', icon: FolderOpen },
  institutions: { label: 'Institutions', icon: School },
  courses: { label: 'Courses', parent: 'institutions', icon: GraduationCap },
  majors: { label: 'Majors', parent: 'courses', icon: GraduationCap },
  semesters: { label: 'Semesters', parent: 'majors', icon: School },
};

export default function AdminTaxonomyPage() {
  const data = getLibrary();
  const [group, setGroup] = useState<'exam' | 'academic' | 'subject'>('exam');
  const [entity, setEntity] = useState<Entity>('categories');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [newName, setNewName] = useState('');
  const [parentId, setParentId] = useState('');
  const [adding, setAdding] = useState(false);

  const examFlow: Entity[] = ['categories', 'exams', 'stages'];
  const subjectFlow: Entity[] = ['subjects', 'units', 'topics'];
  const academicFlow: Entity[] = ['institutions', 'courses', 'majors', 'semesters'];

  const flow = group === 'exam' ? examFlow : group === 'academic' ? academicFlow : subjectFlow;
  const meta = entityMeta[entity];

  const entities: { id: string; name: string; parentLabel?: string }[] = (() => {
    switch (entity) {
      case 'categories': return data.examCategories.map(c => ({ id: c.id, name: c.name }));
      case 'exams': return data.exams.map(e => ({ id: e.id, name: e.name, parentLabel: data.examCategories.find(c => c.id === e.categoryId)?.name }));
      case 'stages': return data.examStages.map(s => ({ id: s.id, name: s.name, parentLabel: data.exams.find(e => e.id === s.examId)?.shortName || data.exams.find(e => e.id === s.examId)?.name }));
      case 'subjects': return data.subjects.map(s => ({ id: s.id, name: s.name }));
      case 'units': return data.units.map(u => ({ id: u.id, name: u.name, parentLabel: data.subjects.find(s => s.id === u.subjectId)?.name }));
      case 'topics': return data.topics.map(t => ({ id: t.id, name: t.name, parentLabel: data.units.find(u => u.id === t.unitId)?.name || data.subjects.find(s => s.id === t.subjectId)?.name }));
      case 'institutions': return data.institutions.map(i => ({ id: i.id, name: i.name }));
      case 'courses': return data.courses.map(c => ({ id: c.id, name: c.name, parentLabel: data.institutions.find(i => i.id === c.institutionId)?.name }));
      case 'majors': return data.majors.map(m => ({ id: m.id, name: m.name, parentLabel: data.courses.find(c => c.id === m.courseId)?.name }));
      case 'semesters': return data.semesters.map(s => ({ id: s.id, name: s.name, parentLabel: data.majors.find(m => m.id === s.majorId)?.name }));
    }
  })();

  const parentOptions = meta.parent ? getParents(meta.parent) : [];

  function getParents(parent: Entity): { id: string; name: string }[] {
    switch (parent) {
      case 'categories': return data.examCategories.map(c => ({ id: c.id, name: c.name }));
      case 'exams': return data.exams.map(e => ({ id: e.id, name: e.name }));
      case 'subjects': return data.subjects.map(s => ({ id: s.id, name: s.name }));
      case 'units': return data.units.map(u => ({ id: u.id, name: u.name }));
      case 'institutions': return data.institutions.map(i => ({ id: i.id, name: i.name }));
      case 'courses': return data.courses.map(c => ({ id: c.id, name: c.name }));
      case 'majors': return data.majors.map(m => ({ id: m.id, name: m.name }));
      default: return [];
    }
  }

  const filtered = entities.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()));

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setNewName('');
    setParentId(getParents(meta.parent as Entity)[0]?.id || '');
  };

  const handleSave = () => {
    if (!newName.trim()) return;
    const name = newName.trim();
    const slug = slugify(name);
    const pid = parentId || parentOptions[0]?.id || '';
    switch (entity) {
      case 'categories': {
        const item: ExamCategory = editing
          ? { ...data.examCategories.find(c => c.id === editing.id)!, name }
          : { id: `cat-${Date.now()}`, name, slug, sortOrder: data.examCategories.length + 1, isActive: true };
        saveExamCategory({ ...item, slug: item.slug || slug });
        break;
      }
      case 'exams': {
        const item: Exam = editing
          ? { ...data.exams.find(e => e.id === editing.id)!, name }
          : { id: `ex-${Date.now()}`, categoryId: pid, name, slug, isActive: true, sortOrder: 1 };
        saveExam({ ...item, categoryId: pid || item.categoryId });
        break;
      }
      case 'stages': {
        const item: ExamStage = editing
          ? { ...data.examStages.find(s => s.id === editing.id)!, name }
          : { id: `st-${Date.now()}`, examId: pid, name, slug, order: 1 };
        saveStage({ ...item, examId: pid || item.examId });
        break;
      }
      case 'subjects': {
        const item: Subject = editing
          ? { ...data.subjects.find(s => s.id === editing.id)!, name }
          : { id: `sub-${Date.now()}`, name, slug, isActive: true };
        saveSubject({ ...item, slug: item.slug || slug });
        break;
      }
      case 'units': {
        const item: SubjectUnit = editing
          ? { ...data.units.find(u => u.id === editing.id)!, name }
          : { id: `u-${Date.now()}`, subjectId: pid, name, slug, order: 1 };
        saveUnit({ ...item, subjectId: pid || item.subjectId });
        break;
      }
      case 'topics': {
        const item: Topic = editing
          ? { ...data.topics.find(t => t.id === editing.id)!, name }
          : { id: `tp-${Date.now()}`, subjectId: pid, name, slug, order: 1 };
        saveTopic({ ...item, subjectId: pid || item.subjectId });
        break;
      }
      case 'institutions': {
        const item: Institution = editing
          ? { ...data.institutions.find(i => i.id === editing.id)!, name }
          : { id: `inst-${Date.now()}`, name, slug, isActive: true, sortOrder: 1 };
        saveInstitution({ ...item, slug: item.slug || slug });
        break;
      }
      case 'courses': {
        const item: Course = editing
          ? { ...data.courses.find(c => c.id === editing.id)!, name }
          : { id: `cr-${Date.now()}`, institutionId: pid, name, slug, isActive: true, sortOrder: 1 };
        saveCourse({ ...item, institutionId: pid || item.institutionId });
        break;
      }
      case 'majors': {
        const item: Major = editing
          ? { ...data.majors.find(m => m.id === editing.id)!, name }
          : { id: `mj-${Date.now()}`, courseId: pid, name, slug, isActive: true, sortOrder: 1 };
        saveMajor({ ...item, courseId: pid || item.courseId });
        break;
      }
      case 'semesters': {
        const item: Semester = editing
          ? { ...data.semesters.find(s => s.id === editing.id)!, name }
          : { id: `sm-${Date.now()}`, majorId: pid, name, slug, order: 1, isActive: true };
        saveSemester({ ...item, majorId: pid || item.majorId });
        break;
      }
    }
    setAdding(false);
    setEditing(null);
    window.location.reload();
  };

  const flowNav = (group: 'exam' | 'academic' | 'subject') => {
    const flows = { exam: examFlow, academic: academicFlow, subject: subjectFlow }[group];
    return (
      <div className="flex flex-wrap gap-1.5">
        {flows.map(e => {
          const m = entityMeta[e];
          const active = entity === e;
          return (
            <button
              key={e}
              onClick={() => { setEntity(e); setAdding(false); setEditing(null); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${active ? 'bg-brand-600 text-white shadow-sm' : 'bg-surface-100 text-surface-500 hover:bg-surface-200'}`}
            >
              <m.icon className="h-3.5 w-3.5" /> {m.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Group tabs */}
      <div className="flex gap-2">
        {(['exam', 'academic', 'subject'] as const).map(g => (
          <button
            key={g}
            onClick={() => { setGroup(g); setEntity(g === 'exam' ? 'categories' : g === 'academic' ? 'institutions' : 'subjects'); setAdding(false); setEditing(null); }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${group === g ? 'bg-surface-900 text-white shadow-sm' : 'bg-white border border-surface-200 text-surface-500 hover:border-brand-300'}`}
          >
            {g === 'exam' ? 'Exam' : g === 'academic' ? 'Academic' : 'Subjects'}
          </button>
        ))}
      </div>

      {/* Flow nav */}
      {flowNav(group)}

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-3 border-b border-surface-200 px-5 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${meta.label.toLowerCase()}...`}
                className="w-64 rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <span className="text-sm text-surface-400">{filtered.length} items</span>
            <Button size="sm" className="ml-auto" onClick={startAdd}>
              <Plus className="h-4 w-4" /> Add {meta.label.replace(/s$/, '')}
            </Button>
          </div>

          {(adding || editing) && (
            <div className="border-b border-surface-200 bg-brand-50/40 px-5 py-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[220px] flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-surface-500">Name *</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} autoFocus placeholder={`${meta.label.replace(/s$/, '')} name`} className="input-base bg-white" />
                </div>
                {meta.parent && (
                  <div className="min-w-[200px]">
                    <label className="mb-1.5 block text-xs font-medium text-surface-500">{entityMeta[meta.parent].label.replace(/s$/, '')} *</label>
                    <select value={parentId} onChange={e => setParentId(e.target.value)} className="input-base bg-white">
                      {parentOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                  </div>
                )}
                <div className="flex gap-2 pb-0.5">
                  <Button size="sm" onClick={handleSave}><Save className="h-4 w-4" /> Save</Button>
                  <Button size="sm" variant="outline" onClick={() => { setAdding(false); setEditing(null); }}><X className="h-4 w-4" /> Cancel</Button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th>
                  {meta.parent && <th className="px-5 py-3">{entityMeta[meta.parent].label.replace(/s$/, '')}</th>}
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-surface-900">{e.name}</td>
                    {meta.parent && <td className="px-5 py-3"><Badge variant="default" size="sm">{e.parentLabel || '—'}</Badge></td>}
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => { setEditing({ id: e.id, name: e.name }); setNewName(e.name); setParentId(''); setAdding(false); }}
                        className="p-1.5 text-surface-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={meta.parent ? 3 : 2} className="px-5 py-12 text-center text-surface-400">No {meta.label.toLowerCase()} found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
