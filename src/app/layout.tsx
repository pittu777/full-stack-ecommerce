import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Montserrat, Outfit } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs";
import { ReduxProvider } from "@/store/provider";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"], // Select weights you need
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"], // Select weights you need
});

export const metadata: Metadata = {
  title: {
    default: "ShopNow — E-Commerce Platform",
    template: "%s | ShopNow",
  },
  description:
    "A modern, full-stack e-commerce platform built with Next.js, Prisma, and Clerk.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${outfit.variable}  h-full antialiased`}
      >
        <body className="font-[family-name:var(--font-outfit)] min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
          <ReduxProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
