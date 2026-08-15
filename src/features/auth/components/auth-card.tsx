"use client";

import React from "react";
import Link from "next/link";
import { AuthCardProps } from "../types/auth.types";
import { SocialButtons } from "./social-buttons";

export function AuthCard({ mode, children }: AuthCardProps) {
  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-[440px] rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          {isLogin
            ? "Please enter your details to sign in."
            : "Enter your details to get started with ApexCommerce."}
        </p>
      </div>

      {/* Main Form Fields & Submit */}
      {children}

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 font-medium text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Auth Providers */}
      <SocialButtons />

      {/* Footer Navigation Link */}
      <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {isLogin ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
