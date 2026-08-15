"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";

/**
 * UserButton — `features/auth/components/UserButton.tsx`
 *
 * A thin wrapper around Clerk's `<UserButton />` component.
 * This gives us a single place to:
 *   - Set default appearance / props
 *   - Swap to a custom implementation later without touching all usages
 *
 * Note (Clerk v7): afterSignOutUrl is configured via the
 * NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL env var or
 * in Clerk Dashboard → "Redirects".
 *
 * Usage in the Header:
 *   import { UserButton } from "@/features/auth/components/UserButton";
 *   <UserButton />
 */
export function UserButton() {
  return (
    <ClerkUserButton
      appearance={{
        elements: {
          // Tweak the avatar button size to match the header design
          avatarBox: "w-8 h-8",
        },
      }}
    />
  );
}
