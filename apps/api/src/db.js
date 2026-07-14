import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS domains (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      hostname TEXT NOT NULL,
      dkim_selector TEXT NOT NULL DEFAULT 'default',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mailboxes (
      id SERIAL PRIMARY KEY,
      domain_id INTEGER NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
      local_part TEXT NOT NULL,
      display_name TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(domain_id, local_part)
    );
  `);
}
