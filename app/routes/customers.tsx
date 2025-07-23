import { useState, useMemo, useEffect } from "react";
import AdminLayout from "~/components/AdminLayout";
import { createPageMeta } from "~/utils/meta";
import CustomerDetailsModal from "~/components/customers/CustomerDetailsModal";
import DeleteConfirmationModal from "~/components/customers/DeleteConfirmationModal";
import CreateCustomerModal from "~/components/customers/CreateCustomerModal";
import CustomersTable from "~/components/customers/CustomersTable";
import CustomersFilters from "~/components/customers/CustomersFilters";
import Pagination from "~/components/customers/Pagination";
import type { Customer, CreateCustomerFormData } from "~/types/customers";
import { statusColors, statusLabels } from "~/types/customers";
import { 
  useCustomers, 
  useCreateCustomer, 
  useDeleteCustomer, 
  useLocations 
} from "~/hooks/useCustomers";
import type { CustomerQueryParams } from "../../api-types";

export function meta() {
  return createPageMeta("Customers", "Manage customers.");
}

// Remove mock data - will be fetched from API

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [areaFilter, setAreaFilter] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"shopName" | "ownerName" | "registrationDate" | "totalOrders">("registrationDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [manageTab, setManageTab] = useState<"states" | "cities" | "areas">("states");
  const [newStateName, setNewStateName] = useState("");
  const [newCityName, setNewCityName] = useState("");
  const [newAreaName, setNewAreaName] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const itemsPerPage = 5;

  // API hooks
  const createCustomerMutation = useCreateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  const { data: locationsData } = useLocations();

  // Build query parameters for API
  const queryParams: CustomerQueryParams = useMemo(() => {
    const params: CustomerQueryParams = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy,
      sortOrder,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (statusFilter.length > 0) {
      params.status = statusFilter[0] as "active" | "inactive" | "pending";
    }

    if (areaFilter.length > 0) {
      params.area = areaFilter[0];
    }

    if (cityFilter.length > 0) {
      params.city = cityFilter[0];
    }

    return params;
  }, [currentPage, searchTerm, statusFilter, areaFilter, cityFilter, sortBy, sortOrder]);

  // Fetch customers data
  const { data: customersData, isLoading, error } = useCustomers(queryParams);

  // Hierarchical location data structure
  const [locationData, setLocationData] = useState(() => {
    // Initialize with data from API locations
    const states: { [key: string]: { cities: { [key: string]: string[] } } } = {};
    
    // Add Gujarat and Ahmedabad as default
    states["Gujarat"] = { 
      cities: {
        "Ahmedabad": [
          "Satellite",
          "Vastrapur", 
          "Navrangpura",
          "Paldi",
          "Ellisbridge",
          "Gujarat University",
          "Stadium Road",
          "Law Garden",
          "Bodakdev",
          "Thaltej"
        ]
      }
    };
    
    return states;
  });

  // Update location data when API data is available
  useEffect(() => {
    if (locationsData?.states) {
      const newLocationData: { [key: string]: { cities: { [key: string]: string[] } } } = {};
      
      locationsData.states.forEach(state => {
        newLocationData[state.name] = { cities: {} };
        state.cities.forEach(city => {
          newLocationData[state.name].cities[city.name] = city.areas;
        });
      });
      
      setLocationData(newLocationData);
    }
  }, [locationsData]);

  // Get unique areas and cities for filters (flattened for backward compatibility)
  const availableAreas = useMemo(() => {
    const areas: string[] = [];
    Object.values(locationData).forEach(stateData => {
      Object.values(stateData.cities).forEach(cityAreas => {
        areas.push(...cityAreas);
      });
    });
    return [...new Set(areas)].sort();
  }, [locationData]);

  const availableCities = useMemo(() => {
    const cities: string[] = [];
    Object.values(locationData).forEach(stateData => {
      cities.push(...Object.keys(stateData.cities));
    });
    return [...new Set(cities)].sort();
  }, [locationData]);

  const availableStates = useMemo(() => {
    return Object.keys(locationData).sort();
  }, [locationData]);

  // Get customers data from API
  const customers = customersData?.customers || [];
  const pagination = customersData?.pagination;

  // Loading and error states
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9869E0] mx-auto mb-4"></div>
            <p className="text-[#666666]">Loading customers...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading customers</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#9869E0] text-white rounded-lg hover:bg-[#7B40CC]"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, areaFilter, cityFilter, sortBy, sortOrder]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setAreaFilter([]);
    setCityFilter([]);
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter.length > 0,
    areaFilter.length > 0,
    cityFilter.length > 0
  ].filter(Boolean).length;

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteClick = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomerMutation.mutate(customerToDelete.id);
    }
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleCreateCustomer = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveCustomer = (formData: CreateCustomerFormData) => {
    createCustomerMutation.mutate({
      shopName: formData.shopName,
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      ownerEmail: formData.ownerEmail,
      address: formData.address,
      area: formData.area,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      status: formData.status,
      notes: formData.notes
    });
    setIsCreateModalOpen(false);
  };

  // State management functions
  const handleAddState = () => {
    if (newStateName.trim() && !availableStates.includes(newStateName.trim())) {
      const newState = newStateName.trim();
      setLocationData(prev => ({
        ...prev,
        [newState]: { cities: {} }
      }));
      setNewStateName("");
    }
  };

  const handleDeleteState = (stateName: string) => {
    setLocationData(prev => {
      const newData = { ...prev };
      delete newData[stateName];
      return newData;
    });
  };

  // City management functions
  const handleAddCity = () => {
    if (newCityName.trim() && selectedState && !locationData[selectedState]?.cities[newCityName.trim()]) {
      const newCity = newCityName.trim();
      setLocationData(prev => ({
        ...prev,
        [selectedState]: {
          ...prev[selectedState],
          cities: {
            ...prev[selectedState].cities,
            [newCity]: []
          }
        }
      }));
      setNewCityName("");
    }
  };

  const handleDeleteCity = (cityName: string) => {
    if (selectedState) {
      setLocationData(prev => {
        const newData = { ...prev };
        delete newData[selectedState].cities[cityName];
        return newData;
      });
    }
  };

  // Area management functions
  const handleAddArea = () => {
    if (newAreaName.trim() && selectedState && selectedCity && 
        !locationData[selectedState]?.cities[selectedCity]?.includes(newAreaName.trim())) {
      const newArea = newAreaName.trim();
      setLocationData(prev => ({
        ...prev,
        [selectedState]: {
          ...prev[selectedState],
          cities: {
            ...prev[selectedState].cities,
            [selectedCity]: [...(prev[selectedState].cities[selectedCity] || []), newArea].sort()
          }
        }
      }));
      setNewAreaName("");
    }
  };

  const handleDeleteArea = (areaName: string) => {
    if (selectedState && selectedCity) {
      setLocationData(prev => ({
        ...prev,
        [selectedState]: {
          ...prev[selectedState],
          cities: {
            ...prev[selectedState].cities,
            [selectedCity]: prev[selectedState].cities[selectedCity].filter(area => area !== areaName)
          }
        }
      }));
    }
  };

  return (
    <AdminLayout>
      {/* Header with Create Button */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold leading-tight text-[#1F1F1F]">
          Customers
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDDDDD] bg-white px-3 sm:px-4 py-2 text-sm font-medium text-[#666666] transition-colors hover:bg-[#F7F3FF] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-5 sm:h-5"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
            </svg>
            <span className="hidden sm:inline">Manage</span>
            <span className="sm:hidden">Manage</span>
          </button>
          <button
            onClick={handleCreateCustomer}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9869E0] px-3 sm:px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-5 sm:h-5"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span className="hidden sm:inline">Add Customer</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <CustomersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={(status) => {
          if (statusFilter.includes(status)) {
            setStatusFilter(statusFilter.filter(s => s !== status));
          } else {
            setStatusFilter([...statusFilter, status]);
          }
        }}
        areaFilter={areaFilter}
        onAreaFilterChange={(area) => {
          if (areaFilter.includes(area)) {
            setAreaFilter(areaFilter.filter(a => a !== area));
          } else {
            setAreaFilter([...areaFilter, area]);
          }
        }}
        cityFilter={cityFilter}
        onCityFilterChange={(city) => {
          if (cityFilter.includes(city)) {
            setCityFilter(cityFilter.filter(c => c !== city));
          } else {
            setCityFilter([...cityFilter, city]);
          }
        }}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearAllFilters={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
        statusColors={statusColors}
        statusLabels={statusLabels}
        availableAreas={availableAreas}
        availableCities={availableCities}
        showCityFilter={false}
      />

      {/* Results Summary */}
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-[#666666]">
          Showing {customers.length} of {pagination?.totalItems || 0} customers
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <CustomersTable
          customers={customers}
          onCustomerClick={handleCustomerClick}
          onDeleteClick={handleDeleteClick}
          statusColors={statusColors}
          statusLabels={statusLabels}
        />

        {/* Pagination */}
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            startIndex={(pagination.currentPage - 1) * pagination.itemsPerPage}
            endIndex={Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            totalItems={pagination.totalItems}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Create Customer Modal */}
      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCustomer}
        locationData={locationData}
      />

      {/* Customer Details Modal */}
      <CustomerDetailsModal 
        customer={selectedCustomer} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        statusColors={statusColors}
        statusLabels={statusLabels}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        customer={customerToDelete}
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* Manage Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="border-b border-[#DDDDDD] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1F1F1F]">
                  Manage Areas & Cities
                </h2>
                <button
                  onClick={() => setIsManageModalOpen(false)}
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

            {/* Tabs */}
            <div className="border-b border-[#DDDDDD] overflow-x-auto">
              <div className="flex min-w-full">
                <button
                  onClick={() => setManageTab("states")}
                  className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    manageTab === "states"
                      ? "border-[#9869E0] text-[#9869E0]"
                      : "border-transparent text-[#666666] hover:text-[#1F1F1F]"
                  }`}
                >
                  States
                </button>
                <button
                  onClick={() => setManageTab("cities")}
                  className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    manageTab === "cities"
                      ? "border-[#9869E0] text-[#9869E0]"
                      : "border-transparent text-[#666666] hover:text-[#1F1F1F]"
                  }`}
                >
                  Cities
                </button>
                <button
                  onClick={() => setManageTab("areas")}
                  className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    manageTab === "areas"
                      ? "border-[#9869E0] text-[#9869E0]"
                      : "border-transparent text-[#666666] hover:text-[#1F1F1F]"
                  }`}
                >
                  Areas
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {manageTab === "states" ? (
                <div className="space-y-6">
                  {/* Add State */}
                  <div>
                    <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                      Add New State
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
                        className="flex-1 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                        placeholder="Enter state name"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddState()
                        }
                      />
                      <button
                        onClick={handleAddState}
                        className="rounded-lg bg-[#9869E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 sm:w-auto w-full"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* States List */}
                  <div>
                    <h3 className="text-sm font-medium text-[#1F1F1F] mb-3">
                      Existing States ({availableStates.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableStates.map((state) => (
                        <div
                          key={state}
                          className="flex items-center justify-between rounded-lg border border-[#DDDDDD] p-3"
                        >
                          <div className="flex-1 mr-2">
                            <span className="text-sm font-medium text-[#1F1F1F]">
                              {state}
                            </span>
                            <div className="text-xs text-[#666666] mt-1">
                              {Object.keys(locationData[state]?.cities || {}).length} cities
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteState(state)}
                            className="rounded-lg p-1 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 flex-shrink-0"
                            aria-label="Delete state"
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : manageTab === "cities" ? (
                <div className="space-y-6">
                  {/* State Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                      Select State
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedCity("");
                      }}
                      className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                    >
                      <option value="">Select a state</option>
                      {availableStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedState && (
                    <>
                      {/* Add City */}
                      <div>
                        <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                          Add New City to {selectedState}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={newCityName}
                            onChange={(e) => setNewCityName(e.target.value)}
                            className="flex-1 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                            placeholder="Enter city name"
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleAddCity()
                            }
                          />
                          <button
                            onClick={handleAddCity}
                            className="rounded-lg bg-[#9869E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 sm:w-auto w-full"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Cities List */}
                      <div>
                        <h3 className="text-sm font-medium text-[#1F1F1F] mb-3">
                          Cities in {selectedState} ({Object.keys(locationData[selectedState]?.cities || {}).length})
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {Object.keys(locationData[selectedState]?.cities || {}).map((city) => (
                            <div
                              key={city}
                              className="flex items-center justify-between rounded-lg border border-[#DDDDDD] p-3"
                            >
                              <div className="flex-1 mr-2">
                                <span className="text-sm font-medium text-[#1F1F1F]">
                                  {city}
                                </span>
                                <div className="text-xs text-[#666666] mt-1">
                                  {locationData[selectedState].cities[city].length} areas
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteCity(city)}
                                className="rounded-lg p-1 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 flex-shrink-0"
                                aria-label="Delete city"
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* State and City Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                        Select State
                      </label>
                      <select
                        value={selectedState}
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                          setSelectedCity("");
                        }}
                        className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                      >
                        <option value="">Select a state</option>
                        {availableStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                        Select City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedState}
                        className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20 disabled:opacity-50"
                      >
                        <option value="">Select a city</option>
                        {selectedState && Object.keys(locationData[selectedState]?.cities || {}).map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedState && selectedCity && (
                    <>
                      {/* Add Area */}
                      <div>
                        <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                          Add New Area to {selectedCity}, {selectedState}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            className="flex-1 rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                            placeholder="Enter area name"
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleAddArea()
                            }
                          />
                          <button
                            onClick={handleAddArea}
                            className="rounded-lg bg-[#9869E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2 sm:w-auto w-full"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Areas List */}
                      <div>
                        <h3 className="text-sm font-medium text-[#1F1F1F] mb-3">
                          Areas in {selectedCity}, {selectedState} ({locationData[selectedState]?.cities[selectedCity]?.length || 0})
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {locationData[selectedState]?.cities[selectedCity]?.map((area) => (
                            <div
                              key={area}
                              className="flex items-center justify-between rounded-lg border border-[#DDDDDD] p-3"
                            >
                              <span className="text-sm text-[#1F1F1F] flex-1 truncate mr-2">
                                {area}
                              </span>
                              <button
                                onClick={() => handleDeleteArea(area)}
                                className="rounded-lg p-1 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 flex-shrink-0"
                                aria-label="Delete area"
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
