ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS source_fingerprint char(64);

UPDATE comments SET author_name = 'Misafir' WHERE author_name IS NULL;

ALTER TABLE comments
  ALTER COLUMN author_name SET NOT NULL;

ALTER TABLE comments
  ADD CONSTRAINT comments_author_name_length
  CHECK (char_length(author_name) BETWEEN 1 AND 80);

CREATE TABLE IF NOT EXISTS comment_rate_limits (
  fingerprint char(64) PRIMARY KEY,
  window_started_at timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 1 CHECK (request_count >= 1),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_moderation_index
  ON comments (status, created_at ASC)
  WHERE status = 'PENDING';
