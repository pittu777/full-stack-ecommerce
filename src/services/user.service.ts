"use server";

import { prisma } from "@/lib/prisma";
import type { ClerkUserSyncPayload, AppUser, UserRole } from "@/types/user";

/**
 * `user.service.ts` — Backend service for User domain operations.
 *
 * ARCHITECTURE RULES (from README):
 * - This is the ONLY place in the app that reads/writes `prisma.users.*`
 * - Server Actions call this service; they do NOT call Prisma directly
 * - Route Handlers (webhooks) call this service; they do NOT call Prisma directly
 * - Components NEVER import this file
 */

/**
 * Upsert a User record based on data received from Clerk.
 *
 * Called by:
 *   - The Clerk webhook Route Handler (`/api/webhooks/clerk`)
 *   - The `syncUserAction` Server Action (post sign-in safety net)
 *
 * Uses `upsert` so it is safe to call multiple times — idempotent.
 */
export async function syncFromClerk(
  payload: ClerkUserSyncPayload
): Promise<AppUser> {
  const user = await prisma.users.upsert({
    where: { clerkUserId: payload.clerkUserId },
    create: {
      clerkUserId: payload.clerkUserId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      imageUrl: payload.imageUrl,
      role: "CUSTOMER",
    },
    update: {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      imageUrl: payload.imageUrl,
    },
  });

  return {
    id: user.id,
    clerkUserId: user.clerkUserId!,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    role: user.role as UserRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Fetch an Application User by their Clerk user ID.
 * Returns `null` if no record exists yet (e.g. webhook hasn't fired).
 */
export async function getUserByClerkId(
  clerkUserId: string
): Promise<AppUser | null> {
  const user = await prisma.users.findUnique({
    where: { clerkUserId },
  });

  if (!user || !user.clerkUserId) return null;

  return {
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    role: user.role as UserRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Delete an Application User record (called on Clerk `user.deleted` webhook).
 */
export async function deleteUserByClerkId(clerkUserId: string): Promise<void> {
  await prisma.users.delete({
    where: { clerkUserId },
  });
}
