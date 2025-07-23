import { lazy, Suspense } from "react";
import { useLogout, useAuth } from "../hooks/useAuth";

// Lazy load components for better performance
const SidebarContent = lazy(() => import("~/components/SidebarContent"));
const MobileBottomNavigation = lazy(() => import("~/components/MobileBottomNavigation"));

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { logout } = useLogout();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className="flex min-h-screen bg-[#F9F9F9]"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Desktop sidebar */}
      <div className="hidden w-80 flex-shrink-0 p-4 lg:block">
        <div className="h-full rounded-xl border border-[#DDDDDD] bg-white">
          <Suspense fallback={<div className="p-4 text-[#666666]">Loading...</div>}>
            <SidebarContent />
          </Suspense>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <Suspense fallback={<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#DDDDDD] p-4 text-center text-[#666666]">Loading...</div>}>
        <MobileBottomNavigation />
      </Suspense>

      <main className="flex-1">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-[#DDDDDD] bg-white p-4 lg:hidden">
          <h1 className="text-lg font-bold text-[#1F1F1F]">Admin Panel</h1>
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-sm text-[#666666]">
                <span className="font-medium">{user.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-[#E74C3C] text-white rounded-md hover:bg-[#C0392B] transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between border-b border-[#DDDDDD] bg-white p-6">
          <h1 className="text-xl font-bold text-[#1F1F1F]">{title || "Admin Panel"}</h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm text-[#666666]">
                Welcome, <span className="font-medium text-[#1F1F1F]">{user.name}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-[#D4C4F0] text-[#5E2BA8] rounded-full">
                  {user.role}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-[#E74C3C] text-white rounded-md hover:bg-[#C0392B] transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="p-4 sm:p-6 pb-24 lg:pb-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 