import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fc] px-4 py-12 dark:bg-zinc-950">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
            ApexCommerce
          </span>
        </Link>
      </div>

      {/* Auth Card Content */}
      <div className="w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
