'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FilePlus2, ChevronRight, UploadCloud, CheckCircle2, Loader2, FileText,
  ShieldCheck, Info, Send,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getResourceTypes, submitContribution } from '@/lib/notesStore';
import type { Contribution, ResourceType } from '@/types/notes';

function ContributeContent() {
  const router = useRouter();
  const types = getResourceTypes();

  const [form, setForm] = useState({
    contributorName: '',
    contributorEmail: '',
    resourceTitle: '',
    examCategory: '',
    examName: '',
    stageOrSemester: '',
    subjectName: '',
    paperCode: '',
    unitChapter: '',
    topicName: '',
    resourceType: 'NOTES' as ResourceType,
    language: 'en' as Contribution['language'],
    description: '',
    sourceAttribution: '',
    fileName: '',
  });
  const [copyrightAccepted, setCopyrightAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.contributorName.trim() || !form.resourceTitle.trim()) {
      setError('Please fill in your name and the resource title.');
      return;
    }
    if (!copyrightAccepted) {
      setError('You must accept the copyright declaration to submit.');
      return;
    }
    setError('');
    setSaving(true);
    submitContribution({
      contributorName: form.contributorName.trim(),
      contributorEmail: form.contributorEmail.trim() || undefined,
      resourceTitle: form.resourceTitle.trim(),
      examCategory: form.examCategory.trim() || undefined,
      examName: form.examName.trim() || undefined,
      stageOrSemester: form.stageOrSemester.trim() || undefined,
      subjectName: form.subjectName.trim() || undefined,
      paperCode: form.paperCode.trim() || undefined,
      unitChapter: form.unitChapter.trim() || undefined,
      topicName: form.topicName.trim() || undefined,
      resourceType: form.resourceType,
      language: form.language,
      description: form.description.trim() || undefined,
      sourceAttribution: form.sourceAttribution.trim() || undefined,
      fileName: form.fileName.trim() || undefined,
      copyrightDeclaration: true,
    });
    setTimeout(() => {
      setSaving(false);
      router.push('/notes/contribute?success=1');
    }, 600);
  };

  const success = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('success') === '1';

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-50">
          <CheckCircle2 className="h-9 w-9 text-mint-500" />
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-surface-900">Contribution received!</h1>
        <p className="mb-6 text-surface-500">Thank you for sharing your material. Our review team will verify the content and publish it after approval. You'll be credited as the contributor.</p>
        <div className="flex justify-center gap-2">
          <Link href="/notes"><Button variant="outline">Back to Library</Button></Link>
          <Link href="/notes/contribute"><Button variant="primary-gradient"><FilePlus2 className="h-4 w-4" /> Contribute Another</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">Contribute</span>
        </nav>

        <div className="mb-8 rounded-3xl bg-gradient-brand p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-20" />
          <div className="relative">
            <Badge variant="default" className="bg-white/15 text-white">Community Contribution</Badge>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold">Share your study material</h1>
            <p className="mt-1 max-w-xl text-sm text-white/80">Upload notes, books, PYQs or any study PDF and help thousands of aspirants. Every contribution is reviewed before publishing.</p>
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-surface-900">Your details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name *">
                  <input value={form.contributorName} onChange={e => setForm({ ...form, contributorName: e.target.value })} placeholder="e.g. Priyanka Sahoo" className="input-base" />
                </Field>
                <Field label="Email (optional)">
                  <input type="email" value={form.contributorEmail} onChange={e => setForm({ ...form, contributorEmail: e.target.value })} placeholder="for contributor credit" className="input-base" />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-surface-900">Resource details</h2>
              <Field label="Resource title *">
                <input value={form.resourceTitle} onChange={e => setForm({ ...form, resourceTitle: e.target.value })} placeholder="e.g. Ancient Odisha — Complete Notes" className="input-base" />
              </Field>
              <Field label="Description">
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="What does this resource cover?" className="input-base" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Resource type">
                  <select value={form.resourceType} onChange={e => setForm({ ...form, resourceType: e.target.value as ResourceType })} className="input-base">
                    {types.map(t => <option key={t.id} value={t.slug.toUpperCase()}>{t.name}</option>)}
                  </select>
                </Field>
                <Field label="Language">
                  <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value as Contribution['language'] })} className="input-base">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="or">Odia</option>
                    <option value="bn">Bengali</option>
                    <option value="te">Telugu</option>
                    <option value="ta">Tamil</option>
                    <option value="ml">Malayalam</option>
                  </select>
                </Field>
                <Field label="File name">
                  <input value={form.fileName} onChange={e => setForm({ ...form, fileName: e.target.value })} placeholder="ancient-odisha.pdf" className="input-base" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Exam category (optional)">
                  <input value={form.examCategory} onChange={e => setForm({ ...form, examCategory: e.target.value })} placeholder="e.g. Odisha Exams" className="input-base" />
                </Field>
                <Field label="Exam name (optional)">
                  <input value={form.examName} onChange={e => setForm({ ...form, examName: e.target.value })} placeholder="e.g. OSSC CGL" className="input-base" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Stage / Semester (optional)">
                  <input value={form.stageOrSemester} onChange={e => setForm({ ...form, stageOrSemester: e.target.value })} placeholder="e.g. Prelims" className="input-base" />
                </Field>
                <Field label="Subject (optional)">
                  <input value={form.subjectName} onChange={e => setForm({ ...form, subjectName: e.target.value })} placeholder="e.g. Odisha GK" className="input-base" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Unit / Chapter (optional)">
                  <input value={form.unitChapter} onChange={e => setForm({ ...form, unitChapter: e.target.value })} placeholder="e.g. History of Odisha" className="input-base" />
                </Field>
                <Field label="Topic (optional)">
                  <input value={form.topicName} onChange={e => setForm({ ...form, topicName: e.target.value })} placeholder="e.g. Ancient Odisha" className="input-base" />
                </Field>
              </div>
              <Field label="Source attribution (optional)">
                <input value={form.sourceAttribution} onChange={e => setForm({ ...form, sourceAttribution: e.target.value })} placeholder="Where is this content from?" className="input-base" />
              </Field>

              {/* Upload placeholder */}
              <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                  <UploadCloud className="h-5 w-5 text-brand-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-surface-900">Upload your PDF (optional in demo)</p>
                  <p className="text-xs text-surface-400">PDF, DOC, PPT up to 50 MB. You can also share a link in the file name field.</p>
                </div>
                <span className="hidden text-xs font-medium text-surface-400 sm:block">Uploads are pending</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sunny-200">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-sunny-600" />
                <h2 className="font-display text-lg font-bold text-surface-900">Copyright declaration (mandatory)</h2>
              </div>
              <p className="mb-4 text-sm text-surface-500">
                By submitting, you declare that you own the rights to this material, or that it is in the public domain, or that you have obtained permission from the copyright holder to share it. Submitted content is published only after review. Read the full{' '}
                <Link href="/notes/content-policy" className="font-medium text-brand-600 hover:underline">content policy</Link> and{' '}
                <Link href="/notes/copyright" className="font-medium text-brand-600 hover:underline">copyright policy</Link>.
              </p>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-surface-200 bg-surface-50 p-4">
                <input type="checkbox" checked={copyrightAccepted} onChange={e => setCopyrightAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
                <span className="text-sm text-surface-700">
                  I confirm that I have the right to share this material, and I agree to the{' '}
                  <Link href="/notes/content-policy" className="font-medium text-brand-600 hover:underline">content policy</Link> and{' '}
                  <Link href="/notes/copyright" className="font-medium text-brand-600 hover:underline">copyright policy</Link>.
                </span>
              </label>
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm font-medium text-coral-700">
              <Info className="h-4 w-4" /> {error}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-surface-400 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Submissions are reviewed before being published.
            </p>
            <Button type="submit" size="lg" variant="primary-gradient" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {saving ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </form>
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

export default function ContributePage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <ContributeContent />
    </Suspense>
  );
}
