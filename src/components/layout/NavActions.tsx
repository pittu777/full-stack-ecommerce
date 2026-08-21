"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Heart, ShoppingCart, User } from "lucide-react";
import { UserButton } from "@/features/auth/components/UserButton";

interface NavActionsProps {
  wishlistCount?: number;
  cartCount?: number;
}

export function NavActions({ wishlistCount = 0, cartCount = 0 }: NavActionsProps) {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Wishlist Button */}
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-[#3b38d6] dark:hover:text-indigo-400 transition"
      >
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[#3b38d6] text-white text-[10px] font-bold rounded-full">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Shopping Cart Button */}
      <Link
        href="/cart"
        aria-label="Cart"
        className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-[#3b38d6] dark:hover:text-indigo-400 transition"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[#3b38d6] text-white text-[10px] font-bold rounded-full">
            {cartCount}
          </span>
        )}
      </Link>

      {/* User Account Section */}
      <div className="flex items-center ml-1">
        {isLoaded && isSignedIn ? (
          <UserButton />
        ) : isLoaded ? (
          <Link
            href="/sign-in"
            aria-label="Sign In"
            className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#3b38d6] hover:text-[#3b38d6] transition flex items-center justify-center"
          >
            <User className="w-4 h-4" />
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        )}
      </div>
    </div>
  );
}
