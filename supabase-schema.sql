-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/sjqpzktnqoycuqjzjmkd/sql/new)

-- Exams
CREATE TABLE exams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  full_name TEXT,
  category TEXT,
  description TEXT,
  icon TEXT,
  question_count INT DEFAULT 0,
  test_count INT DEFAULT 0,
  note_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tests
CREATE TABLE tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  exam_id TEXT REFERENCES exams(id),
  stage TEXT,
  test_type TEXT,
  duration INT,
  total_marks INT,
  question_count INT,
  difficulty TEXT,
  is_free BOOLEAN DEFAULT false,
  negative_mark FLOAT,
  attempt_count INT DEFAULT 0,
  category TEXT,
  position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  answer TEXT NOT NULL,
  subject_id TEXT,
  difficulty TEXT DEFAULT 'medium',
  exam_id TEXT,
  year INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attempts
CREATE TABLE attempts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  test_id TEXT REFERENCES tests(id),
  answers JSONB,
  score FLOAT,
  total_marks FLOAT,
  accuracy FLOAT,
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

-- Subjects
CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  exam_id TEXT REFERENCES exams(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans
CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price FLOAT NOT NULL,
  duration INT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id TEXT,
  question_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (syncs with auth.users via trigger)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  avatar TEXT,
  target_exam TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables
CREATE POLICY "Public read access" ON exams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tests FOR SELECT USING (true);
CREATE POLICY "Public read access" ON questions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON plans FOR SELECT USING (true);

-- Users can only see/update own attempts
CREATE POLICY "Users manage own attempts" ON attempts
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see/update own bookmarks
CREATE POLICY "Users manage own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- Users can see/update own profile
CREATE POLICY "Users manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);
