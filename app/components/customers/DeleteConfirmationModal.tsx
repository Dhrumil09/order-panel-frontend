import type { Customer } from "~/types/customers";

interface DeleteConfirmationModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal = ({ 
  customer, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteConfirmationModalProps) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1F1F1F]">
                Delete Customer
              </h3>
              <p className="text-sm text-[#666666]">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[#1F1F1F] mb-2">
              Are you sure you want to delete the customer:
            </p>
            <div className="bg-[#F9F9F9] p-3 rounded-lg">
              <p className="font-medium text-[#1F1F1F]">{customer.shopName}</p>
              <p className="text-sm text-[#666666]">Owner: {customer.ownerName}</p>
              <p className="text-sm text-[#666666]">ID: {customer.id}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#666666] border border-[#DDDDDD] rounded-lg hover:bg-[#F7F3FF] hover:border-[#9869E0] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 