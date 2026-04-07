import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { Client } from '@planetscale/database';
import * as schema from './schema';

// Initialize PlanetScale connection with Client instance
let _db: any = null;

export function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    const client = new Client({
      url: process.env.DATABASE_URL,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

// Named export for convenience
export const db = getDb();
