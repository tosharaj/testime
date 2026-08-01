import type { Resource } from '@/types/notes';

export const resourceTypeGradients: Record<string, string> = {
  NOTES: 'from-brand-100 to-brand-50',
  BOOK: 'from-ocean-100 to-ocean-50',
  PYQ: 'from-mint-100 to-mint-50',
  SOLVED_PAPER: 'from-sunny-100 to-sunny-50',
  SYLLABUS: 'from-lavender-100 to-lavender-50',
  IMPORTANT_QUESTIONS: 'from-accent-100 to-accent-50',
  SHORT_NOTES: 'from-mint-100 to-mint-50',
  MIND_MAP: 'from-lavender-100 to-lavender-50',
  CURRENT_AFFAIRS: 'from-sunny-100 to-sunny-50',
  STATIC_GK: 'from-coral-100 to-coral-50',
  GOVERNMENT_SCHEMES: 'from-brand-100 to-brand-50',
  REPORTS_INDEXES: 'from-lavender-100 to-lavender-50',
  AWARDS_APPOINTMENTS: 'from-accent-100 to-accent-50',
  ODISHA_CURRENT_AFFAIRS: 'from-coral-100 to-coral-50',
  PDF: 'from-surface-100 to-surface-50',
  OTHER: 'from-surface-100 to-surface-50',
};

export const resourceTypeColors: Record<string, string> = {
  NOTES: 'text-brand-600',
  BOOK: 'text-ocean-600',
  PYQ: 'text-mint-600',
  SOLVED_PAPER: 'text-sunny-600',
  SYLLABUS: 'text-lavender-600',
  IMPORTANT_QUESTIONS: 'text-accent-600',
  SHORT_NOTES: 'text-mint-600',
  MIND_MAP: 'text-lavender-600',
  CURRENT_AFFAIRS: 'text-sunny-600',
  STATIC_GK: 'text-coral-600',
  GOVERNMENT_SCHEMES: 'text-brand-600',
  REPORTS_INDEXES: 'text-lavender-600',
  AWARDS_APPOINTMENTS: 'text-accent-600',
  ODISHA_CURRENT_AFFAIRS: 'text-coral-600',
  PDF: 'text-surface-500',
  OTHER: 'text-surface-500',
};

export const resourceTypeBadge: Record<string, string> = {
  NOTES: 'bg-brand-50 text-brand-700',
  BOOK: 'bg-ocean-50 text-ocean-700',
  PYQ: 'bg-mint-50 text-mint-700',
  SOLVED_PAPER: 'bg-sunny-50 text-sunny-700',
  SYLLABUS: 'bg-lavender-50 text-lavender-700',
  IMPORTANT_QUESTIONS: 'bg-accent-50 text-accent-700',
  SHORT_NOTES: 'bg-mint-50 text-mint-700',
  MIND_MAP: 'bg-lavender-50 text-lavender-700',
  CURRENT_AFFAIRS: 'bg-sunny-50 text-sunny-700',
  STATIC_GK: 'bg-coral-50 text-coral-700',
  GOVERNMENT_SCHEMES: 'bg-brand-50 text-brand-700',
  REPORTS_INDEXES: 'bg-lavender-50 text-lavender-700',
  AWARDS_APPOINTMENTS: 'bg-accent-50 text-accent-700',
  ODISHA_CURRENT_AFFAIRS: 'bg-coral-50 text-coral-700',
  PDF: 'bg-surface-100 text-surface-600',
  OTHER: 'bg-surface-100 text-surface-600',
};

export const typeIconName: Record<string, string> = {
  NOTES: 'FileText',
  BOOK: 'BookOpen',
  PYQ: 'ClipboardList',
  SOLVED_PAPER: 'CheckSquare',
  SYLLABUS: 'ScrollText',
  IMPORTANT_QUESTIONS: 'HelpCircle',
  SHORT_NOTES: 'Zap',
  MIND_MAP: 'Map',
  CURRENT_AFFAIRS: 'Newspaper',
  STATIC_GK: 'BookMarked',
  GOVERNMENT_SCHEMES: 'Landmark',
  REPORTS_INDEXES: 'BarChart3',
  AWARDS_APPOINTMENTS: 'Award',
  ODISHA_CURRENT_AFFAIRS: 'MapPin',
  PDF: 'File',
  OTHER: 'File',
};

export function typeLabel(type: string): string {
  const map: Record<string, string> = {
    NOTES: 'Notes',
    BOOK: 'Book',
    PYQ: 'PYQ',
    SOLVED_PAPER: 'Solved Paper',
    SYLLABUS: 'Syllabus',
    IMPORTANT_QUESTIONS: 'Important Qs',
    SHORT_NOTES: 'Short Notes',
    MIND_MAP: 'Mind Map',
    CURRENT_AFFAIRS: 'CA Monthly PDF',
    STATIC_GK: 'Static GK',
    GOVERNMENT_SCHEMES: 'Govt Schemes',
    REPORTS_INDEXES: 'Reports & Indexes',
    AWARDS_APPOINTMENTS: 'Awards & Appointments',
    ODISHA_CURRENT_AFFAIRS: 'Odisha CA',
    PDF: 'PDF',
    OTHER: 'Other',
  };
  return map[type] || type;
}

export function resourceTypeGradient(resource: Resource): string {
  return resourceTypeGradients[resource.type] || resourceTypeGradients.PDF;
}

export function accessBadge(resource: Resource) {
  if (resource.accessType === 'premium') return { label: 'Premium', cls: 'bg-sunny-500 text-white' };
  if (resource.accessType === 'restricted') return { label: 'Restricted', cls: 'bg-sunny-50 text-sunny-700' };
  return { label: 'Free', cls: 'bg-mint-50 text-mint-700' };
}

export function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: 'Draft', cls: 'bg-surface-100 text-surface-600' },
    submitted: { label: 'Submitted', cls: 'bg-ocean-50 text-ocean-700' },
    under_review: { label: 'Under Review', cls: 'bg-sunny-50 text-sunny-700' },
    published: { label: 'Published', cls: 'bg-mint-50 text-mint-700' },
    needs_update: { label: 'Needs Update', cls: 'bg-accent-50 text-accent-700' },
    archived: { label: 'Archived', cls: 'bg-surface-100 text-surface-500' },
    rejected: { label: 'Rejected', cls: 'bg-coral-50 text-coral-700' },
  };
  return map[status] || map.draft;
}
