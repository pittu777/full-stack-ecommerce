/**
 * `features/auth/config/config.ts`
 *
 * Static auth configuration — redirect URLs and public route definitions.
 *
 * Keep this in sync with:
 *   - The `isPublicRoute` matcher in `src/middleware.ts`
 *   - The NEXT_PUBLIC_CLERK_* env vars in `.env`
 */

export const AUTH_CONFIG = {
  /**
   * Where unauthenticated users are sent when they hit a protected route.
   * Must match NEXT_PUBLIC_CLERK_SIGN_IN_URL in .env
   */
  signInUrl: "/sign-in",

  /**
   * Where new users are sent to create an account.
   * Must match NEXT_PUBLIC_CLERK_SIGN_UP_URL in .env
   */
  signUpUrl: "/sign-up",

  /**
   * Where signed-in users land after completing sign-in.
   * Must match NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL in .env
   */
  afterSignInUrl: "/",

  /**
   * Where new users land after completing sign-up.
   * Must match NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL in .env
   */
  afterSignUpUrl: "/",

  /**
   * Where users land after signing out.
   */
  afterSignOutUrl: "/",

  /**
   * Routes that are accessible without authentication.
   * This mirrors the `isPublicRoute` list in middleware.ts.
   * Use this for client-side conditional rendering decisions.
   */
  publicPaths: ["/", "/sign-in", "/sign-up", "/products", "/categories"],
} as const;