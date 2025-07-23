import type { ProductsTableProps } from "./types";
import { getCompanyName, getCategoryName } from "./utils";

export default function ProductsTable({
  products,
  companies,
  categories,
  onEditProduct,
  onDeleteProduct,
}: ProductsTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-[#DDDDDD]">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">
              Product
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">
              Company
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">
              Category
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">
              Variants
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">
              Status
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">
              Availability
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-[#666666]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={`${
                index !== products.length - 1
                  ? "border-b border-[#DDDDDD]"
                  : ""
              } hover:bg-[#F7F3FF]`}
            >
              <td className="px-6 py-4">
                <div className="font-medium text-[#1F1F1F]">
                  {product.name}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#666666]">
                {getCompanyName(product.companyId, companies)}
              </td>
              <td className="px-6 py-4 text-sm text-[#666666]">
                {getCategoryName(product.categoryId, categories)}
              </td>
              <td className="px-6 py-4">
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
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    product.isOutOfStock
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 text-xs text-[#666666]">
                  {product.availableInPieces && <span>✓ Pieces</span>}
                  {product.availableInPack && (
                    <span>✓ Pack of {product.packSize}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
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
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 