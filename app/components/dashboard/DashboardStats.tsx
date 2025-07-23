import { useDashboardData } from '../../hooks/useDashboard';

const DashboardStats = () => {
  const { stats, isLoading, isError } = useDashboardData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-[#DDDDDD] bg-white p-4 sm:p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-2 rounded-xl border border-[#DDDDDD] bg-white p-4 sm:p-6">
          <p className="text-sm sm:text-base font-medium leading-normal text-[#1F1F1F]">
            Orders
          </p>
          <p className="text-xl sm:text-2xl font-bold leading-tight tracking-light text-[#1F1F1F]">
            --
          </p>
          <p className="text-sm sm:text-base font-medium leading-normal text-[#666666]">
            Unable to load data
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-[#DDDDDD] bg-white p-4 sm:p-6">
          <p className="text-sm sm:text-base font-medium leading-normal text-[#1F1F1F]">
            Customers
          </p>
          <p className="text-xl sm:text-2xl font-bold leading-tight tracking-light text-[#1F1F1F]">
            --
          </p>
          <p className="text-sm sm:text-base font-medium leading-normal text-[#666666]">
            Unable to load data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {/* Orders Stats */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#DDDDDD] bg-white p-4 sm:p-6">
        <p className="text-sm sm:text-base font-medium leading-normal text-[#1F1F1F]">
          Orders
        </p>
        <p className="text-xl sm:text-2xl font-bold leading-tight tracking-light text-[#1F1F1F]">
          {stats.orders.total.toLocaleString()}
        </p>
        <p className={`text-sm sm:text-base font-medium leading-normal ${
          stats.orders.growth >= 0 ? 'text-[#4BB543]' : 'text-[#E74C3C]'
        }`}>
          {stats.orders.growth >= 0 ? '+' : ''}{stats.orders.growth.toFixed(1)}% from last month
        </p>
      </div>

      {/* Customers Stats */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#DDDDDD] bg-white p-4 sm:p-6">
        <p className="text-sm sm:text-base font-medium leading-normal text-[#1F1F1F]">
          Customers
        </p>
        <p className="text-xl sm:text-2xl font-bold leading-tight tracking-light text-[#1F1F1F]">
          {stats.customers.total.toLocaleString()}
        </p>
        <p className={`text-sm sm:text-base font-medium leading-normal ${
          stats.customers.growth >= 0 ? 'text-[#4BB543]' : 'text-[#E74C3C]'
        }`}>
          {stats.customers.growth >= 0 ? '+' : ''}{stats.customers.growth.toFixed(1)}% from last month
        </p>
      </div>

      {/* Revenue Stats */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#DDDDDD] bg-white p-4 sm:p-6">
        <p className="text-sm sm:text-base font-medium leading-normal text-[#1F1F1F]">
          Revenue
        </p>
        <p className="text-xl sm:text-2xl font-bold leading-tight tracking-light text-[#1F1F1F]">
          ₹{stats.revenue.total.toLocaleString()}
        </p>
        <p className={`text-sm sm:text-base font-medium leading-normal ${
          stats.revenue.growth >= 0 ? 'text-[#4BB543]' : 'text-[#E74C3C]'
        }`}>
          {stats.revenue.growth >= 0 ? '+' : ''}{stats.revenue.growth.toFixed(1)}% from last month
        </p>
      </div>

      {/* Products Stats */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#DDDDDD] bg-white p-4 sm:p-6">
        <p className="text-sm sm:text-base font-medium leading-normal text-[#1F1F1F]">
          Products
        </p>
        <p className="text-xl sm:text-2xl font-bold leading-tight tracking-light text-[#1F1F1F]">
          {stats.products.total.toLocaleString()}
        </p>
        <p className="text-sm sm:text-base font-medium leading-normal text-[#666666]">
          {stats.products.outOfStock} out of stock, {stats.products.lowStock} low stock
        </p>
      </div>
    </div>
  );
};

export default DashboardStats; 