import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse product categories on LUXE.",
};

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Categories
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
        Explore luxury products across all categories.
      </p>
    </div>
  );
}
