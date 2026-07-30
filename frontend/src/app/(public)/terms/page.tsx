import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <FileText className="h-5 w-5 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900">Terms of Service</h1>
        </div>
        <p className="text-surface-500 mb-8">Last updated: July 2026</p>
        <div className="prose prose-sm max-w-none text-surface-600 space-y-6">
          <p>By using Testime, you agree to these terms. Please read them carefully before accessing our platform.</p>
          <h2 className="text-lg font-bold text-surface-900">Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          <h2 className="text-lg font-bold text-surface-900">Subscription & Payments</h2>
          <p>Paid plans auto-renew unless cancelled. Refunds are processed within 7 business days as per our refund policy.</p>
          <h2 className="text-lg font-bold text-surface-900">Acceptable Use</h2>
          <p>You agree not to misuse the platform, including unauthorized access, data scraping, or disrupting other users&apos; experience.</p>
          <h2 className="text-lg font-bold text-surface-900">Changes to Terms</h2>
          <p>We may update these terms. Continued use after changes constitutes acceptance of the new terms.</p>
        </div>
      </div>
    </div>
  );
}
