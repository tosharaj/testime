import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Shield className="h-5 w-5 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900">Privacy Policy</h1>
        </div>
        <p className="text-surface-500 mb-8">Last updated: July 2026</p>
        <div className="prose prose-sm max-w-none text-surface-600 space-y-6">
          <p>Testime respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information.</p>
          <h2 className="text-lg font-bold text-surface-900">Information We Collect</h2>
          <p>We collect information you provide directly: name, email, phone number, and exam preferences. We also collect usage data such as test attempts, scores, and browsing behavior.</p>
          <h2 className="text-lg font-bold text-surface-900">How We Use Your Data</h2>
          <p>Your data is used to personalize your learning experience, improve our platform, send relevant notifications, and provide customer support.</p>
          <h2 className="text-lg font-bold text-surface-900">Data Security</h2>
          <p>We implement industry-standard encryption and security measures. Your data is stored securely and never shared with third parties without your consent.</p>
          <h2 className="text-lg font-bold text-surface-900">Contact</h2>
          <p>For privacy-related queries, reach out to us at privacy@testime.com.</p>
        </div>
      </div>
    </div>
  );
}
