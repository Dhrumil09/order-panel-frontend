import type { Customer } from "~/types/customers";

interface CustomerDetailsModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

const CustomerDetailsModal = ({
  customer,
  isOpen,
  onClose,
  statusColors,
  statusLabels,
}: CustomerDetailsModalProps) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#DDDDDD]">
          <h2 className="text-lg sm:text-xl font-semibold text-[#1F1F1F]">
            Customer Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#666666] hover:text-[#1F1F1F] hover:bg-[#F7F3FF] rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Shop Information */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">
              Shop Information
            </h3>
            <div className="bg-[#F9F9F9] rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1F1F1F]">
                    {customer.shopName}
                  </p>
                  <p className="text-xs text-[#666666] mt-1">
                    ID: {customer.id}
                  </p>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[customer.status]
                  } mt-2 sm:mt-0`}
                >
                  {statusLabels[customer.status]}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-[#666666]">
                <span className="font-medium">Registration Date:</span>{" "}
                {new Date(customer.registrationDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">
              Owner Information
            </h3>
            <div className="bg-[#F9F9F9] rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div>
                <p className="text-sm font-medium text-[#1F1F1F]">
                  {customer.ownerName}
                </p>
                <p className="text-xs sm:text-sm text-[#666666] mt-1">
                  {customer.ownerPhone}
                </p>
                {customer.ownerEmail && (
                  <p className="text-xs sm:text-sm text-[#666666]">
                    {customer.ownerEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">
              Location
            </h3>
            <div className="bg-[#F9F9F9] rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div>
                <p className="text-sm text-[#1F1F1F]">{customer.address}</p>
                <p className="text-xs sm:text-sm text-[#666666] mt-1">
                  {customer.area}, {customer.city}
                </p>
                <p className="text-xs sm:text-sm text-[#666666]">
                  {customer.state} - {customer.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Business Statistics */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">
              Business Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-[#F9F9F9] rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-[#666666]">
                  Total Orders
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#1F1F1F]">
                  {customer.totalOrders}
                </p>
              </div>
              <div className="bg-[#F9F9F9] rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-[#666666]">Total Spent</p>
                <p className="text-lg sm:text-xl font-bold text-[#1F1F1F]">
                  ₹{customer.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">
                Notes
              </h3>
              <div className="bg-[#F9F9F9] rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-[#666666]">
                  {customer.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-[#DDDDDD]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#9869E0] rounded-lg text-sm font-medium text-white hover:bg-[#7B40CC] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
