'use client';
import Link from 'next/link';
import { ArrowRight, Bookmark, BookOpen, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import type { HomepageSection, Resource } from '@/types/notes';
import { getContinueStudying, getSectionResources } from '@/lib/notesStore';
import ResourceCard from '@/components/notes/ResourceCard';
import Badge from '@/components/ui/Badge';
import { crayon, type Crayon } from '@/lib/crayon';

export function SectionHeading({
  number,
  title,
  subtitle,
  icon,
  color,
  actionHref,
  actionLabel = 'View all',
}: {
  number: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color: Crayon;
  actionHref?: string;
  actionLabel?: string;
}) {
  const Icon = icon;
  return (
    <div className="mb-5">
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${color.body} text-white shadow-md`}>
            {Icon ? <Icon className="h-5 w-5" /> : <span className="font-display text-sm font-bold">{number}</span>}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-display text-xs font-bold uppercase tracking-widest ${color.text}`}>Step {number}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-surface-900 sm:text-2xl">{title}</h2>
          </div>
        </div>
        {actionHref && (
          <Link
            href={actionHref}
            className={`group hidden items-center gap-1 rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-all sm:flex ${color.border} ${color.text} hover:-translate-y-0.5 hover:shadow-md`}
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-surface-500">{subtitle}</p>}
      <div className={`mt-3 h-1.5 w-16 rounded-full ${color.body}`} />
    </div>
  );
}

export function ContinueStudying({ color }: { color?: Crayon }) {
  const c = color ?? crayon(3);
  const items = getContinueStudying(6);
  if (items.length === 0) return null;

  return (
    <section id="continue-studying" className="mb-14 scroll-mt-28">
      <SectionHeading
        number="03"
        title="Continue Studying"
        subtitle="Pick up where you left off — resume instantly from your last page."
        icon={Clock}
        color={c}
        actionHref="/notes/search"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ resource, progress }) => {
          const pct = resource.pageCount ? Math.min(100, Math.round((progress.lastPage / resource.pageCount) * 100)) : 0;
          return (
            <Link key={resource.id} href={`/notes/resource/${resource.slug}`} className="group">
              <div className={`rounded-2xl border-2 border-surface-200 bg-white p-4 shadow-card transition-all hover:-translate-y-1 ${c.hoverBorder} hover:shadow-lg`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.soft} ${c.text}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`line-clamp-1 text-sm font-bold text-surface-900 ${c.hoverText}`}>{resource.title}</p>
                    <p className="mt-0.5 text-xs text-surface-400">Page {progress.lastPage} of {resource.pageCount}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-100">
                      <div className={`h-full rounded-full ${c.body}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {progress.completed ? (
                    <CheckCircle2 className={`h-5 w-5 shrink-0 ${c.text}`} />
                  ) : (
                    <Badge variant="info" size="sm">{pct}%</Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function SectionRow({ section, color }: { section: HomepageSection; color?: Crayon }) {
  const c = color ?? crayon(2);
  const resources = getSectionResources(section);
  if (resources.length === 0) return null;

  const icon = section.source === 'most_viewed' || section.source === 'most_saved' || section.source === 'most_downloaded' ? TrendingUp : Bookmark;
  const SectionIcon = icon;

  return (
    <section id={`section-${section.id}`} className="mb-14 scroll-mt-28">
      <SectionHeading
        number="04"
        title={section.title}
        subtitle={section.subtitle}
        icon={SectionIcon}
        color={c}
        actionHref={`/notes/search?section=${section.id}`}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
      </div>
    </section>
  );
}
