import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useUIStore } from '../lib/store';
import type { 
  CustomerQueryParams, 
  CreateCustomerRequest, 
  Customer 
} from '../../api-types';

// Get all customers with filters and pagination
export const useCustomers = (params?: CustomerQueryParams) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const response = await apiClient.getCustomers(params);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch customers');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single customer by ID
export const useCustomer = (id: string) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const response = await apiClient.getCustomerById(id);
      if (response.success) {
        return response.data.customer;
      } else {
        throw new Error(response.message || 'Failed to fetch customer');
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create new customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (data: CreateCustomerRequest) => {
      const response = await apiClient.createCustomer(data);
      if (response.success) {
        return response.data.customer;
      } else {
        throw new Error(response.message || 'Failed to create customer');
      }
    },
    onSuccess: (customer) => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      // Add to cache
      queryClient.setQueryData(['customer', customer.id], customer);
      
      addNotification({
        type: 'success',
        message: 'Customer created successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create customer',
        duration: 5000,
      });
    },
  });
};

// Update customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateCustomerRequest }) => {
      const response = await apiClient.updateCustomer(id, data);
      if (response.success) {
        return response.data.customer;
      } else {
        throw new Error(response.message || 'Failed to update customer');
      }
    },
    onSuccess: (customer) => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      // Update cache
      queryClient.setQueryData(['customer', customer.id], customer);
      
      addNotification({
        type: 'success',
        message: 'Customer updated successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update customer',
        duration: 5000,
      });
    },
  });
};

// Delete customer (soft delete)
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.deleteCustomer(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete customer');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      addNotification({
        type: 'success',
        message: 'Customer deleted successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete customer',
        duration: 5000,
      });
    },
  });
};

// Restore customer (undo soft delete)
export const useRestoreCustomer = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.restoreCustomer(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to restore customer');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      addNotification({
        type: 'success',
        message: 'Customer restored successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to restore customer',
        duration: 5000,
      });
    },
  });
};

// Get locations data for filters
export const useLocations = () => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await apiClient.getLocations();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch locations');
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 