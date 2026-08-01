'use client';
import Link from 'next/link';
import { ChevronRight, Copyright, ShieldCheck, FileText, Mail } from 'lucide-react';

export default function CopyrightPage() {
  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">Copyright Policy</span>
        </nav>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-accent text-white shadow-lg shadow-accent-500/25">
            <Copyright className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">Copyright Policy</h1>
            <p className="text-sm text-surface-500">Respect for intellectual property in the Testime library</p>
          </div>
        </div>

        <div className="space-y-5 text-sm leading-relaxed text-surface-600">
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card">
            <h2 className="mb-3 font-display text-lg font-bold text-surface-900">Our commitment</h2>
            <p>Testime respects the intellectual property rights of all copyright holders. Our Notes &amp; PDF Resource Library only hosts content that contributors confirm they own, that is in the public domain, or that is shared with permission.</p>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-surface-900"><ShieldCheck className="h-5 w-5 text-brand-600" /> Contributor obligations</h2>
            <p>When submitting content, contributors must confirm they have the legal right to share the material. Submitting copyrighted material without authorisation violates our policy and may result in removal of the resource and loss of contributor status.</p>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-surface-900"><FileText className="h-5 w-5 text-brand-600" /> Takedown process</h2>
            <p>If you are a copyright owner or an authorised agent and believe content on Testime infringes your rights, you can:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>File a takedown request using the <Link href="/notes/report-copyright" className="font-semibold text-brand-600 hover:underline">copyright takedown form</Link></li>
              <li>Report the specific resource using the <em>Report</em> button on its page</li>
              <li>Email us at <a href="mailto:legal@testime.example" className="font-semibold text-brand-600 hover:underline">legal@testime.example</a></li>
            </ul>
            <p className="mt-3">Takedown requests are reviewed promptly. Upon confirmation, the content is removed and the contributor is notified.</p>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-surface-900"><Mail className="h-5 w-5 text-brand-600" /> Counter-notice</h2>
            <p>If your content was removed due to a copyright claim but you believe it was a mistake, you may send a counter-notice to the same channels explaining why the material should be restored.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
