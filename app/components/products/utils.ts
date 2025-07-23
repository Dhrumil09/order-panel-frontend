import type { Product, Company, Category } from "../../../api-types";
import type { Filters } from "./types";

export const MAX_PRICE = 100000;

export const initialFormData = {
  name: "",
  companyId: "",
  categoryId: "",
  variants: [{ id: "1", name: "", mrp: 0 }],
  isOutOfStock: false,
  availableInPieces: true,
  availableInPack: false,
  packSize: 1,
};

export const initialFilters: Filters = {
  selectedCompanies: [],
  selectedCategories: [],
  priceRange: { min: 0, max: MAX_PRICE },
  stockStatus: "all",
  sizeFilter: "",
  availability: "all",
};

export const getCompanyName = (companyId: string, companies: Company[]) => {
  return companies.find((c) => c.id === companyId)?.name || "Unknown";
};

export const getCategoryName = (categoryId: string, categories: Category[]) => {
  return categories.find((c) => c.id === categoryId)?.name || "Unknown";
};

export const getActiveFilterCount = (filters: Filters) => {
  let count = 0;
  if (filters.selectedCompanies.length > 0) count++;
  if (filters.selectedCategories.length > 0) count++;
  if (filters.stockStatus !== "all") count++;
  if (filters.sizeFilter) count++;
  if (filters.availability !== "all") count++;
  if (filters.priceRange.min > 0 || filters.priceRange.max < MAX_PRICE)
    count++;
  return count;
};

export const filterProducts = (
  products: Product[],
  searchTerm: string,
  filters: Filters,
  companies: Company[],
  categories: Category[]
) => {
  return products.filter((product) => {
    // Text search
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCompanyName(product.companyId, companies)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getCategoryName(product.categoryId, categories)
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
}; 