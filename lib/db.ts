import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Vercel's Neon Postgres Marketplace integration auto-injects DATABASE_URL.
const url = process.env.DATABASE_URL;

let _sql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> | null {
  if (!url) return null;
  if (!_sql) _sql = neon(url);
  return _sql;
}
