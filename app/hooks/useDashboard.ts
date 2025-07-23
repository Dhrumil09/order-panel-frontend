import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useUIStore } from '../lib/store';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../api-types';

// Get dashboard statistics
export const useDashboardStats = () => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await apiClient.getDashboardStats();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats');
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get latest orders
export const useLatestOrders = (limit: number = 5) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['dashboard', 'latest-orders', limit],
    queryFn: async () => {
      const response = await apiClient.getLatestOrders(limit);
      if (response.success) {
        return response.data.orders;
      } else {
        throw new Error(response.message || 'Failed to fetch latest orders');
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
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