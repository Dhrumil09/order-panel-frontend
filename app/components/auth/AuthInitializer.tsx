import { useEffect } from 'react';
import { useAuthCheck } from '../../hooks/useAuth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const authCheck = useAuthCheck();

  // This component will automatically check authentication on mount
  // The useAuthCheck hook will handle token validation and refresh
  useEffect(() => {
    // The auth check will run automatically if there are stored tokens
    // No additional logic needed here as the hook handles everything
  }, []);

  // Show loading while checking authentication
  if (authCheck.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9869E0] mx-auto mb-4"></div>
          <p className="text-[#666666] font-medium">Initializing...</p>
        </div>
      </div>
    );
  }

  // Render children once authentication check is complete
  return <>{children}</>;
};

export default AuthInitializer; 