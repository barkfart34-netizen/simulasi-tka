-- Simulasi TKA D1 Database Schema
-- Migration 0001: Core tables for settings, exam sessions, security violations, and rate limiting

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  nisn TEXT NOT NULL,
  student_name TEXT NOT NULL,
  school_class TEXT NOT NULL,
  package_type TEXT NOT NULL,
  token_used TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  question_order_json TEXT NOT NULL,
  answers_json TEXT NOT NULL DEFAULT '{}',
  flags_json TEXT NOT NULL DEFAULT '{}',
  current_index INTEGER NOT NULL DEFAULT 0,
  answered_count INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL,
  violation_count INTEGER NOT NULL DEFAULT 0,
  max_violations INTEGER NOT NULL DEFAULT 3,
  score_total REAL,
  score_literasi REAL,
  score_numerasi REAL,
  predicate TEXT,
  evaluation_json TEXT,
  started_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  submitted_at INTEGER,
  last_seen_at INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_nisn ON sessions(nisn);

CREATE TABLE IF NOT EXISTS violations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  nisn TEXT NOT NULL,
  event_type TEXT NOT NULL,
  detail TEXT,
  ip_address TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_violations_session_id ON violations(session_id);
CREATE INDEX IF NOT EXISTS idx_violations_created_at ON violations(created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES
  ('exam_token', 'TKA26A', 1764068400000),
  ('exam_locked', '0', 1764068400000),
  ('max_violations', '3', 1764068400000),
  ('show_review_to_student', '1', 1764068400000),
  ('duration_literasi_sec', '1800', 1764068400000),
  ('duration_numerasi_sec', '2100', 1764068400000),
  ('duration_lengkap_sec', '3600', 1764068400000),
  ('exam_title', 'SIMULASI TKA NASIONAL 2026', 1764068400000);
