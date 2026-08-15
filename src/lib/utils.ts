import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `lib/utils.ts` — Utility helpers for the application.
 *
 * `cn()` is the standard shadcn/ui class merging utility.
 * It combines clsx (conditional classes) with tailwind-merge
 * (removes conflicting Tailwind classes).
 *
 * Usage:
 *   import { cn } from "@/lib/utils";
 *   <div className={cn("base-class", isActive && "active-class", className)} />
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
