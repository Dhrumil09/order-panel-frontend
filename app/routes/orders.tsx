import { useState, useMemo, useEffect } from "react";
import AdminLayout from "~/components/AdminLayout";
import { createPageMeta } from "~/utils/meta";
import OrderDetailsModal from "~/components/orders/OrderDetailsModal";
import DeleteConfirmationModal from "~/components/orders/DeleteConfirmationModal";
import CreateOrderModal from "~/components/orders/CreateOrderModal";
import OrdersTable from "~/components/orders/OrdersTable";
import OrdersFilters from "~/components/orders/OrdersFilters";
import Pagination from "~/components/orders/Pagination";
import type { Order, CreateFormData } from "~/types/orders";
import { statusColors, statusLabels } from "~/types/orders";

export function meta() {
  return createPageMeta("Orders", "Manage orders.");
}



const mockOrders: Order[] = [
  {
    id: "#ORD001",
    customerName: "Rajesh Kumar",
    customerAddress: "123 MG Road, Koramangala, Bangalore, Karnataka 560034",
    status: "shipped",
    date: "2024-01-15",
    items: 3,
    customerEmail: "rajesh.kumar@gmail.com",
    customerPhone: "+91 98765 43210",
    orderItems: [
      { id: "1", name: "Wireless Headphones", quantity: 1 },
      { id: "2", name: "Phone Case", quantity: 2 }
    ],
    shippingMethod: "Express Delivery",
    trackingNumber: "DTDC123456789",
    notes: "Customer requested signature confirmation"
  },
  {
    id: "#ORD002",
    customerName: "Priya Sharma",
    customerAddress: "456 Andheri West, Mumbai, Maharashtra 400058",
    status: "processing",
    date: "2024-01-14",
    items: 2,
    customerEmail: "priya.sharma@yahoo.com",
    customerPhone: "+91 87654 32109",
    orderItems: [
      { id: "3", name: "Laptop Stand", quantity: 1 },
      { id: "4", name: "USB Cable", quantity: 1 }
    ],
    shippingMethod: "Free Delivery",
    notes: "Gift order - please include gift receipt"
  },
  {
    id: "#ORD003",
    customerName: "Amit Patel",
    customerAddress: "789 Connaught Place, New Delhi, Delhi 110001",
    status: "delivered",
    date: "2024-01-13",
    items: 5,
    customerEmail: "amit.patel@hotmail.com",
    customerPhone: "+91 76543 21098",
    orderItems: [
      { id: "5", name: "Smart Watch", quantity: 1 },
      { id: "6", name: "Screen Protector", quantity: 2 },
      { id: "7", name: "Charging Cable", quantity: 2 }
    ],
    shippingMethod: "Standard Delivery",
    trackingNumber: "BLUEDART987654321",
    notes: "Delivered successfully on 2024-01-15"
  },
  {
    id: "#ORD004",
    customerName: "Neha Singh",
    customerAddress: "321 Salt Lake City, Kolkata, West Bengal 700091",
    status: "shipped",
    date: "2024-01-12",
    items: 4,
    customerEmail: "neha.singh@gmail.com",
    customerPhone: "+91 65432 10987",
    orderItems: [
      { id: "8", name: "Bluetooth Speaker", quantity: 1 },
      { id: "9", name: "Phone Mount", quantity: 1 },
      { id: "10", name: "Power Bank", quantity: 2 }
    ],
    shippingMethod: "Express Delivery",
    trackingNumber: "FEDEX456789123",
    notes: "Customer prefers afternoon delivery"
  },
  {
    id: "#ORD005",
    customerName: "Vikram Reddy",
    customerAddress: "654 Banjara Hills, Hyderabad, Telangana 500034",
    status: "processing",
    date: "2024-01-11",
    items: 2,
    customerEmail: "vikram.reddy@yahoo.com",
    customerPhone: "+91 54321 09876",
    orderItems: [
      { id: "11", name: "Wireless Mouse", quantity: 1 },
      { id: "12", name: "Mouse Pad", quantity: 1 }
    ],
    shippingMethod: "Free Delivery",
    notes: "Standard processing time"
  },
  {
    id: "#ORD006",
    customerName: "Anjali Gupta",
    customerAddress: "987 Vasant Vihar, Chennai, Tamil Nadu 600057",
    status: "pending",
    date: "2024-01-10",
    items: 1,
    customerEmail: "anjali.gupta@gmail.com",
    customerPhone: "+91 43210 98765",
    orderItems: [
      { id: "13", name: "Keyboard", quantity: 1 }
    ],
    shippingMethod: "Standard Delivery",
    notes: "Awaiting payment confirmation"
  },
  {
    id: "#ORD007",
    customerName: "Suresh Iyer",
    customerAddress: "147 Juhu Tara Road, Mumbai, Maharashtra 400049",
    status: "delivered",
    date: "2024-01-09",
    items: 6,
    customerEmail: "suresh.iyer@hotmail.com",
    customerPhone: "+91 32109 87654",
    orderItems: [
      { id: "14", name: "Gaming Headset", quantity: 1 },
      { id: "15", name: "Gaming Mouse", quantity: 1 },
      { id: "16", name: "Mouse Feet", quantity: 2 },
      { id: "17", name: "Cable Clips", quantity: 2 }
    ],
    shippingMethod: "Free Delivery",
    trackingNumber: "DHL321654987",
    notes: "Delivered on 2024-01-12"
  },
  {
    id: "#ORD008",
    customerName: "Meera Nair",
    customerAddress: "258 Indiranagar, Bangalore, Karnataka 560038",
    status: "cancelled",
    date: "2024-01-08",
    items: 1,
    customerEmail: "meera.nair@gmail.com",
    customerPhone: "+91 21098 76543",
    orderItems: [
      { id: "18", name: "Webcam", quantity: 1 }
    ],
    shippingMethod: "Standard Delivery",
    notes: "Cancelled by customer on 2024-01-09"
  }
];





export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"customerName" | "date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const itemsPerPage = 5;

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = mockOrders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(order.status);
      
      // Date filtering logic
      const orderDate = new Date(order.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      let matchesDate = true;
      
      // Handle custom date range
      if (dateFilter === "custom" && customStartDate && customEndDate) {
        const startDate = new Date(customStartDate);
        const endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59); // Include the entire end date
        matchesDate = orderDate >= startDate && orderDate <= endDate;
      } else {
        switch (dateFilter) {
          case "today":
            matchesDate = orderDate.toDateString() === today.toDateString();
            break;
          case "yesterday":
            matchesDate = orderDate.toDateString() === yesterday.toDateString();
            break;
          case "last7days":
            matchesDate = orderDate >= lastWeek;
            break;
          case "last30days":
            matchesDate = orderDate >= lastMonth;
            break;
          case "all":
          default:
            matchesDate = true;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case "customerName":
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
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
  }, [searchTerm, statusFilter, sortBy, sortOrder, dateFilter, customStartDate, customEndDate]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredAndSortedOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, customStartDate, customEndDate, sortBy, sortOrder]);

  const handleSort = (field: "customerName" | "date" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setDateFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter.length > 0,
    dateFilter !== "all",
    customStartDate,
    customEndDate
  ].filter(Boolean).length;

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return (
      <svg
        className={`w-4 h-4 ml-1 ${sortOrder === "asc" ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteClick = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      // Remove the order from the mock data
      const orderIndex = mockOrders.findIndex(order => order.id === orderToDelete.id);
      if (orderIndex !== -1) {
        mockOrders.splice(orderIndex, 1);
        // Force re-render by updating a state
        setCurrentPage(currentPage);
      }
    }
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const handleCreateOrder = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveOrder = (formData: CreateFormData) => {
    const newOrder: Order = {
      id: `#ORD${String(mockOrders.length + 1).padStart(3, '0')}`,
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      status: formData.status,
      date: new Date().toISOString().split('T')[0],
      items: formData.orderItems.reduce((sum: number, item) => sum + item.quantity, 0),
      orderItems: formData.orderItems,
      notes: formData.notes
    };

    mockOrders.unshift(newOrder); // Add to beginning of array
    setIsCreateModalOpen(false);
  };



  return (
    <AdminLayout>
      {/* Header with Create Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-[32px] font-bold leading-tight text-[#1F1F1F]">
          Orders
        </h1>
        <button
          onClick={handleCreateOrder}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9869E0] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7B40CC] focus:outline-none focus:ring-2 focus:ring-[#9869E0] focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
          Create Order
        </button>
      </div>

      <OrdersFilters
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
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearAllFilters={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
        statusColors={statusColors}
        statusLabels={statusLabels}
      />

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[#666666]">
          Showing {filteredAndSortedOrders.length} of {mockOrders.length} orders
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <OrdersTable
          orders={paginatedOrders}
          onOrderClick={handleOrderClick}
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
          totalItems={filteredAndSortedOrders.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveOrder}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        order={orderToDelete}
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
