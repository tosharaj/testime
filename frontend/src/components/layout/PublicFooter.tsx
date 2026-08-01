import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const footerLinks = [
  {
    title: 'Top Exams',
    links: [
      { label: 'OSSC Exams', href: '/exams/ossc' },
      { label: 'OSSSC Exams', href: '/exams/osssc' },
      { label: 'OPSC Exams', href: '/exams/opsc' },
      { label: 'SSB Exams', href: '/exams/ssb' },
      { label: 'Odisha Police', href: '/exams/odisha-police' },
    ],
  },
  {
    title: 'Study Material',
    links: [
      { label: 'Notes & Resources', href: '/notes' },
      { label: 'Question Bank', href: '/questions' },
      { label: 'Test Series', href: '/test-series' },
      { label: 'NCERT Resources', href: '/ncert' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com/testime', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com/testime', icon: Instagram },
  { label: 'X (Twitter)', href: 'https://x.com/testime', icon: Twitter },
  { label: 'Telegram', href: 'https://t.me/testime', icon: Send },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/testime', icon: Linkedin },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-surface-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white text-xs font-bold shadow-sm shadow-brand-200">
                T
              </div>
              <span className="font-display text-base font-bold text-surface-900">Testime</span>
            </Link>
            <p className="text-sm text-surface-500 leading-relaxed mb-5">
              Odisha&apos;s most advanced exam preparation platform. Empowering students to achieve their dreams.
            </p>
            <div className="flex gap-1.5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  aria-label={s.label}
                >
                  <s.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-surface-900 mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-500 hover:text-brand-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-400">
            &copy; 2024 Testime. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-sm text-surface-400 hover:text-surface-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-surface-400 hover:text-surface-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
