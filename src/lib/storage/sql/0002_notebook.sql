-- Mathia esquema v2 — cuaderno de notas del kit de estudio (BR-NOTE-*)
CREATE TABLE IF NOT EXISTS notebook_entries (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('global','unit','lesson')),
  scope_id TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('text','drawing')),
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notebook_scope
  ON notebook_entries(profile_id, scope_type, scope_id);
