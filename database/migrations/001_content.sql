CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  CREATE TYPE post_status AS ENUM ('DRAFT', 'PUBLISHED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE comment_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),
  image_key text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  excerpt text NOT NULL DEFAULT '' CHECK (char_length(excerpt) <= 500),
  content jsonb NOT NULL DEFAULT '{"type":"doc","content":[]}'::jsonb,
  cover_image_key text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  author_id text NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
  status post_status NOT NULL DEFAULT 'DRAFT',
  published_at timestamptz,
  view_count bigint NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status = 'DRAFT' AND published_at IS NULL) OR (status = 'PUBLISHED' AND published_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS posts_publication_index
  ON posts (status, published_at DESC)
  WHERE status = 'PUBLISHED';

CREATE INDEX IF NOT EXISTS posts_category_publication_index
  ON posts (category_id, published_at DESC)
  WHERE status = 'PUBLISHED';

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id text REFERENCES "user"(id) ON DELETE SET NULL,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  status comment_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_visible_post_index
  ON comments (post_id, created_at DESC)
  WHERE status = 'APPROVED';
