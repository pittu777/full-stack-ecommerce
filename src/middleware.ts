import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Clerk Middleware — `src/middleware.ts`
 *
 * Public routes:
 * - / (home)
 * - /sign-in and /sign-up
 * - /signin and /signup
 * - /sso-callback (Google OAuth return)
 * - /api/webhooks/*
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/signin(.*)",
  "/signup(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/signin(.*)",
  "/signup(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // If user is ALREADY logged in and tries to access /sign-in or /sign-up, redirect to home
  if (userId && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect all non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (Next.js image optimization)
     * - favicon.ico
     * - public folder image assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
