-- Run AFTER the schema migration in Supabase SQL Editor

-- Exams
INSERT INTO exams (id, name, slug, full_name, category, description, icon, question_count, test_count, note_count) VALUES
('ossc', 'OSSC', 'ossc', 'Odisha Staff Selection Commission', 'State-Level', 'OSSC conducts various recruitment exams for Group B and Group C posts.', 'Building2', 500, 200, 80),
('osssc', 'OSSSC', 'osssc', 'Odisha Sub-ordinate Staff Selection Commission', 'State-Level', 'OSSSC conducts recruitment for various subordinate posts.', 'Users', 300, 120, 50),
('opsc', 'OPSC', 'opsc', 'Odisha Public Service Commission', 'State-Level', 'OPSC conducts civil services and other gazetted posts exams.', 'Shield', 400, 80, 60),
('ssb', 'SSB Odisha', 'ssb', 'Odisha School Education & Teacher Eligibility Boards', 'Teaching', 'SSB Odisha manages teacher recruitment.', 'GraduationCap', 200, 60, 40),
('odisha-police', 'Odisha Police', 'odisha-police', 'Odisha Police Recruitment', 'Police & Security', 'Police constable, SI and other departmental exams.', 'Shield', 350, 90, 30),
('odisha-teaching', 'Odisha Teaching', 'odisha-teaching', 'Odisha Teaching Recruitment', 'Teaching', 'Teaching recruitment exams across Odisha.', 'BookOpen', 150, 40, 35),
('odisha-universities', 'Odisha Universities', 'odisha-universities', 'Odisha University Entrance Exams', 'University Entrance', 'University entrance exams in Odisha.', 'University', 100, 30, 20),
('other', 'Other Competitive', 'other', 'Other Competitive Exams in Odisha', 'Other', 'Other competitive exams relevant to Odisha.', 'Award', 80, 25, 15);

-- Tests
INSERT INTO tests (id, title, slug, description, exam_id, stage, test_type, duration, total_marks, question_count, difficulty, is_free, negative_mark, attempt_count, category, position, is_active) VALUES
('1', 'OSSC CGL Prelims Full Mock 1', 'ossc-cgl-prelims-full-mock-1', 'Full-length mock test covering all sections as per OSSC CGL Prelims pattern.', 'ossc', 'Prelims', 'full-mock', 120, 200, 100, 'medium', true, null, 1245, 'Pre-Exam', 1, true),
('2', 'OSSC CGL Prelims Full Mock 2', 'ossc-cgl-prelims-full-mock-2', 'Second full mock with updated question bank for OSSC CGL Prelims.', 'ossc', 'Prelims', 'full-mock', 120, 200, 100, 'hard', true, 0.25, 987, 'Pre-Exam', 2, true),
('3', 'OSSC CGL Mains Full Mock 1', 'ossc-cgl-mains-full-mock-1', 'Full-length mains mock test with descriptive and objective sections.', 'ossc', 'Mains', 'full-mock', 180, 300, 120, 'hard', false, null, 654, 'Mains', 1, true),
('4', 'OSSC CGL Mains Full Mock 2', 'ossc-cgl-mains-full-mock-2', 'Advanced mains mock with detailed solutions.', 'ossc', 'Mains', 'full-mock', 180, 300, 120, 'hard', false, 0.5, 432, 'Mains', 2, true),
('5', 'OSSC Arithmetic Sectional', 'ossc-arithmetic-sectional', 'Sectional test focusing on Arithmetic for OSSC exams.', 'ossc', 'Prelims', 'sectional', 30, 50, 25, 'easy', true, null, 2100, 'Pre-Exam', 1, true),
('6', 'OSSC Reasoning Sectional', 'ossc-reasoning-sectional', 'Sectional test covering logical reasoning for OSSC.', 'ossc', 'Prelims', 'sectional', 30, 50, 25, 'medium', true, null, 1876, 'Pre-Exam', 2, true),
('7', 'OSSC Current Affairs Topic-wise', 'ossc-current-affairs-topic', 'Topic-wise test covering current affairs for Odisha exams.', 'ossc', 'Prelims', 'topic-wise', 20, 30, 15, 'easy', true, null, 3210, 'Pre-Exam', 1, true),
('8', 'OSSC CGL 2022 PYQ Test', 'ossc-cgl-2022-pyq', 'Previous year questions from OSSC CGL 2022 exam.', 'ossc', 'Prelims', 'pyq-test', 60, 100, 50, 'medium', true, 0.25, 5432, 'Pre-Exam', 1, true),
('9', 'OSSC CGL 2021 PYQ Test', 'ossc-cgl-2021-pyq', 'Previous year questions from OSSC CGL 2021 exam.', 'ossc', 'Prelims', 'pyq-test', 60, 100, 50, 'medium', false, 0.25, 4123, 'Pre-Exam', 2, true),
('10', 'Daily Current Affairs Quiz #1', 'daily-current-affairs-1', 'Daily quiz on current affairs for Odisha exams.', 'ossc', 'Prelims', 'daily-challenge', 10, 15, 10, 'easy', true, null, 890, 'Pre-Exam', 1, true),
('11', 'OSSSC Prelims Full Mock 1', 'osssc-prelims-full-mock-1', 'Full mock for OSSSC Prelims with latest pattern.', 'osssc', 'Prelims', 'full-mock', 120, 200, 100, 'medium', true, 0.25, 876, 'Pre-Exam', 1, true),
('12', 'OSSSC Mains Mock 1', 'osssc-mains-mock-1', 'Mains mock test for OSSSC with descriptive answers.', 'osssc', 'Mains', 'full-mock', 180, 300, 120, 'hard', false, null, 543, 'Mains', 1, true),
('13', 'OSSSC Odia Language Sectional', 'osssc-odia-sectional', 'Sectional test for Odia language proficiency.', 'osssc', 'Prelims', 'sectional', 20, 40, 20, 'easy', true, null, 1654, 'Pre-Exam', 1, true),
('14', 'OPSC Prelims GS Full Mock 1', 'opsc-prelims-gs-mock-1', 'Full mock for OPSC Prelims General Studies.', 'opsc', 'Prelims', 'full-mock', 120, 200, 100, 'hard', false, 0.33, 1234, 'Pre-Exam', 1, true),
('15', 'OPSC Prelims GS Mock 2', 'opsc-prelims-gs-mock-2', 'Second OPSC Prelims GS mock with updated syllabus.', 'opsc', 'Prelims', 'full-mock', 120, 200, 100, 'hard', false, 0.33, 987, 'Pre-Exam', 2, true),
('16', 'OPSC CSAT Sectional', 'opsc-csat-sectional', 'CSAT comprehension and reasoning sectional.', 'opsc', 'Prelims', 'sectional', 40, 60, 30, 'medium', true, null, 765, 'Pre-Exam', 1, true),
('17', 'SSB Odisha Prelims Mock', 'ssb-odisha-prelims-mock', 'SSB Odisha teacher eligibility mock test.', 'ssb', 'Prelims', 'full-mock', 120, 150, 75, 'medium', true, 0.25, 2345, 'Pre-Exam', 1, true),
('18', 'SSB Pedagogy Sectional', 'ssb-pedagogy-sectional', 'Sectional on teaching pedagogy for SSB.', 'ssb', 'Prelims', 'sectional', 25, 40, 20, 'easy', true, null, 1800, 'Pre-Exam', 1, true),
('19', 'Odisha Police SI Prelims Mock', 'odisha-police-si-prelims-mock', 'SI prelims mock with law and general knowledge sections.', 'odisha-police', 'Prelims', 'full-mock', 90, 150, 100, 'medium', true, 0.25, 3100, 'Pre-Exam', 1, true),
('20', 'Odisha Police Constable Mock', 'odisha-police-constable-mock', 'Constable recruitment mock test.', 'odisha-police', 'Prelims', 'full-mock', 60, 100, 80, 'easy', true, null, 4500, 'Pre-Exam', 1, true),
('21', 'Odisha Police GK Sectional', 'odisha-police-gk-sectional', 'General knowledge sectional for police exams.', 'odisha-police', 'Prelims', 'sectional', 20, 30, 20, 'easy', true, null, 2900, 'Pre-Exam', 1, true),
('22', 'Teaching Aptitude Mock', 'teaching-aptitude-mock', 'Teaching aptitude test for Odisha teaching exams.', 'odisha-teaching', 'Prelims', 'full-mock', 90, 100, 50, 'medium', true, null, 1200, 'Pre-Exam', 1, true),
('23', 'Utkal University PG Entrance Mock', 'utkal-university-pg-mock', 'PG entrance mock for Utkal University.', 'odisha-universities', 'Prelims', 'full-mock', 120, 150, 75, 'hard', false, 0.25, 456, 'Pre-Exam', 1, true),
('24', 'OUAT Entrance Mock', 'ouat-entrance-mock', 'OUAT agriculture entrance mock test.', 'odisha-universities', 'Prelims', 'full-mock', 120, 150, 75, 'medium', true, 0.25, 678, 'Pre-Exam', 1, true),
('25', 'ICAR ARS Prelims Mock', 'icar-ars-prelims-mock', 'ICAR ARS prelims mock for Odisha agriculture officers.', 'other', 'Prelims', 'full-mock', 120, 200, 100, 'hard', false, 0.33, 345, 'Pre-Exam', 1, true),
('26', 'CTET Odisha Mock', 'ctet-odisha-mock', 'CTET paper 1 mock for Odisha teaching aspirants.', 'other', 'Prelims', 'full-mock', 150, 150, 90, 'medium', true, null, 2100, 'Pre-Exam', 1, true),
('27', 'OPSC OCS Prelims GS PYQ 2023', 'opsc-ocs-prelims-gs-pyq-2023', 'Previous year GS paper from OPSC OCS Prelims 2023.', 'opsc', 'Prelims', 'pyq-test', 120, 200, 100, 'hard', true, 0.33, 3200, 'Pre-Exam', 1, true),
('28', 'OPSC OCS Prelims GS PYQ 2022', 'opsc-ocs-prelims-gs-pyq-2022', 'Previous year GS paper from OPSC OCS Prelims 2022.', 'opsc', 'Prelims', 'pyq-test', 120, 200, 100, 'hard', true, 0.33, 2800, 'Pre-Exam', 2, true),
('29', 'OPSC OCS Mains GS Paper 1 PYQ 2022', 'opsc-ocs-mains-gs1-pyq-2022', 'Previous year GS Paper 1 from OPSC OCS Mains 2022.', 'opsc', 'Mains', 'pyq-test', 180, 250, 10, 'hard', false, null, 1200, 'Mains', 1, true);

-- Questions
INSERT INTO questions (id, text, options, answer, subject_id, difficulty, exam_id, year) VALUES
('1', 'Who was the first Chief Minister of Odisha?', '["Harekrushna Mahatab", "Biju Patnaik", "Nandini Satpathy", "Janaki Ballabh Patnaik"]', 'Harekrushna Mahatab', 'odisha-history', 'easy', 'ossc', 2022),
('2', 'Which river is known as the "Sorrow of Odisha"?', '["Mahanadi", "Brahmani", "Baitarani", "Rushikulya"]', 'Baitarani', 'odisha-geography', 'easy', 'ossc', 2022),
('3', 'What is the state animal of Odisha?', '["Tiger", "Elephant", "Sambar", "Chital"]', 'Elephant', 'general-knowledge', 'easy', 'ossc', 2021);

-- Plans
INSERT INTO plans (id, name, price, duration, features, is_active) VALUES
('1', 'Free', 0, 30, '["10 tests/month", "Basic analytics"]', true),
('2', 'Pro Monthly', 249, 30, '["Unlimited tests", "Detailed analytics", "All mock tests", "Priority support"]', true);
