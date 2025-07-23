import type { Product, Company, Category, ProductVariant } from "../../../api-types";

export interface Filters {
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

export interface ProductFormData {
  name: string;
  companyId: string;
  categoryId: string;
  variants: ProductVariant[];
  isOutOfStock: boolean;
  availableInPieces: boolean;
  availableInPack: boolean;
  packSize: number;
}

export interface ProductsHeaderProps {
  onAddProduct: () => void;
  onManage: () => void;
}

export interface ProductsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface CompanyFiltersProps {
  companies: Company[];
  selectedCompanies: string[];
  onCompanyFilter: (companyId: string) => void;
}

export interface ProductsFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearAllFilters: () => void;
  categories: Category[];
  companies: Company[];
}

export interface ProductsSummaryProps {
  filteredCount: number;
  totalCount: number;
  isSearching: boolean;
}

export interface ProductsTableProps {
  products: Product[];
  companies: Company[];
  categories: Category[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export interface ProductsCardsProps {
  products: Product[];
  companies: Company[];
  categories: Category[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export interface ManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  categories: Category[];
  onCreateCompany: (name: string) => Promise<void>;
  onDeleteCompany: (id: string) => Promise<void>;
  onCreateCategory: (name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  editingProduct: Product | null;
  formData: ProductFormData;
  onFormDataChange: (data: ProductFormData) => void;
  companies: Company[];
  categories: Category[];
  onAddVariant: () => void;
  onRemoveVariant: (variantId: string) => void;
  onVariantChange: (variantId: string, field: "name" | "mrp", value: string | number) => void;
} 