import { lazy, Suspense } from "react";

// Lazy load components for better performance
const SidebarContent = lazy(() => import("~/components/SidebarContent"));
const MobileBottomNavigation = lazy(() => import("~/components/MobileBottomNavigation"));

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
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
          <h1 className="text-lg font-bold text-[#1F1F1F]">Acme Co</h1>
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