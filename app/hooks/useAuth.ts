import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client';
import { useAuthStore, useUIStore } from '../lib/store';
import type { LoginRequest } from '../../api-types';

// Check if we're in the browser environment
const isClient = typeof window !== 'undefined';

// Check if user is authenticated on app load
export const useAuthCheck = () => {
  const { user, setUser, setToken, setRefreshToken, setAuthenticated, setLoading } = useAuthStore();
  const { addNotification } = useUIStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on client side only
  useEffect(() => {
    if (isClient) {
      setIsInitialized(true);
    }
  }, []);

  return useQuery({
    queryKey: ['auth', 'check'],
    queryFn: async () => {
      // Only run on client side
      if (!isClient) {
        throw new Error('Not in browser environment');
      }

      // Check if we have tokens in localStorage
      const storedToken = localStorage.getItem('authToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (!storedToken || !storedRefreshToken || !storedUser) {
        throw new Error('No authentication data found');
      }

      try {
        // Try to refresh the token
        const response = await apiClient.refreshToken(storedRefreshToken);
        
        if (response.success) {
          // Update tokens
          localStorage.setItem('authToken', response.data.accessToken);
          
          setToken(response.data.accessToken);
          setRefreshToken(storedRefreshToken);
          setUser(JSON.parse(storedUser));
          setAuthenticated(true);
          
          return response.data;
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        // Clear invalid tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        setAuthenticated(false);
        
        throw error;
      }
    },
    enabled: isClient && isInitialized && !user && (!!localStorage.getItem('authToken') || !!localStorage.getItem('refreshToken')),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, clearError } = useAuthStore();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      setLoading(true);
      clearError();
      
      try {
        const response = await apiClient.login(credentials);
        if (response.success) {
          // Store tokens and user data only on client side
          if (isClient) {
            localStorage.setItem('authToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          
          login(response.data.accessToken, response.data.user);
          addNotification({
            type: 'success',
            message: 'Login successful!',
            duration: 3000,
          });
          navigate('/dashboard');
          return response.data;
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        setError(errorMessage);
        addNotification({
          type: 'error',
          message: errorMessage,
          duration: 5000,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    retry: false,
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { addNotification } = useUIStore();

  const handleLogout = async () => {
    try {
      // Call logout API
      await apiClient.logout();
    } catch (error) {
      // Even if API call fails, we should still logout locally
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage only on client side
      if (isClient) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      
      logout();
      addNotification({
        type: 'info',
        message: 'Logged out successfully',
        duration: 3000,
      });
      navigate('/');
    }
  };

  return { logout: handleLogout };
};

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
}; 