import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env as workerEnv } from 'cloudflare:workers';
import { ensurePostsSchema } from '../lib/ensure-posts-columns';
import * as schema from './schema';

function databaseUrl(): string {
  const fromBinding =
    typeof workerEnv.DATABASE_URL === 'string' && workerEnv.DATABASE_URL.length > 0
      ? workerEnv.DATABASE_URL
      : undefined;
  const fromProcess =
    typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.length > 0
      ? process.env.DATABASE_URL
      : undefined;
  const url = fromBinding ?? fromProcess;
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
