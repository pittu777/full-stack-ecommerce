import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * `lib/prisma.ts` — Singleton Prisma client for Prisma ORM v7
 *
 * In Prisma 7, PostgreSQL uses driver adapters (`@prisma/adapter-pg` with `pg` pool).
 * In development, Next.js hot-reload creates a new module scope on every
 * file save, which would otherwise create a new PrismaClient per reload
 * and exhaust the DB connection pool. We store the instance on `globalThis`
 * to avoid this. In production the module is only loaded once.
 */

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
