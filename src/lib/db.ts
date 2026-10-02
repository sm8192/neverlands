import "server-only";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local");
}

// Neon's serverless driver. `sql` is a tagged-template query function that is
// safe against SQL injection — interpolated values are sent as parameters.
export const sql = neon(process.env.DATABASE_URL);

export type UserRow = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};

let schemaReady: Promise<void> | null = null;

/**
 * Ensures the `users` table exists. Runs once per server instance.
 * Safe to call on every request — the CREATE TABLE is idempotent and the
 * result is memoized so the round-trip only happens on the first call.
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id            SERIAL PRIMARY KEY,
          username      TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })().catch((err) => {
      // Reset so a later request can retry if the first attempt failed.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}
