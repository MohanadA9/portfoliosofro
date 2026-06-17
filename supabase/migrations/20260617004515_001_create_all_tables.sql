-- Professor profile table (single row)
CREATE TABLE professor (
  id TEXT PRIMARY KEY DEFAULT 'prof-1',
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT,
  university TEXT,
  email TEXT,
  phone TEXT,
  office TEXT,
  office_hours TEXT,
  address TEXT,
  cv TEXT,
  avatar TEXT,
  socials JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About page (single row)
CREATE TABLE about (
  id TEXT PRIMARY KEY DEFAULT 'about-1',
  bio TEXT,
  vision TEXT,
  skills JSONB DEFAULT '[]',
  interests JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (single row)
CREATE TABLE settings (
  id TEXT PRIMARY KEY DEFAULT 'settings-1',
  doctor_name TEXT,
  icon TEXT,
  favicon TEXT,
  password TEXT DEFAULT 'password',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education
CREATE TABLE education (
  id SERIAL PRIMARY KEY,
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  year TEXT,
  focus TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  cover TEXT,
  date TEXT,
  category TEXT,
  live_link TEXT,
  gallery JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences
CREATE TABLE experiences (
  id TEXT PRIMARY KEY,
  position TEXT NOT NULL,
  organization TEXT NOT NULL,
  from_year TEXT,
  to_year TEXT,
  description TEXT,
  responsibilities JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Positions
CREATE TABLE positions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Researches
CREATE TABLE researches (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER,
  abstract TEXT,
  authors JSONB DEFAULT '[]',
  keywords JSONB DEFAULT '[]',
  journal TEXT,
  conference TEXT,
  doi TEXT,
  link TEXT,
  pdf TEXT,
  cover TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  objectives JSONB DEFAULT '[]',
  cover TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lectures (nested under courses)
CREATE TABLE lectures (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  pdf TEXT,
  video_url TEXT,
  youtube_url TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blogs
CREATE TABLE blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  date TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auth users table (for admin login)
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTP tokens table (for password reset flow)
CREATE TABLE otp_tokens (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  token TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE professor ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE researches ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_tokens ENABLE ROW LEVEL SECURITY;

-- Public read policies (portfolio pages need to read data without auth)
CREATE POLICY "public_read_professor" ON professor FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_about" ON about FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_settings" ON settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_education" ON education FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_achievements" ON achievements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_positions" ON positions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_researches" ON researches FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_courses" ON courses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_lectures" ON lectures FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_blogs" ON blogs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_messages" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin write policies (authenticated users can do everything)
CREATE POLICY "admin_all_professor" ON professor FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_about" ON about FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_settings" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_education" ON education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_achievements" ON achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_experiences" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_positions" ON positions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_researches" ON researches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_courses" ON courses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_lectures" ON lectures FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_blogs" ON blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_read_messages" ON messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_update_messages" ON messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_messages" ON messages FOR DELETE TO authenticated USING (true);

-- Admin users: allow anon read (for login) and authenticated read
CREATE POLICY "anon_read_admin_users" ON admin_users FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_admin_users" ON admin_users FOR INSERT TO authenticated WITH CHECK (true);

-- OTP tokens: anyone can insert and read (for verification flow)
CREATE POLICY "public_otp_insert" ON otp_tokens FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_otp_read" ON otp_tokens FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_otp_update" ON otp_tokens FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
