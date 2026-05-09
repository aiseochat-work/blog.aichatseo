import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { ensurePostsSchema } from '../lib/ensure-posts-columns';
import * as schema from './schema';


const sql = neon(import.meta.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export type AppDatabase = typeof db;

let schemaReady: Promise<void> | undefined;

export function ensureDatabaseReady() {
  schemaReady ??= ensurePostsSchema(db);
  return schemaReady;
}
