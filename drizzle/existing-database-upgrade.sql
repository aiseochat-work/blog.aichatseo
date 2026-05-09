-- Use this on an existing `posts` table that was created before meta_description, author, tags,
-- and the wider cover_image column. Safe to run multiple times (IF NOT EXISTS / idempotent widen).
-- New projects can use `drizzle-kit migrate` with the generated migration instead.

ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author varchar(255);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags text[];

ALTER TABLE posts
  ALTER COLUMN cover_image TYPE varchar(512);

CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique ON posts (slug);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS posts_updated_at_idx ON posts (updated_at DESC);
CREATE INDEX IF NOT EXISTS posts_tags_idx ON posts USING GIN (tags);

CREATE OR REPLACE FUNCTION set_posts_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_set_updated_at ON posts;
CREATE TRIGGER posts_set_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION set_posts_updated_at();
