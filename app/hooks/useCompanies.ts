import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useUIStore } from '../lib/store';
import type { CreateCompanyRequest } from '../../api-types';

// Get all companies
export const useCompanies = () => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await apiClient.getCompanies();
      if (response.success) {
        return response.data.companies;
      } else {
        throw new Error(response.message || 'Failed to fetch companies');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create new company
export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (data: CreateCompanyRequest) => {
      const response = await apiClient.createCompany(data);
      if (response.success) {
        return response.data.company;
      } else {
        throw new Error(response.message || 'Failed to create company');
      }
    },
    onSuccess: (company) => {
      // Invalidate and refetch companies list
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      addNotification({
        type: 'success',
        message: 'Company created successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create company',
        duration: 5000,
      });
    },
  });
};

// Delete company (soft delete)
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.deleteCompany(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete company');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch companies list
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      addNotification({
        type: 'success',
        message: 'Company deleted successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete company',
        duration: 5000,
      });
    },
  });
};

// Restore company (undo soft delete)
export const useRestoreCompany = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.restoreCompany(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to restore company');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch companies list
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      addNotification({
        type: 'success',
        message: 'Company restored successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to restore company',
        duration: 5000,
      });
    },
  });
}; 