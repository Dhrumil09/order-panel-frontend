# Complete Authentication Flow Documentation

This document explains the complete authentication system with automatic token refresh, route protection, and seamless user experience.

## 🚀 **Authentication Flow Overview**

### **1. Initial App Load**
```
User visits app → AuthInitializer checks stored tokens → 
If valid tokens → Auto-login → Redirect to dashboard
If no/invalid tokens → Show login page
```

### **2. Login Process**
```
User enters credentials → API call → Store tokens → 
Update state → Show success notification → Redirect to dashboard
```

### **3. Automatic Token Refresh**
```
API call fails with 401 → Auto-refresh token → Retry original request → 
If refresh fails → Clear tokens → Redirect to login
```

### **4. Logout Process**
```
User clicks logout → Clear tokens → Clear state → 
Show notification → Redirect to login
```

## 🔧 **Key Components**

### **1. AuthInitializer (`app/components/auth/AuthInitializer.tsx`)**
- **Purpose**: Checks authentication status on app startup
- **Behavior**: 
  - Runs `useAuthCheck` hook automatically
  - Shows loading spinner during check
  - Renders children once check is complete

### **2. ProtectedRoute (`app/components/auth/ProtectedRoute.tsx`)**
- **Purpose**: Protects routes based on authentication status
- **Props**:
  - `requireAuth={true}`: Redirects to login if not authenticated
  - `requireAuth={false}`: Redirects to dashboard if authenticated
- **Behavior**:
  - Shows loading during auth check
  - Redirects based on authentication status
  - Preserves intended destination in URL state

### **3. Authentication Hooks (`app/hooks/useAuth.ts`)**

#### **useAuthCheck()**
```typescript
// Automatically checks stored tokens and refreshes if needed
const authCheck = useAuthCheck();

// Returns: { isLoading, isError, error, data }
```

#### **useLogin()**
```typescript
// Handles login with automatic token storage and navigation
const loginMutation = useLogin();

await loginMutation.mutateAsync({ email, password });
// Automatically: stores tokens, updates state, shows notification, navigates
```

#### **useLogout()**
```typescript
// Handles logout with cleanup and navigation
const { logout } = useLogout();

logout(); // Clears tokens, state, shows notification, navigates to login
```

#### **useAuth()**
```typescript
// Provides current authentication state
const { user, isAuthenticated, isLoading, error } = useAuth();
```

## 🛡️ **Route Protection**

### **Protected Routes (Dashboard, Customers, Orders, Products)**
```typescript
// app/routes/dashboard.tsx
export default function Dashboard() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardPage />
    </ProtectedRoute>
  );
}
```

### **Public Routes (Login)**
```typescript
// app/routes/home.tsx
export default function Home() {
  return (
    <ProtectedRoute requireAuth={false}>
      <LoginPage />
    </ProtectedRoute>
  );
}
```

## 🔄 **Automatic Token Refresh**

### **How It Works**
1. **API Request Fails**: Any API call returns 401 (Unauthorized)
2. **Auto Refresh**: System automatically tries to refresh the token
3. **Retry Request**: If refresh succeeds, original request is retried
4. **Fallback**: If refresh fails, user is logged out and redirected

### **Implementation**
```typescript
// In api-client.ts
private async refreshTokenIfNeeded(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await this.request('/auth/refresh', {
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
    // Clear all tokens if refresh fails
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  return null;
}
```

## 🎯 **User Experience Features**

### **1. Seamless Login**
- **Remember Me**: Tokens persist across browser sessions
- **Auto Redirect**: Authenticated users go directly to dashboard
- **Loading States**: Beautiful spinners during authentication checks

### **2. Smart Route Protection**
- **Automatic Redirects**: Users are sent to appropriate pages
- **Preserved Intent**: Original destination is remembered
- **Loading Feedback**: Clear indication of authentication status

### **3. Token Management**
- **Automatic Refresh**: Tokens refresh before expiration
- **Graceful Degradation**: Failed refresh leads to clean logout
- **Secure Storage**: Tokens stored in localStorage with proper cleanup

### **4. Error Handling**
- **User-Friendly Messages**: Clear error notifications
- **Automatic Recovery**: Token refresh handles expired tokens
- **Graceful Logout**: Clean state management on authentication failures

## 🔐 **Security Features**

### **1. Token Security**
- **JWT Tokens**: Secure token-based authentication
- **Refresh Tokens**: Long-lived refresh tokens for seamless experience
- **Automatic Cleanup**: Tokens cleared on logout or refresh failure

### **2. Route Security**
- **Protected Routes**: Unauthenticated users can't access protected pages
- **Redirect Logic**: Proper redirection based on authentication status
- **State Validation**: Authentication state validated on each route

### **3. API Security**
- **Bearer Tokens**: All API requests include Authorization header
- **Token Refresh**: Automatic token refresh on 401 errors
- **Secure Endpoints**: Auth endpoints don't require tokens

## 🧪 **Testing Scenarios**

### **1. Fresh User (No Tokens)**
```
1. Visit app → Login page shown
2. Enter credentials → Success → Dashboard
3. Refresh page → Still on dashboard (tokens stored)
```

### **2. Returning User (Valid Tokens)**
```
1. Visit app → Auto-check tokens → Dashboard
2. No login required → Seamless experience
```

### **3. Expired Tokens**
```
1. Visit app → Auto-refresh tokens → Dashboard
2. If refresh fails → Login page
```

### **4. Manual Logout**
```
1. Click logout → Tokens cleared → Login page
2. Can't access dashboard → Proper protection
```

### **5. Network Issues**
```
1. API call fails → Auto-retry with refresh
2. If refresh fails → Clean logout
```

## 📱 **Responsive Design**

### **Mobile Experience**
- **Touch-Friendly**: Large buttons and proper spacing
- **Loading States**: Clear feedback during authentication
- **Error Handling**: Readable error messages on small screens

### **Desktop Experience**
- **User Info**: Shows user name and role in header
- **Logout Button**: Prominent logout button with icon
- **Notifications**: Toast notifications for feedback

## 🔧 **Configuration**

### **Environment Variables**
```env
# API Configuration
API_BASE_URL=http://localhost:3000/api/v1

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

### **Token Storage**
```typescript
// Tokens stored in localStorage
localStorage.setItem('authToken', token);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(user));

// Cleared on logout
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('user');
```

## 🚀 **Usage Examples**

### **Protecting a New Route**
```typescript
// app/routes/new-page.tsx
import ProtectedRoute from "../components/auth/ProtectedRoute";

const NewPage = () => {
  return <div>Protected content</div>;
};

export default function NewPageRoute() {
  return (
    <ProtectedRoute requireAuth={true}>
      <NewPage />
    </ProtectedRoute>
  );
}
```

### **Adding User Info to Component**
```typescript
import { useAuth } from "../hooks/useAuth";

const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <div>
      Welcome, {user?.name}!
    </div>
  );
};
```

### **Handling Logout**
```typescript
import { useLogout } from "../hooks/useAuth";

const LogoutButton = () => {
  const { logout } = useLogout();
  
  return (
    <button onClick={logout}>
      Logout
    </button>
  );
};
```

## 🎉 **Benefits**

### **For Users**
- **Seamless Experience**: No repeated logins
- **Fast Access**: Direct navigation to dashboard
- **Clear Feedback**: Loading states and notifications
- **Secure**: Automatic token management

### **For Developers**
- **Easy Integration**: Simple hooks and components
- **Automatic Handling**: Token refresh and error handling
- **Type Safety**: Full TypeScript support
- **Maintainable**: Clean separation of concerns

This authentication system provides a production-ready, secure, and user-friendly authentication experience! 🚀 