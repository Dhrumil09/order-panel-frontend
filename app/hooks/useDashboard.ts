import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useDashboardStore } from '../lib/store';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../api-types';

// ============================================================================
// DASHBOARD STATS QUERY
// ============================================================================

export const useDashboardStats = () => {
  const { setStats, setLoading, setError, clearError } = useDashboardStore();

  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      setLoading(true);
      clearError();
      
      try {
        const response = await apiClient.getDashboardStats();
        if (response.success) {
          setStats(response.data);
          return response.data;
        } else {
          throw new Error('Failed to fetch dashboard stats');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && error.message.includes('HTTP 4')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// ============================================================================
// LATEST ORDERS QUERY
// ============================================================================

export const useLatestOrders = (limit: number = 5) => {
  const { setLatestOrders, setError, clearError } = useDashboardStore();

  return useQuery({
    queryKey: ['dashboard', 'latest-orders', limit],
    queryFn: async () => {
      clearError();
      
      try {
        const response = await apiClient.getLatestOrders(limit);
        if (response.success) {
          setLatestOrders(response.data.orders);
          return response.data.orders;
        } else {
          throw new Error('Failed to fetch latest orders');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('HTTP 4')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// ============================================================================
// DASHBOARD DATA HOOK
// ============================================================================

export const useDashboardData = () => {
  const statsQuery = useDashboardStats();
  const ordersQuery = useLatestOrders();

  const isLoading = statsQuery.isLoading || ordersQuery.isLoading;
  const isError = statsQuery.isError || ordersQuery.isError;
  const error = statsQuery.error || ordersQuery.error;

  return {
    stats: statsQuery.data,
    latestOrders: ordersQuery.data,
    isLoading,
    isError,
    error,
    refetch: () => {
      statsQuery.refetch();
      ordersQuery.refetch();
    },
  };
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export const useOrderStatus = (status: string) => {
  return {
    color: ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || 'bg-gray-500 text-white',
    label: ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status,
  };
};

export const useDashboardRefresh = () => {
  const statsQuery = useDashboardStats();
  const ordersQuery = useLatestOrders();

  const refreshAll = () => {
    statsQuery.refetch();
    ordersQuery.refetch();
  };

  const refreshStats = () => {
    statsQuery.refetch();
  };

  const refreshOrders = () => {
    ordersQuery.refetch();
  };

  return {
    refreshAll,
    refreshStats,
    refreshOrders,
    isRefetching: statsQuery.isRefetching || ordersQuery.isRefetching,
  };
}; 