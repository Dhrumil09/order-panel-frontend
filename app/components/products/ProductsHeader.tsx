import type { ProductsHeaderProps } from "./types";

export default function ProductsHeader({ onAddProduct, onManage }: ProductsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl sm:text-[32px] font-bold leading-tight text-[#1F1F1F]">
        Products
      </h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onManage}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDDDDD] bg-white px-4 py-2 text-sm font-medium text-[#666666] transition-colors hover:bg-[#F7F3FF] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
          </svg>
          Manage
        </button>
        <button
          onClick={onAddProduct}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9869E0] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
          Add Product
        </button>
      </div>
    </div>
  );
} 