'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Network, FileText, Inbox, ListChecks, Flag, Repeat,
  Layout, BarChart3, Settings, ScrollText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Overview', href: '/admin/notes/overview', icon: LayoutDashboard },
  { label: 'Taxonomy', href: '/admin/notes/taxonomy', icon: Network },
  { label: 'Resources', href: '/admin/notes/resources', icon: FileText },
  { label: 'Contributions', href: '/admin/notes/contributions', icon: Inbox },
  { label: 'Requests', href: '/admin/notes/requests', icon: ListChecks },
  { label: 'Reports', href: '/admin/notes/reports', icon: Flag },
  { label: 'Revision Mode', href: '/admin/notes/revision', icon: Repeat },
  { label: 'Homepage', href: '/admin/notes/homepage', icon: Layout },
  { label: 'Analytics', href: '/admin/notes/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/notes/settings', icon: Settings },
  { label: 'Audit Log', href: '/admin/notes/audit', icon: ScrollText },
];

export default function AdminNotesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Notes &amp; PDF Library</h1>
        <p className="text-sm text-surface-500 mt-0.5">Manage the complete resource library — taxonomy, content, community and retention</p>
      </div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map(t => {
          const active = pathname === t.href || (t.href !== '/admin/notes/overview' && pathname.startsWith(t.href));
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
                active ? 'bg-surface-900 text-white shadow-sm' : 'bg-white border border-surface-200 text-surface-500 hover:border-brand-300 hover:text-brand-600'
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
