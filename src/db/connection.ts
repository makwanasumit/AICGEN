// ❌ DO NOT put "use server" here

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
  // ssl: { rejectUnauthorized: false }, // optional
});

export const db = drizzle(pool);
