import type { ReactNode } from "react";

/**
 * Layout for the (auth) route group.
 *
 * Provides a clean, centered container with a soft background.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-[440px]">
        {children}
      </div>
    </div>
  );
}
