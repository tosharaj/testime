// ─── NOTES & PDF RESOURCE LIBRARY TYPES ─────────────────────────────────────

export type ResourceType = 'NOTES' | 'BOOK' | 'PYQ' | 'SOLVED_PAPER' | 'SYLLABUS' | 'IMPORTANT_QUESTIONS' | 'SHORT_NOTES' | 'MIND_MAP' | 'CURRENT_AFFAIRS' | 'PDF' | 'OTHER';
export type LanguageCode = 'en' | 'hi' | 'or' | 'bn' | 'te' | 'ta' | 'ml';
export type FileFormat = 'PDF' | 'DOC' | 'DOCX' | 'PPT' | 'PPTX' | 'XLS' | 'XLSX' | 'ZIP' | 'EPUB' | 'IMAGE';
export type Visibility = 'public' | 'signed_in' | 'restricted' | 'premium_ready';
export type AccessType = 'free' | 'restricted' | 'premium';
export type ResourceStatus = 'draft' | 'submitted' | 'under_review' | 'published' | 'needs_update' | 'archived' | 'rejected';
export type PermissionStatus = 'pending' | 'granted' | 'owned' | 'unknown';

// ─── TAXONOMY ───────────────────────────────────────────────────────────────

export interface ExamCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Exam {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  shortName?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ExamStage {
  id: string;
  examId: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Course {
  id: string;
  institutionId: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Major {
  id: string;
  courseId: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Semester {
  id: string;
  majorId: string;
  name: string;
  slug: string;
  displayName?: string;
  order: number;
  isActive: boolean;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  examId?: string;
  majorId?: string;
  isActive: boolean;
}

export interface SubjectUnit {
  id: string;
  subjectId: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  unitId?: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

// ─── RESOURCE ───────────────────────────────────────────────────────────────

export interface ResourceMeta {
  type: ResourceType;
  language: LanguageCode;
  format: FileFormat;
}

export interface ResourceStats {
  views: number;
  downloads: number;
  saves: number;
  shares: number;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  longDesc?: string;
  type: ResourceType;
  language: LanguageCode;
  format: FileFormat;
  pageCount: number;
  fileSize: number;
  mimeType?: string;
  thumbnail?: string;
  fileUrl?: string;
  previewPages?: string[];
  contributorName?: string;
  contributorEmail?: string;
  sourceAttribution?: string;
  permissionStatus: PermissionStatus;
  syllabusYear?: string;
  paperCode?: string;
  visibility: Visibility;
  accessType: AccessType;
  downloadAllowed: boolean;
  featured: boolean;
  isVerified: boolean;
  status: ResourceStatus;
  isPublished: boolean;
  publishedAt?: string;
  stats: ResourceStats;
  tags: string[];
  printAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  // primary taxonomy links (denormalized for convenience)
  examCategoryId?: string;
  examId?: string;
  stageId?: string;
  subjectId?: string;
  unitId?: string;
  topicId?: string;
  institutionId?: string;
  courseId?: string;
  majorId?: string;
  semesterId?: string;
  // extra taxonomy associations (M2M)
  examIds?: string[];
  subjectIds?: string[];
  topicIds?: string[];
}

// ─── ENGAGEMENT ─────────────────────────────────────────────────────────────

export interface SavedResource {
  resourceId: string;
  savedAt: string;
}

export interface StudyProgress {
  resourceId: string;
  lastPage: number;
  explored: boolean;
  completed: boolean;
  totalTimeMs: number;
  lastReadAt: string;
  updatedAt: string;
}

export interface UserNoteProfile {
  savedResources: SavedResource[];
  progress: Record<string, StudyProgress>;
  examFollows: string[];
  subjectFollows: string[];
  recentlyViewed: string[];
  pinnedResources: string[];
}

// ─── CONTRIBUTIONS / REQUESTS / REPORTS ─────────────────────────────────────

export type ContributionStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'published';

export interface Contribution {
  id: string;
  contributorName: string;
  contributorEmail?: string;
  resourceTitle: string;
  examCategory?: string;
  examName?: string;
  stageOrSemester?: string;
  subjectName?: string;
  paperCode?: string;
  unitChapter?: string;
  topicName?: string;
  resourceType: ResourceType;
  language: LanguageCode;
  fileUrl?: string;
  fileName?: string;
  description?: string;
  sourceAttribution?: string;
  copyrightDeclaration: boolean;
  permissionStatus?: PermissionStatus;
  notes?: string;
  status: ContributionStatus;
  createdAt: string;
  reviewedAt?: string;
}

export interface ResourceRequest {
  id: string;
  title: string;
  description?: string;
  examCategory?: string;
  examName?: string;
  subjectName?: string;
  topicName?: string;
  resourceType?: ResourceType;
  language?: LanguageCode;
  requesterName?: string;
  requesterEmail?: string;
  votes: number;
  status: 'open' | 'in_progress' | 'fulfilled' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export type ReportReason = 'copyright' | 'inaccurate' | 'outdated' | 'broken_file' | 'offensive' | 'spam' | 'other';

export interface ResourceReport {
  id: string;
  resourceId: string;
  resourceSlug?: string;
  resourceTitle?: string;
  reason: ReportReason;
  details?: string;
  reporterName?: string;
  reporterEmail?: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
}

// ─── HOMEPAGE SECTIONS ──────────────────────────────────────────────────────

export type HomepageSectionSource =
  | 'latest' | 'recently_updated' | 'most_viewed' | 'most_downloaded' | 'most_saved'
  | 'featured' | 'revision_mode' | 'current_affairs' | 'pyqs' | 'important_questions' | 'manual';

export interface HomepageSection {
  id: string;
  title: string;
  subtitle?: string;
  source: HomepageSectionSource;
  resourceIds?: string[];
  examId?: string;
  subjectId?: string;
  limit: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

// ─── REVISION CAMPAIGN ──────────────────────────────────────────────────────

export type RevisionCampaignStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface RevisionPlanItem {
  id: string;
  resourceId: string;
  order: number;
  estimatedMinutes?: number;
}

export interface RevisionCampaign {
  id: string;
  title: string;
  description?: string;
  examId?: string;
  examCategoryId?: string;
  subjectId?: string;
  items: RevisionPlanItem[];
  status: RevisionCampaignStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── MISC ───────────────────────────────────────────────────────────────────

export interface ResourceTypeDef {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

export interface LanguageDef {
  id: string;
  name: string;
  code: LanguageCode;
}

export interface FormatDef {
  id: string;
  name: string;
  slug: string;
}

export interface FilterState {
  query?: string;
  type?: string;
  language?: string;
  format?: string;
  access?: string;
  examCategoryId?: string;
  examId?: string;
  stageId?: string;
  subjectId?: string;
  institutionId?: string;
  courseId?: string;
  semesterId?: string;
  sort?: 'latest' | 'popular' | 'downloads' | 'title';
  page?: number;
  perPage?: number;
}
