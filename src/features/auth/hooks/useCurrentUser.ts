"use client";

import { useUser } from "@clerk/nextjs";

/**
 * `useCurrentUser` — typed hook for accessing the current Clerk user.
 *
 * This wraps Clerk's `useUser()` and exposes a clean, explicit interface.
 *
 * NOTE: This returns Clerk's user (auth identity data).
 * For our Application User (DB record with role, orders, etc.),
 * use `getCurrentAppUserAction()` from a Server Component or Server Action.
 *
 * Usage in a Client Component:
 *   const { user, isSignedIn, isLoading } = useCurrentUser();
 *   if (isLoading) return <Spinner />;
 *   if (!isSignedIn) return null;
 */
export function useCurrentUser() {
  const { user, isLoaded, isSignedIn } = useUser();

  return {
    /** The Clerk user object — null when signed out or loading */
    user: user ?? null,
    /** True while Clerk is loading the session */
    isLoading: !isLoaded,
    /** True if the user is fully signed in */
    isSignedIn: isSignedIn ?? false,
  };
}

/** Infer the return type for use in other components */
export type CurrentUser = ReturnType<typeof useCurrentUser>;
