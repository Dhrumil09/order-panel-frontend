import { useState } from "react";
import AdminLayout from "~/components/AdminLayout";
import { createPageMeta } from "~/utils/meta";

export function meta() {
  return createPageMeta("Products", "Manage products.");
}

interface ProductVariant {
  id: string;
  name: string;
  mrp: number;
}

interface Company {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  companyId: string;
  categoryId: string;
  variants: ProductVariant[];
  isOutOfStock: boolean;
  availableInPieces: boolean;
  availableInPack: boolean;
  packSize?: number;
  createdAt: Date;
}

interface Filters {
  selectedCompanies: string[];
  selectedCategories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  stockStatus: "all" | "in-stock" | "out-of-stock";
  sizeFilter: string;
  availability: "all" | "pieces" | "pack" | "both";
}

const initialFormData = {
  name: "",
  companyId: "",
  categoryId: "",
  variants: [{ id: "1", name: "", mrp: 0 }],
  isOutOfStock: false,
  availableInPieces: true,
  availableInPack: false,
  packSize: 1,
};

const initialFilters: Filters = {
  selectedCompanies: [],
  selectedCategories: [],
  priceRange: { min: 0, max: 1000 },
  stockStatus: "all",
  sizeFilter: "",
  availability: "all",
};

export default function Products() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [manageTab, setManageTab] = useState<"companies" | "categories">(
    "companies"
  );

  // Companies state
  const [companies, setCompanies] = useState<Company[]>([
    { id: "1", name: "Coffee Co." },
    { id: "2", name: "Healthy Herbs" },
  ]);
  const [newCompanyName, setNewCompanyName] = useState("");

  // Categories state
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Beverages" },
    { id: "2", name: "Tea & Infusions" },
    { id: "3", name: "Snacks" },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Premium Coffee Beans",
      companyId: "1",
      categoryId: "1",
      variants: [
        { id: "1", name: "250g", mrp: 299 },
        { id: "2", name: "500g", mrp: 499 },
      ],
      isOutOfStock: false,
      availableInPieces: true,
      availableInPack: true,
      packSize: 12,
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Organic Green Tea",
      companyId: "2",
      categoryId: "2",
      variants: [{ id: "1", name: "100g", mrp: 199 }],
      isOutOfStock: true,
      availableInPieces: true,
      availableInPack: false,
      createdAt: new Date(),
    },
  ]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      companyId: product.companyId,
      categoryId: product.categoryId,
      variants: product.variants,
      isOutOfStock: product.isOutOfStock,
      availableInPieces: product.availableInPieces,
      availableInPack: product.availableInPack,
      packSize: product.packSize || 1,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleSaveProduct = () => {
    if (
      !formData.name ||
      !formData.companyId ||
      !formData.categoryId ||
      formData.variants.length === 0
    ) {
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      companyId: formData.companyId,
      categoryId: formData.categoryId,
      variants: formData.variants,
      isOutOfStock: formData.isOutOfStock,
      availableInPieces: formData.availableInPieces,
      availableInPack: formData.availableInPack,
      packSize: formData.availableInPack ? formData.packSize : undefined,
      createdAt: editingProduct?.createdAt || new Date(),
    };

    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? productData : p))
      );
    } else {
      setProducts([...products, productData]);
    }

    setIsModalOpen(false);
    setFormData(initialFormData);
    setEditingProduct(null);
  };

  const handleAddVariant = () => {
    const newVariant = {
      id: Date.now().toString(),
      name: "",
      mrp: 0,
    };
    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant],
    });
  };

  const handleRemoveVariant = (variantId: string) => {
    if (formData.variants.length > 1) {
      setFormData({
        ...formData,
        variants: formData.variants.filter((v) => v.id !== variantId),
      });
    }
  };

  const handleVariantChange = (
    variantId: string,
    field: "name" | "mrp",
    value: string | number
  ) => {
    setFormData({
      ...formData,
      variants: formData.variants.map((v) =>
        v.id === variantId ? { ...v, [field]: value } : v
      ),
    });
  };

  // Company management functions
  const handleAddCompany = () => {
    if (newCompanyName.trim()) {
      const newCompany: Company = {
        id: Date.now().toString(),
        name: newCompanyName.trim(),
      };
      setCompanies([...companies, newCompany]);
      setNewCompanyName("");
    }
  };

  const handleDeleteCompany = (companyId: string) => {
    setCompanies(companies.filter((c) => c.id !== companyId));
  };

  // Category management functions
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId));
  };

  const handleCompanyFilter = (companyId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(companyId)
        ? prev.selectedCompanies.filter((id) => id !== companyId)
        : [...prev.selectedCompanies, companyId],
    }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id) => id !== categoryId)
        : [...prev.selectedCategories, categoryId],
    }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.selectedCompanies.length > 0) count++;
    if (filters.selectedCategories.length > 0) count++;
    if (filters.stockStatus !== "all") count++;
    if (filters.sizeFilter) count++;
    if (filters.availability !== "all") count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count++;
    return count;
  };

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || "Unknown";
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const filteredProducts = products.filter((product) => {
    // Text search
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCompanyName(product.companyId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getCategoryName(product.categoryId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Company filter
    const matchesCompany =
      filters.selectedCompanies.length === 0 ||
      filters.selectedCompanies.includes(product.companyId);

    // Category filter
    const matchesCategory =
      filters.selectedCategories.length === 0 ||
      filters.selectedCategories.includes(product.categoryId);

    // Stock status filter
    const matchesStock =
      filters.stockStatus === "all" ||
      (filters.stockStatus === "in-stock" && !product.isOutOfStock) ||
      (filters.stockStatus === "out-of-stock" && product.isOutOfStock);

    // Price filter
    const productPrices = product.variants.map((v) => v.mrp);
    const minPrice = Math.min(...productPrices);
    const maxPrice = Math.max(...productPrices);
    const matchesPrice =
      minPrice >= filters.priceRange.min && maxPrice <= filters.priceRange.max;

    // Size filter
    const matchesSize =
      !filters.sizeFilter ||
      product.variants.some((v) =>
        v.name.toLowerCase().includes(filters.sizeFilter.toLowerCase())
      );

    // Availability filter
    const matchesAvailability =
      filters.availability === "all" ||
      (filters.availability === "pieces" && product.availableInPieces) ||
      (filters.availability === "pack" && product.availableInPack) ||
      (filters.availability === "both" &&
        product.availableInPieces &&
        product.availableInPack);

    return (
      matchesSearch &&
      matchesCompany &&
      matchesCategory &&
      matchesStock &&
      matchesPrice &&
      matchesSize &&
      matchesAvailability
    );
  });

  return (
    <AdminLayout>
      {/* Header with Create Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-[32px] font-bold leading-tight text-[#1F1F1F]">
          Products
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsManageModalOpen(true)}
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
            onClick={handleAddProduct}
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

          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Company Filter Buttons */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanyFilter(company.id)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    filters.selectedCompanies.includes(company.id)
                      ? "bg-[#9869E0] text-white"
                      : "bg-white border border-[#DDDDDD] text-[#666666] hover:bg-[#F7F3FF] hover:border-[#9869E0]"
                  } focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20`}
                >
                  {company.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
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
                {getActiveFilterCount() > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#9869E0] text-xs font-medium text-white">
                    {getActiveFilterCount()}
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
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearAllFilters}
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
                            checked={filters.selectedCategories.includes(
                              category.id
                            )}
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
                        setFilters((prev) => ({
                          ...prev,
                          stockStatus: e.target.value as any,
                        }))
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
                        setFilters((prev) => ({
                          ...prev,
                          availability: e.target.value as any,
                        }))
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
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              min: parseInt(e.target.value) || 0,
                            },
                          }))
                        }
                        className="flex-1 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              max: parseInt(e.target.value) || 1000,
                            },
                          }))
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
                        setFilters((prev) => ({
                          ...prev,
                          sizeFilter: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#666666]">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products list */}
          <div className="rounded-xl border border-[#DDDDDD] bg-white">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#EAE2FA] flex items-center justify-center">
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
                    className="text-[#9869E0]"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </div>
                <p className="text-sm text-[#666666]">
                  {searchTerm || getActiveFilterCount() > 0
                    ? "No products found matching your search criteria."
                    : "No products added yet. Create your first product!"}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
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
                      {filteredProducts.map((product, index) => (
                        <tr
                          key={product.id}
                          className={`${
                            index !== filteredProducts.length - 1
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
                            {getCompanyName(product.companyId)}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#666666]">
                            {getCategoryName(product.categoryId)}
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
                              {product.isOutOfStock
                                ? "Out of Stock"
                                : "In Stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1 text-xs text-[#666666]">
                              {product.availableInPieces && (
                                <span>✓ Pieces</span>
                              )}
                              {product.availableInPack && (
                                <span>✓ Pack of {product.packSize}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
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
                                onClick={() => handleDeleteProduct(product.id)}
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

                {/* Mobile Card View */}
                <div className="md:hidden">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`p-4 ${
                        index !== filteredProducts.length - 1
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
                            <span>{getCompanyName(product.companyId)}</span>
                            <span>•</span>
                            <span>{getCategoryName(product.categoryId)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => handleEditProduct(product)}
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
                            onClick={() => handleDeleteProduct(product.id)}
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
              </>
            )}
          </div>

      {/* Manage Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="border-b border-[#DDDDDD] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1F1F1F]">
                  Manage Companies & Categories
                </h2>
                <button
                  onClick={() => setIsManageModalOpen(false)}
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
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddCompany()
                        }
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
                            onClick={() => handleDeleteCompany(company.id)}
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
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddCategory()
                        }
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
                            onClick={() => handleDeleteCategory(category.id)}
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
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="border-b border-[#DDDDDD] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1F1F1F]">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
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
                      setFormData({ ...formData, name: e.target.value })
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
                      setFormData({ ...formData, companyId: e.target.value })
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
                      setFormData({ ...formData, categoryId: e.target.value })
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
                    onClick={handleAddVariant}
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
                            handleVariantChange(
                              variant.id,
                              "name",
                              e.target.value
                            )
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
                            handleVariantChange(
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
                          onClick={() => handleRemoveVariant(variant.id)}
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
                      setFormData({
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
                      setFormData({
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
                        setFormData({
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
                          setFormData({
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
                  onClick={() => setIsModalOpen(false)}
                  className="order-2 sm:order-1 rounded-lg border border-[#DDDDDD] bg-white px-4 py-2 text-sm font-medium text-[#666666] hover:bg-[#F7F3FF] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="order-1 sm:order-2 rounded-lg bg-[#9869E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
