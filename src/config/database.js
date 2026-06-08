import 'dotenv/config';
import {neon, neonConfig} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const databaseHost = new URL(databaseUrl).hostname;
const isNeonLocal =
  process.env.NEON_LOCAL === 'true' ||
  databaseHost === 'neon-local' ||
  databaseHost === 'localhost' ||
  databaseHost === '127.0.0.1';

if (isNeonLocal) {
  neonConfig.fetchEndpoint =
    process.env.NEON_LOCAL_HTTP_ENDPOINT || `http://${databaseHost}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(databaseUrl);

const db = drizzle(sql);

export { db, sql};
