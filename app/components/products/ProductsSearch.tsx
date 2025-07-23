import type { ProductsSearchProps } from "./types";

export default function ProductsSearch({ searchTerm, onSearchChange }: ProductsSearchProps) {
  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-3 pl-10 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
        />
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666666]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
} 