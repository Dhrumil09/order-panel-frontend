import { useState, useEffect } from "react";
import AdminLayout from "~/components/AdminLayout";
import { createPageMeta } from "~/utils/meta";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "~/hooks/useProducts";
import {
  useCompanies,
  useCreateCompany,
  useDeleteCompany,
} from "~/hooks/useCompanies";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "~/hooks/useCategories";
import {
  ProductsHeader,
  ProductsSearch,
  CompanyFilters,
  ProductsFilters,
  ProductsSummary,
  ProductsTable,
  ProductsCards,
  ManageModal,
  ProductFormModal,
  initialFormData,
  initialFilters,
  filterProducts,
  type Filters,
  type ProductFormData,
} from "~/components/products";
import type { Product } from "../../api-types";

export function meta() {
  return createPageMeta("Products", "Manage products.");
}

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search term to prevent excessive API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API hooks
  const { data: productsData, isLoading: productsLoading } = useProducts({
    search: debouncedSearchTerm || undefined,
    companyId:
      filters.selectedCompanies.length > 0
        ? filters.selectedCompanies
        : undefined,
    categoryId:
      filters.selectedCategories.length > 0
        ? filters.selectedCategories
        : undefined,
    stockStatus:
      filters.stockStatus !== "all" ? filters.stockStatus : undefined,
    availability:
      filters.availability !== "all" ? filters.availability : undefined,
    minPrice: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
    maxPrice:
      filters.priceRange.max < 100000 ? filters.priceRange.max : undefined,
    sizeFilter: filters.sizeFilter || undefined,
  });

  // Show loading state when search term changes but debounced term hasn't updated yet
  const isSearching = searchTerm !== debouncedSearchTerm;

  const { data: companies = [] } = useCompanies();
  const { data: categories = [] } = useCategories();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const createCompanyMutation = useCreateCompany();
  const deleteCompanyMutation = useDeleteCompany();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const products = productsData?.products || [];

  // Filter products based on search and filters
  const filteredProducts = filterProducts(
    products,
    searchTerm,
    filters,
    companies,
    categories
  );

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

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleSaveProduct = async () => {
    if (
      !formData.name ||
      !formData.companyId ||
      !formData.categoryId ||
      formData.variants.length === 0
    ) {
      return;
    }

    const productData = {
      name: formData.name,
      companyId: formData.companyId,
      categoryId: formData.categoryId,
      variants: formData.variants,
      isOutOfStock: formData.isOutOfStock,
      availableInPieces: formData.availableInPieces,
      availableInPack: formData.availableInPack,
      packSize: formData.availableInPack ? formData.packSize : undefined,
    };

    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          data: productData,
        });
      } else {
        await createProductMutation.mutateAsync(productData);
      }

      setIsModalOpen(false);
      setFormData(initialFormData);
      setEditingProduct(null);
    } catch (error) {
      // Error handling is done in the mutation
    }
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
  const handleCreateCompany = async (name: string) => {
    await createCompanyMutation.mutateAsync({ name });
  };

  const handleDeleteCompany = async (companyId: string) => {
    await deleteCompanyMutation.mutateAsync(companyId);
  };

  // Category management functions
  const handleCreateCategory = async (name: string) => {
    await createCategoryMutation.mutateAsync({ name });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategoryMutation.mutateAsync(categoryId);
  };

  const handleCompanyFilter = (companyId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(companyId)
        ? prev.selectedCompanies.filter((id) => id !== companyId)
        : [...prev.selectedCompanies, companyId],
    }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <AdminLayout>
      <ProductsHeader onAddProduct={handleAddProduct} onManage={() => setIsManageModalOpen(true)} />

      <ProductsSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <CompanyFilters
        companies={companies}
        selectedCompanies={filters.selectedCompanies}
        onCompanyFilter={handleCompanyFilter}
      />

      <ProductsFilters
        filters={filters}
        onFiltersChange={setFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearAllFilters={clearAllFilters}
        categories={categories}
        companies={companies}
      />

      <ProductsSummary
        filteredCount={filteredProducts.length}
        totalCount={products.length}
        isSearching={isSearching}
      />

      {/* Products list */}
      <div className="rounded-xl border border-[#DDDDDD] bg-white relative">
        {(productsLoading || isSearching) && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9869E0] mx-auto mb-2"></div>
              <p className="text-sm text-[#666666]">
                {isSearching ? "Searching..." : "Loading products..."}
              </p>
            </div>
          </div>
        )}
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            </div>
            <p className="text-sm text-[#666666]">
              {searchTerm || Object.values(filters).some(v => v !== initialFilters[v as keyof Filters])
                ? "No products found matching your search criteria."
                : "No products added yet. Create your first product!"}
            </p>
          </div>
        ) : (
          <>
            <ProductsTable
              products={filteredProducts}
              companies={companies}
              categories={categories}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />

            <ProductsCards
              products={filteredProducts}
              companies={companies}
              categories={categories}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </>
        )}
      </div>

      <ManageModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        companies={companies}
        categories={categories}
        onCreateCompany={handleCreateCompany}
        onDeleteCompany={handleDeleteCompany}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        formData={formData}
        onFormDataChange={setFormData}
        companies={companies}
        categories={categories}
        onAddVariant={handleAddVariant}
        onRemoveVariant={handleRemoveVariant}
        onVariantChange={handleVariantChange}
      />
    </AdminLayout>
  );
}
