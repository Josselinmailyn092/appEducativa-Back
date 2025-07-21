import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'appEducativa',
  password: process.env.DB_PASSWORD || 'Jossel:09280',
  port: process.env.DB_PORT || 5432,
});

export { pool };