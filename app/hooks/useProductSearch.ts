import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useUIStore } from '../lib/store';
import type { ProductQueryParams } from '../../api-types';

// Search products with various filters
export const useProductSearch = (params?: ProductQueryParams) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['product-search', params],
    queryFn: async () => {
      const response = await apiClient.getProducts(params);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to search products');
      }
    },
    enabled: !!params?.search || !!params?.companyId || !!params?.categoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search products by name (for autocomplete/search suggestions)
export const useProductSearchByName = (searchTerm: string, limit: number = 10) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['product-search-by-name', searchTerm, limit],
    queryFn: async () => {
      const response = await apiClient.getProducts({
        search: searchTerm,
        limit,
        sortBy: 'name',
        sortOrder: 'asc'
      });
      if (response.success) {
        return response.data.products;
      } else {
        throw new Error(response.message || 'Failed to search products');
      }
    },
    enabled: searchTerm.length >= 2, // Only search when 2+ characters
    staleTime: 1 * 60 * 1000, // 1 minute for search suggestions
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search products by company
export const useProductSearchByCompany = (companyId: string) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['product-search-by-company', companyId],
    queryFn: async () => {
      const response = await apiClient.getProducts({
        companyId: [companyId],
        limit: 50
      });
      if (response.success) {
        return response.data.products;
      } else {
        throw new Error(response.message || 'Failed to search products by company');
      }
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search products by category
export const useProductSearchByCategory = (categoryId: string) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['product-search-by-category', categoryId],
    queryFn: async () => {
      const response = await apiClient.getProducts({
        categoryId: [categoryId],
        limit: 50
      });
      if (response.success) {
        return response.data.products;
      } else {
        throw new Error(response.message || 'Failed to search products by category');
      }
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 