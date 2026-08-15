/**
 * `features/auth/services/authService.ts`
 *
 * Client-side auth utilities.
 *
 * IMPORTANT: This file runs in the BROWSER (client-side only).
 * Do NOT import server-only modules here (e.g. lib/clerk.ts, lib/prisma.ts).
 *
 * For server-side auth operations, use:
 *   - `src/lib/clerk.ts` → server helpers (requireAuth, getCurrentUserId, etc.)
 *   - `src/actions/user.actions.ts` → server actions
 */

import { AUTH_CONFIG } from "../config/config";

/**
 * Checks if a given pathname is a public (non-protected) route.
 * Use this for conditional UI rendering (e.g. show/hide auth buttons).
 *
 * @param pathname - The current route pathname (from usePathname())
 */
export function isPublicPath(pathname: string): boolean {
  return AUTH_CONFIG.publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * Returns the display name for a user given firstName, lastName, and email.
 * Falls back gracefully if name parts are missing.
 */
export function formatUserDisplayName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  email: string
): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  // Fall back to the email prefix (before @)
  return email.split("@")[0];
}