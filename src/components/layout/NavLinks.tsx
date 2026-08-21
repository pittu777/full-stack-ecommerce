"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Shop", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "What's New", href: "/whats-new" },
];

interface NavLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

export function NavLinks({ className = "", onLinkClick }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={`flex items-center gap-6 ${className}`}>
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/" || pathname === "/shop"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={`text-sm font-medium transition-colors hover:text-[#3b38d6] whitespace-nowrap ${
              isActive
                ? "text-[#3b38d6] font-semibold"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
