import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Your luxury cart items.",
};

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Shopping Cart
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
        Review your selected products before checkout.
      </p>
    </div>
  );
}
