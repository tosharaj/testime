'use client';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, FileCheck2, BookMarked, AlertTriangle } from 'lucide-react';

export default function ContentPolicyPage() {
  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">Content Policy</span>
        </nav>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-brand-500/25">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">Content Policy</h1>
            <p className="text-sm text-surface-500">How content in the Notes &amp; PDF Resource Library is reviewed and moderated</p>
          </div>
        </div>

        <div className="space-y-5">
          <PolicySection icon={FileCheck2} title="1. Review before publishing">
            <p>All community-submitted resources pass through a manual review by our content team before being published. During review we verify the file, the taxonomy mapping and the source attribution.</p>
            <p>Resources that fail review are rejected with a reason, or marked as <em>needs update</em> if only minor corrections are required.</p>
          </PolicySection>

          <PolicySection icon={BookMarked} title="2. Accuracy & quality">
            <p>We aim for accurate, exam-relevant content. Resources that are factually wrong, outdated or misleading can be flagged by anyone using the <em>Report</em> button on any resource. Verified resources carry a <strong>Verified</strong> badge.</p>
          </PolicySection>

          <PolicySection icon={ShieldCheck} title="3. Copyright & ownership">
            <p>Every contributor must declare that they own the rights to the material, that it is in the public domain, or that they have permission to share it. This declaration is mandatory at submission time.</p>
            <p>If you believe a resource infringes your copyright, please file a takedown request through the <Link href="/notes/report-copyright" className="font-semibold text-brand-600 hover:underline">copyright takedown form</Link>.</p>
          </PolicySection>

          <PolicySection icon={AlertTriangle} title="4. Prohibited content">
            <ul className="list-disc space-y-2 pl-5">
              <li>Content you do not own the rights to share</li>
              <li>Spam, malware or malicious files</li>
              <li>Offensive, hateful or discriminatory material</li>
              <li>Paid/private coaching material shared without permission</li>
            </ul>
          </PolicySection>
        </div>
      </div>
    </div>
  );
}

function PolicySection({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card">
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-surface-900">
        <Icon className="h-5 w-5 text-brand-600" /> {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-surface-600">{children}</div>
    </div>
  );
}
