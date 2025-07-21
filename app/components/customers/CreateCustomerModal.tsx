import { useState, useEffect, useMemo } from "react";
import type { CreateCustomerFormData } from "~/types/customers";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CreateCustomerFormData) => void;
  locationData: { [key: string]: { cities: { [key: string]: string[] } } };
}

const CreateCustomerModal = ({ isOpen, onClose, onSave, locationData }: CreateCustomerModalProps) => {
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

  // Get available states, cities, and areas
  const availableStates = useMemo(() => {
    const states = Object.keys(locationData).sort();
    console.log('Available states:', states);
    return states;
  }, [locationData]);
  
  const availableCities = useMemo(() => {
    const cities = formData.state ? Object.keys(locationData[formData.state]?.cities || {}).sort() : [];
    console.log('Available cities for state', formData.state, ':', cities);
    return cities;
  }, [formData.state, locationData]);
  
  const availableAreas = useMemo(() => {
    const areas = formData.state && formData.city ? (locationData[formData.state]?.cities[formData.city] || []).sort() : [];
    console.log('Available areas for city', formData.city, ':', areas);
    return areas;
  }, [formData.state, formData.city, locationData]);



  // Set default values when modal opens
  useEffect(() => {
    if (isOpen && availableStates.length > 0) {
      const defaultState = "Gujarat";
      const defaultCity = "Ahmedabad";
      
      // Check if Gujarat exists, if not use first available state
      const stateToUse = availableStates.includes(defaultState) ? defaultState : availableStates[0] || "";
      
      // Check if Ahmedabad exists in the selected state, if not use first available city
      const citiesInState = stateToUse ? Object.keys(locationData[stateToUse]?.cities || {}) : [];
      const cityToUse = citiesInState.includes(defaultCity) ? defaultCity : citiesInState[0] || "";
      
      setFormData({
        shopName: "",
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",
        address: "",
        area: "",
        city: cityToUse,
        state: stateToUse,
        pincode: "",
        status: "active",
        notes: ""
      });
    }
  }, [isOpen, availableStates, locationData]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const citiesInNewState = newState ? Object.keys(locationData[newState]?.cities || {}) : [];
                      setFormData({
                        ...formData,
                        state: newState,
                        city: citiesInNewState.length > 0 ? citiesInNewState[0] : "",
                        area: ""
                      });
                    }}
                    className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm"
                  >
                    <option value="">Select State</option>
                    {availableStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}

                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      const areasInNewCity = newCity && formData.state ? (locationData[formData.state]?.cities[newCity] || []) : [];
                      setFormData({
                        ...formData,
                        city: newCity,
                        area: areasInNewCity.length > 0 ? areasInNewCity[0] : ""
                      });
                    }}
                    disabled={!formData.state}
                    className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm disabled:opacity-50"
                  >
                    <option value="">Select City</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-1 sm:mb-2">Area *</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    disabled={!formData.city}
                    className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:border-transparent text-sm disabled:opacity-50"
                  >
                    <option value="">Select Area</option>
                    {availableAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
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