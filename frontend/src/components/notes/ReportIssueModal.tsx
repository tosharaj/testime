'use client';
import { useState } from 'react';
import { Flag, Loader2, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Resource, ReportReason } from '@/types/notes';
import { submitReport } from '@/lib/notesStore';

const reasons: { value: ReportReason; label: string }[] = [
  { value: 'copyright', label: 'Copyright / plagiarism issue' },
  { value: 'inaccurate', label: 'Inaccurate or wrong content' },
  { value: 'outdated', label: 'Outdated information' },
  { value: 'broken_file', label: 'Broken file / cannot open' },
  { value: 'offensive', label: 'Offensive content' },
  { value: 'spam', label: 'Spam or misleading' },
  { value: 'other', label: 'Other' },
];

interface ReportIssueModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportIssueModal({ resource, isOpen, onClose }: ReportIssueModalProps) {
  const [reason, setReason] = useState<ReportReason>('inaccurate');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    setSaving(true);
    submitReport({
      resourceId: resource.id,
      resourceSlug: resource.slug,
      resourceTitle: resource.title,
      reason,
      details: details.trim() || undefined,
      reporterName: reporterName.trim() || undefined,
      reporterEmail: reporterEmail.trim() || undefined,
    });
    setTimeout(() => {
      setSaving(false);
      setDone(true);
      setTimeout(() => { setDone(false); onClose(); }, 1600);
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report a problem" size="md">
      {done ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-mint-500" />
          <p className="font-semibold text-surface-900">Report submitted</p>
          <p className="mt-1 text-sm text-surface-500">Our team will review this resource shortly. Thank you!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-surface-50 p-3 text-sm text-surface-600">
            <span className="font-medium text-surface-900">Reporting:</span> {resource.title}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-500">Reason *</label>
            <div className="grid grid-cols-1 gap-2">
              {reasons.map(r => (
                <label key={r.value} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors ${reason === r.value ? 'border-brand-400 bg-brand-50 text-brand-800' : 'border-surface-200 text-surface-600 hover:border-surface-300'}`}>
                  <input type="radio" name="reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} className="h-4 w-4 text-brand-500 focus:ring-brand-500" />
                  {r.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-500">Details (optional)</label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              rows={3}
              placeholder="Tell us what's wrong with this resource..."
              className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-500">Your name (optional)</label>
              <input
                value={reporterName}
                onChange={e => setReporterName(e.target.value)}
                className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-500">Email (optional)</label>
              <input
                type="email"
                value={reporterEmail}
                onChange={e => setReporterEmail(e.target.value)}
                className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              />
            </div>
          </div>
          <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-xs text-surface-500">
            Reporting a <span className="font-medium">copyright violation</span>? Use the dedicated{' '}
            <a href="/notes/report-copyright" className="font-semibold text-brand-600 hover:underline">copyright takedown form</a> instead.
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={handleSubmit} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
              Submit Report
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
