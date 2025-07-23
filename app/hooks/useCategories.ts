import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useUIStore } from '../lib/store';
import type { CreateCategoryRequest } from '../../api-types';

// Get all categories
export const useCategories = () => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.getCategories();
      if (response.success) {
        return response.data.categories;
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create new category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const response = await apiClient.createCategory(data);
      if (response.success) {
        return response.data.category;
      } else {
        throw new Error(response.message || 'Failed to create category');
      }
    },
    onSuccess: (category) => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      addNotification({
        type: 'success',
        message: 'Category created successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create category',
        duration: 5000,
      });
    },
  });
};

// Delete category (soft delete)
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.deleteCategory(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete category');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      addNotification({
        type: 'success',
        message: 'Category deleted successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete category',
        duration: 5000,
      });
    },
  });
};

// Restore category (undo soft delete)
export const useRestoreCategory = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.restoreCategory(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to restore category');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      addNotification({
        type: 'success',
        message: 'Category restored successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to restore category',
        duration: 5000,
      });
    },
  });
}; 