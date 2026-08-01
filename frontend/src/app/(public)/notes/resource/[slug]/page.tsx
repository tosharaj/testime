'use client';
import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight, BookOpen, Download, Bookmark, BookmarkCheck, Share2, Flag,
  ShieldCheck, Eye, Calendar, Languages, FileType2, LayoutGrid, HardDrive,
  Lock, Printer, User, ArrowRight, Sparkles, Tag, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ResourceCard from '@/components/notes/ResourceCard';
import PdfReader from '@/components/notes/PdfReader';
import ReportIssueModal from '@/components/notes/ReportIssueModal';
import {
  getLibrary, getResourceBySlug, getRelatedResources, getContinueStudying,
  isResourceSaved, toggleSaveResource, recordDownload, recordShare,
  languageName, formatBytes, resolveHierarchy,
} from '@/lib/notesStore';
import { typeLabel, resourceTypeBadge, resourceTypeColors } from '@/lib/resourceStyles';
import { formatDate } from '@/lib/utils';

function ResourceDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const data = getLibrary();
  const [resource, setResource] = useState(() => getResourceBySlug(slug));
  const [readerOpen, setReaderOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [saved, setSaved] = useState(() => (resource ? isResourceSaved(resource.id) : false));
  const [copied, setCopied] = useState(false);

  const related = useMemo(() => (resource ? getRelatedResources(resource, 4) : []), [resource]);
  const continueStudying = useMemo(() => getContinueStudying(6).filter(c => c.resource.id !== resource?.id), [resource]);

  if (!resource) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100">
          <BookOpen className="h-8 w-8 text-surface-300" />
        </div>
        <p className="mb-4 text-lg font-semibold text-surface-900">Resource not found</p>
        <Link href="/notes"><Button variant="outline">Back to Notes Library</Button></Link>
      </div>
    );
  }

  const h = resolveHierarchy(data, resource);
  const isPremium = resource.accessType === 'premium';
  const isRestricted = resource.visibility === 'signed_in' || resource.visibility === 'restricted';

  const crumbItems: { label: string; href?: string }[] = [];
  if (h.examCategory) crumbItems.push({ label: h.examCategory.name, href: `/notes/category/${h.examCategory.slug}` });
  if (h.exam) crumbItems.push({ label: h.exam.shortName || h.exam.name, href: `/notes/exam/${h.exam.slug}` });
  if (h.stage) crumbItems.push({ label: h.stage.name });
  if (h.institution) crumbItems.push({ label: h.institution.name, href: `/notes/academic/${h.institution.slug}` });
  if (h.course) crumbItems.push({ label: h.course.name, href: `/notes/academic/${h.institution?.slug}/${h.course.slug}` });
  if (h.semester) crumbItems.push({ label: h.semester.displayName || h.semester.name, href: `/notes/academic/${h.institution?.slug}/${h.course?.slug}/${h.semester.slug}` });
  if (h.subject) crumbItems.push({ label: h.subject.name, href: `/notes/subject/${h.subject.slug}` });
  if (h.topic) crumbItems.push({ label: h.topic.name, href: `/notes/topic/${h.topic.slug}` });

  const handleSave = () => {
    setSaved(toggleSaveResource(resource.id));
    setResource(getResourceBySlug(slug));
  };
  const handleDownload = () => {
    if (isPremium) return;
    recordDownload(resource.id);
    if (resource.fileUrl) window.open(resource.fileUrl, '_blank');
    setResource(getResourceBySlug(slug));
  };
  const handleShare = async () => {
    recordShare(resource.id);
    setResource(getResourceBySlug(slug));
    const url = `${window.location.origin}/notes/resource/${resource.slug}`;
    if (navigator.share) { navigator.share({ title: resource.title, url }).catch(() => {}); }
    else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          {crumbItems.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.href ? <Link href={c.href} className="hover:text-brand-600 transition-colors">{c.label}</Link> : <span className="font-medium text-surface-600">{c.label}</span>}
            </span>
          ))}
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Cover */}
            <div className="relative mb-6 flex h-56 items-center justify-center overflow-hidden rounded-3xl border border-surface-200 bg-gradient-to-br from-brand-50 via-white to-mint-50 sm:h-64">
              <div className="absolute inset-0 bg-dot-grid opacity-30" />
              <div className="relative text-center">
                <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ${resourceTypeColors[resource.type]}`}>
                  <BookOpen className="h-8 w-8" />
                </div>
                <p className={`text-sm font-bold ${resourceTypeColors[resource.type]}`}>{typeLabel(resource.type)}</p>
                <p className="mt-1 text-xs text-surface-400">{resource.format} · {resource.pageCount || 0} pages</p>
              </div>
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${resourceTypeBadge[resource.type]}`}>{typeLabel(resource.type)}</span>
                {isPremium && <Badge variant="premium">Premium</Badge>}
                {isRestricted && <Badge variant="warning">Restricted</Badge>}
                {!isPremium && !isRestricted && <Badge variant="success">Free</Badge>}
              </div>
              <div className="absolute right-4 top-4">
                {resource.isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900 leading-tight">{resource.title}</h1>
            {resource.shortDesc && <p className="mt-2 text-base text-surface-500 leading-relaxed">{resource.shortDesc}</p>}

            {/* Taxonomy chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {h.examCategory && <Link href={`/notes/category/${h.examCategory.slug}`} className="rounded-xl bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100">{h.examCategory.name}</Link>}
              {h.exam && <Link href={`/notes/exam/${h.exam.slug}`} className="rounded-xl bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-200">{h.exam.shortName || h.exam.name}</Link>}
              {h.stage && <span className="rounded-xl bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700">{h.stage.name}</span>}
              {h.subject && <Link href={`/notes/subject/${h.subject.slug}`} className="rounded-xl bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-700 hover:bg-accent-100">{h.subject.name}</Link>}
              {h.unit && <span className="rounded-xl bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-600">{h.unit.name}</span>}
              {h.topic && <Link href={`/notes/topic/${h.topic.slug}`} className="rounded-xl bg-mint-50 px-3 py-1.5 text-sm font-medium text-mint-700 hover:bg-mint-100">{h.topic.name}</Link>}
              {h.institution && <Link href={`/notes/academic/${h.institution.slug}`} className="rounded-xl bg-lavender-50 px-3 py-1.5 text-sm font-medium text-lavender-700 hover:bg-lavender-100">{h.institution.name}</Link>}
              {h.course && <span className="rounded-xl bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-600">{h.course.name}</span>}
              {h.semester && <span className="rounded-xl bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-600">{h.semester.displayName || h.semester.name}</span>}
            </div>

            {/* Primary actions */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button size="lg" variant="primary-gradient" onClick={() => setReaderOpen(true)}>
                <BookOpen className="h-4 w-4" /> {resource.pageCount ? 'Read Online' : 'Preview'}
              </Button>
              <Button size="lg" variant={isPremium ? 'secondary' : 'cta'} onClick={handleDownload} disabled={isPremium} title={isPremium ? 'Upgrade to download' : 'Download'}>
                <Download className="h-4 w-4" /> {isPremium ? 'Upgrade to Download' : 'Download PDF'}
              </Button>
              <Button size="lg" variant="outline" onClick={handleSave}>
                {saved ? <BookmarkCheck className="h-4 w-4 text-brand-600" /> : <Bookmark className="h-4 w-4" />}
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button size="lg" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" /> {copied ? 'Link copied!' : 'Share'}
              </Button>
              <Button size="lg" variant="ghost" onClick={() => setReportOpen(true)}>
                <Flag className="h-4 w-4" /> Report
              </Button>
            </div>

            {/* Premium/restricted banner */}
            {isPremium && (
              <div className="mt-6 rounded-2xl border border-sunny-200 bg-sunny-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sunny-100">
                    <Lock className="h-5 w-5 text-sunny-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sunny-800">Premium Resource</p>
                    <p className="mt-0.5 text-sm text-sunny-700">Upgrade to a Testime plan to read, download and print this resource.</p>
                    <Link href="/pricing" className="mt-3 inline-block">
                      <Button variant="accent" size="sm">View Plans</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {isRestricted && !isPremium && (
              <div className="mt-6 rounded-2xl border border-ocean-200 bg-ocean-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-100">
                    <Lock className="h-5 w-5 text-ocean-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-ocean-800">Signed-in only</p>
                    <p className="mt-0.5 text-sm text-ocean-700">Sign in to your free account to access this resource.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {resource.longDesc && (
              <div className="mt-8 rounded-3xl border border-surface-200/60 bg-white p-6 sm:p-8 shadow-card">
                <h2 className="mb-3 font-display text-lg font-bold text-surface-900">About this resource</h2>
                <div className="prose-note" dangerouslySetInnerHTML={{ __html: resource.longDesc }} />
              </div>
            )}

            {/* Tags */}
            {resource.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-surface-400" />
                {resource.tags.map(t => (
                  <Link key={t} href={`/notes/search?q=${encodeURIComponent(t)}`} className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-600 hover:bg-surface-200">
                    #{t}
                  </Link>
                ))}
              </div>
            )}

            {/* Continue studying related */}
            {continueStudying.length > 0 && (
              <div className="mt-12 border-t border-surface-100 pt-8">
                <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-surface-900">
                  <Sparkles className="h-5 w-5 text-brand-600" /> Continue Studying
                </h2>
                <div className="space-y-3">
                  {continueStudying.map(({ resource: rs, progress }) => (
                    <Link key={rs.id} href={`/notes/resource/${rs.slug}`} className="group">
                      <div className="flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                          <BookOpen className="h-5 w-5 text-brand-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-surface-900 group-hover:text-brand-600">{rs.title}</p>
                          <p className="mt-0.5 text-xs text-surface-400">Page {progress.lastPage} of {rs.pageCount || 0}</p>
                        </div>
                        {progress.completed
                          ? <CheckCircle2 className="h-5 w-5 shrink-0 text-mint-500" />
                          : <Badge variant="info" size="sm">{rs.pageCount ? Math.min(100, Math.round(progress.lastPage / rs.pageCount * 100)) : 0}%</Badge>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4 font-display text-sm font-bold text-surface-900">Resource details</h3>
                <dl className="space-y-3 text-sm">
                  <MetaRow icon={LayoutGrid} label="Pages" value={`${resource.pageCount || 0}`} />
                  <MetaRow icon={HardDrive} label="File size" value={resource.fileSize ? formatBytes(resource.fileSize) : '—'} />
                  <MetaRow icon={Languages} label="Language" value={languageName(resource.language)} />
                  <MetaRow icon={FileType2} label="Format" value={resource.format} />
                  <MetaRow icon={Eye} label="Views" value={`${resource.stats.views}`} />
                  <MetaRow icon={Download} label="Downloads" value={`${resource.stats.downloads}`} />
                  <MetaRow icon={Calendar} label="Updated" value={formatDate(resource.updatedAt)} />
                  {resource.syllabusYear && <MetaRow icon={Calendar} label="Syllabus year" value={resource.syllabusYear} />}
                  {resource.paperCode && <MetaRow icon={FileType2} label="Paper code" value={resource.paperCode} />}
                </dl>
                {resource.printAvailable && (
                  <div className="mt-4 rounded-xl border border-surface-200 bg-surface-50 p-3 text-xs text-surface-500">
                    <Printer className="mb-1 h-4 w-4 text-brand-600" />
                    This resource supports PDF printing (pdf2kagaz).
                  </div>
                )}
              </CardContent>
            </Card>

            {resource.contributorName && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 font-display text-sm font-bold text-surface-900">Contribution</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white">
                      {resource.contributorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-surface-900">{resource.contributorName}</p>
                      {resource.sourceAttribution && <p className="truncate text-xs text-surface-400">{resource.sourceAttribution}</p>}
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-surface-400">
                    Content is shared under our <Link href="/notes/content-policy" className="font-medium text-brand-600 hover:underline">content policy</Link>. To report an issue,{' '}
                    <button onClick={() => setReportOpen(true)} className="font-medium text-coral-600 hover:underline">report it here</button>.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14 border-t border-surface-100 pt-8">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-surface-900">
              <ArrowRight className="h-5 w-5 text-brand-600" /> Related Resources
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {related.map(r => <ResourceCard key={r.id} resource={r} />)}
            </div>
          </div>
        )}
      </div>

      {readerOpen && (
        <PdfReader
          resource={resource}
          onClose={() => setReaderOpen(false)}
          onReport={res => { setReaderOpen(false); setReportOpen(true); }}
        />
      )}
      <ReportIssueModal resource={resource} isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}

function MetaRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-2 text-surface-400"><Icon className="h-3.5 w-3.5" /> {label}</dt>
      <dd className="font-medium text-surface-800">{value}</dd>
    </div>
  );
}

export default function ResourceDetailPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <ResourceDetailContent />
    </Suspense>
  );
}
