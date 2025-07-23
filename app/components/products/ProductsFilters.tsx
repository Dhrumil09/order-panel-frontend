import type { ProductsFiltersProps } from "./types";
import { getActiveFilterCount, MAX_PRICE } from "./utils";

export default function ProductsFilters({
  filters,
  onFiltersChange,
  showFilters,
  onToggleFilters,
  onClearAllFilters,
  categories,
  companies,
}: ProductsFiltersProps) {
  const handleCategoryFilter = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      selectedCategories: filters.selectedCategories.includes(categoryId)
        ? filters.selectedCategories.filter((id) => id !== categoryId)
        : [...filters.selectedCategories, categoryId],
    });
  };

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onToggleFilters}
          className="inline-flex items-center gap-2 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm font-medium text-[#666666] transition-colors hover:bg-[#F7F3FF] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#9869E0] text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAllFilters}
            className="text-sm text-[#9869E0] hover:text-[#7B40CC] focus:outline-none"
          >
            Clear all filters
          </button>
        )}
      </div>

      {showFilters && (
        <div className="rounded-lg border border-[#DDDDDD] bg-white p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryFilter(category.id)}
                      className="rounded border-[#DDDDDD] text-[#9869E0] focus:ring-[#9869E0]"
                    />
                    <span className="ml-2 text-sm text-[#666666]">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Status Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Stock Status
              </label>
              <select
                value={filters.stockStatus}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    stockStatus: e.target.value as any,
                  })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    availability: e.target.value as any,
                  })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              >
                <option value="all">All Types</option>
                <option value="pieces">Pieces Only</option>
                <option value="pack">Pack Only</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Price Range (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      priceRange: {
                        ...filters.priceRange,
                        min: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="flex-1 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      priceRange: {
                        ...filters.priceRange,
                        max: parseInt(e.target.value) || MAX_PRICE,
                      },
                    })
                  }
                  className="flex-1 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                />
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Size Contains
              </label>
              <input
                type="text"
                placeholder="e.g. 250g, Large"
                value={filters.sizeFilter}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    sizeFilter: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 