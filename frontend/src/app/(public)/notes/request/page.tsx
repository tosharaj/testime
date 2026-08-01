'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HelpCircle, ChevronRight, ThumbsUp, Loader2, CheckCircle2, TrendingUp, Info,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getRequests, submitRequest, voteRequest } from '@/lib/notesStore';
import { formatDate } from '@/lib/utils';

function RequestContent() {
  const router = useRouter();
  const [requests, setRequests] = useState(() => getRequests());
  const [form, setForm] = useState({
    title: '',
    description: '',
    examCategory: '',
    examName: '',
    subjectName: '',
    topicName: '',
    resourceType: 'PDF' as string,
    language: 'en',
    requesterName: '',
    requesterEmail: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.title.trim()) { setError('Please describe the resource you need.'); return; }
    setError('');
    setSaving(true);
    submitRequest({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      examCategory: form.examCategory.trim() || undefined,
      examName: form.examName.trim() || undefined,
      subjectName: form.subjectName.trim() || undefined,
      topicName: form.topicName.trim() || undefined,
      resourceType: form.resourceType as any,
      language: form.language as any,
      requesterName: form.requesterName.trim() || undefined,
      requesterEmail: form.requesterEmail.trim() || undefined,
    });
    setTimeout(() => { setSaving(false); setRequests(getRequests()); router.refresh(); }, 500);
  };

  const handleVote = (id: string) => {
    voteRequest(id);
    setRequests(getRequests());
  };

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">Request a Resource</span>
        </nav>

        <div className="mb-8 rounded-3xl bg-gradient-accent p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-20" />
          <div className="relative">
            <Badge variant="default" className="bg-white/15 text-white">Community Requests</Badge>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold">Request a resource</h1>
            <p className="mt-1 max-w-xl text-sm text-white/80">Can't find a PDF, notes or question paper? Tell us what you need and upvote requests made by others.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-surface-900">Submit a request</h2>
                <Field label="What do you need? *">
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. OSSC CGL Odia Model Papers" className="input-base" />
                </Field>
                <Field label="Details">
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the resource and its syllabus coverage..." className="input-base" />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Exam category">
                    <input value={form.examCategory} onChange={e => setForm({ ...form, examCategory: e.target.value })} placeholder="Odisha Exams / SSC" className="input-base" />
                  </Field>
                  <Field label="Exam">
                    <input value={form.examName} onChange={e => setForm({ ...form, examName: e.target.value })} placeholder="OSSC CGL" className="input-base" />
                  </Field>
                  <Field label="Subject">
                    <input value={form.subjectName} onChange={e => setForm({ ...form, subjectName: e.target.value })} placeholder="Odia" className="input-base" />
                  </Field>
                  <Field label="Topic">
                    <input value={form.topicName} onChange={e => setForm({ ...form, topicName: e.target.value })} placeholder="Grammar" className="input-base" />
                  </Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Type">
                    <select value={form.resourceType} onChange={e => setForm({ ...form, resourceType: e.target.value })} className="input-base">
                      {['NOTES', 'BOOK', 'PYQ', 'SOLVED_PAPER', 'SYLLABUS', 'IMPORTANT_QUESTIONS', 'PDF', 'OTHER'].map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                    </select>
                  </Field>
                  <Field label="Language">
                    <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className="input-base">
                      {['en', 'hi', 'or', 'bn', 'te', 'ta', 'ml'].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Your name">
                    <input value={form.requesterName} onChange={e => setForm({ ...form, requesterName: e.target.value })} className="input-base" />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={form.requesterEmail} onChange={e => setForm({ ...form, requesterEmail: e.target.value })} className="input-base" />
                  </Field>
                </div>
                {error && <div className="flex items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm font-medium text-coral-700"><Info className="h-4 w-4" /> {error}</div>}
                <Button className="w-full" variant="accent" onClick={handleSubmit} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <HelpCircle className="h-4 w-4" />}
                  {saving ? 'Submitting...' : 'Submit Request'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Requests list */}
          <div className="lg:col-span-3">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-surface-900">
              <TrendingUp className="h-5 w-5 text-brand-600" /> Popular requests
            </h2>
            <div className="space-y-3">
              {requests.sort((a, b) => b.votes - a.votes).map(req => (
                <div key={req.id} className="rounded-2xl border border-surface-200 bg-white p-4 shadow-card transition-all hover:shadow-card-hover">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleVote(req.id)}
                      className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-surface-200 bg-surface-50 transition-all hover:border-brand-300 hover:bg-brand-50"
                      title="Upvote"
                    >
                      <ThumbsUp className="h-4 w-4 text-brand-600" />
                      <span className="text-xs font-bold text-surface-700">{req.votes}</span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-sm font-bold text-surface-900">{req.title}</h3>
                        <Badge variant={req.status === 'fulfilled' ? 'success' : req.status === 'in_progress' ? 'warning' : 'info'} size="sm">
                          {req.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      {req.description && <p className="mb-2 text-sm text-surface-500 line-clamp-2">{req.description}</p>}
                      <div className="flex flex-wrap gap-1.5 text-[11px] font-medium">
                        {req.examCategory && <span className="rounded-lg bg-brand-50 px-2 py-0.5 text-brand-700">{req.examCategory}</span>}
                        {req.examName && <span className="rounded-lg bg-surface-100 px-2 py-0.5 text-surface-600">{req.examName}</span>}
                        {req.subjectName && <span className="rounded-lg bg-accent-50 px-2 py-0.5 text-accent-700">{req.subjectName}</span>}
                        {req.resourceType && <span className="rounded-lg bg-surface-100 px-2 py-0.5 text-surface-500">{req.resourceType.replace(/_/g, ' ')}</span>}
                      </div>
                      <p className="mt-2 text-[11px] text-surface-400">Requested {formatDate(req.createdAt)}{req.requesterName ? ` by ${req.requesterName}` : ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-surface-500">{label}</label>
      {children}
    </div>
  );
}

export default function RequestPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <RequestContent />
    </Suspense>
  );
}
