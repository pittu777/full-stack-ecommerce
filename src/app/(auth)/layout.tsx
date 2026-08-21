import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Layout for the (auth) route group.
 *
 * If a user is ALREADY authenticated and manually navigates to /sign-in or /sign-up,
 * this layout redirects them immediately to the Home page (`/`).
 */
export default async function AuthLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  // Redirect logged-in users away from auth pages to home
  if (userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-[440px]">
        {children}
      </div>
    </div>
  );
}
