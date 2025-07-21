import { useState, useEffect } from "react";
import type { Order, OrderItem } from "~/types/orders";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) => {
  const [notes, setNotes] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<Order["status"]>("pending");

  useEffect(() => {
    if (order) {
      setNotes(order.notes || "");
      setSelectedStatus(order.status);
    }
  }, [order]);

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

  const handleUpdateOrder = () => {
    // Here you would typically save to your backend
    // For now, we'll just update the local state
    order.notes = notes;
    order.status = selectedStatus;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#DDDDDD]">
          <div>
            <h2 className="text-xl font-bold text-[#1F1F1F]">Order Details</h2>
            <p className="text-sm text-[#666666]">{order.id}</p>
          </div>
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
        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666666] mb-2">Status</p>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as Order["status"])
                }
                className="px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent bg-white"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#666666]">Order Date</p>
              <p className="font-medium text-[#1F1F1F]">{order.date}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-[#F9F9F9] rounded-lg p-4">
            <h3 className="font-medium text-[#1F1F1F] mb-3">
              Customer Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-[#666666]">Name</p>
                <p className="font-medium text-[#1F1F1F]">
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#666666]">Address</p>
                <p className="text-[#1F1F1F]">{order.customerAddress}</p>
              </div>
              {order.customerEmail && (
                <div>
                  <p className="text-sm text-[#666666]">Email</p>
                  <p className="text-[#1F1F1F]">{order.customerEmail}</p>
                </div>
              )}
              {order.customerPhone && (
                <div>
                  <p className="text-sm text-[#666666]">Phone</p>
                  <p className="text-[#1F1F1F]">{order.customerPhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          {order.orderItems && (
            <div>
              <h3 className="font-medium text-[#1F1F1F] mb-3">Order Items</h3>
              <div className="bg-[#F9F9F9] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#EAE2FA]">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#1F1F1F]">
                          Item
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-[#1F1F1F]">
                          Boxes
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-[#1F1F1F]">
                          Pieces
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-[#1F1F1F]">
                          Pack
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-[#1F1F1F]">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item) => {
                        const totalPieces = item.pieces || 0;
                        const totalPackPieces =
                          (item.pack || 0) * (item.packSize || 1);
                        const totalItems = totalPieces + totalPackPieces;

                        return (
                          <tr
                            key={item.id}
                            className="border-t border-[#DDDDDD]"
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium text-[#1F1F1F]">
                                {item.name}
                              </p>
                              <p className="text-sm text-[#666666]">
                                ID: {item.id}
                              </p>
                              {item.packSize && item.availableInPack && (
                                <p className="text-xs text-[#666666]">
                                  Pack size: {item.packSize} pieces
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-[#1F1F1F]">
                              {item.boxes || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-[#1F1F1F]">
                              {item.availableInPieces ? item.pieces || 0 : "-"}
                            </td>
                            <td className="px-4 py-3 text-center text-[#1F1F1F]">
                              {item.availableInPack ? item.pack || 0 : "-"}
                            </td>
                            <td className="px-4 py-3 text-center font-medium text-[#1F1F1F]">
                              {totalItems}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h3 className="font-medium text-[#1F1F1F] mb-3">Notes</h3>
            <div className="bg-[#F9F9F9] rounded-lg p-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this order..."
                className="w-full h-24 p-3 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent resize-none bg-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDDDDD]">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#666666] border border-[#DDDDDD] rounded-lg hover:bg-[#F7F3FF] hover:border-[#9869E0] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleUpdateOrder}
              className="px-4 py-2 bg-[#9869E0] text-white rounded-lg hover:bg-[#7B40CC] transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
