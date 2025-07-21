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
import type { Customer } from "~/types/customers";

// Mock customer data for order creation
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
    notes: "Premium customer, prefers express delivery",
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
    notes: "Bulk order customer",
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
    notes: "Temporarily closed for renovation",
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
    notes: "High-value customer, VIP treatment",
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
    notes: "New registration, awaiting verification",
  },
];

// Mock product data for order creation
interface ProductVariant {
  id: string;
  name: string;
  mrp: number;
}

interface Product {
  id: string;
  name: string;
  companyId: string;
  categoryId: string;
  variants: ProductVariant[];
  isOutOfStock: boolean;
  availableInPieces: boolean;
  availableInPack: boolean;
  packSize?: number;
}

interface Company {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Coffee Beans",
    companyId: "1",
    categoryId: "1",
    variants: [
      { id: "1", name: "250g", mrp: 299 },
      { id: "2", name: "500g", mrp: 499 },
    ],
    isOutOfStock: false,
    availableInPieces: true,
    availableInPack: true,
    packSize: 12,
  },
  {
    id: "2",
    name: "Organic Green Tea",
    companyId: "2",
    categoryId: "2",
    variants: [{ id: "1", name: "100g", mrp: 199 }],
    isOutOfStock: true,
    availableInPieces: true,
    availableInPack: false,
  },
  {
    id: "3",
    name: "Wireless Headphones",
    companyId: "3",
    categoryId: "4",
    variants: [
      { id: "1", name: "Basic", mrp: 1299 },
      { id: "2", name: "Premium", mrp: 2499 },
    ],
    isOutOfStock: false,
    availableInPieces: true,
    availableInPack: false,
  },
  {
    id: "4",
    name: "Smart Watch",
    companyId: "4",
    categoryId: "5",
    variants: [
      { id: "1", name: "Sport", mrp: 3999 },
      { id: "2", name: "Premium", mrp: 8999 },
    ],
    isOutOfStock: false,
    availableInPieces: true,
    availableInPack: false,
  },
  {
    id: "5",
    name: "Bluetooth Speaker",
    companyId: "5",
    categoryId: "6",
    variants: [
      { id: "1", name: "Portable", mrp: 899 },
      { id: "2", name: "Home", mrp: 1499 },
    ],
    isOutOfStock: false,
    availableInPieces: true,
    availableInPack: false,
  },
];

const mockCompanies: Company[] = [
  { id: "1", name: "Coffee Co." },
  { id: "2", name: "Healthy Herbs" },
  { id: "3", name: "Tech Gadgets" },
  { id: "4", name: "Smart Wearables" },
  { id: "5", name: "Audio Solutions" },
];

const mockCategories: Category[] = [
  { id: "1", name: "Beverages" },
  { id: "2", name: "Tea & Infusions" },
  { id: "3", name: "Snacks" },
  { id: "4", name: "Audio" },
  { id: "5", name: "Wearables" },
  { id: "6", name: "Speakers" },
];

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
      {
        id: "1",
        name: "Wireless Headphones",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "2",
        name: "Phone Case",
        boxes: 1,
        pieces: 2,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
    ],
    shippingMethod: "Express Delivery",
    trackingNumber: "DTDC123456789",
    notes: "Customer requested signature confirmation",
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
      {
        id: "3",
        name: "Laptop Stand",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "4",
        name: "USB Cable",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
    ],
    shippingMethod: "Free Delivery",
    notes: "Gift order - please include gift receipt",
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
      {
        id: "5",
        name: "Smart Watch",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "6",
        name: "Screen Protector",
        boxes: 1,
        pieces: 2,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "7",
        name: "Charging Cable",
        boxes: 1,
        pieces: 2,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
    ],
    shippingMethod: "Standard Delivery",
    trackingNumber: "BLUEDART987654321",
    notes: "Delivered successfully on 2024-01-15",
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
      {
        id: "8",
        name: "Bluetooth Speaker",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "9",
        name: "Phone Mount",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "10",
        name: "Power Bank",
        boxes: 1,
        pieces: 2,
        pack: 1,
        availableInPieces: true,
        availableInPack: true,
        packSize: 5,
      },
    ],
    shippingMethod: "Express Delivery",
    trackingNumber: "FEDEX456789123",
    notes: "Customer prefers afternoon delivery",
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
      {
        id: "11",
        name: "Wireless Mouse",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "12",
        name: "Mouse Pad",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
    ],
    shippingMethod: "Free Delivery",
    notes: "Standard processing time",
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
      {
        id: "13",
        name: "Keyboard",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
    ],
    shippingMethod: "Standard Delivery",
    notes: "Awaiting payment confirmation",
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
      {
        id: "14",
        name: "Gaming Headset",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "15",
        name: "Gaming Mouse",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "16",
        name: "Mouse Feet",
        boxes: 1,
        pieces: 2,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
      {
        id: "17",
        name: "Cable Clips",
        boxes: 1,
        pieces: 2,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
    ],
    shippingMethod: "Free Delivery",
    trackingNumber: "DHL321654987",
    notes: "Delivered on 2024-01-12",
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
      {
        id: "18",
        name: "Webcam",
        boxes: 1,
        pieces: 1,
        pack: undefined,
        availableInPieces: true,
        availableInPack: false,
      },
    ],
    shippingMethod: "Standard Delivery",
    notes: "Cancelled by customer on 2024-01-09",
  },
];

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"customerName" | "date" | "status">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const itemsPerPage = 5;

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = mockOrders.filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerAddress
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(order.status);

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
  }, [
    searchTerm,
    statusFilter,
    sortBy,
    sortOrder,
    dateFilter,
    customStartDate,
    customEndDate,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredAndSortedOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    dateFilter,
    customStartDate,
    customEndDate,
    sortBy,
    sortOrder,
  ]);

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
    customEndDate,
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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
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
      const orderIndex = mockOrders.findIndex(
        (order) => order.id === orderToDelete.id
      );
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
      id: `#ORD${String(mockOrders.length + 1).padStart(3, "0")}`,
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      status: formData.status,
      date: new Date().toISOString().split("T")[0],
      items: formData.orderItems.reduce((sum: number, item) => {
        const piecesTotal = item.pieces || 0;
        const packTotal = (item.pack || 0) * (item.packSize || 1);
        return sum + piecesTotal + packTotal;
      }, 0),
      orderItems: formData.orderItems.map((item) => ({
        id: item.id,
        name: item.name,
        boxes: item.boxes,
        pieces: item.pieces,
        pack: item.pack,
        productId: item.productId,
        variantId: item.variantId,
        availableInPieces: item.availableInPieces,
        availableInPack: item.availableInPack,
        packSize: item.packSize,
      })),
      notes: formData.notes,
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
            setStatusFilter(statusFilter.filter((s) => s !== status));
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
        customers={mockCustomers}
        products={mockProducts}
        companies={mockCompanies}
        categories={mockCategories}
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
