import type { Order } from "~/types/orders";

interface DeleteConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

import { statusLabels } from "~/types/orders";

const DeleteConfirmationModal = ({
  order,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) => {
  if (!isOpen || !order) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#DDDDDD]">
          <h2 className="text-xl font-bold text-[#1F1F1F]">Delete Order</h2>
          <button
            onClick={onClose}
            className="p-2 text-[#666666] hover:text-[#9869E0] hover:bg-[#F7F3FF] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
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

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-[#E74C3C] bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-[#E74C3C]"
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
            <div>
              <h3 className="text-lg font-semibold text-[#1F1F1F] mb-2">
                Are you sure?
              </h3>
              <p className="text-[#666666] mb-4">
                You are about to delete order{" "}
                <span className="font-semibold text-[#1F1F1F]">{order.id}</span>{" "}
                for customer{" "}
                <span className="font-semibold text-[#1F1F1F]">
                  {order.customerName}
                </span>
                . This action cannot be undone.
              </p>
              <div className="bg-[#F9F9F9] rounded-lg p-3">
                <p className="text-sm text-[#666666]">
                  <span className="font-medium">Order Details:</span>
                  <br />• Customer: {order.customerName}
                  <br />• Date: {order.date}
                  <br />• Status: {statusLabels[order.status]}
                  <br />• Items: {order.items}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#DDDDDD]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#666666] border border-[#DDDDDD] rounded-lg hover:bg-[#F7F3FF] hover:border-[#9869E0] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#E74C3C] text-white rounded-lg hover:bg-[#C0392B] transition-colors"
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
