"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ className = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-md ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full py-2.5 pl-5 pr-11 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b38d6]/20 focus:border-[#3b38d6] transition-all shadow-xs"
      />

      {query ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="submit"
          className="absolute right-3.5 p-1 text-slate-500 dark:text-slate-400 hover:text-[#3b38d6] transition"
        >
          <Search className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
