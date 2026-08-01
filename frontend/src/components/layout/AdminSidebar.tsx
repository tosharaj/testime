'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, FileText, HelpCircle, BrainCircuit,
  DollarSign, Image, BarChart3, Settings, Ticket, Newspaper,
  ShoppingCart, Percent, Target, PenTool, BookOpen, BookCheck,
  Network, Inbox, ListChecks, Flag, Repeat, Layout
} from 'lucide-react';

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Users', href: '/admin/users', icon: Users },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Notes', href: '/admin/content/notes', icon: FileText },
      { label: 'Categories', href: '/admin/content/categories', icon: FileText },
      { label: 'Blog', href: '/admin/blog', icon: Newspaper },
      { label: 'NCERT', href: '/admin/ncert', icon: BookCheck },
      { label: 'Current Affairs', href: '/admin/current-affairs', icon: Newspaper },
      { label: 'Media', href: '/admin/media', icon: Image },
    ],
  },
  {
    label: 'Notes Library',
    items: [
      { label: 'Overview', href: '/admin/notes/overview', icon: LayoutDashboard },
      { label: 'Taxonomy', href: '/admin/notes/taxonomy', icon: Network },
      { label: 'Resources', href: '/admin/notes/resources', icon: FileText },
      { label: 'Contributions', href: '/admin/notes/contributions', icon: Inbox },
      { label: 'Requests', href: '/admin/notes/requests', icon: ListChecks },
      { label: 'Reports', href: '/admin/notes/reports', icon: Flag },
      { label: 'Revision Mode', href: '/admin/notes/revision', icon: Repeat },
      { label: 'Homepage', href: '/admin/notes/homepage', icon: Layout },
      { label: 'Analytics', href: '/admin/notes/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Exams',
    items: [
      { label: 'Question Bank', href: '/admin/questions', icon: HelpCircle },
      { label: 'Prelim PYQs', href: '/admin/questions/prelims', icon: Target },
      { label: 'Mains PYQs', href: '/admin/questions/mains', icon: PenTool },
      { label: 'Test Series', href: '/admin/test-series', icon: BookOpen },
      { label: 'Tests', href: '/admin/tests', icon: BrainCircuit },
      { label: 'Results', href: '/admin/results', icon: BarChart3 },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { label: 'Plans', href: '/admin/revenue/plans', icon: ShoppingCart },
      { label: 'Orders', href: '/admin/revenue/orders', icon: DollarSign },
      { label: 'Coupons', href: '/admin/revenue/coupons', icon: Percent },
    ],
  },
  {
    label: 'Other',
    items: [
      { label: 'Ads', href: '/admin/ads', icon: Image },
      { label: 'Support', href: '/admin/support', icon: Ticket },
      { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r border-surface-200/60 bg-white hidden lg:block">
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-surface-200/60">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white text-sm font-bold shadow-md">
            T
          </div>
        <span className="text-lg font-bold text-surface-900">Testime</span>
      </div>
      <nav className="p-4 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[11px] font-bold text-surface-400 uppercase tracking-widest mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm'
                        : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
