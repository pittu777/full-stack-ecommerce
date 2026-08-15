import Link from "next/link";
import { syncUserAction } from "@/actions/user.actions";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  let userId: string | null = null;
  let user = null;

  try {
    const authObj = await auth();
    userId = authObj.userId;
    if (userId) {
      user = await currentUser();
      // Post sign-in DB user sync safety net
      await syncUserAction().catch((err) => {
        console.error("[Home] Error syncing user with DB:", err);
      });
    }
  } catch (err) {
    console.error("[Home] Error fetching auth user:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ShopNow
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
          A production-grade, modular monolith e-commerce platform built with
          Next.js App Router, Prisma ORM, Supabase, Redux Toolkit, and Clerk.
        </p>

        {user ? (
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Signed in as{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {user.firstName || user.emailAddresses?.[0]?.emailAddress}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/sign-in"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              Get Started — Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-medium hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            >
              Create Account
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
