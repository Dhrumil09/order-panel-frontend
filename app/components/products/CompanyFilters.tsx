import type { CompanyFiltersProps } from "./types";

export default function CompanyFilters({ companies, selectedCompanies, onCompanyFilter }: CompanyFiltersProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {companies.map((company) => (
          <button
            key={company.id}
            onClick={() => onCompanyFilter(company.id)}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCompanies.includes(company.id)
                ? "bg-[#9869E0] text-white"
                : "bg-white border border-[#DDDDDD] text-[#666666] hover:bg-[#F7F3FF] hover:border-[#9869E0]"
            } focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20`}
          >
            {company.name}
          </button>
        ))}
      </div>
    </div>
  );
} 