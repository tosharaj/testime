'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  FileText, BookOpen, ClipboardList, CheckSquare, ScrollText, HelpCircle,
  Zap, Map, Newspaper, Landmark, BarChart3, Award, MapPin, BookMarked,
  File, Bookmark, BookmarkCheck, Download, Share2,
  Flag, Eye, ShieldCheck, Languages, FileType2, Calendar, LayoutGrid,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Resource } from '@/types/notes';
import {
  resourceTypeGradient, resourceTypeColors, resourceTypeBadge, typeLabel,
  accessBadge,
} from '@/lib/resourceStyles';
import { getLibrary, isResourceSaved, toggleSaveResource, recordDownload, recordShare, languageName, formatBytes, resolveHierarchy } from '@/lib/notesStore';
import { formatDate } from '@/lib/utils';

const typeIcons: Record<string, LucideIcon> = {
  NOTES: FileText, BOOK: BookOpen, PYQ: ClipboardList, SOLVED_PAPER: CheckSquare,
  SYLLABUS: ScrollText, IMPORTANT_QUESTIONS: HelpCircle, SHORT_NOTES: Zap,
  MIND_MAP: Map, CURRENT_AFFAIRS: Newspaper, STATIC_GK: BookMarked,
  GOVERNMENT_SCHEMES: Landmark, REPORTS_INDEXES: BarChart3,
  AWARDS_APPOINTMENTS: Award, ODISHA_CURRENT_AFFAIRS: MapPin,
  PDF: File, OTHER: File,
};

interface ResourceCardProps {
  resource: Resource;
  onShare?: (resource: Resource) => void;
  onReport?: (resource: Resource) => void;
}

export default function ResourceCard({ resource, onShare, onReport }: ResourceCardProps) {
  const [saved, setSaved] = useState(() => isResourceSaved(resource.id));
  const data = getLibrary();
  const h = resolveHierarchy(data, resource);
  const Icon = typeIcons[resource.type] || File;
  const access = accessBadge(resource);
  const isPremium = resource.accessType === 'premium';

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(toggleSaveResource(resource.id));
  };
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPremium) return;
    recordDownload(resource.id);
    if (resource.fileUrl) window.open(resource.fileUrl, '_blank');
  };
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    recordShare(resource.id);
    if (navigator.share) {
      navigator.share({ title: resource.title, url: `/notes/resource/${resource.slug}` }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/notes/resource/${resource.slug}`).then(() => {
        if (onShare) onShare(resource);
      });
    }
  };
  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onReport) onReport(resource);
  };

  return (
    <Link href={`/notes/resource/${resource.slug}`} className="group block h-full">
      <div className="flex h-full flex-col rounded-2xl border border-surface-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover overflow-hidden">
        {/* Thumbnail */}
        <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${resourceTypeGradient(resource)}`}>
          <div className="absolute inset-0 bg-dot-grid opacity-30" />
          <Icon className={`relative h-11 w-11 ${resourceTypeColors[resource.type]}`} strokeWidth={1.75} />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${resourceTypeBadge[resource.type]}`}>
              {typeLabel(resource.type)}
            </span>
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${access.cls}`}>{access.label}</span>
            {resource.isVerified && (
              <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-brand-600" title="Verified content">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 flex items-center gap-1 rounded-tl-xl bg-white/80 px-2 py-1 text-[11px] font-medium text-surface-500 backdrop-blur">
            <LayoutGrid className="h-3 w-3" />
            {resource.pageCount || 0} pages
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-display text-sm font-bold text-surface-900 transition-colors group-hover:text-brand-600">
              {resource.title}
            </h3>
            <button
              onClick={handleSave}
              className="shrink-0 rounded-lg p-1 text-surface-400 transition-colors hover:bg-surface-100 hover:text-brand-600"
              title={saved ? 'Remove from saved' : 'Save resource'}
            >
              {saved ? <BookmarkCheck className="h-4 w-4 text-brand-600" /> : <Bookmark className="h-4 w-4" />}
            </button>
          </div>

          {resource.shortDesc && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-surface-500">{resource.shortDesc}</p>
          )}

          {/* Taxonomy context */}
          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-medium">
            {h.examCategory && (
              <span className="rounded-lg bg-brand-50 px-2 py-1 text-brand-700">{h.examCategory.name}</span>
            )}
            {h.exam && (
              <span className="rounded-lg bg-surface-100 px-2 py-1 text-surface-600">{h.exam.shortName || h.exam.name}</span>
            )}
            {h.subject && (
              <span className="rounded-lg bg-accent-50 px-2 py-1 text-accent-700">{h.subject.name}</span>
            )}
            {h.topic && (
              <span className="rounded-lg bg-mint-50 px-2 py-1 text-mint-700">{h.topic.name}</span>
            )}
            {!h.exam && h.institution && (
              <span className="rounded-lg bg-lavender-50 px-2 py-1 text-lavender-700">{h.institution.name}</span>
            )}
            {h.course && (
              <span className="rounded-lg bg-surface-100 px-2 py-1 text-surface-600">{h.course.name}</span>
            )}
            {h.semester && (
              <span className="rounded-lg bg-surface-100 px-2 py-1 text-surface-600">{h.semester.displayName || h.semester.name}</span>
            )}
          </div>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-surface-400">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />{resource.stats.views}
            </span>
            <span className="inline-flex items-center gap-1">
              <Download className="h-3 w-3" />{resource.stats.downloads}
            </span>
            <span className="inline-flex items-center gap-1">
              <Languages className="h-3 w-3" />{languageName(resource.language)}
            </span>
            <span className="inline-flex items-center gap-1">
              <FileType2 className="h-3 w-3" />{resource.format}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />{formatDate(resource.updatedAt)}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-3">
            <span className="truncate text-[11px] text-surface-400">
              {resource.fileSize > 0 ? `${formatBytes(resource.fileSize)}` : ''}
              {resource.contributorName ? ` · ${resource.contributorName}` : ''}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={handleDownload} disabled={isPremium}
                className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-mint-50 hover:text-mint-600 disabled:opacity-40"
                title={isPremium ? 'Premium resource — upgrade to download' : 'Download PDF'}>
                <Download className="h-4 w-4" />
              </button>
              <button onClick={handleShare} className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-brand-50 hover:text-brand-600" title="Share">
                <Share2 className="h-4 w-4" />
              </button>
              <button onClick={handleReport} className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-coral-50 hover:text-coral-600" title="Report issue">
                <Flag className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
