"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@/features/auth/components/UserButton";

/**
 * Client Header component.
 *
 * Uses Clerk's `useUser()` hook to render:
 * - If Signed In: UserButton (Avatar & profile dropdown) in the top right.
 * - If Signed Out: Sign In & Sign Up buttons.
 */
export function Header() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-slate-50">
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ShopNow
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/" className="transition hover:text-slate-900 dark:hover:text-slate-50">
            Home
          </Link>
          <Link href="/products" className="transition hover:text-slate-900 dark:hover:text-slate-50">
            Products
          </Link>
          <Link href="/categories" className="transition hover:text-slate-900 dark:hover:text-slate-50">
            Categories
          </Link>
        </nav>

        {/* Auth / Profile Area (Top Right) */}
        <div className="flex items-center gap-4">
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                Account
              </span>
              <UserButton />
            </div>
          ) : isLoaded ? (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-medium bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
