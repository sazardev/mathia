-- Mathia esquema v1 (BUSINESS-RULES.md M1/M5/M6/M7/M9)
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  avatar INTEGER NOT NULL DEFAULT 0 CHECK (avatar BETWEEN 0 AND 11),
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  mastery INTEGER NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 100),
  state TEXT NOT NULL DEFAULT 'locked'
    CHECK (state IN ('locked','unlocked','in_progress','completed','needs_review')),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (profile_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS srs_queue (
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  interval_days INTEGER NOT NULL DEFAULT 1 CHECK (interval_days > 0),
  due_at INTEGER NOT NULL,
  PRIMARY KEY (profile_id, exercise_id)
);

CREATE TABLE IF NOT EXISTS daily_log (
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  goal_met INTEGER NOT NULL DEFAULT 0 CHECK (goal_met IN (0,1)),
  PRIMARY KEY (profile_id, day)
);

CREATE TABLE IF NOT EXISTS achievements (
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at INTEGER NOT NULL,
  PRIMARY KEY (profile_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS settings (
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (profile_id, key)
);

INSERT OR IGNORE INTO meta(key, value) VALUES ('schema_version', '1');
