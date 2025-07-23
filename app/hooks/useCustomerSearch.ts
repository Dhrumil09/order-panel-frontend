import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useUIStore } from '../lib/store';
import type { CustomerQueryParams } from '../../api-types';

// Search customers with various filters
export const useCustomerSearch = (params?: CustomerQueryParams) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['customer-search', params],
    queryFn: async () => {
      const response = await apiClient.getCustomers(params);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to search customers');
      }
    },
    enabled: !!params?.search || !!params?.status || !!params?.area || !!params?.city,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search customers by name, shop name, or phone (for autocomplete/search suggestions)
export const useCustomerSearchByName = (searchTerm: string, limit: number = 10) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['customer-search-by-name', searchTerm, limit],
    queryFn: async () => {
      const response = await apiClient.getCustomers({
        search: searchTerm,
        limit,
        sortBy: 'shopName',
        sortOrder: 'asc'
      });
      if (response.success) {
        return response.data.customers;
      } else {
        throw new Error(response.message || 'Failed to search customers');
      }
    },
    enabled: searchTerm.length >= 2, // Only search when 2+ characters
    staleTime: 1 * 60 * 1000, // 1 minute for search suggestions
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search customers by area
export const useCustomerSearchByArea = (area: string) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['customer-search-by-area', area],
    queryFn: async () => {
      const response = await apiClient.getCustomers({
        area,
        limit: 50
      });
      if (response.success) {
        return response.data.customers;
      } else {
        throw new Error(response.message || 'Failed to search customers by area');
      }
    },
    enabled: !!area,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search customers by city
export const useCustomerSearchByCity = (city: string) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['customer-search-by-city', city],
    queryFn: async () => {
      const response = await apiClient.getCustomers({
        city,
        limit: 50
      });
      if (response.success) {
        return response.data.customers;
      } else {
        throw new Error(response.message || 'Failed to search customers by city');
      }
    },
    enabled: !!city,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search active customers only
export const useActiveCustomerSearch = (searchTerm?: string, limit: number = 20) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['active-customer-search', searchTerm, limit],
    queryFn: async () => {
      const response = await apiClient.getCustomers({
        search: searchTerm,
        status: 'active',
        limit,
        sortBy: 'shopName',
        sortOrder: 'asc'
      });
      if (response.success) {
        return response.data.customers;
      } else {
        throw new Error(response.message || 'Failed to search active customers');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 