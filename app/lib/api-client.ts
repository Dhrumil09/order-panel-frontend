// API Client for making HTTP requests

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api/v1'
  : 'http://localhost:3000/api/v1';

// Check if we're in the browser environment
const isClient = typeof window !== 'undefined';

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  retryCount?: number;
}

// Mock data for development
const mockDashboardStats = {
  orders: {
    total: 2315,
    today: 12,
    thisWeek: 89,
    thisMonth: 345,
    growth: 12.5
  },
  customers: {
    total: 1235,
    active: 1189,
    newThisMonth: 45,
    growth: 15.2
  },
  revenue: {
    total: 1250000,
    thisMonth: 89000,
    thisWeek: 25000,
    growth: 8.7
  },
  products: {
    total: 567,
    outOfStock: 23,
    lowStock: 45
  }
};

const mockLatestOrders = [
  {
    id: "#12345",
    customerName: "Owen Turner",
    status: "shipped" as const,
    total: 120.00,
    date: "2024-01-15",
    items: 3
  },
  {
    id: "#12346",
    customerName: "Sophia Mitchell",
    status: "processing" as const,
    total: 85.50,
    date: "2024-01-14",
    items: 2
  },
  {
    id: "#12347",
    customerName: "Ethan Hayes",
    status: "delivered" as const,
    total: 250.00,
    date: "2024-01-13",
    items: 4
  },
  {
    id: "#12348",
    customerName: "Ava Bennett",
    status: "shipped" as const,
    total: 150.75,
    date: "2024-01-12",
    items: 2
  },
  {
    id: "#12349",
    customerName: "Caleb Foster",
    status: "processing" as const,
    total: 90.00,
    date: "2024-01-11",
    items: 1
  }
];

// Mock user data for development
const mockUser = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin" as const,
  createdAt: "2024-01-01T00:00:00Z"
};

class ApiClient {
  private async refreshTokenIfNeeded(): Promise<string | null> {
    if (!isClient) return null;
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await this.request<import('../../api-types').RefreshTokenResponse>('/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
        retryCount: 0, // Prevent infinite recursion
      });

      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data.token;
      }
    } catch (error) {
      // If refresh fails, clear all tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }

    return null;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, retryCount = 0 } = options;

    const url = `${API_BASE_URL}${endpoint}`;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add authentication token if available (except for auth endpoints)
    if (!endpoint.startsWith('/auth/') && isClient) {
      const token = localStorage.getItem('authToken');
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      // For development, return mock data if API is not available
      if (process.env.NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock data for auth endpoints
        if (endpoint === '/auth/login') {
          const credentials = body as { email: string; password: string };
          if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
            return {
              success: true,
              data: {
                user: mockUser,
                token: 'mock-jwt-token',
                refreshToken: 'mock-refresh-token'
              },
              message: 'Login successful'
            } as T;
          } else {
            throw new ApiError(401, 'Invalid email or password');
          }
        }
        
        if (endpoint === '/auth/logout') {
          return {
            success: true,
            message: 'Logout successful'
          } as T;
        }
        
        if (endpoint === '/auth/refresh') {
          return {
            success: true,
            data: {
              token: 'new-mock-jwt-token',
              refreshToken: 'new-mock-refresh-token'
            },
            message: 'Token refreshed successfully'
          } as T;
        }
        
        // Return mock data for dashboard endpoints
        if (endpoint === '/dashboard/stats') {
          return {
            success: true,
            data: mockDashboardStats,
            message: 'Dashboard stats retrieved successfully'
          } as T;
        }
        
        if (endpoint.startsWith('/dashboard/latest-orders')) {
          return {
            success: true,
            data: {
              orders: mockLatestOrders
            },
            message: 'Latest orders retrieved successfully'
          } as T;
        }
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Handle 401 errors with token refresh
        if (response.status === 401 && retryCount === 0 && !endpoint.startsWith('/auth/')) {
          const newToken = await this.refreshTokenIfNeeded();
          if (newToken) {
            // Retry the request with the new token
            return this.request(endpoint, { ...options, retryCount: retryCount + 1 });
          }
        }

        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP ${response.status}`,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // For development, return mock data on network errors
      if (process.env.NODE_ENV === 'development') {
        if (endpoint === '/auth/login') {
          const credentials = body as { email: string; password: string };
          if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
            return {
              success: true,
              data: {
                user: mockUser,
                token: 'mock-jwt-token',
                refreshToken: 'mock-refresh-token'
              },
              message: 'Login successful (mock data)'
            } as T;
          } else {
            throw new ApiError(401, 'Invalid email or password');
          }
        }
        
        if (endpoint === '/dashboard/stats') {
          return {
            success: true,
            data: mockDashboardStats,
            message: 'Dashboard stats retrieved successfully (mock data)'
          } as T;
        }
        
        if (endpoint.startsWith('/dashboard/latest-orders')) {
          return {
            success: true,
            data: {
              orders: mockLatestOrders
            },
            message: 'Latest orders retrieved successfully (mock data)'
          } as T;
        }
      }
      
      throw new ApiError(0, 'Network error', { originalError: error });
    }
  }

  // Authentication APIs
  async login(credentials: import('../../api-types').LoginRequest) {
    return this.request<import('../../api-types').LoginResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<import('../../api-types').RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
  }

  async logout() {
    return this.request<import('../../api-types').LogoutResponse>('/auth/logout', {
      method: 'POST',
    });
  }

  // Dashboard APIs
  async getDashboardStats() {
    return this.request<import('../../api-types').DashboardStatsResponse>('/dashboard/stats');
  }

  async getLatestOrders(limit: number = 5) {
    return this.request<import('../../api-types').LatestOrdersResponse>(`/dashboard/latest-orders?limit=${limit}`);
  }

  // Customer APIs
  async getCustomers(params?: import('../../api-types').CustomerQueryParams) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<import('../../api-types').CustomersResponse>(`/customers?${searchParams.toString()}`);
  }

  async getCustomerById(id: string) {
    return this.request<import('../../api-types').CustomerDetailsResponse>(`/customers/${id}`);
  }

  async createCustomer(data: import('../../api-types').CreateCustomerRequest) {
    return this.request<import('../../api-types').CreateCustomerResponse>('/customers', {
      method: 'POST',
      body: data,
    });
  }

  async updateCustomer(id: string, data: import('../../api-types').CreateCustomerRequest) {
    return this.request<import('../../api-types').CreateCustomerResponse>(`/customers/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteCustomer(id: string) {
    return this.request<import('../../api-types').DeleteCustomerResponse>(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  async getLocations() {
    return this.request<import('../../api-types').LocationsResponse>('/customers/locations');
  }

  // Order APIs
  async getOrders(params?: import('../../api-types').OrderQueryParams) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<import('../../api-types').OrdersResponse>(`/orders?${searchParams.toString()}`);
  }

  async getOrderById(id: string) {
    return this.request<import('../../api-types').OrderDetailsResponse>(`/orders/${id}`);
  }

  async createOrder(data: import('../../api-types').CreateOrderRequest) {
    return this.request<import('../../api-types').CreateOrderResponse>('/orders', {
      method: 'POST',
      body: data,
    });
  }

  async updateOrderStatus(id: string, data: import('../../api-types').UpdateOrderStatusRequest) {
    return this.request<import('../../api-types').UpdateOrderStatusResponse>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteOrder(id: string) {
    return this.request<import('../../api-types').DeleteOrderResponse>(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Product APIs
  async getProducts(params?: import('../../api-types').ProductQueryParams) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<import('../../api-types').ProductsResponse>(`/products?${searchParams.toString()}`);
  }

  async getProductById(id: string) {
    return this.request<import('../../api-types').ProductDetailsResponse>(`/products/${id}`);
  }

  async createProduct(data: import('../../api-types').CreateProductRequest) {
    return this.request<import('../../api-types').CreateProductResponse>('/products', {
      method: 'POST',
      body: data,
    });
  }

  async updateProduct(id: string, data: import('../../api-types').CreateProductRequest) {
    return this.request<import('../../api-types').CreateProductResponse>(`/products/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteProduct(id: string) {
    return this.request<import('../../api-types').DeleteProductResponse>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Company & Category APIs
  async getCompanies() {
    return this.request<import('../../api-types').CompaniesResponse>('/companies');
  }

  async createCompany(data: import('../../api-types').CreateCompanyRequest) {
    return this.request<import('../../api-types').CreateCompanyResponse>('/companies', {
      method: 'POST',
      body: data,
    });
  }

  async deleteCompany(id: string) {
    return this.request<import('../../api-types').DeleteCompanyResponse>(`/companies/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories() {
    return this.request<import('../../api-types').CategoriesResponse>('/categories');
  }

  async createCategory(data: import('../../api-types').CreateCategoryRequest) {
    return this.request<import('../../api-types').CreateCategoryResponse>('/categories', {
      method: 'POST',
      body: data,
    });
  }

  async deleteCategory(id: string) {
    return this.request<import('../../api-types').DeleteCategoryResponse>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics APIs
  async getSalesAnalytics(params?: import('../../api-types').AnalyticsQueryParams) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<import('../../api-types').SalesAnalyticsResponse>(`/analytics/sales?${searchParams.toString()}`);
  }

  async getCustomerAnalytics() {
    return this.request<import('../../api-types').CustomerAnalyticsResponse>('/analytics/customers');
  }

  async getProductAnalytics() {
    return this.request<import('../../api-types').ProductAnalyticsResponse>('/analytics/products');
  }
}

export const apiClient = new ApiClient();
export { ApiError }; 