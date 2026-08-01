'use client';
import Link from 'next/link';
import { ArrowRight, Bookmark, BookOpen, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import type { HomepageSection, Resource } from '@/types/notes';
import { getContinueStudying, getSectionResources } from '@/lib/notesStore';
import ResourceCard from '@/components/notes/ResourceCard';
import Badge from '@/components/ui/Badge';

export function ContinueStudying() {
  const items = getContinueStudying(6);
  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-surface-900 sm:text-xl">
            <Clock className="h-5 w-5 text-brand-600" /> Continue Studying
          </h2>
          <p className="mt-0.5 text-sm text-surface-500">Pick up where you left off</p>
        </div>
        <Link href="/notes/search" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ resource, progress }) => {
          const pct = resource.pageCount ? Math.min(100, Math.round((progress.lastPage / resource.pageCount) * 100)) : 0;
          return (
            <Link key={resource.id} href={`/notes/resource/${resource.slug}`} className="group">
              <div className="rounded-2xl border border-surface-200 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                    <BookOpen className="h-5 w-5 text-brand-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-bold text-surface-900 group-hover:text-brand-600">{resource.title}</p>
                    <p className="mt-0.5 text-xs text-surface-400">Page {progress.lastPage} of {resource.pageCount}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {progress.completed ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-mint-500" />
                  ) : (
                    <Badge variant="info" size="sm">{pct}%</Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function SectionRow({ section }: { section: HomepageSection }) {
  const resources = getSectionResources(section);
  if (resources.length === 0) return null;

  const icon = section.source === 'most_viewed' || section.source === 'most_saved' || section.source === 'most_downloaded' ? TrendingUp : Bookmark;
  const SectionIcon = icon;

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-surface-900 sm:text-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50">
              <SectionIcon className="h-4 w-4 text-brand-600" />
            </span>
            {section.title}
          </h2>
          {section.subtitle && <p className="mt-0.5 text-sm text-surface-500">{section.subtitle}</p>}
        </div>
        <Link href={`/notes/search?section=${section.id}`} className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
      </div>
    </div>
  );
}
