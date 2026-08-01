'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2, CheckCircle2, Copyright, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { submitReport } from '@/lib/notesStore';

function ReportCopyrightContent() {
  const [form, setForm] = useState({
    resourceUrl: '',
    resourceTitle: '',
    yourName: '',
    yourEmail: '',
    rightsHolder: '',
    details: '',
  });
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.resourceTitle.trim() || !form.yourName.trim() || !form.yourEmail.trim()) {
      setError('Please fill in the required fields.');
      return;
    }
    if (!accepted) { setError('Please confirm that you are the rights holder or an authorised representative.'); return; }
    setError('');
    setSaving(true);
    submitReport({
      resourceId: 'copyright-takedown',
      resourceSlug: form.resourceUrl.trim() || undefined,
      resourceTitle: form.resourceTitle.trim(),
      reason: 'copyright',
      details: `Rights holder: ${form.rightsHolder || form.yourName.trim()}\n${form.details.trim()}`,
      reporterName: form.yourName.trim(),
      reporterEmail: form.yourEmail.trim(),
    });
    setTimeout(() => { setSaving(false); setDone(true); }, 600);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-mint-500" />
        <h1 className="mb-2 font-display text-2xl font-bold text-surface-900">Takedown request received</h1>
        <p className="mb-6 text-surface-500">Our legal team will review your request and respond within 3–5 working days.</p>
        <Link href="/notes"><Button variant="outline">Back to Library</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">Copyright Takedown</span>
        </nav>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-accent text-white shadow-lg shadow-accent-500/25">
            <Copyright className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">Copyright Takedown Request</h1>
            <p className="text-sm text-surface-500">If content on Testime infringes your copyright, submit this form.</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-2 rounded-xl border border-ocean-200 bg-ocean-50 p-3 text-sm text-ocean-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Provide enough detail for us to identify the content. A link or slug to the resource is very helpful.
            </div>

            <Field label="Resource title or URL *">
              <input value={form.resourceTitle} onChange={e => setForm({ ...form, resourceTitle: e.target.value })} placeholder="e.g. /notes/resource/ancient-odisha-notes" className="input-base" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your full name *">
                <input value={form.yourName} onChange={e => setForm({ ...form, yourName: e.target.value })} className="input-base" />
              </Field>
              <Field label="Your email *">
                <input type="email" value={form.yourEmail} onChange={e => setForm({ ...form, yourEmail: e.target.value })} className="input-base" />
              </Field>
            </div>
            <Field label="Rights holder / organisation">
              <input value={form.rightsHolder} onChange={e => setForm({ ...form, rightsHolder: e.target.value })} placeholder="If different from you" className="input-base" />
            </Field>
            <Field label="Detailed description of the infringement">
              <textarea value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} rows={4} placeholder="Describe the work, why it infringes, and what you'd like removed." className="input-base" />
            </Field>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-surface-200 bg-surface-50 p-4">
              <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
              <span className="text-sm text-surface-700">
                I confirm that I am the copyright owner or an authorised representative, and that the material is being used without authorisation. See our{' '}
                <Link href="/notes/copyright" className="font-medium text-brand-600 hover:underline">copyright policy</Link>.
              </span>
            </label>

            {error && <div className="rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm font-medium text-coral-700">{error}</div>}

            <Button className="w-full" variant="danger" onClick={handleSubmit} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copyright className="h-4 w-4" />}
              {saving ? 'Submitting...' : 'Submit Takedown Request'}
            </Button>
          </CardContent>
        </Card>
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

export default function ReportCopyrightPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <ReportCopyrightContent />
    </Suspense>
  );
}
