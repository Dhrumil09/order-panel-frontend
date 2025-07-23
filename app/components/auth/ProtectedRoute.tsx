import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth, useAuthCheck } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const authCheck = useAuthCheck();
  const location = useLocation();

  // Check authentication on mount
  useEffect(() => {
    // This will automatically run the auth check if there are stored tokens
  }, []);

  // Show loading while checking authentication
  if (isLoading || authCheck.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9869E0] mx-auto mb-4"></div>
          <p className="text-[#666666] font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authentication is not required and user is authenticated, redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if authentication requirements are met
  return <>{children}</>;
};

export default ProtectedRoute; 