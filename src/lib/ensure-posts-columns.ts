import type { AppDatabase } from '../db';
import { sql } from 'drizzle-orm';

/**
 * Idempotent DDL for Neon/Postgres so a fresh or older database can serve the blog.
 * Migrations are still preferred in CI, but this protects Cloudflare deploys from schema drift.
 */
export async function ensurePostsSchema(db: AppDatabase) {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS posts (
      id serial PRIMARY KEY,
      title varchar(255) NOT NULL,
      slug varchar(255) NOT NULL,
      content text NOT NULL,
      excerpt text,
      meta_description text,
      cover_image varchar(512),
      author varchar(255),
      tags text[],
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    )
  `);

  await db.execute(sql`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS title varchar(255),
    ADD COLUMN IF NOT EXISTS slug varchar(255),
    ADD COLUMN IF NOT EXISTS content text,
    ADD COLUMN IF NOT EXISTS excerpt text,
    ADD COLUMN IF NOT EXISTS meta_description text,
    ADD COLUMN IF NOT EXISTS cover_image varchar(512),
    ADD COLUMN IF NOT EXISTS author varchar(255),
    ADD COLUMN IF NOT EXISTS tags text[],
    ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now()
  `);

  await db.execute(sql`
    ALTER TABLE posts
    ALTER COLUMN title TYPE varchar(255),
    ALTER COLUMN slug TYPE varchar(255),
    ALTER COLUMN cover_image TYPE varchar(512),
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN updated_at SET DEFAULT now()
  `);

  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique ON posts (slug)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at DESC)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS posts_updated_at_idx ON posts (updated_at DESC)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS posts_tags_idx ON posts USING GIN (tags)`);

  await db.execute(sql`
    CREATE OR REPLACE FUNCTION set_posts_updated_at()
    RETURNS trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `);

  await db.execute(sql`DROP TRIGGER IF EXISTS posts_set_updated_at ON posts`);
  await db.execute(sql`
    CREATE TRIGGER posts_set_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION set_posts_updated_at()
  `);
}
