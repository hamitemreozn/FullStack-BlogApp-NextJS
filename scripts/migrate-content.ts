import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL must be set before applying content migrations.",
  );
}

const migrationsDirectory = join(process.cwd(), "database", "migrations");
const client = new Client({ connectionString });

await client.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS app_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const migrationNames = (await readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const migrationName of migrationNames) {
    const applied = await client.query<{ name: string }>(
      "SELECT name FROM app_migrations WHERE name = $1",
      [migrationName],
    );

    if (applied.rowCount) {
      continue;
    }

    const sql = await readFile(
      join(migrationsDirectory, migrationName),
      "utf8",
    );

    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO app_migrations (name) VALUES ($1)", [
        migrationName,
      ]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
} finally {
  await client.end();
}
