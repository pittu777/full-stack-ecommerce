"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { NavLinks } from "./NavLinks";
import { NavActions } from "./NavActions";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. Left: Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="text-2xl font-black tracking-wider text-[#3b38d6] dark:text-indigo-400 select-none"
            >
              LUXE
            </Link>
          </div>

          {/* 2. Middle: Search Bar (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-md mx-4">
            <SearchBar />
          </div>

          {/* 3. Right: Nav Links & Action Icons */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center">
              <NavLinks />
            </div>

            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-[#3b38d6] transition"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Right Action Icons (Wishlist, Cart, Account Avatar) */}
            <NavActions />

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-[#3b38d6] transition"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {mobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 dark:border-slate-900 animate-in slide-in-from-top-2 duration-200">
            <SearchBar />
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-4 animate-in slide-in-from-top-3 duration-200">
          <NavLinks
            className="flex-col items-start gap-3"
            onLinkClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
