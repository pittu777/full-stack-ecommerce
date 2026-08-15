"use server";

import { getClerkUser, getAuthUserId } from "@/lib/clerk";
import { syncFromClerk, getUserByClerkId } from "@/services/user.service";
import type { AppUser, ClerkUserSyncPayload } from "@/types/user";

/**
 * `user.actions.ts` — Server Actions for User domain.
 *
 * ARCHITECTURE:
 * - Actions are THIN. They: validate input → call auth → call service.
 * - Business logic stays in `user.service.ts`.
 * - Actions are the bridge between Client Components and the service layer.
 *
 * Usage from a Client Component:
 *   import { syncUserAction } from "@/actions/user.actions";
 *   await syncUserAction();
 */

/**
 * Ensures a DB User record exists for the currently signed-in Clerk user.
 *
 * Call this after sign-in as a safety net in case the webhook was delayed
 * or missed. It is idempotent — safe to call multiple times.
 *
 * Typical usage: called from the root layout or a post-auth redirect page.
 */
export async function syncUserAction(): Promise<AppUser | null> {
  const userId = await getAuthUserId();

  if (!userId) {
    // Not authenticated — nothing to sync
    return null;
  }

  // Check if DB record already exists (avoid unnecessary Clerk API call)
  const existingUser = await getUserByClerkId(userId);
  if (existingUser) {
    return existingUser;
  }

  // Fetch full Clerk user to get email/name/image
  const clerkUser = await getClerkUser();
  if (!clerkUser) {
    return null;
  }

  const primaryEmail = clerkUser.emailAddresses.find(
    (e: { id: string; emailAddress: string }) =>
      e.id === clerkUser.primaryEmailAddressId
  );

  const payload: ClerkUserSyncPayload = {
    clerkUserId: clerkUser.id,
    email: primaryEmail?.emailAddress ?? "",
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
  };

  return syncFromClerk(payload);
}

/**
 * Returns the currently signed-in user's application record.
 * Returns `null` if not authenticated or if no DB record exists.
 */
export async function getCurrentAppUserAction(): Promise<AppUser | null> {
  const userId = await getAuthUserId();

  if (!userId) return null;

  return getUserByClerkId(userId);
}
