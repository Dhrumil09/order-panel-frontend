import { useDashboardData, useOrderStatus } from '../../hooks/useDashboard';
import { useNavigate } from 'react-router';

const LatestOrders = () => {
  const { latestOrders, isLoading, isError } = useDashboardData();
  const navigate = useNavigate();

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders?search=${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="mb-4">
        <h2 className="text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#1F1F1F] mb-4">
          Latest Orders
        </h2>
        <div className="block lg:hidden space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#DDDDDD] p-4 animate-pulse">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-[#DDDDDD] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[100px]">
                    Order ID
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[120px]">
                    Customer
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[100px]">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[80px]">
                    Total
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[100px]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-t border-t-[#DDDDDD]">
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !latestOrders) {
    return (
      <div className="mb-4">
        <h2 className="text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#1F1F1F] mb-4">
          Latest Orders
        </h2>
        <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center">
          <svg className="w-16 h-16 text-[#DDDDDD] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium text-[#1F1F1F] mb-2">Unable to load orders</p>
          <p className="text-[#666666]">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (latestOrders.length === 0) {
    return (
      <div className="mb-4">
        <h2 className="text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#1F1F1F] mb-4">
          Latest Orders
        </h2>
        <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center">
          <svg className="w-16 h-16 text-[#DDDDDD] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium text-[#1F1F1F] mb-2">No orders found</p>
          <p className="text-[#666666]">No recent orders to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h2 className="text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#1F1F1F] mb-4">
        Latest Orders
      </h2>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {latestOrders.map((order) => {
          const { color, label } = useOrderStatus(order.status);
          
          return (
            <div
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
              className="bg-white rounded-xl border border-[#DDDDDD] p-4 cursor-pointer hover:bg-[#F7F3FF] transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-[#1F1F1F]">{order.id}</p>
                  <p className="text-sm text-[#666666]">{order.customerName}</p>
                </div>
                <button className={`flex min-w-[70px] max-w-[120px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full px-3 py-1 text-xs font-medium ${color}`}>
                  <span className="truncate">{label}</span>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#666666]">₹{order.total.toLocaleString()}</p>
                <p className="text-xs text-[#666666]">{new Date(order.date).toLocaleDateString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table Container */}
      <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-[#DDDDDD] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[100px]">
                  Order ID
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[120px]">
                  Customer
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[100px]">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[80px]">
                  Total
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[100px]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => {
                const { color, label } = useOrderStatus(order.status);
                
                return (
                  <tr
                    key={order.id}
                    onClick={() => handleOrderClick(order.id)}
                    className="border-t border-t-[#DDDDDD] hover:bg-[#F7F3FF] cursor-pointer transition-colors"
                  >
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#1F1F1F]">
                      {order.id}
                    </td>
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                      {order.customerName}
                    </td>
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal">
                      <button className={`flex min-w-[70px] sm:min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium leading-normal ${color}`}>
                        <span className="truncate">{label}</span>
                      </button>
                    </td>
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LatestOrders; 