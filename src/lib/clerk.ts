import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * `lib/clerk.ts` — server-side Clerk helper utilities.
 *
 * These helpers centralise all server-side auth access so that:
 * - Server Components, Server Actions, and Route Handlers all share
 *   the same consistent access pattern.
 * - Changing Clerk's API only requires updates here, not across the whole app.
 *
 * IMPORTANT: These functions are SERVER-ONLY.
 * Do NOT import this file in Client Components or client-side code.
 */

/**
 * Returns the Clerk auth object for the current request.
 * Equivalent to `auth()` from Clerk — call this in Server Actions / Route Handlers
 * when you only need the `userId` and `sessionId` without a full User object.
 *
 * @returns Clerk auth object (userId is null if not signed in)
 */
export async function getAuthSession() {
  return auth();
}

/**
 * Returns the full Clerk User object for the currently signed-in user.
 * Returns `null` if the user is not signed in.
 *
 * Note: This makes a network call to Clerk's API on every invocation.
 * Use `getAuthSession()` (which only reads from the JWT) when you only
 * need the userId — it is much cheaper.
 *
 * @returns Clerk User object or null
 */
export async function getClerkUser() {
  return currentUser();
}

/**
 * Returns the `userId` of the currently authenticated user.
 * Returns `null` if the user is not signed in.
 *
 * Use this in Server Actions as a lightweight auth check.
 */
export async function getAuthUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Asserts that the current user is authenticated.
 * Throws a redirect to the sign-in page if not authenticated.
 *
 * Use this at the top of Server Actions or Route Handlers
 * that require authentication.
 *
 * @returns The authenticated userId (guaranteed non-null)
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    // Clerk's auth().protect() handles the redirect for us,
    // but we throw here for explicit, self-documenting control in actions.
    throw new Error("Unauthorized: User is not signed in.");
  }

  return userId;
}

/**
 * Checks if the current user has the ADMIN role.
 * This is a lightweight check — role is stored in Clerk's `publicMetadata`.
 *
 * For a full role check that also queries the DB, use the
 * `user.service.ts` → `getUserByClerkId` and check `user.role`.
 *
 * @returns true if the user is an admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();

  if (!user) return false;

  const role = user.publicMetadata?.role as string | undefined;
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/**
 * Asserts that the current user is an admin.
 * Throws if not authenticated or not an admin.
 */
export async function requireAdmin(): Promise<string> {
  const userId = await requireAuth();

  const adminStatus = await isAdmin();
  if (!adminStatus) {
    throw new Error("Forbidden: Admin access required.");
  }

  return userId;
}
