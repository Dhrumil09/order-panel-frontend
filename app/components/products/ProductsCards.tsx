import type { ProductsCardsProps } from "./types";
import { getCompanyName, getCategoryName } from "./utils";

export default function ProductsCards({
  products,
  companies,
  categories,
  onEditProduct,
  onDeleteProduct,
}: ProductsCardsProps) {
  return (
    <div className="md:hidden">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`p-4 ${
            index !== products.length - 1
              ? "border-b border-[#DDDDDD]"
              : ""
          }`}
        >
          {/* Product Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-[#1F1F1F] truncate">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-[#666666]">
                <span>{getCompanyName(product.companyId, companies)}</span>
                <span>•</span>
                <span>{getCategoryName(product.categoryId, categories)}</span>
              </div>
            </div>
            <div className="flex gap-2 ml-3">
              <button
                onClick={() => onEditProduct(product)}
                className="rounded-lg p-2 text-[#666666] hover:bg-[#EAE2FA] hover:text-[#5E2BA8] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                aria-label="Edit product"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="rounded-lg p-2 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                aria-label="Delete product"
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
          </div>

          {/* Status and Availability */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                product.isOutOfStock
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {product.isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#666666]">
              {product.availableInPieces && <span>✓ Pieces</span>}
              {product.availableInPack && (
                <span>✓ Pack of {product.packSize}</span>
              )}
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex flex-wrap gap-1">
              {product.variants.map((variant) => (
                <span
                  key={variant.id}
                  className="inline-flex items-center rounded-full bg-[#EAE2FA] px-2 py-1 text-xs font-medium text-[#5E2BA8]"
                >
                  {variant.name} - ₹{variant.mrp}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 