interface CustomersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
  areaFilter: string[];
  onAreaFilterChange: (area: string) => void;
  cityFilter: string[];
  onCityFilterChange: (city: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearAllFilters: () => void;
  activeFiltersCount: number;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
  availableAreas: string[];
  availableCities: string[];
}

const CustomersFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  areaFilter,
  onAreaFilterChange,
  cityFilter,
  onCityFilterChange,
  showFilters,
  onToggleFilters,
  onClearAllFilters,
  activeFiltersCount,
  statusColors,
  statusLabels,
  availableAreas,
  availableCities
}: CustomersFiltersProps) => {
  return (
    <>
      {/* Search Section */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search shops, owners, or locations..."
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

      {/* Filters Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={onToggleFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm font-medium text-[#666666] transition-colors hover:bg-[#F7F3FF] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20 w-full sm:w-auto justify-center sm:justify-start"
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
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">Show Filters</span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#9869E0] text-xs font-medium text-white">
                {activeFiltersCount}
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
              className={`transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearAllFilters}
              className="text-xs sm:text-sm text-[#9869E0] hover:text-[#7B40CC] focus:outline-none whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>

        {showFilters && (
          <div className="rounded-lg border border-[#DDDDDD] bg-white p-3 sm:p-4 space-y-4 sm:space-y-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2 sm:mb-3">Status</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => onStatusFilterChange(status)}
                    className={`px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      statusFilter.includes(status)
                        ? `${statusColors[status]} text-white`
                        : 'bg-white border border-[#DDDDDD] text-[#666666] hover:bg-[#F7F3FF]'
                    } focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2 sm:mb-3">Area</label>
              <div className="flex flex-wrap gap-2">
                {availableAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => onAreaFilterChange(area)}
                    className={`px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      areaFilter.includes(area)
                        ? 'bg-[#9869E0] text-white'
                        : 'bg-white border border-[#DDDDDD] text-[#666666] hover:bg-[#F7F3FF]'
                    } focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2 sm:mb-3">City</label>
              <div className="flex flex-wrap gap-2">
                {availableCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => onCityFilterChange(city)}
                    className={`px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      cityFilter.includes(city)
                        ? 'bg-[#9869E0] text-white'
                        : 'bg-white border border-[#DDDDDD] text-[#666666] hover:bg-[#F7F3FF]'
                    } focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomersFilters; 