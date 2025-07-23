// API Types for Admin Panel - Updated to match Node.js API Specification

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
  message: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
    };
  };
  message: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: Array<{
      id: string;
      email: string;
      name: string;
      createdAt: string;
    }>;
  };
  message: string;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardStatsResponse {
  success: boolean;
  data: {
    orders: {
      total: number;
      today: number;
      thisWeek: number;
      thisMonth: number;
      growth: number;
    };
    customers: {
      total: number;
      active: number;
      newThisMonth: number;
      growth: number;
    };
    revenue: {
      total: number;
      thisMonth: number;
      thisWeek: number;
      growth: number;
    };
    products: {
      total: number;
      outOfStock: number;
      lowStock: number;
    };
  };
  message: string;
}

export interface LatestOrdersResponse {
  success: boolean;
  data: {
    orders: Array<{
      id: string;
      customerName: string;
      status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
      total: number;
      date: string;
      items: number;
    }>;
  };
  message: string;
}

// ============================================================================
// CUSTOMER TYPES
// ============================================================================

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "pending";
  area?: string;
  city?: string;
  state?: string;
  sortBy?: "shopName" | "ownerName" | "registrationDate" | "totalOrders";
  sortOrder?: "asc" | "desc";
}

export interface Customer {
  id: string;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  status: "active" | "inactive" | "pending";
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CustomersResponse {
  success: boolean;
  data: {
    customers: Customer[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message: string;
}

export interface CustomerDetailsResponse {
  success: boolean;
  data: {
    customer: Customer & {
      orders: Array<{
        id: string;
        date: string;
        status: string;
        total: number;
        items: number;
      }>;
    };
  };
  message: string;
}

export interface CreateCustomerRequest {
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  status: "active" | "inactive" | "pending";
  notes?: string;
}

export interface CreateCustomerResponse {
  success: boolean;
  data: {
    customer: Customer;
  };
  message: string;
}

export interface DeleteCustomerResponse {
  success: boolean;
  message: string;
}

export interface RestoreCustomerResponse {
  success: boolean;
  message: string;
}

export interface LocationsResponse {
  success: boolean;
  data: {
    states: Array<{
      name: string;
      cities: Array<{
        name: string;
        areas: string[];
      }>;
    }>;
  };
  message: string;
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  dateFilter?: "today" | "yesterday" | "last7days" | "last30days" | "custom";
  startDate?: string;
  endDate?: string;
  sortBy?: "customerName" | "date" | "status";
  sortOrder?: "asc" | "desc";
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  productId?: string;
  boxes?: number;
  pieces?: number;
  pack?: number;
  packSize?: number;
  availableInPieces?: boolean;
  availableInPack?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerAddress: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
  customerEmail?: string;
  customerPhone?: string;
  orderItems: OrderItem[];
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  total: number;
  createdBy?: string;
  updatedBy?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message: string;
}

export interface OrderDetailsResponse {
  success: boolean;
  data: {
    order: Order & {
      customer: {
        id: string;
        shopName: string;
        ownerName: string;
        ownerPhone: string;
        ownerEmail: string;
      };
    };
  };
  message: string;
}

export interface CreateOrderRequest {
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  orderItems: Array<{
    productId: string;
    quantity: number;
    boxes?: number;
    pieces?: number;
    pack?: number;
  }>;
  shippingMethod?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
  message: string;
}

export interface UpdateOrderStatusRequest {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  notes?: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  data: {
    order: {
      id: string;
      status: string;
      trackingNumber?: string;
      notes?: string;
      updatedAt: string;
    };
  };
  message: string;
}

export interface DeleteOrderResponse {
  success: boolean;
  message: string;
}

export interface RestoreOrderResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string[];
  categoryId?: string[];
  stockStatus?: "in-stock" | "out-of-stock";
  availability?: "pieces" | "pack" | "both";
  minPrice?: number;
  maxPrice?: number;
  sizeFilter?: string;
  sortBy?: "name" | "createdAt" | "price";
  sortOrder?: "asc" | "desc";
}

export interface ProductVariant {
  id: string;
  name: string;
  mrp: number;
}

export interface Product {
  id: string;
  name: string;
  companyId: string;
  categoryId: string;
  variants: ProductVariant[];
  isOutOfStock: boolean;
  availableInPieces: boolean;
  availableInPack: boolean;
  packSize?: number;
  createdAt: string;
  company: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message: string;
}

export interface ProductDetailsResponse {
  success: boolean;
  data: {
    product: Product;
  };
  message: string;
}

export interface CreateProductRequest {
  name: string;
  companyId: string;
  categoryId: string;
  variants: Array<{
    name: string;
    mrp: number;
  }>;
  isOutOfStock: boolean;
  availableInPieces: boolean;
  availableInPack: boolean;
  packSize?: number;
}

export interface CreateProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
  message: string;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

export interface RestoreProductResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// COMPANY & CATEGORY TYPES
// ============================================================================

export interface Company {
  id: string;
  name: string;
  productCount: number;
}

export interface CompaniesResponse {
  success: boolean;
  data: {
    companies: Company[];
  };
  message: string;
}

export interface CreateCompanyRequest {
  name: string;
}

export interface CreateCompanyResponse {
  success: boolean;
  data: {
    company: {
      id: string;
      name: string;
    };
  };
  message: string;
}

export interface DeleteCompanyResponse {
  success: boolean;
  message: string;
}

export interface RestoreCompanyResponse {
  success: boolean;
  message: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
  message: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface CreateCategoryResponse {
  success: boolean;
  data: {
    category: {
      id: string;
      name: string;
    };
  };
  message: string;
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

export interface RestoreCategoryResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsQueryParams {
  period?: "day" | "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
}

export interface SalesAnalyticsResponse {
  success: boolean;
  data: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    growthRate: number;
    dailyData: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
    topProducts: Array<{
      productId: string;
      productName: string;
      quantity: number;
      revenue: number;
    }>;
    topCustomers: Array<{
      customerId: string;
      customerName: string;
      orders: number;
      revenue: number;
    }>;
  };
  message: string;
}

export interface CustomerAnalyticsResponse {
  success: boolean;
  data: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    customerGrowth: number;
    customerRetention: number;
    topAreas: Array<{
      area: string;
      customerCount: number;
    }>;
    customerStatus: {
      active: number;
      inactive: number;
      pending: number;
    };
  };
  message: string;
}

export interface ProductAnalyticsResponse {
  success: boolean;
  data: {
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
    topSellingProducts: Array<{
      productId: string;
      productName: string;
      sales: number;
      revenue: number;
    }>;
    categoryPerformance: Array<{
      categoryId: string;
      categoryName: string;
      productCount: number;
      sales: number;
    }>;
    companyPerformance: Array<{
      companyId: string;
      companyName: string;
      productCount: number;
      sales: number;
    }>;
  };
  message: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ValidationError {
  success: false;
  error: {
    type: "VALIDATION_ERROR";
    message: string;
    details: Array<{
      field: string;
      message: string;
    }>;
  };
}

export interface AuthenticationError {
  success: false;
  error: {
    type: "AUTHENTICATION_ERROR";
    message: string;
  };
}

export interface AuthorizationError {
  success: false;
  error: {
    type: "AUTHORIZATION_ERROR";
    message: string;
  };
}

export interface NotFoundError {
  success: false;
  error: {
    type: "NOT_FOUND";
    message: string;
  };
}

export interface ServerError {
  success: false;
  error: {
    type: "SERVER_ERROR";
    message: string;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
} as const;

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
} as const;

export const CUSTOMER_STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
} as const;

export const CUSTOMER_STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
} as const; 