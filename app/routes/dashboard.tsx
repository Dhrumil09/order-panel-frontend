import type { Route } from "./+types/home";
import AdminLayout from "~/components/AdminLayout";
import DashboardStats from "~/components/dashboard/DashboardStats";
import LatestOrders from "~/components/dashboard/LatestOrders";
import ProtectedRoute from "~/components/auth/ProtectedRoute";
import { createPageMeta } from "~/utils/meta";

export function meta({}: Route.MetaArgs) {
  return createPageMeta("Dashboard", "Dashboard for managing products and orders.");
}

const DashboardPage = () => {
  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards */}
      <DashboardStats />
      
      {/* Latest Orders Section */}
      <LatestOrders />
    </AdminLayout>
  );
};

export default function Dashboard() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardPage />
    </ProtectedRoute>
  );
}
