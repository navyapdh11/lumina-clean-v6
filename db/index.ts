import * as schema from './schema';

// Initialize PlanetScale connection lazily to avoid build-time errors
// and handle missing DATABASE_URL gracefully
let _db: Awaited<ReturnType<typeof createDb>> | null = null;

function createDb() {
  if (!process.env.DATABASE_URL) {
    console.warn('[Database] DATABASE_URL not set — database operations will be unavailable');
    return null;
  }

  try {
    const { drizzle } = require('drizzle-orm/planetscale-serverless');
    const { Client } = require('@planetscale/database');
    const client = new Client({
      url: process.env.DATABASE_URL,
    });
    return drizzle(client, { schema });
  } catch (error) {
    console.error('[Database] Failed to initialize database:', error);
    return null;
  }
}

export function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

// Safe db export — null if not configured, never crashes
export const db = getDb();

// Type-safe database access helper
export function requireDb() {
  const database = getDb();
  if (!database) {
    throw new Error('Database is not configured. Set DATABASE_URL environment variable.');
  }
  return database;
}
