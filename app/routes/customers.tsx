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

export function meta() {
  return createPageMeta("Customers", "Manage customers.");
}

const mockCustomers: Customer[] = [
  {
    id: "#CUST001",
    shopName: "Kumar Electronics",
    ownerName: "Rajesh Kumar",
    ownerPhone: "+91 98765 43210",
    ownerEmail: "rajesh.kumar@gmail.com",
    address: "123 MG Road, Koramangala",
    area: "Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    status: "active",
    registrationDate: "2024-01-15",
    totalOrders: 45,
    totalSpent: 125000,
    notes: "Premium customer, prefers express delivery"
  },
  {
    id: "#CUST002",
    shopName: "Sharma Mobile Store",
    ownerName: "Priya Sharma",
    ownerPhone: "+91 87654 32109",
    ownerEmail: "priya.sharma@yahoo.com",
    address: "456 Andheri West, Near Station",
    area: "Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400058",
    status: "active",
    registrationDate: "2024-01-14",
    totalOrders: 32,
    totalSpent: 89000,
    notes: "Bulk order customer"
  },
  {
    id: "#CUST003",
    shopName: "Patel Gadgets",
    ownerName: "Amit Patel",
    ownerPhone: "+91 76543 21098",
    ownerEmail: "amit.patel@hotmail.com",
    address: "789 Connaught Place, Central Delhi",
    area: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    status: "inactive",
    registrationDate: "2024-01-13",
    totalOrders: 18,
    totalSpent: 45000,
    notes: "Temporarily closed for renovation"
  },
  {
    id: "#CUST004",
    shopName: "Singh Tech Solutions",
    ownerName: "Neha Singh",
    ownerPhone: "+91 65432 10987",
    ownerEmail: "neha.singh@gmail.com",
    address: "321 Salt Lake City, Sector 1",
    area: "Salt Lake City",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700091",
    status: "active",
    registrationDate: "2024-01-12",
    totalOrders: 67,
    totalSpent: 189000,
    notes: "High-value customer, VIP treatment"
  },
  {
    id: "#CUST005",
    shopName: "Reddy Digital Hub",
    ownerName: "Vikram Reddy",
    ownerPhone: "+91 54321 09876",
    ownerEmail: "vikram.reddy@yahoo.com",
    address: "654 Banjara Hills, Road No. 12",
    area: "Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
    status: "pending",
    registrationDate: "2024-01-11",
    totalOrders: 0,
    totalSpent: 0,
    notes: "New registration, awaiting verification"
  },
  {
    id: "#CUST006",
    shopName: "Gupta Electronics",
    ownerName: "Anjali Gupta",
    ownerPhone: "+91 43210 98765",
    ownerEmail: "anjali.gupta@gmail.com",
    address: "987 Vasant Vihar, Phase 1",
    area: "Vasant Vihar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600057",
    status: "active",
    registrationDate: "2024-01-10",
    totalOrders: 28,
    totalSpent: 72000,
    notes: "Regular customer, good payment history"
  },
  {
    id: "#CUST007",
    shopName: "Iyer Mobile World",
    ownerName: "Suresh Iyer",
    ownerPhone: "+91 32109 87654",
    ownerEmail: "suresh.iyer@hotmail.com",
    address: "147 Juhu Tara Road, Near Beach",
    area: "Juhu",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400049",
    status: "active",
    registrationDate: "2024-01-09",
    totalOrders: 89,
    totalSpent: 245000,
    notes: "Top performing customer, referral source"
  },
  {
    id: "#CUST008",
    shopName: "Nair Tech Store",
    ownerName: "Meera Nair",
    ownerPhone: "+91 21098 76543",
    ownerEmail: "meera.nair@gmail.com",
    address: "258 Indiranagar, 100 Feet Road",
    area: "Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560038",
    status: "inactive",
    registrationDate: "2024-01-08",
    totalOrders: 12,
    totalSpent: 28000,
    notes: "Account suspended due to payment issues"
  }
];

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

  const itemsPerPage = 5;

  // Get unique areas and cities for filters
  const availableAreas = useMemo(() => {
    const areas = [...new Set(mockCustomers.map(customer => customer.area))];
    return areas.sort();
  }, []);

  const availableCities = useMemo(() => {
    const cities = [...new Set(mockCustomers.map(customer => customer.city))];
    return cities.sort();
  }, []);

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = mockCustomers.filter(customer => {
      const matchesSearch = customer.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.ownerPhone.includes(searchTerm) ||
                           customer.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(customer.status);
      const matchesArea = areaFilter.length === 0 || areaFilter.includes(customer.area);
      const matchesCity = cityFilter.length === 0 || cityFilter.includes(customer.city);
      
      return matchesSearch && matchesStatus && matchesArea && matchesCity;
    });

    filtered.sort((a, b) => {
      let aValue: string | Date | number;
      let bValue: string | Date | number;

      switch (sortBy) {
        case "shopName":
          aValue = a.shopName.toLowerCase();
          bValue = b.shopName.toLowerCase();
          break;
        case "ownerName":
          aValue = a.ownerName.toLowerCase();
          bValue = b.ownerName.toLowerCase();
          break;
        case "registrationDate":
          aValue = new Date(a.registrationDate);
          bValue = new Date(b.registrationDate);
          break;
        case "totalOrders":
          aValue = a.totalOrders;
          bValue = b.totalOrders;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, areaFilter, cityFilter, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredAndSortedCustomers.slice(startIndex, endIndex);

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
      // Remove the customer from the mock data
      const customerIndex = mockCustomers.findIndex(customer => customer.id === customerToDelete.id);
      if (customerIndex !== -1) {
        mockCustomers.splice(customerIndex, 1);
        // Force re-render by updating a state
        setCurrentPage(currentPage);
      }
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
    const newCustomer: Customer = {
      id: `#CUST${String(mockCustomers.length + 1).padStart(3, '0')}`,
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
      registrationDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      notes: formData.notes
    };

    mockCustomers.unshift(newCustomer); // Add to beginning of array
    setIsCreateModalOpen(false);
  };

  return (
    <AdminLayout>
      {/* Header with Create Button */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold leading-tight text-[#1F1F1F]">
          Customers
        </h1>
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
      />

      {/* Results Summary */}
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-[#666666]">
          Showing {filteredAndSortedCustomers.length} of {mockCustomers.length} customers
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <CustomersTable
          customers={paginatedCustomers}
          onCustomerClick={handleCustomerClick}
          onDeleteClick={handleDeleteClick}
          statusColors={statusColors}
          statusLabels={statusLabels}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredAndSortedCustomers.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Create Customer Modal */}
      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCustomer}
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
    </AdminLayout>
  );
}
