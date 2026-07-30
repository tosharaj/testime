'use client';
import { useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-16 lg:py-24">
        <div className="mx-auto max-w-lg px-4 sm:px-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Message Sent!</h1>
          <p className="text-surface-500">We&apos;ll get back to you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-3">Contact Us</h1>
          <p className="text-surface-500">Have a question or feedback? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
              <input required className="w-full rounded-xl border border-surface-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
              <input type="email" required className="w-full rounded-xl border border-surface-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Message</label>
              <textarea required rows={4} className="w-full rounded-xl border border-surface-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" placeholder="How can we help?" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-brand-500 text-white py-2.5 text-sm font-semibold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2">
              <Send className="h-4 w-4" /> Send Message
            </button>
          </form>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-surface-200">
              <Mail className="h-5 w-5 text-brand-600 mb-2" />
              <h3 className="font-semibold text-surface-900 mb-1">Email</h3>
              <p className="text-sm text-surface-500">hello@testime.com</p>
            </div>
            <div className="p-5 rounded-xl border border-surface-200">
              <MessageCircle className="h-5 w-5 text-brand-600 mb-2" />
              <h3 className="font-semibold text-surface-900 mb-1">Live Chat</h3>
              <p className="text-sm text-surface-500">Available Mon-Fri, 9 AM - 6 PM</p>
            </div>
            <div className="p-5 rounded-xl border border-surface-200">
              <MapPin className="h-5 w-5 text-brand-600 mb-2" />
              <h3 className="font-semibold text-surface-900 mb-1">Office</h3>
              <p className="text-sm text-surface-500">Bhubaneswar, Odisha, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
