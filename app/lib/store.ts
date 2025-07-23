import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Customer, Order, Product, Company, Category } from '../../api-types';

// Check if we're in the browser environment
const isClient = typeof window !== 'undefined';

// ============================================================================
// AUTH STORE
// ============================================================================

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: (token, user) => {
          if (isClient) {
            localStorage.setItem('authToken', token);
          }
          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
          });
        },

        logout: () => {
          if (isClient) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        },

        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        setRefreshToken: (refreshToken) => set({ refreshToken }),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
        // Only persist on client side
        skipHydration: !isClient,
      }
    )
  )
);

// ============================================================================
// UI STORE
// ============================================================================

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    (set, get) => ({
      // State
      sidebarOpen: false,
      theme: 'light',
      notifications: [],

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration
        if (notification.duration) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),
    })
  )
);

// ============================================================================
// CACHE STORE
// ============================================================================

interface CacheState {
  customers: Record<string, Customer>;
  orders: Record<string, Order>;
  products: Record<string, Product>;
  companies: Company[];
  categories: Category[];
  lastUpdated: Record<string, number>;
}

interface CacheActions {
  setCustomer: (customer: Customer) => void;
  setCustomers: (customers: Customer[]) => void;
  removeCustomer: (id: string) => void;
  
  setOrder: (order: Order) => void;
  setOrders: (orders: Order[]) => void;
  removeOrder: (id: string) => void;
  
  setProduct: (product: Product) => void;
  setProducts: (products: Product[]) => void;
  removeProduct: (id: string) => void;
  
  setCompanies: (companies: Company[]) => void;
  setCategories: (categories: Category[]) => void;
  
  updateLastUpdated: (key: string) => void;
  clearCache: () => void;
  isStale: (key: string, maxAge?: number) => boolean;
}

export const useCacheStore = create<CacheState & CacheActions>()(
  devtools(
    (set, get) => ({
      // State
      customers: {},
      orders: {},
      products: {},
      companies: [],
      categories: [],
      lastUpdated: {},

      // Actions
      setCustomer: (customer) =>
        set((state) => ({
          customers: { ...state.customers, [customer.id]: customer },
        })),

      setCustomers: (customers) =>
        set((state) => ({
          customers: customers.reduce(
            (acc, customer) => ({ ...acc, [customer.id]: customer }),
            {}
          ),
        })),

      removeCustomer: (id) =>
        set((state) => {
          const { [id]: removed, ...remaining } = state.customers;
          return { customers: remaining };
        }),

      setOrder: (order) =>
        set((state) => ({
          orders: { ...state.orders, [order.id]: order },
        })),

      setOrders: (orders) =>
        set((state) => ({
          orders: orders.reduce(
            (acc, order) => ({ ...acc, [order.id]: order }),
            {}
          ),
        })),

      removeOrder: (id) =>
        set((state) => {
          const { [id]: removed, ...remaining } = state.orders;
          return { orders: remaining };
        }),

      setProduct: (product) =>
        set((state) => ({
          products: { ...state.products, [product.id]: product },
        })),

      setProducts: (products) =>
        set((state) => ({
          products: products.reduce(
            (acc, product) => ({ ...acc, [product.id]: product }),
            {}
          ),
        })),

      removeProduct: (id) =>
        set((state) => {
          const { [id]: removed, ...remaining } = state.products;
          return { products: remaining };
        }),

      setCompanies: (companies) => set({ companies }),
      setCategories: (categories) => set({ categories }),

      updateLastUpdated: (key) =>
        set((state) => ({
          lastUpdated: { ...state.lastUpdated, [key]: Date.now() },
        })),

      clearCache: () =>
        set({
          customers: {},
          orders: {},
          products: {},
          companies: [],
          categories: [],
          lastUpdated: {},
        }),

      isStale: (key, maxAge = 5 * 60 * 1000) => {
        const state = get();
        const lastUpdated = state.lastUpdated[key];
        return !lastUpdated || Date.now() - lastUpdated > maxAge;
      },
    })
  )
);

// ============================================================================
// DASHBOARD STORE
// ============================================================================

interface DashboardState {
  stats: {
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
  } | null;
  latestOrders: Array<{
    id: string;
    customerName: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    date: string;
    items: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  setStats: (stats: DashboardState['stats']) => void;
  setLatestOrders: (orders: DashboardState['latestOrders']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  devtools(
    (set) => ({
      // State
      stats: null,
      latestOrders: [],
      isLoading: false,
      error: null,

      // Actions
      setStats: (stats) => set({ stats }),
      setLatestOrders: (latestOrders) => set({ latestOrders }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    })
  )
); 