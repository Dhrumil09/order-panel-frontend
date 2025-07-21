import type { Customer } from "~/types/customers";

interface CustomersTableProps {
  customers: Customer[];
  onCustomerClick: (customer: Customer) => void;
  onDeleteClick: (customer: Customer, e: React.MouseEvent) => void;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

const CustomersTable = ({ customers, onCustomerClick, onDeleteClick, statusColors, statusLabels }: CustomersTableProps) => {
  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3 p-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => onCustomerClick(customer)}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4 cursor-pointer hover:bg-[#F7F3FF] transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#1F1F1F] mb-1">{customer.shopName}</h3>
                <p className="text-xs text-[#666666] mb-1">{customer.ownerName}</p>
                <p className="text-xs text-[#666666]">{customer.ownerPhone}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                  {statusLabels[customer.status]}
                </span>
                <button
                  onClick={(e) => onDeleteClick(customer, e)}
                  className="p-1 text-[#E74C3C] hover:bg-[#F7F3FF] rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#666666] mb-3">
              <div>
                <span className="font-medium">Location:</span> {customer.area}, {customer.city}
              </div>
              <div>
                <span className="font-medium">Orders:</span> {customer.totalOrders}
              </div>
            </div>
            <div className="text-xs text-[#666666]">
              <span className="font-medium">Total Spent:</span> ₹{customer.totalSpent.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1F1F1F] min-w-[120px]">
                  Shop Details
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1F1F1F] min-w-[140px]">
                  Owner Info
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1F1F1F] min-w-[150px]">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1F1F1F] min-w-[100px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1F1F1F] min-w-[100px]">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1F1F1F] min-w-[120px]">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1F1F1F] min-w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => onCustomerClick(customer)}
                  className="border-t border-t-[#DDDDDD] hover:bg-[#F7F3FF] cursor-pointer transition-colors"
                >
                  <td className="h-[72px] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#1F1F1F]">{customer.shopName}</p>
                      <p className="text-xs text-[#666666] mt-1">{customer.id}</p>
                    </div>
                  </td>
                  <td className="h-[72px] px-4 py-3">
                    <div>
                      <p className="text-sm text-[#1F1F1F]">{customer.ownerName}</p>
                      <p className="text-xs text-[#666666] mt-1">{customer.ownerPhone}</p>
                      <p className="text-xs text-[#666666]">{customer.ownerEmail}</p>
                    </div>
                  </td>
                  <td className="h-[72px] px-4 py-3">
                    <div>
                      <p className="text-sm text-[#1F1F1F]">{customer.area}, {customer.city}</p>
                      <p className="text-xs text-[#666666] mt-1">{customer.state} - {customer.pincode}</p>
                    </div>
                  </td>
                  <td className="h-[72px] px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                      {statusLabels[customer.status]}
                    </span>
                  </td>
                  <td className="h-[72px] px-4 py-3">
                    <p className="text-sm text-[#1F1F1F]">{customer.totalOrders}</p>
                  </td>
                  <td className="h-[72px] px-4 py-3">
                    <p className="text-sm text-[#1F1F1F]">₹{customer.totalSpent.toLocaleString()}</p>
                  </td>
                  <td className="h-[72px] px-4 py-3">
                    <button
                      onClick={(e) => onDeleteClick(customer, e)}
                      className="p-2 text-[#E74C3C] hover:bg-[#F7F3FF] rounded transition-colors"
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

export default CustomersTable; 