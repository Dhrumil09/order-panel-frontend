// API Client for making HTTP requests - Updated to match Node.js API Specification

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-api-domain.com/api/v1"
    : "http://localhost:3000/api/v1";

// Check if we're in the browser environment
const isClient = typeof window !== "undefined";

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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
    growth: 12.5,
  },
  customers: {
    total: 1235,
    active: 1189,
    newThisMonth: 45,
    growth: 15.2,
  },
  revenue: {
    total: 1250000,
    thisMonth: 89000,
    thisWeek: 25000,
    growth: 8.7,
  },
  products: {
    total: 567,
    outOfStock: 23,
    lowStock: 45,
  },
};

const mockLatestOrders = [
  {
    id: "#12345",
    customerName: "Owen Turner",
    status: "shipped" as const,
    total: 120.0,
    date: "2024-01-15",
    items: 3,
  },
  {
    id: "#12346",
    customerName: "Sophia Mitchell",
    status: "processing" as const,
    total: 85.5,
    date: "2024-01-14",
    items: 2,
  },
  {
    id: "#12347",
    customerName: "Ethan Hayes",
    status: "delivered" as const,
    total: 250.0,
    date: "2024-01-13",
    items: 4,
  },
  {
    id: "#12348",
    customerName: "Ava Bennett",
    status: "shipped" as const,
    total: 150.75,
    date: "2024-01-12",
    items: 2,
  },
  {
    id: "#12349",
    customerName: "Caleb Foster",
    status: "processing" as const,
    total: 90.0,
    date: "2024-01-11",
    items: 1,
  },
];

// Mock user data for development
const mockUser = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
  createdAt: "2024-01-01T00:00:00Z",
};

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Premium Coffee Beans",
    companyId: "1",
    categoryId: "1",
    variants: [
      { id: "1", name: "250g", mrp: 299 },
      { id: "2", name: "500g", mrp: 499 },
    ],
    isOutOfStock: false,
    availableInPieces: true,
    availableInPack: true,
    packSize: 12,
    createdAt: "2024-01-01T00:00:00Z",
    company: { id: "1", name: "Coffee Co." },
    category: { id: "1", name: "Beverages" },
  },
  {
    id: "2",
    name: "Organic Green Tea",
    companyId: "2",
    categoryId: "2",
    variants: [{ id: "1", name: "100g", mrp: 199 }],
    isOutOfStock: true,
    availableInPieces: true,
    availableInPack: false,
    createdAt: "2024-01-01T00:00:00Z",
    company: { id: "2", name: "Healthy Herbs" },
    category: { id: "2", name: "Tea & Infusions" },
  },
];

// Mock companies and categories
const mockCompanies = [
  { id: "1", name: "Coffee Co.", productCount: 15 },
  { id: "2", name: "Healthy Herbs", productCount: 8 },
];

const mockCategories = [
  { id: "1", name: "Beverages", productCount: 25 },
  { id: "2", name: "Tea & Infusions", productCount: 12 },
  { id: "3", name: "Snacks", productCount: 18 },
];

class ApiClient {
  private async refreshTokenIfNeeded(): Promise<string | null> {
    if (!isClient) return null;

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await this.request<
        import("../../api-types").RefreshTokenResponse
      >("/auth/refresh", {
        method: "POST",
        body: { refreshToken },
        retryCount: 0, // Prevent infinite recursion
      });

      if (response.success) {
        localStorage.setItem("authToken", response.data.accessToken);
        return response.data.accessToken;
      }
    } catch (error) {
      // If refresh fails, clear all tokens
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {}, retryCount = 0 } = options;

    const url = `${API_BASE_URL}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add authentication token if available (except for auth endpoints)
    if (!endpoint.startsWith("/auth/") && isClient) {
      const token = localStorage.getItem("authToken");
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    try {
      // For development, return mock data if API is not available
      // if (process.env.NODE_ENV === 'development') {
      //   // Simulate network delay
      //   await new Promise(resolve => setTimeout(resolve, 500));

      //   // Return mock data for auth endpoints
      //   if (endpoint === '/auth/login') {
      //     const credentials = body as { email: string; password: string };
      //     if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      //       return {
      //         success: true,
      //         data: {
      //           accessToken: 'mock-access-token',
      //           refreshToken: 'mock-refresh-token',
      //           user: mockUser
      //         },
      //         message: 'Login successful'
      //       } as T;
      //     } else {
      //       throw new ApiError(401, 'Invalid email or password');
      //     }
      //   }

      //   if (endpoint === '/auth/refresh') {
      //     return {
      //       success: true,
      //       data: {
      //         accessToken: 'new-mock-access-token'
      //       },
      //       message: 'Token refreshed successfully'
      //     } as T;
      //   }

      //   if (endpoint === '/auth/me') {
      //     return {
      //       success: true,
      //       data: {
      //         user: mockUser
      //       },
      //       message: 'User retrieved successfully'
      //     } as T;
      //   }

      //   // Return mock data for dashboard endpoints
      //   if (endpoint === '/dashboard/stats') {
      //     return {
      //       success: true,
      //       data: mockDashboardStats,
      //       message: 'Dashboard stats retrieved successfully'
      //     } as T;
      //   }

      //   if (endpoint.startsWith('/dashboard/latest-orders')) {
      //     return {
      //       success: true,
      //       data: {
      //         orders: mockLatestOrders
      //       },
      //       message: 'Latest orders retrieved successfully'
      //     } as T;
      //   }

      //   // Return mock data for products endpoints
      //   if (endpoint === '/products') {
      //     return {
      //       success: true,
      //       data: {
      //         products: mockProducts,
      //         pagination: {
      //           currentPage: 1,
      //           totalPages: 1,
      //           totalItems: mockProducts.length,
      //           itemsPerPage: 10,
      //           hasNextPage: false,
      //           hasPrevPage: false
      //         }
      //       },
      //       message: 'Products retrieved successfully'
      //     } as T;
      //   }

      //   // Return mock data for companies and categories
      //   if (endpoint === '/companies') {
      //     return {
      //       success: true,
      //       data: {
      //         companies: mockCompanies
      //       },
      //       message: 'Companies retrieved successfully'
      //     } as T;
      //   }

      //   if (endpoint === '/categories') {
      //     return {
      //       success: true,
      //       data: {
      //         categories: mockCategories
      //       },
      //       message: 'Categories retrieved successfully'
      //     } as T;
      //   }
      // }

      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle 401 errors with token refresh
        if (
          response.status === 401 &&
          retryCount === 0 &&
          !endpoint.startsWith("/auth/")
        ) {
          const newToken = await this.refreshTokenIfNeeded();
          if (newToken) {
            // Retry the request with the new token
            return this.request(endpoint, {
              ...options,
              retryCount: retryCount + 1,
            });
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
      // if (process.env.NODE_ENV === "development") {
      //   if (endpoint === "/auth/login") {
      //     const credentials = body as { email: string; password: string };
      //     if (
      //       credentials.email === "admin@example.com" &&
      //       credentials.password === "password"
      //     ) {
      //       return {
      //         success: true,
      //         data: {
      //           accessToken: "mock-access-token",
      //           refreshToken: "mock-refresh-token",
      //           user: mockUser,
      //         },
      //         message: "Login successful (mock data)",
      //       } as T;
      //     } else {
      //       throw new ApiError(401, "Invalid email or password");
      //     }
      //   }

      //   if (endpoint === "/dashboard/stats") {
      //     return {
      //       success: true,
      //       data: mockDashboardStats,
      //       message: "Dashboard stats retrieved successfully (mock data)",
      //     } as T;
      //   }

      //   if (endpoint === "/products") {
      //     return {
      //       success: true,
      //       data: {
      //         products: mockProducts,
      //         pagination: {
      //           currentPage: 1,
      //           totalPages: 1,
      //           totalItems: mockProducts.length,
      //           itemsPerPage: 10,
      //           hasNextPage: false,
      //           hasPrevPage: false,
      //         },
      //       },
      //       message: "Products retrieved successfully (mock data)",
      //     } as T;
      //   }
      // }

      throw new ApiError(0, "Network error", { originalError: error });
    }
  }

  // Authentication APIs
  async login(credentials: import("../../api-types").LoginRequest) {
    return this.request<import("../../api-types").LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: credentials,
      }
    );
  }

  async refreshToken(refreshToken: string) {
    return this.request<import("../../api-types").RefreshTokenResponse>(
      "/auth/refresh",
      {
        method: "POST",
        body: { refreshToken },
      }
    );
  }

  async getCurrentUser() {
    return this.request<import("../../api-types").AuthResponse>("/auth/me");
  }

  async getAllUsers() {
    return this.request<import("../../api-types").UsersResponse>("/auth/users");
  }

  async logout() {
    // For logout, we just clear local storage since the API doesn't require a call
    if (isClient) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    return { success: true, message: "Logged out successfully" };
  }

  // Dashboard APIs
  async getDashboardStats() {
    return this.request<import("../../api-types").DashboardStatsResponse>(
      "/dashboard/stats"
    );
  }

  async getLatestOrders(limit: number = 5) {
    return this.request<import("../../api-types").LatestOrdersResponse>(
      `/dashboard/latest-orders?limit=${limit}`
    );
  }

  // Customer APIs
  async getCustomers(params?: import("../../api-types").CustomerQueryParams) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }
    return this.request<import("../../api-types").CustomersResponse>(
      `/customers?${searchParams.toString()}`
    );
  }

  async getCustomerById(id: string) {
    return this.request<import("../../api-types").CustomerDetailsResponse>(
      `/customers/${id}`
    );
  }

  async createCustomer(data: import("../../api-types").CreateCustomerRequest) {
    return this.request<import("../../api-types").CreateCustomerResponse>(
      "/customers",
      {
        method: "POST",
        body: data,
      }
    );
  }

  async updateCustomer(
    id: string,
    data: import("../../api-types").CreateCustomerRequest
  ) {
    return this.request<import("../../api-types").CreateCustomerResponse>(
      `/customers/${id}`,
      {
        method: "PUT",
        body: data,
      }
    );
  }

  async deleteCustomer(id: string) {
    return this.request<import("../../api-types").DeleteCustomerResponse>(
      `/customers/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async restoreCustomer(id: string) {
    return this.request<import("../../api-types").RestoreCustomerResponse>(
      `/customers/${id}/restore`,
      {
        method: "PATCH",
      }
    );
  }

  async getLocations() {
    return this.request<import("../../api-types").LocationsResponse>(
      "/customers/locations"
    );
  }

  // Order APIs
  async getOrders(params?: import("../../api-types").OrderQueryParams) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<import("../../api-types").OrdersResponse>(
      `/orders?${searchParams.toString()}`
    );
  }

  async getOrderById(id: string) {
    return this.request<import("../../api-types").OrderDetailsResponse>(
      `/orders/${id}`
    );
  }

  async createOrder(data: import("../../api-types").CreateOrderRequest) {
    return this.request<import("../../api-types").CreateOrderResponse>(
      "/orders",
      {
        method: "POST",
        body: data,
      }
    );
  }

  async updateOrderStatus(
    id: string,
    data: import("../../api-types").UpdateOrderStatusRequest
  ) {
    return this.request<import("../../api-types").UpdateOrderStatusResponse>(
      `/orders/${id}/status`,
      {
        method: "PATCH",
        body: data,
      }
    );
  }

  async deleteOrder(id: string) {
    return this.request<import("../../api-types").DeleteOrderResponse>(
      `/orders/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async restoreOrder(id: string) {
    return this.request<import("../../api-types").RestoreOrderResponse>(
      `/orders/${id}/restore`,
      {
        method: "PATCH",
      }
    );
  }

  // Product APIs
  async getProducts(params?: import("../../api-types").ProductQueryParams) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }
    return this.request<import("../../api-types").ProductsResponse>(
      `/products?${searchParams.toString()}`
    );
  }

  async getProductById(id: string) {
    return this.request<import("../../api-types").ProductDetailsResponse>(
      `/products/${id}`
    );
  }

  async createProduct(data: import("../../api-types").CreateProductRequest) {
    return this.request<import("../../api-types").CreateProductResponse>(
      "/products",
      {
        method: "POST",
        body: data,
      }
    );
  }

  async updateProduct(
    id: string,
    data: import("../../api-types").CreateProductRequest
  ) {
    return this.request<import("../../api-types").CreateProductResponse>(
      `/products/${id}`,
      {
        method: "PUT",
        body: data,
      }
    );
  }

  async deleteProduct(id: string) {
    return this.request<import("../../api-types").DeleteProductResponse>(
      `/products/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async restoreProduct(id: string) {
    return this.request<import("../../api-types").RestoreProductResponse>(
      `/products/${id}/restore`,
      {
        method: "PATCH",
      }
    );
  }

  // Company & Category APIs
  async getCompanies() {
    return this.request<import("../../api-types").CompaniesResponse>(
      "/companies"
    );
  }

  async createCompany(data: import("../../api-types").CreateCompanyRequest) {
    return this.request<import("../../api-types").CreateCompanyResponse>(
      "/companies",
      {
        method: "POST",
        body: data,
      }
    );
  }

  async deleteCompany(id: string) {
    return this.request<import("../../api-types").DeleteCompanyResponse>(
      `/companies/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async restoreCompany(id: string) {
    return this.request<import("../../api-types").RestoreCompanyResponse>(
      `/companies/${id}/restore`,
      {
        method: "PATCH",
      }
    );
  }

  async getCategories() {
    return this.request<import("../../api-types").CategoriesResponse>(
      "/categories"
    );
  }

  async createCategory(data: import("../../api-types").CreateCategoryRequest) {
    return this.request<import("../../api-types").CreateCategoryResponse>(
      "/categories",
      {
        method: "POST",
        body: data,
      }
    );
  }

  async deleteCategory(id: string) {
    return this.request<import("../../api-types").DeleteCategoryResponse>(
      `/categories/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async restoreCategory(id: string) {
    return this.request<import("../../api-types").RestoreCategoryResponse>(
      `/categories/${id}/restore`,
      {
        method: "PATCH",
      }
    );
  }

  // Analytics APIs
  async getSalesAnalytics(
    params?: import("../../api-types").AnalyticsQueryParams
  ) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<import("../../api-types").SalesAnalyticsResponse>(
      `/analytics/sales?${searchParams.toString()}`
    );
  }

  async getCustomerAnalytics() {
    return this.request<import("../../api-types").CustomerAnalyticsResponse>(
      "/analytics/customers"
    );
  }

  async getProductAnalytics() {
    return this.request<import("../../api-types").ProductAnalyticsResponse>(
      "/analytics/products"
    );
  }
}

export const apiClient = new ApiClient();
export { ApiError };
