'use client';
import { useState } from 'react';
import { Settings, Save, RotateCcw, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getLibrary, resetLibrary } from '@/lib/notesStore';

export default function AdminSettingsPage() {
  const data = getLibrary();
  const [form, setForm] = useState({
    requireReview: true,
    printDefaultOff: true,
    autoPublishContributions: false,
    verifyRequired: false,
    defaultVisibility: 'public',
    defaultAccess: 'free',
    maxUploadMb: 50,
    libraryName: 'Notes & PDF Resource Library',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 400);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-surface-900">
            <Settings className="h-4 w-4 text-brand-600" /> General
          </h2>
          <SettingInput label="Library display name">
            <input value={form.libraryName} onChange={e => setForm({ ...form, libraryName: e.target.value })} className="input-base" />
          </SettingInput>
          <div className="grid grid-cols-2 gap-3">
            <SettingInput label="Default visibility">
              <select value={form.defaultVisibility} onChange={e => setForm({ ...form, defaultVisibility: e.target.value })} className="input-base">
                <option value="public">Public</option>
                <option value="signed_in">Signed in</option>
                <option value="restricted">Restricted</option>
                <option value="premium_ready">Premium ready</option>
              </select>
            </SettingInput>
            <SettingInput label="Default access">
              <select value={form.defaultAccess} onChange={e => setForm({ ...form, defaultAccess: e.target.value })} className="input-base">
                <option value="free">Free</option>
                <option value="restricted">Restricted</option>
                <option value="premium">Premium</option>
              </select>
            </SettingInput>
          </div>
          <SettingInput label={`Max upload size (MB) — currently ${form.maxUploadMb} MB`}>
            <input type="number" value={form.maxUploadMb} onChange={e => setForm({ ...form, maxUploadMb: Number(e.target.value) })} className="input-base" />
          </SettingInput>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-surface-900">
            <CheckCircle2 className="h-4 w-4 text-brand-600" /> Workflow
          </h2>
          <Toggle label="Require review before publishing contributions" desc="Contributions go through moderation before going live" checked={form.requireReview} onChange={v => setForm({ ...form, requireReview: v })} />
          <Toggle label="Print (pdf2kagaz) disabled by default" desc="New resources require manual enable for printing" checked={form.printDefaultOff} onChange={v => setForm({ ...form, printDefaultOff: v })} />
          <Toggle label="Auto-publish verified contributions" desc="Automatically publish contributions from verified contributors" checked={form.autoPublishContributions} onChange={v => setForm({ ...form, autoPublishContributions: v })} />
          <Toggle label="Require verification badge for premium access" desc="Only verified resources can be marked premium" checked={form.verifyRequired} onChange={v => setForm({ ...form, verifyRequired: v })} />
        </CardContent>
      </Card>

      {saved && <div className="rounded-xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm font-medium text-mint-700">Settings saved successfully!</div>}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </Button>
        </div>
        <Button variant="danger" onClick={() => setConfirmReset(true)}>
          <RotateCcw className="h-4 w-4" /> Reset Library
        </Button>
      </div>

      {confirmReset && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setConfirmReset(false)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-surface-900 mb-2">Reset the library?</h3>
            <p className="text-sm text-surface-500 mb-5 flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" />
              This restores the seed demo data and removes all your changes (resources, contributions, requests, homepage config). This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConfirmReset(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => { resetLibrary(); window.location.reload(); }}>Yes, reset</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-surface-800">{label}</p>
        <p className="text-xs text-surface-400">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-surface-300'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function SettingInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-surface-500">{label}</label>
      {children}
    </div>
  );
}
