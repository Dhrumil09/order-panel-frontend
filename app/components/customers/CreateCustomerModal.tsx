import { useState } from "react";
import type { CreateCustomerFormData } from "~/types/customers";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CreateCustomerFormData) => void;
}

const CreateCustomerModal = ({ isOpen, onClose, onSave }: CreateCustomerModalProps) => {
  const [formData, setFormData] = useState<CreateCustomerFormData>({
    shopName: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    status: "active",
    notes: ""
  });

  const handleSave = () => {
    if (!formData.shopName || !formData.ownerName || !formData.ownerPhone || !formData.address || !formData.area || !formData.city || !formData.state || !formData.pincode) {
      return;
    }
    onSave(formData);
    setFormData({
      shopName: "",
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      status: "active",
      notes: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#DDDDDD]">
          <h2 className="text-lg sm:text-xl font-semibold text-[#1F1F1F]">Add New Customer</h2>
          <button
            onClick={onClose}
            className="p-2 text-[#666666] hover:text-[#1F1F1F] hover:bg-[#F7F3FF] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Shop Information */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">Shop Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Shop Name *</label>
                <input
                  type="text"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                  placeholder="Enter shop name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">Owner Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Owner Name *</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                  placeholder="Enter owner name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">Address Information</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Full Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                  placeholder="Enter full address"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Area *</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                    placeholder="Enter area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Pincode *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm resize-none"
              placeholder="Enter any additional notes"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-[#DDDDDD]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#DDDDDD] rounded-lg text-sm font-medium text-[#666666] hover:bg-[#F7F3FF] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-[#9869E0] rounded-lg text-sm font-medium text-white hover:bg-[#7B40CC] transition-colors"
          >
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerModal; 