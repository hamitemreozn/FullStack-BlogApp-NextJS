import "server-only";

import { ColumnType, Generated, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { env } from "@/lib/env";

type OptionalNullableString = ColumnType<
  string | null,
  string | null | undefined,
  string | null | undefined
>;
type OptionalTimestamp = ColumnType<
  Date | null,
  Date | string | null | undefined,
  Date | string | null | undefined
>;

export interface Database {
  categories: {
    id: Generated<string>;
    slug: string;
    title: string;
    image_key: OptionalNullableString;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  posts: {
    id: Generated<string>;
    slug: string;
    title: string;
    excerpt: string;
    content: unknown;
    cover_image_key: OptionalNullableString;
    category_id: OptionalNullableString;
    author_id: string;
    status: Generated<"DRAFT" | "PUBLISHED">;
    published_at: OptionalTimestamp;
    view_count: Generated<number>;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  comments: {
    id: Generated<string>;
    post_id: string;
    author_id: OptionalNullableString;
    body: string;
    status: Generated<"PENDING" | "APPROVED" | "REJECTED">;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
}

type DatabaseSingleton = {
  pool?: Pool;
  database?: Kysely<Database>;
};

const databaseSingleton = globalThis as typeof globalThis & DatabaseSingleton;

export const pool =
  databaseSingleton.pool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
  });

export const database =
  databaseSingleton.database ??
  new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  });

if (process.env.NODE_ENV !== "production") {
  databaseSingleton.pool = pool;
  databaseSingleton.database = database;
}
