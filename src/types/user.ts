/**
 * Shared TypeScript types for the User domain.
 *
 * IMPORTANT: These are our *application* user types (stored in our DB),
 * not Clerk's internal user type. Clerk's `User` is imported from
 * '@clerk/nextjs/server' when needed server-side.
 *
 * Once Prisma schema is defined, prefer Prisma's generated types
 * (e.g. `import type { User } from '@/app/generated/prisma'`) over these.
 * These types act as a safe stand-in during early development.
 */

export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

/**
 * Application User record — stored in our PostgreSQL database.
 * Linked to Clerk via `clerkUserId`.
 */
export interface AppUser {
  id: string;
  clerkUserId: string; // Foreign key → Clerk user ID
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Minimal user shape used for display purposes (e.g. header, profile dropdown).
 */
export interface UserDisplay {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: UserRole;
}

/**
 * Data payload used when syncing a user from Clerk to our DB.
 */
export interface ClerkUserSyncPayload {
  clerkUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}
