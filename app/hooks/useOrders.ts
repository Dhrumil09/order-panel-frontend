import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useUIStore } from '../lib/store';
import type { 
  OrderQueryParams, 
  CreateOrderRequest, 
  UpdateOrderStatusRequest,
  Order 
} from '../../api-types';

// Get all orders with filters and pagination
export const useOrders = (params?: OrderQueryParams) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const response = await apiClient.getOrders(params);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single order by ID
export const useOrder = (id: string) => {
  const { addNotification } = useUIStore();

  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await apiClient.getOrderById(id);
      if (response.success) {
        return response.data.order;
      } else {
        throw new Error(response.message || 'Failed to fetch order');
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const response = await apiClient.createOrder(data);
      if (response.success) {
        return response.data.order;
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    },
    onSuccess: (order) => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Add to cache
      queryClient.setQueryData(['order', order.id], order);
      
      addNotification({
        type: 'success',
        message: 'Order created successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create order',
        duration: 5000,
      });
    },
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) => {
      const response = await apiClient.updateOrderStatus(id, data);
      if (response.success) {
        return response.data.order;
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    },
    onSuccess: (order) => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Update cache
      queryClient.setQueryData(['order', order.id], order);
      
      addNotification({
        type: 'success',
        message: 'Order status updated successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update order status',
        duration: 5000,
      });
    },
  });
};

// Delete order (soft delete)
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.deleteOrder(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete order');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      addNotification({
        type: 'success',
        message: 'Order deleted successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete order',
        duration: 5000,
      });
    },
  });
};

// Restore order (undo soft delete)
export const useRestoreOrder = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.restoreOrder(id);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to restore order');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      addNotification({
        type: 'success',
        message: 'Order restored successfully!',
        duration: 3000,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to restore order',
        duration: 5000,
      });
    },
  });
}; 