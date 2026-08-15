/**
 * `features/auth/utils.ts`
 *
 * Shared auth utility functions.
 * Can be used in both server and client contexts (no server-only imports).
 */

import type { UserRole } from "@/types/user";

/**
 * Returns true if the given role has admin-level access.
 * Use this for conditional rendering of admin UI elements.
 *
 * For server-side admin gate, use `requireAdmin()` from `src/lib/clerk.ts`.
 */
export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/**
 * Returns a human-readable label for a user role.
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    CUSTOMER: "Customer",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
  };
  return labels[role] ?? role;
}