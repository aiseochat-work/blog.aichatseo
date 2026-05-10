import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { ensurePostsSchema } from '../lib/ensure-posts-columns';
import * as schema from './schema';

function databaseUrl(): string {
  // On Cloudflare Workers the binding is surfaced via globalThis.__env__ (set by
  // the Cloudflare adapter) or via process.env locally.
  const cfEnv = (globalThis as Record<string, unknown>).__env__ as
    | Record<string, string>
    | undefined;

  const fromBinding =
    typeof cfEnv?.DATABASE_URL === 'string' && cfEnv.DATABASE_URL.length > 0
      ? cfEnv.DATABASE_URL
      : undefined;

  // Vite populates import.meta.env from .env / .env.local during local dev
  const fromViteEnv =
    typeof import.meta.env?.DATABASE_URL === 'string' &&
    import.meta.env.DATABASE_URL.length > 0
      ? import.meta.env.DATABASE_URL
      : undefined;

  const url = fromBinding ?? fromViteEnv;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. On Workers: Dashboard → Variables & Secrets → add DATABASE_URL, or run `wrangler secret put DATABASE_URL`. Locally: add DATABASE_URL to `.env`.'
    );
  }
  return url;
}

const sql = neon(databaseUrl());
export const db = drizzle(sql, { schema });
export type AppDatabase = typeof db;

let schemaReady: Promise<void> | undefined;

export function ensureDatabaseReady() {
  schemaReady ??= ensurePostsSchema(db);
  return schemaReady;
}
