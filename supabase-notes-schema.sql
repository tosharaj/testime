-- ============================================================
-- Testime — Notes & PDF Resource Library
-- Run in Supabase SQL Editor (project: sjqpzktnqoycuqjzjmkd)
-- ============================================================

-- ============================================================
-- 1. TAXONOMY — Exam hierarchy
-- ============================================================

CREATE TABLE IF NOT EXISTS exam_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  seo_title   TEXT,
  seo_desc    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  created_by  UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS exams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID REFERENCES exam_categories(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  short_name      TEXT,
  description     TEXT,
  icon            TEXT,
  exam_type       TEXT DEFAULT 'exam',          -- 'exam' | 'academic'
  is_active       BOOLEAN DEFAULT true,
  sort_order      INT DEFAULT 0,
  seo_title       TEXT,
  seo_desc        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID REFERENCES auth.users(id)
);
CREATE INDEX IF NOT EXISTS idx_exams_category ON exams(category_id);

-- Stage / Paper / Tier for exams; Semester / Year for academic
CREATE TABLE IF NOT EXISTS exam_stages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id     UUID REFERENCES exams(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT,
  description TEXT,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_exam_stages_exam ON exam_stages(exam_id);

-- ============================================================
-- 2. TAXONOMY — Academic hierarchy
-- ============================================================

CREATE TABLE IF NOT EXISTS institutions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT,
  description   TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_courses_institution ON courses(institution_id);

-- Majors / Honours / Branches
CREATE TABLE IF NOT EXISTS majors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT,
  description TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_majors_course ON majors(course_id);

-- Semesters / Years
CREATE TABLE IF NOT EXISTS semesters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  major_id    UUID REFERENCES majors(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_semesters_major ON semesters(major_id);

-- ============================================================
-- 3. TAXONOMY — Subjects / Units / Topics (shared by both)
-- ============================================================

CREATE TABLE IF NOT EXISTS subjects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id     UUID REFERENCES exams(id) ON DELETE CASCADE,       -- exam-linked subject
  stage_id    UUID REFERENCES exam_stages(id) ON DELETE CASCADE, -- optional stage link
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,     -- academic-linked subject
  major_id    UUID REFERENCES majors(id) ON DELETE CASCADE,      -- optional major link
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,   -- optional semester link
  name        TEXT NOT NULL,
  slug        TEXT,
  description TEXT,
  paper_code  TEXT,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subjects_exam ON subjects(exam_id);
CREATE INDEX IF NOT EXISTS idx_subjects_stage ON subjects(stage_id);
CREATE INDEX IF NOT EXISTS idx_subjects_course ON subjects(course_id);
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON subjects(semester_id);

CREATE TABLE IF NOT EXISTS subject_units (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id  UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT,
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_units_subject ON subject_units(subject_id);

CREATE TABLE IF NOT EXISTS topics (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     UUID REFERENCES subject_units(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT,
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_topics_unit ON topics(unit_id);

-- ============================================================
-- 4. RESOURCES
-- ============================================================

CREATE TABLE IF NOT EXISTS resource_types (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT UNIQUE NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_languages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT UNIQUE NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_formats (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT UNIQUE NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  short_desc      TEXT,
  long_desc       TEXT,
  resource_type_id UUID REFERENCES resource_types(id),
  language_id     UUID REFERENCES resource_languages(id),
  format_id       UUID REFERENCES resource_formats(id),
  subject_id      UUID REFERENCES subjects(id) ON DELETE SET NULL,
  unit_id         UUID REFERENCES subject_units(id) ON DELETE SET NULL,
  topic_id        UUID REFERENCES topics(id) ON DELETE SET NULL,
  stage_id        UUID REFERENCES exam_stages(id) ON DELETE SET NULL,
  paper_code      TEXT,
  file_path       TEXT,            -- storage path
  thumbnail_path  TEXT,            -- storage path
  page_count      INT DEFAULT 0,
  file_size       BIGINT DEFAULT 0,
  mime_type       TEXT,
  contributor_name TEXT,
  contributor_email TEXT,
  source_attribution TEXT,
  permission_status TEXT DEFAULT 'pending',   -- pending | granted | owned | unknown
  syllabus_year   TEXT,
  visibility      TEXT DEFAULT 'public',       -- public | signed_in | restricted | premium_ready
  access_type     TEXT DEFAULT 'free',         -- free | restricted | premium
  download_allowed BOOLEAN DEFAULT true,
  featured        BOOLEAN DEFAULT false,
  is_verified     BOOLEAN DEFAULT false,
  status          TEXT DEFAULT 'draft',        -- draft|submitted|under_review|published|needs_update|archived|rejected
  is_published    BOOLEAN DEFAULT false,
  published_at    TIMESTAMPTZ,
  view_count      INT DEFAULT 0,
  download_count  INT DEFAULT 0,
  save_count      INT DEFAULT 0,
  share_count     INT DEFAULT 0,
  sort_order      INT DEFAULT 0,
  search_keywords TEXT,
  print_available BOOLEAN DEFAULT false,      -- pdf2kagaz ready
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID REFERENCES auth.users(id)
);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON resources(subject_id);
CREATE INDEX IF NOT EXISTS idx_resources_unit ON resources(unit_id);
CREATE INDEX IF NOT EXISTS idx_resources_topic ON resources(topic_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status, is_published);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(published_at DESC) WHERE is_published;

-- Many-to-many: resource <-> taxonomy
CREATE TABLE IF NOT EXISTS resource_exams (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  exam_id     UUID REFERENCES exams(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, exam_id)
);
CREATE TABLE IF NOT EXISTS resource_exam_stages (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  stage_id    UUID REFERENCES exam_stages(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, stage_id)
);
CREATE TABLE IF NOT EXISTS resource_institutions (
  resource_id  UUID REFERENCES resources(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, institution_id)
);
CREATE TABLE IF NOT EXISTS resource_courses (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, course_id)
);
CREATE TABLE IF NOT EXISTS resource_semesters (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, semester_id)
);
CREATE TABLE IF NOT EXISTS resource_subjects (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  subject_id  UUID REFERENCES subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, subject_id)
);
CREATE TABLE IF NOT EXISTS resource_units (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  unit_id     UUID REFERENCES subject_units(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, unit_id)
);
CREATE TABLE IF NOT EXISTS resource_topics (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  topic_id    UUID REFERENCES topics(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, topic_id)
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT UNIQUE NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS resource_tags (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  tag_id      UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

-- File versions
CREATE TABLE IF NOT EXISTS resource_files (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id     UUID REFERENCES resources(id) ON DELETE CASCADE,
  original_name   TEXT,
  storage_path    TEXT NOT NULL,
  mime_type       TEXT,
  size            BIGINT,
  page_count      INT,
  checksum        TEXT,
  uploaded_by     UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_versions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  version     INT DEFAULT 1,
  file_path   TEXT,
  change_note TEXT,
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS related_resources (
  resource_id   UUID REFERENCES resources(id) ON DELETE CASCADE,
  related_id    UUID REFERENCES resources(id) ON DELETE CASCADE,
  relation_type TEXT DEFAULT 'related',     -- related | next_topic | revision | pyq
  PRIMARY KEY (resource_id, related_id)
);

-- ============================================================
-- 5. CONTRIBUTIONS & REQUESTS
-- ============================================================

CREATE TABLE IF NOT EXISTS resource_contributions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_name   TEXT NOT NULL,
  contributor_email  TEXT,
  resource_title     TEXT NOT NULL,
  exam_category      TEXT,
  exam_name          TEXT,
  stage_or_semester  TEXT,
  subject_name       TEXT,
  paper_code         TEXT,
  unit_chapter       TEXT,
  topic_name         TEXT,
  language           TEXT DEFAULT 'English',
  resource_type      TEXT,
  format             TEXT DEFAULT 'Typed PDF',
  file_path          TEXT,
  source_attribution TEXT,
  syllabus_year      TEXT,
  reviewer_message   TEXT,
  declaration        BOOLEAN DEFAULT false,
  status             TEXT DEFAULT 'submitted',  -- submitted|under_review|needs_changes|approved|published|rejected|archived
  admin_note         TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  created_by         UUID REFERENCES auth.users(id)
);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON resource_contributions(status);

CREATE TABLE IF NOT EXISTS resource_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_category TEXT,
  exam_name     TEXT,
  stage_or_semester TEXT,
  subject_name  TEXT,
  unit_topic    TEXT,
  resource_type TEXT,
  description   TEXT,
  contact_email TEXT,
  votes         INT DEFAULT 0,
  status        TEXT DEFAULT 'open',    -- open|planned|in_progress|fulfilled|rejected|merged
  fulfilled_by  UUID REFERENCES resources(id) ON DELETE SET NULL,
  admin_note    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  created_by    UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS resource_request_votes (
  request_id  UUID REFERENCES resource_requests(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (request_id, user_id)
);

-- ============================================================
-- 6. REPORTS & TAKEDOWN
-- ============================================================

CREATE TABLE IF NOT EXISTS resource_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id   UUID REFERENCES resources(id) ON DELETE CASCADE,
  reporter_name TEXT,
  reporter_email TEXT,
  reason        TEXT,     -- incorrect_content|outdated|broken_pdf|wrong_category|duplicate|copyright|other
  details       TEXT,
  status        TEXT DEFAULT 'open',   -- open|reviewing|resolved|hidden|dismissed
  admin_note    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  created_by    UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS copyright_takedown_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id       UUID REFERENCES resources(id) ON DELETE CASCADE,
  reporter_name     TEXT NOT NULL,
  reporter_email    TEXT NOT NULL,
  original_work_url TEXT,
  explanation       TEXT,
  good_faith        BOOLEAN DEFAULT false,
  status            TEXT DEFAULT 'open',  -- open|reviewing|clarification|resolved|archived
  decision          TEXT,
  decision_reason   TEXT,
  decided_by        UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. USER ENGAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS user_saved_resources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  list_type   TEXT DEFAULT 'saved_for_later',  -- saved_for_later|revision_list|important
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, resource_id, list_type)
);

CREATE TABLE IF NOT EXISTS user_resource_activity (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  event_type  TEXT,   -- opened|pdf_opened|read|downloaded|saved|shared|reported|explored|completed|next_clicked
  page_from   INT,
  page_to     INT,
  duration_sec INT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activity_user ON user_resource_activity(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_exam_follows (
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id    UUID REFERENCES exams(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, exam_id)
);

CREATE TABLE IF NOT EXISTS user_subject_follows (
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, subject_id)
);

CREATE TABLE IF NOT EXISTS user_topic_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id    UUID REFERENCES topics(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'explored',  -- explored|complete
  explored_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, topic_id)
);

-- Profile preferences
CREATE TABLE IF NOT EXISTS user_exam_preferences (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  target_exams JSONB DEFAULT '[]',
  target_stages JSONB DEFAULT '[]',
  subjects_of_interest JSONB DEFAULT '[]',
  preferred_language TEXT DEFAULT 'English',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_academic_profiles (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  course_id    UUID REFERENCES courses(id) ON DELETE SET NULL,
  major_id     UUID REFERENCES majors(id) ON DELETE SET NULL,
  semester_id  UUID REFERENCES semesters(id) ON DELETE SET NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  new_material         BOOLEAN DEFAULT true,
  material_updated     BOOLEAN DEFAULT true,
  new_pyqs             BOOLEAN DEFAULT true,
  important_questions  BOOLEAN DEFAULT true,
  revision_packs       BOOLEAN DEFAULT true,
  current_affairs      BOOLEAN DEFAULT false,
  email_opt_in         BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT,
  title       TEXT,
  message     TEXT,
  link        TEXT,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

-- ============================================================
-- 8. HOMEPAGE, REVISION MODE, ANALYTICS, AUDIT
-- ============================================================

CREATE TABLE IF NOT EXISTS notes_homepage_sections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  section_type  TEXT NOT NULL,    -- latest|recently_updated|most_saved|most_downloaded|most_viewed|featured|revision_mode|current_affairs|pyq|important_questions|manual
  order_no      INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  manual_resource_ids JSONB DEFAULT '[]',
  auto_criteria JSONB DEFAULT '{}',
  included_categories JSONB DEFAULT '[]',
  max_items     INT DEFAULT 8,
  start_date    TIMESTAMPTZ,
  end_date      TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revision_campaigns (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type     TEXT NOT NULL,    -- exam|stage|subject|course|institution
  scope_id       UUID,
  title          TEXT NOT NULL,
  message        TEXT,
  start_date     TIMESTAMPTZ,
  end_date       TIMESTAMPTZ,
  featured_resource_types JSONB DEFAULT '[]',
  manual_resource_ids JSONB DEFAULT '[]',
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  created_by     UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,      -- notes_search|resource_opened|pdf_reader_opened|pdf_download_clicked|resource_saved|...
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  exam_id    UUID REFERENCES exams(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  payload    JSONB DEFAULT '{}',
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_resource ON analytics_events(resource_id, created_at DESC);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   TEXT,
  before_val  JSONB,
  after_val   JSONB,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_logs(admin_id, created_at DESC);

-- ============================================================
-- 9. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE exam_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_exam_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_request_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE copyright_takedown_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resource_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exam_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subject_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exam_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_academic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes_homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read on taxonomy and published public resources
CREATE POLICY "Public taxonomy read" ON exam_categories FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON exams FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON exam_stages FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON institutions FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON courses FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON majors FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON semesters FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON subject_units FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON topics FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON resource_types FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON resource_languages FOR SELECT USING (true);
CREATE POLICY "Public taxonomy read" ON resource_formats FOR SELECT USING (true);
CREATE POLICY "Public tags read" ON tags FOR SELECT USING (true);

CREATE POLICY "Public published resources read" ON resources
  FOR SELECT USING (is_published = true AND visibility = 'public');

CREATE POLICY "Public joins read" ON resource_exams FOR SELECT USING (true);
CREATE POLICY "Public joins read" ON resource_exam_stages FOR SELECT USING (true);
CREATE POLICY "Public joins read" ON resource_institutions FOR SELECT USING (true);
CREATE POLICY "Public joins read" ON resource_courses FOR SELECT USING (true);
CREATE POLICY "Public joins read" ON resource_semesters FOR SELECT USING (true);
CREATE POLICY "Public joins read" ON resource_subjects FOR SELECT USING (true);
CREATE POLICY "Public joins read" ON resource_units FOR SELECT USING (true);
CREATE POLICY "Public joins read" ON resource_topics FOR SELECT USING (true);
CREATE POLICY "Public joins read" ON resource_tags FOR SELECT USING (true);
CREATE POLICY "Public joins read" ON related_resources FOR SELECT USING (true);

-- Signed-in users read published non-restricted resources
CREATE POLICY "Signed-in resources read" ON resources
  FOR SELECT USING (
    is_published = true AND visibility IN ('public', 'signed_in')
  );

-- Own user data
CREATE POLICY "Own saved resources" ON user_saved_resources
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own activity" ON user_resource_activity
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own follows" ON user_exam_follows
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own follows" ON user_subject_follows
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own progress" ON user_topic_progress
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own prefs" ON user_exam_preferences
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own academic" ON user_academic_profiles
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own notif prefs" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Public read on open requests
CREATE POLICY "Public requests read" ON resource_requests FOR SELECT USING (true);
CREATE POLICY "Own votes" ON resource_request_votes
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public contributions read" ON resource_contributions FOR SELECT USING (true);
CREATE POLICY "Public reports read" ON resource_reports FOR SELECT USING (true);
CREATE POLICY "Public takedown read" ON copyright_takedown_requests FOR SELECT USING (true);
CREATE POLICY "Public homepage read" ON notes_homepage_sections FOR SELECT USING (true);
CREATE POLICY "Public revision read" ON revision_campaigns FOR SELECT USING (true);

-- Authenticated insert for engagement (rows scoped to the actor)
CREATE POLICY "Create own activity" ON user_resource_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Create own saved" ON user_saved_resources FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Create own follows" ON user_exam_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Create own follows" ON user_subject_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Create own progress" ON user_topic_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Create contribution" ON resource_contributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Create request" ON resource_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Create vote" ON resource_request_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Create report" ON resource_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Create takedown" ON copyright_takedown_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Create notif prefs" ON notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Create academic" ON user_academic_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Create exam prefs" ON user_exam_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins full access (role column on profiles; use helper)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT role IN ('SUPER_ADMIN','NOTES_ADMIN','CONTENT_REVIEWER','SUPPORT_ADMIN','ANALYST')
     FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql STABLE;

CREATE POLICY "Admin taxonomy write" ON exam_categories FOR ALL USING (is_admin());
CREATE POLICY "Admin taxonomy write" ON exams FOR ALL USING (is_admin());
CREATE POLICY "Admin taxonomy write" ON exam_stages FOR ALL USING (is_admin());
CREATE POLICY "Admin taxonomy write" ON institutions FOR ALL USING (is_admin());
CREATE POLICY "Admin taxonomy write" ON courses FOR ALL USING (is_admin());
CREATE POLICY "Admin taxonomy write" ON majors FOR ALL USING (is_admin());
CREATE POLICY "Admin taxonomy write" ON semesters FOR ALL USING (is_admin());
CREATE POLICY "Admin taxonomy write" ON subjects FOR ALL USING (is_admin());
CREATE POLICY "Admin taxonomy write" ON subject_units FOR ALL USING (is_admin());
CREATE POLICY "Admin taxonomy write" ON topics FOR ALL USING (is_admin());
CREATE POLICY "Admin write" ON resource_types FOR ALL USING (is_admin());
CREATE POLICY "Admin write" ON resource_languages FOR ALL USING (is_admin());
CREATE POLICY "Admin write" ON resource_formats FOR ALL USING (is_admin());
CREATE POLICY "Admin resources write" ON resources FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON resource_exams FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON resource_exam_stages FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON resource_institutions FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON resource_courses FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON resource_semesters FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON resource_subjects FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON resource_units FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON resource_topics FOR ALL USING (is_admin());
CREATE POLICY "Admin tags write" ON tags FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON resource_tags FOR ALL USING (is_admin());
CREATE POLICY "Admin files write" ON resource_files FOR ALL USING (is_admin());
CREATE POLICY "Admin versions write" ON resource_versions FOR ALL USING (is_admin());
CREATE POLICY "Admin joins write" ON related_resources FOR ALL USING (is_admin());
CREATE POLICY "Admin contributions write" ON resource_contributions FOR ALL USING (is_admin());
CREATE POLICY "Admin requests write" ON resource_requests FOR ALL USING (is_admin());
CREATE POLICY "Admin votes write" ON resource_request_votes FOR ALL USING (is_admin());
CREATE POLICY "Admin reports write" ON resource_reports FOR ALL USING (is_admin());
CREATE POLICY "Admin takedown write" ON copyright_takedown_requests FOR ALL USING (is_admin());
CREATE POLICY "Admin homepage write" ON notes_homepage_sections FOR ALL USING (is_admin());
CREATE POLICY "Admin revision write" ON revision_campaigns FOR ALL USING (is_admin());
CREATE POLICY "Admin analytics read" ON analytics_events FOR SELECT USING (is_admin());
CREATE POLICY "Admin audit read" ON admin_audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "Admin audit write" ON admin_audit_logs FOR INSERT WITH CHECK (is_admin());

-- ============================================================
-- 10. FULL-TEXT SEARCH
-- ============================================================

ALTER TABLE resources ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS idx_resources_search ON resources USING GIN (search_vector);

CREATE OR REPLACE FUNCTION resources_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.short_desc, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.long_desc, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.search_keywords, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_resources_search ON resources;
CREATE TRIGGER trg_resources_search
  BEFORE INSERT OR UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION resources_search_update();

-- ============================================================
-- 11. STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('resources-public', 'resources-public', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources-private', 'resources-private', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-thumbnails', 'resource-thumbnails', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public)
VALUES ('contribution-uploads', 'contribution-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Public bucket read for public/thumbnails
CREATE POLICY "Public thumbnails read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('resource-thumbnails', 'resources-public'));
-- Admin write to public buckets
CREATE POLICY "Admin thumbnails write" ON storage.objects
  FOR ALL USING (bucket_id IN ('resource-thumbnails', 'resources-public') AND is_admin());
-- Private/contribution buckets: only admins (or owner) read/write
CREATE POLICY "Admin private write" ON storage.objects
  FOR ALL USING (bucket_id IN ('resources-private', 'contribution-uploads') AND is_admin());
CREATE POLICY "Owner contribution read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'contribution-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- 12. PROFILES ROLE EXTENSION
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'English';

-- ============================================================
-- 13. DEFAULT TAXONOMY SEED (types/languages/formats)
-- ============================================================

INSERT INTO resource_types (name, slug, sort_order) VALUES
  ('Topic notes','topic-notes',1),
  ('Unit notes','unit-notes',2),
  ('Short notes','short-notes',3),
  ('Revision notes','revision-notes',4),
  ('Formula sheet','formula-sheet',5),
  ('Important questions','important-questions',6),
  ('Previous year questions','previous-year-questions',7),
  ('Model answers','model-answers',8),
  ('Practice worksheet','practice-worksheet',9),
  ('Syllabus','syllabus',10),
  ('Exam pattern','exam-pattern',11),
  ('Study plan','study-plan',12),
  ('Current affairs PDF','current-affairs-pdf',13),
  ('Static GK PDF','static-gk-pdf',14),
  ('Handwritten notes','handwritten-notes',15),
  ('Typed notes','typed-notes',16),
  ('Slides','slides',17),
  ('Practical notes','practical-notes',18),
  ('Viva questions','viva-questions',19),
  ('Assignments','assignments',20),
  ('Lab manual','lab-manual',21),
  ('Other','other',99)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO resource_languages (name, slug) VALUES
  ('English','english'),('Odia','odia'),('Hindi','hindi'),('Bengali','bengali'),
  ('Telugu','telugu'),('Tamil','tamil'),('Other','other')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO resource_formats (name, slug) VALUES
  ('Typed PDF','typed-pdf'),('Handwritten PDF','handwritten-pdf'),('Scanned PDF','scanned-pdf'),
  ('Slides','slides'),('Worksheet','worksheet'),('Other','other')
ON CONFLICT (slug) DO NOTHING;
