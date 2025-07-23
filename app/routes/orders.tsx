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
import { 
  useOrders, 
  useCreateOrder, 
  useDeleteOrder 
} from "~/hooks/useOrders";
import { useCustomers } from "~/hooks/useCustomers";
import { useProducts } from "~/hooks/useProducts";
import { useCompanies } from "~/hooks/useCompanies";
import { useCategories } from "~/hooks/useCategories";
import type { OrderQueryParams, ProductQueryParams } from "../../api-types";

// Remove mock data - will be fetched from API

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

  // API hooks
  const createOrderMutation = useCreateOrder();
  const deleteOrderMutation = useDeleteOrder();
  const { data: customersData } = useCustomers({ limit: 100 }); // Get customers for order creation
  
  // Get products, companies, and categories for order creation
  const { data: productsData } = useProducts({ limit: 100 }); // Get products for order creation
  const { data: companiesData } = useCompanies(); // Get companies
  const { data: categoriesData } = useCategories(); // Get categories

  // Build query parameters for API
  const queryParams: OrderQueryParams = useMemo(() => {
    const params: OrderQueryParams = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy,
      sortOrder,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (statusFilter.length > 0) {
      params.status = statusFilter[0] as "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    }

    if (dateFilter && dateFilter !== "all") {
      params.dateFilter = dateFilter as "today" | "yesterday" | "last7days" | "last30days" | "custom";
    }

    if (customStartDate) {
      params.startDate = customStartDate;
    }

    if (customEndDate) {
      params.endDate = customEndDate;
    }

    return params;
  }, [currentPage, searchTerm, statusFilter, dateFilter, customStartDate, customEndDate, sortBy, sortOrder]);

  // Fetch orders data
  const { data: ordersData, isLoading, error } = useOrders(queryParams);

  // Get orders data from API
  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination;

  // Loading and error states
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9869E0] mx-auto mb-4"></div>
            <p className="text-[#666666]">Loading orders...</p>
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
            <p className="text-red-600 mb-4">Error loading orders</p>
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
      deleteOrderMutation.mutate(orderToDelete.id);
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
    // Find the selected customer
    const selectedCustomer = customersData?.customers?.find(c => c.id === formData.customerId);
    
    if (!selectedCustomer) {
      console.error('Selected customer not found');
      return;
    }

    createOrderMutation.mutate({
      customerId: formData.customerId,
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      status: formData.status,
      orderItems: formData.orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity || 0,
        boxes: item.boxes,
        pieces: item.pieces,
        pack: item.pack
      })),
      shippingMethod: formData.shippingMethod,
      notes: formData.notes
    });
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
          Showing {orders.length} of {pagination?.totalItems || 0} orders
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <OrdersTable
          orders={orders}
          onOrderClick={handleOrderClick}
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

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveOrder}
        customers={customersData?.customers || []}
        products={productsData?.products || []}
        companies={companiesData || []}
        categories={categoriesData || []}
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
