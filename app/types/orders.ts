export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerAddress: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
  customerEmail?: string;
  customerPhone?: string;
  orderItems?: OrderItem[];
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface CreateFormData {
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone: string;
  status: Order['status'];
  orderItems: OrderItem[];
  notes: string;
}

export const statusColors = {
  pending: "bg-[#FFB946] text-white",
  processing: "bg-[#4D8BF5] text-white",
  shipped: "bg-[#9869E0] text-white",
  delivered: "bg-[#4BB543] text-white",
  cancelled: "bg-[#E74C3C] text-white"
} as const;

export const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled"
} as const; 