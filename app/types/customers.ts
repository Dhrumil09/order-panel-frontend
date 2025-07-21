export interface Customer {
  id: string;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  status: "active" | "inactive" | "pending";
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  notes?: string;
}

export interface CreateCustomerFormData {
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  status: Customer['status'];
  notes: string;
}

export const statusColors = {
  active: "bg-[#4BB543] text-white",
  inactive: "bg-[#E74C3C] text-white",
  pending: "bg-[#FFB946] text-white"
} as const;

export const statusLabels = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending"
} as const; 