import type { ReactNode } from "react";

/**
 * Layout for pages inside the (navbar) route group.
 * Header Navbar is rendered at root level in root layout.tsx for seamless SPA transitions.
 */
export default function NavbarLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
