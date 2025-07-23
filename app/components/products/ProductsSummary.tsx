import type { ProductsSummaryProps } from "./types";

export default function ProductsSummary({ filteredCount, totalCount, isSearching }: ProductsSummaryProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm text-[#666666]">
          Showing {filteredCount} of {totalCount} products
        </p>
        {isSearching && (
          <div className="flex items-center gap-1 text-xs text-[#9869E0]">
            <div className="animate-spin rounded-full h-3 w-3 border-b border-[#9869E0]"></div>
            <span>Searching...</span>
          </div>
        )}
      </div>
    </div>
  );
} 