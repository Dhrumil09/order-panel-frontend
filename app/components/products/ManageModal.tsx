import { useState } from "react";
import type { ManageModalProps } from "./types";

export default function ManageModal({
  isOpen,
  onClose,
  companies,
  categories,
  onCreateCompany,
  onDeleteCompany,
  onCreateCategory,
  onDeleteCategory,
}: ManageModalProps) {
  const [manageTab, setManageTab] = useState<"companies" | "categories">("companies");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCompany = async () => {
    if (newCompanyName.trim()) {
      try {
        await onCreateCompany(newCompanyName.trim());
        setNewCompanyName("");
      } catch (error) {
        // Error handling is done in the mutation
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        await onCreateCategory(newCategoryName.trim());
        setNewCategoryName("");
      } catch (error) {
        // Error handling is done in the mutation
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="border-b border-[#DDDDDD] p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1F1F1F]">
              Manage Companies & Categories
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-[#666666] hover:bg-[#F7F3FF] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#DDDDDD] overflow-x-auto">
          <div className="flex min-w-full">
            <button
              onClick={() => setManageTab("companies")}
              className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                manageTab === "companies"
                  ? "border-[#9869E0] text-[#9869E0]"
                  : "border-transparent text-[#666666] hover:text-[#1F1F1F]"
              }`}
            >
              Companies
            </button>
            <button
              onClick={() => setManageTab("categories")}
              className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                manageTab === "categories"
                  ? "border-[#9869E0] text-[#9869E0]"
                  : "border-transparent text-[#666666] hover:text-[#1F1F1F]"
              }`}
            >
              Categories
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {manageTab === "companies" ? (
            <div className="space-y-6">
              {/* Add Company */}
              <div>
                <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                  Add New Company
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="flex-1 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                    placeholder="Enter company name"
                    onKeyPress={(e) => e.key === "Enter" && handleAddCompany()}
                  />
                  <button
                    onClick={handleAddCompany}
                    className="rounded-lg bg-[#9869E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 sm:w-auto w-full"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Companies List */}
              <div>
                <h3 className="text-sm font-medium text-[#1F1F1F] mb-3">
                  Existing Companies ({companies.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {companies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between rounded-lg border border-[#DDDDDD] p-3"
                    >
                      <span className="text-sm text-[#1F1F1F] flex-1 truncate mr-2">
                        {company.name}
                      </span>
                      <button
                        onClick={() => onDeleteCompany(company.id)}
                        className="rounded-lg p-1 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 flex-shrink-0"
                        aria-label="Delete company"
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
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add Category */}
              <div>
                <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                  Add New Category
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                    placeholder="Enter category name"
                    onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                  <button
                    onClick={handleAddCategory}
                    className="rounded-lg bg-[#9869E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 sm:w-auto w-full"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div>
                <h3 className="text-sm font-medium text-[#1F1F1F] mb-3">
                  Existing Categories ({categories.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between rounded-lg border border-[#DDDDDD] p-3"
                    >
                      <span className="text-sm text-[#1F1F1F] flex-1 truncate mr-2">
                        {category.name}
                      </span>
                      <button
                        onClick={() => onDeleteCategory(category.id)}
                        className="rounded-lg p-1 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 flex-shrink-0"
                        aria-label="Delete category"
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
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 