import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useUIStore } from '../lib/store';
import type { ProductQueryParams, CreateProductRequest } from '../../api-types';

// Get all products with filters and pagination
export const useProducts = (params?: ProductQueryParams) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await apiClient.getProducts(params);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single product by ID
export const useProduct = (id: string) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.getProductById(id);
      if (response.success) {
        return response.data.product;
      } else {
        throw new Error(response.message || 'Failed to fetch product');
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (data: CreateProductRequest) => {
      const response = await apiClient.createProduct(data);
      if (response.success) {
        return response.data.product;
      } else {
        throw new Error(response.message || 'Failed to create product');
      }
    },
    onSuccess: (product) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      // Add to cache
      queryClient.setQueryData(['product', product.id], product);
      
      addNotification({
        type: 'success',
        message: 'Product created successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create product',
        duration: 5000,
      });
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateProductRequest }) => {
      const response = await apiClient.updateProduct(id, data);
      if (response.success) {
        return response.data.product;
      } else {
        throw new Error(response.message || 'Failed to update product');
      }
    },
    onSuccess: (product) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      // Update cache
      queryClient.setQueryData(['product', product.id], product);
      
      addNotification({
        type: 'success',
        message: 'Product updated successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update product',
        duration: 5000,
      });
    },
  });
};

// Delete product (soft delete)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.deleteProduct(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      addNotification({
        type: 'success',
        message: 'Product deleted successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete product',
        duration: 5000,
      });
    },
  });
};

// Restore product (undo soft delete)
export const useRestoreProduct = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.restoreProduct(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to restore product');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      addNotification({
        type: 'success',
        message: 'Product restored successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to restore product',
        duration: 5000,
      });
    },
  });
}; 