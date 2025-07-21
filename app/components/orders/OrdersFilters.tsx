interface OrdersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  customStartDate: string;
  onCustomStartDateChange: (value: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearAllFilters: () => void;
  activeFiltersCount: number;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

const OrdersFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  showFilters,
  onToggleFilters,
  onClearAllFilters,
  activeFiltersCount,
  statusColors,
  statusLabels
}: OrdersFiltersProps) => {
  return (
    <>
      {/* Search Section */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders by customer, address, or order ID..."
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
              className="text-sm text-[#9869E0] hover:text-[#7B40CC] focus:outline-none"
            >
              Clear all filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="rounded-lg border border-[#DDDDDD] bg-white p-4 space-y-6">
            {/* Status Filter - Full Width */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-3">Status</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => onStatusFilterChange(status)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
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

            {/* Date Filter - Compact */}
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => onDateFilterChange(e.target.value)}
                className="w-64 rounded-lg border border-[#DDDDDD] bg-white px-3 py-1.5 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {dateFilter === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => onCustomStartDateChange(e.target.value)}
                    className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-2">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => onCustomEndDateChange(e.target.value)}
                    className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersFilters; 