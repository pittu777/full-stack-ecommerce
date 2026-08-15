import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * SSO Callback page — `/sso-callback`
 *
 * Clerk redirects Google OAuth authentication responses to this route.
 * `<AuthenticateWithRedirectCallback />` completes the session setup
 * and redirects the user to the home page (`/`).
 */
export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Completing sign in...
        </p>
      </div>
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/"
      />
    </div>
  );
}
