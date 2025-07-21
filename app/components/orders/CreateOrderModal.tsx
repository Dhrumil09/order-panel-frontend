import { useState } from "react";
import type { OrderItem, CreateFormData } from "~/types/orders";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CreateFormData) => void;
}

const CreateOrderModal = ({ isOpen, onClose, onSave }: CreateOrderModalProps) => {
  const [formData, setFormData] = useState<CreateFormData>({
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    customerPhone: "",
    status: "pending",
    orderItems: [{ id: "1", name: "", quantity: 1 }],
    notes: ""
  });

  if (!isOpen) return null;

  const handleAddOrderItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1
    };
    setFormData({
      ...formData,
      orderItems: [...formData.orderItems, newItem]
    });
  };

  const handleRemoveOrderItem = (itemId: string) => {
    if (formData.orderItems.length > 1) {
      setFormData({
        ...formData,
        orderItems: formData.orderItems.filter(item => item.id !== itemId)
      });
    }
  };

  const handleOrderItemChange = (itemId: string, field: "name" | "quantity", value: string | number) => {
    setFormData({
      ...formData,
      orderItems: formData.orderItems.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    });
  };

  const handleSave = () => {
    if (!formData.customerName || !formData.customerAddress) {
      return;
    }
    onSave(formData);
    // Reset form
    setFormData({
      customerName: "",
      customerAddress: "",
      customerEmail: "",
      customerPhone: "",
      status: "pending",
      orderItems: [{ id: "1", name: "", quantity: 1 }],
      notes: ""
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="border-b border-[#DDDDDD] p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1F1F1F]">
              Create New Order
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-[#666666] hover:bg-[#F7F3FF] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                placeholder="Enter customer name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Customer Address *
              </label>
              <textarea
                value={formData.customerAddress}
                onChange={(e) =>
                  setFormData({ ...formData, customerAddress: e.target.value })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                placeholder="Enter customer address"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-[#1F1F1F]">
                Order Items
              </label>
              <button
                type="button"
                onClick={handleAddOrderItem}
                className="inline-flex items-center gap-1 text-sm text-[#9869E0] hover:text-[#7B40CC] focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Item
              </button>
            </div>
            <div className="space-y-3">
              {formData.orderItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleOrderItemChange(item.id, "name", e.target.value)
                      }
                      className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                      placeholder="Item name"
                    />
                  </div>
                  <div className="w-full sm:w-24">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleOrderItemChange(item.id, "quantity", parseInt(e.target.value) || 1)
                      }
                      className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                      placeholder="Qty"
                      min="1"
                    />
                  </div>
                  {formData.orderItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOrderItem(item.id)}
                      className="rounded-lg p-2 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 self-start sm:self-auto"
                      aria-label="Remove item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
              placeholder="Add any notes about this order..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDDDDD]">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#666666] border border-[#DDDDDD] rounded-lg hover:bg-[#F7F3FF] hover:border-[#9869E0] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-[#9869E0] text-white rounded-lg hover:bg-[#7B40CC] transition-colors"
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal; 