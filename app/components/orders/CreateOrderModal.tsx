import { useState, useEffect, useMemo } from "react";
import type { OrderItem, CreateFormData } from "~/types/orders";
import type { Customer } from "~/types/customers";

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

interface ProductVariant {
  id: string;
  name: string;
  mrp: number;
}

interface Company {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CreateFormData) => void;
  customers: Customer[];
  products: Product[];
  companies: Company[];
  categories: Category[];
}

const CreateOrderModal = ({
  isOpen,
  onClose,
  onSave,
  customers,
  products,
  companies,
  categories,
}: CreateOrderModalProps) => {
  const [formData, setFormData] = useState<CreateFormData>({
    customerId: "",
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    customerPhone: "",
    status: "pending",
    orderItems: [],
    notes: "",
  });

  // Search states
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [orderItemsVariant, setOrderItemsVariant] = useState<
    "cards" | "table" | "compact"
  >("cards");

  // Filtered customers and products based on search
  const filteredCustomers = useMemo(() => {
    if (!customerSearchTerm.trim()) return customers.slice(0, 10); // Show first 10 if no search
    return customers
      .filter(
        (customer) =>
          customer.shopName
            .toLowerCase()
            .includes(customerSearchTerm.toLowerCase()) ||
          customer.ownerName
            .toLowerCase()
            .includes(customerSearchTerm.toLowerCase()) ||
          customer.ownerPhone.includes(customerSearchTerm)
      )
      .slice(0, 10); // Limit to 10 results
  }, [customers, customerSearchTerm]);

  const filteredProducts = useMemo(() => {
    if (!productSearchTerm.trim()) return products.slice(0, 10); // Show first 10 if no search
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
      )
      .slice(0, 10); // Limit to 10 results
  }, [products, productSearchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".customer-search") &&
        !target.closest(".product-search")
      ) {
        setShowCustomerSuggestions(false);
        setShowProductSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const getCompanyName = (companyId: string) => {
    return companies.find((company) => company.id === companyId)?.name || "";
  };

  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((category) => category.id === categoryId)?.name || ""
    );
  };

  const handleCustomerSelect = (customer: Customer) => {
    setFormData({
      ...formData,
      customerId: customer.id,
      customerName: customer.shopName,
      customerAddress: `${customer.address}, ${customer.area}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
      customerEmail: customer.ownerEmail,
      customerPhone: customer.ownerPhone,
    });
    setCustomerSearchTerm(customer.shopName);
    setShowCustomerSuggestions(false);
  };

  const handleProductSelect = (product: Product, variant: ProductVariant) => {
    // Check if product variant already exists in order items
    const existingItemIndex = formData.orderItems.findIndex(
      (item) => item.productId === product.id && item.variantId === variant.id
    );

    if (existingItemIndex !== -1) {
      // If product already exists, increment pieces or pack based on availability
      const updatedItems = [...formData.orderItems];
      const existingItem = updatedItems[existingItemIndex];

      if (existingItem.availableInPieces && existingItem.pieces) {
        existingItem.pieces += 1;
      } else if (existingItem.availableInPack && existingItem.pack) {
        existingItem.pack += 1;
      }

      setFormData({
        ...formData,
        orderItems: updatedItems,
      });
    } else {
      // Add new product to order items
      const newItem: OrderItem = {
        id: Date.now().toString(),
        name: `${product.name} - ${variant.name} - ₹${variant.mrp}`,
        boxes: 0,
        productId: product.id,
        variantId: variant.id,
        availableInPieces: product.availableInPieces,
        availableInPack: product.availableInPack,
        packSize: product.packSize,
        pieces: product.availableInPieces ? 0 : undefined,
        pack: product.availableInPack ? 0 : undefined,
      };

      setFormData({
        ...formData,
        orderItems: [...formData.orderItems, newItem],
      });
    }

    setProductSearchTerm("");
    setShowProductSuggestions(false);
  };

  const handleRemoveOrderItem = (itemId: string) => {
    setFormData({
      ...formData,
      orderItems: formData.orderItems.filter((item) => item.id !== itemId),
    });
  };

  const handleOrderItemChange = (
    itemId: string,
    field: "boxes" | "pieces" | "pack",
    value: number
  ) => {
    setFormData({
      ...formData,
      orderItems: formData.orderItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleSave = () => {
    // Validate that at least one item has valid values
    const hasValidItems = formData.orderItems.every((item) => {
      const boxesValue = item.boxes || 0;
      const piecesValue = item.pieces || 0;
      const packValue = item.pack || 0;

      // At least one field must have a value greater than 0
      const hasAnyValue = boxesValue > 0 || piecesValue > 0 || packValue > 0;

      return hasAnyValue;
    });

    if (
      !formData.customerName ||
      !formData.customerAddress ||
      formData.orderItems.length === 0 ||
      !hasValidItems
    ) {
      return;
    }
    onSave(formData);
    // Reset form
    setFormData({
      customerId: "",
      customerName: "",
      customerAddress: "",
      customerEmail: "",
      customerPhone: "",
      status: "pending",
      orderItems: [],
      notes: "",
    });
    setCustomerSearchTerm("");
    setProductSearchTerm("");
    setShowCustomerSuggestions(false);
    setShowProductSuggestions(false);
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
          <div>
            <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">
              Customer Information
            </h3>
            <div className="space-y-4">
              {/* Customer Search */}
              <div className="relative customer-search">
                <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                  Search Customer *
                </label>
                <input
                  type="text"
                  value={customerSearchTerm}
                  onChange={(e) => {
                    setCustomerSearchTerm(e.target.value);
                    setShowCustomerSuggestions(true);
                  }}
                  onFocus={() => setShowCustomerSuggestions(true)}
                  className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                  placeholder="Search by shop name, owner name, or phone..."
                />

                {/* Customer Suggestions */}
                {showCustomerSuggestions && filteredCustomers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#DDDDDD] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => handleCustomerSelect(customer)}
                        className="px-3 py-2 hover:bg-[#F7F3FF] cursor-pointer border-b border-[#DDDDDD] last:border-b-0"
                      >
                        <div className="font-medium text-[#1F1F1F]">
                          {customer.shopName}
                        </div>
                        <div className="text-sm text-[#666666]">
                          {customer.ownerName} • {customer.ownerPhone}
                        </div>
                        <div className="text-xs text-[#666666]">
                          {customer.area}, {customer.city}, {customer.state}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Customer Details */}
              {formData.customerId && (
                <div className="bg-[#F7F3FF] p-3 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium text-[#1F1F1F]">
                      {formData.customerName}
                    </div>
                    <div className="text-[#666666]">
                      {formData.customerAddress}
                    </div>
                    <div className="text-[#666666]">
                      {formData.customerEmail} • {formData.customerPhone}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
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
                      setFormData({
                        ...formData,
                        customerPhone: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Status */}
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

          {/* Product Search and Selection */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] mb-3 sm:mb-4">
              Product Selection
            </h3>
            <div className="space-y-4">
              {/* Product Search */}
              <div className="relative product-search">
                <label className="block text-sm font-medium text-[#1F1F1F] mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  value={productSearchTerm}
                  onChange={(e) => {
                    setProductSearchTerm(e.target.value);
                    setShowProductSuggestions(true);
                  }}
                  onFocus={() => setShowProductSuggestions(true)}
                  className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] placeholder-[#666666] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                  placeholder="Search products by name..."
                />

                {/* Product Suggestions */}
                {showProductSuggestions && filteredProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#DDDDDD] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="border-b border-[#DDDDDD] last:border-b-0"
                      >
                        <div className="px-3 py-2 font-medium text-[#1F1F1F] bg-[#F7F3FF]">
                          {product.name} - {getCompanyName(product.companyId)} -{" "}
                          {getCategoryName(product.categoryId)}
                        </div>
                        {product.variants.map((variant) => (
                          <div
                            key={variant.id}
                            onClick={() =>
                              handleProductSelect(product, variant)
                            }
                            className="px-3 py-2 hover:bg-[#F7F3FF] cursor-pointer border-t border-[#DDDDDD]"
                          >
                            <div className="text-sm text-[#1F1F1F]">
                              {variant.name}
                            </div>
                            <div className="text-xs text-[#666666]">
                              ₹{variant.mrp}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-[#1F1F1F]">
                Order Items{" "}
                {formData.orderItems.length > 0 &&
                  `(${formData.orderItems.length})`}
              </label>

              {/* UI Variant Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#666666]">View:</span>
                <div className="flex bg-[#F7F3FF] rounded-lg p-1">
                  <button
                    onClick={() => setOrderItemsVariant("cards")}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      orderItemsVariant === "cards"
                        ? "bg-[#9869E0] text-white"
                        : "text-[#666666] hover:text-[#1F1F1F]"
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setOrderItemsVariant("table")}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      orderItemsVariant === "table"
                        ? "bg-[#9869E0] text-white"
                        : "text-[#666666] hover:text-[#1F1F1F]"
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setOrderItemsVariant("compact")}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      orderItemsVariant === "compact"
                        ? "bg-[#9869E0] text-white"
                        : "text-[#666666] hover:text-[#1F1F1F]"
                    }`}
                  >
                    Compact
                  </button>
                </div>
              </div>
            </div>

            {formData.orderItems.length === 0 ? (
              <div className="text-center py-8 text-[#666666] border-2 border-dashed border-[#DDDDDD] rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-2"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <p>
                  No items added yet. Search and select products above to add
                  them to your order.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.orderItems.map((item, index) => {
                  // Cards Variant
                  if (orderItemsVariant === "cards") {
                    return (
                      <div
                        key={item.id}
                        className="bg-[#F7F3FF] p-4 rounded-lg border border-[#DDDDDD]"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-medium text-[#1F1F1F] text-sm">
                              {item.name}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOrderItem(item.id)}
                            className="rounded-lg p-1 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
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
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-[#666666] mb-1">
                              Number of Boxes
                            </label>
                            <input
                              type="number"
                              value={item.boxes}
                              onChange={(e) =>
                                handleOrderItemChange(
                                  item.id,
                                  "boxes",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                              min="0"
                            />
                          </div>

                          {item.availableInPieces && (
                            <div>
                              <label className="block text-xs font-medium text-[#666666] mb-1">
                                Number of Pieces
                              </label>
                              <input
                                type="number"
                                value={item.pieces || 0}
                                onChange={(e) =>
                                  handleOrderItemChange(
                                    item.id,
                                    "pieces",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                                min="0"
                              />
                            </div>
                          )}
                          {item.availableInPack && (
                            <div>
                              <label className="block text-xs font-medium text-[#666666] mb-1">
                                Number of Pack{" "}
                                {item.packSize &&
                                  `(${item.packSize} pieces per pack)`}
                              </label>
                              <input
                                type="number"
                                value={item.pack || 0}
                                onChange={(e) =>
                                  handleOrderItemChange(
                                    item.id,
                                    "pack",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                                min="0"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Table Variant
                  if (orderItemsVariant === "table") {
                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-[#DDDDDD] rounded-lg overflow-hidden"
                      >
                        <div className="p-3 border-b border-[#DDDDDD] bg-[#F7F3FF]">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-[#1F1F1F] text-sm">
                              {item.name}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveOrderItem(item.id)}
                              className="rounded-lg p-1 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
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
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="p-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#666666] mb-1">
                                Boxes
                              </label>
                              <input
                                type="number"
                                value={item.boxes}
                                onChange={(e) =>
                                  handleOrderItemChange(
                                    item.id,
                                    "boxes",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                                min="0"
                              />
                            </div>

                            {item.availableInPieces && (
                              <div>
                                <label className="block text-xs font-medium text-[#666666] mb-1">
                                  Pieces
                                </label>
                                <input
                                  type="number"
                                  value={item.pieces || 0}
                                  onChange={(e) =>
                                    handleOrderItemChange(
                                      item.id,
                                      "pieces",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                                  min="0"
                                />
                              </div>
                            )}

                            {item.availableInPack && (
                              <div>
                                <label className="block text-xs font-medium text-[#666666] mb-1">
                                  Pack {item.packSize && `(${item.packSize})`}
                                </label>
                                <input
                                  type="number"
                                  value={item.pack || 0}
                                  onChange={(e) =>
                                    handleOrderItemChange(
                                      item.id,
                                      "pack",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none focus:ring-2 focus:ring-[#9869E0]/20"
                                  min="0"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Compact Variant
                  if (orderItemsVariant === "compact") {
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-[#F7F3FF] rounded-lg border border-[#DDDDDD]"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[#1F1F1F] text-sm truncate">
                            {item.name}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-[#666666]">B:</span>
                            <input
                              type="number"
                              value={item.boxes}
                              onChange={(e) =>
                                handleOrderItemChange(
                                  item.id,
                                  "boxes",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 rounded border border-[#DDDDDD] bg-white px-2 py-1 text-xs text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none"
                              min="0"
                            />
                          </div>

                          {item.availableInPieces && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-[#666666]">P:</span>
                              <input
                                type="number"
                                value={item.pieces || 0}
                                onChange={(e) =>
                                  handleOrderItemChange(
                                    item.id,
                                    "pieces",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-16 rounded border border-[#DDDDDD] bg-white px-2 py-1 text-xs text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none"
                                min="0"
                              />
                            </div>
                          )}

                          {item.availableInPack && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-[#666666]">
                                PK:
                              </span>
                              <input
                                type="number"
                                value={item.pack || 0}
                                onChange={(e) =>
                                  handleOrderItemChange(
                                    item.id,
                                    "pack",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-16 rounded border border-[#DDDDDD] bg-white px-2 py-1 text-xs text-[#1F1F1F] focus:border-[#9869E0] focus:outline-none"
                                min="0"
                              />
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveOrderItem(item.id)}
                            className="rounded p-1 text-[#666666] hover:bg-red-100 hover:text-red-600 focus:outline-none"
                            aria-label="Remove item"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
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
                    );
                  }

                  return null;
                })}
              </div>
            )}
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
              disabled={
                !formData.customerName ||
                !formData.customerAddress ||
                formData.orderItems.length === 0
              }
              className="px-4 py-2 bg-[#9869E0] text-white rounded-lg hover:bg-[#7B40CC] transition-colors disabled:bg-[#DDDDDD] disabled:text-[#666666] disabled:cursor-not-allowed"
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
