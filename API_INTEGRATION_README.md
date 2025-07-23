# API Integration Documentation

This document outlines the complete API integration setup for the S-Kumar Admin Panel using React Query, Zustand, and the comprehensive API specification.

## 📁 Folder Structure

```
app/
├── lib/
│   ├── api-client.ts          # API client for HTTP requests
│   └── store.ts              # Zustand stores for state management
├── hooks/
│   └── useDashboard.ts       # React Query hooks for dashboard
├── components/
│   └── dashboard/
│       ├── DashboardStats.tsx # Dashboard statistics component
│       └── LatestOrders.tsx   # Latest orders component
├── providers/
│   └── QueryProvider.tsx     # React Query provider
└── routes/
    └── dashboard.tsx         # Updated dashboard page
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools zustand
```

### 2. Setup React Query Provider

Wrap your app with the QueryProvider in your root component:

```tsx
import QueryProvider from './providers/QueryProvider';

function App() {
  return (
    <QueryProvider>
      {/* Your app components */}
    </QueryProvider>
  );
}
```

### 3. Configure API Base URL

Update the API base URL in `app/lib/api-client.ts`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api/v1'
  : 'http://localhost:3000/api/v1';
```

## 🔧 API Client

The `apiClient` provides a centralized way to make HTTP requests with:

- **Authentication**: Automatic Bearer token inclusion
- **Error Handling**: Custom ApiError class with status codes
- **Type Safety**: Full TypeScript support with API types
- **Request/Response Interceptors**: Built-in error handling

### Usage Example:

```typescript
import { apiClient } from '../lib/api-client';

// Get dashboard stats
const stats = await apiClient.getDashboardStats();

// Get customers with filters
const customers = await apiClient.getCustomers({
  page: 1,
  limit: 10,
  search: 'electronics',
  status: 'active'
});
```

## 📊 Zustand Stores

### Auth Store
Manages authentication state with persistence:

```typescript
import { useAuthStore } from '../lib/store';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

### UI Store
Manages UI state like sidebar, theme, and notifications:

```typescript
import { useUIStore } from '../lib/store';

const { sidebarOpen, theme, toggleSidebar, addNotification } = useUIStore();
```

### Cache Store
Manages cached data for better performance:

```typescript
import { useCacheStore } from '../lib/store';

const { customers, setCustomers, isStale } = useCacheStore();
```

### Dashboard Store
Manages dashboard-specific state:

```typescript
import { useDashboardStore } from '../lib/store';

const { stats, latestOrders, setStats } = useDashboardStore();
```

## 🎣 React Query Hooks

### Dashboard Hooks

```typescript
import { useDashboardData, useDashboardRefresh } from '../hooks/useDashboard';

function Dashboard() {
  const { stats, latestOrders, isLoading, isError } = useDashboardData();
  const { refreshAll, isRefetching } = useDashboardRefresh();
  
  // Your component logic
}
```

### Available Hooks

- `useDashboardStats()` - Fetch dashboard statistics
- `useLatestOrders(limit)` - Fetch latest orders
- `useDashboardData()` - Combined dashboard data
- `useDashboardRefresh()` - Refresh functions
- `useOrderStatus(status)` - Get status styling

## 🎨 Components

### DashboardStats Component

Displays real-time statistics with:
- Loading states with skeleton UI
- Error handling with fallback UI
- Responsive design for mobile/desktop
- Growth indicators with color coding

### LatestOrders Component

Shows recent orders with:
- Clickable orders that navigate to order details
- Status badges with proper styling
- Mobile card view and desktop table view
- Loading and error states

## 🔄 Data Flow

1. **Component Mount** → React Query hook called
2. **API Request** → apiClient makes HTTP request
3. **Response** → Data stored in Zustand store
4. **UI Update** → Component re-renders with new data
5. **Cache** → Data cached for subsequent requests

## 🛠️ Error Handling

### API Errors
- **4xx Errors**: No retry, show user-friendly message
- **5xx Errors**: Retry up to 3 times
- **Network Errors**: Show connection error message

### Component Error States
- Loading skeletons during data fetch
- Error messages with retry options
- Empty states for no data

## 📱 Responsive Design

All components are fully responsive:
- **Mobile**: Card-based layouts
- **Tablet**: Optimized spacing and typography
- **Desktop**: Full table views with hover states

## 🎯 Features

### Real-time Data
- Automatic data refresh every 5 minutes
- Manual refresh capabilities
- Optimistic updates for better UX

### Performance
- Data caching with React Query
- Zustand for lightweight state management
- Skeleton loading states
- Lazy loading of components

### Type Safety
- Full TypeScript integration
- API types from specification
- Runtime type checking

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000

# React Query Configuration
VITE_QUERY_STALE_TIME=300000
VITE_QUERY_CACHE_TIME=600000
```

### Customization

You can customize:
- API base URL per environment
- Query cache times
- Retry strategies
- Error handling logic
- UI themes and colors

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Setup

1. Set production API URL
2. Configure CORS on backend
3. Set up authentication tokens
4. Enable HTTPS

## 📚 API Endpoints Used

### Dashboard
- `GET /dashboard/stats` - Dashboard statistics
- `GET /dashboard/latest-orders` - Latest orders

### Customers
- `GET /customers` - List customers with filters
- `GET /customers/:id` - Customer details
- `POST /customers` - Create customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Orders
- `GET /orders` - List orders with filters
- `GET /orders/:id` - Order details
- `POST /orders` - Create order
- `PATCH /orders/:id/status` - Update order status
- `DELETE /orders/:id` - Delete order

### Products
- `GET /products` - List products with filters
- `GET /products/:id` - Product details
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## 🔍 Debugging

### React Query DevTools

In development, React Query DevTools are automatically enabled:

```typescript
{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
```

### Zustand DevTools

All Zustand stores include Redux DevTools integration for debugging.

### Network Tab

Monitor API requests in browser DevTools Network tab for debugging.

## 🎉 Next Steps

1. **Implement Authentication**: Add login/logout functionality
2. **Add More Pages**: Integrate customers, orders, and products pages
3. **Real-time Updates**: Add WebSocket integration for live updates
4. **Offline Support**: Implement service workers for offline functionality
5. **Analytics**: Add analytics tracking and reporting

## 📞 Support

For questions or issues:
1. Check the API specification document
2. Review the TypeScript types
3. Check browser console for errors
4. Verify API endpoint availability

---

This integration provides a solid foundation for a production-ready admin panel with modern React patterns, excellent performance, and maintainable code structure. 