import type { Order } from "~/types/orders";

interface OrdersTableProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onDeleteClick: (order: Order, e: React.MouseEvent) => void;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

const OrdersTable = ({ orders, onOrderClick, onDeleteClick, statusColors, statusLabels }: OrdersTableProps) => {
  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <svg className="w-16 h-16 text-[#DDDDDD] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium text-[#1F1F1F] mb-2">No orders found</p>
        <p className="text-[#666666]">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="border-b border-[#DDDDDD] p-4 last:border-b-0 cursor-pointer hover:bg-[#F7F3FF] transition-colors"
            onClick={() => onOrderClick(order)}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onOrderClick(order)}
            aria-label={`View details for order ${order.id}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[#1F1F1F]">{order.id}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <p className="text-sm text-[#1F1F1F] font-medium">{order.customerName}</p>
                <p className="text-xs text-[#666666]">{order.customerAddress}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#666666]">{order.date}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-[#666666]">
              <span>{order.items} items</span>
              <div className="flex items-center gap-2">
                <span className="text-[#9869E0]">Tap to view details</span>
                <button
                  onClick={(e) => onDeleteClick(order, e)}
                  className="p-1 text-[#666666] hover:text-white hover:bg-[#E74C3C] rounded transition-all duration-200 hover:scale-105"
                  aria-label={`Delete order ${order.id}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F9F9]">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-[#1F1F1F]">
                  Customer
                </th>
                <th className="px-6 py-4 text-left font-medium text-[#1F1F1F]">
                  Date
                </th>
                <th className="px-6 py-4 text-center font-medium text-[#1F1F1F]">
                  Status
                </th>
                <th className="px-6 py-4 text-center font-medium text-[#1F1F1F]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-t border-[#DDDDDD] hover:bg-[#F7F3FF] transition-colors"
                >
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onOrderClick(order)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onOrderClick(order)}
                    aria-label={`View details for order ${order.id}`}
                  >
                    <div>
                      <p className="font-medium text-[#1F1F1F]">{order.customerName}</p>
                      <p className="text-sm text-[#666666]">{order.customerAddress}</p>
                      <p className="text-xs text-[#666666]">{order.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#666666]">{order.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => onDeleteClick(order, e)}
                      className="p-2 text-[#666666] hover:text-white hover:bg-[#E74C3C] rounded-lg transition-all duration-200 hover:scale-105"
                      aria-label={`Delete order ${order.id}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrdersTable; 