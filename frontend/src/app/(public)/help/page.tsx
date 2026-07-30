'use client';
import { useState } from 'react';
import { HelpCircle, Search, ChevronDown, Mail, MessageCircle, FileText } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  { q: 'How do I start a mock test?', a: 'Go to Test Series, select your exam, choose a test, and click "Start Test". Make sure you are logged in.' },
  { q: 'How are my results calculated?', a: 'Your score is based on correct answers minus negative marking (if applicable). Accuracy = (correct / total attempted) × 100.' },
  { q: 'Can I retake a test?', a: 'Yes, most free tests allow unlimited attempts. Premium tests can be retaken based on your plan.' },
  { q: 'How do I subscribe to a plan?', a: 'Visit the Pricing page, choose a plan, and complete payment. Your plan will be activated immediately.' },
  { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.' },
  { q: 'Can I access notes offline?', a: 'Currently notes are available online only. You can bookmark them for quick access later.' },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-7 w-7 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900 mb-3">Help Center</h1>
          <p className="text-surface-500">Find answers to common questions below.</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..." className="w-full rounded-xl border border-surface-300 pl-10 pr-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
        </div>

        <div className="space-y-2 mb-10">
          {filtered.map((faq, i) => (
            <div key={i} className="border border-surface-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-50 transition-colors">
                <span className="text-sm font-medium text-surface-900">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-surface-400 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && <div className="px-4 pb-4 text-sm text-surface-600 leading-relaxed">{faq.a}</div>}
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/contact" className="p-5 rounded-xl border border-surface-200 hover:border-brand-200 hover:shadow-sm transition-all">
            <Mail className="h-5 w-5 text-brand-600 mb-2" />
            <h3 className="font-semibold text-surface-900 mb-1">Email Us</h3>
            <p className="text-xs text-surface-500">Get a response within 24 hours</p>
          </Link>
          <div className="p-5 rounded-xl border border-surface-200">
            <MessageCircle className="h-5 w-5 text-brand-600 mb-2" />
            <h3 className="font-semibold text-surface-900 mb-1">Live Chat</h3>
            <p className="text-xs text-surface-500">Available Mon-Fri, 9 AM - 6 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
