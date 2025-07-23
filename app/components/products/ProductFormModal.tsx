import type { ProductFormModalProps } from "./types";

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  formData,
  onFormDataChange,
  companies,
  categories,
  onAddVariant,
  onRemoveVariant,
  onVariantChange,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="border-b border-[#DDDDDD] p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1F1F1F]">
              {editingProduct ? "Edit Product" : "Add New Product"}
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

        <div className="p-4 sm:p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  onFormDataChange({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Company *
              </label>
              <select
                value={formData.companyId}
                onChange={(e) =>
                  onFormDataChange({ ...formData, companyId: e.target.value })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  onFormDataChange({ ...formData, categoryId: e.target.value })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-[#1F1F1F]">
                Product Variants *
              </label>
              <button
                type="button"
                onClick={onAddVariant}
                className="inline-flex items-center gap-1 text-sm text-[#9869E0] hover:text-[#7B40CC] focus:outline-none"
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
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Variant
              </button>
            </div>
            <div className="space-y-3">
              {formData.variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) =>
                        onVariantChange(variant.id, "name", e.target.value)
                      }
                      className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                      placeholder="Variant name (e.g., 250g, Large)"
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <input
                      type="number"
                      value={variant.mrp}
                      onChange={(e) =>
                        onVariantChange(
                          variant.id,
                          "mrp",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                      placeholder="MRP"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveVariant(variant.id)}
                      className="rounded-lg p-2 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 self-start sm:self-auto"
                      aria-label="Remove variant"
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
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            {/* Out of Stock */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#1F1F1F]">
                Out of Stock
              </label>
              <button
                type="button"
                onClick={() =>
                  onFormDataChange({
                    ...formData,
                    isOutOfStock: !formData.isOutOfStock,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 ${
                  formData.isOutOfStock ? "bg-[#E74C3C]" : "bg-[#DDDDDD]"
                }`}
                aria-label="Toggle out of stock"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isOutOfStock
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Available in Pieces */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#1F1F1F]">
                Available in Pieces
              </label>
              <button
                type="button"
                onClick={() =>
                  onFormDataChange({
                    ...formData,
                    availableInPieces: !formData.availableInPieces,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 ${
                  formData.availableInPieces
                    ? "bg-[#9869E0]"
                    : "bg-[#DDDDDD]"
                }`}
                aria-label="Toggle available in pieces"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.availableInPieces
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Available in Pack */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#1F1F1F]">
                  Available in Pack
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onFormDataChange({
                      ...formData,
                      availableInPack: !formData.availableInPack,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 ${
                    formData.availableInPack
                      ? "bg-[#9869E0]"
                      : "bg-[#DDDDDD]"
                  }`}
                  aria-label="Toggle available in pack"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.availableInPack
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {formData.availableInPack && (
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-2">
                    Pack Size
                  </label>
                  <input
                    type="number"
                    value={formData.packSize}
                    onChange={(e) =>
                      onFormDataChange({
                        ...formData,
                        packSize: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full sm:w-32 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                    min="1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#DDDDDD] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 rounded-lg border border-[#DDDDDD] bg-white px-4 py-2 text-sm font-medium text-[#666666] hover:bg-[#F7F3FF] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="order-1 sm:order-2 rounded-lg bg-[#9869E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 